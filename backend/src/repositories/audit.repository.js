const { logger } = require('../utils/logger');

/**
 * Log an action - simplified version (logs to console)
 * In production, you might want to add this back to a database table
 */
const log = async ({ performedBy, action, facultyId, details }) => {
  logger.info(`[${action}] Performed by: ${performedBy}, Faculty: ${facultyId || 'N/A'}`, details);
  return { id: Date.now().toString() };
};

/**
 * Get audit logs for a department (simplified)
 */
const findByDepartment = async (departmentCode, limit = 50) => {
  return [];
};

module.exports = { log, findByDepartment };
