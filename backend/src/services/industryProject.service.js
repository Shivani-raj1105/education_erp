const repo = require('../repositories/industryProject.repository');

const parseQuery = (q) => ({
  search: q.search?.trim() || null,
  status: q.status || null,
});

const getList = async (departmentCode, queryParams) => {
  const params = parseQuery(queryParams);
  const items = await repo.findAllByDepartment(departmentCode, params);
  return { items, total: items.length };
};

const getById = async (id, departmentCode) => {
  const record = await repo.findById(id);
  if (!record) throw { statusCode: 404, message: 'Project not found.' };
  if (record.departmentCode !== departmentCode) throw { statusCode: 403, message: 'Access denied.' };
  return record;
};

const create = async (data, departmentCode) => {
  const { students = [], ...projectData } = data;
  const project = await repo.create({
    projectName: projectData.projectName.trim(),
    status:      projectData.status || 'ONGOING',
    departmentCode,
  });
  // add students if provided
  for (const s of students) {
    await repo.addStudent(project.id, {
      studentName: s.studentName.trim(),
      usn:         s.usn.trim().toUpperCase(),
      semester:    parseInt(s.semester),
      section:     s.section.trim().toUpperCase(),
    });
  }
  return repo.findById(project.id);
};

const update = async (id, data, departmentCode) => {
  const existing = await repo.findById(id);
  if (!existing) throw { statusCode: 404, message: 'Project not found.' };
  if (existing.departmentCode !== departmentCode) throw { statusCode: 403, message: 'Access denied.' };
  const updateData = {};
  if (data.projectName !== undefined) updateData.projectName = data.projectName.trim();
  if (data.status      !== undefined) updateData.status      = data.status;
  return repo.update(id, updateData);
};

const remove = async (id, departmentCode) => {
  const existing = await repo.findById(id);
  if (!existing) throw { statusCode: 404, message: 'Project not found.' };
  if (existing.departmentCode !== departmentCode) throw { statusCode: 403, message: 'Access denied.' };
  await repo.remove(id);
  return { message: 'Project deleted successfully.' };
};

const addStudent = async (projectId, studentData, departmentCode) => {
  const project = await repo.findById(projectId);
  if (!project) throw { statusCode: 404, message: 'Project not found.' };
  if (project.departmentCode !== departmentCode) throw { statusCode: 403, message: 'Access denied.' };
  return repo.addStudent(projectId, {
    studentName: studentData.studentName.trim(),
    usn:         studentData.usn.trim().toUpperCase(),
    semester:    parseInt(studentData.semester),
    section:     studentData.section.trim().toUpperCase(),
  });
};

const removeStudent = async (projectId, studentId, departmentCode) => {
  const project = await repo.findById(projectId);
  if (!project) throw { statusCode: 404, message: 'Project not found.' };
  if (project.departmentCode !== departmentCode) throw { statusCode: 403, message: 'Access denied.' };
  await repo.removeStudent(studentId);
  return { message: 'Student removed successfully.' };
};

module.exports = { getList, getById, create, update, remove, addStudent, removeStudent };
