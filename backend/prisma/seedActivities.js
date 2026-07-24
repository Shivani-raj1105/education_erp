/**
 * Activities Seed
 * ─────────────────────────────────────────────────────────────────────────────
 * Seeds IndustryProject, IndustryProjectStudent, Hackathon,
 * SportsActivity, and OtherCurricularActivity tables with realistic CSE data.
 *
 * Uses the student pool below — these are the real students of the CSE dept
 * that already exist conceptually in the system. Run with:
 *
 *   node -r dotenv/config prisma/seedActivities.js
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const DEPT = 'CSE';

// ─── Realistic CSE student pool (matching existing dept students) ──────────────
const STUDENTS = [
  { studentName: 'Arun Kumar R',        usn: '1RN21CS001', semester: 6, section: 'A' },
  { studentName: 'Bhavya Shree M',      usn: '1RN21CS002', semester: 6, section: 'A' },
  { studentName: 'Chetan Gowda S',      usn: '1RN21CS003', semester: 6, section: 'A' },
  { studentName: 'Divya Lakshmi P',     usn: '1RN21CS004', semester: 6, section: 'A' },
  { studentName: 'Eknath Prasad V',     usn: '1RN21CS005', semester: 6, section: 'A' },
  { studentName: 'Farhan Ahmed K',      usn: '1RN21CS006', semester: 6, section: 'B' },
  { studentName: 'Geetha Rani N',       usn: '1RN21CS007', semester: 6, section: 'B' },
  { studentName: 'Harsha Vardhan D',    usn: '1RN21CS008', semester: 6, section: 'B' },
  { studentName: 'Indira Devi T',       usn: '1RN21CS009', semester: 6, section: 'B' },
  { studentName: 'Jagadeesh Kumar B',   usn: '1RN21CS010', semester: 6, section: 'B' },
  { studentName: 'Kavitha Reddy L',     usn: '1RN22CS001', semester: 4, section: 'A' },
  { studentName: 'Lokesh Naidu G',      usn: '1RN22CS002', semester: 4, section: 'A' },
  { studentName: 'Manjunath H',         usn: '1RN22CS003', semester: 4, section: 'A' },
  { studentName: 'Nanditha Krishnan',   usn: '1RN22CS004', semester: 4, section: 'B' },
  { studentName: 'Omkar Patil R',       usn: '1RN22CS005', semester: 4, section: 'B' },
  { studentName: 'Pooja Shetty U',      usn: '1RN22CS006', semester: 4, section: 'B' },
  { studentName: 'Rajan Subramaniam',   usn: '1RN23CS001', semester: 2, section: 'A' },
  { studentName: 'Sahana Krishnamurthy',usn: '1RN23CS002', semester: 2, section: 'A' },
  { studentName: 'Tejas Bhat N',        usn: '1RN23CS003', semester: 2, section: 'B' },
  { studentName: 'Usha Rani Patil',     usn: '1RN23CS004', semester: 2, section: 'B' },
];

const s = (usn) => STUDENTS.find((st) => st.usn === usn);

// ─── Industry Projects (5 required) ─────────────────────────────────────────
const PROJECTS = [
  {
    projectName: 'Education ERP',
    status: 'ONGOING',
    students: [
      s('1RN21CS001'), s('1RN21CS002'), s('1RN21CS003'),
      s('1RN21CS004'), s('1RN22CS001'),
    ],
  },
  {
    projectName: 'GST Management System',
    status: 'ONGOING',
    students: [
      s('1RN21CS005'), s('1RN21CS006'), s('1RN22CS002'), s('1RN22CS003'),
    ],
  },
  {
    projectName: 'Sugar Mitra',
    status: 'COMPLETED',
    students: [
      s('1RN21CS007'), s('1RN21CS008'), s('1RN21CS009'),
    ],
  },
  {
    projectName: 'FURA',
    status: 'COMPLETED',
    students: [
      s('1RN21CS010'), s('1RN22CS004'), s('1RN22CS005'),
    ],
  },
  {
    projectName: 'CO₂ Emission Monitoring System',
    status: 'COMPLETED',
    students: [
      s('1RN22CS006'), s('1RN23CS001'), s('1RN23CS002'),
    ],
  },
];

// ─── Hackathons ──────────────────────────────────────────────────────────────
const HACKATHONS = [
  { ...s('1RN21CS001'), hackathonName: 'Smart India Hackathon 2024',      position: '1st Place',   year: 2024 },
  { ...s('1RN21CS002'), hackathonName: 'Smart India Hackathon 2024',      position: '1st Place',   year: 2024 },
  { ...s('1RN21CS003'), hackathonName: 'Smart India Hackathon 2024',      position: '1st Place',   year: 2024 },
  { ...s('1RN21CS004'), hackathonName: 'HackRVCE 2024',                   position: 'Runner Up',   year: 2024 },
  { ...s('1RN21CS005'), hackathonName: 'HackRVCE 2024',                   position: 'Runner Up',   year: 2024 },
  { ...s('1RN21CS006'), hackathonName: 'Code For Good IBM 2023',          position: 'Finalist',    year: 2023 },
  { ...s('1RN21CS007'), hackathonName: 'Code For Good IBM 2023',          position: 'Finalist',    year: 2023 },
  { ...s('1RN21CS008'), hackathonName: 'VTU HackFest 2023',               position: '2nd Place',   year: 2023 },
  { ...s('1RN21CS009'), hackathonName: 'VTU HackFest 2023',               position: '2nd Place',   year: 2023 },
  { ...s('1RN21CS010'), hackathonName: 'Manipal Hackathon 2023',          position: '3rd Place',   year: 2023 },
  { ...s('1RN22CS001'), hackathonName: 'Smart India Hackathon 2023',      position: 'Participant', year: 2023 },
  { ...s('1RN22CS002'), hackathonName: 'IIT Bombay TechFest Hack 2024',   position: 'Finalist',    year: 2024 },
  { ...s('1RN22CS003'), hackathonName: 'IIT Bombay TechFest Hack 2024',   position: 'Finalist',    year: 2024 },
  { ...s('1RN22CS004'), hackathonName: 'HackBangalore 2024',              position: 'Participant', year: 2024 },
  { ...s('1RN22CS005'), hackathonName: 'HackBangalore 2024',              position: 'Participant', year: 2024 },
];

// ─── Sports Activities ───────────────────────────────────────────────────────
const SPORTS = [
  { ...s('1RN21CS001'), sportName: 'Cricket',    competitionLevel: 'State Level',        positionMedal: 'Gold Medal',   academicYear: '2023-24', department: 'CSE' },
  { ...s('1RN21CS002'), sportName: 'Badminton',  competitionLevel: 'University Level',   positionMedal: '1st Place',    academicYear: '2023-24', department: 'CSE' },
  { ...s('1RN21CS003'), sportName: 'Football',   competitionLevel: 'Inter-College',      positionMedal: null,           academicYear: '2023-24', department: 'CSE' },
  { ...s('1RN21CS004'), sportName: 'Chess',      competitionLevel: 'National Level',     positionMedal: '3rd Place',    academicYear: '2022-23', department: 'CSE' },
  { ...s('1RN21CS005'), sportName: 'Athletics',  competitionLevel: 'State Level',        positionMedal: 'Silver Medal', academicYear: '2023-24', department: 'CSE' },
  { ...s('1RN21CS006'), sportName: 'Basketball', competitionLevel: 'Inter-College',      positionMedal: null,           academicYear: '2022-23', department: 'CSE' },
  { ...s('1RN21CS007'), sportName: 'Volleyball', competitionLevel: 'District Level',     positionMedal: '2nd Place',    academicYear: '2023-24', department: 'CSE' },
  { ...s('1RN21CS008'), sportName: 'Swimming',   competitionLevel: 'National Level',     positionMedal: 'Bronze Medal', academicYear: '2022-23', department: 'CSE' },
  { ...s('1RN22CS001'), sportName: 'Cricket',    competitionLevel: 'Inter-College',      positionMedal: null,           academicYear: '2023-24', department: 'CSE' },
  { ...s('1RN22CS002'), sportName: 'Table Tennis',competitionLevel:'University Level',   positionMedal: '1st Place',    academicYear: '2023-24', department: 'CSE' },
  { ...s('1RN22CS003'), sportName: 'Kabaddi',    competitionLevel: 'State Level',        positionMedal: null,           academicYear: '2022-23', department: 'CSE' },
  { ...s('1RN22CS004'), sportName: 'Athletics',  competitionLevel: 'National Level',     positionMedal: 'Gold Medal',   academicYear: '2023-24', department: 'CSE' },
  { ...s('1RN23CS001'), sportName: 'Badminton',  competitionLevel: 'Inter-College',      positionMedal: null,           academicYear: '2023-24', department: 'CSE' },
  { ...s('1RN23CS002'), sportName: 'Football',   competitionLevel: 'District Level',     positionMedal: '3rd Place',    academicYear: '2023-24', department: 'CSE' },
];

// ─── Other Curricular Activities ─────────────────────────────────────────────
const OTHER_CURRICULAR = [
  { ...s('1RN21CS001'), eventName: 'Rangoli Competition',          organizingCollege: 'RVCE Bengaluru',              achievement: '1st Prize',          year: 2024 },
  { ...s('1RN21CS002'), eventName: 'Classical Dance Performance',  organizingCollege: 'BMS College of Engineering',  achievement: 'Best Performer',      year: 2024 },
  { ...s('1RN21CS003'), eventName: 'Street Play (Nukkad Natak)',   organizingCollege: 'MSRIT Bengaluru',             achievement: '2nd Prize',           year: 2023 },
  { ...s('1RN21CS004'), eventName: 'Photography Contest',          organizingCollege: 'PES University',              achievement: '1st Prize',           year: 2024 },
  { ...s('1RN21CS005'), eventName: 'Classical Music Competition',  organizingCollege: 'Jain University',             achievement: null,                  year: 2023 },
  { ...s('1RN21CS006'), eventName: 'Debate Competition',           organizingCollege: 'Christ University',           achievement: '3rd Place',           year: 2024 },
  { ...s('1RN21CS007'), eventName: 'Drawing & Painting',           organizingCollege: 'RVCE Bengaluru',              achievement: '2nd Prize',           year: 2023 },
  { ...s('1RN21CS008'), eventName: 'Mime & Skit',                  organizingCollege: 'BMS College of Engineering',  achievement: 'Participation',       year: 2024 },
  { ...s('1RN21CS009'), eventName: 'Western Dance',                organizingCollege: 'MSRIT Bengaluru',             achievement: '1st Prize',           year: 2024 },
  { ...s('1RN21CS010'), eventName: 'Creative Writing',             organizingCollege: 'Dayananda Sagar College',     achievement: null,                  year: 2023 },
  { ...s('1RN22CS001'), eventName: 'Folk Dance',                   organizingCollege: 'RVCE Bengaluru',              achievement: '3rd Prize',           year: 2024 },
  { ...s('1RN22CS002'), eventName: 'Quiz Competition',             organizingCollege: 'PES University',              achievement: 'Winner',              year: 2024 },
  { ...s('1RN22CS003'), eventName: 'Poster Presentation',          organizingCollege: 'Jain University',             achievement: '1st Place',           year: 2023 },
  { ...s('1RN22CS004'), eventName: 'Mono Act',                     organizingCollege: 'Christ University',           achievement: 'Best Actor Award',    year: 2024 },
  { ...s('1RN22CS005'), eventName: 'Bharatanatyam Performance',    organizingCollege: 'Dayananda Sagar College',     achievement: 'Participation',       year: 2023 },
  { ...s('1RN22CS006'), eventName: 'Singing Competition',          organizingCollege: 'BMS College of Engineering',  achievement: '2nd Prize',           year: 2024 },
  { ...s('1RN23CS001'), eventName: 'Rangoli Competition',          organizingCollege: 'MSRIT Bengaluru',             achievement: null,                  year: 2024 },
  { ...s('1RN23CS002'), eventName: 'Short Film Making',            organizingCollege: 'RVCE Bengaluru',              achievement: 'Best Cinematography', year: 2024 },
];

// ─── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  console.log('\n🌱 Seeding Activities data...\n');

  // ── 1. Industry Projects ───────────────────────────────────────────────────
  console.log('📂  Seeding Industry Projects...');
  for (const proj of PROJECTS) {
    // Use upsert on projectName+departmentCode to stay idempotent
    const existing = await prisma.industryProject.findFirst({
      where: { projectName: proj.projectName, departmentCode: DEPT },
    });

    let project;
    if (existing) {
      project = existing;
      console.log(`   ↳ Already exists: ${proj.projectName}`);
    } else {
      project = await prisma.industryProject.create({
        data: {
          projectName:    proj.projectName,
          status:         proj.status,
          departmentCode: DEPT,
        },
      });
      console.log(`   ✅ Created: ${proj.projectName} (${proj.status})`);
    }

    // Add students only if not already added (avoid duplicates)
    const existingStudents = await prisma.industryProjectStudent.findMany({
      where: { projectId: project.id },
    });
    const existingUsns = new Set(existingStudents.map((s) => s.usn));

    for (const st of proj.students) {
      if (!st || existingUsns.has(st.usn)) continue;
      await prisma.industryProjectStudent.create({
        data: {
          projectId:   project.id,
          studentName: st.studentName,
          usn:         st.usn,
          semester:    st.semester,
          section:     st.section,
        },
      });
    }
    console.log(`   ✅ ${proj.students.filter(Boolean).length} students linked to "${proj.projectName}"`);
  }

  // ── 2. Hackathons ──────────────────────────────────────────────────────────
  console.log('\n🏆  Seeding Hackathons...');
  for (const h of HACKATHONS) {
    const existing = await prisma.hackathon.findFirst({
      where: { usn: h.usn, hackathonName: h.hackathonName },
    });
    if (existing) { console.log(`   ↳ Already exists: ${h.usn} @ ${h.hackathonName}`); continue; }

    await prisma.hackathon.create({
      data: {
        studentName:    h.studentName,
        usn:            h.usn,
        semester:       h.semester,
        section:        h.section,
        hackathonName:  h.hackathonName,
        position:       h.position,
        year:           h.year,
        departmentCode: DEPT,
      },
    });
  }
  console.log(`   ✅ ${HACKATHONS.length} hackathon records seeded`);

  // ── 3. Sports Activities ───────────────────────────────────────────────────
  console.log('\n⚽  Seeding Sports Activities...');
  for (const sp of SPORTS) {
    const existing = await prisma.sportsActivity.findFirst({
      where: { usn: sp.usn, sportName: sp.sportName, academicYear: sp.academicYear },
    });
    if (existing) { console.log(`   ↳ Already exists: ${sp.usn} @ ${sp.sportName}`); continue; }

    await prisma.sportsActivity.create({
      data: {
        studentName:      sp.studentName,
        usn:              sp.usn,
        department:       sp.department,
        section:          sp.section,
        semester:         sp.semester,
        sportName:        sp.sportName,
        competitionLevel: sp.competitionLevel,
        positionMedal:    sp.positionMedal || null,
        academicYear:     sp.academicYear,
        departmentCode:   DEPT,
      },
    });
  }
  console.log(`   ✅ ${SPORTS.length} sports records seeded`);

  // ── 4. Other Curricular Activities ────────────────────────────────────────
  console.log('\n🎭  Seeding Other Curricular Activities...');
  for (const oc of OTHER_CURRICULAR) {
    const existing = await prisma.otherCurricularActivity.findFirst({
      where: { usn: oc.usn, eventName: oc.eventName, year: oc.year },
    });
    if (existing) { console.log(`   ↳ Already exists: ${oc.usn} @ ${oc.eventName}`); continue; }

    await prisma.otherCurricularActivity.create({
      data: {
        studentName:      oc.studentName,
        usn:              oc.usn,
        semester:         oc.semester,
        section:          oc.section,
        eventName:        oc.eventName,
        organizingCollege:oc.organizingCollege,
        achievement:      oc.achievement || null,
        year:             oc.year,
        departmentCode:   DEPT,
      },
    });
  }
  console.log(`   ✅ ${OTHER_CURRICULAR.length} curricular activity records seeded`);

  console.log('\n✅  All activities seeded successfully!\n');
  console.log('─── Summary ───────────────────────────────────');
  console.log(`  Industry Projects : ${PROJECTS.length}`);
  console.log(`  Hackathons        : ${HACKATHONS.length}`);
  console.log(`  Sports            : ${SPORTS.length}`);
  console.log(`  Other Curricular  : ${OTHER_CURRICULAR.length}`);
  console.log('───────────────────────────────────────────────\n');
}

main()
  .catch((e) => {
    console.error('\n❌ Seed failed:', e.message);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
