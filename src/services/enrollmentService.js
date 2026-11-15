export const enrollmentService = {
  async getEnrollments() {
    const res = await fetch('/api/enrollments', { cache: 'no-store' });
    return res.json();
  },

  async createEnrollment(courseId) {
    const res = await fetch('/api/enrollments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ courseId }),
    });
    return res.json();
  },

  async updateEnrollmentStatus(enrollmentId, status) {
    const res = await fetch('/api/enrollments', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ enrollmentId, status }),
    });
    return res.json();
  },
};
