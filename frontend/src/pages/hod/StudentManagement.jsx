import React, { useState } from 'react';
import SearchBar from '../../components/ui/SearchBar';

// Placeholder student data — wire to real API when Student module is built
const DUMMY_STUDENTS = [
  { id: 1, rollNo: '211CS001', name: 'Arun Kumar M',      year: 3, semester: 5, section: 'A', cgpa: 8.4 },
  { id: 2, rollNo: '211CS002', name: 'Preethi R',          year: 3, semester: 5, section: 'A', cgpa: 9.1 },
  { id: 3, rollNo: '211CS003', name: 'Suresh Babu K',      year: 3, semester: 5, section: 'B', cgpa: 7.8 },
  { id: 4, rollNo: '211CS004', name: 'Kavitha S',          year: 3, semester: 5, section: 'A', cgpa: 8.9 },
  { id: 5, rollNo: '211CS005', name: 'Ranjith Kumar T',    year: 3, semester: 5, section: 'B', cgpa: 7.2 },
  { id: 6, rollNo: '211CS006', name: 'Divya Bharathi N',   year: 3, semester: 5, section: 'A', cgpa: 8.6 },
  { id: 7, rollNo: '221CS001', name: 'Vinoth Kumar P',     year: 2, semester: 3, section: 'A', cgpa: 8.0 },
  { id: 8, rollNo: '221CS002', name: 'Meena Kumari S',     year: 2, semester: 3, section: 'B', cgpa: 7.5 },
  { id: 9, rollNo: '231CS001', name: 'Karthik Rajan',      year: 1, semester: 1, section: 'A', cgpa: 0  },
  { id: 10,rollNo: '231CS002', name: 'Ananya Krishnan',    year: 1, semester: 1, section: 'B', cgpa: 0  },
];

export default function StudentManagement() {
  const [search, setSearch] = useState('');
  const [yearFilter, setYearFilter] = useState('');

  const filtered = DUMMY_STUDENTS.filter((s) => {
    const matchSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.rollNo.toLowerCase().includes(search.toLowerCase());
    const matchYear = yearFilter ? s.year === parseInt(yearFilter) : true;
    return matchSearch && matchYear;
  });

  const yearCounts = [1, 2, 3, 4].map((y) => ({
    year: y,
    count: DUMMY_STUDENTS.filter((s) => s.year === y).length,
  }));

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Student List</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            {DUMMY_STUDENTS.length} students enrolled in your department
          </p>
        </div>
      </div>

      {/* Year summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {yearCounts.map(({ year, count }) => (
          <button
            key={year}
            onClick={() => setYearFilter(yearFilter === String(year) ? '' : String(year))}
            className={`p-4 rounded-2xl border text-left transition-all ${
              yearFilter === String(year)
                ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg'
                : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-600'
            }`}
          >
            <p className={`text-xs font-medium mb-1 ${yearFilter === String(year) ? 'text-indigo-100' : 'text-gray-500 dark:text-gray-400'}`}>
              Year {year}
            </p>
            <p className={`text-2xl font-bold ${yearFilter === String(year) ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
              {count}
            </p>
            <p className={`text-xs mt-0.5 ${yearFilter === String(year) ? 'text-indigo-100' : 'text-gray-400'}`}>students</p>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-4">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search by name or roll number..."
        />
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-700/30">
                {['Roll No', 'Name', 'Year', 'Semester', 'Section', 'CGPA'].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-700/50">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-gray-400 dark:text-gray-500">
                    No students found
                  </td>
                </tr>
              ) : (
                filtered.map((s) => (
                  <tr key={s.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-700/20 transition-colors">
                    <td className="px-5 py-3 text-sm font-mono text-gray-600 dark:text-gray-300">{s.rollNo}</td>
                    <td className="px-5 py-3 text-sm font-semibold text-gray-900 dark:text-white">{s.name}</td>
                    <td className="px-5 py-3 text-sm text-gray-600 dark:text-gray-300">Year {s.year}</td>
                    <td className="px-5 py-3 text-sm text-gray-600 dark:text-gray-300">Sem {s.semester}</td>
                    <td className="px-5 py-3">
                      <span className="px-2 py-0.5 rounded-md text-xs font-medium bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                        Section {s.section}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      {s.cgpa > 0 ? (
                        <span className={`text-sm font-semibold ${s.cgpa >= 8.5 ? 'text-green-600' : s.cgpa >= 7 ? 'text-blue-600' : 'text-orange-500'}`}>
                          {s.cgpa.toFixed(1)}
                        </span>
                      ) : (
                        <span className="text-xs text-gray-400">Not yet</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
