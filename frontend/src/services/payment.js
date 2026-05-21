import api from './api'
import { PAYMENT_MODE } from '@utils/constants'
import { generateOrderNumber } from '@utils/helpers'

export async function createPayment(orderData) {
  const orderNumber = generateOrderNumber()

  if (PAYMENT_MODE === 'test') {
    // Simulate payment success in test mode
    await new Promise((resolve) => setTimeout(resolve, 1500))
    
    return {
      success: true,
      orderId: orderNumber,
      paymentId: `TEST-${Date.now()}`,
      redirectUrl: null,
      testMode: true,
    }
  }

  // Live mode - Create actual Mayar payment
  const response = await api.post('/payment/create', {
    orderNumber,
    ...orderData,
  })

  return response.data
}

export async function verifyPayment(paymentId) {
  if (PAYMENT_MODE === 'test') {
    return { success: true, status: 'paid' }
  }

  const response = await api.post('/payment/verify', { paymentId })
  return response.data
}
