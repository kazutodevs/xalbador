import { getSession } from '../lib/jwt.js'

export async function authenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization
    
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' })
    }

    const token = authHeader.substring(7)
    const session = await getSession(token)

    if (!session) {
      return res.status(401).json({ error: 'Invalid or expired session' })
    }

    req.user = session.users
    req.session = session
    next()
  } catch (error) {
    console.error('Auth middleware error:', error)
    res.status(500).json({ error: 'Authentication failed' })
  }
}

export function authorizeAdmin(req, res, next) {
  if (!req.user?.admin || req.user.admin !== 1) {
    return res.status(403).json({ error: 'Admin access required' })
  }
  next()
}

export async function optionalAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization
    
    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.substring(7)
      const session = await getSession(token)
      
      if (session) {
        req.user = session.users
        req.session = session
      }
    }
    
    next()
  } catch (error) {
    next()
  }
}
