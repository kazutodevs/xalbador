import jwt from 'jsonwebtoken'
import { config } from '../config/index.js'
import { supabase } from './supabase.js'

export function generateToken(userId, sessionId) {
  return jwt.sign({ userId, sessionId }, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
  })
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, config.jwt.secret)
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
  const { v4: uuidv4 } = await import('uuid')
  const sessionId = uuidv4()
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days

  const { error } = await supabase.from('sessions').insert({
    user_id: userId,
    session_token: sessionId,
    expires_at: expiresAt.toISOString(),
  })

  if (error) {
    console.error('Create session failed:', error)
    throw new Error('Failed to create session')
  }

  return generateToken(userId, sessionId)
}

export async function deleteSession(sessionId) {
  await supabase
    .from('sessions')
    .delete()
    .eq('session_token', sessionId)
}
