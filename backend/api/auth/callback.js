import { supabase } from '../../lib/supabase.js'
import { createSession } from '../../lib/auth.js'
import { cors, handleOptions } from '../../lib/middleware.js'

const FRONTEND_URL = process.env.FRONTEND_URL

export default async function handler(req, res) {
  if (handleOptions(req, res)) return
  cors(res)

  const { code, provider } = req.query

  if (!code || !provider) {
    return res.redirect(`${FRONTEND_URL}/auth?error=missing_params`)
  }

  try {
    let userData

    if (provider === 'google') {
      userData = await handleGoogleCallback(code)
    } else if (provider === 'discord') {
      userData = await handleDiscordCallback(code)
    } else {
      return res.redirect(`${FRONTEND_URL}/auth?error=invalid_provider`)
    }

    // Find or create user
    let { data: user } = await supabase
      .from('users')
      .select()
      .eq('provider', provider)
      .eq('provider_id', userData.id)
      .single()

    if (!user) {
      const { data: newUser } = await supabase
        .from('users')
        .insert({
          email: userData.email,
          name: userData.name,
          avatar_url: userData.avatar,
          provider,
          provider_id: userData.id,
        })
        .select()
        .single()

      user = newUser
    }

    // Create session
    const token = await createSession(user.id)

    res.redirect(`${FRONTEND_URL}/auth?token=${token}`)
  } catch (error) {
    console.error('Auth callback error:', error)
    res.redirect(`${FRONTEND_URL}/auth?error=auth_failed`)
  }
}

async function handleGoogleCallback(code) {
  const redirectUri = `${FRONTEND_URL}/api/auth/callback?provider=google`
  
  // Exchange code for tokens
  const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code',
    }),
  })

  const tokens = await tokenResponse.json()

  // Get user info
  const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
    headers: { Authorization: `Bearer ${tokens.access_token}` },
  })

  const user = await userResponse.json()

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    avatar: user.picture,
  }
}

async function handleDiscordCallback(code) {
  const redirectUri = `${FRONTEND_URL}/api/auth/callback?provider=discord`

  // Exchange code for tokens
  const tokenResponse = await fetch('https://discord.com/api/oauth2/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: process.env.DISCORD_CLIENT_ID,
      client_secret: process.env.DISCORD_CLIENT_SECRET,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code',
    }),
  })

  const tokens = await tokenResponse.json()

  // Get user info
  const userResponse = await fetch('https://discord.com/api/users/@me', {
    headers: { Authorization: `Bearer ${tokens.access_token}` },
  })

  const user = await userResponse.json()

  return {
    id: user.id,
    email: user.email,
    name: user.username,
    avatar: user.avatar
      ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`
      : null,
  }
}
