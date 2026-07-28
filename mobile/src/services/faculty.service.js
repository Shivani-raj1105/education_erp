import api from './api';

export const facultyService = {
  getAll: async (params) => {
    const res = await api.get('/faculty', { params });
    return res.data;
  },

  getById: async (id) => {
    const res = await api.get(`/faculty/${id}`);
    return res.data;
  },
};

export const dashboardService = {
  get: async () => {
    const res = await api.get('/dashboard');
    return res.data;
  },
};

export const rolesService = {
  getAllRoles: async () => {
    const res = await api.get('/roles');
    return res.data;
  },

  getFacultyRoles: async (facultyId) => {
    const res = await api.get(`/roles/faculty/${facultyId}/roles`);
    return res.data;
  },

  assignRole: async (facultyId, roleId) => {
    const res = await api.post(`/roles/faculty/${facultyId}/roles`, { roleId });
    return res.data;
  },

  removeRole: async (facultyId, roleId) => {
    const res = await api.delete(`/roles/faculty/${facultyId}/roles/${roleId}`);
    return res.data;
  },
};
