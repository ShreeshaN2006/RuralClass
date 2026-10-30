import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  ActiveIntervention,
  ActivityBankItem,
  Assessment,
  AttendanceRecord,
  ClassroomBalanceData,
  ConnectivityMode,
  GradeLevel,
  InterventionOption,
  InterventionSuggestion,
  Language,
  LearningStatus,
  LessonPlan,
  QuickAssessmentRecord,
  School,
  Student,
  Subject,
  Teacher,
  TeacherNote,
  TeacherSupportRequest,
  Timetable,
  TimetableConfig,
} from '../types';
import {
  DEMO_SCHOOLS,
  DEMO_TEACHERS,
  INITIAL_ACTIVE_INTERVENTIONS,
  INITIAL_ACTIVITY_BANK,
  INITIAL_ASSESSMENTS,
  INITIAL_ATTENDANCE_RECORDS,
  INITIAL_CLASSROOM_BALANCE,
  INITIAL_LESSON_PLANS,
  INITIAL_STUDENTS_BELAGAVI,
  INITIAL_STUDENTS_HALLIKERI,
  INITIAL_STUDENTS_KUNDGOL,
  INITIAL_TEACHER_SUPPORT_REQUESTS,
  INITIAL_TIMETABLE_HALLIKERI,
} from '../data/mockData';
import { generateConflictFreeTimetable } from '../services/timetableEngine';
import { generateInterventionSuggestions } from '../services/interventionEngine';
import { calculateLearningStatus } from '../utils/scoringRules';
import { authenticateTeacher } from '../services/authService';

export type NavigationTab =
  | 'dashboard'
  | 'todaysClassroom'
  | 'timetable'
  | 'lessonPlanner'
  | 'activityBank'
  | 'students'
  | 'studentProfile'
  | 'attendance'
  | 'progress'
  | 'interventions'
  | 'teacherSupport'
  | 'weeklySummary'
  | 'school'
  | 'settings';

interface AppContextType {
  // Authentication & Demo
  isAuthenticated: boolean;
  teacher: Teacher;
  allTeachers: Teacher[];
  school: School;
  schools: School[];
  language: Language;
  connectivityMode: ConnectivityMode;
  currentView: NavigationTab;
  selectedStudentId: string | null;
  toastMessage: string | null;

  // Modals
  isAssessmentModalOpen: boolean;
  preselectedStudentForAssessment: string | null;
  isAboutModalOpen: boolean;
  parentSummaryStudentId: string | null;
  isBalanceModalOpen: boolean;
  quickAssessmentStudentId: string | null;

  // Offline / Sync status (Section 6)
  isOfflineMode: boolean;
  pendingSyncCount: number;
  toggleOfflineMode: () => void;
  syncNow: () => void;

  // Data
  students: Student[];
  assessments: Assessment[];
  timetable: Timetable | null;
  lessonPlans: LessonPlan[];
  activeInterventions: ActiveIntervention[];
  pendingSuggestions: InterventionSuggestion[];
  dismissedSuggestionIds: string[];
  activityBank: ActivityBankItem[];
  attendanceRecords: AttendanceRecord[];
  supportRequests: TeacherSupportRequest[];
  classroomBalance: ClassroomBalanceData;

  // Daily Classroom Mode (Section 1)
  activeClassroomPeriodNumber: number;
  setActiveClassroomPeriodNumber: (num: number) => void;
  startClassroomPeriod: (periodNumber: number) => void;
  completeClassroomPeriod: (
    periodNumber: number,
    status: 'Completed' | 'Partially completed' | 'Rescheduled',
    observation?: string
  ) => void;
  rescheduleClassroomPeriod: (fromPeriod: number, toPeriod: number) => void;

  // Attendance Actions (Section 5)
  toggleAttendance: (studentId: string) => void;
  markAllPresent: () => void;

  // Teacher Notes (Section 7)
  addTeacherNote: (studentId: string, text: string, tags: string[]) => void;

  // Quick Assessment (Section 4)
  openQuickAssessmentModal: (studentId: string) => void;
  closeQuickAssessmentModal: () => void;
  recordQuickAssessment: (
    studentId: string,
    q1: 'yes' | 'with_help' | 'no',
    q2: 'yes' | 'with_help' | 'no',
    q3: 'yes' | 'with_help' | 'no',
    topic: string,
    subject: Subject
  ) => void;

  // Teacher Support Actions (Sections 11-20)
  createSupportRequest: (data: Omit<TeacherSupportRequest, 'id' | 'dateCreated' | 'status'>) => void;
  acceptSupportRequest: (requestId: string) => void;
  declineSupportRequest: (requestId: string) => void;
  approveSupportRequestCoordinator: (requestId: string) => void;
  startSupportClass: (requestId: string) => void;
  completeSupportClass: (requestId: string) => void;

  // Activity Bank Action (Section 2)
  addActivityToTimetable: (activity: ActivityBankItem, targetGrade?: GradeLevel) => void;

