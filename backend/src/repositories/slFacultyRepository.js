const prisma = require('../prisma/client');

const SlFacultyRepository = {
  async findByEmail(email) {
    return await prisma.slFaculty.findUnique({
      where: { email },
      select: { id: true, name: true, email: true, password: true, role: true }
    });
  }
};

module.exports = SlFacultyRepository;
