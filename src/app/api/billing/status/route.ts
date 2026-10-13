import { NextResponse } from 'next/server'

import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'
import { ensureUserProfile, verifyCheckoutSessionStatus, verifyPaymentByTransactionId } from '@/lib/saspay'

export async function GET() {
  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    return NextResponse.json({ authenticated: false }, { status: 401 })
  }

  const admin = createAdminClient()
  const profile = await ensureUserProfile(user.id)
  const now = Date.now()
  const proUntil = profile.pro_until ? new Date(profile.pro_until) : null

  if (profile.plan === 'pro' && proUntil && proUntil.getTime() > now) {
    return NextResponse.json({
      authenticated: true,
      plan: 'pro',
      active: true,
      pro_until: proUntil.toISOString(),
      status: 'active',
      paymentStatus: 'paid',
    })
  }

  const { data: pendingPayment, error: paymentError } = await admin
    .from('payments')
    .select('*')
    .eq('user_id', user.id)
    .eq('status', 'pending')
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (paymentError && paymentError.code !== 'PGRST116') {
    throw paymentError
  }

  if (pendingPayment?.provider_checkout_id) {
    try {
      const session = await verifyCheckoutSessionStatus(pendingPayment.provider_checkout_id)

      if (session.status === 'PAID' || session.transaction_status === 'SUCCESS') {
        const paymentId = session.transaction_id || pendingPayment.provider_payment_id

        if (paymentId) {
          const verified = await verifyPaymentByTransactionId(paymentId)
          const isPaid = verified.status === 'SUCCESS' || verified.status === 'PAID'

          if (isPaid) {
            const nextProUntil = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
            await admin.from('payments').update({
              status: 'paid',
              provider_payment_id: paymentId,
              provider_reference: verified.reference || paymentId,
              paid_at: new Date().toISOString(),
              pro_until: nextProUntil,
              updated_at: new Date().toISOString(),
            }).eq('id', pendingPayment.id)

            await admin.from('profiles').upsert({
              id: user.id,
              plan: 'pro',
              pro_until: nextProUntil,
              updated_at: new Date().toISOString(),
            }, { onConflict: 'id' })

            return NextResponse.json({
              authenticated: true,
              plan: 'pro',
              active: true,
              pro_until: nextProUntil,
              status: 'active',
              paymentStatus: 'paid',
            })
          }
        }
      }

      if (['CANCELLED', 'FAILED', 'EXPIRED'].includes(session.status)) {
        await admin.from('payments').update({
          status: session.status === 'CANCELLED' ? 'cancelled' : session.status === 'EXPIRED' ? 'expired' : 'failed',
          updated_at: new Date().toISOString(),
        }).eq('id', pendingPayment.id)

        await admin.from('profiles').upsert({
          id: user.id,
          plan: 'free',
          pro_until: null,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'id' })

        return NextResponse.json({
          authenticated: true,
          plan: 'free',
          active: false,
          pro_until: null,
          status: 'free',
          paymentStatus: session.status === 'CANCELLED' ? 'cancelled' : session.status === 'EXPIRED' ? 'expired' : 'failed',
        })
      }
    } catch (error) {
      console.error('SasPay verification failed for pending payment:', error)
    }

    return NextResponse.json({
      authenticated: true,
      plan: 'free',
      active: false,
      pro_until: null,
      status: 'pending',
      paymentStatus: 'pending',
    })
  }

  return NextResponse.json({
    authenticated: true,
    plan: 'free',
    active: false,
    pro_until: null,
    status: 'free',
    paymentStatus: 'none',
  })
}
