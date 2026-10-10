"use client";

import React, { useState, useEffect } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  Building2,
  Receipt,
  CreditCard,
  Save,
  CheckCircle,
  Upload,
  Percent,
} from "lucide-react";

export default function SettingsPage() {
  const [saved, setSaved] = useState(false);

  const [companyName, setCompanyName] = useState("TERANGA DIGITAL SARL");
  const [email, setEmail] = useState("contact@terangadigital.sn");
  const [phone, setPhone] = useState("+221 33 800 00 00");
  const [ninea, setNinea] = useState("008923412");
  const [rccm, setRccm] = useState("SN-DKR-2023-B-110");
  const [address, setAddress] = useState("Avenue Cheikh Anta Diop, Dakar");
  const [currency, setCurrency] = useState("FCFA (XOF)");
  const [defaultVat, setDefaultVat] = useState("18");
  const [wavePhone, setWavePhone] = useState("+221 77 123 45 67");
  const [omPhone, setOmPhone] = useState("+221 78 990 12 34");
  const [iban, setIban] = useState("SN08 SN01 0012 3456 7890 1234 5678");

  const STORAGE_KEY = 'factureeasy_company';

  // Charger depuis localStorage au montage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const data = JSON.parse(stored);
      if (data.companyName) setCompanyName(data.companyName);
      if (data.email) setEmail(data.email);
      if (data.phone) setPhone(data.phone);
      if (data.ninea) setNinea(data.ninea);
      if (data.rccm) setRccm(data.rccm);
      if (data.address) setAddress(data.address);
      if (data.currency) setCurrency(data.currency);
      if (data.defaultVat) setDefaultVat(data.defaultVat);
      if (data.wavePhone) setWavePhone(data.wavePhone);
      if (data.omPhone) setOmPhone(data.omPhone);
      if (data.iban) setIban(data.iban);
    }
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    // Sauvegarder dans localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      companyName, email, phone, ninea, rccm, address,
      currency, defaultVat, wavePhone, omPhone, iban,
    }));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="flex min-h-screen bg-[#F6F8FA] dark:bg-[#090E17]">
      <Sidebar className="hidden lg:flex fixed inset-y-0 left-0 z-40" />

      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen">
        <Topbar
          title="Paramètres de l'Entreprise"
          subtitle="Personnalisez vos coordonnées, taux de TVA et modes de paiement"
        />

        <main className="flex-1 p-4 sm:p-7 max-w-4xl w-full mx-auto space-y-6">
          
          <form onSubmit={handleSave} className="space-y-6">
            
            {/* Section 1: Profil Entreprise */}
            <Card className="p-6 sm:p-8 space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400 flex items-center justify-center">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                    Identité de l'Entreprise
                  </h3>
                  <p className="text-xs text-slate-400">
                    Ces informations apparaîtront sur l'en-tête de toutes vos factures.
                  </p>
                </div>
              </div>

              {/* Logo simulation */}
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-brand-600 to-brand-400 flex items-center justify-center text-white text-3xl font-black shadow-lg shadow-brand-500/20">
                  ⚡
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Logo de la société
                  </label>
                  <p className="text-xs text-slate-400 mb-2">PNG, JPG jusqu'à 2MB (Haute résolution)</p>
                  <Button variant="outline" size="sm" type="button">
                    <Upload className="w-4 h-4" />
                    <span>Changer le logo</span>
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Nom Commercial / Raison Sociale"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  required
                />
                <Input
                  label="Email professionnel"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Input
                  label="Numéro NINEA (Sénégal) ou RCCM / IFU"
                  value={ninea}
                  onChange={(e) => setNinea(e.target.value)}
                  required
                />
                <Input
                  label="Registre du Commerce (RCCM)"
                  value={rccm}
                  onChange={(e) => setRccm(e.target.value)}
                />
                <Input
                  label="Téléphone principal"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
                <Input
                  label="Adresse / Siège social"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                />
              </div>
            </Card>

            {/* Section 2: Fiscalité & Devise */}
            <Card className="p-6 sm:p-8 space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400 flex items-center justify-center">
                  <Receipt className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                    Fiscalité & Devise de Facturation
                  </h3>
                  <p className="text-xs text-slate-400">
                    Configuration des calculs automatiques de TVA en Francs CFA.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Devise par défaut
                  </label>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold focus:outline-none focus:border-brand-500"
                  >
                    <option>FCFA (XOF) — UEMOA (Sénégal, CI, Bénin...)</option>
                    <option>FCFA (XAF) — CEMAC (Cameroun, Gabon...)</option>
                    <option>GNF (Franc Guinéen)</option>
                    <option>EUR (€)</option>
                    <option>USD ($)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Taux de TVA standard
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={defaultVat}
                      onChange={(e) => setDefaultVat(e.target.value)}
                      className="w-full pl-3.5 pr-10 py-2.5 rounded-xl text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold focus:outline-none focus:border-brand-500"
                    />
                    <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                      %
                    </span>
                  </div>
                  <p className="text-[10px] text-brand-600 dark:text-brand-400 font-semibold mt-1">
                    TVA standard UEMOA / CEMAC = 18%
                  </p>
                </div>
              </div>
            </Card>

            {/* Section 3: Modes de Règlement Mobile Money & Banques */}
            <Card className="p-6 sm:p-8 space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400 flex items-center justify-center">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                    Coordonnées de Règlement (Mobile Money & Banque)
                  </h3>
                  <p className="text-xs text-slate-400">
                    Ces comptes seront imprimés en bas de vos factures pour faciliter vos paiements.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Numéro Wave (QR / Transfert)"
                  placeholder="+221 77 123 45 67"
                  value={wavePhone}
                  onChange={(e) => setWavePhone(e.target.value)}
                />
                <Input
                  label="Numéro Orange Money / MTN MoMo"
                  placeholder="+221 78 990 12 34"
                  value={omPhone}
                  onChange={(e) => setOmPhone(e.target.value)}
                />
              </div>

              <Input
                label="IBAN / Numéro de compte Bancaire (RIB)"
                placeholder="SN08 SN01 0012 3456 7890 1234 5678"
                value={iban}
                onChange={(e) => setIban(e.target.value)}
              />
            </Card>

            {/* Save Action */}
            <div className="flex items-center justify-between pt-4">
              {saved && (
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-3.5 py-2 rounded-xl">
                  <CheckCircle className="w-4 h-4" />
                  <span>Paramètres enregistrés avec succès !</span>
                </div>
              )}
              <div className="ml-auto">
                <Button type="submit" size="md">
                  <Save className="w-4 h-4" />
                  <span>Enregistrer les modifications</span>
                </Button>
              </div>
            </div>

          </form>

        </main>
      </div>
    </div>
  );
}
