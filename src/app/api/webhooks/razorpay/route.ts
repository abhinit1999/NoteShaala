import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import crypto from 'crypto'

export async function POST(request: Request) {
  try {
    const payload = await request.text()
    const signature = request.headers.get('x-razorpay-signature')

    if (!signature) {
      return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
    }

    const secret = process.env.RAZORPAY_WEBHOOK_SECRET || 'dummy_webhook_secret'

    // Verify webhook signature
    let isSignatureValid = false
    if (secret === 'dummy_webhook_secret' && process.env.NODE_ENV === 'development') {
      isSignatureValid = true
    } else {
      const shasum = crypto.createHmac('sha256', secret)
      shasum.update(payload)
      const digest = shasum.digest('hex')

      if (digest === signature) {
        isSignatureValid = true
      }
    }

    if (!isSignatureValid) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    const event = JSON.parse(payload)

    // Log the webhook event
    await supabaseAdmin
      .from('webhook_events')
      .insert({
        event_type: event.event,
        event_id: event.id || `evt_${Date.now()}`,
        payload: event,
        status: 'pending'
      })

    // Handle specific events
    if (event.event === 'payment.captured') {
      const paymentEntity = event.payload.payment.entity
      const razorpayOrderId = paymentEntity.order_id

      if (!razorpayOrderId) {
        throw new Error('No order_id in payment payload')
      }

      // Fetch the internal order
      const { data: order } = await supabaseAdmin
        .from('orders')
        .select('*, order_items(product_id)')
        .eq('razorpay_order_id', razorpayOrderId)
        .single()

      if (order && order.status !== 'captured') {
        // Mark as captured
        await supabaseAdmin
          .from('orders')
          .update({ status: 'captured' })
          .eq('id', order.id)

        // Insert payment record if not exists
        await supabaseAdmin
          .from('payments')
          .upsert({
            order_id: order.id,
            razorpay_payment_id: paymentEntity.id,
            status: 'captured',
            amount: order.total,
            currency: order.currency
          }, { onConflict: 'razorpay_payment_id' })

        // Grant access
        if (order.order_items && order.order_items.length > 0) {
          const accessRecords = order.order_items.map((item: any) => ({
            user_id: order.user_id,
            product_id: item.product_id,
            order_id: order.id,
            access_status: 'active'
          }))

          await supabaseAdmin
            .from('user_products')
            .upsert(accessRecords, { onConflict: 'user_id, product_id' })
        }
      }

      // Mark webhook as processed
      await supabaseAdmin
        .from('webhook_events')
        .update({ status: 'processed', processed_at: new Date().toISOString() })
        .eq('event_id', event.id)

    }

    return NextResponse.json({ status: 'ok' })

  } catch (error: any) {
    console.error('Webhook error:', error)
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 })
  }
}
