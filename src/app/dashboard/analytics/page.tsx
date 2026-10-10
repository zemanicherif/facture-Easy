import Link from "next/link";
import { ArrowRight, BarChart3, TrendingUp, Wallet, Target } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

const metrics = [
  { label: "Revenu mensuel", value: "1 240 000 FCFA", trend: "+14.2%", tone: "brand" },
  { label: "Taux de paiement", value: "89%", trend: "+6.4%", tone: "green" },
  { label: "TVA collectée", value: "223 200 FCFA", trend: "+9.8%", tone: "amber" },
  { label: "Clients VIP", value: "32", trend: "+4", tone: "slate" },
];

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-500">Analyse</p>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900 dark:text-white">
            Analytiques
          </h1>
        </div>
        <Link href="/dashboard">
          <Button variant="outline" size="sm" className="gap-2">
            <ArrowRight className="w-4 h-4 rotate-180" />
            Retour au tableau
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <Card key={metric.label} className="space-y-3">
            <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">
              <span>{metric.label}</span>
              <BarChart3 className="h-4 w-4 text-slate-400" />
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">{metric.value}</div>
            <div className="inline-flex items-center gap-1 rounded-full bg-brand-50 px-2 py-1 text-[11px] font-bold text-brand-600">
              <TrendingUp className="h-3 w-3" />
              {metric.trend}
            </div>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Performance</p>
              <h2 className="mt-2 text-xl font-bold text-slate-900 dark:text-white">Évolution des ventes</h2>
            </div>
            <Wallet className="h-5 w-5 text-brand-500" />
          </div>
          <div className="mt-6 h-56 rounded-2xl bg-gradient-to-br from-brand-50 via-slate-50 to-slate-100 p-4 dark:from-slate-800 dark:via-slate-900 dark:to-slate-900">
            <div className="flex h-full items-end gap-3">
              {[38, 52, 48, 74, 68, 92, 106].map((height, index) => (
                <div key={index} className="flex-1 rounded-t-2xl bg-gradient-to-t from-brand-500 to-brand-300" style={{ height: `${height}%` }} />
              ))}
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Objectif</p>
              <h2 className="mt-2 text-xl font-bold text-slate-900 dark:text-white">Suivi des cibles</h2>
            </div>
            <Target className="h-5 w-5 text-emerald-500" />
          </div>

          <div className="mt-6 space-y-5">
            {[
              { label: "Factures payées", value: 84, color: "bg-emerald-500" },
              { label: "Nouveaux clients", value: 71, color: "bg-brand-500" },
              { label: "Portefeuille actif", value: 63, color: "bg-amber-500" },
            ].map((item) => (
              <div key={item.label}>
                <div className="mb-2 flex items-center justify-between text-sm text-slate-600 dark:text-slate-300">
                  <span>{item.label}</span>
                  <span className="font-bold text-slate-900 dark:text-white">{item.value}%</span>
                </div>
                <div className="h-2.5 rounded-full bg-slate-100 dark:bg-slate-800">
                  <div className={`h-full rounded-full ${item.color}`} style={{ width: `${item.value}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
