import { createClient } from '@supabase/supabase-js'
import WebSocket from 'ws'
import { config } from '../config/index.js'

export const supabase = createClient(
  config.supabase.url,
  config.supabase.serviceKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },

    realtime: {
      transport: WebSocket,
    },
  }
)