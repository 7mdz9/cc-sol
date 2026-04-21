// Mock backend. Replace with real Stripe/Telr calls in a future project.
export async function mockCreatePayment({ method, amount, currency, metadata }) {
  await sleep(800 + Math.random() * 800);

  if (Math.random() < 0.05) {
    throw new Error("Payment declined. Please try again.");
  }

  return {
    success: true,
    paymentId: `mock_${Date.now()}`,
    method,
    amount,
    currency,
    metadata,
    paidAt: new Date().toISOString()
  };
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
