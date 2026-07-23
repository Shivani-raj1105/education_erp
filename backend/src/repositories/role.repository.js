const prisma = require('../prisma/client');

/**
 * Get all active roles
 */
const findAll = async () => {
  return prisma.role.findMany({
    where: { isActive: true },
    orderBy: { name: 'asc' },
  });
};

/**
 * Get role by slug
 */
const findBySlug = async (slug) => {
  return prisma.role.findUnique({ where: { slug } });
};

/**
 * Get role by id
 */
const findById = async (id) => {
  return prisma.role.findUnique({ where: { id } });
};

/**
 * Get all roles assigned to a faculty
 */
const findFacultyRoles = async (facultyId) => {
  return prisma.facultyRole.findMany({
    where: { facultyId },
    include: {
      role: true,
    },
    orderBy: { assignedAt: 'asc' },
  });
};

/**
 * Assign a role to faculty (with duplicate check via upsert)
 * Returns { isNew: boolean, record }
 */
const assignRole = async (facultyId, roleId, assignedBy) => {
  // Check for duplicate
  const existing = await prisma.facultyRole.findUnique({
    where: { facultyId_roleId: { facultyId, roleId } },
  });
  if (existing) {
    return { isNew: false, record: existing };
  }

  const record = await prisma.facultyRole.create({
    data: { facultyId, roleId, assignedBy },
    include: { role: true },
  });
  return { isNew: true, record };
};

/**
 * Remove a role from faculty
 */
const removeRole = async (facultyId, roleId) => {
  return prisma.facultyRole.deleteMany({
    where: { facultyId, roleId },
  });
};

/**
 * Check if faculty has a specific role slug
 */
const hasRole = async (facultyId, roleSlug) => {
  const count = await prisma.facultyRole.count({
    where: {
      facultyId,
      role: { slug: roleSlug },
    },
  });
  return count > 0;
};

module.exports = {
  findAll,
  findBySlug,
  findById,
  findFacultyRoles,
  assignRole,
  removeRole,
  hasRole,
};
