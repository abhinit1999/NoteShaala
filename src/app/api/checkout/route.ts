import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import Razorpay from 'razorpay'

// Ensure we have the environment variables, fallback gracefully for MVP if not set.
const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'dummy_key_id',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'dummy_key_secret',
})

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    
    // 1. Authenticate user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { productId } = body

    if (!productId) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 })
    }

    // 2. Fetch product details securely from server
    const { data: product, error: productError } = await supabaseAdmin
      .from('products')
      .select('*')
      .eq('id', productId)
      .eq('is_published', true)
      .single()

    if (productError || !product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    // Check if user already owns this product
    const { data: existingAccess } = await supabaseAdmin
      .from('user_products')
      .select('id')
      .eq('user_id', user.id)
      .eq('product_id', product.id)
      .eq('access_status', 'active')
      .single()

    if (existingAccess) {
      return NextResponse.json({ error: 'You already own this product.' }, { status: 400 })
    }

    // 3. Calculate final price
    const finalPrice = product.price
    const finalPricePaise = Math.round(finalPrice * 100) // Razorpay expects amount in subunits (paise)

    if (finalPricePaise === 0) {
      // It's a free product, just grant access directly
      const { error: accessError } = await supabaseAdmin
        .from('user_products')
        .insert({
          user_id: user.id,
          product_id: product.id,
          granted_at: new Date().toISOString(),
          access_status: 'active'
        })
        
      if (accessError) {
        throw new Error('Failed to grant free product access')
      }
      
      return NextResponse.json({ 
        isFree: true, 
        message: 'Product added to library' 
      })
    }

    // 4. Create internal order
    // Generate a simple unique order number
    const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`

    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .insert({
        user_id: user.id,
        order_number: orderNumber,
        status: 'pending',
        subtotal: finalPrice,
        total: finalPrice,
        currency: 'INR',
      })
      .select()
      .single()

    if (orderError || !order) {
      throw new Error('Failed to create internal order')
    }

    // Create order item
    await supabaseAdmin
      .from('order_items')
      .insert({
        order_id: order.id,
        product_id: product.id,
        product_title_snapshot: product.title,
        unit_price: product.price,
        final_price: finalPrice,
        quantity: 1
      })

    // 5. Create Razorpay Order
    // Note: If dummy keys are used, this will fail in the Razorpay SDK. We handle this for local dev.
    let razorpayOrder;
    try {
      razorpayOrder = await razorpay.orders.create({
        amount: finalPricePaise,
        currency: 'INR',
        receipt: order.id,
        notes: {
          product_id: product.id,
          user_id: user.id
        }
      })
    } catch (rzpErr: any) {
      console.error('Razorpay Error:', rzpErr)
      // If we are using dummy keys, we can mock the Razorpay order for development/testing UI.
      if (process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID === 'dummy_key_id' || !process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID) {
        razorpayOrder = {
          id: `order_dummy_${Date.now()}`,
          amount: finalPricePaise,
          currency: 'INR'
        }
      } else {
        throw new Error('Payment gateway error')
      }
    }

    // Update order with Razorpay Order ID
    await supabaseAdmin
      .from('orders')
      .update({ razorpay_order_id: razorpayOrder.id })
      .eq('id', order.id)

    // Return the required details to the client
    return NextResponse.json({
      orderId: order.id,
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'dummy_key_id'
    })

  } catch (error: any) {
    console.error('Checkout error:', error)
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 })
  }
}
