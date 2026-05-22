const MAYAR_API_URL = 'https://api.mayar.id/hl/v1'
const MAYAR_API_KEY = process.env.MAYAR_API_KEY

export async function createPayment({ orderId, amount, description, customerEmail, customerName }) {
  const response = await fetch(`${MAYAR_API_URL}/payment/create`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${MAYAR_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: customerName,
      email: customerEmail,
      amount,
      description,
      expiredAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      // callback should point to backend endpoint that receives payment callbacks
      callbackUrl: `${process.env.BACKEND_URL || process.env.FRONTEND_URL}/api/payment/callback`,
      redirectUrl: `${process.env.FRONTEND_URL}/success`,
      mobile: null,
    }),
  })

  const data = await response.json()
  return data
}

export async function verifyPayment(paymentId) {
  const response = await fetch(`${MAYAR_API_URL}/payment/${paymentId}`, {
    headers: {
      'Authorization': `Bearer ${MAYAR_API_KEY}`,
    },
  })

  const data = await response.json()
  return data
}
