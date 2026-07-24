const culturalActivityRepo = require('../repositories/culturalActivity.repository');

/**
 * Build paginated params from query string
 */
const parseQuery = (queryParams) => ({
  page:      Math.max(1, parseInt(queryParams.page)  || 1),
  limit:     Math.min(100, parseInt(queryParams.limit) || 10),
  search:    queryParams.search?.trim() || null,
  sortBy:    queryParams.sortBy  || 'createdAt',
  sortOrder: queryParams.sortOrder || 'desc',
});

/**
 * Get paginated list — scoped to HOD's department
 */
const getList = async (departmentCode, queryParams) => {
  const params = parseQuery(queryParams);

  const { items, total } = await culturalActivityRepo.findAllByDepartment(departmentCode, params);

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

/**
 * Get single record — department-scoped
 */
const getById = async (id, departmentCode) => {
  const record = await culturalActivityRepo.findById(id);
  if (!record) throw { statusCode: 404, message: 'Cultural activity not found.' };
  if (record.departmentCode !== departmentCode) throw { statusCode: 403, message: 'Access denied.' };
  return record;
};

/**
 * Create a new cultural activity record
 */
const create = async (data, departmentCode) => {
  return culturalActivityRepo.create({
    studentName:          data.studentName.trim(),
    usn:                  data.usn.trim().toUpperCase(),
    department:           data.department.trim(),
    section:              data.section.trim().toUpperCase(),
    semester:             parseInt(data.semester),
    culturalActivityName: data.culturalActivityName.trim(),
    eventName:            data.eventName.trim(),
    positionPrize:        data.positionPrize?.trim() || null,
    academicYear:         data.academicYear.trim(),
    departmentCode,
  });
};

/**
 * Update an existing cultural activity record
 */
const update = async (id, data, departmentCode) => {
  const existing = await culturalActivityRepo.findById(id);
  if (!existing) throw { statusCode: 404, message: 'Cultural activity not found.' };
  if (existing.departmentCode !== departmentCode) throw { statusCode: 403, message: 'Access denied.' };

  const updateData = {};
  const fields = ['studentName', 'usn', 'department', 'section', 'culturalActivityName', 'eventName', 'positionPrize', 'academicYear'];
  fields.forEach((f) => { if (data[f] !== undefined) updateData[f] = data[f]; });
  if (data.semester !== undefined) updateData.semester = parseInt(data.semester);
  if (data.usn)     updateData.usn     = data.usn.toUpperCase();
  if (data.section) updateData.section = data.section.toUpperCase();

  return culturalActivityRepo.update(id, updateData);
};

/**
 * Delete a cultural activity record
 */
const remove = async (id, departmentCode) => {
  const existing = await culturalActivityRepo.findById(id);
  if (!existing) throw { statusCode: 404, message: 'Cultural activity not found.' };
  if (existing.departmentCode !== departmentCode) throw { statusCode: 403, message: 'Access denied.' };

  await culturalActivityRepo.remove(id);
  return { message: 'Cultural activity deleted successfully.' };
};

module.exports = { getList, getById, create, update, remove };
