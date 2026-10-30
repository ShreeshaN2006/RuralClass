import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TRANSLATIONS } from '../utils/translations';
import { GradeLevel, Subject, Teacher } from '../types';
import {
  HeartHandshake,
  UserCheck,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Plus,
  AlertCircle,
  HelpCircle,
  BookOpen,
  Calendar,
  X,
  Play,
  User,
  GraduationCap,
  Award,
} from 'lucide-react';

export const TeacherSupportPage: React.FC = () => {
  const {
    teacher,
    allTeachers,
    supportRequests,
    createSupportRequest,
    acceptSupportRequest,
    declineSupportRequest,
    approveSupportRequestCoordinator,
    startSupportClass,
    completeSupportClass,
    switchTeacher,
    language,
    school,
  } = useApp();

  const t = TRANSLATIONS[language];

  // Teachers in the current school
  const schoolTeachers = allTeachers.filter(tch => tch.schoolId === school.id);

  // Request form state
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [reqTeacherId, setReqTeacherId] = useState<string>(teacher.id);
  const [reqGrade, setReqGrade] = useState<GradeLevel>('Grade 4');
  const [reqSubject, setReqSubject] = useState<Subject>('Mathematics');
  const [reqTopic, setReqTopic] = useState('Multiplication with Carrying');
  const [reqLessonsPending, setReqLessonsPending] = useState(3);
  const [reqPreferredDate, setReqPreferredDate] = useState('Wednesday');
  const [reqPreferredPeriod, setReqPreferredPeriod] = useState('Period 4');
  const [reqReason, setReqReason] = useState('Need additional teaching time to complete the current multi-digit multiplication unit.');
  
  // Available colleagues for support (excluding the requester)
  const defaultSupportingColleague = schoolTeachers.find(tch => tch.id !== reqTeacherId) || schoolTeachers[0];
  const [selectedSupportingTeacherId, setSelectedSupportingTeacherId] = useState<string>(
    defaultSupportingColleague?.id || ''
  );

  // Calculate syllabus distribution across this school
  const sortedByCompletion = [...schoolTeachers].sort((a, b) => a.syllabusCompletion - b.syllabusCompletion);
  const lowestTeacher: Teacher | undefined = sortedByCompletion[0];
  const highestTeacher: Teacher | undefined = sortedByCompletion[sortedByCompletion.length - 1];

  const handleOpenRequestModal = (targetSupportingId?: string) => {
    setReqTeacherId(teacher.id);
    if (targetSupportingId) {
      setSelectedSupportingTeacherId(targetSupportingId);
    } else {
      const colleague = schoolTeachers.find(tch => tch.id !== teacher.id);
      setSelectedSupportingTeacherId(colleague ? colleague.id : teacher.id);
    }
    setIsRequestModalOpen(true);
  };

  const handleCreateRequest = (e: React.FormEvent) => {
    e.preventDefault();
    const reqTeacher = schoolTeachers.find(tch => tch.id === reqTeacherId) || teacher;
    const supTeacher = schoolTeachers.find(tch => tch.id === selectedSupportingTeacherId) || schoolTeachers.find(tch => tch.id !== reqTeacher.id) || reqTeacher;
    
    createSupportRequest({
      requesterTeacherId: reqTeacher.id,
      requesterTeacherName: reqTeacher.name,
      supportingTeacherId: supTeacher.id,
      supportingTeacherName: supTeacher.name,
      grade: reqGrade,
      subject: reqSubject,
      topic: reqTopic,
      lessonsPending: Number(reqLessonsPending),
      preferredDate: reqPreferredDate,
      preferredPeriod: reqPreferredPeriod,
      reason: reqReason,
    });
    setIsRequestModalOpen(false);
  };

  const activeRequest = supportRequests.find(r => r.status !== 'completed' && r.status !== 'declined');
  const completedHistory = supportRequests.filter(r => r.status === 'completed');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-stone-900 tracking-tight flex items-center gap-2">
            <HeartHandshake className="w-6 h-6 text-amber-700" />
            <span>{t.teacherSupportTitle}</span>
          </h1>
          <p className="text-sm text-stone-600 mt-1">
            {t.teacherSupportSub} • <span className="font-semibold text-stone-800">{schoolTeachers.length} teachers assigned to {school.name}</span>
          </p>
        </div>

        <button
          onClick={() => handleOpenRequestModal()}
          className="px-4 py-2 bg-amber-700 hover:bg-amber-800 text-white rounded-xl text-xs sm:text-sm font-semibold transition-colors shadow-xs flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{t.btnRequestSupport}</span>
        </button>
      </div>

      {/* Potential Support Opportunity Banner (Section 13) */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-300 rounded-2xl p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-200 text-amber-900 flex items-center justify-center shrink-0 mt-0.5">
              <Sparkles className="w-5 h-5 text-amber-800" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-200/80 text-amber-950 text-[11px] font-bold uppercase tracking-wider mb-1">
                {t.potentialSupportOpp}
              </div>
              {lowestTeacher && highestTeacher && lowestTeacher.id !== highestTeacher.id ? (
                <>
                  <h2 className="text-base font-bold text-stone-900">
                    {lowestTeacher.name} — {lowestTeacher.specialization || 'Mathematics'} (Progress: {lowestTeacher.syllabusCompletion}%)
                  </h2>
                  <p className="text-xs text-stone-700 mt-1 leading-relaxed">
                    <strong>{highestTeacher.name}</strong> has completed {highestTeacher.syllabusCompletion}% of assigned syllabus ({highestTeacher.specialization}). 
                    {highestTeacher.name.split(' ')[0]} could support {lowestTeacher.name.split(' ')[0]} for an available rotation period this week without disrupting core timetable periods.
                  </p>
                </>
              ) : (
                <>
                  <h2 className="text-base font-bold text-stone-900">
                    {school.name} — Coordinated Multi-Grade Team
                  </h2>
                  <p className="text-xs text-stone-700 mt-1 leading-relaxed">
                    All {schoolTeachers.length} teachers are pacing evenly across assigned grades. Rotation and substitution slots remain ready on demand.
                  </p>
                </>
              )}
            </div>
          </div>

          <div className="shrink-0 self-start md:self-center">
            <button
              onClick={() => handleOpenRequestModal(highestTeacher?.id)}
              className="px-4 py-2 bg-amber-700 hover:bg-amber-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <span>{t.btnRequestSupport}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Teacher Syllabus Status Comparison (Section 12) - Dynamic across all teachers in school */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-stone-900 flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-amber-700" />
            <span>School Teaching Staff ({schoolTeachers.length} Active Teachers)</span>
          </h2>
          <span className="text-xs text-stone-500">Live syllabus coverage & grade distribution</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {schoolTeachers.map((tch) => {
            const isCurrentLoggedIn = tch.id === teacher.id;
            return (
              <div
                key={tch.id}
                className={`bg-white rounded-2xl border transition-all p-5 shadow-xs space-y-4 flex flex-col justify-between ${
                  isCurrentLoggedIn
                    ? 'border-amber-400 ring-2 ring-amber-300/40 bg-amber-50/10'
                    : 'border-stone-200 hover:border-stone-300'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between pb-3 border-b border-stone-100 gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-10 h-10 rounded-xl ${tch.avatarColor} text-white flex items-center justify-center font-bold text-sm shadow-xs shrink-0`}>
                        {tch.name.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h3 className="font-bold text-sm text-stone-900 leading-tight">
                            {tch.name}
                          </h3>
                          {isCurrentLoggedIn && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-200 text-amber-900">
                              You
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-stone-500 font-sans">
                          {tch.nameKn} • {tch.role}
                        </div>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-[10px] font-semibold text-stone-500 block uppercase tracking-wider">Syllabus</span>
                      <span className={`text-lg font-black ${
                        tch.syllabusCompletion >= 90 ? 'text-emerald-700' : tch.syllabusCompletion >= 80 ? 'text-amber-700' : 'text-rose-700'
                      }`}>
                        {tch.syllabusCompletion}%
                      </span>
                    </div>
                  </div>

                  {/* Syllabus Progress Bar */}
                  <div className="mt-3">
                    <div className="w-full bg-stone-100 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          tch.syllabusCompletion >= 90 ? 'bg-emerald-600' : tch.syllabusCompletion >= 80 ? 'bg-amber-500' : 'bg-rose-500'
                        }`}
                        style={{ width: `${tch.syllabusCompletion}%` }}
                      />
                    </div>
                    <div className="flex justify-between items-center text-[10px] text-stone-500 mt-1">
                      <span>Specialization: <strong>{tch.specialization}</strong></span>
                      <span>Assigned: <strong>Grades {tch.assignedGrades.join(', ')}</strong></span>
                    </div>
                  </div>

                  {/* Grade Breakdown */}
                  <div className="space-y-1.5 mt-3">
                    <span className="text-[10px] font-bold uppercase text-stone-500 tracking-wider">
                      Grade Level Progress
                    </span>
                    <div className="grid grid-cols-3 gap-1.5 text-center text-xs">
                      {Object.entries(tch.gradeCompletion).map(([grd, comp]) => (
                        <div key={grd} className="p-1.5 rounded-lg bg-stone-50 border border-stone-200">
                          <div className="text-[9px] text-stone-500">{grd}</div>
                          <div className={`font-bold ${comp < 80 ? 'text-amber-800' : 'text-emerald-800'}`}>{comp}%</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Subject Breakdown */}
                  <div className="space-y-1.5 text-xs mt-3">
                    <span className="text-[10px] font-bold uppercase text-stone-500 tracking-wider">
                      Subject Coverage
                    </span>
                    <div className="grid grid-cols-2 gap-1.5">
                      {Object.entries(tch.subjectCompletion).map(([subj, comp]) => (
                        <div key={subj} className="p-1.5 rounded-lg bg-stone-50 border border-stone-200 flex justify-between text-[11px]">
                          <span className="text-stone-700 truncate mr-1">{subj}:</span>
                          <span className={`font-bold shrink-0 ${comp < 80 ? 'text-amber-800' : 'text-stone-900'}`}>
                            {comp}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-2 mt-2">
                  {!isCurrentLoggedIn ? (
                    <>
                      <button
                        onClick={() => handleOpenRequestModal(tch.id)}
                        className="flex-1 py-1.5 px-2 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <HeartHandshake className="w-3.5 h-3.5 text-amber-800" />
                        <span>Request Support</span>
                      </button>
                      <button
                        onClick={() => switchTeacher(tch.id)}
                        className="py-1.5 px-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg text-xs font-medium transition-colors cursor-pointer"
                        title={`Act as ${tch.name}`}
                      >
                        Act As
                      </button>
                    </>
                  ) : (
                    <div className="w-full py-1 text-center text-xs font-semibold text-amber-800 bg-amber-100/60 rounded-lg border border-amber-200">
                      Currently logged in as {tch.name.split(' ')[0]}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Active Support Request & Multi-Step Approval Flow (Sections 14-18) */}
      {activeRequest && (
        <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
          <div className="p-4 sm:p-5 bg-gradient-to-r from-stone-900 to-amber-950 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500 text-stone-950 text-xs font-bold mb-1">
                Active Coordination Workflow
              </div>
              <h3 className="text-lg font-bold text-white">
                Support Request: {activeRequest.grade} {activeRequest.subject} ({activeRequest.topic})
              </h3>
              <p className="text-xs text-stone-300">
                Requested by: <strong>{activeRequest.requesterTeacherName}</strong> • Supporting Teacher: <strong>{activeRequest.supportingTeacherName}</strong> • Target: <strong>{activeRequest.preferredDate}, {activeRequest.preferredPeriod}</strong>
              </p>
            </div>

            <div className="px-3 py-1 rounded-full text-xs font-bold bg-amber-200 text-amber-950 self-start sm:self-auto uppercase tracking-wide">
              Status: {activeRequest.status.replace(/_/g, ' ')}
            </div>
          </div>

          <div className="p-5 sm:p-6 space-y-4">
            <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-700 space-y-1">
              <strong className="text-stone-900">Teacher's Note / Context:</strong>
              <p className="italic">"{activeRequest.reason}"</p>
            </div>

            {/* Step-by-Step Approval Actions */}
            <div className="pt-2 border-t border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              {/* If status is 'requested': Supporting teacher can Accept or Decline */}
              {activeRequest.status === 'requested' && (
                <>
                  <div className="text-xs text-stone-600">
                    Step 1: Supporting teacher (<strong>{activeRequest.supportingTeacherName}</strong>) review:
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => declineSupportRequest(activeRequest.id)}
                      className="px-3.5 py-2 border border-stone-300 text-stone-700 hover:bg-stone-50 rounded-xl text-xs font-semibold cursor-pointer"
                    >
                      {t.btnDeclineSupport}
                    </button>
                    <button
                      onClick={() => acceptSupportRequest(activeRequest.id)}
                      className="px-4 py-2 bg-amber-700 hover:bg-amber-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{t.btnAcceptSupport} (Accept as {activeRequest.supportingTeacherName.split(' ')[0]})</span>
                    </button>
                  </div>
                </>
              )}

              {/* If status is 'accepted_by_teacher': School coordinator approves */}
              {activeRequest.status === 'accepted_by_teacher' && (
                <>
                  <div className="text-xs text-amber-900 bg-amber-50 p-2 rounded-lg border border-amber-200 flex-1">
                    <strong>{activeRequest.supportingTeacherName}</strong> accepted! Pending School Coordinator Confirmation to prevent multi-grade timetable conflicts.
                  </div>
                  <button
                    onClick={() => approveSupportRequestCoordinator(activeRequest.id)}
                    className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs shrink-0 cursor-pointer"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{t.btnApproveCoordinator}</span>
                  </button>
                </>
              )}

              {/* If status is 'approved_by_coordinator': Timetable is scheduled, start session */}
              {activeRequest.status === 'approved_by_coordinator' && (
                <>
                  <div className="text-xs text-emerald-900 bg-emerald-50 p-2.5 rounded-lg border border-emerald-200 flex-1">
                    ✅ Approved by school coordinator! Scheduled in Timetable on {activeRequest.preferredDate}, {activeRequest.preferredPeriod}.
                  </div>
                  <button
                    onClick={() => startSupportClass(activeRequest.id)}
                    className="px-4 py-2 bg-amber-700 hover:bg-amber-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs shrink-0 cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>{t.btnStartSupportClass}</span>
                  </button>
                </>
              )}

              {/* If status is 'in_progress': Complete Support Class and update syllabus */}
              {activeRequest.status === 'in_progress' && (
                <>
                  <div className="text-xs text-amber-900 bg-amber-50 p-2.5 rounded-lg border border-amber-200 flex-1">
                    Support class is currently underway with <strong>{activeRequest.supportingTeacherName}</strong> instructing {activeRequest.grade}.
                  </div>
                  <button
                    onClick={() => completeSupportClass(activeRequest.id)}
                    className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs shrink-0 cursor-pointer"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{t.btnCompleteSupportClass} (Update Syllabus)</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Support History Table (Section 20) */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-stone-100 flex items-center justify-between">
          <h2 className="text-base font-bold text-stone-900 flex items-center gap-2">
            <Clock className="w-4 h-4 text-stone-500" />
            <span>{t.supportHistoryTitle}</span>
          </h2>
          <span className="text-xs text-stone-400">Accountability & substitution audit</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-stone-50 text-stone-600 text-[11px] uppercase tracking-wider border-b border-stone-200">
              <tr>
                <th className="py-3 px-4 font-semibold">Date</th>
                <th className="py-3 px-4 font-semibold">Supporting Teacher</th>
                <th className="py-3 px-4 font-semibold">Requester</th>
                <th className="py-3 px-4 font-semibold">Grade & Subject</th>
                <th className="py-3 px-4 font-semibold text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 font-sans">
              {completedHistory.map(item => (
                <tr key={item.id} className="hover:bg-stone-50/60 transition-colors">
                  <td className="py-3.5 px-4 font-mono text-stone-700">{item.preferredDate}</td>
                  <td className="py-3.5 px-4 font-semibold text-stone-900">{item.supportingTeacherName}</td>
                  <td className="py-3.5 px-4 text-stone-600">{item.requesterTeacherName}</td>
                  <td className="py-3.5 px-4 text-stone-800">{item.grade} — {item.subject}</td>
                  <td className="py-3.5 px-4 text-right">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      Completed
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Safety Rules Box (Section 21) */}
      <div className="p-4 rounded-xl bg-stone-100 border border-stone-200 text-xs text-stone-700 space-y-2">
        <div className="flex items-center gap-2 font-bold text-stone-900">
          <ShieldCheck className="w-4 h-4 text-emerald-700" />
          <span>Support Safety Rules & Guardrails</span>
        </div>
        <p className="text-stone-600 leading-relaxed">
          1. Never schedule a teacher for two classes at the same time • 2. Require supporting-teacher acceptance & coordinator confirmation • 3. Prioritize teachers with relevant subject experience • 4. Teacher judgment remains central across all {schoolTeachers.length} educators.
        </p>
      </div>

      {/* Request Modal */}
      {isRequestModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5"
        >
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-stone-200">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h2 className="text-base font-bold text-stone-900">
                {t.requestSupportTitle}
              </h2>
              <button
                onClick={() => setIsRequestModalOpen(false)}
                className="p-1.5 rounded-lg text-stone-500 hover:text-stone-800 hover:bg-stone-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateRequest} className="mt-4 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Requesting Teacher</label>
                  <select
                    value={reqTeacherId}
                    onChange={e => {
                      setReqTeacherId(e.target.value);
                      // Adjust supporting teacher if same
                      const colleague = schoolTeachers.find(tch => tch.id !== e.target.value);
                      if (colleague) setSelectedSupportingTeacherId(colleague.id);
                    }}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg bg-white font-semibold"
                  >
                    {schoolTeachers.map(tch => (
                      <option key={tch.id} value={tch.id}>
                        {tch.name} {tch.id === teacher.id ? '(You)' : ''}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Select Supporting Colleague</label>
                  <select
                    value={selectedSupportingTeacherId}
                    onChange={e => setSelectedSupportingTeacherId(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg bg-white font-semibold"
                  >
                    {schoolTeachers
                      .filter(tch => tch.id !== reqTeacherId)
                      .map(tch => (
                        <option key={tch.id} value={tch.id}>
                          {tch.name} ({tch.syllabusCompletion}% • {tch.specialization})
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Target Grade</label>
                  <select
                    value={reqGrade}
                    onChange={e => setReqGrade(e.target.value as GradeLevel)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg bg-white font-semibold"
                  >
                    <option value="Grade 1">Grade 1</option>
                    <option value="Grade 2">Grade 2</option>
                    <option value="Grade 3">Grade 3</option>
                    <option value="Grade 4">Grade 4</option>
                    <option value="Grade 5">Grade 5</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Subject</label>
                  <select
                    value={reqSubject}
                    onChange={e => setReqSubject(e.target.value as Subject)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg bg-white font-semibold"
                  >
                    <option value="Mathematics">Mathematics</option>
                    <option value="Kannada">Kannada</option>
                    <option value="English">English</option>
                    <option value="Environmental Studies">Environmental Studies</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Curriculum Topic</label>
                <input
                  type="text"
                  value={reqTopic}
                  onChange={e => setReqTopic(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg font-semibold"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Preferred Day</label>
                  <input
                    type="text"
                    value={reqPreferredDate}
                    onChange={e => setReqPreferredDate(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg font-semibold"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Preferred Period</label>
                  <input
                    type="text"
                    value={reqPreferredPeriod}
                    onChange={e => setReqPreferredPeriod(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg font-semibold"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Reason for Support Request</label>
                <textarea
                  rows={2}
                  value={reqReason}
                  onChange={e => setReqReason(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg resize-none"
                  required
                />
              </div>

              <div className="pt-3 border-t border-stone-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsRequestModalOpen(false)}
                  className="px-3 py-1.5 border border-stone-300 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-amber-700 text-white rounded-lg font-bold shadow-xs cursor-pointer hover:bg-amber-800"
                >
                  Send Support Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
