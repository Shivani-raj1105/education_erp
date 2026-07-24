const express = require('express');
const { body } = require('express-validator');
const { getList, getById, create, update, remove } = require('../controllers/technicalEvent.controller');
const { authenticate, requireHOD } = require('../middlewares/auth.middleware');
const { validate } = require('../middlewares/validate.middleware');

const router = express.Router();

// All routes require authentication
router.use(authenticate);

const VALID_STATUSES  = ['ONGOING', 'COMPLETED'];
const VALID_EVENT_TYPES = [
  'Hackathon',
  'Project',
  'Paper Presentation',
  'Coding Contest',
  'Workshop',
  'Seminar',
  'Internship',
  'Other',
];

const createValidation = [
  body('studentName')
    .trim().notEmpty().withMessage('Student name is required')
    .isLength({ max: 150 }).withMessage('Student name too long'),
  body('usn')
    .trim().notEmpty().withMessage('USN / Roll number is required')
    .isLength({ max: 30 }).withMessage('USN too long'),
  body('department')
    .trim().notEmpty().withMessage('Department is required')
    .isLength({ max: 100 }),
  body('section')
    .trim().notEmpty().withMessage('Section is required')
    .isLength({ max: 10 }),
  body('semester')
    .isInt({ min: 1, max: 8 }).withMessage('Semester must be between 1 and 8'),
  body('eventType')
    .trim().notEmpty().withMessage('Event type is required')
    .isIn(VALID_EVENT_TYPES).withMessage(`Event type must be one of: ${VALID_EVENT_TYPES.join(', ')}`),
  body('projectName')
    .trim().notEmpty().withMessage('Project / event name is required')
    .isLength({ max: 200 }),
  body('projectDomain')
    .trim().notEmpty().withMessage('Project domain is required')
    .isLength({ max: 150 }),
  body('academicYear')
    .trim().notEmpty().withMessage('Academic year is required')
    .matches(/^\d{4}-\d{2,4}$/).withMessage('Academic year format: 2024-25 or 2024-2025'),
  body('facultyMentor')
    .optional({ checkFalsy: true }).isLength({ max: 150 }),
  body('projectStatus')
    .optional().isIn(VALID_STATUSES).withMessage('Status must be ONGOING or COMPLETED'),
];

const updateValidation = [
  body('studentName').optional().trim().notEmpty().isLength({ max: 150 }),
  body('usn').optional().trim().notEmpty().isLength({ max: 30 }),
  body('department').optional().trim().notEmpty().isLength({ max: 100 }),
  body('section').optional().trim().notEmpty().isLength({ max: 10 }),
  body('semester').optional().isInt({ min: 1, max: 8 }),
  body('eventType').optional().trim().notEmpty().isIn(VALID_EVENT_TYPES),
  body('projectName').optional().trim().notEmpty().isLength({ max: 200 }),
  body('projectDomain').optional().trim().notEmpty().isLength({ max: 150 }),
  body('academicYear')
    .optional()
    .matches(/^\d{4}-\d{2,4}$/).withMessage('Academic year format: 2024-25'),
  body('facultyMentor').optional({ checkFalsy: true }).isLength({ max: 150 }),
  body('projectStatus').optional().isIn(VALID_STATUSES),
];

// GET /api/activities/technical
router.get('/', getList);

// GET /api/activities/technical/:id
router.get('/:id', getById);

// POST /api/activities/technical  (HOD only)
router.post('/', requireHOD, createValidation, validate, create);

// PUT /api/activities/technical/:id  (HOD only)
router.put('/:id', requireHOD, updateValidation, validate, update);

// DELETE /api/activities/technical/:id  (HOD only)
router.delete('/:id', requireHOD, remove);

module.exports = router;
