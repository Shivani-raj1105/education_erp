const prisma = require('../prisma/client');

/**
 * Get paginated cultural activities for a department
 */
const findAllByDepartment = async (departmentCode, { page, limit, search, sortBy, sortOrder }) => {
  const skip = (page - 1) * limit;

  const where = {
    departmentCode,
    ...(search && {
      OR: [
        { studentName:          { contains: search, mode: 'insensitive' } },
        { usn:                  { contains: search, mode: 'insensitive' } },
        { culturalActivityName: { contains: search, mode: 'insensitive' } },
        { eventName:            { contains: search, mode: 'insensitive' } },
        { positionPrize:        { contains: search, mode: 'insensitive' } },
        { section:              { contains: search, mode: 'insensitive' } },
      ],
    }),
  };

  const validSortFields = ['studentName', 'usn', 'culturalActivityName', 'eventName', 'academicYear', 'semester', 'createdAt'];
  const orderField = validSortFields.includes(sortBy) ? sortBy : 'createdAt';
  const orderDir   = sortOrder === 'asc' ? 'asc' : 'desc';

  const [total, items] = await Promise.all([
    prisma.culturalActivity.count({ where }),
    prisma.culturalActivity.findMany({
      where,
      orderBy: { [orderField]: orderDir },
      skip,
      take: limit,
    }),
  ]);

  return { items, total };
};

/**
 * Find a single record by id
 */
const findById = async (id) => {
  return prisma.culturalActivity.findUnique({ where: { id } });
};

/**
 * Create a cultural activity record
 */
const create = async (data) => {
  return prisma.culturalActivity.create({ data });
};

/**
 * Update a cultural activity record
 */
const update = async (id, data) => {
  return prisma.culturalActivity.update({ where: { id }, data });
};

/**
 * Delete a cultural activity record
 */
const remove = async (id) => {
  return prisma.culturalActivity.delete({ where: { id } });
};

module.exports = { findAllByDepartment, findById, create, update, remove };
