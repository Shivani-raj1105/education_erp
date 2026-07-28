/**
 * Full seed for the Student List Module.
 * Covers all 8 semesters × 4 sections (A–D) with:
 *   - Subjects per semester
 *   - Subject → Faculty assignment
 *   - Weekly timetable (Mon–Fri, 6 periods)
 *   - 12 students per section (with attendance & performance)
 *
 * Run with: node prisma/seedStudentList.js
 */

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

// ─── Subject catalogue per semester ──────────────────────────────────────────
const SEMESTER_SUBJECTS = {
  1: [
    { name: 'Engineering Mathematics I',      code: 'MA101' },
    { name: 'Engineering Physics',            code: 'PH101' },
    { name: 'Basic Electronics',              code: 'EC101' },
    { name: 'Programming in C',               code: 'CS101' },
    { name: 'Engineering Drawing',            code: 'ME101' },
  ],
  2: [
    { name: 'Engineering Mathematics II',     code: 'MA201' },
    { name: 'Engineering Chemistry',          code: 'CH201' },
    { name: 'Data Structures',                code: 'CS201' },
    { name: 'Digital Electronics',            code: 'EC201' },
    { name: 'Communication Skills',           code: 'HS201' },
  ],
  3: [
    { name: 'Discrete Mathematics',           code: 'MA301' },
    { name: 'Object Oriented Programming',    code: 'CS301' },
    { name: 'Computer Organization',          code: 'CS302' },
    { name: 'Microprocessors',                code: 'EC301' },
    { name: 'Environmental Science',          code: 'HS301' },
  ],
  4: [
    { name: 'Engineering Mathematics III',    code: 'MA401' },
    { name: 'Design & Analysis of Algorithms',code: 'CS401' },
    { name: 'Operating Systems',              code: 'CS402' },
    { name: 'Software Engineering',           code: 'CS403' },
    { name: 'Computer Networks I',            code: 'CS404' },
  ],
  5: [
    { name: 'Automata Theory',                code: 'CS501' },
    { name: 'Java Programming',               code: 'CS502' },
    { name: 'Database Management Systems',    code: 'CS503' },
    { name: 'Computer Networks II',           code: 'CS504' },
    { name: 'Web Technologies',               code: 'CS505' },
  ],
  6: [
    { name: 'Compiler Design',                code: 'CS601' },
    { name: 'Artificial Intelligence',        code: 'CS602' },
    { name: 'Cloud Computing',                code: 'CS603' },
    { name: 'Information Security',           code: 'CS604' },
    { name: 'Mobile Application Development', code: 'CS605' },
  ],
  7: [
    { name: 'Machine Learning',               code: 'CS701' },
    { name: 'Big Data Analytics',             code: 'CS702' },
    { name: 'Internet of Things',             code: 'CS703' },
    { name: 'Blockchain Technology',          code: 'CS704' },
    { name: 'Deep Learning',                  code: 'CS705' },
  ],
  8: [
    { name: 'Project Work',                   code: 'CS801' },
    { name: 'Industry Internship',            code: 'CS802' },
    { name: 'Technical Seminar',              code: 'CS803' },
    { name: 'Entrepreneurship',               code: 'CS804' },
    { name: 'Research Methodology',           code: 'CS805' },
  ],
};

// ─── Faculty pool (12 teaching staff + 1 HOD) ────────────────────────────────
const FACULTY_DATA = [
  { name: 'Dr. S. Kumar',        email: 'hod@college.edu',      password: 'hod@1234',      role: 'HOD'     },
  { name: 'Dr. Ravi Sharma',     email: 'ravi@college.edu',     password: 'ravi@1234',     role: 'FACULTY' },
  { name: 'Mr. Arjun Nair',      email: 'arjun@college.edu',    password: 'arjun@1234',    role: 'FACULTY' },
  { name: 'Ms. Sneha Iyer',      email: 'sneha@college.edu',    password: 'sneha@1234',    role: 'FACULTY' },
  { name: 'Mr. Kiran Rao',       email: 'kiran@college.edu',    password: 'kiran@1234',    role: 'FACULTY' },
  { name: 'Dr. Meena Pillai',    email: 'meena@college.edu',    password: 'meena@1234',    role: 'FACULTY' },
  { name: 'Mr. Suresh Babu',     email: 'suresh@college.edu',   password: 'suresh@1234',   role: 'FACULTY' },
  { name: 'Ms. Ananya Das',      email: 'ananya@college.edu',   password: 'ananya@1234',   role: 'FACULTY' },
  { name: 'Dr. Vijay Menon',     email: 'vijay@college.edu',    password: 'vijay@1234',    role: 'FACULTY' },
  { name: 'Ms. Priya Reddy',     email: 'priya@college.edu',    password: 'priya@1234',    role: 'FACULTY' },
  { name: 'Mr. Rohit Joshi',     email: 'rohit@college.edu',    password: 'rohit@1234',    role: 'FACULTY' },
  { name: 'Dr. Lakshmi Nair',    email: 'lakshmi@college.edu',  password: 'lakshmi@1234',  role: 'FACULTY' },
  { name: 'Mr. Aditya Varma',    email: 'aditya@college.edu',   password: 'aditya@1234',   role: 'FACULTY' },
];

