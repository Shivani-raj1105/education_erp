import api from './api';

export const hackathonService = {
  getAll: async (params) => {
    const res = await api.get('/activities/hackathons', { params });
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

export const sportsService = {
  getAll: async (params) => {
    const res = await api.get('/activities/sports', { params });
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

export const industryProjectService = {
  getAll: async (params) => {
    const res = await api.get('/activities/industry-projects', { params });
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

export const otherCurricularService = {
  getAll: async (params) => {
    const res = await api.get('/activities/other-curricular', { params });
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
