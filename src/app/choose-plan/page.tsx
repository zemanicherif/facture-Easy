import Link from 'next/link'
import { redirect } from 'next/navigation'

import { createClient } from '@/lib/supabase/server'
import { planCatalog, type SubscriptionPlan } from '@/lib/stripe'

const planCards: Array<{
  key: SubscriptionPlan
  accent: string
  badge: string
  popular?: boolean
  price: string
  description: string
  features: string[]
}> = [
  {
    key: 'starter',
    accent: 'from-emerald-500/15 via-white to-emerald-50',
    badge: 'Essentiel',
    price: '0 FCFA / mois',
    description: 'Idéal pour démarrer et tester votre activité sans pression.',
    features: ['Jusqu’à 5 factures/mois', 'TVA 18% automatique', 'Export PDF simple'],
  },
  {
    key: 'pro',
    accent: 'from-brand-500/20 via-white to-brand-50',
    badge: 'Le plus populaire',
    popular: true,
    price: '5 000 FCFA / mois',
    description: 'Pour les indépendants et PME qui veulent une croissance rapide.',
    features: ['Factures illimitées', 'Relances automatiques', 'Suivi comptable & paiement'],
  },
  {
    key: 'business',
    accent: 'from-violet-500/15 via-white to-violet-50',
    badge: 'Performance',
    price: '15 000 FCFA / mois',
    description: 'Pour les sociétés qui veulent la maîtrise totale de leur activité.',
    features: ['Multi-utilisateurs', 'Multi-entreprises', 'KPI avancés & reporting'],
  },
]

export default async function ChoosePlanPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login?mode=login')
  }

  return (
    <div className="min-h-screen bg-[#f6f3ee] text-slate-900">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute left-[-8rem] top-[-6rem] h-80 w-80 rounded-full bg-emerald-300/20 blur-3xl" />
        <div className="absolute right-[-5rem] top-32 h-96 w-96 rounded-full bg-brand-300/20 blur-3xl" />
        <div className="absolute bottom-[-6rem] left-1/3 h-80 w-80 rounded-full bg-violet-300/20 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto mb-10 max-w-3xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/80 px-4 py-2 text-[10px] font-black uppercase tracking-[0.22em] text-emerald-700 shadow-sm backdrop-blur-sm">
            Étape 2 / 2
          </div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">
            Choisissez votre plan
          </h1>
          <p className="mt-4 text-base text-slate-600 sm:text-lg">
            Votre compte est prêt. Sélectionnez le forfait adapté à votre activité avant d’entrer dans l’espace de gestion.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {planCards.map((plan) => {
            const catalog = planCatalog[plan.key]
            const isPopular = plan.popular
            const isPro = plan.key === 'pro'

            return (
              <div
                key={plan.key}
                className={[
                  'group relative overflow-hidden rounded-[30px] border bg-white p-6 shadow-[0_30px_80px_-40px_rgba(15,23,42,0.35)] transition duration-300 hover:-translate-y-2 hover:shadow-[0_40px_90px_-32px_rgba(15,23,42,0.45)]',
                  isPopular ? 'border-brand-500 ring-2 ring-brand-100' : 'border-slate-200',
                ].join(' ')}
              >
                <div className={`absolute inset-x-0 top-0 h-32 bg-gradient-to-br ${plan.accent}`} />

                <div className="relative z-10">
                  {isPopular && (
                    <div className="mb-4 inline-flex rounded-full bg-brand-500 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-white shadow-lg shadow-brand-500/30">
                      {plan.badge}
                    </div>
                  )}

                  {!isPopular && (
                    <div className="mb-4 inline-flex rounded-full border border-slate-200 bg-white/90 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-slate-600">
                      {plan.badge}
                    </div>
                  )}

                  <div className="mb-6">
                    <h2 className="text-2xl font-black text-slate-900">{catalog.name}</h2>
                    <div className="mt-4 flex items-end gap-2">
                      <span className="text-4xl font-black text-slate-900">{plan.price.split(' /')[0]}</span>
                      <span className="pb-1 text-xs font-bold uppercase tracking-[0.18em] text-slate-500">{plan.price.split('/')[1]?.trim() ?? 'mois'}</span>
                    </div>
                    <p className="mt-4 text-sm leading-6 text-slate-600">{plan.description}</p>
                  </div>

                  <ul className="space-y-3 text-sm text-slate-700">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3">
                        <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                          ✓
                        </span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {isPro ? (
                    <form action="/api/checkout" method="POST" className="mt-8">
                      <input type="hidden" name="plan" value="pro" />
                      <button
                        type="submit"
                        className="inline-flex w-full items-center justify-center rounded-2xl bg-brand-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-brand-500/25 transition duration-200 hover:bg-brand-500"
                      >
                        Passer au Pro
                      </button>
                    </form>
                  ) : (
                    <Link
                      href="/dashboard"
                      className="mt-8 inline-flex w-full items-center justify-center rounded-2xl bg-slate-900 px-5 py-3 text-sm font-bold text-white transition duration-200 hover:bg-slate-800"
                    >
                      Choisir {catalog.name}
                    </Link>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
