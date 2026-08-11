import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { renderOrderConfirmationEmailHtml, renderAdminOrderAlertEmailHtml } from '@/lib/email-templates'

export async function POST(request: Request) {
  try {
    const apiKey = process.env.RESEND_API_KEY

    if (!apiKey) {
      console.warn('RESEND_API_KEY is not set in environment variables. Email sending skipped.')
      return NextResponse.json({ success: false, message: 'RESEND_API_KEY missing' }, { status: 200 })
    }

    const body = await request.json()
    const {
      orderNumber,
      customerName,
      customerEmail,
      customerPhone,
      items,
      shippingAddress,
      subtotal,
      discount,
      shippingCost,
      total,
      paymentMethod,
    } = body

    if (!orderNumber || !customerEmail || !items) {
      return NextResponse.json({ error: 'Missing required order fields' }, { status: 400 })
    }

    const resend = new Resend(apiKey)

    // Dynamic sender: Uses contact@apsarah.in if configured, otherwise falls back gracefully
    const fromSender = process.env.RESEND_FROM_EMAIL || 'Apsarah <contact@apsarah.in>'
    const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL || 'contact@apsarah.in'

    // 1. Send Order Confirmation Email to Customer
    const customerHtml = renderOrderConfirmationEmailHtml({
      orderNumber,
      customerName: customerName || 'Valued Customer',
      items,
      shippingAddress,
      subtotal: subtotal || 0,
      discount: discount || 0,
      shippingCost: shippingCost || 0,
      total: total || 0,
      paymentMethod: paymentMethod || 'COD',
    })

    const customerEmailResult = await resend.emails.send({
      from: fromSender,
      to: customerEmail,
      subject: `Order Confirmation #${orderNumber} ✨ | Apsarah`,
      html: customerHtml,
    })

    // 2. Send Admin New Order Notification Alert
    const adminHtml = renderAdminOrderAlertEmailHtml({
      orderNumber,
      customerName: customerName || 'Valued Customer',
      customerEmail,
      customerPhone: customerPhone || 'N/A',
      items,
      total: total || 0,
      paymentMethod: paymentMethod || 'COD',
      shippingCity: shippingAddress?.city || 'India',
    })

    const adminEmailResult = await resend.emails.send({
      from: fromSender,
      to: adminEmail,
      subject: `🚨 New Order Alert #${orderNumber} (₹${(total || 0).toLocaleString()} - ${paymentMethod?.toUpperCase()})`,
      html: adminHtml,
    })

    return NextResponse.json({
      success: true,
      customerEmailId: customerEmailResult.data?.id,
      adminEmailId: adminEmailResult.data?.id,
    })
  } catch (err: any) {
    console.error('Failed to send order emails via Resend:', err)
    return NextResponse.json({ error: err.message || 'Failed to send emails' }, { status: 500 })
  }
}
