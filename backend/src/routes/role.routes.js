const express = require('express');
const { body, param } = require('express-validator');
const {
  getAllRoles, getFacultyRoles, syncRoles,
} = require('../controllers/role.controller');
const { authenticate, requireHOD } = require('../middlewares/auth.middleware');
const { validate } = require('../middlewares/validate.middleware');

const router = express.Router();

router.use(authenticate);

// GET /api/roles
router.get('/', getAllRoles);

// GET /api/roles/faculty/:id/roles
router.get('/faculty/:id/roles', getFacultyRoles);

// PATCH /api/roles/faculty/:id/roles/sync - bulk sync (HOD only)
router.patch(
  '/faculty/:id/roles/sync',
  requireHOD,
  syncRoles
);

module.exports = router;
