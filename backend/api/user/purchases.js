import { supabase } from '../lib/supabase.js'
import { AppError } from '../middleware/error.middleware.js'

export async function getUserPurchases(req, res, next) {
  try {
    const user = req.user

    const { data, error } = await supabase
      .from('purchases')
      .select(`
        *,
        order_item:order_items (
          id,
          name,
          price
        )
      `)
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false })

    if (error) {
      throw new AppError(error.message, 500)
    }

    res.json(data)
  } catch (error) {
    next(error)
  }
}

export async function getPurchaseById(req, res, next) {
  try {
    const user = req.user
    const { id } = req.params

    const { data, error } = await supabase
      .from('purchases')
      .select(`
        *,
        order_item:order_items (
          id,
          name,
          price,
          quantity,
          total
        )
      `)
      .eq('id', id)
      .eq('user_id', user.id)
      .single()

    if (error || !data) {
      throw new AppError('Purchase not found', 404)
    }

    res.json(data)
  } catch (error) {
    next(error)
  }
}

export async function updatePurchaseDetails(req, res, next) {
  try {
    const user = req.user
    const { id } = req.params
    const { details } = req.body

    const { data, error } = await supabase
      .from('purchases')
      .update({
        details,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .eq('user_id', user.id)
      .select(`
        *,
        order_item:order_items (
          id,
          name,
          price,
          quantity,
          total
        )
      `)
      .single()

    if (error || !data) {
      throw new AppError('Failed to update purchase', 500)
    }

    res.json({
      success: true,
      purchase: data,
    })
  } catch (error) {
    next(error)
  }
}