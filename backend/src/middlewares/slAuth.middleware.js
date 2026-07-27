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
    req.slUser = { id: decoded.id, email: decoded.email, role: decoded.role, name: decoded.name };
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return errorResponse(res, 'Token has expired. Please login again.', 401);
    }
    return errorResponse(res, 'Invalid token.', 401);
  }
};

/**
 * Ensures the authenticated user has the HOD role
 */
const slRequireHOD = (req, res, next) => {
  if (!req.slUser || req.slUser.role !== 'HOD') {
    return errorResponse(res, 'Access denied. HOD role required.', 403);
  }
  next();
};

module.exports = { slAuthenticate, slRequireHOD };
