"use client";

import React, { useEffect, useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { formatFCFA } from "@/lib/utils";
import { fetchClients, createNewClient, removeClient } from "@/lib/queries";
import { Client } from "@/lib/types";
import {
  Users,
  Plus,
  Search,
  Mail,
  Phone,
  MapPin,
  Building,
  Receipt,
  X,
  Trash2,
} from "lucide-react";

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);
  const [feedback, setFeedback] = useState<{ title: string; description: string } | null>(null);

  // New Client Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("Dakar");
  const [country, setCountry] = useState("Sénégal");
  const [ninea, setNinea] = useState("");

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const data = await fetchClients();
      setClients(data);
      setLoading(false);
    }
    loadData();
  }, []);

  const filtered = clients.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase()) ||
    c.city.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreateClient = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newClient = await createNewClient({
        name,
        email,
        phone,
        city,
        country,
        nineaOrRccm: ninea
      });
      setClients((current) => [newClient, ...current]);
      setModalOpen(false);
      setName("");
      setEmail("");
      setPhone("");
      setNinea("");
      setFeedback({
        title: "Client ajouté avec succès",
        description: `${name} a bien été enregistré dans votre portefeuille clients.`,
      });
    } catch (err) {
      alert("Erreur lors de la création du client");
    }
  };

  const handleDelete = (id: string, name: string) => {
    setDeleteTarget({ id, name });
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await removeClient(deleteTarget.id);
      setClients((current) => current.filter((c) => c.id !== deleteTarget.id));
      setDeleteTarget(null);
      setFeedback({
        title: "Client supprimé",
        description: `${deleteTarget.name} a été retiré de votre répertoire.`,
      });
    } catch (err) {
      alert("Impossible de supprimer ce client (il possède peut-être des factures).");
      setDeleteTarget(null);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-[#F6F8FA] dark:bg-[#090E17] text-slate-500">Chargement des clients depuis Supabase...</div>;
  }

  return (
    <div className="flex min-h-screen bg-[#F6F8FA] dark:bg-[#090E17]">
      <Sidebar className="hidden lg:flex fixed inset-y-0 left-0 z-40" />

      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen">
        <Topbar
          title="Répertoire Clients"
          subtitle="Gérez vos clients, coordonnées fiscales et encaissements"
        />

        <main className="flex-1 p-4 sm:p-7 max-w-7xl w-full mx-auto space-y-6">
          
          {/* Header Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                Clients & Entreprises
              </h2>
              <p className="text-xs text-slate-500">
                {clients.length} clients enregistrés dans votre portefeuille
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Rechercher client, email..."
                  className="w-full pl-9 pr-3.5 py-2 rounded-xl text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-brand-500 shadow-2xs"
                />
              </div>

              <Button onClick={() => setModalOpen(true)} size="sm">
                <Plus className="w-4 h-4" />
                <span>Nouveau Client</span>
              </Button>
            </div>
          </div>

          {/* Client Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filtered.map((client) => (
              <Card
                key={client.id}
                className="hover:shadow-card hover:border-brand-300 dark:hover:border-brand-800 transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-brand-400 text-white font-black text-base flex items-center justify-center shadow-md shadow-brand-500/20">
                      {client.name.substring(0, 2).toUpperCase()}
                    </div>
                    <button
                      onClick={() => handleDelete(client.id, client.name)}
                      className="p-1.5 text-slate-300 hover:text-rose-500 rounded-lg hover:bg-rose-50 transition"
                      title="Supprimer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight mb-1">
                    {client.name}
                  </h3>

                  {client.nineaOrRccm && (
                    <div className="text-[10px] font-mono text-slate-400 mb-3">
                      RCCM / NINEA : {client.nineaOrRccm}
                    </div>
                  )}

                  <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      <span className="truncate">{client.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span>{client.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{client.city}, {client.country}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold">Total Facturé</span>
                    <span className="font-bold text-slate-900 dark:text-white font-mono">{formatFCFA(client.totalInvoiced)}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block font-semibold">Factures</span>
                    <span className="font-bold text-brand-600 dark:text-brand-400">{client.invoicesCount} émises</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>

        </main>
      </div>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Ajouter un nouveau client"
        size="md"
      >
        <form onSubmit={handleCreateClient} className="space-y-4">
          <Input
            label="Nom ou Raison Sociale"
            placeholder="Ex: SONATEL, TotalEnergies, Aya..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Email de contact"
              type="email"
              placeholder="contact@client.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              label="Téléphone (WhatsApp)"
              placeholder="+221 77 000 00 00"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Ville"
              placeholder="Dakar, Abidjan, Douala..."
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
            />
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Pays
              </label>
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium focus:outline-none focus:border-brand-500"
              >
                <option>Sénégal</option>
                <option>Côte d'Ivoire</option>
                <option>Cameroun</option>
                <option>Bénin</option>
                <option>Togo</option>
                <option>Mali</option>
                <option>Burkina Faso</option>
              </select>
            </div>
          </div>

          <Input
            label="Numéro NINEA / RCCM (Optionnel)"
            placeholder="Ex: SN-DKR-2024-B-1234"
            value={ninea}
            onChange={(e) => setNinea(e.target.value)}
          />

          <div className="pt-4 flex items-center justify-end gap-3">
            <Button variant="ghost" type="button" onClick={() => setModalOpen(false)}>
              Annuler
            </Button>
            <Button type="submit">Enregistrer le Client</Button>
          </div>
        </form>
      </Modal>

      <Modal
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        title="Supprimer ce client ?"
        description="Cette action est irréversible. Le client sera retiré du portefeuille et les références associées ne seront plus visibles."
        size="sm"
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
        open={Boolean(feedback)}
        onClose={() => setFeedback(null)}
        title={feedback?.title || "Notification"}
        description={feedback?.description || ""}
        size="sm"
      >
        <div className="flex justify-end">
          <Button onClick={() => setFeedback(null)}>Continuer</Button>
        </div>
      </Modal>

    </div>
  );
}
