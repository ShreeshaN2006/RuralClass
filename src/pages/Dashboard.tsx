import React from 'react';
import { useApp } from '../context/AppContext';
import { TRANSLATIONS } from '../utils/translations';
import { StatusBadge } from '../components/StatusBadge';
import {
  Calendar,
  Users,
  AlertTriangle,
  BookOpen,
  ArrowRight,
  Clock,
  Sparkles,
  HeartHandshake,
  CheckCircle2,
  TrendingUp,
  School as SchoolIcon,
  PlusCircle,
  PlayCircle,
  UserCheck,
  Scale,
  FileText,
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const {
    teacher,
    school,
    students,
    timetable,
    language,
    setCurrentView,
    openAssessmentModal,
    openParentSummary,
    openBalanceModal,
    classroomBalance,
    pendingSuggestions,
    activeInterventions,
    supportRequests,
  } = useApp();

  const t = TRANSLATIONS[language];

  // Calculate metrics
  const totalStudents = students.length;
  const learnersNeedingFollowup = students.filter(
    s => s.overallStatus === 'Needs support' || s.overallStatus === 'Follow-up'
  );
  const periodsToday = timetable ? timetable.periods.length : 5;

  const followUpStudents = students
    .filter(s => s.overallStatus === 'Needs support' || s.overallStatus === 'Follow-up' || s.id === 'st_meena')
    .slice(0, 6);

  const activeSupportRequest = supportRequests.find(r => r.status === 'requested');

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-amber-700 via-amber-800 to-stone-900 rounded-2xl p-6 sm:p-7 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-600/60 text-amber-100 text-xs font-semibold border border-amber-500/40">
              <SchoolIcon className="w-3.5 h-3.5" />
              <span>{language === 'kn' ? school.nameKn : school.name}</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-900/60 text-amber-200 text-xs font-medium border border-amber-500/30">
              <span>{language === 'kn' ? teacher.roleKn : teacher.role}</span>
              <span>•</span>
              <span>Grades {teacher.assignedGrades.join(', ')}</span>
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            {language === 'kn'
              ? `ಶುಭೋದಯ, ${teacher.nameKn} 👋`
              : `Good morning, ${teacher.name.split(' ')[0]} 👋`}
          </h1>
          <p className="text-sm sm:text-base text-amber-100/90 mt-1 leading-relaxed">
            {t.greetingSub}
          </p>
        </div>

        {/* Ambient subtle icon */}
        <div className="absolute right-4 -bottom-6 opacity-10 text-white pointer-events-none hidden sm:block">
          <BookOpen className="w-48 h-48" />
        </div>
      </div>

      {/* Potential Support Opportunity Notification Alert (Section 13) */}
      {activeSupportRequest && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-200 text-amber-900 flex items-center justify-center shrink-0 mt-0.5">
              <HeartHandshake className="w-5 h-5 text-amber-800" />
            </div>
            <div>
              <div className="text-xs font-bold text-amber-950 uppercase tracking-wider flex items-center gap-1.5">
                <span>{t.potentialSupportOpp}</span>
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
              </div>
              <p className="text-xs text-stone-700 mt-0.5">
                <strong>{activeSupportRequest.requesterTeacherName}</strong> needs support for{' '}
                <strong>{activeSupportRequest.grade} {activeSupportRequest.subject}</strong> ({activeSupportRequest.topic}).{' '}
                <strong>{activeSupportRequest.supportingTeacherName}</strong> could support for one available period.
              </p>
            </div>
          </div>
          <button
            onClick={() => setCurrentView('teacherSupport')}
            className="px-3.5 py-1.5 bg-amber-700 hover:bg-amber-800 text-white rounded-xl text-xs font-bold transition-all shadow-2xs flex items-center gap-1 self-start sm:self-auto shrink-0"
          >
            <span>Review Request</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Primary Summary Stat Cards (Section 9 & 10) */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        {/* Today's Classes */}
        <div
          onClick={() => setCurrentView('todaysClassroom')}
          className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs flex flex-col justify-between cursor-pointer hover:border-amber-300 transition-all"
        >
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-600">
              {t.statTodayClasses}
            </span>
            <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
              <Calendar className="w-3.5 h-3.5" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-stone-900">
              {periodsToday} <span className="text-xs font-normal text-stone-500">periods</span>
            </div>
            <div className="text-[11px] text-emerald-700 mt-1 font-semibold flex items-center gap-1">
              <span>Live Teaching Mode →</span>
            </div>
          </div>
        </div>

        {/* Grades Managed */}
        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-600">
              {t.statGrades}
            </span>
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
              <BookOpen className="w-3.5 h-3.5" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-stone-900">
              Grades 1–{school.grades.length}
            </div>
            <div className="text-[11px] text-stone-500 mt-1">Multi-grade classroom</div>
          </div>
        </div>

        {/* Students */}
        <div
          onClick={() => setCurrentView('students')}
          className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs flex flex-col justify-between cursor-pointer hover:border-amber-300 transition-all"
        >
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-600">
              {t.statStudents}
            </span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Users className="w-3.5 h-3.5" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-stone-900">
              {totalStudents} <span className="text-xs font-normal text-stone-500">enrolled</span>
            </div>
            <div className="text-[11px] text-stone-500 mt-1">92% average attendance</div>
          </div>
        </div>

        {/* Follow-up Needed */}
        <div
          onClick={() => setCurrentView('interventions')}
          className="bg-white p-4 rounded-2xl border border-amber-300 bg-amber-50/30 shadow-xs flex flex-col justify-between cursor-pointer hover:border-amber-400 transition-all"
        >
          <div className="flex items-center justify-between text-amber-800 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-900">
              {t.statFollowupNeeded}
            </span>
            <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center">
              <AlertTriangle className="w-3.5 h-3.5" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-amber-950">
              {learnersNeedingFollowup.length}{' '}
              <span className="text-xs font-semibold text-amber-800">learners</span>
            </div>
            <div className="text-[11px] text-amber-800 mt-1">
              {pendingSuggestions.length} suggestions ready
            </div>
          </div>
        </div>

        {/* Classroom Balance Score (Section 10) */}
        <div
          onClick={openBalanceModal}
          className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs flex flex-col justify-between cursor-pointer hover:border-amber-400 hover:bg-stone-50/50 transition-all col-span-2 lg:col-span-1"
        >
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-700">
              {t.statClassroomBalance}
            </span>
            <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center">
              <Scale className="w-3.5 h-3.5" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-extrabold text-stone-900">
              {classroomBalance.overallScore}%
            </div>
            <div className="text-[11px] text-purple-700 font-semibold mt-1 flex items-center gap-1">
              <span>View Analysis →</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions (Section 11 & Updated Flow) */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-xs">
        <h2 className="text-xs font-bold text-stone-600 uppercase tracking-wider mb-3">
          {t.quickActions}
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
          <button
            onClick={() => setCurrentView('todaysClassroom')}
            className="p-3 rounded-xl border border-stone-200 hover:border-amber-400 hover:bg-amber-50/50 text-left transition-all group flex flex-col gap-1.5"
          >
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center group-hover:scale-105 transition-transform">
              <PlayCircle className="w-4 h-4" />
            </div>
            <span className="text-xs sm:text-sm font-semibold text-stone-900">
              {t.actionTodaysClassroom}
            </span>
            <span className="text-[11px] text-stone-500">Live multi-grade teaching</span>
          </button>

          <button
            onClick={() => setCurrentView('lessonPlanner')}
            className="p-3 rounded-xl border border-stone-200 hover:border-amber-400 hover:bg-amber-50/50 text-left transition-all group flex flex-col gap-1.5"
          >
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center group-hover:scale-105 transition-transform">
              <BookOpen className="w-4 h-4" />
            </div>
            <span className="text-xs sm:text-sm font-semibold text-stone-900">
              {t.actionCreateLessonPlan}
            </span>
            <span className="text-[11px] text-stone-500">Structured rural lessons</span>
          </button>

          <button
            onClick={() => setCurrentView('attendance')}
            className="p-3 rounded-xl border border-stone-200 hover:border-amber-400 hover:bg-amber-50/50 text-left transition-all group flex flex-col gap-1.5"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center group-hover:scale-105 transition-transform">
              <UserCheck className="w-4 h-4" />
            </div>
            <span className="text-xs sm:text-sm font-semibold text-stone-900">
              {t.actionAttendance}
            </span>
            <span className="text-[11px] text-stone-500">Quick daily check</span>
          </button>

          <button
            onClick={() => setCurrentView('teacherSupport')}
            className="p-3 rounded-xl border border-stone-200 hover:border-amber-400 hover:bg-amber-50/50 text-left transition-all group flex flex-col gap-1.5"
          >
            <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-800 flex items-center justify-center group-hover:scale-105 transition-transform">
              <HeartHandshake className="w-4 h-4" />
            </div>
            <span className="text-xs sm:text-sm font-semibold text-stone-900">
              {t.actionTeacherSupport}
            </span>
            <span className="text-[11px] text-stone-500">Share teaching capacity</span>
          </button>
        </div>
      </div>

      {/* Today's Teaching Plan (Section 9) */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-stone-900 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-amber-700" />
              <span>{t.todayTeachingPlan}</span>
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              {t.todayTeachingPlanSub}
            </p>
          </div>
          <button
            onClick={() => setCurrentView('timetable')}
            className="text-xs font-semibold text-amber-800 hover:text-amber-900 hover:underline flex items-center gap-1 self-start sm:self-auto"
          >
            <span>View Full Schedule</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-stone-50 text-stone-600 text-xs uppercase tracking-wider border-b border-stone-200">
              <tr>
                <th className="py-3 px-4 font-semibold w-32">{t.colTime}</th>
                <th className="py-3 px-4 font-semibold text-amber-900 bg-amber-50/80">
                  {t.typeTeacherLed} (Direct Instruction)
                </th>
                <th className="py-3 px-4 font-semibold">{t.typeIndependent} (Other Grades)</th>
                <th className="py-3 px-4 font-semibold text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {timetable?.periods.slice(0, 5).map((period) => {
                const otherGradesActivities = Object.entries(period.gradeActivities)
                  .filter(([grade]) => grade !== period.teacherLedGrade)
                  .map(([grade, act]) => `${grade}: ${act.activity}`)
                  .slice(0, 3)
                  .join(' • ');

                return (
                  <tr key={period.periodNumber} className="hover:bg-stone-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-mono text-xs font-semibold text-stone-700">
                      {period.timeSlot}
                    </td>
                    <td className="py-3.5 px-4 bg-amber-50/40 border-l border-r border-amber-100">
                      <div className="font-bold text-stone-900 flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-amber-200/70 text-amber-900 text-xs font-bold">
                          {period.teacherLedGrade}
                        </span>
                        <span>
                          {period.teacherLedSubject} —{' '}
                          {language === 'kn' ? period.teacherLedTopicKn : period.teacherLedTopic}
                        </span>
                        {period.teacherSupportSession?.isSupportClass && (
                          <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-900 text-[10px] font-bold">
                            Teacher Support
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-amber-800 mt-0.5 font-medium">
                        {language === 'kn' ? 'ಕಪ್ಪುಹಲಗೆ ಮತ್ತು ನೇರ ವಿವರಣೆ' : 'Direct teacher guidance at blackboard'}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-xs text-stone-600">
                      <div className="line-clamp-2">
                        {otherGradesActivities}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <StatusBadge status={period.status} size="sm" />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Learners Needing Follow-up (Section 10 with Parent Summary Button) */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-stone-900 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              <span>{t.learnersNeedingFollowup}</span>
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              {t.learnersNeedingFollowupSub}
            </p>
          </div>
          <button
            onClick={() => setCurrentView('interventions')}
            className="text-xs font-semibold text-amber-800 hover:text-amber-900 hover:underline flex items-center gap-1 self-start sm:self-auto"
          >
            <span>{t.actionViewInterventions}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-stone-50 text-stone-600 text-xs uppercase tracking-wider border-b border-stone-200">
              <tr>
                <th className="py-3 px-4 font-semibold">{t.colStudent}</th>
                <th className="py-3 px-4 font-semibold">{t.colGrade}</th>
                <th className="py-3 px-4 font-semibold">Area / Topic</th>
                <th className="py-3 px-4 font-semibold">Learning Status</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {followUpStudents.map(student => {
                const lowSubj = student.subjects.find(s => s.status === 'Needs support') || student.subjects[0];
                return (
                  <tr key={student.id} className="hover:bg-stone-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-stone-900">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-stone-200 text-stone-700 flex items-center justify-center text-xs font-bold">
                          {student.name.charAt(0)}
                        </div>
                        <span>{language === 'kn' ? student.nameKn : student.name}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-xs text-stone-700 font-medium">
                      {student.grade}
                    </td>
                    <td className="py-3.5 px-4 text-xs text-stone-600">
                      <span className="font-medium text-stone-800">{lowSubj.subject}</span>
                      <span className="text-stone-400 ml-1">({lowSubj.averageScore}%)</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={student.overallStatus} size="sm" />
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openParentSummary(student.id)}
                          className="text-xs font-semibold text-stone-600 hover:text-stone-900 hover:bg-stone-100 px-2 py-1 rounded-lg border border-stone-200 transition-colors inline-flex items-center gap-1"
                        >
                          <FileText className="w-3 h-3 text-stone-500" />
                          <span>{t.btnGenerateParentSummary}</span>
                        </button>
                        <button
                          onClick={() => setCurrentView('studentProfile', student.id)}
                          className="text-xs font-semibold text-amber-700 hover:text-amber-900 hover:bg-amber-50 px-2.5 py-1 rounded-lg border border-transparent hover:border-amber-200 transition-colors inline-flex items-center gap-1"
                        >
                          <span>{t.viewDetails}</span>
                        </button>
                      </div>
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
