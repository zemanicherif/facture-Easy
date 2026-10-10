import Stripe from 'stripe';

export type SubscriptionPlan = 'starter' | 'pro' | 'business';
export type PaymentMethod =
  | 'stripe'
  | 'wave'
  | 'orange-money'
  | 'momo'
  | 'bank-transfer'
  | 'card'
  | 'crypto';

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

export function getPreferredPaymentMethods(countryCode?: string): PaymentMethod[] {
  const localAfricanCountries = new Set([
    'bf', 'bj', 'cm', 'ci', 'cg', 'ga', 'gn', 'ml', 'mr', 'ne', 'sn', 'td', 'tg', 'cd', 'cf', 'dz', 'eg', 'gh', 'ke', 'ng', 'rw', 'sl', 'tz', 'ug', 'za'
  ]);

  const normalized = (countryCode ?? '').toLowerCase();

  if (localAfricanCountries.has(normalized)) {
    return ['wave', 'orange-money', 'momo', 'bank-transfer', 'stripe', 'crypto'];
  }

  return ['stripe', 'card', 'crypto'];
}

export const paymentMethodLabels: Record<PaymentMethod, string> = {
  stripe: 'Stripe / Carte internationale',
  wave: 'Wave',
  'orange-money': 'Orange Money',
  momo: 'MoMo / Mobile Money',
  'bank-transfer': 'Virement local',
  card: 'Carte bancaire',
  crypto: 'Crypto',
};
