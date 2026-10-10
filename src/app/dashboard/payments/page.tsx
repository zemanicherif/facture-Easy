import Link from "next/link";
import { ArrowRight, CreditCard, CircleDollarSign, ShieldCheck, Clock3 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

const payments = [
  { name: "Ndiaye & Co.", amount: "120 000 FCFA", status: "Reçu" },
  { name: "Kora Studio", amount: "95 000 FCFA", status: "En attente" },
  { name: "Atelier RCI", amount: "180 500 FCFA", status: "Reçu" },
  { name: "B. Diallo", amount: "64 000 FCFA", status: "À traiter" },
];

export default function PaymentsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-500">Paiements</p>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900 dark:text-white">
            Gestion des paiements
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
            <span>Reçus</span>
            <CircleDollarSign className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="mt-4 text-3xl font-black text-slate-900 dark:text-white">2.4M</div>
          <div className="mt-2 text-[11px] text-emerald-600 font-bold">+9.2% ce mois</div>
        </Card>

        <Card>
          <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">
            <span>À traiter</span>
            <Clock3 className="h-4 w-4 text-amber-500" />
          </div>
          <div className="mt-4 text-3xl font-black text-slate-900 dark:text-white">4</div>
          <div className="mt-2 text-[11px] text-slate-500">transactions</div>
        </Card>

        <Card>
          <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">
            <span>Validation</span>
            <ShieldCheck className="h-4 w-4 text-brand-500" />
          </div>
          <div className="mt-4 text-3xl font-black text-slate-900 dark:text-white">96%</div>
          <div className="mt-2 text-[11px] text-slate-500">sécurité / conformité</div>
        </Card>
      </div>

      <Card>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Transactions récentes</h2>
          <span className="text-xs font-semibold text-slate-500">4 paiements</span>
        </div>

        <div className="space-y-3">
          {payments.map((payment) => (
            <div key={payment.name} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-800/60">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-950/50">
                  <CreditCard className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">{payment.name}</p>
                  <p className="text-xs text-slate-500">Paiement numérique</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-black text-slate-900 dark:text-white">{payment.amount}</p>
                <p className={`text-[11px] font-bold ${payment.status === "Reçu" ? "text-emerald-600" : payment.status === "En attente" ? "text-amber-600" : "text-slate-500"}`}>
                  {payment.status}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
