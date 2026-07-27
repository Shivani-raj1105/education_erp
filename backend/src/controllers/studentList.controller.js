const studentListService = require('../services/studentList.service');

const StudentListController = {
  // GET /api/hod/student-list/semesters
  async getSemesters(req, res, next) {
    try {
      const data = await studentListService.getSemesters();
      return res.status(200).json({ success: true, message: 'Semesters fetched successfully', data });
    } catch (err) {
      next(err);
    }
  },

  // GET /api/hod/student-list/:semester/sections
  async getSections(req, res, next) {
    try {
      const semesterNumber = parseInt(req.params.semester, 10);
      const data = await studentListService.getSectionsBySemester(semesterNumber);
      return res.status(200).json({ success: true, message: 'Sections fetched successfully', data });
    } catch (err) {
      next(err);
    }
  },

  // GET /api/hod/student-list/:semester/:section
  async getSectionDashboard(req, res, next) {
    try {
      const semesterNumber = parseInt(req.params.semester, 10);
      const sectionName   = req.params.section.toUpperCase();
      const pagination    = { page: req.query.page, limit: req.query.limit };

      const data = await studentListService.getSectionDashboard(semesterNumber, sectionName, pagination);
      return res.status(200).json({ success: true, message: 'Section dashboard fetched successfully', data });
    } catch (err) {
      next(err);
    }
  }
};

module.exports = StudentListController;
