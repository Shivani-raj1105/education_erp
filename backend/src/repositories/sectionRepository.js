const prisma = require('../prisma/client');

const SectionRepository = {
  async getSectionsBySemesterId(semesterId) {
    return await prisma.section.findMany({
      where: { semesterId },
      orderBy: { sectionName: 'asc' },
      select: { id: true, sectionName: true }
    });
  },

  async findBySemesterAndName(semesterId, sectionName) {
    return await prisma.section.findUnique({
      where: {
        semesterId_sectionName: {
          semesterId,
          sectionName: sectionName.toUpperCase()
        }
      }
    });
  }
};

module.exports = SectionRepository;
