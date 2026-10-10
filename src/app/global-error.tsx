'use client';

import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="fr">
      <body className="min-h-screen bg-[#F6F8FA] text-slate-900 antialiased">
        <div className="flex min-h-screen items-center justify-center px-6">
          <div className="max-w-md rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-500">
              Erreur système
            </p>
            <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-900">
              Une erreur est survenue
            </h2>
            <p className="mt-3 text-sm text-slate-600">
              La page a rencontré un problème. Vous pouvez réessayer ou revenir à l’accueil.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <button
                onClick={() => reset()}
                className="inline-flex items-center justify-center rounded-xl bg-brand-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-600"
              >
                Réessayer
              </button>
              <Link
                href="/"
                className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Accueil
              </Link>
            </div>

            {process.env.NODE_ENV === "development" && (
              <pre className="mt-6 overflow-x-auto rounded-xl bg-slate-100 p-3 text-left text-[11px] text-slate-600">
                {error.message}
              </pre>
            )}
          </div>
        </div>
      </body>
    </html>
  );
}
