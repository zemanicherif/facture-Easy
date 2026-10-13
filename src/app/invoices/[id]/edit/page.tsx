"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { getStoredInvoices, saveStoredInvoices } from "@/lib/storage";
import { formatFCFA } from "@/lib/utils";
import { InvoiceItem, InvoiceStatus } from "@/lib/types";
import {
  Plus,
  Trash2,
  ArrowLeft,
  Save,
  ShieldCheck,
  Pencil,
  CalendarDays,
} from "lucide-react";
import { DatePicker } from "@/components/ui/DatePicker";

export default function EditInvoicePage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const [invoices, setInvoices] = useState(() => getStoredInvoices());

  const found =
    invoices.find((inv) => inv.id === id || inv.invoiceNumber === id) ||
    invoices[0];

  const [clientName, setClientName] = useState(found?.clientName || "");
  const [clientEmail, setClientEmail] = useState(found?.clientEmail || "");
  const [clientPhone, setClientPhone] = useState(found?.clientPhone || "");
  const [clientAddress, setClientAddress] = useState(found?.clientAddress || "");
  const [date, setDate] = useState(found?.date || "");
  const [dueDate, setDueDate] = useState(found?.dueDate || "");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showDueDatePicker, setShowDueDatePicker] = useState(false);
  const [status, setStatus] = useState<InvoiceStatus>(found?.status || "En attente");
  const [notes, setNotes] = useState(found?.notes || "");
  const [items, setItems] = useState<InvoiceItem[]>(found?.items?.map((it) => ({ ...it })) || []);
  const [dialog, setDialog] = useState<{ title: string; description: string } | null>(null);

  useEffect(() => {
    saveStoredInvoices(invoices);
  }, [invoices]);

  useEffect(() => {
    if (!found) return;
    setClientName(found.clientName);
    setClientEmail(found.clientEmail);
    setClientPhone(found.clientPhone || "");
    setClientAddress(found.clientAddress || "");
    setDate(found.date);
    setDueDate(found.dueDate);
    setStatus(found.status);
    setNotes(found.notes || "");
    setItems(found.items.map((it) => ({ ...it })));
  }, [found]);

  const parseDateValue = (value: string) => {
    if (!value) return new Date();

    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      const [year, month, day] = value.split("-").map(Number);
      return new Date(year, month - 1, day);
    }

    const normalized = value.trim().toLowerCase();
    const monthMap: Record<string, number> = {
      jan: 1, janvier: 1, janv: 1,
      feb: 2, fev: 2, février: 2, fevr: 2,
      mar: 3, mars: 3,
      apr: 4, avr: 4, avril: 4,
      may: 5, mai: 5,
      jun: 6, juin: 6,
      jul: 7, juil: 7, juillet: 7,
      aug: 8, août: 8, aout: 8,
      sep: 9, sept: 9, septembre: 9,
      oct: 10, octo: 10, octobre: 10,
      nov: 11, novembre: 11,
      dec: 12, decem: 12, décembre: 12, decembre: 12,
    };

    const match = normalized.match(/^(\d{1,2})\s+([a-zà-ÿ]+)\s+(\d{4})$/);
    if (match) {
      const day = Number(match[1]);
      const month = monthMap[match[2]];
      const year = Number(match[3]);
      if (month) {
        return new Date(year, month - 1, day);
      }
    }

    return new Date(value);
  };

  const formatDisplayDate = (value: string) => {
    const date = parseDateValue(value);
    if (Number.isNaN(date.getTime())) return "Choisir la date";

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}.${month}.${day}`;
  };

  const toIsoDate = (value: Date) => {
    const year = value.getFullYear();
    const month = String(value.getMonth() + 1).padStart(2, "0");
    const day = String(value.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const addItem = () => {
    setItems([...items, { id: `item-${Date.now()}`, description: "", quantity: 1, unitPrice: 0, total: 0 }]);
  };

  const removeItem = (itemId: string) => {
    if (items.length > 1) setItems(items.filter((it) => it.id !== itemId));
  };

  const updateItem = (itemId: string, field: keyof InvoiceItem, value: any) => {
    setItems(items.map((it) => {
      if (it.id !== itemId) return it;
      const updated = { ...it, [field]: value };
      if (field === "quantity" || field === "unitPrice") {
        updated.total = (field === "quantity" ? Number(value) : it.quantity) * (field === "unitPrice" ? Number(value) : it.unitPrice);
      }
      return updated;
    }));
  };

  const subtotalHT = items.reduce((acc, curr) => acc + curr.total, 0);
  const vatAmount = subtotalHT * 0.18;
  const totalTTC = subtotalHT + vatAmount;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!found) return;

    const updatedInvoice = {
      ...found,
      clientName,
      clientEmail,
      clientPhone,
      clientAddress,
      date,
      dueDate,
      items: items.map((item) => ({ ...item, total: item.quantity * item.unitPrice })),
      subtotalHT,
      vatAmount,
      totalTTC,
      status,
      notes,
    };

    setInvoices((current) =>
      current.map((invoice) =>
        invoice.id === found.id || invoice.invoiceNumber === found.invoiceNumber ? updatedInvoice : invoice
      )
    );

    setDialog({
      title: "Facture mise à jour",
      description: `La facture ${found.invoiceNumber} a bien été modifiée pour ${clientName}. Nouveau total TTC : ${formatFCFA(totalTTC)}.`,
    });
    setTimeout(() => router.push(`/invoices/${id}`), 900);
  };

  return (
    <>
    <div className="flex min-h-screen bg-[#F6F8FA] dark:bg-[#090E17]">
      <Sidebar className="hidden lg:flex fixed inset-y-0 left-0 z-40" />
      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen">
        <Topbar title={`Modifier ${found.invoiceNumber}`} subtitle={`Edition de la facture de ${found.clientName}`} />
        <main className="flex-1 p-4 sm:p-7">
          <div className="flex items-center justify-between mb-6">
            <Link href={`/invoices/${id}`} className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">
              <ArrowLeft className="w-4 h-4" />
              <span>Retour a la facture</span>
            </Link>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
              <Pencil className="w-3.5 h-3.5 text-amber-500" />
              <span>Mode Edition - {found.invoiceNumber}</span>
            </span>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl mx-auto">
            <Card className="p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight">1. Informations Client</h3>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-brand-50 dark:bg-brand-950 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800">
                  <ShieldCheck className="w-3.5 h-3.5 text-brand-500" />TVA 18%
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input label="Nom du client / Entreprise" value={clientName} onChange={(e) => setClientName(e.target.value)} required />
                <Input label="Email" type="email" value={clientEmail} onChange={(e) => setClientEmail(e.target.value)} />
                <Input label="Telephone" value={clientPhone} onChange={(e) => setClientPhone(e.target.value)} />
                <Input label="Adresse" value={clientAddress} onChange={(e) => setClientAddress(e.target.value)} />
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">Date d&apos;emission</label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => {
                        setShowDatePicker((prev) => !prev);
                        setShowDueDatePicker(false);
                      }}
                      className="flex w-full items-center justify-between rounded-xl border border-[#42c5f4] bg-[#f6fbfd] px-4 py-3 text-left text-lg font-semibold text-slate-700 shadow-[inset_0_0_0_1px_rgba(66,197,244,0.15)] transition-all duration-200 hover:-translate-y-0.5 hover:scale-[1.01] hover:border-[#38bdf8] hover:shadow-[0_8px_24px_rgba(56,189,248,0.12)]"
                    >
                      <span>{formatDisplayDate(date)}</span>
                      <CalendarDays className="h-5 w-5 text-slate-500" />
                    </button>

                    {showDatePicker && (
                      <div className="absolute left-0 top-full z-50 mt-3">
                        <DatePicker
                          value={parseDateValue(date)}
                          onChange={(selectedDate) => {
                            setDate(toIsoDate(selectedDate));
                            setShowDatePicker(false);
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">Date d&apos;echeance</label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => {
                        setShowDueDatePicker((prev) => !prev);
                        setShowDatePicker(false);
                      }}
                      className="flex w-full items-center justify-between rounded-xl border border-[#42c5f4] bg-[#f6fbfd] px-4 py-3 text-left text-lg font-semibold text-slate-700 shadow-[inset_0_0_0_1px_rgba(66,197,244,0.15)] transition-all duration-200 hover:-translate-y-0.5 hover:scale-[1.01] hover:border-[#38bdf8] hover:shadow-[0_8px_24px_rgba(56,189,248,0.12)]"
                    >
                      <span>{formatDisplayDate(dueDate)}</span>
                      <CalendarDays className="h-5 w-5 text-slate-500" />
                    </button>

                    {showDueDatePicker && (
                      <div className="absolute left-0 top-full z-50 mt-3">
                        <DatePicker
                          value={parseDateValue(dueDate)}
                          onChange={(selectedDate) => {
                            setDueDate(toIsoDate(selectedDate));
                            setShowDueDatePicker(false);
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">Statut</label>
                <select value={status} onChange={(e) => setStatus(e.target.value as InvoiceStatus)} className="w-full sm:w-56 px-3.5 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-brand-500 text-slate-800 dark:text-slate-100 font-medium">
                  <option value="En attente">En attente</option>
                  <option value="Payée">Payée</option>
                  <option value="Impayée">Impayée</option>
                </select>
              </div>
            </Card>
            <Card className="p-6 sm:p-8 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight">2. Lignes de Prestations</h3>
                <Button type="button" variant="outline" size="sm" onClick={addItem}>
                  <Plus className="w-4 h-4" /><span>Ajouter</span>
                </Button>
              </div>
              <div className="space-y-3">
                {items.map((item) => (
                  <div key={item.id} className="grid grid-cols-12 gap-2 items-end p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700">
                    <div className="col-span-12 sm:col-span-5">
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Description</label>
                      <input type="text" value={item.description} onChange={(e) => updateItem(item.id, "description", e.target.value)} placeholder="Prestation..." className="w-full px-3 py-2 rounded-xl text-xs bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-brand-500" />
                    </div>
                    <div className="col-span-4 sm:col-span-2">
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Qte</label>
                      <input type="number" min={1} value={item.quantity} onChange={(e) => updateItem(item.id, "quantity", e.target.value)} className="w-full px-3 py-2 rounded-xl text-xs bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-brand-500" />
                    </div>
                    <div className="col-span-5 sm:col-span-3">
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Prix HT</label>
                      <input type="number" min={0} value={item.unitPrice} onChange={(e) => updateItem(item.id, "unitPrice", e.target.value)} className="w-full px-3 py-2 rounded-xl text-xs bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-brand-500 font-mono" />
                    </div>
                    <div className="col-span-10 sm:col-span-1">
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Total</label>
                      <p className="text-xs font-bold text-slate-900 dark:text-white font-mono py-2">{formatFCFA(item.total)}</p>
                    </div>
                    <div className="col-span-2 sm:col-span-1 flex justify-end">
                      <button type="button" onClick={() => removeItem(item.id)} disabled={items.length === 1} className="p-2 rounded-lg text-slate-300 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition disabled:opacity-30">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
                <div className="w-64 space-y-2 text-xs">
                  <div className="flex justify-between text-slate-500"><span>Sous-total HT</span><span className="font-mono font-semibold">{formatFCFA(subtotalHT)}</span></div>
                  <div className="flex justify-between text-slate-500"><span>TVA (18%)</span><span className="font-mono font-semibold text-brand-600">{formatFCFA(vatAmount)}</span></div>
                  <div className="flex justify-between font-bold text-sm text-slate-900 dark:text-white pt-2 border-t border-slate-200 dark:border-slate-700"><span>TOTAL TTC</span><span className="font-mono text-brand-600">{formatFCFA(totalTTC)}</span></div>
                </div>
              </div>
            </Card>
            <Card className="p-6 space-y-4">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">Notes de paiement</label>
              <textarea rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} className="w-full p-3 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-brand-500 leading-relaxed" />
              <div className="flex justify-end gap-3 pt-2">
                <Button variant="ghost" type="button" onClick={() => router.push(`/invoices/${id}`)}>Annuler</Button>
                <Button type="submit">
                  <Save className="w-4 h-4" />
                  <span>Enregistrer les modifications</span>
                </Button>
              </div>
            </Card>
          </form>
        </main>
      </div>
    </div>

    <Modal
      open={Boolean(dialog)}
      onClose={() => setDialog(null)}
      title={dialog?.title || "Information"}
      description={dialog?.description || ""}
      size="sm"
      variant="success"
    >
      <div className="flex justify-end">
        <Button onClick={() => setDialog(null)}>
          Continuer
        </Button>
      </div>
    </Modal>
    </>
  );
}