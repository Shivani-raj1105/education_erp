const prisma = require('../prisma/client');

const AcademicSettingsRepository = {
  async getCurrentSettings() {
    return await prisma.academicSettings.findFirst({
      orderBy: { id: 'desc' },
      select: {
        academicYear: true,
        currentSemesterType: true
      }
    });
  }
};

module.exports = AcademicSettingsRepository;
