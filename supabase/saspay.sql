-- 1) Profiles table: stores user plan and renewal date
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  plan text not null default 'free' check (plan in ('free', 'pro')),
  pro_until timestamptz,
  updated_at timestamptz not null default now()
);

-- 2) Payments table: our local payment ledger
create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  plan text not null default 'pro' check (plan in ('free', 'pro')),
  amount numeric(12,2) not null default 0,
  currency text not null default 'XOF',
  status text not null default 'pending' check (status in ('pending', 'paid', 'failed', 'cancelled', 'expired')),
  provider text not null default 'saspay',
  provider_checkout_id text,
  provider_payment_id text,
  provider_reference text,
  provider_event text,
  checkout_url text,
  return_url text,
  cancel_url text,
  pro_until timestamptz,
  paid_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_profiles_plan on public.profiles(plan);
create index if not exists idx_payments_user_status on public.payments(user_id, status);
create index if not exists idx_payments_provider_payment_id on public.payments(provider_payment_id);
create index if not exists idx_payments_provider_checkout_id on public.payments(provider_checkout_id);

-- 3) Helper: create a profile row on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, plan, pro_until, updated_at)
  values (new.id, 'free', null, now())
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

-- 4) RLS
alter table public.profiles enable row level security;
alter table public.payments enable row level security;

-- Users can read/update only their own profile, but never update plan from the frontend
create policy "profiles_select_own" on public.profiles
for select
using (auth.uid() = id);

create policy "profiles_insert_own" on public.profiles
for insert
with check (auth.uid() = id);

create policy "profiles_update_service_only" on public.profiles
for update
using (auth.role() = 'service_role')
with check (auth.role() = 'service_role');

create policy "payments_select_own" on public.payments
for select
using (auth.uid() = user_id);

create policy "payments_insert_own" on public.payments
for insert
with check (auth.uid() = user_id);

create policy "payments_update_service_only" on public.payments
for update
using (auth.role() = 'service_role')
with check (auth.role() = 'service_role');

-- Service role can do everything
create policy "profiles_service_all" on public.profiles
for all
using (auth.role() = 'service_role')
with check (auth.role() = 'service_role');

create policy "payments_service_all" on public.payments
for all
using (auth.role() = 'service_role')
with check (auth.role() = 'service_role');

-- Optional: keep plan status valid when a payment is confirmed
create or replace function public.sync_pro_status()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.status = 'paid' then
    update public.profiles
    set plan = 'pro',
        pro_until = coalesce(new.pro_until, now() + interval '30 days'),
        updated_at = now()
    where id = new.user_id;
  elsif new.status in ('failed', 'cancelled', 'expired') then
    update public.profiles
    set plan = 'free',
        pro_until = null,
        updated_at = now()
    where id = new.user_id;
  end if;

  return new;
end;
$$;

drop trigger if exists on_payment_status_change on public.payments;
create trigger on_payment_status_change
after update on public.payments
for each row
when (old.status is distinct from new.status)
execute procedure public.sync_pro_status();
