"use client";

import React, { useEffect, useRef, useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { fetchInvoiceById, updateInvoiceStatus } from "@/lib/queries";
import { formatFCFA } from "@/lib/utils";
import { InvoiceStatus, Invoice } from "@/lib/types";
import {
  ArrowLeft,
  Printer,
  Download,
  Share2,
  CheckCircle,
  MessageCircle,
  Mail,
  Building,
  Calendar,
  ChevronDown,
  CircleCheckBig,
  Clock3,
  AlertTriangle,
  FileText,
} from "lucide-react";

export default function InvoiceDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const [found, setFound] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<InvoiceStatus>("En attente");
  const [isSharing, setIsSharing] = useState(false);
  const [isStatusMenuOpen, setIsStatusMenuOpen] = useState(false);
  const [dialog, setDialog] = useState<{ title: string; description: string; variant?: "success" | "error" } | null>(null);
  const statusMenuRef = useRef<HTMLDivElement | null>(null);

  const statusOptions: { value: InvoiceStatus; label: string; icon: React.ReactNode }[] = [
    { value: "Envoyée", label: "Envoyée", icon: <FileText className="h-3.5 w-3.5" /> },
    { value: "Payée", label: "Payée", icon: <CircleCheckBig className="h-3.5 w-3.5" /> },
    { value: "En retard", label: "En retard", icon: <AlertTriangle className="h-3.5 w-3.5" /> },
    { value: "Brouillon", label: "Brouillon", icon: <Clock3 className="h-3.5 w-3.5" /> },
  ];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (statusMenuRef.current && !statusMenuRef.current.contains(event.target as Node)) {
        setIsStatusMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const data = await fetchInvoiceById(id);
      setFound(data);
      if (data) setStatus(data.status);
      setLoading(false);
    }
    load();
  }, [id]);

  const handleStatusChange = async (nextStatus: InvoiceStatus) => {
    setStatus(nextStatus);
    await updateInvoiceStatus(id, nextStatus);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShareWhatsApp = async () => {
    if (!found) return;
    setIsSharing(true);
    try {
      const element = document.getElementById('invoice-detail-content');
      if (!element) throw new Error("Contenu de la facture introuvable");

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
      });

      const imgData = canvas.toDataURL('image/jpeg', 1.0);
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'px', format: 'a4' });
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);

      const pdfFileName = `Facture_${found.invoiceNumber}_${found.clientName.replace(/\s+/g, '_')}.pdf`;
      const whatsappMessage = `Bonjour ${found.clientName} 👋\n\nVeuillez trouver ci-joint votre facture *${found.invoiceNumber}* d'un montant de *${formatFCFA(found.totalTTC)} TTC* (TVA 18% incluse).\n\n📅 Échéance : ${found.dueDate}\n\nCordialement,\nFacture'Easy`;

      const pdfBlob = pdf.output('blob');
      const pdfFile = new File([pdfBlob], pdfFileName, { type: 'application/pdf' });

      // ✅ MOBILE : navigator.share() joint le PDF directement dans WhatsApp
      const canShare = typeof navigator.share === 'function' && navigator.canShare && navigator.canShare({ files: [pdfFile] });

      if (canShare) {
        await navigator.share({ files: [pdfFile], text: whatsappMessage });
      } else {
        // PC : télécharge le PDF + ouvre WhatsApp Web
        pdf.save(pdfFileName);
        setTimeout(() => { window.open('https://web.whatsapp.com/', '_blank'); }, 600);
        setTimeout(() => {
          setDialog({
            title: "WhatsApp prêt à l’emploi",
            description: `Le PDF ${pdfFileName} a bien été téléchargé. Ouvrez WhatsApp Web, choisissez le contact puis joignez le fichier depuis le bouton pièce jointe.`,
            variant: "success",
          });
        }, 1200);
      }
    } catch (error: any) {
      if (error?.name === 'AbortError') return;
      setDialog({
        title: "Erreur de partage",
        description: error?.message || "Le document n’a pas pu être généré.",
        variant: "error",
      });
    } finally {
      setIsSharing(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-[#F6F8FA] dark:bg-[#090E17] text-slate-500">Chargement de la facture...</div>;
  }

  if (!found) {
    return <div className="min-h-screen flex items-center justify-center bg-[#F6F8FA] dark:bg-[#090E17] text-slate-500">Facture introuvable.</div>;
  }

  return (
    <>
    <div className="flex min-h-screen bg-[#F6F8FA] dark:bg-[#090E17]">
      <Sidebar className="hidden lg:flex fixed inset-y-0 left-0 z-40 print:hidden" />

      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen">
        <Topbar
          title={`Facture ${found.invoiceNumber}`}
          subtitle={`Client: ${found.clientName}`}
        />

        <main className="flex-1 p-4 sm:p-7 max-w-4xl w-full mx-auto space-y-6">
          
          {/* Top Actions Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 print:hidden">
            <Link
              href="/invoices"
              className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Retour à la liste</span>
            </Link>

            <div className="flex flex-wrap items-center gap-2">
              <div className="relative" ref={statusMenuRef}>
                <button
                  type="button"
                  onClick={() => setIsStatusMenuOpen((prev) => !prev)}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:border-brand-500 hover:text-brand-600"
                >
                  <span>Changer statut</span>
                  <ChevronDown className={`h-3.5 w-3.5 transition-transform ${isStatusMenuOpen ? "rotate-180" : ""}`} />
                </button>

                {isStatusMenuOpen && (
                  <div className="absolute right-0 top-full z-20 mt-3 w-64 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl">
                    <div className="px-2 pb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Action rapide</div>
                    <div className="space-y-1">
                      {statusOptions.map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => {
                            handleStatusChange(option.value);
                            setIsStatusMenuOpen(false);
                          }}
                          className={`flex w-full items-center justify-between rounded-xl px-2.5 py-2 text-left text-xs font-medium transition ${status === option.value ? "bg-brand-50 text-brand-700" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"}`}
                        >
                          <span className="flex items-center gap-2">
                            <span className={`flex h-6 w-6 items-center justify-center rounded-lg ${status === option.value ? "bg-brand-100 text-brand-700" : "bg-slate-100 text-slate-500"}`}>
                              {option.icon}
                            </span>
                            <span>Marquer comme</span>
                          </span>
                          <span className="font-semibold">{option.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <Button variant="outline" size="sm" onClick={handleShareWhatsApp} disabled={isSharing}>
                <MessageCircle className="w-4 h-4 text-emerald-600" />
                <span>{isSharing ? 'Génération PDF...' : 'Télécharger'}</span>
              </Button>

              <Button variant="outline" size="sm" onClick={handlePrint}>
                <Printer className="w-4 h-4 text-slate-600" />
                <span>Modifier</span>
              </Button>
            </div>
          </div>

          {/* REALISTIC INVOICE SHEET (Paper Style) */}
          <div id="invoice-detail-content" className="bg-white dark:bg-slate-900 rounded-3xl p-8 sm:p-12 border border-slate-200/90 dark:border-slate-800 shadow-dashboard space-y-8 print:shadow-none print:border-none print:p-0">
            
            {/* Invoice Top Header */}
            <div className="flex flex-col sm:flex-row justify-between gap-6 pb-8 border-b border-slate-100 dark:border-slate-800">
              
              {/* Emetteur */}
              <div className="space-y-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-brand-500 text-white font-bold flex items-center justify-center text-base">
                    ⚡
                  </div>
                  <span className="font-extrabold text-xl text-slate-900 dark:text-white tracking-tight">
                    Facture&apos;<span className="text-brand-500">Easy</span>
                  </span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  <strong>TERANGA DIGITAL SARL</strong><br />
                  NINEA : 008923412 • RCCM : SN-DKR-2023-B-110<br />
                  Avenue Cheikh Anta Diop, Dakar, Sénégal<br />
                  contact@terangadigital.sn • +221 33 800 00 00
                </p>
              </div>

              {/* Numéro & Statut */}
              <div className="sm:text-right space-y-2">
                <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                  FACTURE
                </h2>
                <p className="text-xs font-mono font-bold text-slate-600 dark:text-slate-300">
                  N° {found.invoiceNumber}
                </p>
                <div>
                  <Badge status={status} className="text-xs" />
                </div>
              </div>

            </div>

            {/* Client & Date Meta */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
                <span className="text-[10px] font-bold uppercase text-slate-400">Facturé à :</span>
                <p className="font-extrabold text-sm text-slate-900 dark:text-white">{found.clientName}</p>
                <p className="text-slate-500">{found.clientEmail}</p>
                <p className="text-slate-500">{found.clientPhone}</p>
                <p className="text-slate-500">{found.clientAddress}</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Date d'émission :</span>
                  <span className="font-bold text-slate-900 dark:text-white">{found.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Date d'échéance :</span>
                  <span className="font-bold text-slate-900 dark:text-white">{found.dueDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Devise :</span>
                  <span className="font-bold text-brand-600 dark:text-brand-400">FCFA (XOF)</span>
                </div>
              </div>
            </div>

            {/* Items Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  <tr>
                    <th className="py-3 px-3 rounded-l-xl">Description</th>
                    <th className="py-3 px-3 text-center">Qté</th>
                    <th className="py-3 px-3 text-right">Prix Unitaire HT</th>
                    <th className="py-3 px-3 text-right rounded-r-xl">Total HT</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                  {found.items.map((it: any, idx: number) => (
                    <tr key={idx}>
                      <td className="py-3.5 px-3 font-semibold text-slate-800 dark:text-slate-200">
                        {it.description}
                      </td>
                      <td className="py-3.5 px-3 text-center text-slate-600 dark:text-slate-400">
                        {it.quantity}
                      </td>
                      <td className="py-3.5 px-3 text-right font-mono text-slate-600 dark:text-slate-400">
                        {formatFCFA(it.unitPrice)}
                      </td>
                      <td className="py-3.5 px-3 text-right font-mono font-bold text-slate-900 dark:text-white">
                        {formatFCFA(it.total)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Calculations Total Footer */}
            <div className="flex flex-col sm:flex-row justify-between gap-6 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs">
              
              <div className="max-w-xs space-y-2">
                <p className="font-bold text-slate-700 dark:text-slate-300">Instructions de paiement :</p>
                <p className="text-slate-500 leading-relaxed text-[11px]">
                  {found.notes || "Paiement par Virement Bancaire (Ecobank / CBAO) ou Mobile Money (Wave / Orange Money)."}
                </p>
              </div>

              <div className="w-full sm:w-72 space-y-2.5">
                <div className="flex justify-between text-slate-600 dark:text-slate-300">
                  <span>Sous-total HT :</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">{formatFCFA(found.subtotalHT)}</span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-300">
                  <span>TVA (18% légale) :</span>
                  <span className="font-mono font-bold text-brand-600 dark:text-brand-400">{formatFCFA(found.vatAmount)}</span>
                </div>
                <div className="pt-2.5 border-t border-slate-200 dark:border-slate-700 flex justify-between items-baseline font-extrabold text-sm">
                  <span className="text-slate-900 dark:text-white">Total TTC :</span>
                  <span className="text-lg font-black text-brand-600 dark:text-brand-400 font-mono">{formatFCFA(found.totalTTC)}</span>
                </div>
              </div>

            </div>

            {/* Footer stamp notice */}
            <div className="pt-6 border-t border-slate-100 dark:border-slate-800 text-[10px] text-slate-400 text-center">
              Facture établie conformément aux dispositions fiscales de l'OHADA et de l'UEMOA. Merci de votre confiance !
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
