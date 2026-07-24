const express = require('express');
const { body } = require('express-validator');
const ctrl = require('../controllers/industryProject.controller');
const { authenticate, requireHOD } = require('../middlewares/auth.middleware');
const { validate } = require('../middlewares/validate.middleware');

const router = express.Router();
router.use(authenticate);

const VALID_STATUSES = ['ONGOING', 'COMPLETED'];

const projectValidation = [
  body('projectName').trim().notEmpty().withMessage('Project name is required').isLength({ max: 200 }),
  body('status').optional().isIn(VALID_STATUSES).withMessage('Status must be ONGOING or COMPLETED'),
];

const studentValidation = [
  body('studentName').trim().notEmpty().withMessage('Student name is required').isLength({ max: 150 }),
  body('usn').trim().notEmpty().withMessage('USN is required').isLength({ max: 30 }),
  body('semester').isInt({ min: 1, max: 8 }).withMessage('Semester must be 1–8'),
  body('section').trim().notEmpty().withMessage('Section is required').isLength({ max: 10 }),
];

// GET  /api/activities/industry-projects
router.get('/', ctrl.getList);

// GET  /api/activities/industry-projects/:id
router.get('/:id', ctrl.getById);

// POST /api/activities/industry-projects  (HOD only)
router.post('/', requireHOD, projectValidation, validate, ctrl.create);

// PUT  /api/activities/industry-projects/:id  (HOD only)
router.put('/:id', requireHOD, projectValidation, validate, ctrl.update);

// DELETE /api/activities/industry-projects/:id  (HOD only)
router.delete('/:id', requireHOD, ctrl.remove);

// POST /api/activities/industry-projects/:id/students  (add student)
router.post('/:id/students', requireHOD, studentValidation, validate, ctrl.addStudent);

// DELETE /api/activities/industry-projects/:id/students/:studentId
router.delete('/:id/students/:studentId', requireHOD, ctrl.removeStudent);

module.exports = router;
