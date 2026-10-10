"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  Play,
  ArrowRight,
  CheckCircle2,
  Lock,
  RotateCw,
  LayoutGrid,
  BarChart3,
  Package,
  ShoppingCart,
  CreditCard,
  Receipt,
  Users,
  Bell,
  Settings,
  Moon,
  Sun,
  ShieldCheck,
  TrendingUp,
  MoreHorizontal,
  Clock,
  PlusCircle,
  Eye,
  Trash2,
  Check,
  X,
  FileX,
  Calculator,
  Hourglass,
  Zap,
  Percent,
  Activity,
  Contact,
  Star,
  Facebook,
  Twitter,
  Linkedin,
  MessageCircle,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Dropdown } from "@/components/ui/Dropdown";
import { Modal } from "@/components/ui/Modal";
import { formatFCFA } from "@/lib/utils";
import { initialInvoices } from "@/lib/mockData";
import { Invoice, InvoiceStatus } from "@/lib/types";

const getDefaultCountry = () => {
  const locale =
    typeof navigator !== "undefined"
      ? (navigator.languages?.[0] ?? navigator.language ?? "")
      : "";

  const normalized = locale.toLowerCase();
  const countryMap: Record<string, string[]> = {
    bf: ["bf", "burkina", "burkina faso", "fr-bf"],
    ci: ["ci", "cote d'ivoire", "ivory coast", "fr-ci"],
    cm: ["cm", "cameroon", "fr-cm"],
    ml: ["ml", "mali", "fr-ml"],
    sn: ["sn", "senegal", "fr-sn"],
    ga: ["ga", "gabon", "fr-ga"],
  };

  const detectedRegion = normalized.split("-")[1]?.split("_")[0] ?? "";
  const matchesCountry = Object.entries(countryMap).find(([, aliases]) =>
    aliases.some((alias) => normalized.includes(alias) || detectedRegion === alias)
  );

  return matchesCountry?.[0] ?? "bf";
};

