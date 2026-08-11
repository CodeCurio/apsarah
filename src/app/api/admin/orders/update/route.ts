import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { Resend } from 'resend'
import { renderOrderShippedEmailHtml, renderOrderPackedEmailHtml, renderOrderDeliveredEmailHtml } from '@/lib/email-templates'
import { getTrackingUrl } from '@/lib/tracking-utils'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()

    const body = await request.json()
    const {
      orderId,
      fulfillmentStatus,
      paymentStatus,
      trackingNumber,
      trackingCarrier,
      adminNote,
    } = body

    if (!orderId) {
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 })
    }

    // 1. Update order status in orders table
    const { data: updatedRows, error: updateError } = await supabase
      .from('orders')
      .update({
        fulfillment_status: fulfillmentStatus,
        payment_status: paymentStatus,
        tracking_number: trackingNumber || null,
        tracking_carrier: trackingCarrier || null,
      })
      .eq('id', orderId)
      .select()

    if (updateError || !updatedRows || updatedRows.length === 0) {
      console.error('Order update error:', updateError || '0 rows updated due to RLS')
      return NextResponse.json(
        { error: updateError?.message || 'Database RLS permission blocked updating orders.' },
        { status: 403 }
      )
    }

    const updatedOrder = updatedRows[0]

    // 2. Insert Timeline Event
    const noteText = adminNote || `Status updated to ${fulfillmentStatus.toUpperCase()}`
    await supabase.from('order_timeline').insert({
      order_id: orderId,
      status: fulfillmentStatus,
      note: trackingNumber ? `${noteText} (Carrier: ${trackingCarrier}, AWB: ${trackingNumber})` : noteText,
    })

    // 3. Dispatch Email via Resend
    const apiKey = process.env.RESEND_API_KEY
    if (apiKey && updatedOrder) {
      try {
        const resend = new Resend(apiKey)
        const fromSender = process.env.RESEND_FROM_EMAIL || 'Apsarah <contact@apsarah.in>'
        const customerEmail = updatedOrder.email
        const customerName = updatedOrder.shipping_address?.fullName || 'Customer'
        const orderNumber = updatedOrder.order_number

        let html = ''
        let subject = ''

        if (fulfillmentStatus === 'delivered') {
          subject = `Your Order #${orderNumber} Has Been Delivered! 🎉 | Apsarah`
          html = renderOrderDeliveredEmailHtml({
            orderNumber,
            customerName,
            note: adminNote,
          })
        } else if (fulfillmentStatus === 'shipped') {
          const trackingUrl = getTrackingUrl(trackingCarrier || 'Standard Express', trackingNumber || '')
          subject = `Your Order #${orderNumber} Has Shipped! 🚚 | Apsarah`
          html = renderOrderShippedEmailHtml({
            orderNumber,
            customerName,
            carrier: trackingCarrier || 'Standard Express',
            trackingNumber: trackingNumber || 'N/A',
            trackingUrl,
            shippingAddress: updatedOrder.shipping_address || {},
          })
        } else if (fulfillmentStatus === 'processing' || fulfillmentStatus === 'packed') {
          subject = `Order #${orderNumber} Update: Packed & Processing 🎁 | Apsarah`
          html = renderOrderPackedEmailHtml({
            orderNumber,
            customerName,
            note: adminNote,
          })
        }

        if (subject && html && customerEmail) {
          await resend.emails.send({
            from: fromSender,
            to: customerEmail,
            subject,
            html,
          })
        }
      } catch (emailErr) {
        console.error('Failed to send status update email:', emailErr)
      }
    }

    return NextResponse.json({ success: true, order: updatedOrder })
  } catch (err: any) {
    console.error('Admin order update route error:', err)
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 })
  }
}
