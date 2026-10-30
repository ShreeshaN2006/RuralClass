import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TRANSLATIONS } from '../utils/translations';
import { StatusBadge } from '../components/StatusBadge';
import { StudentProfileModal } from './StudentProfileModal';
import {
  Users,
  Search,
  Filter,
  PlusCircle,
  Eye,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

export const StudentsPage: React.FC = () => {
  const {
    students,
    school,
    teacher,
    language,
    selectedStudentId,
    openAssessmentModal,
  } = useApp();

  const t = TRANSLATIONS[language];

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGrade, setSelectedGrade] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [activeProfileStudentId, setActiveProfileStudentId] = useState<string | null>(null);

  // Filter logic
  const filteredStudents = students.filter(student => {
    // Search by name (English or Kannada)
    const matchesSearch =
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.nameKn.includes(searchQuery);

    // Grade filter
    const matchesGrade =
      selectedGrade === 'All'
        ? true
        : selectedGrade === 'MyGrades'
        ? teacher.assignedGrades.includes(student.grade as any)
        : student.grade === selectedGrade;

    // Status filter
    const matchesStatus = selectedStatus === 'All' || student.overallStatus === selectedStatus;

    return matchesSearch && matchesGrade && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-stone-900 tracking-tight flex items-center gap-2">
            <span>{t.studentsTitle}</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-stone-200/80 text-stone-700 font-semibold">
              {filteredStudents.length} of {students.length}
            </span>
          </h1>
          <p className="text-sm text-stone-600 mt-1">
            {t.studentsSub} • <span className="font-semibold text-stone-800">{teacher.name}</span> ({language === 'kn' ? teacher.roleKn : teacher.role})
          </p>
        </div>

        <button
          onClick={() => openAssessmentModal()}
          className="px-4 py-2 bg-amber-700 hover:bg-amber-800 text-white rounded-xl text-xs sm:text-sm font-semibold transition-colors shadow-xs flex items-center gap-1.5 self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>{t.actionRecordAssessment}</span>
        </button>
      </div>

      {/* Filter and Search Controls (Section 18) */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-600 bg-stone-50/50"
          />
        </div>

        {/* Filter Dropdowns */}
        <div className="flex items-center gap-2">
          {/* Grade filter */}
          <select
            value={selectedGrade}
            onChange={e => setSelectedGrade(e.target.value)}
            className="px-3 py-2 text-xs font-semibold border border-stone-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-amber-600 text-stone-700"
          >
            <option value="All">{t.allGrades}</option>
            <option value="MyGrades">⭐ My Assigned (Grades {teacher.assignedGrades.join(', ')})</option>
            {school.grades.map(g => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>

          {/* Learning status filter */}
          <select
            value={selectedStatus}
            onChange={e => setSelectedStatus(e.target.value)}
            className="px-3 py-2 text-xs font-semibold border border-stone-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-amber-600 text-stone-700"
          >
            <option value="All">{t.allStatuses}</option>
            <option value="Needs support">Needs support (ಬೆಂಬಲ ಬೇಕು)</option>
            <option value="Follow-up">Follow-up (ಅನುಸರಣೆ)</option>
            <option value="Improving">Improving (ಸುಧಾರಿಸುತ್ತಿದೆ)</option>
            <option value="On track">On track (ಸರಿಯಾದ ಹಾದಿ)</option>
          </select>
        </div>
      </div>

      {/* Students Table (Section 18) */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-stone-50 text-stone-600 text-[11px] uppercase tracking-wider border-b border-stone-200">
              <tr>
                <th className="py-3 px-4 font-semibold">{t.colStudent}</th>
                <th className="py-3 px-4 font-semibold">{t.colGrade}</th>
                <th className="py-3 px-4 font-semibold">{t.colReading}</th>
                <th className="py-3 px-4 font-semibold">{t.colMath}</th>
                <th className="py-3 px-4 font-semibold">{t.colAttendance}</th>
                <th className="py-3 px-4 font-semibold">{t.colStatus}</th>
                <th className="py-3 px-4 font-semibold text-right">{t.colActions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 font-sans">
              {filteredStudents.length > 0 ? (
                filteredStudents.map(student => (
                  <tr
                    key={student.id}
                    onClick={() => setActiveProfileStudentId(student.id)}
                    className="hover:bg-amber-50/40 cursor-pointer transition-colors"
                  >
                    <td className="py-3.5 px-4 font-semibold text-stone-900">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-stone-200 text-stone-800 flex items-center justify-center text-xs font-bold shrink-0">
                          {student.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-stone-900">
                            {language === 'kn' ? student.nameKn : student.name}
                          </div>
                          <div className="text-[10px] text-stone-400 font-normal">
                            ID: {student.id.replace('st_', '')}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-medium text-stone-700">
                      {student.grade}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                        student.readingStatus === 'Good' || student.readingStatus === 'Advanced'
                          ? 'bg-emerald-50 text-emerald-800'
                          : student.readingStatus === 'Developing'
                          ? 'bg-blue-50 text-blue-800'
                          : 'bg-amber-100 text-amber-900 font-semibold'
                      }`}>
                        {student.readingStatus}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                        student.mathStatus === 'Good' || student.mathStatus === 'Advanced'
                          ? 'bg-emerald-50 text-emerald-800'
                          : student.mathStatus === 'Developing'
                          ? 'bg-blue-50 text-blue-800'
                          : 'bg-amber-100 text-amber-900 font-semibold'
                      }`}>
                        {student.mathStatus}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-mono font-medium text-stone-700">
                      {student.attendance}%
                    </td>

                    <td className="py-3.5 px-4">
                      <StatusBadge status={student.overallStatus} size="sm" />
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveProfileStudentId(student.id);
                        }}
                        className="px-2.5 py-1 text-xs font-semibold text-amber-800 hover:text-amber-950 hover:bg-amber-100 rounded-lg transition-colors inline-flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>{t.viewDetails}</span>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-stone-500">
                    <Users className="w-10 h-10 text-stone-300 mx-auto mb-2" />
                    <p className="text-sm font-medium">No students found matching current filters.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Profile Modal */}
      {activeProfileStudentId && (
        <StudentProfileModal
          studentId={activeProfileStudentId}
          onClose={() => setActiveProfileStudentId(null)}
        />
      )}
    </div>
  );
};
