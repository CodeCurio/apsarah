import { NextResponse } from 'next/server'
import Razorpay from 'razorpay'

export async function POST(request: Request) {
  try {
    const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID
    const keySecret = process.env.RAZORPAY_KEY_SECRET

    if (!keyId || !keySecret) {
      console.warn('Razorpay API keys missing in environment variables.')
      return NextResponse.json(
        { error: 'Razorpay keys not configured. Please add NEXT_PUBLIC_RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to .env.local' },
        { status: 400 }
      )
    }

    const body = await request.json()
    const { amount, currency = 'INR', receipt, notes } = body

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: 'Valid amount is required' }, { status: 400 })
    }

    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    })

    // Convert amount to paise (1 INR = 100 paise)
    const amountInPaise = Math.round(amount * 100)

    const options = {
      amount: amountInPaise,
      currency,
      receipt: receipt || `rcpt_${Date.now()}`,
      notes: notes || {},
    }

    const order = await razorpay.orders.create(options)

    return NextResponse.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: keyId,
    })
  } catch (err: any) {
    console.error('Razorpay create-order error:', err)
    return NextResponse.json({ error: err.message || 'Failed to create Razorpay order' }, { status: 500 })
  }
}
