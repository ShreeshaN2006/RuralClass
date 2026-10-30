import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TRANSLATIONS } from '../utils/translations';
import { StatusBadge } from '../components/StatusBadge';
import {
  Clock,
  Play,
  CheckCircle2,
  AlertCircle,
  Calendar,
  BookOpen,
  Users,
  UserCheck,
  RotateCcw,
  Sparkles,
  ArrowRight,
  MessageSquare,
  HelpCircle,
} from 'lucide-react';

export const TodaysClassroomPage: React.FC = () => {
  const {
    timetable,
    activeClassroomPeriodNumber,
    setActiveClassroomPeriodNumber,
    startClassroomPeriod,
    completeClassroomPeriod,
    rescheduleClassroomPeriod,
    openQuickAssessmentModal,
    students,
    language,
    showToast,
  } = useApp();

  const t = TRANSLATIONS[language];

  // Selected period to view/manage
  const periods = timetable?.periods || [];
  const activePeriod = periods.find(p => p.periodNumber === activeClassroomPeriodNumber) || periods[0];

  // Completion modal/form state
  const [isCompleting, setIsCompleting] = useState(false);
  const [completionStatus, setCompletionStatus] = useState<'Completed' | 'Partially completed' | 'Rescheduled'>('Completed');
  const [teacherNote, setTeacherNote] = useState('');
  const [targetReschedulePeriod, setTargetReschedulePeriod] = useState<number>(5);

  if (!activePeriod) {
    return (
      <div className="p-8 text-center bg-white rounded-2xl border border-stone-200">
        <p className="text-sm font-semibold text-stone-700">No active timetable loaded for today.</p>
      </div>
    );
  }

  const isClassInProgress = activePeriod.status === 'In progress';
  const isClassCompleted = activePeriod.status === 'Completed';

  const handleStart = () => {
    startClassroomPeriod(activePeriod.periodNumber);
  };

  const handleFinishSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (completionStatus === 'Rescheduled') {
      rescheduleClassroomPeriod(activePeriod.periodNumber, targetReschedulePeriod);
    } else {
      completeClassroomPeriod(activePeriod.periodNumber, completionStatus, teacherNote);
    }
    setIsCompleting(false);
    setTeacherNote('');
  };

  // Find a student from the teacher-led grade for quick assessment
  const teacherLedGradeStudents = students.filter(s => s.grade === activePeriod.teacherLedGrade);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-stone-900 tracking-tight flex items-center gap-2">
            <span>{t.todaysClassroomTitle}</span>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
              isClassInProgress
                ? 'bg-amber-100 text-amber-900 border border-amber-300 animate-pulse'
                : 'bg-stone-200 text-stone-800'
            }`}>
              {activePeriod.status}
            </span>
          </h1>
          <p className="text-sm text-stone-600 mt-1">
            {t.todaysClassroomSub}
          </p>
        </div>

        {/* Start / Complete Action buttons */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          {!isClassInProgress && !isClassCompleted && (
            <button
              onClick={handleStart}
              className="px-5 py-2.5 bg-amber-700 hover:bg-amber-800 text-white rounded-xl text-xs sm:text-sm font-bold shadow-sm transition-all flex items-center gap-2"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>{t.btnStartClass}</span>
            </button>
          )}

          {isClassInProgress && (
            <button
              onClick={() => setIsCompleting(true)}
              className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs sm:text-sm font-bold shadow-sm transition-all flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{t.btnCompleteClass}</span>
            </button>
          )}

          {isClassCompleted && (
            <div className="flex items-center gap-2">
              <span className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Lesson Completed
              </span>
              <button
                onClick={() => setIsCompleting(true)}
                className="px-3 py-1.5 border border-stone-300 text-stone-700 hover:bg-stone-50 rounded-lg text-xs font-semibold"
              >
                Edit Outcome
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Period Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {periods.map(p => {
          const isSelected = p.periodNumber === activeClassroomPeriodNumber;
          return (
            <button
              key={p.periodNumber}
              onClick={() => setActiveClassroomPeriodNumber(p.periodNumber)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-2 border ${
                isSelected
                  ? 'bg-stone-900 text-white border-stone-900 shadow-sm'
                  : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
              }`}
            >
              <span>Period {p.periodNumber}</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded font-normal font-mono ${
                isSelected ? 'bg-stone-800 text-stone-300' : 'bg-stone-100 text-stone-500'
              }`}>
                {p.timeSlot}
              </span>
              {p.status === 'In progress' && (
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
              )}
            </button>
          );
        })}
      </div>

      {/* Main Classroom Action Card */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
        {/* Banner with Direct Instruction & Time */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-stone-900 to-amber-950 text-white">
          <div className="flex items-center justify-between gap-3 mb-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono bg-amber-500 text-stone-950 font-bold px-2 py-0.5 rounded">
                Period {activePeriod.periodNumber}
              </span>
              <span className="text-xs text-amber-200 font-mono flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {activePeriod.timeSlot}
              </span>
            </div>
            <StatusBadge status={activePeriod.status} size="sm" />
          </div>

          <div className="mt-3">
            <div className="text-xs uppercase font-bold text-amber-300 tracking-wider">
              {t.typeTeacherLed} (Direct Instruction)
            </div>
            <h2 className="text-2xl font-extrabold text-white mt-1">
              {activePeriod.teacherLedGrade} — {activePeriod.teacherLedSubject}
            </h2>
            <p className="text-sm text-stone-200 mt-1">
              Topic: <strong>{language === 'kn' ? activePeriod.teacherLedTopicKn : activePeriod.teacherLedTopic}</strong>
            </p>
          </div>
        </div>

        {/* Live Multi-Grade Action Board */}
        <div className="p-5 sm:p-6 space-y-6">
          {/* Section 1: Teacher-led Instruction Plan */}
          <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-amber-800" />
                <h3 className="text-xs font-bold text-amber-950 uppercase tracking-wider">
                  Teacher-Led Classroom Station ({activePeriod.teacherLedGrade})
                </h3>
              </div>
              <span className="text-xs text-amber-800 font-medium">Direct Attention</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-white rounded-lg border border-amber-200">
                <strong className="block text-stone-900 font-bold mb-1">Lesson Objective:</strong>
                <span className="text-stone-600">
                  Explain core concept on blackboard, solve 2 sample problems, and check student slates.
                </span>
              </div>

              <div className="p-3 bg-white rounded-lg border border-amber-200">
                <strong className="block text-stone-900 font-bold mb-1">Materials Required:</strong>
                <span className="text-stone-600">
                  Blackboard, Chalk, Student notebooks, Tamarind seeds / local objects.
                </span>
              </div>

              <div className="p-3 bg-white rounded-lg border border-amber-200 flex flex-col justify-between">
                <div>
                  <strong className="block text-stone-900 font-bold mb-1">Quick Assessment:</strong>
                  <span className="text-stone-600">Check exit understanding for 1-2 students.</span>
                </div>
                {teacherLedGradeStudents[0] && (
                  <button
                    onClick={() => openQuickAssessmentModal(teacherLedGradeStudents[0].id)}
                    className="mt-2 text-xs font-bold text-amber-800 hover:text-amber-950 hover:underline flex items-center gap-1"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    <span>Assess {teacherLedGradeStudents[0].name}</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Section 2: Other Grades Simultaneous Independent / Group Work (Section 1) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-1 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-stone-600" />
                <h3 className="text-xs font-bold text-stone-800 uppercase tracking-wider">
                  Simultaneous Independent & Group Stations (Other Grades)
                </h3>
              </div>
              <span className="text-xs text-stone-500">Autonomous low-resource tasks</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {Object.entries(activePeriod.gradeActivities)
                .filter(([grade]) => grade !== activePeriod.teacherLedGrade)
                .map(([grade, act]) => (
                  <div
                    key={grade}
                    className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 flex flex-col justify-between hover:bg-stone-100/60 transition-colors"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-xs text-stone-900">{grade}</span>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          act.type === 'Peer'
                            ? 'bg-teal-50 text-teal-800 border border-teal-200'
                            : act.type === 'Group'
                            ? 'bg-indigo-50 text-indigo-800 border border-indigo-200'
                            : 'bg-stone-200/70 text-stone-800'
                        }`}>
                          {act.type}
                        </span>
                      </div>
                      <div className="text-[11px] font-semibold text-stone-600">{act.subject}</div>
                      <p className="text-xs text-stone-800 mt-1 leading-snug">
                        {language === 'kn' ? act.activityKn : act.activity}
                      </p>
                    </div>

                    <div className="mt-3 pt-2 border-t border-stone-200/60 text-[10px] text-stone-400">
                      Self-managed with slate / notebook
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>

      {/* Complete Class Recording Modal (Section 1) */}
      {isCompleting && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5"
        >
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-stone-200">
            <h3 className="text-base font-bold text-stone-900 mb-1">
              Record Outcome: Period {activePeriod.periodNumber}
            </h3>
            <p className="text-xs text-stone-500 mb-4">
              {activePeriod.teacherLedGrade} — {activePeriod.teacherLedSubject}
            </p>

            <form onSubmit={handleFinishSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                  {t.lblSelectPeriodStatus}
                </label>
                <div className="space-y-2">
                  {[
                    { val: 'Completed', label: 'Lesson Completed', desc: 'All concepts and practice finished' },
                    { val: 'Partially completed', label: 'Partially Completed', desc: 'Concept taught, practice remaining' },
                    { val: 'Rescheduled', label: 'Not Completed (Move to another period)', desc: 'Needs full re-teaching slot' },
                  ].map(item => (
                    <label
                      key={item.val}
                      className={`flex items-start gap-2.5 p-3 rounded-xl border cursor-pointer transition-all ${
                        completionStatus === item.val
                          ? 'bg-amber-50 border-amber-500 ring-1 ring-amber-500'
                          : 'bg-stone-50 border-stone-200 hover:bg-stone-100'
                      }`}
                    >
                      <input
                        type="radio"
                        name="completionStatus"
                        value={item.val}
                        checked={completionStatus === item.val}
                        onChange={() => setCompletionStatus(item.val as any)}
                        className="mt-0.5 text-amber-600 focus:ring-amber-500"
                      />
                      <div>
                        <div className="text-xs font-bold text-stone-900">{item.label}</div>
                        <div className="text-[11px] text-stone-500">{item.desc}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Reschedule Target Period if selected */}
              {completionStatus === 'Rescheduled' && (
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200">
                  <label className="block text-xs font-bold text-amber-950 uppercase tracking-wider mb-1">
                    Select Target Period:
                  </label>
                  <select
                    value={targetReschedulePeriod}
                    onChange={e => setTargetReschedulePeriod(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs bg-white font-semibold"
                  >
                    {periods
                      .filter(p => p.periodNumber !== activePeriod.periodNumber)
                      .map(p => (
                        <option key={p.periodNumber} value={p.periodNumber}>
                          Period {p.periodNumber} ({p.timeSlot})
                        </option>
                      ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  {t.lblTeacherNotesThisClass}
                </label>
                <textarea
                  rows={2}
                  value={teacherNote}
                  onChange={e => setTeacherNote(e.target.value)}
                  placeholder="e.g. Students grasped addition with tamarind seeds quickly; Grade 1 was very quiet with tracing."
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-amber-600 resize-none"
                />
              </div>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCompleting(false)}
                  className="px-3.5 py-2 border border-stone-300 text-stone-700 hover:bg-stone-50 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-700 hover:bg-amber-800 text-white rounded-xl text-xs font-bold shadow-xs"
                >
                  Confirm & Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
