export const courseService = {
  async getCourses(params = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`/api/courses${query ? '?' + query : ''}`, { cache: 'no-store' });
    return res.json();
  },

  async getCourseById(id) {
    const res = await fetch(`/api/courses/${id}`, { cache: 'no-store' });
    return res.json();
  },

  async createCourse(data) {
    const res = await fetch('/api/courses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async updateCourse(id, data) {
    const res = await fetch(`/api/courses/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async deleteCourse(id) {
    const res = await fetch(`/api/courses/${id}`, { method: 'DELETE' });
    return res.json();
  },
};
