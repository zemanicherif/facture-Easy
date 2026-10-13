"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  TrendingUp,
  MoreHorizontal,
  PlusCircle,
  Eye,
  Trash2,
  CheckCircle,
  Clock,
  ShieldCheck,
  Search,
  Filter,
  ArrowUpRight,
  Briefcase,
  Laptop,
  ShoppingBag,
  Building2,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Dropdown } from "@/components/ui/Dropdown";
import { Modal } from "@/components/ui/Modal";
import { DatePicker } from "@/components/ui/DatePicker";
import { fetchInvoices, deleteInvoice, updateInvoiceStatus } from "@/lib/queries";
import { formatFCFA } from "@/lib/utils";
import { Invoice, InvoiceStatus } from "@/lib/types";

export default function DashboardPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<"all" | InvoiceStatus>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; invoiceNumber: string } | null>(null);
  const [billing, setBilling] = useState<{ plan: string; active: boolean; paymentStatus: string; pro_until: string | null }>({
    plan: 'free',
    active: false,
    paymentStatus: 'none',
    pro_until: null,
  });
  const datePickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const data = await fetchInvoices();
      setInvoices(data);
      setLoading(false);
    }

    async function loadBillingStatus() {
      try {
        const response = await fetch('/api/billing/status', { cache: 'no-store' });
        if (!response.ok) return;
        const data = await response.json();
        setBilling({
          plan: data.plan ?? 'free',
          active: Boolean(data.active),
          paymentStatus: data.paymentStatus ?? 'none',
          pro_until: data.pro_until ?? null,
        });
      } catch (error) {
        console.error('Unable to load billing status:', error);
      }
    }

    loadData();
    loadBillingStatus();
    const interval = window.setInterval(loadBillingStatus, 15000);
    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target as Node)) {
        setShowDatePicker(false);
      }
    }
    if (showDatePicker) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showDatePicker]);

  const categories = [
    { label: "Toutes", value: "all", icon: <Filter className="w-3.5 h-3.5" /> },
    { label: "Services", value: "services", icon: <Laptop className="w-3.5 h-3.5" /> },
    { label: "Produits", value: "products", icon: <ShoppingBag className="w-3.5 h-3.5" /> },
    { label: "Consulting", value: "consulting", icon: <Briefcase className="w-3.5 h-3.5" /> },
    { label: "Entreprises", value: "b2b", icon: <Building2 className="w-3.5 h-3.5" /> },
  ];

  const pendingStatuses = ["En attente", "Envoyée", "Impayée", "En retard"] as const;

  // KPIs
  const totalRevenue = invoices
    .filter((inv) => inv.status === "Payée")
    .reduce((acc, curr) => acc + curr.totalTTC, 0);

  const totalVAT = invoices
    .filter((inv) => inv.status === "Payée")
    .reduce((acc, curr) => acc + curr.vatAmount, 0);

  const totalPending = invoices
    .filter((inv) => pendingStatuses.includes(inv.status as typeof pendingStatuses[number]))
    .reduce((acc, curr) => acc + curr.totalTTC, 0);

  const totalClientsCount = new Set(invoices.map((i) => i.clientName)).size;

  // Filters
  const filteredInvoices = invoices.filter((inv) => {
    const matchesFilter = activeFilter === "all" || inv.status === activeFilter;
    const matchesSearch =
      inv.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.clientEmail.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const countAll = invoices.length;
  const countPaid = invoices.filter((i) => i.status === "Payée").length;
  const countPending = invoices.filter((i) => ["En attente", "Envoyée"].includes(i.status)).length;
  const countUnpaid = invoices.filter((i) => ["Impayée", "En retard"].includes(i.status)).length;

  const handleDelete = (id: string, invoiceNumber: string) => {
    setDeleteTarget({ id, invoiceNumber });
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    await deleteInvoice(deleteTarget.id);
    setInvoices((current) => current.filter((i) => i.id !== deleteTarget.id));
    setDeleteTarget(null);
  };

  const handleStatusChange = async (id: string, nextStatus: InvoiceStatus) => {
    await updateInvoiceStatus(id, nextStatus);
    setInvoices((current) =>
      current.map((inv) =>
        inv.id === id ? { ...inv, status: nextStatus } : inv
      )
    );
  };

  if (loading) {
    return <div className="p-8 text-center text-slate-500">Chargement des données depuis Supabase...</div>;
  }

  return (
    <div className="space-y-6">
      {(billing.paymentStatus === 'pending' || billing.active || billing.plan === 'pro' || billing.plan === 'free') && (
        <Card className="p-5">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                Abonnement
              </p>
              {billing.active && billing.pro_until ? (
                <p className="mt-1 text-lg font-bold text-emerald-700">
                  Pro actif jusqu’au {new Date(billing.pro_until).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })}
                </p>
              ) : billing.paymentStatus === 'pending' ? (
                <p className="mt-1 text-lg font-bold text-amber-700">
                  Paiement en cours de vérification. Rafraîchissement automatique.
                </p>
              ) : (
                <p className="mt-1 text-lg font-bold text-slate-800">
                  Plan gratuit • Activez le forfait Pro pour débloquer les fonctionnalités premium.
                </p>
              )}
            </div>

            {!billing.active && (
              <form action="/api/checkout" method="POST">
                <input type="hidden" name="plan" value="pro" />
                <Button type="submit" className="whitespace-nowrap">
                  {billing.paymentStatus === 'pending' ? 'Vérifier le paiement' : 'Passer au Pro'}
                </Button>
              </form>
            )}
          </div>
        </Card>
      )}

      {/* 4 KPI CARDS (SalesSync Style Exact) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        
        {/* KPI 1 : Total Encaissé */}
        <Card className="hover:shadow-md transition">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Total Encaissé</span>
            <button className="text-slate-400 hover:text-slate-600">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              {formatFCFA(totalRevenue)}
            </div>
          </div>
          <div className="mt-2.5 flex items-center gap-1.5 text-xs">
            <span className="inline-flex items-center gap-0.5 text-brand-600 dark:text-brand-400 font-bold bg-brand-50 dark:bg-brand-950/60 px-2 py-0.5 rounded text-[11px]">
              <TrendingUp className="w-3 h-3" /> +14.2%
            </span>
            <span className="text-slate-400 text-[11px]">vs mois dernier</span>
          </div>
        </Card>

        {/* KPI 2 : Total Clients Actifs */}
        <Card className="hover:shadow-md transition">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Total Clients Actifs</span>
            <button className="text-slate-400 hover:text-slate-600">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              {totalClientsCount}
            </div>
          </div>
          <div className="mt-2.5 flex items-center gap-1.5 text-xs">
            <span className="inline-flex items-center gap-0.5 text-brand-600 dark:text-brand-400 font-bold bg-brand-50 dark:bg-brand-950/60 px-2 py-0.5 rounded text-[11px]">
              <TrendingUp className="w-3 h-3" /> +5.1%
            </span>
            <span className="text-slate-400 text-[11px]">Portefeuille actif</span>
          </div>
        </Card>

        {/* KPI 3 : TVA 18% Collectée */}
        <Card className="hover:shadow-md transition">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>TVA (18%) Collectée</span>
            <button className="text-slate-400 hover:text-slate-600">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              {formatFCFA(totalVAT)}
            </div>
          </div>
          <div className="mt-2.5 flex items-center gap-1.5 text-xs">
            <span className="inline-flex items-center gap-1 text-brand-600 dark:text-brand-400 font-bold bg-brand-50 dark:bg-brand-950/60 px-2 py-0.5 rounded text-[11px]">
              <ShieldCheck className="w-3 h-3" /> Calcul auto DGI
            </span>
          </div>
        </Card>

        {/* KPI 4 : Créances en attente */}
        <Card className="hover:shadow-md transition">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>En attente de paiement</span>
            <button className="text-slate-400 hover:text-slate-600">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-black text-amber-500 tracking-tight">
              {formatFCFA(totalPending)}
            </div>
          </div>
          <div className="mt-2.5 flex items-center gap-1.5 text-xs">
            <span className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-400 font-bold bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded text-[11px]">
              <Clock className="w-3 h-3" /> {countPending + countUnpaid} à encaisser
            </span>
          </div>
        </Card>

      </div>

      {/* TABLEAU DES FACTURES (SalesSync Style Exact Replica) */}
      <Card className="p-5 sm:p-7 space-y-4">
        
        {/* Table Header Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
              Factures Récentes
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
              {invoices.length} factures
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/invoices/new">
              <Button size="sm" className="gap-2">
                <PlusCircle className="w-4 h-4" />
                <span>Créer une facture</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-2">
          <div className="flex flex-wrap items-center gap-3 text-xs font-semibold">
            {/* Status Filter Pills */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setActiveFilter("all")}
                className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition ${
                  activeFilter === "all"
                    ? "bg-slate-900 text-white dark:bg-slate-700"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200"
                }`}
              >
                <span>Toutes</span>
                <span className="px-1.5 py-0.2 rounded-full bg-brand-500 text-white text-[10px]">
                  {countAll}
                </span>
              </button>

              <button
                onClick={() => setActiveFilter("Payée")}
                className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition ${
                  activeFilter === "Payée"
                    ? "bg-slate-900 text-white dark:bg-slate-700"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200"
                }`}
              >
                <span>Payées</span>
                <span className="px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-[10px]">
                  {countPaid}
                </span>
              </button>

              <button
                onClick={() => setActiveFilter("En attente")}
                className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition ${
                  activeFilter === "En attente"
                    ? "bg-slate-900 text-white dark:bg-slate-700"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200"
                }`}
              >
                <span>En attente</span>
                <span className="px-1.5 py-0.2 rounded-full bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300 text-[10px]">
                  {countPending}
                </span>
              </button>

              <button
                onClick={() => setActiveFilter("Envoyée")}
                className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition ${
                  activeFilter === "Envoyée"
                    ? "bg-slate-900 text-white dark:bg-slate-700"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200"
                }`}
              >
                <span>Envoyées</span>
                <span className="px-1.5 py-0.2 rounded-full bg-violet-100 text-violet-800 dark:bg-violet-950 dark:text-violet-300 text-[10px]">
                  {invoices.filter((i) => i.status === "Envoyée").length}
                </span>
              </button>

              <button
                onClick={() => setActiveFilter("Impayée")}
                className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition ${
                  activeFilter === "Impayée"
                    ? "bg-slate-900 text-white dark:bg-slate-700"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200"
                }`}
              >
                <span>Impayées</span>
                <span className="px-1.5 py-0.2 rounded-full bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 text-[10px]">
                  {countUnpaid}
                </span>
              </button>
            </div>

            {/* Category Dropdown */}
            <div className="ml-2">
              <Dropdown
                variant="category"
                options={categories}
                value={selectedCategory}
                onChange={setSelectedCategory}
                placeholder="Catégorie"
                className="w-40"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* DatePicker Integration */}
            <div className="relative" ref={datePickerRef}>
              <button
                onClick={() => setShowDatePicker(!showDatePicker)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                  showDatePicker ? "border-brand-500 ring-2 ring-brand-500/20 bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-300" : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:border-brand-500"
                }`}
              >
                <Clock className="w-3.5 h-3.5 text-brand-500" />
                <span>{selectedDate.toLocaleDateString()}</span>
              </button>
              {showDatePicker && (
                <div className="absolute right-0 z-50 mt-2">
                  <DatePicker
                    value={selectedDate}
                    onChange={(date) => {
                      setSelectedDate(date);
                      setShowDatePicker(false);
                    }}
                  />
                </div>
              )}
            </div>

            {/* Search box */}
            <div className="relative w-full md:w-60">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Rechercher par client..."
                className="w-full pl-8 pr-3 py-1.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>
        </div>

        {/* Table element */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
            <thead className="bg-slate-50/80 dark:bg-slate-800 text-[11px] uppercase font-bold text-slate-400 tracking-wider">
              <tr>
                <th className="py-3 px-3 rounded-l-xl">N° Facture</th>
                <th className="py-3 px-3">Client</th>
                <th className="py-3 px-3 hidden md:table-cell">Email</th>
                <th className="py-3 px-3 hidden lg:table-cell">Émission</th>
                <th className="py-3 px-3 hidden lg:table-cell">Échéance</th>
                <th className="py-3 px-3 font-semibold">Montant TTC (FCFA)</th>
                <th className="py-3 px-3 text-center">Statut</th>
                <th className="py-3 px-3 text-right rounded-r-xl">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50 font-medium">
              {filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    Aucune facture trouvée pour cette recherche.
                  </td>
                </tr>
              ) : (
                filteredInvoices.map((inv) => (
                  <tr
                    key={inv.id}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-700/30 transition duration-150"
                  >
                    <td className="py-3.5 px-3 font-mono font-bold text-slate-900 dark:text-white">
                      {inv.invoiceNumber}
                    </td>
                    <td className="py-3.5 px-3 font-semibold text-slate-800 dark:text-slate-200">
                      {inv.clientName}
                    </td>
                    <td className="py-3.5 px-3 text-slate-400 hidden md:table-cell">
                      {inv.clientEmail}
                    </td>
                    <td className="py-3.5 px-3 text-slate-400 hidden lg:table-cell">
                      {inv.date}
                    </td>
                    <td className="py-3.5 px-3 text-slate-400 hidden lg:table-cell">
                      {inv.dueDate}
                    </td>
                    <td className="py-3.5 px-3 font-bold text-slate-900 dark:text-white">
                      {formatFCFA(inv.totalTTC)}
                    </td>
                    <td className="py-3.5 px-3 text-center">
                      <div className="flex justify-center">
                        <select
                          value={inv.status}
                          onChange={(event) => handleStatusChange(inv.id, event.target.value as InvoiceStatus)}
                          className="min-w-[120px] rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-[11px] font-bold text-slate-700 shadow-sm outline-none transition focus:border-brand-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                        >
                          <option value="Envoyée">Envoyée</option>
                          <option value="En attente">En attente</option>
                          <option value="Payée">Payée</option>
                          <option value="En retard">En retard</option>
                          <option value="Impayée">Impayée</option>
                          <option value="Brouillon">Brouillon</option>
                        </select>
                      </div>
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href={`/invoices/${inv.id}`}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-brand-600 hover:bg-brand-50 dark:hover:bg-slate-700 transition"
                          title="Voir le détail"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(inv.id, inv.invoiceNumber)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-slate-700 transition"
                          title="Supprimer"
                        >
                          <Trash2 className="w-4 h-4 text-rose-400" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Pagination info */}
        <div className="pt-3 flex items-center justify-between text-xs text-slate-400 border-t border-slate-100 dark:border-slate-800">
          <span>
            Affichage de {filteredInvoices.length} sur {invoices.length} factures
          </span>
          <div className="flex items-center gap-1 font-semibold">
            <button className="px-2.5 py-1 rounded-lg bg-brand-500 text-white">1</button>
            <button className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100">2</button>
          </div>
        </div>

      </Card>

      <Modal
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        title="Supprimer cette facture ?"
        description="Cette action va retirer définitivement la facture de votre tableau de bord et de l’historique."
        size="sm"
        variant="danger"
      >
        <div className="flex items-center justify-end gap-3">
          <Button variant="ghost" onClick={() => setDeleteTarget(null)}>
            Annuler
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Confirmer
          </Button>
        </div>
      </Modal>

    </div>
  );
}
