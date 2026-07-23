// Seed file - populates database with dummy data for testing
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // ─── Hash helper ────────────────────────────────────────────────────────────
  const hash = (pw) => bcrypt.hash(pw, 12);

  // ─── CSE HOD ────────────────────────────────────────────────────────────────
  const hodPassword = await hash('hod@cse123');
  const cseHod = await prisma.facultyList.upsert({
    where: { username: 'hod_cse' },
    update: {},
    create: {
      employeeId:       'EMP001',
      name:             'Dr. Rajesh Kumar',
      email:            'rajesh.kumar@college.edu',
      phone:            '9876543210',
      designation:      'Professor & HOD',
      qualification:    'Ph.D Computer Science',
      experience:       20,
      specialization:   'Artificial Intelligence',
      joiningDate:      new Date('2004-07-01'),
      status:           'ACTIVE',
      departmentCode:   'CSE',
      username:         'hod_cse',
      passwordHash:     hodPassword,
      coordinatorRoles: null,
    },
  });
  console.log('✅ CSE HOD created');

  // ─── CSE Faculty Members ─────────────────────────────────────────────────────
  const facultyData = [
    {
      employeeId:       'EMP002',
      name:             'Sathyaseelan M',
      email:            'sathyaseelan.m@college.edu',
      phone:            '9876543211',
      designation:      'Associate Professor',
      qualification:    'M.E Computer Science',
      experience:       12,
      specialization:   'Machine Learning',
      joiningDate:      new Date('2012-06-15'),
      status:           'ACTIVE',
      departmentCode:   'CSE',
      username:         'sathyaseelan',
      password:         'faculty@123',
      coordinatorRoles: 'TIMETABLE_COORDINATOR,EXAM_COORDINATOR',
    },
    {
      employeeId:       'EMP003',
      name:             'Priya Dharshini S',
      email:            'priya.dharshini@college.edu',
      phone:            '9876543212',
      designation:      'Assistant Professor',
      qualification:    'M.Tech Software Engineering',
      experience:       8,
      specialization:   'Web Technologies',
      joiningDate:      new Date('2016-07-01'),
      status:           'ACTIVE',
      departmentCode:   'CSE',
      username:         'priya_dharshini',
      password:         'faculty@123',
      coordinatorRoles: 'CULTURAL_COORDINATOR',
    },
    {
      employeeId:       'EMP004',
      name:             'Karthikeyan R',
      email:            'karthikeyan.r@college.edu',
      phone:            '9876543213',
      designation:      'Assistant Professor',
      qualification:    'M.E VLSI Design',
      experience:       6,
      specialization:   'Database Systems',
      joiningDate:      new Date('2018-07-01'),
      status:           'ACTIVE',
      departmentCode:   'CSE',
      username:         'karthikeyan_r',
      password:         'faculty@123',
      coordinatorRoles: 'PLACEMENT_COORDINATOR',
    },
    {
      employeeId:       'EMP005',
      name:             'Meenakshi Sundaram T',
      email:            'meenakshi.t@college.edu',
      phone:            '9876543214',
      designation:      'Associate Professor',
      qualification:    'Ph.D Computer Networks',
      experience:       14,
      specialization:   'Computer Networks',
      joiningDate:      new Date('2010-07-01'),
      status:           'ACTIVE',
      departmentCode:   'CSE',
      username:         'meenakshi_t',
      password:         'faculty@123',
      coordinatorRoles: null,
    },
    {
      employeeId:       'EMP006',
      name:             'Divya Bharathi K',
      email:            'divya.k@college.edu',
      phone:            '9876543215',
      designation:      'Assistant Professor',
      qualification:    'M.Tech Information Security',
      experience:       4,
      specialization:   'Cyber Security',
      joiningDate:      new Date('2020-07-01'),
      status:           'ACTIVE',
      departmentCode:   'CSE',
      username:         'divya_k',
      password:         'faculty@123',
      coordinatorRoles: null,
    },
    {
      employeeId:       'EMP007',
      name:             'Suresh Babu P',
      email:            'suresh.p@college.edu',
      phone:            '9876543216',
      designation:      'Professor',
      qualification:    'Ph.D Data Science',
      experience:       18,
      specialization:   'Data Science & Analytics',
      joiningDate:      new Date('2006-07-01'),
      status:           'ACTIVE',
      departmentCode:   'CSE',
      username:         'suresh_p',
      password:         'faculty@123',
      coordinatorRoles: null,
    },
    {
      employeeId:       'EMP008',
      name:             'Anitha Kumari V',
      email:            'anitha.v@college.edu',
      phone:            '9876543217',
      designation:      'Assistant Professor',
      qualification:    'M.E Computer Science',
      experience:       5,
      specialization:   'Software Engineering',
      joiningDate:      new Date('2019-07-01'),
      status:           'ON_LEAVE',
      departmentCode:   'CSE',
      username:         'anitha_v',
      password:         'faculty@123',
      coordinatorRoles: null,
    },
    {
      employeeId:       'EMP009',
      name:             'Venkatesh Narayanan',
      email:            'venkatesh.n@college.edu',
      phone:            '9876543218',
      designation:      'Assistant Professor',
      qualification:    'M.Tech Embedded Systems',
      experience:       3,
      specialization:   'IoT & Embedded Systems',
      joiningDate:      new Date('2021-07-01'),
      status:           'ACTIVE',
      departmentCode:   'CSE',
      username:         'venkatesh_n',
      password:         'faculty@123',
      coordinatorRoles: null,
    },
  ];

  for (const f of facultyData) {
    const passwordHash = await hash(f.password);
    await prisma.facultyList.upsert({
      where: { username: f.username },
      update: {},
      create: {
        employeeId:       f.employeeId,
        name:             f.name,
        email:            f.email,
        phone:            f.phone,
        designation:      f.designation,
        qualification:    f.qualification,
        experience:       f.experience,
        specialization:   f.specialization,
        joiningDate:      f.joiningDate,
        status:           f.status,
        departmentCode:   f.departmentCode,
        username:         f.username,
        passwordHash,
        coordinatorRoles: f.coordinatorRoles,
      },
    });
  }

  console.log('✅ CSE Faculty created');

  // ─── ECE HOD ────────────────────────────────────────────────────────────────
  const eceHodPw = await hash('hod@ece123');
  await prisma.facultyList.upsert({
    where: { username: 'hod_ece' },
    update: {},
    create: {
      employeeId:       'EMP010',
      name:             'Dr. Lakshmi Narasimhan',
      email:            'lakshmi.n@college.edu',
      phone:            '9876543220',
      designation:      'Professor & HOD',
      qualification:    'Ph.D Electronics',
      experience:       22,
      specialization:   'VLSI Design',
      joiningDate:      new Date('2002-07-01'),
      status:           'ACTIVE',
      departmentCode:   'ECE',
      username:         'hod_ece',
      passwordHash:     eceHodPw,
      coordinatorRoles: null,
    },
  });

  console.log('✅ ECE HOD created');
  console.log('✅ Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
