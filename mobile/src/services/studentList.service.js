import api from './api';

const studentListService = {
  getSemesters: async () => {
    const res = await api.get('/hod/student-list/semesters');
    return res.data;
  },

  getSections: async (semester) => {
    const res = await api.get(`/hod/student-list/${semester}/sections`);
    return res.data;
  },

  getSectionDashboard: async (semester, section, page = 1, limit = 50) => {
    const res = await api.get(`/hod/student-list/${semester}/${section}`, {
      params: { page, limit },
    });
    return res.data;
  },
};

export default studentListService;
