const prisma = require('../prisma/client');

const findAllByDepartment = async (departmentCode, { page, limit, search, sortBy, sortOrder }) => {
  const skip = (page - 1) * limit;

  const where = {
    departmentCode,
    ...(search && {
      OR: [
        { studentName:       { contains: search, mode: 'insensitive' } },
        { usn:               { contains: search, mode: 'insensitive' } },
        { eventName:         { contains: search, mode: 'insensitive' } },
        { organizingCollege: { contains: search, mode: 'insensitive' } },
        { achievement:       { contains: search, mode: 'insensitive' } },
        { section:           { contains: search, mode: 'insensitive' } },
      ],
    }),
  };

  const validSortFields = ['studentName', 'usn', 'eventName', 'organizingCollege', 'year', 'semester', 'createdAt'];
  const orderField = validSortFields.includes(sortBy) ? sortBy : 'createdAt';
  const orderDir   = sortOrder === 'asc' ? 'asc' : 'desc';

  const [total, items] = await Promise.all([
    prisma.otherCurricularActivity.count({ where }),
    prisma.otherCurricularActivity.findMany({
      where,
      orderBy: { [orderField]: orderDir },
      skip,
      take: limit,
    }),
  ]);

  return { items, total };
};

const findById = async (id) => prisma.otherCurricularActivity.findUnique({ where: { id } });

const create = async (data) => prisma.otherCurricularActivity.create({ data });

const update = async (id, data) => prisma.otherCurricularActivity.update({ where: { id }, data });

const remove = async (id) => prisma.otherCurricularActivity.delete({ where: { id } });

module.exports = { findAllByDepartment, findById, create, update, remove };
