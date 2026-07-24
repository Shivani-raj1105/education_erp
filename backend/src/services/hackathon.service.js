const repo = require('../repositories/hackathon.repository');

const parseQuery = (q) => ({
  page:      Math.max(1, parseInt(q.page)  || 1),
  limit:     Math.min(100, parseInt(q.limit) || 10),
  search:    q.search?.trim() || null,
  sortBy:    q.sortBy    || 'createdAt',
  sortOrder: q.sortOrder || 'desc',
});

const getList = async (departmentCode, queryParams) => {
  const params = parseQuery(queryParams);
  const { items, total } = await repo.findAllByDepartment(departmentCode, params);
  return {
    items,
    pagination: {
      total,
      page:       params.page,
      limit:      params.limit,
      totalPages: Math.ceil(total / params.limit),
      hasNext:    params.page * params.limit < total,
      hasPrev:    params.page > 1,
    },
  };
};

const getById = async (id, departmentCode) => {
  const record = await repo.findById(id);
  if (!record) throw { statusCode: 404, message: 'Hackathon record not found.' };
  if (record.departmentCode !== departmentCode) throw { statusCode: 403, message: 'Access denied.' };
  return record;
};

const create = async (data, departmentCode) => {
  return repo.create({
    studentName:   data.studentName.trim(),
    usn:           data.usn.trim().toUpperCase(),
    semester:      parseInt(data.semester),
    section:       data.section.trim().toUpperCase(),
    hackathonName: data.hackathonName.trim(),
    position:      data.position.trim(),
    year:          parseInt(data.year),
    departmentCode,
  });
};

const update = async (id, data, departmentCode) => {
  const existing = await repo.findById(id);
  if (!existing) throw { statusCode: 404, message: 'Hackathon record not found.' };
  if (existing.departmentCode !== departmentCode) throw { statusCode: 403, message: 'Access denied.' };

  const updateData = {};
  const fields = ['studentName', 'usn', 'section', 'hackathonName', 'position'];
  fields.forEach((f) => { if (data[f] !== undefined) updateData[f] = data[f]; });
  if (data.semester !== undefined) updateData.semester = parseInt(data.semester);
  if (data.year     !== undefined) updateData.year     = parseInt(data.year);
  if (data.usn)     updateData.usn     = data.usn.toUpperCase();
  if (data.section) updateData.section = data.section.toUpperCase();

  return repo.update(id, updateData);
};

const remove = async (id, departmentCode) => {
  const existing = await repo.findById(id);
  if (!existing) throw { statusCode: 404, message: 'Hackathon record not found.' };
  if (existing.departmentCode !== departmentCode) throw { statusCode: 403, message: 'Access denied.' };
  await repo.remove(id);
  return { message: 'Hackathon record deleted successfully.' };
};

module.exports = { getList, getById, create, update, remove };
