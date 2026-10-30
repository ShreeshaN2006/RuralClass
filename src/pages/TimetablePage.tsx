import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TRANSLATIONS } from '../utils/translations';
import { GradeLevel, Subject, TimetableConfig } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import {
  Calendar,
  Sparkles,
  CheckCircle2,
  RefreshCw,
  Sliders,
  ShieldCheck,
  UserCheck,
  BookOpen,
  Info,
  Clock,
  Printer,
} from 'lucide-react';

export const TimetablePage: React.FC = () => {
  const {
    timetable,
    school,
    teacher,
    allTeachers,
    switchTeacher,
    language,
    generateAndSetTimetable,
    acceptTimetable,
    showToast,
  } = useApp();

  const t = TRANSLATIONS[language];
  const schoolTeachers = allTeachers.filter(tch => tch.schoolId === school.id);

  // Config form state
  const [selectedGrades, setSelectedGrades] = useState<GradeLevel[]>(school.grades);
  const [periodCount, setPeriodCount] = useState<number>(6);
  const [periodDurationMin, setPeriodDurationMin] = useState<number>(40);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEditingConfig, setIsEditingConfig] = useState(false);

  const toggleGrade = (g: GradeLevel) => {
    if (selectedGrades.includes(g)) {
      if (selectedGrades.length === 1) {
        showToast(language === 'kn' ? 'ಕನಿಷ್ಠ ಒಂದು ತರಗತಿಯನ್ನು ಆಯ್ಕೆ ಮಾಡಿರಬೇಕು.' : 'Please keep at least one grade selected.');
        return;
      }
      setSelectedGrades(selectedGrades.filter(x => x !== g));
    } else {
      setSelectedGrades([...selectedGrades, g].sort());
    }
  };

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const config: TimetableConfig = {
        schoolId: school.id,
        grades: selectedGrades,
        subjects: school.subjects,
        periodCount,
        periodDurationMin,
        startTime: '09:00 AM',
      };
      generateAndSetTimetable(config);
      setIsGenerating(false);
      setIsEditingConfig(false);
    }, 400);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-stone-900 tracking-tight">
              {t.timetableTitle}
            </h1>
            <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Conflict-Free
            </span>
          </div>
          <p className="text-sm text-stone-600 mt-1">
            {t.timetableSub} • <span className="text-stone-800 font-semibold">{teacher.name}</span> ({language === 'kn' ? teacher.roleKn : teacher.role} • Grades {teacher.assignedGrades.join(', ')})
          </p>

          {/* School Teacher Roster Switcher */}
          {schoolTeachers.length > 1 && (
            <div className="flex flex-wrap items-center gap-1.5 mt-2.5 pt-2 border-t border-stone-200">
              <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider mr-1">
                Staff Timetable:
              </span>
              {schoolTeachers.map(tch => {
                const isActive = tch.id === teacher.id;
                return (
                  <button
                    key={tch.id}
                    onClick={() => switchTeacher(tch.id)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                      isActive
                        ? 'bg-amber-700 text-white shadow-xs font-bold'
                        : 'bg-white hover:bg-stone-100 text-stone-700 border border-stone-200'
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-amber-300' : 'bg-stone-300'}`} />
                    <span>{tch.name}</span>
                    <span className="text-[10px] opacity-75">({tch.assignedGrades.join(',')})</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => setIsEditingConfig(!isEditingConfig)}
            className="px-3.5 py-2 border border-stone-300 text-stone-700 bg-white hover:bg-stone-50 rounded-xl text-xs sm:text-sm font-semibold transition-colors flex items-center gap-1.5"
          >
            <Sliders className="w-4 h-4 text-stone-500" />
            <span>{isEditingConfig ? 'Hide Settings' : t.btnEdit}</span>
          </button>
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="px-4 py-2 bg-amber-700 hover:bg-amber-800 text-white rounded-xl text-xs sm:text-sm font-semibold transition-colors shadow-xs flex items-center gap-1.5 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
            <span>{isGenerating ? 'Planning schedule...' : t.btnRegenerate}</span>
          </button>
        </div>
      </div>

      {/* Configuration Selector Panel (Collapsible or always visible when editing) */}
      {isEditingConfig && (
        <div className="bg-white p-5 rounded-2xl border border-amber-200 shadow-sm animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-4">
            <h2 className="text-sm font-bold text-stone-900 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-amber-700" />
              <span>Timetable Parameters</span>
            </h2>
            <span className="text-xs text-stone-500">Configure multi-grade classroom constraints</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Grades Selection */}
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                {t.lblGrades}
              </label>
              <div className="flex flex-wrap gap-2">
                {(['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5'] as GradeLevel[]).map(g => {
                  const isChecked = selectedGrades.includes(g);
                  return (
                    <button
                      key={g}
                      type="button"
                      onClick={() => toggleGrade(g)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                        isChecked
                          ? 'bg-amber-100 text-amber-900 border-amber-300 shadow-2xs'
                          : 'bg-stone-50 text-stone-500 border-stone-200 hover:border-stone-300'
                      }`}
                    >
                      {isChecked ? '✓ ' : '+ '}
                      {g}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Period Count & Duration */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                  {t.lblPeriodCount}
                </label>
                <select
                  value={periodCount}
                  onChange={e => setPeriodCount(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs font-semibold bg-white focus:outline-none focus:ring-2 focus:ring-amber-600"
                >
                  <option value={4}>4 Periods (Half day)</option>
                  <option value={5}>5 Periods</option>
                  <option value={6}>6 Periods (Full day)</option>
                  <option value={7}>7 Periods</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                  {t.lblPeriodDuration}
                </label>
                <select
                  value={periodDurationMin}
                  onChange={e => setPeriodDurationMin(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs font-semibold bg-white focus:outline-none focus:ring-2 focus:ring-amber-600"
                >
                  <option value={30}>30 min</option>
                  <option value={40}>40 min (Standard)</option>
                  <option value={45}>45 min</option>
                  <option value={50}>50 min</option>
                </select>
              </div>
            </div>

            {/* Teacher Availability */}
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                {t.lblTeacherAvailability}
              </label>
              <div className="px-3 py-2.5 bg-stone-50 rounded-lg border border-stone-200 text-xs text-stone-700 font-medium flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>{t.teacherFullDay}</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-stone-100 flex justify-end">
            <button
              onClick={handleGenerate}
              className="px-5 py-2 bg-amber-700 hover:bg-amber-800 text-white rounded-lg text-xs font-bold transition-all shadow-xs flex items-center gap-2"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-200" />
              <span>{t.btnGenerateTimetable}</span>
            </button>
          </div>
        </div>
      )}

      {/* Explainability Panel (Section 14: Why this schedule?) */}
      {timetable && (
        <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-200/80 text-amber-900 flex items-center justify-center shrink-0 mt-0.5">
              <Info className="w-5 h-5 text-amber-800" />
            </div>
            <div>
              <h2 className="text-xs font-bold text-amber-900 uppercase tracking-wider">
                {t.whyThisSchedule}
              </h2>
              <p className="text-xs sm:text-sm text-amber-950 mt-1 leading-relaxed">
                {language === 'kn' ? timetable.rationaleKn : timetable.rationale}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
            <button
              onClick={() => acceptTimetable(timetable.id)}
              className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-colors shadow-xs flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{t.btnAcceptTimetable}</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Multi-Grade Matrix Table (Section 13) */}
      {timetable && (
        <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-base font-bold text-stone-900">
                {language === 'kn' ? 'ಬಹು-ತರಗತಿ ವೇಳಾಪಟ್ಟಿ ಕೋಷ್ಟಕ' : 'Multi-Grade Classroom Timetable Matrix'}
              </h2>
              <p className="text-xs text-stone-500">
                {timetable.config.periodCount} Periods • {timetable.config.periodDurationMin} min duration • Recess after Period 2
              </p>
            </div>

            {/* Legend */}
            <div className="flex items-center gap-3 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-amber-200 border border-amber-400"></span>
                <span className="font-semibold text-stone-800">{t.typeTeacherLed}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-stone-100 border border-stone-300"></span>
                <span className="text-stone-600">{t.typeIndependent}</span>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-stone-50 text-stone-700 uppercase tracking-wider text-[11px] border-b border-stone-200">
                <tr>
                  <th className="py-3 px-3 sm:px-4 font-bold w-28 sm:w-32">{t.colTime}</th>
                  <th className="py-3 px-3 sm:px-4 font-bold text-amber-900 bg-amber-100/60 w-44 sm:w-52">
                    {t.colTeacherLed}
                  </th>
                  {timetable.config.grades.map(grade => (
                    <th key={grade} className="py-3 px-3 sm:px-4 font-bold text-stone-800 min-w-[140px]">
                      {grade}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 font-sans">
                {timetable.periods.map(period => (
                  <tr key={period.periodNumber} className="hover:bg-stone-50/50 transition-colors">
                    {/* Time slot */}
                    <td className="py-3.5 px-3 sm:px-4 font-mono text-xs font-semibold text-stone-700 whitespace-nowrap align-top">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-stone-400" />
                        <span>{period.timeSlot}</span>
                      </div>
                      <div className="text-[10px] text-stone-400 font-sans mt-0.5">
                        Period {period.periodNumber}
                      </div>
                    </td>

                    {/* Teacher-led Direct Instruction */}
                    <td className="py-3.5 px-3 sm:px-4 bg-amber-50/70 border-l border-r border-amber-200/60 align-top">
                      <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-300/60 text-amber-950 font-bold text-xs mb-1">
                        <UserCheck className="w-3 h-3 text-amber-800" />
                        <span>{period.teacherLedGrade}</span>
                      </div>
                      <div className="font-bold text-stone-900 text-xs sm:text-sm">
                        {period.teacherLedSubject}
                      </div>
                      <div className="text-xs text-amber-900 mt-0.5 font-medium">
                        {language === 'kn' ? period.teacherLedTopicKn : period.teacherLedTopic}
                      </div>
                    </td>

                    {/* All Grades Activity Columns */}
                    {timetable.config.grades.map(grade => {
                      const activity = period.gradeActivities[grade];
                      const isTeacherLed = grade === period.teacherLedGrade;

                      if (isTeacherLed) {
                        return (
                          <td key={grade} className="py-3.5 px-3 sm:px-4 bg-amber-50/90 align-top border-l border-r border-amber-200">
                            <div className="p-2 rounded-lg bg-amber-100/90 border border-amber-300">
                              <div className="text-[11px] font-extrabold text-amber-950 flex items-center gap-1">
                                <UserCheck className="w-3.5 h-3.5 text-amber-800" />
                                <span>{t.typeTeacherLed}</span>
                              </div>
                              <div className="text-xs font-semibold text-stone-900 mt-0.5">
                                {period.teacherLedSubject}
                              </div>
                              <div className="text-[11px] text-amber-900 line-clamp-2">
                                {language === 'kn' ? period.teacherLedTopicKn : period.teacherLedTopic}
                              </div>
                            </div>
                          </td>
                        );
                      }

                      return (
                        <td key={grade} className="py-3.5 px-3 sm:px-4 align-top">
                          <div className="p-2 rounded-lg bg-stone-50 border border-stone-200">
                            <div className="flex items-center justify-between mb-0.5">
                              <span className="text-[10px] font-semibold text-stone-500 uppercase">
                                {activity?.type || 'Independent'}
                              </span>
                              <span className="text-[10px] text-stone-400">
                                {activity?.subject}
                              </span>
                            </div>
                            <div className="text-xs font-medium text-stone-800 line-clamp-2">
                              {language === 'kn' ? activity?.activityKn : activity?.activity}
                            </div>
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Low-resource Classroom Guarantee */}
      <div className="p-4 rounded-xl bg-stone-100 border border-stone-200 text-xs text-stone-600 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
          <span>
            {language === 'kn'
              ? 'ಶಿಕ್ಷಕರ ಸಂಘರ್ಷ-ಮುಕ್ತ ಗ್ಯಾರಂಟಿ: ಯಾವುದೇ ಅವಧಿಯಲ್ಲಿ ಶಿಕ್ಷಕರು ಒಂದಕ್ಕಿಂತ ಹೆಚ್ಚು ತರಗತಿಗೆ ಏಕಕಾಲದಲ್ಲಿ ನಿಯೋಜಿತರಾಗುವುದಿಲ್ಲ.'
              : 'Zero Teacher Conflicts Guarantee: The teacher is never assigned to two grades simultaneously.'}
          </span>
        </div>
        <span className="text-stone-400 text-[11px] hidden sm:inline">RuralClass Timetable Engine v1.0</span>
      </div>
    </div>
  );
};
