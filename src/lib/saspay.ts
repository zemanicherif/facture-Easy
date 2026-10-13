import { createAdminClient } from '@/lib/supabase/admin'

export const SASPAY_API_BASE_URL = 'https://api.saspay.me/api/v1'
export const SASPAY_PRO_AMOUNT = '5000.00'

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'cancelled' | 'expired'

export async function createCheckoutSession({
  userId,
  email,
  name,
  successUrl,
  cancelUrl,
}: {
  userId: string
  email: string
  name: string
  successUrl: string
  cancelUrl: string
}) {
  const apiKey = process.env.SASPAY_API_KEY

  if (!apiKey) {
    throw new Error('SASPAY_API_KEY is not configured')
  }

  const response = await fetch(`${SASPAY_API_BASE_URL}/checkout-sessions/`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      amount: SASPAY_PRO_AMOUNT,
      currency: 'XOF',
      customer_email: email || `${userId}@factureeasy.local`,
      customer_name: name || 'Client FactureEasy',
      description: 'Abonnement Pro FactureEasy - 1 mois',
      return_url: successUrl,
      metadata: {
        user_id: userId,
        plan: 'pro',
        source: 'factureeasy',
      },
    }),
  })

  const text = await response.text()
  let payload: any = null

  try {
    payload = text ? JSON.parse(text) : null
  } catch {
    payload = null
  }

  if (!response.ok) {
    throw new Error(payload?.message || `SasPay checkout creation failed (${response.status})`)
  }

  if (!payload || !payload.id || !payload.checkout_url) {
    throw new Error('SasPay response missing checkout_url')
  }

  return payload as {
    id: string
    checkout_url: string
    status: string
    transaction?: string | null
    transaction_id?: string | null
    metadata?: Record<string, unknown>
  }
}

export async function verifyCheckoutSessionStatus(checkoutSessionId: string) {
  const apiKey = process.env.SASPAY_API_KEY

  if (!apiKey) {
    throw new Error('SASPAY_API_KEY is not configured')
  }

  const response = await fetch(`${SASPAY_API_BASE_URL}/checkout-sessions/${checkoutSessionId}/status/`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    const text = await response.text()
    throw new Error(text || `Unable to verify SasPay checkout status (${response.status})`)
  }

  const data = await response.json()
  return data as {
    id: string
    status: string
    transaction_id?: string | null
    transaction_status?: string | null
    transaction_reference?: string | null
  }
}

export async function verifyPaymentByTransactionId(paymentId: string) {
  const apiKey = process.env.SASPAY_API_KEY

  if (!apiKey) {
    throw new Error('SASPAY_API_KEY is not configured')
  }

  const response = await fetch(`${SASPAY_API_BASE_URL}/payments/${paymentId}/verify/`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    const text = await response.text()
    throw new Error(text || `Unable to verify SasPay payment (${response.status})`)
  }

  const data = await response.json()
  return data as {
    id: string
    status: string
    reference?: string | null
    message?: string
  }
}

export async function ensureUserProfile(userId: string) {
  const admin = createAdminClient()
  const { data, error } = await admin
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle()

  if (error && error.code !== 'PGRST116') {
    throw error
  }

  if (!data) {
    const insert = await admin.from('profiles').insert({
      id: userId,
      plan: 'free',
      pro_until: null,
      updated_at: new Date().toISOString(),
    })

    if (insert.error) {
      throw insert.error
    }

    return insert.data?.[0] ?? { id: userId, plan: 'free', pro_until: null }
  }

  return data
}

export async function getCurrentUserSubscription(userId: string) {
  const admin = createAdminClient()
  const profile = await ensureUserProfile(userId)

  if (profile.plan === 'pro' && profile.pro_until) {
    const expiresAt = new Date(profile.pro_until)
    const isActive = Number.isFinite(expiresAt.getTime()) && expiresAt.getTime() > Date.now()

    if (isActive) {
      return {
        plan: 'pro',
        active: true,
        pro_until: expiresAt.toISOString(),
      }
    }
  }

  return {
    plan: 'free',
    active: false,
    pro_until: null,
  }
}

export async function updateUserPlanStatus({
  userId,
  plan,
  proUntil,
}: {
  userId: string
  plan: 'free' | 'pro'
  proUntil?: string | null
}) {
  const admin = createAdminClient()

  const payload = {
    id: userId,
    plan,
    pro_until: proUntil ?? null,
    updated_at: new Date().toISOString(),
  }

  const { error } = await admin.from('profiles').upsert(payload, { onConflict: 'id' })

  if (error) {
    throw error
  }
}
