const prisma = require('../prisma/client');

const TimetableRepository = {
  async getTimetableBySemesterAndSection(semesterId, sectionId) {
    return await prisma.timetable.findMany({
      where: { semesterId, sectionId },
      orderBy: [{ day: 'asc' }, { period: 'asc' }],
      select: {
        day: true,
        period: true,
        subject: { select: { id: true, subjectName: true, subjectCode: true } },
        faculty: { select: { id: true, name: true } }
      }
    });
  },

  async getSubjectFacultyMappingBySemesterAndSection(semesterId, sectionId) {
    const entries = await prisma.timetable.findMany({
      where: { semesterId, sectionId },
      distinct: ['subjectId', 'facultyId'],
      select: {
        subject: { select: { id: true, subjectName: true, subjectCode: true } },
        faculty: { select: { id: true, name: true } }
      }
    });

    // Deduplicate by subjectId
    const seen = new Map();
    for (const e of entries) {
      if (!seen.has(e.subject.id)) {
        seen.set(e.subject.id, {
          subject: e.subject.subjectName,
          subjectCode: e.subject.subjectCode,
          faculty: e.faculty.name,
          facultyId: e.faculty.id
        });
      }
    }
    return Array.from(seen.values());
  }
};

module.exports = TimetableRepository;
