import { supabase } from '../../lib/supabase.js'
import { verifyToken } from '../../lib/auth.js'
import { cors, handleOptions } from '../../lib/middleware.js'

export default async function handler(req, res) {
  if (handleOptions(req, res)) return
  cors(res)

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const authHeader = req.headers.authorization
  if (!authHeader?.startsWith('Bearer ')) {
    return res.json({ success: true })
  }

  const token = authHeader.substring(7)
  const decoded = verifyToken(token)

  if (decoded?.sessionId) {
    await supabase
      .from('sessions')
      .delete()
      .eq('session_token', decoded.sessionId)
  }

  res.json({ success: true })
}
