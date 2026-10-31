const key = import.meta.env.VITE_PAYMENT_KEY

export function payHeaders() {
  return { 'x-payment-key': key }
}
