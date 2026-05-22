export const config = {
  port: parseInt(process.env.PORT, 10) || 3001,
  nodeEnv: process.env.NODE_ENV || 'development',
  paymentMode: process.env.PAYMENT_MODE || 'test',
  host: process.env.HOST,
  
  frontendUrl: process.env.FRONTEND_URL || 'https://xalbador.kazuto.biz.id',
  backendUrl: process.env.BACKEND_URL || 'https://xalbador-production.up.railway.app',
  
  supabase: {
    url: 'https://kcdanyszvnympanrtjff.supabase.co',
    serviceKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtjZGFueXN6dm55bXBhbnJ0amZmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3OTI3MTQ4MywiZXhwIjoyMDk0ODQ3NDgzfQ.jnU_tC3xYXuyNn9WUvpP4Vf48FK9uCOqTyuzV67QBv0',
  },
  
  jwt: {
    secret: process.env.JWT_SECRET || '5ca3afd5-dae6-49b3-8bb4-5374c611fe29',
    expiresIn: process.env.JWT_EXPIRES_IN || '30d',
  },
  
  oauth: {
    google: {
      clientId: '367213523042-1d5443mligan1vor7lqp1rtftqt46mbk.apps.googleusercontent.com',
      clientSecret: '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',
    },
    discord: {
      clientId: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
    },
  },
  
  mayar: {
    apiKey: process.env.MAYAR_API_KEY,
    apiUrl: process.env.MAYAR_API_URL || 'https://api.mayar.id/hl/v1',
  },
}

// Startup diagnostics (non-sensitive)
if (!process.env.DISCORD_CLIENT_ID || !process.env.DISCORD_CLIENT_SECRET) {
  console.warn('Discord OAuth not configured: missing DISCORD_CLIENT_ID or DISCORD_CLIENT_SECRET')
} else {
  console.log('Discord OAuth configured')
}

// Validate required env vars in production
if (config.nodeEnv === 'production') {
  const required = [
    'SUPABASE_URL',
    'SUPABASE_SERVICE_KEY',
    'JWT_SECRET',
    'FRONTEND_URL',
  ]
  
  const missing = required.filter((key) => !process.env[key])
  if (missing.length > 0) {
    console.error('Missing required environment variables:', missing)
    // In server environments (like Vercel) it's preferable to configure env vars
    // in the hosting dashboard. Avoid exiting during module import to prevent
    // crashing serverless function invocations. If you want strict failure,
    // set STRICT_ENV=1 in the environment to preserve previous behavior.
    if (process.env.STRICT_ENV === '1') {
      process.exit(1)
    }
  }
}
