const prisma = require('../prisma/client');

const findAllByDepartment = async (departmentCode, { page, limit, search, sortBy, sortOrder }) => {
  const skip = (page - 1) * limit;

  const where = {
    departmentCode,
    ...(search && {
      OR: [
        { studentName:   { contains: search, mode: 'insensitive' } },
        { usn:           { contains: search, mode: 'insensitive' } },
        { hackathonName: { contains: search, mode: 'insensitive' } },
        { position:      { contains: search, mode: 'insensitive' } },
        { section:       { contains: search, mode: 'insensitive' } },
      ],
    }),
  };

  const validSortFields = ['studentName', 'usn', 'hackathonName', 'position', 'year', 'semester', 'createdAt'];
  const orderField = validSortFields.includes(sortBy) ? sortBy : 'createdAt';
  const orderDir   = sortOrder === 'asc' ? 'asc' : 'desc';

  const [total, items] = await Promise.all([
    prisma.hackathon.count({ where }),
    prisma.hackathon.findMany({
      where,
      orderBy: { [orderField]: orderDir },
      skip,
      take: limit,
    }),
  ]);

  return { items, total };
};

const findById = async (id) => prisma.hackathon.findUnique({ where: { id } });

const create = async (data) => prisma.hackathon.create({ data });

const update = async (id, data) => prisma.hackathon.update({ where: { id }, data });

const remove = async (id) => prisma.hackathon.delete({ where: { id } });

module.exports = { findAllByDepartment, findById, create, update, remove };
