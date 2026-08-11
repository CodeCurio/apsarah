import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { renderOrderShippedEmailHtml } from '@/lib/email-templates'

export async function POST(request: Request) {
  try {
    const apiKey = process.env.RESEND_API_KEY

    if (!apiKey) {
      console.warn('RESEND_API_KEY is not set. Order shipped email skipped.')
      return NextResponse.json({ success: false, message: 'RESEND_API_KEY missing' }, { status: 200 })
    }

    const body = await request.json()
    const {
      orderNumber,
      customerName,
      customerEmail,
      carrier,
      trackingNumber,
      trackingUrl,
      shippingAddress,
    } = body

    if (!orderNumber || !customerEmail || !trackingNumber) {
      return NextResponse.json({ error: 'Missing required tracking details' }, { status: 400 })
    }

    const resend = new Resend(apiKey)
    const fromSender = process.env.RESEND_FROM_EMAIL || 'Apsarah <contact@apsarah.in>'

    const html = renderOrderShippedEmailHtml({
      orderNumber,
      customerName: customerName || 'Valued Customer',
      carrier: carrier || 'Standard Express',
      trackingNumber,
      trackingUrl,
      shippingAddress,
    })

    const result = await resend.emails.send({
      from: fromSender,
      to: customerEmail,
      subject: `Your Order #${orderNumber} Has Shipped! 🚚 | Apsarah`,
      html,
    })

    return NextResponse.json({ success: true, emailId: result.data?.id })
  } catch (err: any) {
    console.error('Failed to send order shipped email via Resend:', err)
    return NextResponse.json({ error: err.message || 'Failed to send email' }, { status: 500 })
  }
}
