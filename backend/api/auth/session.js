import { cors, handleOptions, authenticate } from '../../lib/middleware.js'

export default async function handler(req, res) {
  if (handleOptions(req, res)) return
  cors(res)

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const user = await authenticate(req)
  
  if (!user) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  res.json({ user })
}
