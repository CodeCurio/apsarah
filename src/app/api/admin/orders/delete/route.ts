import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}))
    const { orderId } = body

    if (!orderId) {
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 })
    }

    // 1. Delete associated order timeline events
    const { error: timelineErr } = await supabaseAdmin
      .from('order_timeline')
      .delete()
      .eq('order_id', orderId)

    if (timelineErr) {
      console.warn('Note: Could not delete order_timeline rows or none found:', timelineErr.message)
    }

    // 2. Delete associated order items
    const { error: itemsErr } = await supabaseAdmin
      .from('order_items')
      .delete()
      .eq('order_id', orderId)

    if (itemsErr) {
      console.warn('Note: Could not delete order_items rows or none found:', itemsErr.message)
    }

    // 3. Delete the order record from the orders table
    const { error: orderErr } = await supabaseAdmin
      .from('orders')
      .delete()
      .eq('id', orderId)

    if (orderErr) {
      console.error('Failed to delete order from Supabase database:', orderErr)
      return NextResponse.json(
        { error: orderErr.message || 'Database failed to delete the order.' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Order and associated database records deleted successfully.',
      orderId,
    })
  } catch (err: any) {
    console.error('Server error deleting order:', err)
    return NextResponse.json(
      { error: err?.message || 'Internal server error while deleting order.' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  return POST(request)
}
