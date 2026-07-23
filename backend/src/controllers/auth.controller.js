const authService = require('../services/auth.service');
const { successResponse, errorResponse } = require('../utils/response');

const login = async (req, res, next) => {
  try {
    const { departmentCode, username, password } = req.body;
    const result = await authService.login({ departmentCode, username, password });

    // Set HTTP-only cookie
    res.cookie('token', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 8 * 60 * 60 * 1000, // 8 hours
    });

    return successResponse(res, result, 'Login successful');
  } catch (err) {
    if (err.statusCode) return errorResponse(res, err.message, err.statusCode);
    next(err);
  }
};

const logout = (req, res) => {
  res.clearCookie('token');
  return successResponse(res, null, 'Logged out successfully');
};

const getMe = async (req, res, next) => {
  try {
    const faculty = await authService.getMe(req.user.id);
    return successResponse(res, faculty, 'Profile fetched');
  } catch (err) {
    if (err.statusCode) return errorResponse(res, err.message, err.statusCode);
    next(err);
  }
};

module.exports = { login, logout, getMe };
