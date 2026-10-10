import { NextResponse } from 'next/server';
import { getPlanCatalog, stripe, type PaymentMethod } from '@/lib/stripe';

const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001';

export async function POST(request: Request) {
  const body = (await request.json()) as { plan?: string; email?: string; paymentMethod?: PaymentMethod };
  const plan = (body.plan === 'starter' || body.plan === 'pro' || body.plan === 'business')
    ? body.plan
    : 'pro';
  const paymentMethod = body.paymentMethod ?? 'stripe';
  const selectedPlan = getPlanCatalog(plan);

  if (plan === 'starter') {
    return NextResponse.json({
      ok: true,
      url: `${appUrl}/login?mode=signup&plan=starter`,
      demo: true,
    });
  }

  const isLocalMethod = ['wave', 'orange-money', 'momo', 'bank-transfer'].includes(paymentMethod);

  if (isLocalMethod || !stripe) {
    return NextResponse.json({
      ok: true,
      demo: true,
      url: `${appUrl}/checkout/success?plan=${plan}&method=${paymentMethod}&demo=1`,
      message: 'Paiement local ou démo activé : l’accès au compte est préparé automatiquement après validation.',
    });
  }

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    customer_email: body.email || undefined,
    line_items: [
      {
        price_data: {
          currency: selectedPlan.currency,
          unit_amount: selectedPlan.price,
          recurring: {
            interval: selectedPlan.interval,
          },
          product_data: {
            name: selectedPlan.name,
            description: selectedPlan.description,
          },
        },
        quantity: 1,
      },
    ],
    success_url: `${appUrl}/checkout/success?plan=${plan}&method=${paymentMethod}&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${appUrl}/checkout/cancel?plan=${plan}&method=${paymentMethod}`,
    metadata: {
      plan,
      paymentMethod,
      source: 'factureeasy',
    },
    allow_promotion_codes: true,
  });

  return NextResponse.json({
    ok: true,
    url: session.url,
  });
}
