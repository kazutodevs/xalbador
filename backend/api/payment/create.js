import { supabase } from '../../lib/supabase.js'
import { createPayment } from '../../lib/mayar.js'
import { cors, handleOptions, authenticate } from '../../lib/middleware.js'

const PAYMENT_MODE = process.env.PAYMENT_MODE || 'test'

export default async function handler(req, res) {
  if (handleOptions(req, res)) return
  cors(res)

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const user = await authenticate(req)
  if (!user) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const { orderNumber, items, total, currency } = req.body

  // Create order in database
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      user_id: user.id,
      order_number: orderNumber,
      subtotal: total,
      total,
      currency,
      status: 'pending',
    })
    .select()
    .single()

  if (orderError) {
    return res.status(500).json({ error: orderError.message })
  }

  // Create order items
  const orderItems = items.map((item) => ({
    order_id: order.id,
    product_id: item.type === 'preset' ? item.id : null,
    name: item.name,
    quantity: item.quantity,
    price: item.price,
    total: item.price * item.quantity,
  }))

  await supabase.from('order_items').insert(orderItems)

  // Test mode - simulate success
  if (PAYMENT_MODE === 'test') {
    await supabase
      .from('orders')
      .update({
        status: 'paid',
        payment_id: `TEST-${Date.now()}`,
        paid_at: new Date().toISOString(),
      })
      .eq('id', order.id)

    // Create purchase records
    for (const item of items) {
      await supabase.from('purchases').insert({
        user_id: user.id,
        product_type: item.productType || 'general',
        details: item.config || {},
        status: 'active',
        expires_at: item.productType === 'hosting'
          ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
          : null,
      })
    }

    return res.json({
      success: true,
      orderId: orderNumber,
      paymentId: `TEST-${Date.now()}`,
      testMode: true,
    })
  }

  // Live mode - create actual payment
  try {
    const payment = await createPayment({
      orderId: orderNumber,
      amount: total,
      description: `Order ${orderNumber}`,
      customerEmail: user.email,
      customerName: user.name,
    })

    await supabase
      .from('orders')
      .update({
        payment_id: payment.id,
        payment_url: payment.link,
      })
      .eq('id', order.id)

    return res.json({
      success: true,
      orderId: orderNumber,
      paymentId: payment.id,
      redirectUrl: payment.link,
      testMode: false,
    })
  } catch (error) {
    console.error('Payment creation error:', error)
    return res.status(500).json({ error: 'Failed to create payment' })
  }
}
