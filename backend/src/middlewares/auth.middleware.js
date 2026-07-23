const { verifyToken } = require('../utils/jwt');
const { errorResponse } = require('../utils/response');
const { logger } = require('../utils/logger');

/**
 * Authenticate - verifies JWT from Authorization header or cookie
 */
const authenticate = (req, res, next) => {
  try {
    let token = null;

    // Check Authorization header
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }

    // Fallback to cookie
    if (!token && req.cookies?.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return errorResponse(res, 'Access denied. No token provided.', 401);
    }

    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return errorResponse(res, 'Token expired. Please login again.', 401);
    }
    if (error.name === 'JsonWebTokenError') {
      return errorResponse(res, 'Invalid token.', 401);
    }
    logger.error('Auth middleware error:', error);
    return errorResponse(res, 'Authentication failed.', 401);
  }
};

/**
 * Require HOD role
 */
const requireHOD = (req, res, next) => {
  if (!req.user?.isHOD) {
    return errorResponse(res, 'Access denied. HOD privileges required.', 403);
  }
  next();
};

/**
 * Require specific role(s) - pass role slugs
 */
const requireRole = (...roleSlugs) => {
  return (req, res, next) => {
    const userRoles = req.user?.roles || [];
    const hasRole = roleSlugs.some((slug) => userRoles.includes(slug));
    if (!hasRole) {
      return errorResponse(
        res,
        `Access denied. Required role(s): ${roleSlugs.join(', ')}`,
        403
      );
    }
    next();
  };
};

/**
 * Require that the requesting user belongs to the same department
 * as the target faculty (enforces department isolation)
 */
const requireSameDepartment = (req, res, next) => {
  // The target departmentId is added by route handlers when they resolve the faculty
  if (req.targetDepartmentId && req.user.departmentId !== req.targetDepartmentId) {
    return errorResponse(res, 'Access denied. Cross-department operation not allowed.', 403);
  }
  next();
};

module.exports = { authenticate, requireHOD, requireRole, requireSameDepartment };
