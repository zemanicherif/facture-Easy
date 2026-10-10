import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F6F8FA] px-6">
      <div className="max-w-md text-center">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-sky-600">404</p>
        <h1 className="mt-4 text-3xl font-black text-slate-900">Page introuvable</h1>
        <p className="mt-3 text-sm text-slate-600">
          La page demandée n’existe pas ou a été déplacée.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex items-center justify-center rounded-xl bg-sky-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-sky-200 transition hover:bg-sky-600"
        >
          Retour à l’accueil
        </Link>
      </div>
    </div>
  );
}
