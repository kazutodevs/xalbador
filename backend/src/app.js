import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import rateLimit from 'express-rate-limit'

import { config } from './config/index.js'
import { errorHandler, notFoundHandler } from './middleware/error.middleware.js'

// Routes
import authRoutes from './routes/auth.routes.js'
import productsRoutes from './routes/products.routes.js'
import ordersRoutes from './routes/orders.routes.js'
import paymentRoutes from './routes/payment.routes.js'
import userRoutes from './routes/user.routes.js'

const app = express()

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}))

// CORS
app.use(cors({
  origin: (origin, callback) => {
    const allowedOrigins = [
      config.frontendUrl,
      'https://xalbador.kazuto.biz.id',
      'http://localhost:5173',
    ]
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}))

// Body parser
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))
app.use(cookieParser())

// Logging
if (config.nodeEnv !== 'production') {
  app.use(morgan('dev'))
}

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' },
})

// Stricter rate limit for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { error: 'Too many auth attempts, please try again later.' },
})

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: config.nodeEnv,
  })
})

// API Routes
app.use('/api/auth', authLimiter, authRoutes)
app.use('/api/products', limiter, productsRoutes)
app.use('/api/orders', limiter, ordersRoutes)
app.use('/api/payment', limiter, paymentRoutes)
app.use('/api/user', limiter, userRoutes)

// 404 handler
app.use(notFoundHandler)

// Error handler
app.use(errorHandler)

export default app