  // Navigation & Modals
  loginDemo: () => void;
  loginAsTeacher: (teacherId: string) => void;
  loginWithCredentials: (id: string, pass: string) => { success: boolean; error?: string };
  switchTeacher: (teacherId: string) => void;
  logout: () => void;
  setLanguage: (lang: Language) => void;
  setConnectivityMode: (mode: ConnectivityMode) => void;
  switchSchool: (schoolId: string) => void;
  setCurrentView: (view: NavigationTab, studentId?: string) => void;
  openAssessmentModal: (studentId?: string) => void;
  closeAssessmentModal: () => void;
  openAboutModal: () => void;
  closeAboutModal: () => void;
  openParentSummary: (studentId: string) => void;
  closeParentSummary: () => void;
  openBalanceModal: () => void;
  closeBalanceModal: () => void;
  showToast: (msg: string) => void;

  // Domain Actions
  recordAssessment: (data: Omit<Assessment, 'id' | 'schoolId'>) => void;
  saveLessonPlan: (plan: LessonPlan) => void;
  markLessonCompleted: (planId: string) => void;
  generateAndSetTimetable: (config: TimetableConfig) => Timetable;
  acceptTimetable: (ttId: string) => void;
  acceptIntervention: (suggestion: InterventionSuggestion, option: InterventionOption) => void;
  dismissIntervention: (suggestionId: string) => void;
  completeActiveIntervention: (interventionId: string) => void;
  addObservationToIntervention: (interventionId: string, note: string) => void;
  resetAllDemoData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('autostart') === '1') return true;
      const savedAuth = localStorage.getItem('ruralclass_auth');
      return savedAuth === 'true';
    }
    return false;
  });

  const [currentSchoolId, setCurrentSchoolId] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const savedTeacherId = localStorage.getItem('ruralclass_teacher_id');
      if (savedTeacherId && DEMO_TEACHERS[savedTeacherId]) {
        return DEMO_TEACHERS[savedTeacherId].schoolId;
      }
      const savedSchoolId = localStorage.getItem('ruralclass_school_id');
      if (savedSchoolId) return savedSchoolId;
    }
    return 'school_hallikeri';
  });
  const [language, setLanguageState] = useState<Language>('en');
  const [connectivityMode, setConnectivityModeState] = useState<ConnectivityMode>('limited');
  const [currentView, setCurrentViewState] = useState<NavigationTab>('dashboard');
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>('st_rahul');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modals state
  const [isAssessmentModalOpen, setIsAssessmentModalOpen] = useState(false);
  const [preselectedStudentForAssessment, setPreselectedStudentForAssessment] = useState<string | null>(null);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
  const [parentSummaryStudentId, setParentSummaryStudentId] = useState<string | null>(null);
  const [isBalanceModalOpen, setIsBalanceModalOpen] = useState(false);
  const [quickAssessmentStudentId, setQuickAssessmentStudentId] = useState<string | null>(null);

  // Offline sync state (Section 6)
  const [isOfflineMode, setIsOfflineMode] = useState(false);
  const [pendingSyncCount, setPendingSyncCount] = useState(0);

  // Daily Classroom mode state (Section 1)
  const [activeClassroomPeriodNumber, setActiveClassroomPeriodNumber] = useState<number>(3); // Defaults to Period 3 as in prompt example

  // Entity States
  const [currentTeacherId, setCurrentTeacherId] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('ruralclass_teacher_id');
      if (saved && DEMO_TEACHERS[saved]) return saved;
    }
    return 'teacher_anita';
  });

  const [schoolStudents, setSchoolStudents] = useState<Record<string, Student[]>>({
    school_hallikeri: INITIAL_STUDENTS_HALLIKERI,
    school_belagavi: INITIAL_STUDENTS_BELAGAVI,
    school_kundgol: INITIAL_STUDENTS_KUNDGOL,
  });

  const [assessments, setAssessments] = useState<Assessment[]>(INITIAL_ASSESSMENTS);
  const [timetables, setTimetables] = useState<Record<string, Timetable>>({
    school_hallikeri: INITIAL_TIMETABLE_HALLIKERI,
    school_belagavi: generateConflictFreeTimetable({
      schoolId: 'school_belagavi',
      grades: ['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4'],
      subjects: ['Kannada', 'Mathematics', 'English', 'Environmental Studies'],
      periodCount: 5,
      periodDurationMin: 40,
      startTime: '09:00 AM',
    }, 'teacher_suresh'),
    school_kundgol: generateConflictFreeTimetable({
      schoolId: 'school_kundgol',
      grades: ['Grade 1', 'Grade 2', 'Grade 3'],
      subjects: ['Kannada', 'Mathematics', 'English', 'Environmental Studies'],
      periodCount: 5,
      periodDurationMin: 40,
      startTime: '09:00 AM',
    }, 'teacher_renuka'),
  });

  const [lessonPlans, setLessonPlans] = useState<LessonPlan[]>(INITIAL_LESSON_PLANS);
  const [activeInterventions, setActiveInterventions] = useState<ActiveIntervention[]>(INITIAL_ACTIVE_INTERVENTIONS);
  const [dismissedSuggestionIds, setDismissedSuggestionIds] = useState<string[]>([]);
  const [activityBank, setActivityBank] = useState<ActivityBankItem[]>(INITIAL_ACTIVITY_BANK);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(INITIAL_ATTENDANCE_RECORDS);
  const [supportRequests, setSupportRequests] = useState<TeacherSupportRequest[]>(INITIAL_TEACHER_SUPPORT_REQUESTS);
  const [classroomBalance, setClassroomBalance] = useState<ClassroomBalanceData>(INITIAL_CLASSROOM_BALANCE);

  // Teachers list
  const [teachersList, setTeachersList] = useState<Teacher[]>(Object.values(DEMO_TEACHERS));

  // Derived
  const currentSchool = DEMO_SCHOOLS.find(s => s.id === currentSchoolId) || DEMO_SCHOOLS[0];
  const currentTeacher = teachersList.find(t => t.id === currentTeacherId) || teachersList[0] || DEMO_TEACHERS.teacher_anita;
  const currentStudents = schoolStudents[currentSchoolId] || [];
  const currentTimetable = timetables[currentSchoolId] || null;

  // Auto-calculated pending suggestions
  const allSuggestions = generateInterventionSuggestions(currentStudents, assessments);
  const pendingSuggestions = allSuggestions.filter(s => {
    if (dismissedSuggestionIds.includes(s.id)) return false;
    const hasActive = activeInterventions.some(
      a => a.studentId === s.studentId && a.status === 'Active' && a.subject === s.subject
    );
    return !hasActive;
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(prev => (prev === msg ? null : prev));
    }, 3500);
  };

  // Offline / Sync Handlers (Section 6)
  const toggleOfflineMode = () => {
    setIsOfflineMode(prev => {
      const next = !prev;
      showToast(next ? 'Switched to Offline Mode (Changes queue locally)' : 'Reconnected: Changes synced to cloud');
      return next;
    });
  };

  const syncNow = () => {
    if (pendingSyncCount === 0) {
      showToast('All classroom records are currently up to date.');
      return;
    }
    const count = pendingSyncCount;
    setPendingSyncCount(0);
    showToast(`Successfully synced ${count} local changes to school server.`);
  };

  const queueChange = () => {
    if (isOfflineMode) {
      setPendingSyncCount(prev => prev + 1);
    }
  };

  // Auth & Teacher switching
  const loginDemo = () => {
    setIsAuthenticated(true);
    setCurrentTeacherId('teacher_anita');
    setCurrentSchoolId('school_hallikeri');
    localStorage.setItem('ruralclass_auth', 'true');
    localStorage.setItem('ruralclass_teacher_id', 'teacher_anita');
    setCurrentViewState('dashboard');
    showToast(language === 'kn' ? 'ಅನಿತಾ ಶಿಕ್ಷಕಿಯಾಗಿ ಲಾಗಿನ್ ಮಾಡಲಾಗಿದೆ' : 'Logged in as Anita Teacher (Demo Mode)');
  };

  const loginAsTeacher = (teacherId: string) => {
    const targetTeacher = teachersList.find(t => t.id === teacherId) || DEMO_TEACHERS[teacherId];
    if (!targetTeacher) return;

    setIsAuthenticated(true);
    setCurrentTeacherId(targetTeacher.id);
    setCurrentSchoolId(targetTeacher.schoolId);
    localStorage.setItem('ruralclass_auth', 'true');
    localStorage.setItem('ruralclass_teacher_id', targetTeacher.id);
    setCurrentViewState('dashboard');
    const firstStudent = (schoolStudents[targetTeacher.schoolId] || [])[0];
    if (firstStudent) {
      setSelectedStudentId(firstStudent.id);
    }
    showToast(
      language === 'kn'
        ? `${targetTeacher.nameKn} ಅವರಾಗಿ ಸೈನ್ ಇನ್ ಮಾಡಲಾಗಿದೆ`
        : `Signed in as ${targetTeacher.name} (${targetTeacher.role})`
    );
  };

  const loginWithCredentials = (id: string, pass: string): { success: boolean; error?: string } => {
    const result = authenticateTeacher(id, pass, teachersList);
    if (result.success && result.teacher) {
      const targetTeacher = result.teacher;
      setIsAuthenticated(true);
      setCurrentTeacherId(targetTeacher.id);
      setCurrentSchoolId(targetTeacher.schoolId);
      localStorage.setItem('ruralclass_auth', 'true');
      localStorage.setItem('ruralclass_teacher_id', targetTeacher.id);
      setCurrentViewState('dashboard');
      const firstStudent = (schoolStudents[targetTeacher.schoolId] || [])[0];
      if (firstStudent) {
        setSelectedStudentId(firstStudent.id);
      }
      showToast(
        language === 'kn'
          ? `${targetTeacher.nameKn} ಅವರಾಗಿ ಯಶಸ್ವಿಯಾಗಿ ಲಾಗಿನ್ ಮಾಡಲಾಗಿದೆ`
          : `Welcome, ${targetTeacher.name}!`
      );
      return { success: true };
    }
    return { success: false, error: result.error || 'Authentication failed' };
  };

  const switchTeacher = (teacherId: string) => {
    const targetTeacher = teachersList.find(t => t.id === teacherId) || DEMO_TEACHERS[teacherId];
    if (!targetTeacher) return;

    setCurrentTeacherId(targetTeacher.id);
    localStorage.setItem('ruralclass_teacher_id', targetTeacher.id);

    // If teacher belongs to a different school, switch school context as well
    if (targetTeacher.schoolId !== currentSchoolId) {
      setCurrentSchoolId(targetTeacher.schoolId);
      const firstStudent = (schoolStudents[targetTeacher.schoolId] || [])[0];
      if (firstStudent) {
        setSelectedStudentId(firstStudent.id);
      }
    }

    showToast(
      language === 'kn'
        ? `ಶಿಕ್ಷಕರನ್ನು ${targetTeacher.nameKn} ಅವರಿಗೆ ಬದಲಾಯಿಸಲಾಗಿದೆ`
        : `Active teacher changed to ${targetTeacher.name} (${targetTeacher.role})`
    );
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('ruralclass_auth');
    showToast('Signed out of RuralClass');
  };

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    showToast(lang === 'kn' ? 'ಭಾಷೆಯನ್ನು ಕನ್ನಡಕ್ಕೆ ಬದಲಾಯಿಸಲಾಗಿದೆ' : 'Language switched to English');
  };

  const setConnectivityMode = (mode: ConnectivityMode) => {
    setConnectivityModeState(mode);
    if (mode === 'very_limited') {
      setIsOfflineMode(true);
    }
  };

  const switchSchool = (newSchoolId: string) => {
    setCurrentSchoolId(newSchoolId);
    localStorage.setItem('ruralclass_school_id', newSchoolId);
    const firstStudent = (schoolStudents[newSchoolId] || [])[0];
    if (firstStudent) {
      setSelectedStudentId(firstStudent.id);
    }
    // If current teacher doesn't teach at this school, switch to the school's primary teacher
    if (currentTeacher.schoolId !== newSchoolId) {
      const matchingTeacher = teachersList.find(t => t.schoolId === newSchoolId);
      if (matchingTeacher) {
        setCurrentTeacherId(matchingTeacher.id);
        localStorage.setItem('ruralclass_teacher_id', matchingTeacher.id);
      }
    }
    const schoolObj = DEMO_SCHOOLS.find(s => s.id === newSchoolId);
    showToast(`Switched to ${schoolObj?.name || newSchoolId}`);
  };

  const setCurrentView = (view: NavigationTab, studentId?: string) => {
    if (studentId) {
      setSelectedStudentId(studentId);
    }
    setCurrentViewState(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openAssessmentModal = (studentId?: string) => {
    setPreselectedStudentForAssessment(studentId || selectedStudentId || currentStudents[0]?.id || null);
    setIsAssessmentModalOpen(true);
  };

  const closeAssessmentModal = () => {
    setIsAssessmentModalOpen(false);
    setPreselectedStudentForAssessment(null);
  };

  const openAboutModal = () => setIsAboutModalOpen(true);
  const closeAboutModal = () => setIsAboutModalOpen(false);

  const openParentSummary = (studentId: string) => setParentSummaryStudentId(studentId);
  const closeParentSummary = () => setParentSummaryStudentId(null);

  const openBalanceModal = () => setIsBalanceModalOpen(true);
  const closeBalanceModal = () => setIsBalanceModalOpen(false);

  const openQuickAssessmentModal = (studentId: string) => setQuickAssessmentStudentId(studentId);
  const closeQuickAssessmentModal = () => setQuickAssessmentStudentId(null);

  // Daily Classroom Mode Actions (Section 1)
  const startClassroomPeriod = (periodNumber: number) => {
    setActiveClassroomPeriodNumber(periodNumber);
    setTimetables(prev => {
      const current = prev[currentSchoolId];
      if (!current) return prev;
      return {
        ...prev,
        [currentSchoolId]: {
          ...current,
          periods: current.periods.map(p =>
            p.periodNumber === periodNumber ? { ...p, status: 'In progress' } : p
          ),
        },
      };
    });
    queueChange();
    showToast(`Period ${periodNumber} is now in progress.`);
  };

  const completeClassroomPeriod = (
    periodNumber: number,
    status: 'Completed' | 'Partially completed' | 'Rescheduled',
    observation?: string
  ) => {
    setTimetables(prev => {
      const current = prev[currentSchoolId];
      if (!current) return prev;
      return {
        ...prev,
        [currentSchoolId]: {
          ...current,
          periods: current.periods.map(p =>
            p.periodNumber === periodNumber ? { ...p, status } : p
          ),
        },
      };
    });
    queueChange();
    showToast(`Period ${periodNumber} recorded as: ${status}.`);
  };

  const rescheduleClassroomPeriod = (fromPeriod: number, toPeriod: number) => {
    setTimetables(prev => {
      const current = prev[currentSchoolId];
      if (!current) return prev;
      const fromObj = current.periods.find(p => p.periodNumber === fromPeriod);
      if (!fromObj) return prev;

      return {
        ...prev,
        [currentSchoolId]: {
          ...current,
          periods: current.periods.map(p => {
            if (p.periodNumber === fromPeriod) {
              return { ...p, status: 'Rescheduled' };
            }
            if (p.periodNumber === toPeriod) {
              return {
                ...p,
                teacherLedGrade: fromObj.teacherLedGrade,
                teacherLedSubject: fromObj.teacherLedSubject,
                teacherLedTopic: fromObj.teacherLedTopic,
                teacherLedTopicKn: fromObj.teacherLedTopicKn,
                status: 'Ready',
              };
            }
            return p;
          }),
        },
      };
    });
    queueChange();
    showToast(`Lesson from Period ${fromPeriod} rescheduled to Period ${toPeriod}.`);
  };

  // Attendance Actions (Section 5)
  const toggleAttendance = (studentId: string) => {
    setAttendanceRecords(prev =>
      prev.map(r =>
        r.studentId === studentId
          ? { ...r, status: r.status === 'present' ? 'absent' : 'present' }
          : r
      )
    );
    queueChange();
  };

  const markAllPresent = () => {
    setAttendanceRecords(prev => prev.map(r => ({ ...r, status: 'present' })));
    queueChange();
    showToast('All students marked present for today.');
  };

  // Teacher Notes with Tags (Section 7)
  const addTeacherNote = (studentId: string, text: string, tags: string[]) => {
    const newNote: TeacherNote = {
      id: `note_${Date.now()}`,
      studentId,
      teacherId: currentTeacher.id,
      teacherName: currentTeacher.name,
      text,
      tags,
      date: new Date().toISOString().split('T')[0],
    };

    setSchoolStudents(prev => {
      const list = prev[currentSchoolId] || [];
      return {
        ...prev,
        [currentSchoolId]: list.map(s => {
          if (s.id !== studentId) return s;
          return {
            ...s,
            notes: [newNote, ...(s.notes || [])],
            teacherObservation: `${s.teacherObservation} | ${text}`,
          };
        }),
      };
    });
    queueChange();
    showToast('Teacher note and tags added.');
  };

  // Quick Assessment 3-Question Recording (Section 4)
  const recordQuickAssessment = (
    studentId: string,
    q1: 'yes' | 'with_help' | 'no',
    q2: 'yes' | 'with_help' | 'no',
    q3: 'yes' | 'with_help' | 'no',
    topic: string,
    subject: Subject
  ) => {
    // Scoring: yes = 100%, with_help = 50%, no = 0%
    const scoreMap = { yes: 10, with_help: 5, no: 0 };
    const totalScore = scoreMap[q1] + scoreMap[q2] + scoreMap[q3];
    const maxScore = 30;
    const percentage = Math.round((totalScore / maxScore) * 100);

    const resultingStatus: LearningStatus =
      percentage >= 70 ? 'On track' : percentage >= 50 ? 'Improving' : 'Needs support';

    recordAssessment({
      studentId,
      subject,
      topic,
      score: totalScore,
      maxScore,
      date: new Date().toISOString().split('T')[0],
      observation: `Quick Assessment: Q1(Solve): ${q1}, Q2(Explain): ${q2}, Q3(Independent): ${q3}`,
    });

    closeQuickAssessmentModal();
    showToast(`Quick assessment saved: ${percentage}% (${resultingStatus}).`);
  };

  // Activity Bank Action (Section 2)
  const addActivityToTimetable = (activity: ActivityBankItem, targetGrade?: GradeLevel) => {
    const grade = targetGrade || activity.grade;
    setTimetables(prev => {
      const current = prev[currentSchoolId];
      if (!current) return prev;
      const updatedPeriods = current.periods.map(p => {
        // If this grade is independent in this period, apply activity
        if (p.teacherLedGrade !== grade) {
          return {
            ...p,
            gradeActivities: {
              ...p.gradeActivities,
              [grade]: {
                type: activity.mode === 'Pair' ? 'Peer' : activity.mode === 'Group' ? 'Group' : 'Independent',
                activity: `${activity.title} (${activity.materials.join(', ')})`,
                activityKn: `${activity.titleKn} (${activity.materials.join(', ')})`,
                subject: activity.subject,
              },
            },
          };
        }
        return p;
      });
      return {
        ...prev,
        [currentSchoolId]: {
          ...current,
          periods: updatedPeriods,
        },
      };
    });
    queueChange();
    showToast(`"${activity.title}" added to timetable for ${grade}.`);
  };

  // Teacher Support & Substitution Workflow (Sections 11-20)
  const createSupportRequest = (data: Omit<TeacherSupportRequest, 'id' | 'dateCreated' | 'status'>) => {
    const newReq: TeacherSupportRequest = {
      ...data,
      id: `tsr_${Date.now()}`,
      dateCreated: new Date().toISOString().split('T')[0],
      status: 'requested',
    };
    setSupportRequests(prev => [newReq, ...prev]);
    queueChange();
    showToast(`Support request sent to ${data.supportingTeacherName}.`);
  };

  const acceptSupportRequest = (requestId: string) => {
    setSupportRequests(prev =>
      prev.map(r => (r.id === requestId ? { ...r, status: 'accepted_by_teacher' } : r))
    );
    queueChange();
    showToast('Support request accepted! Pending school coordinator approval.');
  };

  const declineSupportRequest = (requestId: string) => {
    setSupportRequests(prev =>
      prev.map(r => (r.id === requestId ? { ...r, status: 'declined' } : r))
    );
    queueChange();
    showToast('Support request declined.');
  };

  const approveSupportRequestCoordinator = (requestId: string) => {
    const req = supportRequests.find(r => r.id === requestId);
    if (!req) return;

    // Update status
    setSupportRequests(prev =>
      prev.map(r => (r.id === requestId ? { ...r, status: 'approved_by_coordinator' } : r))
    );

    // Schedule into Timetable (Section 17: label it "Teacher Support")
    setTimetables(prev => {
      const current = prev[currentSchoolId];
      if (!current) return prev;
      // Match period 4 or period 3
      const targetPeriodNum = req.preferredPeriod.includes('4') ? 4 : 3;
      const updatedPeriods = current.periods.map(p => {
        if (p.periodNumber === targetPeriodNum) {
          return {
            ...p,
            teacherLedGrade: req.grade,
            teacherLedSubject: req.subject,
            teacherLedTopic: req.topic,
            teacherLedTopicKn: `${req.topic} (ಶಿಕ್ಷಕರ ಬೆಂಬಲ)`,
            teacherSupportSession: {
              originalTeacherName: req.requesterTeacherName,
              supportingTeacherName: req.supportingTeacherName,
              isSupportClass: true,
            },
          };
        }
        return p;
      });
      return {
        ...prev,
        [currentSchoolId]: {
          ...current,
          periods: updatedPeriods,
        },
      };
    });
    queueChange();
    showToast('Approved! Support class scheduled in timetable.');
  };

  const startSupportClass = (requestId: string) => {
    setSupportRequests(prev =>
      prev.map(r => (r.id === requestId ? { ...r, status: 'in_progress' } : r))
    );
    setCurrentView('todaysClassroom');
    showToast('Support class started in Today’s Classroom mode.');
  };

  const completeSupportClass = (requestId: string) => {
    const req = supportRequests.find(r => r.id === requestId);
    if (!req) return;

    setSupportRequests(prev =>
      prev.map(r =>
        r.id === requestId
          ? { ...r, status: 'completed', completedAt: new Date().toISOString().split('T')[0] }
          : r
      )
    );

    // Increment Priya's Grade 4 Mathematics syllabus completion (Section 19: 79% -> 82% / 64% -> 70%)
    setTeachersList(prev =>
      prev.map(t => {
        if (t.id === req.requesterTeacherId) {
          const currentMath = t.subjectCompletion.Mathematics || 64;
          const currentGrade = t.gradeCompletion['Grade 4'] || 68;
          return {
            ...t,
            syllabusCompletion: Math.min(100, t.syllabusCompletion + 3),
            gradeCompletion: {
              ...t.gradeCompletion,
              'Grade 4': Math.min(100, currentGrade + 4),
            },
            subjectCompletion: {
              ...t.subjectCompletion,
              Mathematics: Math.min(100, currentMath + 5),
            },
          };
        }
        return t;
      })
    );

    queueChange();
    showToast('Support class completed! Priya Teacher’s syllabus progress updated (+5%).');
  };

  // Standard Assessment Recording
  const recordAssessment = (data: Omit<Assessment, 'id' | 'schoolId'>) => {
    const newAssessment: Assessment = {
      ...data,
      id: `as_${Date.now()}`,
      schoolId: currentSchoolId,
    };

    setAssessments(prev => [newAssessment, ...prev]);

    setSchoolStudents(prev => {
      const list = prev[currentSchoolId] || [];
      const updatedList = list.map(student => {
        if (student.id !== data.studentId) return student;

        const newPercentage = Math.round((data.score / data.maxScore) * 100);
        const updatedSubjects = student.subjects.map(subj => {
          if (subj.subject !== data.subject) return subj;
          const studentAllSubjectAssessments = [...assessments, newAssessment].filter(
            a => a.studentId === student.id && a.subject === data.subject
          );
          const totalPerc = studentAllSubjectAssessments.reduce((acc, curr) => acc + (curr.score / curr.maxScore) * 100, 0);
          const newAvg = Math.round(totalPerc / studentAllSubjectAssessments.length);
          const status = calculateLearningStatus(newAvg);
          return {
            ...subj,
            averageScore: newAvg,
            status,
            trend: (newPercentage > subj.averageScore ? 'up' : newPercentage < subj.averageScore ? 'down' : 'stable') as any,
          };
        });

        const hasNeedsSupport = updatedSubjects.some(s => s.status === 'Needs support');
        const hasDeveloping = updatedSubjects.some(s => s.status === 'Developing');
        const overallStatus: LearningStatus = hasNeedsSupport ? 'Needs support' : hasDeveloping ? 'Improving' : 'On track';

        return {
          ...student,
          subjects: updatedSubjects,
          overallStatus,
          teacherObservation: data.observation ? `${student.teacherObservation} | Latest note: ${data.observation}` : student.teacherObservation,
        };
      });

      return {
        ...prev,
        [currentSchoolId]: updatedList,
      };
    });

    closeAssessmentModal();
    queueChange();
    showToast(language === 'kn' ? 'ಮೌಲ್ಯಮಾಪನ ದಾಖಲಿಸಲಾಗಿದೆ. ಪ್ರಗತಿ ನವೀಕರಣಗೊಂಡಿದೆ.' : 'Assessment recorded successfully. Progress updated.');
  };

  const saveLessonPlan = (plan: LessonPlan) => {
    setLessonPlans(prev => [plan, ...prev.filter(p => p.id !== plan.id)]);
    queueChange();
    showToast(language === 'kn' ? 'ಪಾಠ ಯೋಜನೆಯನ್ನು ಯಶಸ್ವಿಯಾಗಿ ಉಳಿಸಲಾಗಿದೆ.' : 'Lesson plan saved successfully.');
  };

  const markLessonCompleted = (planId: string) => {
    setLessonPlans(prev =>
      prev.map(p => (p.id === planId ? { ...p, status: 'Completed' } : p))
    );
    queueChange();
    showToast(language === 'kn' ? 'ಪಾಠ ಪೂರ್ಣಗೊಂಡಿದೆ ಎಂದು ಗುರುತಿಸಲಾಗಿದೆ.' : 'Lesson marked as completed.');
  };

  const generateAndSetTimetable = (config: TimetableConfig) => {
    const newTt = generateConflictFreeTimetable(config, currentTeacher.id);
    setTimetables(prev => ({
      ...prev,
      [currentSchoolId]: newTt,
    }));
    queueChange();
    showToast(language === 'kn' ? 'ಹೊಸ ಸಂಘರ್ಷ-ಮುಕ್ತ ವೇಳಾಪಟ್ಟಿ ಸಿದ್ಧವಾಗಿದೆ.' : 'Conflict-free timetable generated.');
    return newTt;
  };

  const acceptTimetable = (ttId: string) => {
    setTimetables(prev => {
      const current = prev[currentSchoolId];
      if (!current) return prev;
      return {
        ...prev,
        [currentSchoolId]: {
          ...current,
          accepted: true,
        },
      };
    });
    queueChange();
    showToast(language === 'kn' ? 'ವೇಳಾಪಟ್ಟಿ ಸ್ವೀಕರಿಸಲಾಗಿದೆ ಮತ್ತು ಜಾರಿಯಲ್ಲಿದೆ.' : 'Conflict-free timetable accepted and active.');
  };

  const acceptIntervention = (suggestion: InterventionSuggestion, option: InterventionOption) => {
    const newActive: ActiveIntervention = {
      id: `act_${Date.now()}`,
      suggestionId: suggestion.id,
      studentId: suggestion.studentId,
      studentName: suggestion.studentName,
      studentGrade: suggestion.studentGrade,
      subject: suggestion.subject,
      interventionTitle: option.title,
      interventionDescription: option.description,
      dateAssigned: new Date().toISOString().split('T')[0],
      assignedBy: currentTeacher.name,
      status: 'Active',
      notes: [`Selected ${option.type} following rule: ${suggestion.ruleTriggered}`],
    };

    setActiveInterventions(prev => [newActive, ...prev]);
    queueChange();
    showToast(language === 'kn' ? `ಹಸ್ತಕ್ಷೇಪವನ್ನು ${suggestion.studentName} ಅವರ ಬೆಂಬಲ ಯೋಜನೆಗೆ ಸೇರಿಸಲಾಗಿದೆ.` : `Intervention added to ${suggestion.studentName}'s support plan.`);
  };

  const dismissIntervention = (suggestionId: string) => {
    setDismissedSuggestionIds(prev => [...prev, suggestionId]);
    queueChange();
    showToast(language === 'kn' ? 'ಸಲಹೆಯನ್ನು ರದ್ದುಗೊಳಿಸಲಾಗಿದೆ.' : 'Suggestion dismissed by teacher.');
  };

  const completeActiveIntervention = (interventionId: string) => {
    setActiveInterventions(prev =>
      prev.map(item =>
        item.id === interventionId
          ? { ...item, status: 'Completed', completedDate: new Date().toISOString().split('T')[0] }
          : item
      )
    );
    queueChange();
    showToast(language === 'kn' ? 'ಹಸ್ತಕ್ಷೇಪ ಪೂರ್ಣಗೊಂಡಿದೆ ಎಂದು ದಾಖಲಿಸಲಾಗಿದೆ.' : 'Intervention marked as completed.');
  };

  const addObservationToIntervention = (interventionId: string, note: string) => {
    if (!note.trim()) return;
    setActiveInterventions(prev =>
      prev.map(item =>
        item.id === interventionId
          ? { ...item, notes: [...item.notes, note.trim()] }
          : item
      )
    );
    queueChange();
    showToast(language === 'kn' ? 'ಟಿಪ್ಪಣಿ ಸೇರಿಸಲಾಗಿದೆ.' : 'Observation note added.');
  };

  const resetAllDemoData = () => {
    setSchoolStudents({
      school_hallikeri: INITIAL_STUDENTS_HALLIKERI,
      school_belagavi: INITIAL_STUDENTS_BELAGAVI,
    });
    setAssessments(INITIAL_ASSESSMENTS);
    setLessonPlans(INITIAL_LESSON_PLANS);
    setActiveInterventions(INITIAL_ACTIVE_INTERVENTIONS);
    setActivityBank(INITIAL_ACTIVITY_BANK);
    setAttendanceRecords(INITIAL_ATTENDANCE_RECORDS);
    setSupportRequests(INITIAL_TEACHER_SUPPORT_REQUESTS);
    setTeachersList(Object.values(DEMO_TEACHERS));
    setClassroomBalance(INITIAL_CLASSROOM_BALANCE);
    setDismissedSuggestionIds([]);
    setCurrentSchoolId('school_hallikeri');
    setCurrentTeacherId('teacher_anita');
    localStorage.setItem('ruralclass_teacher_id', 'teacher_anita');
    setSelectedStudentId('st_rahul');
    setActiveClassroomPeriodNumber(3);
    setPendingSyncCount(0);
    setIsOfflineMode(false);
    showToast('Reset all data to hackathon defaults.');
  };

  return (
    <AppContext.Provider
      value={{
        isAuthenticated,
        teacher: currentTeacher,
        allTeachers: teachersList,
        school: currentSchool,
        schools: DEMO_SCHOOLS,
        language,
        connectivityMode,
        currentView,
        selectedStudentId,
        toastMessage,
        isAssessmentModalOpen,
        preselectedStudentForAssessment,
        isAboutModalOpen,
        parentSummaryStudentId,
        isBalanceModalOpen,
        quickAssessmentStudentId,
        isOfflineMode,
        pendingSyncCount,
        toggleOfflineMode,
        syncNow,
        students: currentStudents,
        assessments: assessments.filter(a => a.schoolId === currentSchoolId),
        timetable: currentTimetable,
        lessonPlans: lessonPlans.filter(p => p.schoolId === currentSchoolId),
        activeInterventions: activeInterventions.filter(a => currentStudents.some(s => s.id === a.studentId)),
        pendingSuggestions,
        dismissedSuggestionIds,
        activityBank,
        attendanceRecords,
        supportRequests,
        classroomBalance,
        activeClassroomPeriodNumber,
        setActiveClassroomPeriodNumber,
        startClassroomPeriod,
        completeClassroomPeriod,
        rescheduleClassroomPeriod,
        toggleAttendance,
        markAllPresent,
        addTeacherNote,
        openQuickAssessmentModal,
        closeQuickAssessmentModal,
        recordQuickAssessment,
        createSupportRequest,
        acceptSupportRequest,
        declineSupportRequest,
        approveSupportRequestCoordinator,
        startSupportClass,
        completeSupportClass,
        addActivityToTimetable,
        loginDemo,
        loginAsTeacher,
        loginWithCredentials,
        switchTeacher,
        logout,
        setLanguage,
        setConnectivityMode,
        switchSchool,
        setCurrentView,
        openAssessmentModal,
        closeAssessmentModal,
        openAboutModal,
        closeAboutModal,
        openParentSummary,
        closeParentSummary,
        openBalanceModal,
        closeBalanceModal,
        showToast,
        recordAssessment,
        saveLessonPlan,
        markLessonCompleted,
        generateAndSetTimetable,
        acceptTimetable,
        acceptIntervention,
        dismissIntervention,
        completeActiveIntervention,
        addObservationToIntervention,
        resetAllDemoData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
