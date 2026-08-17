import { NextResponse } from 'next/server'
import Razorpay from 'razorpay'

export async function GET() {
  try {
    const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID
    const keySecret = process.env.RAZORPAY_KEY_SECRET

    if (!keyId || !keySecret) {
      return NextResponse.json({
        configured: false,
        payments: [],
        message: 'Razorpay keys not set up in environment variables.',
      })
    }

    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    })

    const paymentsResponse = await razorpay.payments.all({ count: 50 })

    const formattedPayments = (paymentsResponse.items || []).map((p: any) => ({
      id: p.id,
      orderId: p.order_id || 'N/A',
      amount: p.amount ? p.amount / 100 : 0,
      currency: p.currency,
      status: p.status, // captured, authorized, failed, refunded
      method: p.method, // card, upi, netbanking, wallet
      email: p.email || '',
      contact: p.contact || '',
      description: p.description || '',
      createdAt: new Date(p.created_at * 1000).toISOString(),
    }))

    return NextResponse.json({
      configured: true,
      mode: keyId.startsWith('rzp_live') ? 'Live Production Mode' : 'Test Mode',
      payments: formattedPayments,
    })
  } catch (err: any) {
    console.error('Failed to fetch Razorpay payments:', err)
    return NextResponse.json({
      configured: true,
      payments: [],
      error: err.message || 'Error fetching Razorpay transactions',
    })
  }
}
