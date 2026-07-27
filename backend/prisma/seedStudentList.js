/**
 * Seed file for the Student List Module tables.
 * Run with: node prisma/seedStudentList.js
 *
 * Run AFTER: npx prisma migrate dev
 */

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding Student List Module tables...\n');

  // ─── 1. Academic Settings ───────────────────────────────────────────────────
  console.log('📅 Academic Settings...');
  await prisma.academicSettings.upsert({
    where: { id: 1 },
    update: {},
    create: { academicYear: '2026-27', currentSemesterType: 'ODD' }
  });
  console.log('   ✓ Year: 2026-27 | Type: ODD');

  // ─── 2. Semesters ───────────────────────────────────────────────────────────
  console.log('\n📚 Semesters...');
  const semesters = {};
  for (const num of [1, 2, 3, 4, 5, 6, 7, 8]) {
    const s = await prisma.semester.upsert({
      where: { semesterNumber: num },
      update: {},
      create: { semesterNumber: num }
    });
    semesters[num] = s;
    console.log(`   ✓ Semester ${num}`);
  }

  // ─── 3. SlFaculty (HOD + teaching staff) ───────────────────────────────────
  console.log('\n👨‍🏫 Faculty...');
  const SALT = 10;
  const facultyData = [
    { name: 'Dr. S. Kumar',    email: 'hod@college.edu',   password: 'hod@1234',    role: 'HOD'     },
    { name: 'Dr. Ravi Sharma', email: 'ravi@college.edu',  password: 'ravi@1234',   role: 'FACULTY' },
    { name: 'Mr. Arjun Nair',  email: 'arjun@college.edu', password: 'arjun@1234',  role: 'FACULTY' },
    { name: 'Ms. Sneha Iyer',  email: 'sneha@college.edu', password: 'sneha@1234',  role: 'FACULTY' },
    { name: 'Mr. Kiran Rao',   email: 'kiran@college.edu', password: 'kiran@1234',  role: 'FACULTY' },
  ];
  const faculties = {};
  for (const f of facultyData) {
    const hashed = await bcrypt.hash(f.password, SALT);
    const fac = await prisma.slFaculty.upsert({
      where: { email: f.email },
      update: {},
      create: { name: f.name, email: f.email, password: hashed, role: f.role }
    });
    faculties[f.name] = fac;
    console.log(`   ✓ ${f.role}: ${f.name}  (${f.email} / ${f.password})`);
  }

  // ─── 4. Sections (A–D for every semester) ──────────────────────────────────
  console.log('\n🏫 Sections...');
  const sections = {};
  for (const semNum of [1, 2, 3, 4, 5, 6, 7, 8]) {
    sections[semNum] = {};
    for (const name of ['A', 'B', 'C', 'D']) {
      const sec = await prisma.section.upsert({
        where: { semesterId_sectionName: { semesterId: semesters[semNum].id, sectionName: name } },
        update: {},
        create: { semesterId: semesters[semNum].id, sectionName: name }
      });
      sections[semNum][name] = sec;
    }
    console.log(`   ✓ Semester ${semNum}: A, B, C, D`);
  }

  // ─── 5. Subjects for Semester 5 ────────────────────────────────────────────
  console.log('\n📖 Subjects (Semester 5)...');
  const sem5Subjects = [
    { name: 'Operating Systems',           code: 'CS501' },
    { name: 'Java Programming',            code: 'CS502' },
    { name: 'Database Management Systems', code: 'CS503' },
    { name: 'Computer Networks',           code: 'CS504' },
  ];
  const subjects = {};
  for (const sub of sem5Subjects) {
    const s = await prisma.subject.upsert({
      where: { subjectCode: sub.code },
      update: {},
      create: { subjectName: sub.name, subjectCode: sub.code, semesterId: semesters[5].id }
    });
    subjects[sub.code] = s;
    console.log(`   ✓ ${sub.code}: ${sub.name}`);
  }

  // ─── 6. Subject → Faculty mapping ──────────────────────────────────────────
  console.log('\n🔗 Subject–Faculty Mapping...');
  const mappings = [
    { code: 'CS501', facultyName: 'Dr. Ravi Sharma' },
    { code: 'CS502', facultyName: 'Mr. Arjun Nair'  },
    { code: 'CS503', facultyName: 'Ms. Sneha Iyer'  },
    { code: 'CS504', facultyName: 'Mr. Kiran Rao'   },
  ];
  for (const m of mappings) {
    await prisma.subjectFaculty.upsert({
      where: { subjectId_facultyId: { subjectId: subjects[m.code].id, facultyId: faculties[m.facultyName].id } },
      update: {},
      create: { subjectId: subjects[m.code].id, facultyId: faculties[m.facultyName].id }
    });
    console.log(`   ✓ ${m.code} → ${m.facultyName}`);
  }

  // ─── 7. Timetable (Semester 5, Section B) ──────────────────────────────────
  console.log('\n📅 Timetable (Sem 5 / Section B)...');
  const ttEntries = [
    { day: 'Monday',    period: 1, code: 'CS501', fac: 'Dr. Ravi Sharma' },
    { day: 'Monday',    period: 2, code: 'CS502', fac: 'Mr. Arjun Nair'  },
    { day: 'Monday',    period: 3, code: 'CS503', fac: 'Ms. Sneha Iyer'  },
    { day: 'Tuesday',   period: 1, code: 'CS504', fac: 'Mr. Kiran Rao'   },
    { day: 'Tuesday',   period: 2, code: 'CS501', fac: 'Dr. Ravi Sharma' },
    { day: 'Tuesday',   period: 3, code: 'CS502', fac: 'Mr. Arjun Nair'  },
    { day: 'Wednesday', period: 1, code: 'CS503', fac: 'Ms. Sneha Iyer'  },
    { day: 'Wednesday', period: 2, code: 'CS504', fac: 'Mr. Kiran Rao'   },
    { day: 'Wednesday', period: 3, code: 'CS501', fac: 'Dr. Ravi Sharma' },
    { day: 'Thursday',  period: 1, code: 'CS502', fac: 'Mr. Arjun Nair'  },
    { day: 'Thursday',  period: 2, code: 'CS503', fac: 'Ms. Sneha Iyer'  },
    { day: 'Thursday',  period: 3, code: 'CS504', fac: 'Mr. Kiran Rao'   },
    { day: 'Friday',    period: 1, code: 'CS501', fac: 'Dr. Ravi Sharma' },
    { day: 'Friday',    period: 2, code: 'CS502', fac: 'Mr. Arjun Nair'  },
    { day: 'Friday',    period: 3, code: 'CS503', fac: 'Ms. Sneha Iyer'  },
  ];
  for (const e of ttEntries) {
    await prisma.timetable.upsert({
      where: { day_period_semesterId_sectionId: {
        day: e.day, period: e.period,
        semesterId: semesters[5].id, sectionId: sections[5]['B'].id
      }},
      update: {},
      create: {
        day: e.day, period: e.period,
        subjectId: subjects[e.code].id,
        facultyId: faculties[e.fac].id,
        semesterId: semesters[5].id,
        sectionId: sections[5]['B'].id
      }
    });
  }
  console.log(`   ✓ ${ttEntries.length} slots`);

  // ─── 8. Students (Semester 5, Section B) ───────────────────────────────────
  console.log('\n👩‍🎓 Students (Sem 5 / Section B)...');
  const studentData = [
    { usn: '1RV22CS001', name: 'Rahul Sharma',   phone: '9876543210', email: 'rahul@student.edu',   att: 91.5, perf: 84.0 },
    { usn: '1RV22CS002', name: 'Anjali Verma',   phone: '9988776655', email: 'anjali@student.edu',  att: 95.0, perf: 89.5 },
    { usn: '1RV22CS003', name: 'Kiran Nair',     phone: '8877665544', email: 'kiran@student.edu',   att: 78.0, perf: 72.0 },
    { usn: '1RV22CS004', name: 'Priya Iyer',     phone: '7766554433', email: 'priya@student.edu',   att: 88.5, perf: 91.0 },
    { usn: '1RV22CS005', name: 'Arun Kumar',     phone: '6655443322', email: 'arun@student.edu',    att: 65.0, perf: 61.0 },
    { usn: '1RV22CS006', name: 'Sneha Rao',      phone: '9123456789', email: 'sneha.r@student.edu', att: 97.0, perf: 93.0 },
    { usn: '1RV22CS007', name: 'Deepak Menon',   phone: '9234567890', email: 'deepak@student.edu',  att: 82.0, perf: 76.0 },
    { usn: '1RV22CS008', name: 'Meera Singh',    phone: '9345678901', email: 'meera@student.edu',   att: 90.0, perf: 87.5 },
    { usn: '1RV22CS009', name: 'Suresh Pillai',  phone: '9456789012', email: 'suresh@student.edu',  att: 73.5, perf: 68.0 },
    { usn: '1RV22CS010', name: 'Lakshmi Das',    phone: '9567890123', email: 'lakshmi@student.edu', att: 92.0, perf: 88.0 },
    { usn: '1RV22CS011', name: 'Vikram Reddy',   phone: '9678901234', email: 'vikram@student.edu',  att: 85.0, perf: 79.0 },
    { usn: '1RV22CS012', name: 'Divya Krishnan', phone: '9789012345', email: 'divya@student.edu',   att: 94.5, perf: 90.0 },
    { usn: '1RV22CS013', name: 'Ravi Prasad',    phone: '9890123456', email: 'ravi.p@student.edu',  att: 69.0, perf: 63.5 },
    { usn: '1RV22CS014', name: 'Nisha Joshi',    phone: '9901234567', email: 'nisha@student.edu',   att: 88.0, perf: 82.0 },
    { usn: '1RV22CS015', name: 'Arjun Bhat',     phone: '9012345678', email: 'arjun.b@student.edu', att: 96.0, perf: 94.0 },
  ];

  for (const s of studentData) {
    const student = await prisma.student.upsert({
      where: { usn: s.usn },
      update: {},
      create: {
        usn: s.usn, name: s.name, phone: s.phone, email: s.email,
        semesterId: semesters[5].id, sectionId: sections[5]['B'].id
      }
    });
    await prisma.attendance.upsert({
      where: { studentId: student.id },
      update: {},
      create: { studentId: student.id, attendancePercentage: s.att }
    });
    await prisma.performance.upsert({
      where: { studentId: student.id },
      update: {},
      create: { studentId: student.id, performancePercentage: s.perf }
    });
    console.log(`   ✓ ${s.usn} - ${s.name}`);
  }

  console.log('\n✅ Student List Module seeding done!\n');
  console.log('────────────────────────────────────────────────────');
  console.log('🔑 Login  →  POST /api/hod/auth/login');
  console.log('   HOD     : hod@college.edu   / hod@1234');
  console.log('   Faculty : ravi@college.edu  / ravi@1234');
  console.log('────────────────────────────────────────────────────');
  console.log('📌 Test APIs (attach JWT from login):');
  console.log('   GET /api/hod/student-list/semesters');
  console.log('   GET /api/hod/student-list/5/sections');
  console.log('   GET /api/hod/student-list/5/B');
  console.log('────────────────────────────────────────────────────\n');
}

main()
  .catch(e => { console.error('❌ Seed failed:', e); process.exit(1); })
  .finally(() => prisma.$disconnect());
