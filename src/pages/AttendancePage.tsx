import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TRANSLATIONS } from '../utils/translations';
import {
  Users,
  CheckCircle2,
  XCircle,
  Calendar,
  AlertTriangle,
  Search,
  Check,
  UserCheck,
} from 'lucide-react';

export const AttendancePage: React.FC = () => {
  const {
    students,
    attendanceRecords,
    toggleAttendance,
    markAllPresent,
    teacher,
    language,
    school,
  } = useApp();

  const t = TRANSLATIONS[language];
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGrade, setSelectedGrade] = useState<string>('All');

  // Compute stats
  const totalStudents = students.length;
  const presentCount = attendanceRecords.filter(r => r.status === 'present').length;
  const absentCount = totalStudents - presentCount;
  const attendanceRate = totalStudents > 0 ? Math.round((presentCount / totalStudents) * 100) : 90;

  // Filter students
  const filteredStudents = students.filter(s => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.nameKn.includes(searchQuery);
    const matchesGrade = selectedGrade === 'All' || s.grade === selectedGrade;
    return matchesSearch && matchesGrade;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-stone-900 tracking-tight flex items-center gap-2">
            <Users className="w-6 h-6 text-amber-700" />
            <span>{t.attendanceTitle}</span>
          </h1>
          <p className="text-sm text-stone-600 mt-1">
            {t.attendanceSub} • <span className="text-stone-800 font-semibold">{teacher.name}</span> ({language === 'kn' ? teacher.roleKn : teacher.role} • Grades {teacher.assignedGrades.join(', ')})
          </p>
        </div>

        <button
          onClick={markAllPresent}
          className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs sm:text-sm font-semibold transition-colors shadow-xs flex items-center gap-1.5 self-start sm:self-auto"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>{t.btnMarkAllPresent}</span>
        </button>
      </div>

      {/* Stats Summary Cards (Section 5) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
          <div className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1">
            {t.statTodayAttendance}
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-stone-900">
            {presentCount} <span className="text-sm font-normal text-stone-500">/ {totalStudents}</span>
          </div>
          <div className="text-xs text-stone-500 mt-1">
            {attendanceRate}% present today
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-emerald-200 bg-emerald-50/20 shadow-xs">
          <div className="text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-1">
            Present Today
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-900">
            {presentCount}
          </div>
          <div className="text-xs text-emerald-700 mt-1">Active in class</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-rose-200 bg-rose-50/20 shadow-xs">
          <div className="text-xs font-semibold text-rose-800 uppercase tracking-wider mb-1">
            Absent Today
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-rose-900">
            {absentCount}
          </div>
          <div className="text-xs text-rose-700 mt-1">Leave / agricultural work</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-blue-200 bg-blue-50/20 shadow-xs">
          <div className="text-xs font-semibold text-blue-800 uppercase tracking-wider mb-1">
            {t.statMonthlyAttendance}
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-blue-950">
            93%
          </div>
          <div className="text-xs text-blue-700 mt-1">Monthly school average</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative flex-1 w-full sm:w-auto">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search student for attendance..."
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-600 bg-stone-50/50"
          />
        </div>

        <select
          value={selectedGrade}
          onChange={e => setSelectedGrade(e.target.value)}
          className="w-full sm:w-auto px-3 py-2 text-xs font-semibold border border-stone-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-amber-600 text-stone-700"
        >
          <option value="All">{t.allGrades}</option>
          {school.grades.map(g => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>
      </div>

      {/* Attendance Roster Table */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-stone-50 text-stone-600 text-[11px] uppercase tracking-wider border-b border-stone-200">
              <tr>
                <th className="py-3 px-4 font-semibold">{t.colStudent}</th>
                <th className="py-3 px-4 font-semibold">{t.colGrade}</th>
                <th className="py-3 px-4 font-semibold">Monthly Attendance</th>
                <th className="py-3 px-4 font-semibold">Absence Warnings</th>
                <th className="py-3 px-4 font-semibold text-right">Today's Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 font-sans">
              {filteredStudents.map(student => {
                const record = attendanceRecords.find(r => r.studentId === student.id);
                const isPresent = record ? record.status === 'present' : true;
                const hasRepeatedAbsence = student.absentCountThisMonth >= 3;

                return (
                  <tr key={student.id} className="hover:bg-stone-50/60 transition-colors">
                    <td className="py-3 px-4 font-semibold text-stone-900">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-stone-200 text-stone-700 flex items-center justify-center text-xs font-bold shrink-0">
                          {student.name.charAt(0)}
                        </div>
                        <span>{language === 'kn' ? student.nameKn : student.name}</span>
                      </div>
                    </td>

                    <td className="py-3 px-4 text-stone-700">{student.grade}</td>

                    <td className="py-3 px-4 font-mono font-medium text-stone-700">
                      {student.attendance}%
                    </td>

                    <td className="py-3 px-4">
                      {hasRepeatedAbsence ? (
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-300 text-xs font-semibold">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                          <span>{student.name} {t.repeatedAbsenceAlert}</span>
                        </div>
                      ) : (
                        <span className="text-xs text-stone-400">Normal</span>
                      )}
                    </td>

                    {/* Present / Absent Toggle Button */}
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => toggleAttendance(student.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-2xs inline-flex items-center gap-1.5 ${
                          isPresent
                            ? 'bg-emerald-100 hover:bg-emerald-200 text-emerald-950 border border-emerald-300'
                            : 'bg-rose-100 hover:bg-rose-200 text-rose-950 border border-rose-300'
                        }`}
                      >
                        {isPresent ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                            <span>Present</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3.5 h-3.5 text-rose-700" />
                            <span>Absent</span>
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
