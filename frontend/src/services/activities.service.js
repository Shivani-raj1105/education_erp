import api from './api';

// ─── Technical Events ─────────────────────────────────────────────────────────

export const technicalEventService = {
  getAll: async (params) => {
    const res = await api.get('/activities/technical', { params });
    return res.data;
  },

  getById: async (id) => {
    const res = await api.get(`/activities/technical/${id}`);
    return res.data;
  },

  create: async (data) => {
    const res = await api.post('/activities/technical', data);
    return res.data;
  },

  update: async (id, data) => {
    const res = await api.put(`/activities/technical/${id}`, data);
    return res.data;
  },

  delete: async (id) => {
    const res = await api.delete(`/activities/technical/${id}`);
    return res.data;
  },
};

// ─── Sports Activities ────────────────────────────────────────────────────────

export const sportsActivityService = {
  getAll: async (params) => {
    const res = await api.get('/activities/sports', { params });
    return res.data;
  },

  getById: async (id) => {
    const res = await api.get(`/activities/sports/${id}`);
    return res.data;
  },

  create: async (data) => {
    const res = await api.post('/activities/sports', data);
    return res.data;
  },

  update: async (id, data) => {
    const res = await api.put(`/activities/sports/${id}`, data);
    return res.data;
  },

  delete: async (id) => {
    const res = await api.delete(`/activities/sports/${id}`);
    return res.data;
  },
};

// ─── Cultural Activities ──────────────────────────────────────────────────────

export const culturalActivityService = {
  getAll: async (params) => {
    const res = await api.get('/activities/cultural', { params });
    return res.data;
  },

  getById: async (id) => {
    const res = await api.get(`/activities/cultural/${id}`);
    return res.data;
  },

  create: async (data) => {
    const res = await api.post('/activities/cultural', data);
    return res.data;
  },

  update: async (id, data) => {
    const res = await api.put(`/activities/cultural/${id}`, data);
    return res.data;
  },

  delete: async (id) => {
    const res = await api.delete(`/activities/cultural/${id}`);
    return res.data;
  },
};

// ─── Industry Projects ────────────────────────────────────────────────────────

export const industryProjectService = {
  getAll: async (params) => {
    const res = await api.get('/activities/industry-projects', { params });
    return res.data;
  },
  getById: async (id) => {
    const res = await api.get(`/activities/industry-projects/${id}`);
    return res.data;
  },
  create: async (data) => {
    const res = await api.post('/activities/industry-projects', data);
    return res.data;
  },
  update: async (id, data) => {
    const res = await api.put(`/activities/industry-projects/${id}`, data);
    return res.data;
  },
  delete: async (id) => {
    const res = await api.delete(`/activities/industry-projects/${id}`);
    return res.data;
  },
  addStudent: async (projectId, data) => {
    const res = await api.post(`/activities/industry-projects/${projectId}/students`, data);
    return res.data;
  },
  removeStudent: async (projectId, studentId) => {
    const res = await api.delete(`/activities/industry-projects/${projectId}/students/${studentId}`);
    return res.data;
  },
};

// ─── Hackathons ───────────────────────────────────────────────────────────────

export const hackathonService = {
  getAll: async (params) => {
    const res = await api.get('/activities/hackathons', { params });
    return res.data;
  },
  getById: async (id) => {
    const res = await api.get(`/activities/hackathons/${id}`);
    return res.data;
  },
  create: async (data) => {
    const res = await api.post('/activities/hackathons', data);
    return res.data;
  },
  update: async (id, data) => {
    const res = await api.put(`/activities/hackathons/${id}`, data);
    return res.data;
  },
  delete: async (id) => {
    const res = await api.delete(`/activities/hackathons/${id}`);
    return res.data;
  },
};

// ─── Other Curricular Activities ──────────────────────────────────────────────

export const otherCurricularService = {
  getAll: async (params) => {
    const res = await api.get('/activities/other-curricular', { params });
    return res.data;
  },
  getById: async (id) => {
    const res = await api.get(`/activities/other-curricular/${id}`);
    return res.data;
  },
  create: async (data) => {
    const res = await api.post('/activities/other-curricular', data);
    return res.data;
  },
  update: async (id, data) => {
    const res = await api.put(`/activities/other-curricular/${id}`, data);
    return res.data;
  },
  delete: async (id) => {
    const res = await api.delete(`/activities/other-curricular/${id}`);
    return res.data;
  },
};
