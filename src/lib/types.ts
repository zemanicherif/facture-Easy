export type InvoiceStatus =
  | "Payée"
  | "En attente"
  | "Impayée"
  | "Envoyée"
  | "En retard"
  | "Brouillon";

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  clientId: string;
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  clientAddress?: string;
  date: string;
  dueDate: string;
  items: InvoiceItem[];
  subtotalHT: number;
  vatRate: number; // e.g. 0.18
  vatAmount: number;
  totalTTC: number;
  status: InvoiceStatus;
  notes?: string;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  country: string;
  nineaOrRccm?: string;
  totalInvoiced: number;
  totalPaid: number;
  invoicesCount: number;
}
