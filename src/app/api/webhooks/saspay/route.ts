import crypto from 'crypto'
import { NextResponse } from 'next/server'

import { createAdminClient } from '@/lib/supabase/admin'
import { updateUserPlanStatus } from '@/lib/saspay'

const MAX_WEBHOOK_AGE_SECONDS = 300

function isValidSignature(rawBody: string, signatureHeader: string, timestampHeader: string, secret: string) {
  if (!signatureHeader || !timestampHeader) {
    return false
  }

  const now = Math.floor(Date.now() / 1000)
  const timestamp = Number(timestampHeader)

  if (!Number.isFinite(timestamp) || Math.abs(now - timestamp) > MAX_WEBHOOK_AGE_SECONDS) {
    return false
  }

  const expected = crypto
    .createHmac('sha256', secret)
    .update(`${timestampHeader}.${rawBody}`)
    .digest('hex')

  const a = Buffer.from(signatureHeader)
  const b = Buffer.from(expected)

  if (a.length !== b.length) {
    return false
  }

  return crypto.timingSafeEqual(a, b)
}

export async function POST(request: Request) {
  const secret = process.env.SASPAY_WEBHOOK_SECRET

  if (!secret) {
    return NextResponse.json({ ok: false, error: 'Webhook secret missing' }, { status: 500 })
  }

  const rawBody = await request.text()
  const signature = request.headers.get('x-webhook-signature') || ''
  const timestamp = request.headers.get('x-webhook-timestamp') || ''
  const eventName = request.headers.get('x-webhook-event') || ''

  if (!isValidSignature(rawBody, signature, timestamp, secret)) {
    return NextResponse.json({ ok: false, error: 'Invalid signature' }, { status: 401 })
  }

  let payload: any = null

  try {
    payload = JSON.parse(rawBody)
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON payload' }, { status: 400 })
  }

  const event = payload.event || eventName
  const data = payload.data || {}
  const providerPaymentId = data.id || null
  const providerReference = data.reference || null
  const providerStatus = String(data.status || '').toUpperCase()
  const admin = createAdminClient()

  if (!providerPaymentId && !providerReference) {
    return NextResponse.json({ ok: true, ignored: true })
  }

  let query = admin.from('payments').select('*')

  if (providerPaymentId) {
    query = query.eq('provider_payment_id', providerPaymentId)
  } else {
    query = query.eq('provider_reference', providerReference)
  }

  const { data: existing, error: existingError } = await query.maybeSingle()

  if (existingError && existingError.code !== 'PGRST116') {
    throw existingError
  }

  if (existing && ['paid', 'failed', 'cancelled', 'expired'].includes(existing.status)) {
    return NextResponse.json({ ok: true, idempotent: true, payment_id: existing.id })
  }

  const { data: pendingPayments, error: pendingError } = await admin
    .from('payments')
    .select('*')
    .eq('status', 'pending')
    .order('created_at', { ascending: false })
    .limit(10)

  if (pendingError) {
    throw pendingError
  }

  const payment = existing || pendingPayments?.[0] || null

  if (!payment) {
    return NextResponse.json({ ok: true, ignored: true })
  }

  const nextStatus = event === 'transaction.success' || providerStatus === 'SUCCESS' ? 'paid'
    : event === 'transaction.failed' || providerStatus === 'FAILED' ? 'failed'
    : event === 'transaction.cancelled' || providerStatus === 'CANCELLED' ? 'cancelled'
    : event === 'transaction.created' ? 'pending'
    : payment.status

  const paidAt = nextStatus === 'paid' ? new Date().toISOString() : null
  const existingMetadata =
    typeof payment.metadata === 'object' && payment.metadata !== null && !Array.isArray(payment.metadata)
      ? (payment.metadata as Record<string, unknown>)
      : {}

  const { error: updateError } = await admin.from('payments').update({
    status: nextStatus,
    provider_payment_id: providerPaymentId || payment.provider_payment_id,
    provider_reference: providerReference || payment.provider_reference,
    provider_event: event,
    paid_at: paidAt,
    updated_at: new Date().toISOString(),
    metadata: {
      ...existingMetadata,
      webhook_event: event,
      webhook_status: providerStatus,
      provider_payment_id: providerPaymentId || payment.provider_payment_id,
    },
  }).eq('id', payment.id)

  if (updateError) {
    throw updateError
  }

  if (nextStatus === 'paid') {
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    await updateUserPlanStatus({ userId: payment.user_id, plan: 'pro', proUntil: expiresAt })
  }

  if (['failed', 'cancelled', 'expired'].includes(nextStatus)) {
    await updateUserPlanStatus({ userId: payment.user_id, plan: 'free', proUntil: null })
  }

  return NextResponse.json({ ok: true, payment_id: payment.id, status: nextStatus })
}
