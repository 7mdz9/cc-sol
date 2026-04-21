// Temporary mock submission layer for Step 6.
// Step 7 will replace this with confirmation-page routing and richer order state.
export async function submitOrder(payload) {
  await sleep(500);

  const orderRecord = {
    ...payload,
    orderId: `order_${Date.now()}`,
    submittedAt: new Date().toISOString()
  };

  sessionStorage.setItem("solea_last_order", JSON.stringify(orderRecord));
  return orderRecord;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
