import { supabase } from '../lib/supabase.js'
import { mayar } from '../lib/mayar.js'
import { config } from '../config/index.js'
import { AppError } from '../middleware/error.middleware.js'

export async function createPayment(req, res, next) {
  try {
    const { orderNumber, items, total, currency = 'IDR', phone } = req.body
    const user = req.user

    if (!items || items.length === 0) {
      throw new AppError('No items to checkout', 400)
    }

    // Create order
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

    if (orderError) throw new AppError(orderError.message, 500)

    // Create order items
    const orderItems = items.map((item) => ({
      order_id: order.id,
      product_id: item.type === 'preset' ? item.id : null,
      name: item.name,
      quantity: item.quantity,
      price: item.price,
      total: item.price * item.quantity,
    }))

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems)

    if (itemsError) throw new AppError(itemsError.message, 500)

    // Admin bypass: if authenticated user is admin, mark paid and create purchases
    const isAdmin = Boolean(user?.admin === 1 || user?.admin === '1' || user?.admin === true)

    if (isAdmin) {
      const adminPaymentId = `ADMIN-${Date.now()}`

      await supabase
        .from('orders')
        .update({
          status: 'paid',
          payment_id: adminPaymentId,
          paid_at: new Date().toISOString(),
        })
        .eq('id', order.id)
      // Ensure order_items exist (they should have been created earlier)
      const { data: createdItems } = await supabase
        .from('order_items')
        .select('id, name')
        .eq('order_id', order.id)

      // Create purchase records with order_item_id so frontend shows correct products
      for (const createdItem of createdItems || []) {
        const originalItem = items.find((i) => i.name === createdItem.name)
        await supabase.from('purchases').insert({
          user_id: user.id,
          order_item_id: createdItem.id,
          product_type: originalItem?.productType || 'general',
          details: originalItem?.config || {},
          status: 'active',
          expires_at:
            originalItem?.productType === 'hosting'
              ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
              : null,
        })
      }

      return res.json({
        success: true,
        orderId: orderNumber,
        paymentId: adminPaymentId,
        adminBypass: true,
      })
    }

    // TEST MODE - simulate success
    if (config.paymentMode === 'test') {
      const paymentId = `TEST-${Date.now()}`

      await supabase
        .from('orders')
        .update({
          status: 'paid',
          payment_id: paymentId,
          paid_at: new Date().toISOString(),
        })
        .eq('id', order.id)

      // FIX: Fetch the created order_items so we have their IDs
      const { data: createdItems } = await supabase
        .from('order_items')
        .select('id, name')
        .eq('order_id', order.id)

      // Create purchase records with order_item_id
      for (const createdItem of createdItems) {
        const originalItem = items.find((i) => i.name === createdItem.name)
        await supabase.from('purchases').insert({
          user_id: user.id,
          order_item_id: createdItem.id, // FIX: was missing before
          product_type: originalItem?.productType || 'general',
          details: originalItem?.config || {},
          status: 'active',
          expires_at:
            originalItem?.productType === 'hosting'
              ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
              : null,
        })
      }

      return res.json({
        success: true,
        orderId: orderNumber,
        paymentId,
        testMode: true,
      })
    }

    // LIVE MODE - create Mayar payment
    if (!phone) {
      throw new AppError('Phone number is required', 400)
    }

    const payment = await mayar.createPayment({
      orderId: orderNumber,
      amount: total,
      description: `Order ${orderNumber}`,
      customerEmail: user.email,
      customerName: user.name,
      customerMobile: phone,
    })

    await supabase
      .from('orders')
      .update({
        payment_id: payment.id,
        payment_url: payment.link,
      })
      .eq('id', order.id)

    res.json({
      success: true,
      orderId: orderNumber,
      paymentId: payment.id,
      redirectUrl: payment.link,
      testMode: false,
    })
  } catch (error) {
    next(error)
  }
}

export async function paymentCallback(req, res, next) {
  try {
    const { paymentId, status } = req.body

    if (status !== 'paid' && status !== 'SUCCESS') {
      return res.json({ received: true })
    }

    // Verify with Mayar
    const payment = await mayar.verifyPayment(paymentId)

    if (payment.status !== 'paid' && payment.status !== 'SUCCESS') {
      throw new AppError('Payment not verified', 400)
    }

    // Update order
    const { data: order, error } = await supabase
      .from('orders')
      .update({
        status: 'paid',
        paid_at: new Date().toISOString(),
      })
      .eq('payment_id', paymentId)
      .select('*, order_items(*)')
      .single()

    if (error || !order) throw new AppError('Order not found', 404)

    // FIX: Create purchase records with order_item_id and correct product_type
    for (const item of order.order_items) {
      await supabase.from('purchases').insert({
        user_id: order.user_id,
        order_item_id: item.id, // already correct
        product_type: item.product_type || 'general', // FIX: was hardcoded 'general'
        details: item.config || {},
        status: 'active',
      })
    }

    res.json({ success: true })
  } catch (error) {
    next(error)
  }
}

export async function verifyPayment(req, res, next) {
  try {
    const { paymentId } = req.body

    if (config.paymentMode === 'test') {
      return res.json({ success: true, status: 'paid' })
    }

    const payment = await mayar.verifyPayment(paymentId)
    res.json(payment)
  } catch (error) {
    next(error)
  }
}

export async function getUserOrders(req, res, next) {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false })

    if (error) throw new AppError(error.message, 500)

    res.json(data)
  } catch (error) {
    next(error)
  }
}

export async function getOrderById(req, res, next) {
  try {
    const { id } = req.params

    const { data, error } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .eq('id', id)
      .eq('user_id', req.user.id)
      .single()

    if (error) throw new AppError('Order not found', 404)

    res.json(data)
  } catch (error) {
    next(error)
  }
}