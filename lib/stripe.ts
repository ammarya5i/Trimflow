import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
  typescript: true,
})

export const STRIPE_PLANS = {
  FREE: {
    name: 'Free',
    price: 0,
    priceId: null,
    features: [
      'Up to 50 appointments per month',
      'Basic calendar view',
      'Email notifications',
      'Customer management',
    ],
    limits: {
      appointments: 50,
      staff: 1,
      services: 5,
    },
  },
  PRO: {
    name: 'Pro',
    price: 1900, // $19.00
    priceId: process.env.STRIPE_PRO_PRICE_ID!,
    features: [
      'Unlimited appointments',
      'Advanced calendar with drag & drop',
      'Staff management & roles',
      'Custom services & pricing',
      'Email & SMS notifications',
      'Basic reporting',
      'Customer portal',
    ],
    limits: {
      appointments: -1, // unlimited
      staff: 5,
      services: -1, // unlimited
    },
  },
  PREMIUM: {
    name: 'Premium',
    price: 4900, // $49.00
    priceId: process.env.STRIPE_PREMIUM_PRICE_ID!,
    features: [
      'Everything in Pro',
      'Advanced reporting & analytics',
      'Multi-location support',
      'API access',
      'Priority support',
      'Custom branding',
      'Advanced integrations',
    ],
    limits: {
      appointments: -1, // unlimited
      staff: -1, // unlimited
      services: -1, // unlimited
    },
  },
} as const

export type PlanType = keyof typeof STRIPE_PLANS

export function getPlanByPriceId(priceId: string): PlanType | null {
  for (const [planType, plan] of Object.entries(STRIPE_PLANS)) {
    if (plan.priceId === priceId) {
      return planType as PlanType
    }
  }
  return null
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price / 100)
}
