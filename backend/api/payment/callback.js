import { supabase } from '../../lib/supabase.js'
import { verifyPayment } from '../../lib/mayar.js'
import { cors, handleOptions } from '../../lib/middleware.js'

export default async function handler(req, res) {
  if (handleOptions(req, res)) return
  cors(res)

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { payment_id, status } = req.body

  if (status !== 'paid') {
    return res.json({ received: true })
  }

  // Verify payment with Mayar
  const payment = await verifyPayment(payment_id)
  
  if (payment.status !== 'paid') {
    return res.status(400).json({ error: 'Payment not verified' })
  }

  // Update order status
  const { data: order } = await supabase
    .from('orders')
    .update({
      status: 'paid',
      paid_at: new Date().toISOString(),
    })
    .eq('payment_id', payment_id)
    .select('*, order_items(*)')
    .single()

  if (!order) {
    return res.status(404).json({ error: 'Order not found' })
  }

  // Create purchase records
  for (const item of order.order_items) {
    await supabase.from('purchases').insert({
      user_id: order.user_id,
      order_item_id: item.id,
      product_type: item.product_type || 'general',
      details: {},
      status: 'active',
    })
  }

  res.json({ success: true })
}
