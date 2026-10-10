import { login, signup } from './actions'

export const dynamic = 'force-dynamic';

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; success?: string; mode?: string; plan?: string }>;
}) {
  const params = await searchParams;
  const isSignupMode = params?.mode === 'signup';
  const isLoginMode = params?.mode === 'login';
  const isSuccessMessage = params?.error?.startsWith('Compte créé');
  const selectedPlan = params?.plan ?? 'starter';
  const planLabel =
    selectedPlan === 'pro' ? 'Plan Pro' :
    selectedPlan === 'business' ? 'Plan Business' :
    'Plan Découverte';

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-[#0a1628] to-slate-900 p-4 relative overflow-hidden">
      {/* Orbs de fond */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2.5 mb-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white font-bold flex items-center justify-center text-lg shadow-lg shadow-emerald-500/30">
              ⚡
            </div>
            <span className="font-extrabold text-2xl text-white tracking-tight">
              Facture<span className="text-emerald-400">&apos;Easy</span>
            </span>
          </div>
          <p className="text-slate-400 text-sm">Gestion de facturation pour l&apos;Afrique de l&apos;Ouest</p>
        </div>

        {/* Card */}
        <div className="bg-slate-800/60 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 shadow-2xl">
          <h1 className="text-xl font-bold text-white mb-1">
            {isSignupMode ? 'Créez votre compte' : isLoginMode ? 'Bon retour 👋' : 'Bienvenue 👋'}
          </h1>
          <p className="text-slate-400 text-sm mb-6">
            {isSignupMode
              ? `Démarrez avec le ${planLabel} et créez votre compte.`
              : isLoginMode
                ? 'Connectez-vous pour accéder à votre espace.'
                : 'Connectez-vous ou créez votre compte gratuit'}
          </p>

          {isSignupMode && (
            <div className="mb-5 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
              Offre sélectionnée : <span className="font-bold">{planLabel}</span>
            </div>
          )}

          {/* Message d'erreur / succès */}
          {params?.error && (
            <div className={`mb-5 p-4 rounded-2xl text-sm border ${
              isSuccessMessage
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
            }`}>
              {isSuccessMessage ? '✅ ' : '⚠️ '}
              {params.error}
            </div>
          )}

          <form className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Adresse Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder="vous@exemple.com"
                className="w-full px-4 py-3 rounded-xl text-sm bg-slate-900/60 border border-slate-600/50 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30 transition"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Mot de passe <span className="text-slate-500 font-normal">(6 caractères min.)</span>
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl text-sm bg-slate-900/60 border border-slate-600/50 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30 transition"
              />
            </div>

            {/* Boutons */}
            <div className="pt-2 space-y-3">
              <button
                formAction={login}
                className={`w-full py-3 px-6 rounded-xl text-sm font-bold transition-all duration-200 hover:-translate-y-0.5 ${
                  isSignupMode
                    ? 'text-emerald-300 bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500/20'
                    : 'text-white bg-emerald-500 hover:bg-emerald-400 shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30'
                }`}
              >
                {isSignupMode ? 'Déjà inscrit ? Se connecter' : 'Se connecter'}
              </button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-700" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-slate-800/60 px-3 text-slate-500">ou</span>
                </div>
              </div>

              <button
                formAction={signup}
                className={`w-full py-3 px-6 rounded-xl text-sm font-bold transition-all duration-200 hover:-translate-y-0.5 ${
                  isSignupMode
                    ? 'text-white bg-emerald-500 hover:bg-emerald-400 shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30'
                    : 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500/20'
                }`}
              >
                {isSignupMode ? 'Créer mon compte gratuit' : 'Créer un compte gratuit'}
              </button>
            </div>
          </form>

          {/* Footer */}
          <p className="text-center text-xs text-slate-500 mt-6">
            Devise : FCFA • TVA 18% SYSCOHADA • Sénégal 🇸🇳
          </p>
        </div>
      </div>
    </div>
  )
}
