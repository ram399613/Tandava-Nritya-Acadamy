export const paymentService = {
  async getPayments() {
    const res = await fetch('/api/payments', { cache: 'no-store' });
    return res.json();
  },

  async updatePaymentStatus(paymentId, status) {
    const res = await fetch('/api/payments', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ paymentId, status }),
    });
    return res.json();
  },
};
