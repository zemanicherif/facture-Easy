"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { fetchInvoices, deleteInvoice, updateInvoiceStatus } from "@/lib/queries";
import { formatFCFA } from "@/lib/utils";
import { Invoice, InvoiceStatus } from "@/lib/types";
import {
  Plus,
  Search,
  Download,
  Filter,
  Eye,
  Pencil,
  Trash2,
  CheckCircle,
  FileSpreadsheet,
} from "lucide-react";

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<"all" | InvoiceStatus>("all");
  const [search, setSearch] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; number: string } | null>(null);
  const [exportDialog, setExportDialog] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const data = await fetchInvoices();
      setInvoices(data);
      setLoading(false);
    }
    load();
  }, []);

  const filtered = invoices.filter((inv) => {
    const matchStatus = statusFilter === "all" || inv.status === statusFilter;
    const matchSearch =
      inv.clientName.toLowerCase().includes(search.toLowerCase()) ||
      inv.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
      inv.clientEmail.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const handleDelete = (id: string, number: string) => {
    setDeleteTarget({ id, number });
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
    return <div className="min-h-screen flex items-center justify-center bg-[#F6F8FA] dark:bg-[#090E17] text-slate-500">Chargement des factures depuis Supabase...</div>;
  }

  return (
    <div className="flex min-h-screen bg-[#F6F8FA] dark:bg-[#090E17]">
      <Sidebar className="hidden lg:flex fixed inset-y-0 left-0 z-40" />

      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen">
        <Topbar
          title="Gestion des Factures"
          subtitle="Suivez, éditez et envoyez vos factures avec TVA 18% automatique"
        />

        <main className="flex-1 p-4 sm:p-7 max-w-7xl w-full mx-auto space-y-6">
          
          {/* Header Action Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                Toutes les Factures
              </h2>
              <p className="text-xs text-slate-500">
                Total de {invoices.length} factures enregistrées
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setExportDialog(true)}
              >
                <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                <span>Exporter CSV / Excel</span>
              </Button>

              <Link href="/invoices/new">
                <Button size="sm">
                  <Plus className="w-4 h-4" />
                  <span>Nouvelle Facture</span>
                </Button>
              </Link>
            </div>
          </div>

          {/* Filter & Search Bar */}
          <Card className="p-4 sm:p-5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              
              {/* Pills */}
              <div className="flex flex-wrap items-center gap-2">
                {(["all", "Envoyée", "Payée", "En attente", "En retard", "Impayée", "Brouillon"] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                      statusFilter === st
                        ? "bg-brand-500 text-white shadow-md shadow-brand-500/20"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
                    }`}
                  >
                    {st === "all" ? "Toutes les factures" : st}
                  </button>
                ))}
              </div>

              {/* Search */}
              <div className="relative w-full md:w-72">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Rechercher par n°, client, email..."
                  className="w-full pl-9 pr-3.5 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-brand-500"
                />
              </div>

            </div>

            {/* Invoices List Table */}
            <div className="mt-6 overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
                <thead className="bg-slate-50 dark:bg-slate-800 text-[11px] uppercase font-bold text-slate-400 tracking-wider">
                  <tr>
                    <th className="py-3 px-3 rounded-l-xl">N° Facture</th>
                    <th className="py-3 px-3">Client</th>
                    <th className="py-3 px-3 hidden md:table-cell">Date d'émission</th>
                    <th className="py-3 px-3 hidden lg:table-cell">Date d'échéance</th>
                    <th className="py-3 px-3">Montant HT</th>
                    <th className="py-3 px-3">TVA (18%)</th>
                    <th className="py-3 px-3 font-bold">Total TTC</th>
                    <th className="py-3 px-3 text-center">Statut</th>
                    <th className="py-3 px-3 text-right rounded-r-xl">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50 font-medium">
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="py-10 text-center text-slate-400">
                        Aucune facture trouvée pour ce critère.
                      </td>
                    </tr>
                  ) : (
                    filtered.map((inv) => (
                      <tr
                        key={inv.id}
                        className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition"
                      >
                        <td className="py-3.5 px-3 font-mono font-bold text-slate-900 dark:text-white">
                          {inv.invoiceNumber}
                        </td>
                        <td className="py-3.5 px-3 font-semibold text-slate-800 dark:text-slate-200">
                          {inv.clientName}
                        </td>
                        <td className="py-3.5 px-3 text-slate-400 hidden md:table-cell">
                          {inv.date}
                        </td>
                        <td className="py-3.5 px-3 text-slate-400 hidden lg:table-cell">
                          {inv.dueDate}
                        </td>
                        <td className="py-3.5 px-3 font-mono text-slate-600 dark:text-slate-400">
                          {formatFCFA(inv.subtotalHT)}
                        </td>
                        <td className="py-3.5 px-3 font-mono text-brand-600 dark:text-brand-400 font-semibold">
                          {formatFCFA(inv.vatAmount)}
                        </td>
                        <td className="py-3.5 px-3 font-bold text-slate-900 dark:text-white font-mono">
                          {formatFCFA(inv.totalTTC)}
                        </td>
                        <td className="py-3.5 px-3 text-center">
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
                        </td>
                        <td className="py-3.5 px-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <Link
                              href={`/invoices/${inv.id}`}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-brand-600 hover:bg-brand-50 transition"
                              title="Voir détail"
                            >
                              <Eye className="w-4 h-4" />
                            </Link>
                            <Link
                              href={`/invoices/${inv.id}/edit`}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950/30 transition"
                              title="Modifier la facture"
                            >
                              <Pencil className="w-4 h-4" />
                            </Link>
                            <button
                              onClick={() => handleDelete(inv.id, inv.invoiceNumber)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition"
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

          </Card>

          <Modal
            open={Boolean(deleteTarget)}
            onClose={() => setDeleteTarget(null)}
            title="Supprimer cette facture ?"
            description="Cette action supprimera la facture du journal sans possibilité de restauration depuis cette interface."
            size="sm"
            variant="danger"
          >
            <div className="flex items-center justify-end gap-3">
              <Button variant="ghost" onClick={() => setDeleteTarget(null)}>
                Annuler
              </Button>
              <Button variant="danger" onClick={confirmDelete}>
                Confirmer la suppression
              </Button>
            </div>
          </Modal>

          <Modal
            open={exportDialog}
            onClose={() => setExportDialog(false)}
            title="Exporter les factures"
            description="Le journal peut être exporté au format CSV ou Excel pour un traitement comptable ou un partage interne."
            size="sm"
          >
            <div className="flex items-center justify-end gap-3">
              <Button variant="ghost" onClick={() => setExportDialog(false)}>
                Fermer
              </Button>
              <Button onClick={() => setExportDialog(false)}>
                Générer le fichier
              </Button>
            </div>
          </Modal>

        </main>
      </div>
    </div>
  );
}

