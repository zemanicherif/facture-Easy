'use client';

import Link from 'next/link';
import { Suspense, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

const planLabel: Record<string, string> = {
  starter: 'Plan Découverte',
  pro: 'Plan Pro',
  business: 'Plan Business',
};

const paymentMethodLabel: Record<string, string> = {
  stripe: 'Stripe',
  wave: 'Wave',
  'orange-money': 'Orange Money',
  momo: 'MoMo',
  'bank-transfer': 'Virement local',
  card: 'Carte bancaire',
  crypto: 'Crypto',
};

function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const plan = searchParams.get('plan') || 'pro';
  const method = searchParams.get('method') || 'stripe';
  const demo = searchParams.get('demo') === '1';

  useEffect(() => {
    const payload = {
      plan,
      method,
      activatedAt: new Date().toISOString(),
      demo,
    };

    localStorage.setItem('factureeasy_subscription', JSON.stringify(payload));
    localStorage.setItem('factureeasy_account_ready', 'true');

    const timer = window.setTimeout(() => {
      window.location.href = `/login?mode=signup&plan=${plan}`;
    }, 1400);

    return () => window.clearTimeout(timer);
  }, [demo, plan]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 py-10 text-white">
      <div className="w-full max-w-xl rounded-3xl border border-emerald-500/30 bg-slate-900/80 p-8 text-center shadow-2xl shadow-emerald-500/10 backdrop-blur">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/15 text-3xl ring-1 ring-emerald-500/40">
          ✅
        </div>

        <p className="mt-6 text-xs font-bold uppercase tracking-[0.22em] text-emerald-300">
          Paiement validé
        </p>
        <h1 className="mt-3 text-3xl font-black text-white">
          Votre accès {planLabel[plan] || 'Plan Pro'} est activé
        </h1>
        <p className="mt-4 text-sm text-slate-300">
          {demo
            ? `Paiement via ${paymentMethodLabel[method] || 'méthode locale'} activé. Votre accès est préparé et l’ouverture du compte se lance automatiquement.`
            : `Paiement via ${paymentMethodLabel[method] || 'Stripe'} validé. Nous ouvrons votre espace et vous redirigeons vers la création de compte.`}
        </p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href={`/login?mode=signup&plan=${plan}`}
            className="inline-flex items-center justify-center rounded-xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-400"
          >
            Ouvrir mon espace
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-xl border border-slate-700 bg-slate-800 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:bg-slate-700"
          >
            Retour à l’accueil
          </Link>
        </div>
      </div>
    </main>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">Chargement...</div>}>
      <CheckoutSuccessContent />
    </Suspense>
  );
}
