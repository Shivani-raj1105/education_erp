const prisma = require('../prisma/client');

/**
 * Get paginated sports activities for a department
 */
const findAllByDepartment = async (departmentCode, { page, limit, search, sortBy, sortOrder }) => {
  const skip = (page - 1) * limit;

  const where = {
    departmentCode,
    ...(search && {
      OR: [
        { studentName:      { contains: search, mode: 'insensitive' } },
        { usn:              { contains: search, mode: 'insensitive' } },
        { sportName:        { contains: search, mode: 'insensitive' } },
        { competitionLevel: { contains: search, mode: 'insensitive' } },
        { positionMedal:    { contains: search, mode: 'insensitive' } },
        { section:          { contains: search, mode: 'insensitive' } },
      ],
    }),
  };

  const validSortFields = ['studentName', 'usn', 'sportName', 'competitionLevel', 'academicYear', 'semester', 'createdAt'];
  const orderField = validSortFields.includes(sortBy) ? sortBy : 'createdAt';
  const orderDir   = sortOrder === 'asc' ? 'asc' : 'desc';

  const [total, items] = await Promise.all([
    prisma.sportsActivity.count({ where }),
    prisma.sportsActivity.findMany({
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
  return prisma.sportsActivity.findUnique({ where: { id } });
};

/**
 * Create a sports activity record
 */
const create = async (data) => {
  return prisma.sportsActivity.create({ data });
};

/**
 * Update a sports activity record
 */
const update = async (id, data) => {
  return prisma.sportsActivity.update({ where: { id }, data });
};

/**
 * Delete a sports activity record
 */
const remove = async (id) => {
  return prisma.sportsActivity.delete({ where: { id } });
};

module.exports = { findAllByDepartment, findById, create, update, remove };
