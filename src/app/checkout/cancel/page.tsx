import Link from 'next/link';

export default function CheckoutCancelPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 py-10 text-white">
      <div className="w-full max-w-xl rounded-3xl border border-amber-500/30 bg-slate-900/80 p-8 text-center shadow-2xl shadow-amber-500/10 backdrop-blur">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-500/15 text-3xl ring-1 ring-amber-500/40">
          ⏳
        </div>

        <p className="mt-6 text-xs font-bold uppercase tracking-[0.22em] text-amber-300">
          Paiement annulé
        </p>
        <h1 className="mt-3 text-3xl font-black text-white">
          L’abonnement n’a pas été finalisé
        </h1>
        <p className="mt-4 text-sm text-slate-300">
          Vous pouvez réessayer votre plan ou revenir à la page d’accueil pour comparer les offres.
        </p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/#tarifs"
            className="inline-flex items-center justify-center rounded-xl bg-brand-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-400"
          >
            Revoir les offres
          </Link>
          <Link
            href="/login?mode=signup"
            className="inline-flex items-center justify-center rounded-xl border border-slate-700 bg-slate-800 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:bg-slate-700"
          >
            Créer un compte
          </Link>
        </div>
      </div>
    </main>
  );
}