// ─── Assign faculty to subjects round-robin per semester ─────────────────────
// Returns { subjectCode → facultyName }
function assignFaculty(semNum, subjects, facultyNames) {
  // Offset by semester so different semesters get different primary faculty
  const offset = (semNum - 1) * 2;
  const map = {};
  subjects.forEach((sub, i) => {
    map[sub.code] = facultyNames[(offset + i) % facultyNames.length];
  });
  return map;
}

// ─── Build a 5-day × 6-period timetable for a given subject set ──────────────
const DAYS    = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const PERIODS = [1, 2, 3, 4, 5, 6];

function buildTimetable(subjects, facultyAssignment) {
  // Spread subjects across the 30 slots (Mon-Fri × 6 periods)
  // Each subject appears ~6 times per week
  const slots = [];
  let subIdx = 0;
  for (const day of DAYS) {
    for (const period of PERIODS) {
      const sub = subjects[subIdx % subjects.length];
      slots.push({
        day,
        period,
        code: sub.code,
        fac: facultyAssignment[sub.code],
      });
      subIdx++;
    }
  }
  return slots;
}

// ─── Student name pool (mix of Indian names) ─────────────────────────────────
const FIRST_NAMES = [
  'Aarav','Ananya','Arjun','Bhavya','Chetan','Deepika','Eshan','Farhan',
  'Gayatri','Harish','Indira','Jayesh','Kavitha','Lokesh','Manisha','Naveen',
  'Ojasvi','Pooja','Rahul','Sanjana','Tejas','Usha','Vikram','Yamini',
  'Zara','Akash','Bharat','Chandni','Dinesh','Esha','Faisal','Geetha',
  'Hitesh','Ishaan','Jaya','Karthik','Leena','Mohan','Nidhi','Om',
  'Pallavi','Qasim','Ritu','Sachin','Tara','Uma','Varun','Waqar',
];

const LAST_NAMES = [
  'Sharma','Verma','Nair','Iyer','Rao','Pillai','Kumar','Singh',
  'Das','Menon','Reddy','Joshi','Bhat','Gupta','Patel','Mehta',
  'Shah','Mishra','Tiwari','Pandey','Chauhan','Yadav','Dubey','Sinha',
];

// Deterministic student generator to avoid random collisions
function generateStudents(semNum, sectionName) {
  const sectionIdx = ['A','B','C','D'].indexOf(sectionName);
  const year = 2026 - Math.floor((semNum - 1) / 2); // batch year
  const shortYear = String(year).slice(2);
  const students = [];
  for (let i = 0; i < 12; i++) {
    const nameIdx   = ((semNum - 1) * 48 + sectionIdx * 12 + i) % FIRST_NAMES.length;
    const lastIdx   = ((semNum - 1) * 12 + sectionIdx * 3  + i) % LAST_NAMES.length;
    const usn       = `1RV${shortYear}CS${String((semNum - 1) * 48 + sectionIdx * 12 + i + 1).padStart(3,'0')}`;
    const firstName = FIRST_NAMES[nameIdx];
    const lastName  = LAST_NAMES[lastIdx];
    const name      = `${firstName} ${lastName}`;
    // Make email unique by appending semNum + sectionIdx + i
    const emailUser = `${firstName.toLowerCase()}.${lastName.toLowerCase()}.s${semNum}${sectionName.toLowerCase()}${i}`;
    // Attendance: range 60–98, varied per student
    const att  = parseFloat((60 + ((semNum * 7 + sectionIdx * 4 + i * 3) % 38)).toFixed(1));
    const perf = parseFloat((55 + ((semNum * 5 + sectionIdx * 6 + i * 4) % 43)).toFixed(1));
    students.push({
      usn,
      name,
      phone: `9${String(8000000000 + semNum * 1000000 + sectionIdx * 100000 + i * 1000).slice(1)}`,
      email: `${emailUser}@student.edu`,
      att,
      perf,
    });
  }
  return students;
}

