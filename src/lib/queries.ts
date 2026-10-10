import { createClient } from './supabase/client'
import type { Invoice, Client, InvoiceItem, InvoiceStatus } from './types'

export async function fetchInvoices(): Promise<Invoice[]> {
  const supabase = createClient()
  const { data: invoicesData, error } = await supabase
    .from('invoices')
    .select(`
      *,
      clients (
        name,
        email,
        phone,
        city,
        country
      ),
      invoice_items (*)
    `)
    .order('created_at', { ascending: false })

  if (error) {
    console.error("Error fetching invoices:", error)
    return []
  }

  // Map database format to frontend Invoice type
  return invoicesData.map((inv: any) => ({
    id: inv.id,
    invoiceNumber: inv.invoice_number,
    clientId: inv.client_id,
    clientName: inv.clients?.name || 'Inconnu',
    clientEmail: inv.clients?.email || '',
    clientPhone: inv.clients?.phone || '',
    clientAddress: inv.clients?.city ? `${inv.clients.city}, ${inv.clients.country}` : '',
    date: inv.date,
    dueDate: inv.due_date,
    items: inv.invoice_items.map((item: any) => ({
      id: item.id,
      description: item.description,
      quantity: item.quantity,
      unitPrice: item.unit_price,
      total: item.total
    })),
    subtotalHT: inv.subtotal_ht,
    vatRate: inv.vat_rate,
    vatAmount: inv.vat_amount,
    totalTTC: inv.total_ttc,
    status: inv.status as InvoiceStatus,
    notes: inv.notes || undefined,
  }))
}

export async function deleteInvoice(id: string) {
  const supabase = createClient()
  const { error } = await supabase.from('invoices').delete().eq('id', id)
  if (error) throw error
}

export async function updateInvoiceStatus(id: string, status: InvoiceStatus) {
  const supabase = createClient()
  const { error } = await supabase.from('invoices').update({ status }).eq('id', id)
  if (error) throw error
}

export async function fetchClients(): Promise<Client[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error("Error fetching clients:", error)
    return []
  }

  return data.map((c: any) => ({
    id: c.id,
    name: c.name,
    email: c.email,
    phone: c.phone || '',
    city: c.city || '',
    country: c.country || '',
    nineaOrRccm: c.ninea_or_rccm || '',
    totalInvoiced: 0,
    totalPaid: 0,
    invoicesCount: 0,
  }))
}

export async function createNewClient(client: Partial<Client>) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Utilisateur non connecté")

  const { data, error } = await supabase.from('clients').insert([{
    user_id: user.id,
    name: client.name || '',
    email: client.email || '',
    phone: client.phone || '',
    city: client.city || '',
    country: client.country || '',
    ninea_or_rccm: client.nineaOrRccm || ''
  }]).select().single()

  if (error) throw error
  return {
    id: data.id,
    name: data.name,
    email: data.email,
    phone: data.phone || '',
    city: data.city || '',
    country: data.country || '',
    nineaOrRccm: data.ninea_or_rccm || '',
    totalInvoiced: 0,
    totalPaid: 0,
    invoicesCount: 0,
  } as Client
}

export async function removeClient(id: string) {
  const supabase = createClient()
  const { error } = await supabase.from('clients').delete().eq('id', id)
  if (error) throw error
}

export async function createInvoice(
  invoice: Partial<Invoice>, 
  items: Partial<InvoiceItem>[]
) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Utilisateur non connecté")

  const { data: invData, error: invError } = await supabase.from('invoices').insert([{
    user_id: user.id,
    client_id: invoice.clientId || '',
    invoice_number: invoice.invoiceNumber || '',
    date: invoice.date || '',
    due_date: invoice.dueDate || '',
    subtotal_ht: invoice.subtotalHT || 0,
    vat_rate: invoice.vatRate || 0,
    vat_amount: invoice.vatAmount || 0,
    total_ttc: invoice.totalTTC || 0,
    status: invoice.status || 'En attente',
    notes: invoice.notes,
  }]).select().single()

  if (invError) throw invError

  const itemsToInsert = items.map(item => ({
    invoice_id: invData.id,
    description: item.description || '',
    quantity: item.quantity || 1,
    unit_price: item.unitPrice || 0,
    total: item.total || 0
  }))

  const { error: itemsError } = await supabase.from('invoice_items').insert(itemsToInsert)
  if (itemsError) throw itemsError

  return invData.id
}

export async function fetchInvoiceById(id: string): Promise<Invoice | null> {
  const supabase = createClient()
  const { data: inv, error } = await supabase
    .from('invoices')
    .select(`
      *,
      clients (
        name,
        email,
        phone,
        city,
        country
      ),
      invoice_items (*)
    `)
    .eq('id', id)
    .single()

  if (error || !inv) {
    return null
  }

  return {
    id: inv.id,
    invoiceNumber: inv.invoice_number,
    clientId: inv.client_id,
    clientName: inv.clients?.name || 'Inconnu',
    clientEmail: inv.clients?.email || '',
    clientPhone: inv.clients?.phone || '',
    clientAddress: inv.clients?.city ? `${inv.clients.city}, ${inv.clients.country}` : '',
    date: inv.date,
    dueDate: inv.due_date,
    items: inv.invoice_items.map((item: any) => ({
      id: item.id,
      description: item.description,
      quantity: item.quantity,
      unitPrice: item.unit_price,
      total: item.total
    })),
    subtotalHT: inv.subtotal_ht,
    vatRate: inv.vat_rate,
    vatAmount: inv.vat_amount,
    totalTTC: inv.total_ttc,
    status: inv.status as InvoiceStatus,
    notes: inv.notes || undefined,
  }
}