export default function HomePage() {
  const [invoices, setInvoices] = useState<Invoice[]>(initialInvoices);
  const [activeFilter, setActiveFilter] = useState<"all" | InvoiceStatus>("all");
  const [isDark, setIsDark] = useState(false);
  const [registerModalOpen, setRegisterModalOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(getDefaultCountry);

  useEffect(() => {
    const revealItems = document.querySelectorAll("[data-reveal]") as NodeListOf<HTMLElement>;

    if (!revealItems.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.18,
        rootMargin: "0px 0px -40px 0px",
      }
    );

    revealItems.forEach((item) => observer.observe(item));

    return () => observer.disconnect();
  }, []);

  const countries = [
    { label: "Burkina Faso", value: "bf", flag: "https://flagcdn.com/w40/bf.png" },
    { label: "Sénégal", value: "sn", flag: "https://flagcdn.com/w40/sn.png" },
    { label: "Côte d'Ivoire", value: "ci", flag: "https://flagcdn.com/w40/ci.png" },
    { label: "Cameroun", value: "cm", flag: "https://flagcdn.com/w40/cm.png" },
    { label: "Mali", value: "ml", flag: "https://flagcdn.com/w40/ml.png" },
    { label: "Gabon", value: "ga", flag: "https://flagcdn.com/w40/ga.png" },
  ];

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle("dark");
  };

  const filteredInvoices =
    activeFilter === "all"
      ? invoices
      : invoices.filter((i) => i.status === activeFilter);

  const countAll = invoices.length;
  const countPaid = invoices.filter((i) => i.status === "Payée").length;
  const countPending = invoices.filter((i) => i.status === "En attente").length;
  const countUnpaid = invoices.filter((i) => i.status === "Impayée").length;

  return (
    <div className="min-h-screen bg-[#F6F8FA] dark:bg-[#0B1120] text-slate-800 dark:text-slate-100 transition-colors duration-200">
      
      {/* NAVBAR */}
      <header data-reveal className="reveal-item sticky top-0 z-50 backdrop-blur-md bg-white/80 dark:bg-[#0F172A]/80 border-b border-slate-200/80 dark:border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-brand-400 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-brand-500/30 group-hover:scale-105 transition-transform">
              ⚡
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-1">
                Facture&apos;<span className="text-brand-500">Easy</span>
              </span>
              <span className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase -mt-1">
                Vos factures en quelques clics.
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600 dark:text-slate-300">
            <a href="#problemes" className="hover:text-brand-600 transition-colors">Problèmes</a>
            <a href="#fonctionnalites" className="hover:text-brand-600 transition-colors">Fonctionnalités</a>
            <a href="#comment-ca-marche" className="hover:text-brand-600 transition-colors">Comment ça marche</a>
            <a href="#tarifs" className="hover:text-brand-600 transition-colors">Tarifs</a>
            <a href="#temoignages" className="hover:text-brand-600 transition-colors">Témoignages</a>
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 transition"
              aria-label="Theme"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4" />}
            </button>

            <Link href="/login?mode=signup" className="hidden sm:inline-flex">
              <Button variant="outline" size="sm">
                <Play className="w-3.5 h-3.5 text-brand-500 fill-brand-500" />
                <span>Créer mon compte</span>
              </Button>
            </Link>

            <Button
              size="sm"
              onClick={() => setRegisterModalOpen(true)}
              className="px-3.5 py-2 sm:px-4"
            >
              <span>Commencer</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section data-reveal className="reveal-item relative pt-12 pb-20 md:pt-20 md:pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-50 dark:bg-brand-950/60 border border-brand-200 dark:border-brand-800 text-brand-700 dark:text-brand-300 text-xs sm:text-sm font-semibold mb-8 shadow-sm">
            <span className="flex h-2 w-2 rounded-full bg-brand-500 animate-pulse" />
            <span>Conçu pour les entrepreneurs & PME d&apos;Afrique</span>
            <span className="text-brand-500 font-mono">FCFA / TVA 18%</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white max-w-4xl mx-auto leading-[1.12]">
            Fini le casse-tête des factures sur{" "}
            <span className="line-through text-slate-400 dark:text-slate-500 decoration-rose-500/60 decoration-4">Word</span>{" "}
            et{" "}
            <span className="line-through text-slate-400 dark:text-slate-500 decoration-rose-500/60 decoration-4">Excel</span>.
          </h1>

          <div className="mt-5 flex justify-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold tracking-[0.12em] text-emerald-700 uppercase shadow-sm dark:border-emerald-900/70 dark:bg-emerald-950/40 dark:text-emerald-300">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Faites vous payer immédiatement
            </div>
          </div>

          <p className="mt-6 text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
            <strong className="font-semibold text-slate-900 dark:text-white">Facture&apos;Easy</strong> génère des factures professionnelles en FCFA en 2 clics, calcule la TVA à 18% automatiquement et suit vos paiements en direct.
          </p>

          <div data-reveal className="reveal-item mt-9 flex w-full max-w-3xl flex-col items-stretch justify-center gap-4 mx-auto sm:flex-row sm:items-center">
            <Button
              size="lg"
              className="w-full shadow-xl shadow-brand-500/30 sm:w-auto"
              onClick={() => setRegisterModalOpen(true)}
            >
              <Sparkles className="w-5 h-5" />
              <span>Créer mon compte</span>
            </Button>

            <div className="w-full sm:w-auto">
              <Dropdown
                variant="country"
                options={countries}
                value={selectedCountry}
                onChange={setSelectedCountry}
                placeholder="Choisir mon pays"
                className="w-full sm:w-48"
              />
            </div>

            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto"
              onClick={() => setRegisterModalOpen(true)}
            >
              <PlusCircle className="w-4 h-4 text-brand-500" />
              <span>Commencer gratuitement</span>
            </Button>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-brand-500" />
              <span>Aucune carte bancaire requise</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-brand-500" />
              <span>Conforme OHADA & UEMOA / CEMAC</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-brand-500" />
              <span>Export PDF & WhatsApp instantané</span>
            </div>
          </div>

          {/* DASHBOARD PREVIEW WRAPPER */}
          <div className="mt-16 sm:mt-20 relative max-w-6xl mx-auto text-left">
<div data-reveal className="reveal-item rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-dashboard overflow-hidden">
              
              {/* Fake Browser header */}
              <div className="px-6 py-3.5 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#FF5F56]" />
                  <span className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
                  <span className="w-3 h-3 rounded-full bg-[#27C93F]" />
                </div>
                <div className="hidden sm:flex items-center justify-center gap-2 px-6 py-1.5 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-[11px] w-80">
                  <Lock className="w-3 h-3 text-brand-500" />
                  <span>app.factureasy.com/dashboard</span>
                  <RotateCw className="w-3 h-3 text-slate-400 ml-auto" />
                </div>
                <div className="text-xs font-bold text-brand-600">⚡ Live Demo</div>
              </div>

              {/* Dashboard Content Mockup */}
              <div className="p-6 sm:p-8 space-y-6 bg-[#F8FAFC] dark:bg-[#090E17]">
                
                {/* 4 Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-subtle">
                    <span className="text-xs text-slate-500 font-semibold">Total Encaissé</span>
                    <div className="text-2xl font-black text-slate-900 dark:text-white mt-2">
                      7 450 000 <span className="text-xs text-brand-600 font-bold">FCFA</span>
                    </div>
                    <span className="text-[11px] font-bold text-brand-600 mt-1 inline-block">+14.2% ce mois</span>
                  </div>

                  <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-subtle">
                    <span className="text-xs text-slate-500 font-semibold">Total Clients</span>
                    <div className="text-2xl font-black text-slate-900 dark:text-white mt-2">
                      142
                    </div>
                    <span className="text-[11px] font-bold text-brand-600 mt-1 inline-block">+8 nouveaux</span>
                  </div>

                  <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-subtle">
                    <span className="text-xs text-slate-500 font-semibold">TVA (18%) Collectée</span>
                    <div className="text-2xl font-black text-slate-900 dark:text-white mt-2">
                      1 136 440 <span className="text-xs text-slate-400 font-bold">FCFA</span>
                    </div>
                    <span className="text-[11px] font-bold text-brand-600 mt-1 inline-block">100% Conforme DGI</span>
                  </div>

                  <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-subtle">
                    <span className="text-xs text-slate-500 font-semibold">En attente de paiement</span>
                    <div className="text-2xl font-black text-amber-500 mt-2">
                      1 850 000 <span className="text-xs text-slate-400 font-bold">FCFA</span>
                    </div>
                    <span className="text-[11px] font-bold text-amber-600 mt-1 inline-block">4 factures prêtes</span>
                  </div>
                </div>

                {/* Table */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5">
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setActiveFilter("all")}
                        className={`px-3 py-1 rounded-xl text-xs font-bold ${
                          activeFilter === "all" ? "bg-slate-900 text-white dark:bg-slate-700" : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        Toutes ({countAll})
                      </button>
                      <button
                        onClick={() => setActiveFilter("Payée")}
                        className={`px-3 py-1 rounded-xl text-xs font-bold ${
                          activeFilter === "Payée" ? "bg-slate-900 text-white dark:bg-slate-700" : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        Payées ({countPaid})
                      </button>
                      <button
                        onClick={() => setActiveFilter("En attente")}
                        className={`px-3 py-1 rounded-xl text-xs font-bold ${
                          activeFilter === "En attente" ? "bg-slate-900 text-white dark:bg-slate-700" : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        En attente ({countPending})
                      </button>
                    </div>

                    <Link href="/invoices/new">
                      <Button size="sm">
                        <PlusCircle className="w-3.5 h-3.5" />
                        <span>+ Créer Facture</span>
                      </Button>
                    </Link>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 dark:bg-slate-800/80 text-[10px] uppercase font-bold text-slate-400">
                        <tr>
                          <th className="py-2.5 px-3">N° Facture</th>
                          <th className="py-2.5 px-3">Client</th>
                          <th className="py-2.5 px-3">Échéance</th>
                          <th className="py-2.5 px-3">Montant TTC</th>
                          <th className="py-2.5 px-3 text-center">Statut</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-700 font-medium">
                        {filteredInvoices.slice(0, 4).map((inv) => (
                          <tr key={inv.id}>
                            <td className="py-3 px-3 font-mono font-bold text-slate-900 dark:text-white">
                              {inv.invoiceNumber}
                            </td>
                            <td className="py-3 px-3">{inv.clientName}</td>
                            <td className="py-3 px-3 text-slate-400">{inv.dueDate}</td>
                            <td className="py-3 px-3 font-bold">{formatFCFA(inv.totalTTC)}</td>
                            <td className="py-3 px-3 text-center">
                              <Badge status={inv.status} />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>

            </div>
          </div>

        </div>
      </section>

      {/* SECTION PROBLEMES */}
      <section id="problemes" className="py-20 md:py-28 bg-white dark:bg-[#0F172A] border-y border-slate-200/80 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="px-3.5 py-1 rounded-full text-xs font-bold uppercase bg-rose-50 text-rose-600 border border-rose-200">
              Les douleurs du quotidien
            </span>
            <h2 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Pourquoi la facturation manuelle freine votre croissance ?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div data-reveal className="reveal-item rounded-3xl p-8 bg-[#F8FAFC] dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 transition-all duration-500 hover:-translate-y-2 hover:scale-[1.01] hover:shadow-xl dark:hover:border-brand-800">
              <div className="w-14 h-14 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mb-6">
                <FileX className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold mb-3">1. Factures artisanales peu professionnelles</h3>
              <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                Word et Excel ne gèrent pas la numérotation séquentielle et décrédibilisent votre entreprise face aux grands comptes.
              </p>
            </div>

            <div data-reveal className="reveal-item rounded-3xl p-8 bg-[#F8FAFC] dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 transition-all duration-500 hover:-translate-y-2 hover:scale-[1.01] hover:shadow-xl dark:hover:border-brand-800">
              <div className="w-14 h-14 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mb-6">
                <Calculator className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold mb-3">2. Calculs manuels de TVA 18% & erreurs</h3>
              <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                Calculer la TVA à 18% et les acomptes à la calculette entraîne des erreurs et des risques de redressement fiscal.
              </p>
            </div>

            <div data-reveal className="reveal-item rounded-3xl p-8 bg-[#F8FAFC] dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 transition-all duration-500 hover:-translate-y-2 hover:scale-[1.01] hover:shadow-xl dark:hover:border-brand-800">
              <div className="w-14 h-14 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mb-6">
                <Hourglass className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold mb-3">3. Suivi des paiements & relances impossibles</h3>
              <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                Des millions de FCFA restent dehors sans visibilité sur qui a payé par Wave, Orange Money ou virement.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION FONCTIONNALITES */}
      <section id="fonctionnalites" className="py-20 md:py-28 bg-[#F6F8FA] dark:bg-[#0B1120]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="px-3.5 py-1 rounded-full text-xs font-bold uppercase bg-brand-50 text-brand-600 border border-brand-200">
              La solution tout-en-un
            </span>
            <h2 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Tout ce dont vous avez besoin pour facturer
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div data-reveal className="reveal-item bg-white dark:bg-slate-800 rounded-3xl p-8 sm:p-10 border border-slate-200 dark:border-slate-700 transition-all duration-500 hover:-translate-y-2 hover:scale-[1.01] hover:shadow-xl dark:hover:border-brand-800">
              <div className="w-14 h-14 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mb-6">
                <Zap className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold mb-3">1. Factures professionnelles en 2 clics</h3>
              <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                Générez des PDFs élégants avec votre logo, NINEA/RCCM et vos coordonnées Wave, Orange Money et bancaires.
              </p>
            </div>

            <div data-reveal className="reveal-item bg-white dark:bg-slate-800 rounded-3xl p-8 sm:p-10 border border-slate-200 dark:border-slate-700 transition-all duration-500 hover:-translate-y-2 hover:scale-[1.01] hover:shadow-xl dark:hover:border-brand-800">
              <div className="w-14 h-14 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mb-6">
                <Percent className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold mb-3">2. TVA 18% calculée automatiquement</h3>
              <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                Le moteur fiscal calcule en temps réel le montant HT, la TVA 18% et le total TTC en FCFA sans la moindre erreur.
              </p>
            </div>

            <div data-reveal className="reveal-item bg-white dark:bg-slate-800 rounded-3xl p-8 sm:p-10 border border-slate-200 dark:border-slate-700 transition-all duration-500 hover:-translate-y-2 hover:scale-[1.01] hover:shadow-xl dark:hover:border-brand-800">
              <div className="w-14 h-14 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mb-6">
                <Activity className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold mb-3">3. Suivi des paiements en temps réel</h3>
              <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                Visualisez vos factures Payées (Vert), En attente (Bleu) et Impayées (Rouge) et relancez en 1 clic.
              </p>
            </div>

            <div data-reveal className="reveal-item bg-white dark:bg-slate-800 rounded-3xl p-8 sm:p-10 border border-slate-200 dark:border-slate-700 transition-all duration-500 hover:-translate-y-2 hover:scale-[1.01] hover:shadow-xl dark:hover:border-brand-800">
              <div className="w-14 h-14 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mb-6">
                <Contact className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold mb-3">4. Gestion de clients intégrée</h3>
              <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                Centralisez vos contacts, historique de commandes et créances pour chaque client en Afrique.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION TARIFS */}
      <section id="tarifs" className="py-20 md:py-28 bg-white dark:bg-[#0F172A] border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="px-3.5 py-1 rounded-full text-xs font-bold uppercase bg-brand-50 text-brand-600 border border-brand-200">
              Tarification
            </span>
            <h2 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Des forfaits adaptés en Francs CFA
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div data-reveal className="reveal-item rounded-3xl p-8 bg-[#F8FAFC] dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex flex-col justify-between transition-all duration-500 hover:-translate-y-2 hover:scale-[1.01] hover:shadow-xl dark:hover:border-brand-800">
              <div>
                <h3 className="text-xl font-bold">Plan Découverte</h3>
                <div className="my-6">
                  <span className="text-4xl font-extrabold">0</span> <span className="text-xs font-bold text-slate-500">FCFA / mois</span>
                </div>
                <ul className="space-y-3 text-xs">
                  <li>✔ Jusqu'à 5 factures / mois</li>
                  <li>✔ Calcul TVA 18%</li>
                  <li>✔ Export PDF</li>
                </ul>
              </div>
              <Link href="/login" className="mt-8">
                <Button variant="outline" className="w-full">Commencer Gratuitement</Button>
              </Link>
            </div>

            <div data-reveal className="reveal-item relative rounded-3xl p-8 sm:p-10 bg-white dark:bg-slate-800 border-2 border-brand-500 shadow-xl flex flex-col justify-between -translate-y-2 transition-all duration-500 hover:-translate-y-3 hover:scale-[1.01] hover:shadow-2xl">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold bg-brand-500 text-white uppercase">
                🔥 Le plus populaire
              </div>
              <div>
                <h3 className="text-2xl font-bold">Plan Pro</h3>
                <div className="my-6">
                  <span className="text-5xl font-black">5 000</span> <span className="text-xs font-bold text-brand-600">FCFA / mois</span>
                </div>
                <ul className="space-y-3 text-xs font-medium">
                  <li>✔ <strong>Factures & Devis illimités</strong></li>
                  <li>✔ Calcul TVA 18%, BIC, AIRSI</li>
                  <li>✔ Envoi WhatsApp direct & Email</li>
                  <li>✔ Relances automatiques</li>
                  <li>✔ Support prioritaire</li>
                </ul>
              </div>
              <Link href="/login" className="mt-8">
                <Button className="w-full">Choisir le Plan Pro</Button>
              </Link>
            </div>

            <div data-reveal className="reveal-item rounded-3xl p-8 bg-[#F8FAFC] dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex flex-col justify-between transition-all duration-500 hover:-translate-y-2 hover:scale-[1.01] hover:shadow-xl dark:hover:border-brand-800">
              <div>
                <h3 className="text-xl font-bold">Plan Business</h3>
                <div className="my-6">
                  <span className="text-4xl font-extrabold">15 000</span> <span className="text-xs font-bold text-slate-500">FCFA / mois</span>
                </div>
                <ul className="space-y-3 text-xs">
                  <li>✔ Multi-utilisateurs (jusqu'à 10)</li>
                  <li>✔ Gestion multi-entreprises</li>
                  <li>✔ Export comptable SYSCOHADA</li>
                  <li>✔ Tableau de bord KPI complet</li>
                </ul>
              </div>
              <Link href="/login" className="mt-8">
                <Button variant="outline" className="w-full">Choisir Business</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-12 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900 dark:text-white">Facture&apos;Easy</span>
            <span>— SaaS de facturation en Afrique</span>
          </div>
        </div>
      </footer>

      <Modal
        open={registerModalOpen}
        onClose={() => setRegisterModalOpen(false)}
        title="Bienvenue chez Facture'Easy"
        description="Créez votre espace ou connectez-vous pour gérer vos factures, paiements et trésorerie en quelques minutes."
        size="md"
      >
        <div className="space-y-4 sm:space-y-5">
          <div className="rounded-[26px] border border-brand-100 bg-gradient-to-br from-brand-50 via-white to-emerald-50 p-4 sm:p-5 text-left dark:border-brand-900/60 dark:from-brand-950/40 dark:via-slate-900 dark:to-emerald-900/20">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-brand-600 dark:text-brand-300 sm:text-[11px]">
                  Accès rapide
                </p>
                <h4 className="mt-2 text-lg font-black text-slate-900 dark:text-white sm:text-xl">
                  Démarrez votre facturation
                </h4>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-brand-600 shadow-sm ring-1 ring-brand-100 dark:bg-slate-900 dark:text-brand-300 dark:ring-brand-900/60 sm:h-12 sm:w-12">
                <Sparkles className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2 text-[11px] text-slate-600 dark:text-slate-300 sm:text-xs">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/80 px-2.5 py-1 font-semibold ring-1 ring-slate-200 dark:bg-slate-900/60 dark:ring-slate-700">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                Sans carte bancaire
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/80 px-2.5 py-1 font-semibold ring-1 ring-slate-200 dark:bg-slate-900/60 dark:ring-slate-700">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                En moins de 2 min
              </span>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <Link href="/login?mode=signup" onClick={() => setRegisterModalOpen(false)} className="block">
              <Button className="w-full justify-between text-sm sm:text-base">
                <span className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  Créer mon compte
                </span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>

            <Link href="/login?mode=login" onClick={() => setRegisterModalOpen(false)} className="block">
              <Button variant="outline" className="w-full justify-between text-sm sm:text-base">
                <span className="flex items-center gap-2">
                  <Lock className="h-4 w-4 text-brand-500" />
                  Se connecter
                </span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-center text-[11px] font-medium text-slate-600 dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-300 sm:text-xs">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            Facturation, paiements et suivi en temps réel.
          </div>

          <Button variant="ghost" className="w-full" onClick={() => setRegisterModalOpen(false)}>
            Plus tard
          </Button>
        </div>
      </Modal>

    </div>
  );
}
