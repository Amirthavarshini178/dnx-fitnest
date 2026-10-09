import { createHmac, timingSafeEqual } from 'node:crypto'

type Plan = { name: string; amount: number }

export async function createCheckoutSession(plan: Plan, userId: string) {
  if (process.env.PAYMENT_MODE !== 'razorpay') {
    return { mode: 'demo' as const, orderId: `demo_${Date.now()}`, amount: plan.amount, currency: 'INR', cardDataRequired: false }
  }
  const keyId = process.env.RAZORPAY_KEY_ID
  const keySecret = process.env.RAZORPAY_KEY_SECRET
  if (!keyId || !keySecret) throw new Error('Razorpay checkout requires RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET')
  const response = await fetch('https://api.razorpay.com/v1/orders', {
    method: 'POST',
    headers: { Authorization: `Basic ${Buffer.from(`${keyId}:${keySecret}`).toString('base64')}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount: plan.amount * 100, currency: 'INR', receipt: `dnx-${userId}-${Date.now()}`, notes: { userId, plan: plan.name } }),
  })
  if (!response.ok) throw new Error('Razorpay could not create a checkout order')
  const order = await response.json() as { id: string; amount: number; currency: string }
  return { mode: 'razorpay' as const, orderId: order.id, amount: order.amount / 100, currency: order.currency, keyId, cardDataRequired: false }
}

export function verifyCheckoutSignature(orderId: string, paymentId: string, signature: string) {
  const secret = process.env.RAZORPAY_KEY_SECRET
  if (!secret) return false
  const expected = createHmac('sha256', secret).update(`${orderId}|${paymentId}`).digest()
  const received = Buffer.from(signature, 'hex')
  return received.length === expected.length && timingSafeEqual(received, expected)
}