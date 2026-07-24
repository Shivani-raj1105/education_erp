const express = require('express');
const { body } = require('express-validator');
const ctrl = require('../controllers/otherCurricular.controller');
const { authenticate, requireHOD } = require('../middlewares/auth.middleware');
const { validate } = require('../middlewares/validate.middleware');

const router = express.Router();
router.use(authenticate);

const createValidation = [
  body('studentName').trim().notEmpty().withMessage('Student name is required').isLength({ max: 150 }),
  body('usn').trim().notEmpty().withMessage('USN is required').isLength({ max: 30 }),
  body('semester').isInt({ min: 1, max: 8 }).withMessage('Semester must be 1–8'),
  body('section').trim().notEmpty().withMessage('Section is required').isLength({ max: 10 }),
  body('eventName').trim().notEmpty().withMessage('Event name is required').isLength({ max: 200 }),
  body('organizingCollege').trim().notEmpty().withMessage('Organizing college is required').isLength({ max: 200 }),
  body('achievement').optional({ checkFalsy: true }).isLength({ max: 200 }),
  body('year').isInt({ min: 2000, max: 2100 }).withMessage('Valid year required'),
];

const updateValidation = [
  body('studentName').optional().trim().notEmpty().isLength({ max: 150 }),
  body('usn').optional().trim().notEmpty().isLength({ max: 30 }),
  body('semester').optional().isInt({ min: 1, max: 8 }),
  body('section').optional().trim().notEmpty().isLength({ max: 10 }),
  body('eventName').optional().trim().notEmpty().isLength({ max: 200 }),
  body('organizingCollege').optional().trim().notEmpty().isLength({ max: 200 }),
  body('achievement').optional({ checkFalsy: true }).isLength({ max: 200 }),
  body('year').optional().isInt({ min: 2000, max: 2100 }),
];

// GET  /api/activities/other-curricular
router.get('/', ctrl.getList);

// GET  /api/activities/other-curricular/:id
router.get('/:id', ctrl.getById);

// POST /api/activities/other-curricular  (HOD only)
router.post('/', requireHOD, createValidation, validate, ctrl.create);

// PUT  /api/activities/other-curricular/:id  (HOD only)
router.put('/:id', requireHOD, updateValidation, validate, ctrl.update);

// DELETE /api/activities/other-curricular/:id  (HOD only)
router.delete('/:id', requireHOD, ctrl.remove);

module.exports = router;