// ─── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  console.log('🌱 Full Student List Module seed — all semesters & sections\n');

  // 1. Academic Settings
  console.log('📅 Academic Settings...');
  await prisma.academicSettings.upsert({
    where:  { id: 1 },
    update: { academicYear: '2026-27', currentSemesterType: 'ODD' },
    create: { academicYear: '2026-27', currentSemesterType: 'ODD' },
  });
  console.log('   ✓ 2026-27 | ODD semester');

  // 2. Semesters 1–8
  console.log('\n📚 Semesters...');
  const semesters = {};
  for (const num of [1,2,3,4,5,6,7,8]) {
    semesters[num] = await prisma.semester.upsert({
      where:  { semesterNumber: num },
      update: {},
      create: { semesterNumber: num },
    });
  }
  console.log('   ✓ Semesters 1–8');

  // 3. Faculty
  console.log('\n👨‍🏫 Faculty...');
  const faculties = {};
  for (const f of FACULTY_DATA) {
    const hashed = await bcrypt.hash(f.password, 10);
    const rec = await prisma.slFaculty.upsert({
      where:  { email: f.email },
      update: {},
      create: { name: f.name, email: f.email, password: hashed, role: f.role },
    });
    faculties[f.name] = rec;
    console.log(`   ✓ ${f.role.padEnd(7)} ${f.name}  (${f.email} / ${f.password})`);
  }
  const facultyNames = FACULTY_DATA.filter(f => f.role === 'FACULTY').map(f => f.name);

  // 4. Sections A–D for every semester
  console.log('\n🏫 Sections...');
  const sections = {};
  for (const semNum of [1,2,3,4,5,6,7,8]) {
    sections[semNum] = {};
    for (const sec of ['A','B','C','D']) {
      sections[semNum][sec] = await prisma.section.upsert({
        where:  { semesterId_sectionName: { semesterId: semesters[semNum].id, sectionName: sec } },
        update: {},
        create: { semesterId: semesters[semNum].id, sectionName: sec },
      });
    }
  }
  console.log('   ✓ A, B, C, D for every semester');

  // 5. Subjects + faculty assignments + timetables per semester
  console.log('\n📖 Subjects, faculty assignments & timetables...');
  const subjects = {}; // subjects[semNum][code] = prisma record

  for (const semNum of [1,2,3,4,5,6,7,8]) {
    const semSubjects = SEMESTER_SUBJECTS[semNum];
    subjects[semNum] = {};

    // Upsert subjects
    for (const sub of semSubjects) {
      subjects[semNum][sub.code] = await prisma.subject.upsert({
        where:  { subjectCode: sub.code },
        update: {},
        create: { subjectName: sub.name, subjectCode: sub.code, semesterId: semesters[semNum].id },
      });
    }

    // Assign faculty to subjects
    const assignment = assignFaculty(semNum, semSubjects, facultyNames);

    // Upsert SubjectFaculty mappings
    for (const sub of semSubjects) {
      const facultyName = assignment[sub.code];
      await prisma.subjectFaculty.upsert({
        where: {
          subjectId_facultyId: {
            subjectId: subjects[semNum][sub.code].id,
            facultyId: faculties[facultyName].id,
          },
        },
        update: {},
        create: {
          subjectId: subjects[semNum][sub.code].id,
          facultyId: faculties[facultyName].id,
        },
      });
    }

    // Build timetable template for this semester
    const ttTemplate = buildTimetable(semSubjects, assignment);

    // Apply the same timetable pattern to all 4 sections
    for (const secName of ['A','B','C','D']) {
      const sectionId = sections[semNum][secName].id;
      for (const slot of ttTemplate) {
        await prisma.timetable.upsert({
          where: {
            day_period_semesterId_sectionId: {
              day: slot.day,
              period: slot.period,
              semesterId: semesters[semNum].id,
              sectionId,
            },
          },
          update: {},
          create: {
            day:        slot.day,
            period:     slot.period,
            subjectId:  subjects[semNum][slot.code].id,
            facultyId:  faculties[slot.fac].id,
            semesterId: semesters[semNum].id,
            sectionId,
          },
        });
      }
    }

    console.log(`   ✓ Semester ${semNum}: ${semSubjects.length} subjects, ${ttTemplate.length} slots/section × 4 sections`);
  }

  // 6. Students for every semester × every section
  console.log('\n👩‍🎓 Students (12 per section × 4 sections × 8 semesters = 384 total)...');
  for (const semNum of [1,2,3,4,5,6,7,8]) {
    for (const secName of ['A','B','C','D']) {
      const sectionId  = sections[semNum][secName].id;
      const studentList = generateStudents(semNum, secName);
      for (const s of studentList) {
        const student = await prisma.student.upsert({
          where:  { usn: s.usn },
          update: {},
          create: {
            usn:       s.usn,
            name:      s.name,
            phone:     s.phone,
            email:     s.email,
            semesterId: semesters[semNum].id,
            sectionId,
          },
        });
        await prisma.attendance.upsert({
          where:  { studentId: student.id },
          update: {},
          create: { studentId: student.id, attendancePercentage: s.att },
        });
        await prisma.performance.upsert({
          where:  { studentId: student.id },
          update: {},
          create: { studentId: student.id, performancePercentage: s.perf },
        });
      }
      console.log(`   ✓ Sem ${semNum} / Sec ${secName}: ${studentList.length} students`);
    }
  }

  console.log('\n✅ Full seed complete!\n');
  console.log('═══════════════════════════════════════════════════');
  console.log('  Semesters  : 1 – 8');
  console.log('  Sections   : A, B, C, D  (each semester)');
  console.log('  Subjects   : 5 per semester  (40 total)');
  console.log('  Timetable  : 30 slots / section  (960 total)');
  console.log('  Students   : 12 / section  (384 total)');
  console.log('───────────────────────────────────────────────────');
  console.log('🔑 HOD login → POST /api/auth/login');
  console.log('   dept: CSE  |  username: hod_cse  |  password: hod@cse123');
  console.log('═══════════════════════════════════════════════════\n');
}

main()
  .catch(e => { console.error('\n❌ Seed failed:', e.message); process.exit(1); })
  .finally(() => prisma.$disconnect());
