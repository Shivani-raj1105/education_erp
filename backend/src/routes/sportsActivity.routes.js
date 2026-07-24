const express = require('express');
const { body } = require('express-validator');
const { getList, getById, create, update, remove } = require('../controllers/sportsActivity.controller');
const { authenticate, requireHOD } = require('../middlewares/auth.middleware');
const { validate } = require('../middlewares/validate.middleware');

const router = express.Router();

// All routes require authentication
router.use(authenticate);

const createValidation = [
  body('studentName')
    .trim().notEmpty().withMessage('Student name is required')
    .isLength({ max: 150 }),
  body('usn')
    .trim().notEmpty().withMessage('USN / Roll number is required')
    .isLength({ max: 30 }),
  body('department')
    .trim().notEmpty().withMessage('Department is required')
    .isLength({ max: 100 }),
  body('section')
    .trim().notEmpty().withMessage('Section is required')
    .isLength({ max: 10 }),
  body('semester')
    .isInt({ min: 1, max: 8 }).withMessage('Semester must be between 1 and 8'),
  body('sportName')
    .trim().notEmpty().withMessage('Sport name is required')
    .isLength({ max: 150 }),
  body('competitionLevel')
    .trim().notEmpty().withMessage('Competition level is required')
    .isLength({ max: 100 }),
  body('positionMedal')
    .optional({ checkFalsy: true }).isLength({ max: 100 }),
  body('academicYear')
    .trim().notEmpty().withMessage('Academic year is required')
    .matches(/^\d{4}-\d{2,4}$/).withMessage('Academic year format: 2024-25 or 2024-2025'),
];

const updateValidation = [
  body('studentName').optional().trim().notEmpty().isLength({ max: 150 }),
  body('usn').optional().trim().notEmpty().isLength({ max: 30 }),
  body('department').optional().trim().notEmpty().isLength({ max: 100 }),
  body('section').optional().trim().notEmpty().isLength({ max: 10 }),
  body('semester').optional().isInt({ min: 1, max: 8 }),
  body('sportName').optional().trim().notEmpty().isLength({ max: 150 }),
  body('competitionLevel').optional().trim().notEmpty().isLength({ max: 100 }),
  body('positionMedal').optional({ checkFalsy: true }).isLength({ max: 100 }),
  body('academicYear')
    .optional()
    .matches(/^\d{4}-\d{2,4}$/).withMessage('Academic year format: 2024-25'),
];

// GET /api/activities/sports
router.get('/', getList);

// GET /api/activities/sports/:id
router.get('/:id', getById);

// POST /api/activities/sports  (HOD only)
router.post('/', requireHOD, createValidation, validate, create);

// PUT /api/activities/sports/:id  (HOD only)
router.put('/:id', requireHOD, updateValidation, validate, update);

// DELETE /api/activities/sports/:id  (HOD only)
router.delete('/:id', requireHOD, remove);

module.exports = router;
