import React, { useState, useEffect, useCallback } from 'react';
import {
  ChevronRight, ArrowLeft, Loader2, AlertCircle,
  Clock, Link2, Users, BookOpen, GraduationCap,
} from 'lucide-react';
import SearchBar from '../../components/ui/SearchBar';
import Pagination from '../../components/ui/Pagination';
import studentListService from '../../services/studentList.service';
import toast from 'react-hot-toast';

// ─── Navigation state machine ─────────────────────────────────────────────────
const VIEW = { SEMESTER: 'semester', SECTION: 'section', DASHBOARD: 'dashboard' };

// ─── Shared loading / error helpers ──────────────────────────────────────────

function Spinner() {
  return (
    <div className="flex items-center justify-center py-20">
      <Loader2 size={28} className="animate-spin text-indigo-500" />
    </div>
  );
}

function ErrorBox({ message, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
      <AlertCircle size={36} className="text-red-400" />
      <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-1.5 text-sm bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
        >
          Try again
        </button>
      )}
    </div>
  );
}

// ─── Step 1 — Semester Selection ──────────────────────────────────────────────

function SemesterView({ onSelect }) {
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);
  const [data, setData]       = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await studentListService.getSemesters();
      setData(res.data);
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to load semesters';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  if (loading) return <Spinner />;
  if (error)   return <ErrorBox message={error} onRetry={load} />;
  if (!data)   return null;

  return (
    <div className="space-y-4">
      {/* Academic year info strip */}
      <div className="flex items-center gap-3 p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-100 dark:border-indigo-800">
        <GraduationCap size={18} className="text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
        <p className="text-sm">
          <span className="font-semibold text-indigo-700 dark:text-indigo-300">
            {data.semesterType} Semester
          </span>
          <span className="text-indigo-500 dark:text-indigo-400 ml-2">
            Academic Year {data.academicYear}
          </span>
        </p>
      </div>

      {/* Semester cards — same card style as original year cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {data.semesters.map((sem) => (
          <button
            key={sem}
            onClick={() => onSelect(sem)}
            className="p-4 rounded-2xl border text-left transition-all bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-600 hover:shadow-md"
          >
            <p className="text-xs font-medium mb-1 text-gray-500 dark:text-gray-400">Semester</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{sem}</p>
            <p className="text-xs mt-0.5 text-gray-400 flex items-center gap-0.5">
              Select <ChevronRight size={11} />
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Step 2 — Section Selection ───────────────────────────────────────────────

function SectionView({ semester, onSelect }) {
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);
  const [sections, setSections] = useState([]);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await studentListService.getSections(semester);
      setSections(res.data);
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to load sections';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, [semester]);

  useEffect(() => { load(); }, [load]);

  if (loading) return <Spinner />;
  if (error)   return <ErrorBox message={error} onRetry={load} />;

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Select a section for Semester {semester}
      </p>

      {/* Section cards — same card style */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {sections.map((sec) => (
          <button
            key={sec.id}
            onClick={() => onSelect(sec.name)}
            className="p-4 rounded-2xl border text-left transition-all bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-600 hover:shadow-md"
          >
            <p className="text-xs font-medium mb-1 text-gray-500 dark:text-gray-400">Section</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{sec.name}</p>
            <p className="text-xs mt-0.5 text-gray-400 flex items-center gap-0.5">
              Open <ChevronRight size={11} />
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Step 3 — Section Dashboard ───────────────────────────────────────────────

function DashboardView({ semester, section }) {
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);
  const [dashboard, setDashboard] = useState(null);
  const [page, setPage]           = useState(1);
  const [search, setSearch]       = useState('');
  const [ttOpen, setTtOpen]       = useState(false);
  const LIMIT = 50;

  const load = useCallback(async (p) => {
    setLoading(true);
    setError(null);
    try {
      const res = await studentListService.getSectionDashboard(semester, section, p, LIMIT);
      setDashboard(res.data);
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to load section dashboard';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, [semester, section]);

  useEffect(() => { load(1); }, [load]);

  const handlePageChange = (p) => {
    setPage(p);
    setSearch('');
    load(p);
  };

  if (loading) return <Spinner />;
  if (error)   return <ErrorBox message={error} onRetry={() => load(page)} />;
  if (!dashboard) return null;

  const { timetable, subjectFacultyMapping, students } = dashboard;

  // Client-side search on the current loaded page
  const filteredStudents = search
    ? students.data.filter(
        (s) =>
          s.name.toLowerCase().includes(search.toLowerCase()) ||
          s.usn.toLowerCase().includes(search.toLowerCase())
      )
    : students.data;

  // Group timetable rows by day
  const DAY_ORDER = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const timetableByDay = DAY_ORDER.reduce((acc, day) => {
    const slots = timetable.filter((t) => t.day === day);
    if (slots.length) acc[day] = slots;
    return acc;
  }, {});

  return (
    <div className="space-y-4">

      {/* ── Summary cards (same style as original year-count cards) ─── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Students',        value: students.pagination.total, sub: 'enrolled'        },
          { label: 'Subjects',        value: subjectFacultyMapping.length, sub: 'this semester' },
          { label: 'Timetable slots', value: timetable.length,           sub: 'per week'        },
        ].map(({ label, value, sub }) => (
          <div
            key={label}
            className="p-4 rounded-2xl border text-left bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700"
          >
            <p className="text-xs font-medium mb-1 text-gray-500 dark:text-gray-400">{label}</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
            <p className="text-xs mt-0.5 text-gray-400">{sub}</p>
          </div>
        ))}
      </div>

      {/* ── Timetable (collapsible) ───────────────────────────────────── */}
      {timetable.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-card overflow-hidden">
          <button
            onClick={() => setTtOpen(!ttOpen)}
            className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Clock size={15} className="text-amber-500" />
              <span className="text-sm font-semibold text-gray-900 dark:text-white">Timetable</span>
              <span className="text-xs text-gray-400">({timetable.length} slots)</span>
            </div>
            <ChevronRight size={15} className={`text-gray-400 transition-transform ${ttOpen ? 'rotate-90' : ''}`} />
          </button>

          {ttOpen && (
            <div className="border-t border-gray-100 dark:border-gray-700 overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-700/30">
                    {['Day', 'Period', 'Subject', 'Faculty'].map((h) => (
                      <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-gray-700/50">
                  {Object.entries(timetableByDay).map(([day, slots]) =>
                    slots.map((slot, idx) => (
                      <tr key={`${day}-${slot.period}`} className="hover:bg-gray-50/50 dark:hover:bg-gray-700/20 transition-colors">
                        <td className="px-5 py-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
                          {idx === 0 ? day : ''}
                        </td>
                        <td className="px-5 py-3">
                          <span className="px-2 py-0.5 rounded-md text-xs font-medium bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300">
                            {slot.period}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-sm text-gray-900 dark:text-white">
                          {slot.subject}
                          <span className="ml-2 text-xs font-mono text-gray-400">{slot.subjectCode}</span>
                        </td>
                        <td className="px-5 py-3 text-sm text-gray-600 dark:text-gray-300">{slot.faculty}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ── Subject → Faculty mapping ─────────────────────────────────── */}
      {subjectFacultyMapping.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-card overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-3.5 border-b border-gray-100 dark:border-gray-700">
            <Link2 size={15} className="text-emerald-500" />
            <span className="text-sm font-semibold text-gray-900 dark:text-white">Subject — Faculty Mapping</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-700/30">
                  {['#', 'Subject', 'Code', 'Faculty'].map((h) => (
                    <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-700/50">
                {subjectFacultyMapping.map((m, i) => (
                  <tr key={m.subjectCode} className="hover:bg-gray-50/50 dark:hover:bg-gray-700/20 transition-colors">
                    <td className="px-5 py-3 text-sm text-gray-400">{i + 1}</td>
                    <td className="px-5 py-3 text-sm font-semibold text-gray-900 dark:text-white">{m.subject}</td>
                    <td className="px-5 py-3">
                      <span className="px-2 py-0.5 rounded-md text-xs font-medium bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                        {m.subjectCode}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-sm text-gray-600 dark:text-gray-300">{m.faculty}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Student list table ────────────────────────────────────────── */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-card overflow-hidden">
        {/* Table header row with search */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100 dark:border-gray-700 gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <Users size={15} className="text-indigo-500" />
            <span className="text-sm font-semibold text-gray-900 dark:text-white">Students</span>
            <span className="text-xs text-gray-400">({students.pagination.total} total)</span>
          </div>
          <div className="w-60">
            <SearchBar
              value={search}
              onChange={setSearch}
              placeholder="Search by name or USN..."
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-700/30">
                {['S.No', 'USN', 'Name', 'Phone', 'Email', 'Attendance %', 'Performance %'].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-700/50">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-gray-400 dark:text-gray-500">
                    {search ? 'No students match your search' : 'No students in this section'}
                  </td>
                </tr>
              ) : (
                filteredStudents.map((s) => (
                  <tr key={s.usn} className="hover:bg-gray-50/50 dark:hover:bg-gray-700/20 transition-colors">
                    <td className="px-5 py-3 text-sm text-gray-400">{s.sno}</td>
                    <td className="px-5 py-3 text-sm font-mono text-gray-600 dark:text-gray-300">{s.usn}</td>
                    <td className="px-5 py-3 text-sm font-semibold text-gray-900 dark:text-white whitespace-nowrap">{s.name}</td>
                    <td className="px-5 py-3 text-sm text-gray-600 dark:text-gray-300">{s.phone}</td>
                    <td className="px-5 py-3 text-sm text-gray-500 dark:text-gray-400">{s.email}</td>
                    <td className="px-5 py-3">
                      {s.attendance !== null && s.attendance !== undefined ? (
                        <span className={`text-sm font-semibold ${
                          s.attendance >= 85 ? 'text-green-600' :
                          s.attendance >= 75 ? 'text-amber-500' : 'text-red-500'
                        }`}>
                          {s.attendance.toFixed(1)}%
                        </span>
                      ) : (
                        <span className="text-xs text-gray-400">Pending</span>
                      )}
                    </td>
                    <td className="px-5 py-3">
                      {s.performance !== null && s.performance !== undefined ? (
                        <span className={`text-sm font-semibold ${
                          s.performance >= 85 ? 'text-green-600' :
                          s.performance >= 70 ? 'text-blue-600' : 'text-orange-500'
                        }`}>
                          {s.performance.toFixed(1)}%
                        </span>
                      ) : (
                        <span className="text-xs text-gray-400">Pending</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination — only renders when totalPages > 1 */}
        {!search && (
          <Pagination
            pagination={{ ...students.pagination, page }}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </div>
  );
}

// ─── Root component ───────────────────────────────────────────────────────────

export default function StudentManagement() {
  const [view, setView]         = useState(VIEW.SEMESTER);
  const [semester, setSemester] = useState(null);
  const [section, setSection]   = useState(null);

  const handleSemesterSelect = (sem) => {
    setSemester(sem);
    setSection(null);
    setView(VIEW.SECTION);
  };

  const handleSectionSelect = (sec) => {
    setSection(sec);
    setView(VIEW.DASHBOARD);
  };

  const goBack = () => {
    if (view === VIEW.DASHBOARD) {
      setSection(null);
      setView(VIEW.SECTION);
    } else if (view === VIEW.SECTION) {
      setSemester(null);
      setSection(null);
      setView(VIEW.SEMESTER);
    }
  };

  // Dynamic subtitle for the page header
  const subtitle =
    view === VIEW.SEMESTER  ? 'Select a semester to continue' :
    view === VIEW.SECTION   ? `Semester ${semester} — select a section` :
                              `Semester ${semester}  ·  Section ${section}`;

  return (
    <div className="space-y-4">

      {/* ── Page header ─────────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Student List</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{subtitle}</p>
        </div>

        {/* Back button — hidden on first screen */}
        {view !== VIEW.SEMESTER && (
          <button
            onClick={goBack}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium
                       text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400
                       border border-gray-200 dark:border-gray-700 rounded-xl
                       hover:border-indigo-300 dark:hover:border-indigo-600
                       bg-white dark:bg-gray-800 transition-all"
          >
            <ArrowLeft size={14} />
            Back
          </button>
        )}
      </div>

      {/* ── Active view ─────────────────────────────────────────────── */}
      {view === VIEW.SEMESTER && (
        <SemesterView onSelect={handleSemesterSelect} />
      )}

      {view === VIEW.SECTION && semester && (
        <SectionView semester={semester} onSelect={handleSectionSelect} />
      )}

      {view === VIEW.DASHBOARD && semester && section && (
        <DashboardView semester={semester} section={section} />
      )}

    </div>
  );
}
