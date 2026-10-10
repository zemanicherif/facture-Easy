import Link from "next/link";
import { ArrowRight, Bell, CheckCircle2, Clock3, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

const notifications = [
  { title: "Paiement reçu", meta: "Il y a 12 minutes", tone: "green" },
  { title: "Rappel de facture", meta: "Demain à 09:00", tone: "amber" },
  { title: "Nouvelle demande client", meta: "Il y a 2 heures", tone: "brand" },
  { title: "Rapport mensuel prêt", meta: "À vérifier", tone: "slate" },
];

export default function NotificationsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-500">Communications</p>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900 dark:text-white">
            Notifications
          </h1>
        </div>
        <Link href="/dashboard">
          <Button variant="outline" size="sm" className="gap-2">
            <ArrowRight className="w-4 h-4 rotate-180" />
            Retour au tableau
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">
            <span>Non lues</span>
            <Bell className="h-4 w-4 text-brand-500" />
          </div>
          <div className="mt-4 text-3xl font-black text-slate-900 dark:text-white">18</div>
          <div className="mt-2 text-[11px] text-slate-500">messages</div>
        </Card>

        <Card>
          <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">
            <span>Rappels</span>
            <Clock3 className="h-4 w-4 text-amber-500" />
          </div>
          <div className="mt-4 text-3xl font-black text-slate-900 dark:text-white">06</div>
          <div className="mt-2 text-[11px] text-slate-500">planifiés</div>
        </Card>

        <Card>
          <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">
            <span>Actions</span>
            <Sparkles className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="mt-4 text-3xl font-black text-slate-900 dark:text-white">03</div>
          <div className="mt-2 text-[11px] text-slate-500">à finaliser</div>
        </Card>
      </div>

      <Card>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Centre de notifications</h2>
          <span className="text-xs font-semibold text-slate-500">4 événements</span>
        </div>

        <div className="space-y-3">
          {notifications.map((item) => (
            <div key={item.title} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-800/60">
              <div className="flex items-center gap-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${item.tone === "green" ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40" : item.tone === "amber" ? "bg-amber-100 text-amber-600 dark:bg-amber-900/40" : item.tone === "brand" ? "bg-brand-100 text-brand-600 dark:bg-brand-900/40" : "bg-slate-200 text-slate-600 dark:bg-slate-700"}`}>
                  <CheckCircle2 className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">{item.title}</p>
                  <p className="text-xs text-slate-500">{item.meta}</p>
                </div>
              </div>
              <button className="text-xs font-bold text-brand-600 hover:text-brand-500">Voir</button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
