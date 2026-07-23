const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '8h';

/**
 * Generate JWT token for authenticated faculty
 * Embeds roles/slugs for RBAC checks without extra DB query
 */
const generateToken = (faculty) => {
  // Parse coordinator roles from comma-separated string
  const coordinatorRoles = faculty.coordinatorRoles
    ? faculty.coordinatorRoles.split(',').map(r => r.trim())
    : [];

  // Build roles array: always include FACULTY, add coordinator roles, and HOD if applicable
  const roles = ['FACULTY', ...coordinatorRoles];
  if (faculty.designation?.includes('HOD')) {
    roles.push('HOD');
  }

  const payload = {
    id: faculty.employeeId,
    username: faculty.username,
    departmentCode: faculty.departmentCode,
    roles,
    isHOD: faculty.designation?.includes('HOD') || false,
  };

  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

/**
 * Verify JWT token
 */
const verifyToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};

/**
 * Decode token without verification (for expired token reading)
 */
const decodeToken = (token) => {
  return jwt.decode(token);
};

module.exports = { generateToken, verifyToken, decodeToken };
