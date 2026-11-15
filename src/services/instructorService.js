export const instructorService = {
  async getInstructors() {
    const res = await fetch('/api/instructors', { cache: 'no-store' });
    return res.json();
  },

  async addInstructor(data) {
    const res = await fetch('/api/instructors', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },
};
