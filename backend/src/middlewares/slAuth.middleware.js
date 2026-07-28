const jwt = require('jsonwebtoken');
const { errorResponse } = require('../utils/response');

/**
 * Verifies the JWT token issued by the Student-List module's own login
 * and attaches { id, email, role, name } to req.slUser
 */
const slAuthenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return errorResponse(res, 'No token provided. Please authenticate.', 401);
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Support both token formats:
    //   System A (main portal): { roles: ['FACULTY','HOD'], isHOD: true, username, ... }
    //   System B (student-list): { role: 'HOD', email, name, ... }
    req.slUser = {
      id:    decoded.id,
      email: decoded.email,
      name:  decoded.name,
      role:  decoded.role,    // System B single-string role
      roles: decoded.roles,   // System A roles array
      isHOD: decoded.isHOD,   // System A HOD flag
    };
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return errorResponse(res, 'Token has expired. Please login again.', 401);
    }
    return errorResponse(res, 'Invalid token.', 401);
  }
};

/**
 * Ensures the authenticated user has the HOD role.
 * Accepts both token formats from System A (main portal) and System B (student-list).
 */
const slRequireHOD = (req, res, next) => {
  const u = req.slUser;
  const isHOD =
    u?.role === 'HOD' ||                               // System B token
    u?.isHOD === true ||                               // System A token flag
    (Array.isArray(u?.roles) && u.roles.includes('HOD')); // System A token array

  if (!isHOD) {
    return errorResponse(res, 'Access denied. HOD role required.', 403);
  }
  next();
};

module.exports = { slAuthenticate, slRequireHOD };
