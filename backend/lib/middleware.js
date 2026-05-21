import { getSession } from './auth.js'

export function cors(res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader('Access-Control-Allow-Origin', process.env.FRONTEND_URL || '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
}

export async function authenticate(req) {
  const authHeader = req.headers.authorization
  if (!authHeader?.startsWith('Bearer ')) {
    return null
  }

  const token = authHeader.substring(7)
  const session = await getSession(token)
  
  if (!session) return null
  
  return session.users
}

export function handleOptions(req, res) {
  if (req.method === 'OPTIONS') {
    cors(res)
    res.status(200).end()
    return true
  }
  return false
}
