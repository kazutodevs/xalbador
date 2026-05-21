import { supabase } from '../lib/supabase.js'
import { createSession, deleteSession } from '../lib/jwt.js'
import { config } from '../config/index.js'
import { AppError } from '../middleware/error.middleware.js'

export function googleLogin(req, res) {
  const redirectUri = `${config.backendUrl}/api/auth/callback?provider=google`
  const scope = encodeURIComponent('openid email profile')
  
  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
    `client_id=${config.oauth.google.clientId}` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}` +
    `&response_type=code` +
    `&scope=${scope}` +
    `&access_type=offline` +
    `&prompt=consent`

  res.redirect(authUrl)
}

export function discordLogin(req, res) {
  if (!config.oauth.discord.clientId || !config.oauth.discord.clientSecret) {
    console.error('Discord OAuth config missing:', {
      clientId: config.oauth.discord.clientId,
      clientSecret: Boolean(config.oauth.discord.clientSecret),
    })
    return res.redirect(`${config.frontendUrl}/auth?error=discord_config_missing`)
  }

  const redirectUri = `${config.backendUrl}/api/auth/callback?provider=discord`
  const scope = encodeURIComponent('identify email')
  
  const authUrl = `https://discord.com/api/oauth2/authorize` +
    `?client_id=${config.oauth.discord.clientId}` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}` +
    `&response_type=code` +
    `&scope=${scope}` +
    `&prompt=consent`

  res.redirect(authUrl)
}

export async function oauthCallback(req, res, next) {
  try {
    const { code, provider } = req.query

    if (!code || !provider) {
      return res.redirect(`${config.frontendUrl}/auth?error=missing_params`)
    }

    let userData
    
    if (provider === 'google') {
      userData = await handleGoogleCallback(code)
    } else if (provider === 'discord') {
      userData = await handleDiscordCallback(code)
    } else {
      return res.redirect(`${config.frontendUrl}/auth?error=invalid_provider`)
    }

    // Find or create user
    let { data: user } = await supabase
      .from('users')
      .select('*')
      .eq('provider', provider)
      .eq('provider_id', userData.id)
      .single()

    if (!user) {
      const { data: newUser, error } = await supabase
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

      if (error) throw error
      user = newUser
    } else {
      // Update user info on each login
      await supabase
        .from('users')
        .update({
          name: userData.name,
          avatar_url: userData.avatar,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id)
    }

    if (!user?.id) {
      throw new Error('User ID missing after OAuth login')
    }

    const token = await createSession(user.id)
    res.redirect(`${config.frontendUrl}/auth?token=${token}`)
  } catch (error) {
    console.error('OAuth callback error:', error)
    res.redirect(`${config.frontendUrl}/auth?error=auth_failed`)
  }
}

async function handleGoogleCallback(code) {
  const redirectUri = `${config.backendUrl}/api/auth/callback?provider=google`
  
  const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: config.oauth.google.clientId,
      client_secret: config.oauth.google.clientSecret,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code',
    }),
  })

  if (!tokenResponse.ok) {
    throw new Error('Failed to exchange Google code')
  }

  const tokens = await tokenResponse.json()

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
  if (!config.oauth.discord.clientId || !config.oauth.discord.clientSecret) {
    throw new Error('Discord OAuth configuration is missing')
  }

  const redirectUri = `${config.backendUrl}/api/auth/callback?provider=discord`

  const tokenResponse = await fetch('https://discord.com/api/oauth2/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: config.oauth.discord.clientId,
      client_secret: config.oauth.discord.clientSecret,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code',
    }),
  })

  if (!tokenResponse.ok) {
    const errorBody = await tokenResponse.text()
    console.error('Discord token exchange failed:', tokenResponse.status, errorBody)
    throw new Error('Failed to exchange Discord code')
  }

  const tokens = await tokenResponse.json()

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

export function getSession(req, res) {
  res.json({
    user: req.user,
    sessionId: req.session.session_token,
  })
}

export async function logout(req, res, next) {
  try {
    await deleteSession(req.session.session_token)
    res.json({ success: true })
  } catch (error) {
    next(error)
  }
}
