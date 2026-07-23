const prisma = require('../prisma/client');

/**
 * Find faculty by username (for login)
 */
const findByUsername = async (username) => {
  return prisma.facultyList.findUnique({
    where: { username },
  });
};

/**
 * Find faculty by employeeId
 */
const findById = async (employeeId) => {
  return prisma.facultyList.findUnique({
    where: { employeeId },
  });
};

/**
 * Get paginated faculty list for a department with search/filter/sort
 */
const findAllByDepartment = async (departmentCode, { page, limit, search, status, sortBy, sortOrder }) => {
  const skip = (page - 1) * limit;

  const where = {
    departmentCode,
    ...(status && { status }),
    ...(search && {
      OR: [
        { name:          { contains: search, mode: 'insensitive' } },
        { employeeId:    { contains: search, mode: 'insensitive' } },
        { designation:   { contains: search, mode: 'insensitive' } },
        { email:         { contains: search, mode: 'insensitive' } },
        { specialization:{ contains: search, mode: 'insensitive' } },
      ],
    }),
  };

  const validSortFields = ['name', 'employeeId', 'designation', 'experience', 'joiningDate', 'status'];
  const orderField = validSortFields.includes(sortBy) ? sortBy : 'name';
  const orderDir   = sortOrder === 'desc' ? 'desc' : 'asc';

  const [total, items] = await Promise.all([
    prisma.facultyList.count({ where }),
    prisma.facultyList.findMany({
      where,
      orderBy: { [orderField]: orderDir },
      skip,
      take: limit,
    }),
  ]);

  return { items, total };
};

/**
 * Create faculty
 */
const create = async (data) => {
  return prisma.facultyList.create({ data });
};

/**
 * Update faculty
 */
const update = async (employeeId, data) => {
  return prisma.facultyList.update({
    where: { employeeId },
    data,
  });
};

/**
 * Delete faculty
 */
const remove = async (employeeId) => {
  return prisma.facultyList.delete({ where: { employeeId } });
};

/**
 * Check if employee ID or username/email already exist
 */
const checkUnique = async (fields, excludeEmployeeId = null) => {
  const conditions = [];
  if (fields.employeeId) conditions.push({ employeeId: fields.employeeId });
  if (fields.username)   conditions.push({ username:   fields.username });
  if (fields.email)      conditions.push({ email:      fields.email });

  if (!conditions.length) return null;

  return prisma.facultyList.findFirst({
    where: {
      OR: conditions,
      ...(excludeEmployeeId && { NOT: { employeeId: excludeEmployeeId } }),
    },
    select: { employeeId: true, username: true, email: true },
  });
};

/**
 * Dashboard stats for a department
 */
const getDepartmentStats = async (departmentCode) => {
  const [totalFaculty, activeCount, onLeave, inactive] = await Promise.all([
    prisma.facultyList.count({ where: { departmentCode } }),
    prisma.facultyList.count({ where: { departmentCode, status: 'ACTIVE' } }),
    prisma.facultyList.count({ where: { departmentCode, status: 'ON_LEAVE' } }),
    prisma.facultyList.count({ where: { departmentCode, status: 'INACTIVE' } }),
  ]);

  // Count coordinators (faculty with any coordinator role)
  const coordinatorCount = await prisma.facultyList.count({
    where: {
      departmentCode,
      coordinatorRoles: { not: null },
    },
  });

  return { totalFaculty, activeCount, onLeave, inactive, coordinatorCount };
};

module.exports = {
  findByUsername,
  findById,
  findAllByDepartment,
  create,
  update,
  remove,
  checkUnique,
  getDepartmentStats,
};
