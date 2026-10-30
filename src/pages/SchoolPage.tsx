import React from 'react';
import { useApp } from '../context/AppContext';
import { TRANSLATIONS } from '../utils/translations';
import { ConnectivityMode } from '../types';
import {
  School as SchoolIcon,
  MapPin,
  Users,
  GraduationCap,
  Wifi,
  WifiOff,
  Radio,
  BookOpen,
  ShieldCheck,
  Check,
} from 'lucide-react';

export const SchoolPage: React.FC = () => {
  const {
    school,
    schools,
    teacher,
    allTeachers,
    switchTeacher,
    students,
    connectivityMode,
    setConnectivityMode,
    switchSchool,
    language,
    showToast,
  } = useApp();

  const t = TRANSLATIONS[language];

  const handleConnectivityChange = (mode: ConnectivityMode) => {
    setConnectivityMode(mode);
    showToast(`Connectivity set to: ${mode.replace('_', ' ')}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-stone-900 tracking-tight flex items-center gap-2">
          <SchoolIcon className="w-6 h-6 text-amber-700" />
          <span>{t.schoolTitle}</span>
        </h1>
        <p className="text-sm text-stone-600 mt-1">
          {t.schoolSub}
        </p>
      </div>

      {/* Multi-School Switcher Card (Section 29) */}
      <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-amber-200/60">
          <div>
            <h2 className="text-sm font-bold text-amber-950 uppercase tracking-wider">
              {t.switchSchool} (Multi-School Isolation Test)
            </h2>
            <p className="text-xs text-amber-900 mt-0.5">
              Switching schools immediately shifts student roster, teacher assignments, and timetable records without mixing data.
            </p>
          </div>
          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-amber-200 text-amber-900 font-semibold self-start sm:self-auto">
            Multi-Tenant Isolation
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {schools.map(s => {
            const isSelected = s.id === school.id;
            return (
              <div
                key={s.id}
                onClick={() => switchSchool(s.id)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-white border-amber-500 shadow-sm ring-1 ring-amber-500'
                    : 'bg-white/60 border-amber-200/80 hover:bg-white hover:border-amber-300'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                      isSelected ? 'bg-amber-700 text-white' : 'bg-stone-100 text-stone-600'
                    }`}>
                      {s.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold text-xs sm:text-sm text-stone-900">
                        {language === 'kn' ? s.nameKn : s.name}
                      </div>
                      <div className="text-[11px] text-stone-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-stone-400" />
                        <span>{language === 'kn' ? s.locationKn : s.location}</span>
                      </div>
                    </div>
                  </div>
                  {isSelected && (
                    <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs shrink-0">
                      ✓
                    </span>
                  )}
                </div>

                <div className="mt-3 pt-2 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500">
                  <span>{s.grades.length} Grades ({s.grades[0]}–{s.grades[s.grades.length - 1]})</span>
                  <span>{s.studentCount} Students</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* School Information Details (Section 26) */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-xs p-5 sm:p-6 space-y-5">
        <h2 className="text-base font-bold text-stone-900 pb-2 border-b border-stone-100">
          {language === 'kn' ? school.nameKn : school.name}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200">
            <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider block mb-1">
              {t.lblLocation}
            </span>
            <span className="text-sm font-bold text-stone-900">
              {language === 'kn' ? school.locationKn : school.location}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200">
            <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider block mb-1">
              {t.lblTotalStudents}
            </span>
            <span className="text-sm font-bold text-stone-900">
              {students.length} Learners Enrolled
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200">
            <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider block mb-1">
              Assigned Teacher
            </span>
            <span className="text-sm font-bold text-stone-900">
              {language === 'kn' ? teacher.nameKn : teacher.name}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200">
            <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider block mb-1">
              Grades Supported
            </span>
            <span className="text-sm font-bold text-stone-900">
              {school.grades.join(', ')}
            </span>
          </div>
        </div>

        {/* Teachers Assigned to this School */}
        <div className="pt-4 border-t border-stone-100">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider">
                {language === 'kn' ? 'ಶಾಲೆಯಲ್ಲಿ ನಿಯೋಜಿಸಲಾದ ಶಿಕ್ಷಕರು' : 'Teachers Assigned to this School'}
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                {language === 'kn'
                  ? 'ಯಾವುದೇ ಶಿಕ್ಷಕರ ಪ್ರೊಫೈಲ್‌ಗೆ ತಕ್ಷಣ ಬದಲಾಯಿಸಿ'
                  : 'Click on any teacher to view and act under their profile'}
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-100 text-amber-800">
              {allTeachers.filter(t => t.schoolId === school.id).length} Teachers Active
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {allTeachers
              .filter(t => t.schoolId === school.id)
              .map(t => {
                const isCurrent = t.id === teacher.id;
                return (
                  <div
                    key={t.id}
                    className={`p-3.5 rounded-xl border transition-all flex flex-col justify-between ${
                      isCurrent
                        ? 'bg-amber-50/80 border-amber-400 ring-1 ring-amber-400 shadow-xs'
                        : 'bg-stone-50/80 border-stone-200 hover:border-amber-300 hover:bg-white'
                    }`}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                            t.avatarColor || 'bg-amber-700 text-white'
                          }`}>
                            {t.name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-bold text-xs text-stone-900">
                              {language === 'kn' ? t.nameKn : t.name}
                            </div>
                            <div className="text-[11px] text-amber-900 font-medium">
                              {language === 'kn' ? t.roleKn || t.role : t.role}
                            </div>
                          </div>
                        </div>
                        {isCurrent && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-700 text-white">
                            Current
                          </span>
                        )}
                      </div>

                      <div className="text-[11px] text-stone-600 mb-2">
                        <span className="text-stone-400 font-semibold mr-1">Grades:</span>
                        {t.assignedGrades.join(', ')}
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-stone-500 mb-1">
                        <span>Syllabus Covered</span>
                        <span className="font-bold text-stone-800">{t.syllabusCompletion}%</span>
                      </div>
                      <div className="w-full bg-stone-200 h-1.5 rounded-full overflow-hidden mb-3">
                        <div
                          className="bg-amber-600 h-1.5 rounded-full"
                          style={{ width: `${t.syllabusCompletion}%` }}
                        />
                      </div>
                    </div>

                    {!isCurrent && (
                      <button
                        onClick={() => switchTeacher(t.id)}
                        className="w-full py-1.5 px-3 bg-white hover:bg-amber-700 hover:text-white text-stone-800 border border-stone-300 hover:border-amber-700 rounded-lg text-xs font-semibold transition-all shadow-2xs"
                      >
                        {language === 'kn' ? 'ಈ ಶಿಕ್ಷಕರಾಗಿ ನಿರ್ವಹಿಸಿ' : `Act as ${t.name.split(' ')[0]}`}
                      </button>
                    )}
                  </div>
                );
              })}
          </div>
        </div>

        {/* Connectivity Mode Settings (Section 26 & 27) */}
        <div className="pt-4 border-t border-stone-100">
          <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
            {t.lblConnectivity}
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => handleConnectivityChange('good')}
              className={`p-3.5 rounded-xl border text-left transition-all ${
                connectivityMode === 'good'
                  ? 'bg-amber-50 border-amber-500 ring-1 ring-amber-500'
                  : 'bg-stone-50 border-stone-200 hover:border-stone-300'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <Wifi className="w-4 h-4 text-emerald-600" />
                <span className="font-bold text-xs text-stone-900">Good</span>
              </div>
              <p className="text-[11px] text-stone-500">{t.connGood}</p>
            </button>

            <button
              type="button"
              onClick={() => handleConnectivityChange('limited')}
              className={`p-3.5 rounded-xl border text-left transition-all ${
                connectivityMode === 'limited'
                  ? 'bg-amber-50 border-amber-500 ring-1 ring-amber-500'
                  : 'bg-stone-50 border-stone-200 hover:border-stone-300'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <Radio className="w-4 h-4 text-amber-600" />
                <span className="font-bold text-xs text-stone-900">Limited</span>
              </div>
              <p className="text-[11px] text-stone-500">{t.connLimited}</p>
            </button>

            <button
              type="button"
              onClick={() => handleConnectivityChange('very_limited')}
              className={`p-3.5 rounded-xl border text-left transition-all ${
                connectivityMode === 'very_limited'
                  ? 'bg-amber-50 border-amber-500 ring-1 ring-amber-500'
                  : 'bg-stone-50 border-stone-200 hover:border-stone-300'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <WifiOff className="w-4 h-4 text-stone-600" />
                <span className="font-bold text-xs text-stone-900">Very Limited / Offline</span>
              </div>
              <p className="text-[11px] text-stone-500">{t.connVeryLimited}</p>
            </button>
          </div>

          {/* Section 26 Explicit Note when Very Limited is selected */}
          {connectivityMode === 'very_limited' && (
            <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-950 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0" />
              <span>{t.connNote}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
