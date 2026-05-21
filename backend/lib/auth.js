import jwt from 'jsonwebtoken'
import { supabase } from './supabase.js'

const JWT_SECRET = process.env.JWT_SECRET

export function generateToken(userId, sessionId) {
  return jwt.sign({ userId, sessionId }, JWT_SECRET, { expiresIn: '30d' })
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch (error) {
    return null
  }
}

export async function getSession(token) {
  const decoded = verifyToken(token)
  if (!decoded) return null

  const { data: session } = await supabase
    .from('sessions')
    .select('*, users(*)')
    .eq('session_token', decoded.sessionId)
    .gt('expires_at', new Date().toISOString())
    .single()

  return session
}

export async function createSession(userId) {
  const sessionId = crypto.randomUUID()
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days

  await supabase.from('sessions').insert({
    user_id: userId,
    session_token: sessionId,
    expires_at: expiresAt.toISOString(),
  })

  return generateToken(userId, sessionId)
}
