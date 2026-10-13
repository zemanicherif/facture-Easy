import { NextResponse } from 'next/server'

import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'
import { createCheckoutSession } from '@/lib/saspay'

export async function POST(request: Request) {
  let body: Record<string, FormDataEntryValue | string | undefined> = {}

  try {
    const contentType = request.headers.get('content-type') || ''

    if (contentType.includes('application/json')) {
      body = await request.json()
    } else {
      const formData = await request.formData()
      body = Object.fromEntries(formData.entries())
    }
  } catch {
    body = {}
  }

  const plan = body.plan === 'pro' ? 'pro' : 'free'
  const siteUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3002')

  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
  }

  if (plan !== 'pro') {
    const admin = createAdminClient()
    await admin.from('profiles').upsert({
      id: user.id,
      plan: 'free',
      pro_until: null,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'id' })

    return NextResponse.redirect(new URL('/dashboard', siteUrl), 303)
  }

  try {
    const successUrl = `${siteUrl}/dashboard?payment=success`
    const cancelUrl = `${siteUrl}/dashboard?payment=cancelled`
    const session = await createCheckoutSession({
      userId: user.id,
      email: user.email || '',
      name: user.email?.split('@')[0] || 'Client',
      successUrl,
      cancelUrl,
    })

    const admin = createAdminClient()
    await admin.from('payments').insert({
      user_id: user.id,
      plan: 'pro',
      amount: 5000,
      currency: 'XOF',
      status: 'pending',
      provider: 'saspay',
      provider_checkout_id: session.id,
      provider_reference: session.id,
      checkout_url: session.checkout_url,
      return_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        plan: 'pro',
        source: 'factureeasy',
        user_id: user.id,
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })

    if (request.headers.get('content-type')?.includes('application/json')) {
      return NextResponse.json({ ok: true, checkout_url: session.checkout_url })
    }

    return NextResponse.redirect(session.checkout_url, 303)
  } catch (error) {
    console.error('SasPay checkout route error:', error)
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : 'Payment creation failed',
      },
      { status: 500 }
    )
  }
}
