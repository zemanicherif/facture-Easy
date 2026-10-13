'use client';

import Link from 'next/link';
import { Suspense, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const payment = searchParams.get('payment');

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const target = payment === 'success' ? '/dashboard?payment=success' : '/dashboard';
      window.location.href = target;
    }, 1200);

    return () => window.clearTimeout(timer);
  }, [payment]);

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
          Votre paiement a bien été accepté
        </h1>
        <p className="mt-4 text-sm text-slate-300">
          Vous allez être redirigé vers votre tableau de bord pour finaliser l’accès au plan Pro.
        </p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/dashboard?payment=success"
            className="inline-flex items-center justify-center rounded-xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-400"
          >
            Voir mon tableau de bord
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
