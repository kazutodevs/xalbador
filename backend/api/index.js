import app from '../src/app.js'

// Vercel serverless handler
export default function handler(req, res) {
  return app(req, res)
}
