import { initialClients, initialInvoices } from "@/lib/mockData";
import { Client, Invoice } from "@/lib/types";

const keys = {
  invoices: "factureeasy_invoices",
  clients: "factureeasy_clients",
};

function readStorage<T>(storageKey: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;

  try {
    const raw = window.localStorage.getItem(storageKey);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function getStoredInvoices(): Invoice[] {
  return readStorage<Invoice[]>(keys.invoices, initialInvoices);
}

export function saveStoredInvoices(invoices: Invoice[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(keys.invoices, JSON.stringify(invoices));
}

export function getStoredClients(): Client[] {
  return readStorage<Client[]>(keys.clients, initialClients);
}

export function saveStoredClients(clients: Client[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(keys.clients, JSON.stringify(clients));
}

export function createSafeInvoiceNumber(): string {
  const year = new Date().getFullYear();
  return `INV-${year}-${String(Math.floor(Math.random() * 900) + 100)}`;
}
