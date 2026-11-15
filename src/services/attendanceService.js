export const attendanceService = {
  async getAttendance(params = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`/api/attendance${query ? '?' + query : ''}`, { cache: 'no-store' });
    return res.json();
  },

  async markAttendance(data) {
    const res = await fetch('/api/attendance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },
};
