const express = require('express');
const { body } = require('express-validator');
const { login, logout, getMe } = require('../controllers/auth.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { validate } = require('../middlewares/validate.middleware');

const router = express.Router();

router.post(
  '/login',
  [
    body('departmentCode')
      .trim()
      .notEmpty().withMessage('Department code is required')
      .isLength({ max: 20 }).withMessage('Invalid department code'),
    body('username')
      .trim()
      .notEmpty().withMessage('Username is required')
      .isLength({ min: 3, max: 50 }).withMessage('Username must be 3-50 characters'),
    body('password')
      .notEmpty().withMessage('Password is required')
      .isLength({ min: 6, max: 100 }).withMessage('Password must be 6-100 characters'),
  ],
  validate,
  login
);

router.post('/logout', authenticate, logout);
router.get('/me', authenticate, getMe);

module.exports = router;
