/**
 * Role utility functions - RBAC helpers
 */

export const ROLE_SLUGS = {
  HOD:                   'HOD',
  FACULTY:               'FACULTY',
  TIMETABLE_COORDINATOR: 'TIMETABLE_COORDINATOR',
  EXAM_COORDINATOR:      'EXAM_COORDINATOR',
  CULTURAL_COORDINATOR:  'CULTURAL_COORDINATOR',
  PLACEMENT_COORDINATOR: 'PLACEMENT_COORDINATOR',
};

export const COORDINATOR_ROLES = [
  ROLE_SLUGS.TIMETABLE_COORDINATOR,
  ROLE_SLUGS.EXAM_COORDINATOR,
  ROLE_SLUGS.CULTURAL_COORDINATOR,
  ROLE_SLUGS.PLACEMENT_COORDINATOR,
];

/**
 * Get badge CSS class for a role slug
 */
export const getRoleBadgeClass = (slug) => {
  const map = {
    HOD:                   'badge-hod',
    FACULTY:               'badge-faculty',
    TIMETABLE_COORDINATOR: 'badge-timetable',
    EXAM_COORDINATOR:      'badge-exam',
    CULTURAL_COORDINATOR:  'badge-cultural',
    PLACEMENT_COORDINATOR: 'badge-placement',
  };
  return map[slug] || 'badge-default';
};

/**
 * Get short display name for role
 */
export const getRoleShortName = (slug) => {
  const map = {
    HOD:                   'HOD',
    FACULTY:               'Faculty',
    TIMETABLE_COORDINATOR: 'TT Coordinator',
    EXAM_COORDINATOR:      'Exam Coordinator',
    CULTURAL_COORDINATOR:  'Cultural Coordinator',
    PLACEMENT_COORDINATOR: 'Placement Coordinator',
  };
  return map[slug] || slug;
};

/**
 * Check if user has a specific role
 */
export const hasRole = (userRoles = [], slug) => userRoles.includes(slug);

/**
 * Check if faculty has coordinator roles (any)
 */
export const hasAnyCoordinatorRole = (userRoles = []) =>
  COORDINATOR_ROLES.some((slug) => userRoles.includes(slug));

/**
 * Extract coordinator roles from role list
 */
export const getCoordinatorRoles = (roles = []) =>
  roles.filter((r) => COORDINATOR_ROLES.includes(r.slug));
