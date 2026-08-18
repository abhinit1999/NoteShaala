import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import crypto from 'crypto'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    
    // 1. Authenticate user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { 
      razorpay_payment_id, 
      razorpay_order_id, 
      razorpay_signature,
      internal_order_id
    } = body

    if (!internal_order_id || !razorpay_order_id || !razorpay_payment_id) {
      return NextResponse.json({ error: 'Missing payment details' }, { status: 400 })
    }

    // 2. Fetch the internal order to verify it belongs to the user and matches the razorpay order
    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .select('*, order_items(product_id)')
      .eq('id', internal_order_id)
      .single()

    if (orderError || !order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    if (order.user_id !== user.id) {
      return NextResponse.json({ error: 'Unauthorized to verify this order' }, { status: 403 })
    }

    if (order.razorpay_order_id !== razorpay_order_id) {
      return NextResponse.json({ error: 'Order mismatch' }, { status: 400 })
    }

    if (order.status === 'captured') {
      return NextResponse.json({ success: true, message: 'Already captured' })
    }

    // 3. Verify Signature
    const secret = process.env.RAZORPAY_KEY_SECRET || 'dummy_key_secret'
    
    let isSignatureValid = false;

    // Skip actual verification if using dummy keys in local dev
    if (secret === 'dummy_key_secret' && process.env.NODE_ENV === 'development') {
      isSignatureValid = true;
    } else {
      const shasum = crypto.createHmac('sha256', secret)
      shasum.update(`${razorpay_order_id}|${razorpay_payment_id}`)
      const digest = shasum.digest('hex')

      if (digest === razorpay_signature) {
        isSignatureValid = true
      }
    }

    if (!isSignatureValid) {
      return NextResponse.json({ error: 'Invalid payment signature' }, { status: 400 })
    }

    // 4. Record Payment and Grant Access (Transaction-like behavior)
    // Update order status
    await supabaseAdmin
      .from('orders')
      .update({ status: 'captured' })
      .eq('id', order.id)

    // Insert payment record
    await supabaseAdmin
      .from('payments')
      .insert({
        order_id: order.id,
        razorpay_payment_id,
        razorpay_signature,
        status: 'captured',
        amount: order.total,
        currency: order.currency
      })

    // Grant access to all products in the order
    if (order.order_items && order.order_items.length > 0) {
      const accessRecords = order.order_items.map((item: any) => ({
        user_id: user.id,
        product_id: item.product_id,
        order_id: order.id,
        access_status: 'active'
      }))

      // upsert to avoid unique constraint violation if retry happens
      await supabaseAdmin
        .from('user_products')
        .upsert(accessRecords, { onConflict: 'user_id, product_id' })
    }

    return NextResponse.json({ success: true, message: 'Payment verified successfully' })

  } catch (error: any) {
    console.error('Verification error:', error)
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 })
  }
}
