const prisma = require('../prisma/client');

const StudentRepository = {
  async getStudentsBySectionId(sectionId) {
    return await prisma.student.findMany({
      where: { sectionId },
      orderBy: { usn: 'asc' },
      select: {
        id: true,
        usn: true,
        name: true,
        phone: true,
        email: true,
        attendance: { select: { attendancePercentage: true } },
        performance: { select: { performancePercentage: true } }
      }
    });
  }
};

module.exports = StudentRepository;
