import Stripe from 'stripe';

export type SubscriptionPlan = 'starter' | 'pro' | 'business';

export const planCatalog: Record<
  SubscriptionPlan,
  {
    name: string;
    description: string;
    price: number;
    currency: string;
    interval: 'month';
  }
> = {
  starter: {
    name: 'Plan Découverte',
    description: 'Pour tester la facturation sans engagement.',
    price: 0,
    currency: 'xof',
    interval: 'month',
  },
  pro: {
    name: 'Plan Pro',
    description: 'Pour les indépendants et PME qui veulent facturer vite et bien.',
    price: 5000,
    currency: 'xof',
    interval: 'month',
  },
  business: {
    name: 'Plan Business',
    description: 'Pour les sociétés qui veulent la gestion complète et le suivi avancé.',
    price: 15000,
    currency: 'xof',
    interval: 'month',
  },
};

export const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY)
  : null;

export function getPlanCatalog(plan: SubscriptionPlan) {
  return planCatalog[plan] ?? planCatalog.pro;
}
