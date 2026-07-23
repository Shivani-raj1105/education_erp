const dashboardService = require('../services/dashboard.service');
const { successResponse, errorResponse } = require('../utils/response');

const getDashboard = async (req, res, next) => {
  try {
    const data = await dashboardService.getHODDashboard(req.user.departmentCode);
    return successResponse(res, data);
  } catch (err) {
    if (err.statusCode) return errorResponse(res, err.message, err.statusCode);
    next(err);
  }
};

module.exports = { getDashboard };
