/**
 * @fileoverview JSDoc type definitions for the Department Management Portal.
 * Using JSDoc instead of TypeScript to match the project's JavaScript stack.
 * IDEs (VS Code) will still provide autocomplete from these definitions.
 */

/**
 * @typedef {Object} Department
 * @property {string} id
 * @property {string} name
 * @property {string} code
 */

/**
 * @typedef {'ACTIVE'|'INACTIVE'|'ON_LEAVE'} FacultyStatus
 */

/**
 * @typedef {Object} Role
 * @property {string}  id
 * @property {string}  name        - Display name e.g. "Timetable Coordinator"
 * @property {string}  slug        - e.g. "TIMETABLE_COORDINATOR"
 * @property {string}  [description]
 * @property {boolean} isActive
 */

/**
 * @typedef {Object} FacultyRole
 * @property {string} id
 * @property {string} facultyId
 * @property {string} roleId
 * @property {string} [assignedBy]
 * @property {string} assignedAt
 * @property {Role}   role
 */

/**
 * @typedef {Object} Faculty
 * @property {string}        id
 * @property {string}        employeeId
 * @property {string}        name
 * @property {string}        email
 * @property {string}        [phone]
 * @property {string}        designation
 * @property {string}        qualification
 * @property {number}        experience
 * @property {string}        [specialization]
 * @property {string}        [photo]
 * @property {string}        joiningDate   - ISO date string
 * @property {FacultyStatus} status
 * @property {string}        departmentId
 * @property {string}        username
 * @property {Department}    department
 * @property {FacultyRole[]} roles
 */

/**
 * @typedef {Object} AuthUser  - Decoded JWT payload stored in authStore
 * @property {string}   id
 * @property {string}   username
 * @property {string}   name
 * @property {string}   departmentId
 * @property {string}   departmentCode
 * @property {string[]} roles            - Array of role slugs
 * @property {boolean}  isHOD
 */

/**
 * @typedef {Object} Pagination
 * @property {number}  total
 * @property {number}  page
 * @property {number}  limit
 * @property {number}  totalPages
 * @property {boolean} hasNext
 * @property {boolean} hasPrev
 */

/**
 * @typedef {Object} ApiResponse
 * @property {boolean}   success
 * @property {string}    message
 * @property {*}         data
 * @property {string}    timestamp
 */

/**
 * @typedef {Object} AuditLog
 * @property {string}  id
 * @property {string}  performedBy
 * @property {string}  action
 * @property {string}  [facultyId]
 * @property {string}  timestamp
 * @property {Object}  [details]
 */

// Export empty object so this file can be imported if needed
module.exports = {};
