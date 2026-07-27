const { Router } = require('express');
const { param, body, validationResult } = require('express-validator');
const { slAuthenticate, slRequireHOD } = require('../middlewares/slAuth.middleware');
const StudentListController = require('../controllers/studentList.controller');
const { errorResponse } = require('../utils/response');

const router = Router();

// ─── Validation helper ────────────────────────────────────────────────────────
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return errorResponse(res, 'Validation failed', 400, errors.array().map(e => ({
      field: e.path || e.param,
      message: e.msg
    })));
  }
  next();
};

// ─── All routes require a valid JWT with HOD role ─────────────────────────────
router.use(slAuthenticate, slRequireHOD);

/**
 * GET /api/hod/student-list/semesters
 * Returns current semester type and applicable semesters from the database
 */
router.get('/semesters', StudentListController.getSemesters);

/**
 * GET /api/hod/student-list/:semester/sections
 * Returns all sections for the given semester (1–8)
 */
router.get(
  '/:semester/sections',
  [
    param('semester')
      .isInt({ min: 1, max: 8 })
      .withMessage('Semester must be an integer between 1 and 8')
      .toInt()
  ],
  validate,
  StudentListController.getSections
);

/**
 * GET /api/hod/student-list/:semester/:section
 * Returns full section dashboard: timetable, subject-faculty mapping, students
 * Query params: page (default 1), limit (default 50)
 */
router.get(
  '/:semester/:section',
  [
    param('semester')
      .isInt({ min: 1, max: 8 })
      .withMessage('Semester must be an integer between 1 and 8')
      .toInt(),
    param('section')
      .isLength({ min: 1, max: 10 })
      .withMessage('Section must be 1–10 characters')
      .trim()
  ],
  validate,
  StudentListController.getSectionDashboard
);

module.exports = router;
