const prisma = require('../prisma/client');

const SemesterRepository = {
  async findBySemesterNumber(semesterNumber) {
    return await prisma.semester.findUnique({
      where: { semesterNumber }
    });
  },

  async getSemestersBySemesterType(semesterType) {
    const isOdd = semesterType.toUpperCase() === 'ODD';
    return await prisma.semester.findMany({
      where: {
        semesterNumber: { in: isOdd ? [1, 3, 5, 7] : [2, 4, 6, 8] }
      },
      orderBy: { semesterNumber: 'asc' },
      select: { id: true, semesterNumber: true }
    });
  }
};

module.exports = SemesterRepository;
