import { supabase } from '../lib/supabase.js'
import { AppError } from '../middleware/error.middleware.js'

export async function getProducts(req, res, next) {
  try {
    const { category, search } = req.query

    let query = supabase
      .from('products')
      .select('*, categories(*)')
      .eq('is_active', true)
      .order('created_at', { ascending: false })

    if (category) {
      const { data: cat } = await supabase
        .from('categories')
        .select('id')
        .eq('slug', category)
        .single()

      if (cat) {
        query = query.eq('category_id', cat.id)
      }
    }

    if (search) {
      query = query.or(`name_en.ilike.%${search}%,name_id.ilike.%${search}%`)
    }

    const { data, error } = await query

    if (error) throw new AppError(error.message, 500)

    res.json(data)
  } catch (error) {
    next(error)
  }
}

export async function getProductById(req, res, next) {
  try {
    const { id } = req.params

    const { data, error } = await supabase
      .from('products')
      .select('*, categories(*)')
      .eq('id', id)
      .single()

    if (error) throw new AppError('Product not found', 404)

    res.json(data)
  } catch (error) {
    next(error)
  }
}

export async function getCategories(req, res, next) {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('sort_order', { ascending: true })

    if (error) throw new AppError(error.message, 500)

    res.json(data)
  } catch (error) {
    next(error)
  }
}
