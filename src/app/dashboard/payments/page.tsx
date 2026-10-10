"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  CreditCard,
  CircleDollarSign,
  ShieldCheck,
  Clock3,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { fetchInvoices, updateInvoiceStatus } from "@/lib/queries";
import { Invoice } from "@/lib/types";
import { formatFCFA } from "@/lib/utils";

export default function PaymentsPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadInvoices() {
      setLoading(true);
      const data = await fetchInvoices();
      setInvoices(data);
      setLoading(false);
    }

    loadInvoices();
  }, []);

  const receivedTotal = useMemo(
    () =>
      invoices
        .filter((invoice) => invoice.status === "Payée")
        .reduce((sum, invoice) => sum + invoice.totalTTC, 0),
    [invoices]
  );

  const pendingTotal = useMemo(
    () =>
      invoices
        .filter((invoice) => invoice.status !== "Payée")
        .reduce((sum, invoice) => sum + invoice.totalTTC, 0),
    [invoices]
  );

  const collectionRate = useMemo(() => {
    if (!invoices.length) return 0;
    return (invoices.filter((invoice) => invoice.status === "Payée").length / invoices.length) * 100;
  }, [invoices]);

  const recentTransactions = useMemo(
    () => [...invoices].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 6),
    [invoices]
  );

  const handleMarkPaid = async (id: string) => {
    await updateInvoiceStatus(id, "Payée");
    setInvoices((current) =>
      current.map((invoice) =>
        invoice.id === id ? { ...invoice, status: "Payée" } : invoice
      )
    );
  };

  if (loading) {
    return <div className="p-8 text-center text-slate-500">Chargement des paiements…</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-500">Paiements</p>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900 dark:text-white">
            Encaissement & validation
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
          <div className="mt-4 text-3xl font-black text-slate-900 dark:text-white">
            {formatFCFA(receivedTotal)}
          </div>
          <div className="mt-2 text-[11px] text-emerald-600 font-bold">+9.2% ce mois</div>
        </Card>

        <Card>
          <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">
            <span>À traiter</span>
            <Clock3 className="h-4 w-4 text-amber-500" />
          </div>
          <div className="mt-4 text-3xl font-black text-slate-900 dark:text-white">
            {invoices.filter((invoice) => invoice.status !== "Payée").length}
          </div>
          <div className="mt-2 text-[11px] text-slate-500">{formatFCFA(pendingTotal)} à encaisser</div>
        </Card>

        <Card>
          <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">
            <span>Taux de collecte</span>
            <ShieldCheck className="h-4 w-4 text-brand-500" />
          </div>
          <div className="mt-4 text-3xl font-black text-slate-900 dark:text-white">
            {collectionRate.toFixed(0)}%
          </div>
          <div className="mt-2 text-[11px] text-slate-500">sécurité / conformité</div>
        </Card>
      </div>

      <Card>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Transactions récentes</h2>
          <span className="text-xs font-semibold text-slate-500">{recentTransactions.length} paiements</span>
        </div>

        <div className="space-y-3">
          {recentTransactions.map((invoice) => {
            const isPaid = invoice.status === "Payée";

            return (
              <div
                key={invoice.id}
                className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-800/60 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-950/50">
                    <CreditCard className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white">{invoice.clientName}</p>
                    <p className="text-xs text-slate-500">{invoice.invoiceNumber} • {invoice.date}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 sm:justify-end">
                  <div className="text-left sm:text-right">
                    <p className="font-black text-slate-900 dark:text-white">{formatFCFA(invoice.totalTTC)}</p>
                    <p
                      className={`text-[11px] font-bold ${
                        isPaid
                          ? "text-emerald-600"
                          : invoice.status === "En attente" || invoice.status === "Envoyée"
                            ? "text-amber-600"
                            : "text-rose-600"
                      }`}
                    >
                      {isPaid ? "Reçu" : invoice.status}
                    </p>
                  </div>

                  {!isPaid && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-2 whitespace-nowrap"
                      onClick={() => handleMarkPaid(invoice.id)}
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      Valider paiement
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
