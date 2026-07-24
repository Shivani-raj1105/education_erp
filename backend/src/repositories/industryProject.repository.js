const prisma = require('../prisma/client');

/** Get all projects for a department, with their students included */
const findAllByDepartment = async (departmentCode, { search, status }) => {
  const where = {
    departmentCode,
    ...(status && { status }),
    ...(search && {
      projectName: { contains: search, mode: 'insensitive' },
    }),
  };

  return prisma.industryProject.findMany({
    where,
    include: { students: true },
    orderBy: { createdAt: 'desc' },
  });
};

/** Find one project by id (with students) */
const findById = async (id) => {
  return prisma.industryProject.findUnique({
    where: { id },
    include: { students: true },
  });
};

/** Create project (without students — add via addStudent) */
const create = async (data) => {
  return prisma.industryProject.create({
    data,
    include: { students: true },
  });
};

/** Update project metadata */
const update = async (id, data) => {
  return prisma.industryProject.update({
    where: { id },
    data,
    include: { students: true },
  });
};

/** Delete project (students cascade) */
const remove = async (id) => {
  return prisma.industryProject.delete({ where: { id } });
};

/** Add a student to a project */
const addStudent = async (projectId, studentData) => {
  return prisma.industryProjectStudent.create({
    data: { projectId, ...studentData },
  });
};

/** Remove a student from a project */
const removeStudent = async (studentId) => {
  return prisma.industryProjectStudent.delete({ where: { id: studentId } });
};

module.exports = {
  findAllByDepartment, findById, create, update, remove,
  addStudent, removeStudent,
};
