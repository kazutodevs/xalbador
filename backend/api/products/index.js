import { supabase } from '../../lib/supabase.js'
import { cors, handleOptions } from '../../lib/middleware.js'

export default async function handler(req, res) {
  if (handleOptions(req, res)) return
  cors(res)

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { category } = req.query

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

  const { data: products, error } = await query

  if (error) {
    return res.status(500).json({ error: error.message })
  }

  res.json(products)
}
