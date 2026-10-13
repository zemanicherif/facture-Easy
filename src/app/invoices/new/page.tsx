"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { formatFCFA } from "@/lib/utils";
import { fetchClients, createInvoice } from "@/lib/queries";
import { Invoice, InvoiceItem, InvoiceStatus, Client } from "@/lib/types";
import {
  Plus,
  Trash2,
  ArrowLeft,
  Save,
  ShieldCheck,
  Eye,
  Send,
  FileText,
  MessageCircle,
  Mail,
  CalendarDays,
} from "lucide-react";
import { DatePicker } from "@/components/ui/DatePicker";
import { Modal } from "@/components/ui/Modal";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

// --- Composant de Prévisualisation Live "Papier" ---
function InvoicePreview({
  clientName, clientEmail, clientPhone, clientAddress,
  date, dueDate, items, subtotalHT, vatAmount, totalTTC, notes,
  company,
}: any) {
  const previewRef = React.useRef(null);

  return (
    <div className="sticky top-24 w-full max-w-[800px] mx-auto bg-slate-200 dark:bg-slate-950 p-4 sm:p-8 rounded-3xl shadow-inner overflow-hidden">
      <div ref={previewRef} id="invoice-pdf-content" className="bg-white text-slate-900 p-8 sm:p-12 shadow-2xl rounded-sm min-h-[1000px] flex flex-col font-sans relative transition-all duration-500 ease-in-out">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-50 dark:bg-brand-900/10 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />

        <div className="flex justify-between items-start mb-12 relative z-10">
          <div className="w-32 h-16 bg-slate-900 text-white flex items-center justify-center font-black text-lg rounded-lg shadow-lg">
            VOTRE LOGO
          </div>
          <div className="text-right">
            <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tighter mb-1">Facture</h1>
            <p className="text-xs font-mono text-slate-500">N° INV-2026-007</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-12 mb-12 relative z-10">
          <div className="space-y-1 text-xs text-slate-600">
            <p className="font-bold text-slate-900 text-sm">{company?.companyName || "Facture'Easy SAS"}</p>
            <p>{company?.address || "123 Rue de l'Innovation"}</p>
            <p>{company?.email || "contact@factureasy.com"}</p>
            <p>Tél: {company?.phone || "+221 33 000 00 00"}</p>
            <p className="pt-2 font-mono">NINEA: {company?.ninea || "000123456789"}</p>
            {company?.rccm && <p className="font-mono">RCCM: {company.rccm}</p>}
          </div>
          <div className="space-y-1 text-xs text-slate-600 bg-slate-50 p-4 rounded-xl border border-slate-100">
            <p className="font-bold text-slate-900 text-sm mb-1">Facturer à :</p>
            <p className="font-bold text-lg text-slate-900">{clientName || "Nom du client..."}</p>
            <p>{clientEmail || "email@client.com"}</p>
            <p>{clientPhone || "+221 ..."}</p>
            <p>{clientAddress || "Adresse du client..."}</p>
          </div>
        </div>

        <div className="flex gap-8 mb-8 text-xs border-b border-slate-100 pb-4 relative z-10">
          <div>
            <span className="text-slate-400 uppercase font-bold block">Date d'émission</span>
            <span className="font-semibold">{date}</span>
          </div>
          <div>
            <span className="text-slate-400 uppercase font-bold block">Date d'échéance</span>
            <span className="font-semibold">{dueDate}</span>
          </div>
        </div>

        <table className="w-full text-left mb-12 relative z-10">
          <thead>
            <tr className="bg-slate-900 text-white text-[10px] uppercase font-bold">
              <th className="py-3 px-4 rounded-tl-lg">Description</th>
              <th className="py-3 px-4 text-center">Qté</th>
              <th className="py-3 px-4 text-right">Prix Unitaire</th>
              <th className="py-3 px-4 text-right rounded-tr-lg">Total HT</th>
            </tr>
          </thead>
          <tbody className="text-xs divide-y divide-slate-100">
            {items.map((item: any) => (
              <tr key={item.id}>
                <td className="py-4 px-4 font-medium">{item.description || "Prestation..."}</td>
                <td className="py-4 px-4 text-center">{item.quantity}</td>
                <td className="py-4 px-4 text-right font-mono">{formatFCFA(item.unitPrice)}</td>
                <td className="py-4 px-4 text-right font-mono font-bold">{formatFCFA(item.total)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-end relative z-10">
          <div className="w-64 space-y-2">
            <div className="flex justify-between text-xs text-slate-600">
              <span>Total Hors Taxes</span>
              <span className="font-mono font-semibold">{formatFCFA(subtotalHT)}</span>
            </div>
            <div className="flex justify-between text-xs text-slate-600">
              <span>TVA (18%)</span>
              <span className="font-mono font-semibold">{formatFCFA(vatAmount)}</span>
            </div>
            <div className="flex justify-between text-sm font-black text-slate-900 pt-2 border-t border-slate-200">
              <span>TOTAL TTC</span>
              <span className="font-mono text-brand-600">{formatFCFA(totalTTC)}</span>
            </div>
          </div>
        </div>

        <div className="mt-auto pt-12 space-y-8 relative z-10">
          <div className="text-[10px] text-slate-500 italic leading-relaxed">
            <p className="font-bold mb-1 not-italic text-slate-700">Notes :</p>
            {notes}
          </div>
          <div className="flex justify-between items-end">
            <div className="text-[10px] text-slate-400 max-w-xs">
              <p>Conditions de règlement : Paiement à réception.</p>
              <p>TVA non applicable art. 293 B du CGI.</p>
            </div>
            <div className="text-center border-t border-slate-300 w-48 pt-2">
              <p className="text-[10px] font-bold uppercase text-slate-400">Signature & Cachet</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function NewInvoicePage() {
  const router = useRouter();

  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClientId, setSelectedClientId] = useState("");
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [clientAddress, setClientAddress] = useState("");
  const [date, setDate] = useState("2026-02-04");
  const [dueDate, setDueDate] = useState("2026-02-18");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showDueDatePicker, setShowDueDatePicker] = useState(false);
  const datePickerRef = useRef<HTMLDivElement>(null);
  const dueDatePickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target as Node)) {
        setShowDatePicker(false);
      }
      if (dueDatePickerRef.current && !dueDatePickerRef.current.contains(event.target as Node)) {
        setShowDueDatePicker(false);
      }
    }
    if (showDatePicker || showDueDatePicker) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showDatePicker, showDueDatePicker]);
  const [status, setStatus] = useState<InvoiceStatus>("En attente");
  const [notes, setNotes] = useState("Paiement sous 14 jours par Virement, Wave ou Orange Money.");

  useEffect(() => {
    async function loadClients() {
      const data = await fetchClients();
      setClients(data);
      if (data.length > 0) {
        handleClientSelect(data[0].id, data);
      }
    }
    loadClients();
  }, []);

  // Charger les infos entreprise depuis localStorage (Settings)
  const [company, setCompany] = useState<any>(null);
  useEffect(() => {
    const stored = localStorage.getItem('factureeasy_company');
    if (stored) setCompany(JSON.parse(stored));
  }, []);

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

  const [items, setItems] = useState<InvoiceItem[]>([
    {
      id: "item-1",
      description: "Prestation de développement & intégration web",
      quantity: 1,
      unitPrice: 500000,
      total: 500000,
    },
  ]);

  const [showSendMenu, setShowSendMenu] = useState(false);
  const [dialog, setDialog] = useState<{ title: string; description: string; variant?: "success" | "error" } | null>(null);

  const handleClientSelect = (clientId: string, clientsList = clients) => {
    setSelectedClientId(clientId);
    const found = clientsList.find((c) => c.id === clientId);
    if (found) {
      setClientName(found.name);
      setClientEmail(found.email);
      setClientPhone(found.phone);
      setClientAddress(`${found.city}, ${found.country}`);
    }
  };

  const addItem = () => {
    const newItem: InvoiceItem = {
      id: `item-${Date.now()}`,
      description: "",
      quantity: 1,
      unitPrice: 0,
      total: 0,
    };
    setItems([...items, newItem]);
  };

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter((it) => it.id !== id));
    }
  };

  const updateItem = (id: string, field: keyof InvoiceItem, value: any) => {
    setItems(
      items.map((it) => {
        if (it.id !== id) return it;
        const updated = { ...it, [field]: value };
        if (field === "quantity" || field === "unitPrice") {
          const qty = field === "quantity" ? Number(value) : it.quantity;
          const price = field === "unitPrice" ? Number(value) : it.unitPrice;
          updated.total = qty * price;
        }
        return updated;
      })
    );
  };

  const subtotalHT = items.reduce((acc, curr) => acc + curr.total, 0);
  const vatRate = 0.18;
  const vatAmount = subtotalHT * vatRate;
  const totalTTC = subtotalHT + vatAmount;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const invoiceNumber = `INV-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 900) + 100)}`;

    try {
      await createInvoice(
        {
          clientId: selectedClientId,
          invoiceNumber,
          date,
          dueDate,
          subtotalHT,
          vatRate,
          vatAmount,
          totalTTC,
          status,
          notes,
        },
        items.map((item) => ({ ...item, total: item.quantity * item.unitPrice }))
      );

      setDialog({
        title: "Facture créée avec succès",
        description: `La facture ${invoiceNumber} pour ${clientName} (${formatFCFA(totalTTC)} TTC) a bien été enregistrée et est désormais disponible dans la liste.`,
        variant: "success",
      });
      setTimeout(() => router.push("/invoices"), 900);
    } catch (error) {
      setDialog({
        title: "Erreur de sauvegarde",
        description: "Impossible d'enregistrer la facture dans Supabase.",
        variant: "error",
      });
    }
  };

  const [isGenerating, setIsGenerating] = useState(false);

  const sendInvoice = async (method: 'whatsapp' | 'email' | 'pdf') => {
    setShowSendMenu(false);
    setIsGenerating(true);

    try {
      // 1. Capture l'élément HTML de la facture
      const element = document.getElementById('invoice-pdf-content');
      if (!element) throw new Error("Élément de facture introuvable");

      // 2. Conversion HTML -> Canvas -> Image
      const canvas = await html2canvas(element, {
        scale: 2, // Haute résolution
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/jpeg', 1.0);

      // 3. Création du PDF avec jsPDF
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: 'a4'
      });

      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);

      const pdfFileName = `Facture_${clientName.replace(/\s+/g, '_')}.pdf`;

      if (method === 'pdf') {
        // ── Téléchargement simple ──
        pdf.save(pdfFileName);
        setDialog({
          title: "PDF téléchargé",
          description: `Le document ${pdfFileName} est prêt à être partagé ou enregistré.`,
          variant: "success",
        });

      } else if (method === 'whatsapp') {
        // ── WhatsApp : PDF directement joint dans le message ──

        const invoiceRef = `INV-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 900) + 100)}`;
        const whatsappMessage = `Bonjour 👋\n\nVeuillez trouver ci-joint la facture *${invoiceRef}* établie au nom de *${clientName}*.\n\n💰 Montant : *${formatFCFA(totalTTC)} TTC* (TVA 18% incluse)\n📅 Échéance : ${dueDate}\n\nCordialement,\nFacture'Easy`;

        // Convertir le PDF en File (pour le partage natif)
        const pdfBlob = pdf.output('blob');
        const pdfFile = new File([pdfBlob], pdfFileName, { type: 'application/pdf' });

        // ✅ Sur MOBILE (Android/iOS) : navigator.share() joint le PDF directement dans WhatsApp
        const canShare = typeof navigator.share === 'function' && navigator.canShare && navigator.canShare({ files: [pdfFile] });

        if (canShare) {
          // MOBILE : le share sheet natif s'ouvre → PDF pré-joint → choisir contact WhatsApp
          await navigator.share({
            files: [pdfFile],
            text: whatsappMessage,
          });
        } else {
          // PC : télécharge le PDF + ouvre WhatsApp Web
          pdf.save(pdfFileName);
          const encodedMsg = encodeURIComponent(whatsappMessage);
          setTimeout(() => {
            window.open(`https://web.whatsapp.com/`, '_blank');
          }, 600);
          setTimeout(() => {
            setDialog({
              title: "WhatsApp prêt à l’emploi",
              description: `Le PDF ${pdfFileName} a été téléchargé. Ouvrez WhatsApp Web, choisissez le contact puis joignez le fichier depuis l’option de pièce jointe.`,
              variant: "success",
            });
          }, 1200);
        }

      } else if (method === 'email') {
        // ── Email : ① Télécharge le PDF ② Ouvre le client mail ──
        pdf.save(pdfFileName);

        const subject = encodeURIComponent(`Facture - ${clientName} - ${formatFCFA(totalTTC)} TTC`);
        const body = encodeURIComponent(
          `Bonjour,\n\nVeuillez trouver en pièce jointe la facture d'un montant de ${formatFCFA(totalTTC)} TTC (TVA 18% incluse).\n\nLe fichier "${pdfFileName}" vient d'être téléchargé sur votre appareil.\n\nCordialement,\nFacture'Easy`
        );
        setDialog({
          title: "Email préparé",
          description: `Votre client ${clientEmail} recevra la facture ${pdfFileName} depuis son client mail par défaut.`,
          variant: "success",
        });
        setTimeout(() => {
          window.location.href = `mailto:${clientEmail}?subject=${subject}&body=${body}`;
        }, 800);
      }
    } catch (error: any) {
      // Ignorer si l'utilisateur annule le partage volontairement
      if (error?.name === 'AbortError') return;
      console.error("Erreur PDF:", error);
      setDialog({
        title: "Erreur de génération",
        description: error?.message || "Une erreur est survenue pendant la génération du document.",
        variant: "error",
      });
    } finally {
      setIsGenerating(false);
    }
  };


  return (
    <>
    <div className="flex min-h-screen bg-[#F6F8FA] dark:bg-[#090E17]">
      <Sidebar className="hidden lg:flex fixed inset-y-0 left-0 z-40" />

      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen">
        <Topbar
          title="Créer une Facture"
          subtitle="Saisissez vos données et voyez votre facture se générer en temps réel"
        />

        <main className="flex-1 p-4 sm:p-7">
          <div className="flex items-center justify-between mb-6">
            <Link
              href="/invoices"
              className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Retour aux factures</span>
            </Link>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-brand-50 dark:bg-brand-950 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800">
              <ShieldCheck className="w-4 h-4 text-brand-500" />
              <span>Devise : Franc CFA • TVA 18%</span>
            </span>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-start">
            <form onSubmit={handleSubmit} className="space-y-6">
              <Card className="p-6 sm:p-8 space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight">
                    1. Informations Client & Facture
                  </h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="col-span-1 sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Client
                    </label>
                    <select
                      value={selectedClientId}
                      onChange={(e) => handleClientSelect(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-brand-500 font-medium"
                    >
                      {clients.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name} ({c.city}, {c.country})
                        </option>
                      ))}
                    </select>
                  </div>
                  <Input
                    label="Nom complet / Entreprise"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    required
                  />
                  <Input
                    label="Email"
                    type="email"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    required
                  />
                  <Input
                    label="Téléphone"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                  />
                  <Input
                    label="Adresse"
                    value={clientAddress}
                    onChange={(e) => setClientAddress(e.target.value)}
                  />
                  <div className="space-y-2">
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Date d&apos;émission
                    </label>
                    <div className="relative" ref={datePickerRef}>
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

                </div>
              </Card>

              <Card className="p-6 sm:p-8 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight">
                    2. Lignes de Prestations
                  </h3>
                  <button
                    type="button"
                    onClick={addItem}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/60 hover:bg-brand-100 transition"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Ajouter</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {items.map((item) => (
                    <div key={item.id} className="grid grid-cols-12 gap-2 items-center bg-slate-50/70 dark:bg-slate-800/40 p-3 rounded-2xl border border-slate-200/60 dark:border-slate-700/60">
                      <div className="col-span-12 sm:col-span-6">
                        <input
                          type="text"
                          placeholder="Description..."
                          value={item.description}
                          onChange={(e) => updateItem(item.id, "description", e.target.value)}
                          required
                          className="w-full px-3 py-2 rounded-xl text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-brand-500 font-medium"
                        />
                      </div>
                      <div className="col-span-3 sm:col-span-2">
                        <input
                          type="number"
                          placeholder="Qté"
                          value={item.quantity}
                          onChange={(e) => updateItem(item.id, "quantity", e.target.value)}
                          required
                          className="w-full px-3 py-2 rounded-xl text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-brand-500 font-medium"
                        />
                      </div>
                      <div className="col-span-3 sm:col-span-3">
                        <input
                          type="number"
                          placeholder="Prix HT"
                          value={item.unitPrice}
                          onChange={(e) => updateItem(item.id, "unitPrice", e.target.value)}
                          required
                          className="w-full px-3 py-2 rounded-xl text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-brand-500 font-bold"
                        />
                      </div>
                      <div className="col-span-6 sm:col-span-1 text-right">
                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          disabled={items.length === 1}
                          className="p-1.5 text-slate-400 hover:text-rose-500 disabled:opacity-30"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="p-6 space-y-4">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Notes de paiement
                </label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full p-3 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-brand-500 leading-relaxed"
                />
                <div className="flex justify-end gap-3 pt-4 relative">
                  <Button variant="ghost" type="button" onClick={() => router.push("/invoices")}>
                    Annuler
                  </Button>

                  <div className="relative">
                    <Button
                      variant="outline"
                      type="button"
                      onClick={() => setShowSendMenu(!showSendMenu)}
                      className="flex items-center gap-2"
                      disabled={isGenerating}
                    >
                      {isGenerating ? (
                        <div className="w-4 h-4 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Send className="w-4 h-4 text-brand-500" />
                      )}
                      <span>{isGenerating ? "Génération..." : "Envoyer"}</span>
                    </Button>

                    {showSendMenu && (
                      <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl z-50 overflow-hidden p-1 animate-in fade-in zoom-in duration-200">
                        <button
                          onClick={() => sendInvoice('whatsapp')}
                          className="w-full flex items-center gap-3 px-3 py-2 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition"
                        >
                          <MessageCircle className="w-4 h-4 text-green-500" />
                          WhatsApp (PDF)
                        </button>
                        <button
                          onClick={() => sendInvoice('email')}
                          className="w-full flex items-center gap-3 px-3 py-2 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition"
                        >
                          <Mail className="w-4 h-4 text-blue-500" />
                          Email (PDF)
                        </button>
                        <button
                          onClick={() => sendInvoice('pdf')}
                          className="w-full flex items-center gap-3 px-3 py-2 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition"
                        >
                          <FileText className="w-4 h-4 text-rose-500" />
                          Télécharger PDF
                        </button>
                      </div>
                    )}
                  </div>

                  <Button type="submit" size="md">
                    <Save className="w-4 h-4" />
                    <span>Enregistrer la facture</span>
                  </Button>
                </div>
              </Card>
            </form>

            <div className="hidden xl:block">
              <div className="flex items-center gap-2 mb-4 text-slate-500">
                <Eye className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">Aperçu en temps réel</span>
              </div>
              <InvoicePreview
                clientName={clientName}
                clientEmail={clientEmail}
                clientPhone={clientPhone}
                clientAddress={clientAddress}
                date={date}
                dueDate={dueDate}
                items={items}
                subtotalHT={subtotalHT}
                vatAmount={vatAmount}
                totalTTC={totalTTC}
                notes={notes}
                company={company}
              />
            </div>
          </div>
        </main>
      </div>
    </div>

    <Modal
      open={Boolean(dialog)}
      onClose={() => setDialog(null)}
      title={dialog?.title || "Information"}
      description={dialog?.description || ""}
      size="sm"
      variant={dialog?.variant || "success"}
    >
      <div className="flex justify-end">
        <Button onClick={() => setDialog(null)}>
          {dialog?.variant === "error" ? "Réessayer" : "Continuer"}
        </Button>
      </div>
    </Modal>
    </>
  );
}
