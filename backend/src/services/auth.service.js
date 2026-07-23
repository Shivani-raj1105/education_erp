const bcrypt = require('bcryptjs');
const prisma = require('../prisma/client');
const facultyRepo = require('../repositories/faculty.repository');
const { generateToken } = require('../utils/jwt');
const { logger } = require('../utils/logger');

/**
 * Login service - validates department code + username + password
 */
const login = async ({ departmentCode, username, password }) => {
  // 1. Find faculty by username
  const faculty = await facultyRepo.findByUsername(username);
  if (!faculty) {
    throw { statusCode: 401, message: 'Invalid credentials.' };
  }

  // 2. Validate department code
  if (faculty.departmentCode.toUpperCase() !== departmentCode.toUpperCase()) {
    throw { statusCode: 401, message: 'Invalid credentials.' };
  }

  // 3. Check account status
  if (faculty.status === 'INACTIVE') {
    throw { statusCode: 403, message: 'Your account has been deactivated. Contact HOD.' };
  }

  // 4. Verify password
  const isValid = await bcrypt.compare(password, faculty.passwordHash);
  if (!isValid) {
    throw { statusCode: 401, message: 'Invalid credentials.' };
  }

  // 5. Check if HOD
  const isHOD = faculty.designation.includes('HOD');

  if (!isHOD) {
    throw { statusCode: 403, message: 'Access denied. HOD login required.' };
  }

  // 6. Generate JWT (pass actual faculty object for token generation)
  const token = generateToken(faculty);

  logger.info(`Login: ${username} (${faculty.departmentCode}) - HOD`);

  return {
    token,
    faculty: sanitizeFaculty(faculty),
    isHOD: true,
    redirectTo: '/hod/dashboard',
  };
};

/**
 * Get current user profile
 */
const getMe = async (userId) => {
  const faculty = await facultyRepo.findById(userId);
  if (!faculty) {
    throw { statusCode: 404, message: 'User not found.' };
  }
  return sanitizeFaculty(faculty);
};

/**
 * Remove sensitive fields from faculty object and format roles
 */
const sanitizeFaculty = (faculty) => {
  const { passwordHash, ...safe } = faculty;
  
  // Convert coordinatorRoles to array format for frontend
  const roles = faculty.coordinatorRoles 
    ? faculty.coordinatorRoles.split(',').map(r => ({
        role: { id: null, name: r.trim(), slug: r.trim() }
      }))
    : [];
  
  const isHOD = faculty.designation.includes('HOD');
  if (isHOD) {
    roles.push({ role: { id: null, name: 'Faculty', slug: 'FACULTY' } });
    roles.push({ role: { id: null, name: 'HOD', slug: 'HOD' } });
  }

  return {
    ...safe,
    roles,
    isHOD,
  };
};

module.exports = { login, getMe };
