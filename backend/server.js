import 'dotenv/config'

import app from './src/app.js'
import { config } from './src/config/index.js'
import authRoutes from './src/routes/auth.routes.js'
import orderRoutes from './src/routes/orders.routes.js'

app.use('/api/auth', authRoutes)
app.use('/api/orders', orderRoutes)

const PORT = config.port
app.set('trust proxy', 1)
app.listen(PORT, () => {
  console.log(`
  ╔════════════════════════════════════════╗
  ║  🚀 Xalbador Backend Server            ║
  ║                                        ║
  ║  Running on: http://localhost:${PORT}     ║
  ║  Environment: ${config.nodeEnv.padEnd(24)} ║
  ║  Payment Mode: ${config.paymentMode.padEnd(23)} ║
  ╚════════════════════════════════════════╝
  `)
})



// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully')
  process.exit(0)
})
