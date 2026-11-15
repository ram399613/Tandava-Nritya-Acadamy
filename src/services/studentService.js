export const studentService = {
  async getStudents(params = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`/api/students${query ? '?' + query : ''}`, { cache: 'no-store' });
    return res.json();
  },

  async getStudentById(id) {
    const res = await fetch(`/api/students/${id}`, { cache: 'no-store' });
    return res.json();
  },

  async updateStudent(id, data) {
    const res = await fetch(`/api/students/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async deleteStudent(id) {
    const res = await fetch(`/api/students/${id}`, { method: 'DELETE' });
    return res.json();
  },
};
