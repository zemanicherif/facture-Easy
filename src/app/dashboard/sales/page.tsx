import Link from "next/link";
import { ArrowRight, ShoppingCart, TrendingUp, ReceiptText, Users } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

const sales = [
  { client: "M. Ndiaye", total: "240 000 FCFA", status: "Payée" },
  { client: "A. Diop", total: "185 500 FCFA", status: "En attente" },
  { client: "Studio Kora", total: "320 000 FCFA", status: "Payée" },
  { client: "S. Traoré", total: "98 000 FCFA", status: "Impayée" },
];

export default function SalesPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-500">Ventes</p>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900 dark:text-white">
            Suivi des ventes
          </h1>
        </div>
        <Link href="/dashboard">
          <Button variant="outline" size="sm" className="gap-2">
            <ArrowRight className="w-4 h-4 rotate-180" />
            Retour au tableau
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">
            <span>Ventes</span>
            <ShoppingCart className="h-4 w-4 text-brand-500" />
          </div>
          <div className="mt-4 text-3xl font-black text-slate-900 dark:text-white">742</div>
          <div className="mt-2 text-[11px] text-emerald-600 font-bold">+12% vs mois dernier</div>
        </Card>

        <Card>
          <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">
            <span>CA</span>
            <TrendingUp className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="mt-4 text-3xl font-black text-slate-900 dark:text-white">12.4M</div>
          <div className="mt-2 text-[11px] text-slate-500">FCFA</div>
        </Card>

        <Card>
          <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">
            <span>Factures</span>
            <ReceiptText className="h-4 w-4 text-amber-500" />
          </div>
          <div className="mt-4 text-3xl font-black text-slate-900 dark:text-white">96</div>
          <div className="mt-2 text-[11px] text-slate-500">Active cette semaine</div>
        </Card>

        <Card>
          <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">
            <span>Clients</span>
            <Users className="h-4 w-4 text-brand-500" />
          </div>
          <div className="mt-4 text-3xl font-black text-slate-900 dark:text-white">48</div>
          <div className="mt-2 text-[11px] text-slate-500">actifs</div>
        </Card>
      </div>

      <Card>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Dernières ventes</h2>
          <span className="text-xs font-semibold text-slate-500">4 transactions</span>
        </div>

        <div className="space-y-3">
          {sales.map((sale) => (
            <div key={sale.client} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-800/60">
              <div>
                <p className="font-bold text-slate-900 dark:text-white">{sale.client}</p>
                <p className="text-xs text-slate-500">Commande confirmée</p>
              </div>
              <div className="text-right">
                <p className="font-black text-slate-900 dark:text-white">{sale.total}</p>
                <p className={`text-[11px] font-bold ${sale.status === "Payée" ? "text-emerald-600" : sale.status === "En attente" ? "text-amber-600" : "text-rose-600"}`}>
                  {sale.status}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
