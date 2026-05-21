import { supabase } from '../lib/supabase.js'
import { AppError } from '../middleware/error.middleware.js'

export async function getProfile(req, res) {
  res.json(req.user)
}

export async function getPurchases(req, res, next) {
  try {
    const { data, error } = await supabase
      .from('purchases')
      .select('*')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false })

    if (error) throw new AppError(error.message, 500)

    res.json(data)
  } catch (error) {
    next(error)
  }
}
