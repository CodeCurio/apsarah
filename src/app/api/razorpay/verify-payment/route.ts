import { NextResponse } from 'next/server'
import crypto from 'crypto'

export async function POST(request: Request) {
  try {
    const keySecret = process.env.RAZORPAY_KEY_SECRET

    if (!keySecret) {
      return NextResponse.json({ error: 'RAZORPAY_KEY_SECRET missing in environment' }, { status: 400 })
    }

    const body = await request.json()
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json({ error: 'Missing payment verification parameters' }, { status: 400 })
    }

    // Verify HMAC SHA-256 signature
    const hmac = crypto.createHmac('sha256', keySecret)
    hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`)
    const generatedSignature = hmac.digest('hex')

    if (generatedSignature !== razorpay_signature) {
      return NextResponse.json({ success: false, error: 'Invalid payment signature verification failed' }, { status: 400 })
    }

    return NextResponse.json({ success: true, paymentId: razorpay_payment_id })
  } catch (err: any) {
    console.error('Razorpay verify-payment error:', err)
    return NextResponse.json({ error: err.message || 'Payment verification failed' }, { status: 500 })
  }
}
