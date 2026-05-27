const MAYAR_API_URL = 'https://api.mayar.id/hl/v1'
const MAYAR_API_KEY = process.env.MAYAR_API_KEY

function normalizePhone(phone) {
  return phone
    ?.replace(/\D/g, '')
    .replace(/^0/, '62')
}

export async function createPayment({ 
  orderNumber,
  amount,
  description,
  customerEmail,
  customerName,
  customerMobile,
}) {

  if (!customerMobile) {
    throw new Error('Customer mobile is required')
  }

  const mobile = normalizePhone(customerMobile)

  const response = await fetch(`${MAYAR_API_URL}/payment/create`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${MAYAR_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: customerName,
      email: customerEmail,
      mobile,
      amount,
      description,

      expiredAt: new Date(
        Date.now() + 24 * 60 * 60 * 1000
      ).toISOString(),

      callbackUrl:
        `${process.env.BACKEND_URL || process.env.FRONTEND_URL}/api/payment/callback`,

redirectUrl:
  `${process.env.FRONTEND_URL}/success?orderId=${orderNumber}`,
    }),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(
      `Mayar API error: ${response.status} - ${JSON.stringify(data)}`
    )
  }

  return data
}

export async function verifyPayment(paymentId) {
  const response = await fetch(
    `${MAYAR_API_URL}/payment/${paymentId}`,
    {
      headers: {
        Authorization: `Bearer ${MAYAR_API_KEY}`,
      },
    }
  )

  const data = await response.json()

  if (!response.ok) {
    throw new Error(
      `Mayar verify error: ${response.status} - ${JSON.stringify(data)}`
    )
  }

  return data
}

// Di bagian BAWAH mayar.js, tambahkan:
export const mayar = {
  createPayment,
  verifyPayment,
}