import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 })
  }

  let event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        const subscription = event.data.object
        await prisma.user.updateMany({
          where: {
            stripeCustomerId: subscription.customer as string
          },
          data: {
            subscriptionStatus: subscription.status,
            subscriptionPlan: subscription.items.data[0]?.price.id === process.env.STRIPE_PRO_PRICE_ID ? 'PRO' : 'PREMIUM',
            stripeSubscriptionId: subscription.id,
            subscriptionCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
          }
        })
        break

      case 'customer.subscription.deleted':
        const deletedSubscription = event.data.object
        await prisma.user.updateMany({
          where: {
            stripeCustomerId: deletedSubscription.customer as string
          },
          data: {
            subscriptionStatus: 'canceled',
            subscriptionPlan: 'FREE',
            stripeSubscriptionId: null,
            subscriptionCurrentPeriodEnd: null,
          }
        })
        break

      case 'invoice.payment_succeeded':
        const invoice = event.data.object
        if (invoice.subscription) {
          await prisma.user.updateMany({
            where: {
              stripeSubscriptionId: invoice.subscription as string
            },
            data: {
              subscriptionStatus: 'active',
            }
          })
        }
        break

      case 'invoice.payment_failed':
        const failedInvoice = event.data.object
        if (failedInvoice.subscription) {
          await prisma.user.updateMany({
            where: {
              stripeSubscriptionId: failedInvoice.subscription as string
            },
            data: {
              subscriptionStatus: 'past_due',
            }
          })
        }
        break

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Error processing webhook:', error)
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}
