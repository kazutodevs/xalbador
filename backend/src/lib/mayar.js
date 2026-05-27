import { config } from '../config/index.js'

class MayarClient {
  constructor() {
    this.apiKey = config.mayar.apiKey
    this.apiUrl = config.mayar.apiUrl
  }

  async request(endpoint, options = {}) {
    const response = await fetch(`${this.apiUrl}${endpoint}`, {
      ...options,
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Mayar API error: ${response.status} - ${error}`)
    }

    return response.json()
  }

async createPayment({ orderId, amount, description, customerEmail, customerName, customerMobile }) {
  if (!customerMobile) {
    throw new Error('Customer mobile is required')
  }

  const mobile = customerMobile.replace(/\D/g, '').replace(/^0/, '62')

  return this.request('/payment/create', {
    method: 'POST',
    body: JSON.stringify({
      name: customerName,
      email: customerEmail,
      mobile,          
      amount,
      description,
      expiredAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      callbackUrl: `${config.backendUrl}/api/payment/callback`,
      redirectUrl: `${config.frontendUrl}/success`,
    }),
  })
}

  async verifyPayment(paymentId) {
    return this.request(`/payment/${paymentId}`)
  }
}

export const mayar = new MayarClient()
