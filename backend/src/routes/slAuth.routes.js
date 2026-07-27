const { Router } = require('express');
const { body, validationResult } = require('express-validator');
const SlAuthController = require('../controllers/slAuth.controller');
const { errorResponse } = require('../utils/response');

const router = Router();

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

/**
 * POST /api/hod/auth/login
 * Login for HOD / Faculty (Student-List module)
 */
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email required').normalizeEmail(),
    body('password').notEmpty().withMessage('Password is required')
  ],
  validate,
  SlAuthController.login
);

module.exports = router;
