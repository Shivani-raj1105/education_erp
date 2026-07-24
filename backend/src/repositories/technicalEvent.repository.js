const prisma = require('../prisma/client');

/**
 * Get paginated technical events for a department
 */
const findAllByDepartment = async (departmentCode, { page, limit, search, status, sortBy, sortOrder }) => {
  const skip = (page - 1) * limit;

  const where = {
    departmentCode,
    ...(status && { projectStatus: status }),
    ...(search && {
      OR: [
        { studentName:   { contains: search, mode: 'insensitive' } },
        { usn:           { contains: search, mode: 'insensitive' } },
        { projectName:   { contains: search, mode: 'insensitive' } },
        { projectDomain: { contains: search, mode: 'insensitive' } },
        { eventType:     { contains: search, mode: 'insensitive' } },
        { section:       { contains: search, mode: 'insensitive' } },
        { facultyMentor: { contains: search, mode: 'insensitive' } },
      ],
    }),
  };

  const validSortFields = ['studentName', 'usn', 'projectName', 'projectDomain', 'eventType', 'academicYear', 'semester', 'projectStatus', 'createdAt'];
  const orderField = validSortFields.includes(sortBy) ? sortBy : 'createdAt';
  const orderDir   = sortOrder === 'asc' ? 'asc' : 'desc';

  const [total, items] = await Promise.all([
    prisma.technicalEvent.count({ where }),
    prisma.technicalEvent.findMany({
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
  return prisma.technicalEvent.findUnique({ where: { id } });
};

/**
 * Create a technical event record
 */
const create = async (data) => {
  return prisma.technicalEvent.create({ data });
};

/**
 * Update a technical event record
 */
const update = async (id, data) => {
  return prisma.technicalEvent.update({ where: { id }, data });
};

/**
 * Delete a technical event record
 */
const remove = async (id) => {
  return prisma.technicalEvent.delete({ where: { id } });
};

module.exports = { findAllByDepartment, findById, create, update, remove };
