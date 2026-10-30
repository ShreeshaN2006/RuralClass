export type GradeLevel = 'Grade 1' | 'Grade 2' | 'Grade 3' | 'Grade 4' | 'Grade 5';

export type Subject = 'Kannada' | 'Mathematics' | 'English' | 'Environmental Studies';

export type LearningStatus = 'On track' | 'Improving' | 'Needs support' | 'Follow-up' | 'Developing';

export type Language = 'en' | 'kn';

export type ConnectivityMode = 'good' | 'limited' | 'very_limited';

export interface School {
  id: string;
  name: string;
  nameKn: string;
  location: string;
  locationKn: string;
  grades: GradeLevel[];
  subjects: Subject[];
  teacherCount: number;
  studentCount: number;
  language: Language;
}

export interface Teacher {
  id: string;
  name: string;
  nameKn: string;
  schoolId: string;
  assignedGrades: GradeLevel[];
  role: string;
  roleKn?: string;
  email?: string;
  phone?: string;
  specialization?: string;
  specializationKn?: string;
  avatarColor?: string;
  defaultPassword?: string;
  syllabusCompletion: number; // percentage
  gradeCompletion: Record<string, number>;
  subjectCompletion: Record<string, number>;
}

export interface SubjectScore {
  subject: Subject;
  level: 'Beginner' | 'Developing' | 'Grade-level' | 'Advanced';
  averageScore: number; // percentage
  status: LearningStatus;
  trend: 'up' | 'stable' | 'down';
}

export interface TeacherNote {
  id: string;
  studentId: string;
  teacherId: string;
  teacherName: string;
  text: string;
  tags: string[];
  date: string;
}

export interface Student {
  id: string;
  schoolId: string;
  name: string;
  nameKn: string;
  grade: GradeLevel;
  attendance: number; // percentage
  absentCountThisMonth: number;
  readingStatus: 'Developing' | 'Good' | 'Needs support' | 'Advanced';
  mathStatus: 'Developing' | 'Good' | 'Needs support' | 'Advanced';
  overallStatus: LearningStatus;
  subjects: SubjectScore[];
  teacherObservation: string;
  teacherObservationKn: string;
  notes?: TeacherNote[];
}

export interface AttendanceRecord {
  studentId: string;
  studentName: string;
  grade: GradeLevel;
  date: string;
  status: 'present' | 'absent';
}

export interface Assessment {
  id: string;
  studentId: string;
  schoolId: string;
  subject: Subject;
  topic: string;
  topicKn?: string;
  score: number;
  maxScore: number;
  date: string;
  observation: string;
}

export interface LessonPlanActivity {
  phase: string;
  phaseKn: string;
  durationMin: number;
  teacherAction: string;
  teacherActionKn: string;
  studentAction: string;
  studentActionKn: string;
}

export interface MultiGradeIndependentActivity {
  grade: GradeLevel;
  activityTitle: string;
  activityTitleKn: string;
  activityType: 'Independent' | 'Group' | 'Peer';
  description: string;
  descriptionKn: string;
}

export interface LessonResources {
  blackboard: boolean;
  textbook: boolean;
  paper: boolean;
  chalk: boolean;
  printer: boolean;
  internet: boolean;
  flashcards: boolean;
  projector: boolean;
}

export interface LessonPlan {
  id: string;
  teacherId: string;
  schoolId: string;
  grade: GradeLevel;
  subject: Subject;
  topic: string;
  objective: string;
  durationMinutes: number;
  learningLevel: 'Beginner' | 'Developing' | 'Grade-level' | 'Advanced';
  materials: string[];
  resources?: LessonResources;
  activities: LessonPlanActivity[];
  multiGradeActivities?: MultiGradeIndependentActivity[];
  status: 'Ready' | 'In progress' | 'Completed';
  createdAt: string;
}

export interface TimetablePeriodAssignment {
  periodNumber: number;
  timeSlot: string;
  teacherLedGrade: GradeLevel;
  teacherLedSubject: Subject;
  teacherLedTopic: string;
  teacherLedTopicKn: string;
  status: 'Ready' | 'In progress' | 'Completed' | 'Partially completed' | 'Rescheduled';
  teacherSupportSession?: {
    originalTeacherName: string;
    supportingTeacherName: string;
    isSupportClass: boolean;
  };
  gradeActivities: Record<GradeLevel, {
    type: 'Teacher-led' | 'Independent' | 'Group' | 'Peer';
    activity: string;
    activityKn: string;
    subject: Subject;
  }>;
}

export interface TimetableConfig {
  schoolId: string;
  grades: GradeLevel[];
  subjects: Subject[];
  periodCount: number;
  periodDurationMin: number;
  startTime: string;
}

export interface Timetable {
  id: string;
  schoolId: string;
  teacherId: string;
  day: string;
  config: TimetableConfig;
  periods: TimetablePeriodAssignment[];
  rationale: string;
  rationaleKn: string;
  accepted: boolean;
  createdAt: string;
}

export interface InterventionOption {
  id: string;
  title: string;
  titleKn: string;
  type: '10-min practice' | 'peer-learning' | 'low-resource worksheet' | 'teacher re-teaching';
  description: string;
  descriptionKn: string;
  estimatedMinutes: number;
}

export interface InterventionSuggestion {
  id: string;
  studentId: string;
  studentName: string;
  studentGrade: GradeLevel;
  subject: Subject;
  topic: string;
  topicKn: string;
  recentScore: number;
  status: LearningStatus;
  ruleTriggered: string;
  ruleTriggeredKn: string;
  explanation: string;
  explanationKn: string;
  suggestedActions: InterventionOption[];
}

export interface ActiveIntervention {
  id: string;
  suggestionId?: string;
  studentId: string;
  studentName: string;
  studentGrade: GradeLevel;
  subject: Subject;
  interventionTitle: string;
  interventionDescription: string;
  dateAssigned: string;
  assignedBy: string;
  status: 'Active' | 'Completed' | 'Dismissed';
  notes: string[];
  completedDate?: string;
}

// Activity Bank
export interface ActivityBankItem {
  id: string;
  title: string;
  titleKn: string;
  grade: GradeLevel;
  subject: Subject;
  topic: string;
  topicKn: string;
  durationMinutes: number;
  difficulty: 'Easy' | 'Medium' | 'Challenging';
  mode: 'Individual' | 'Pair' | 'Group';
  materials: string[];
  description: string;
  descriptionKn: string;
  instructions: string[];
}

// Daily Classroom Mode State
export interface ClassroomPeriodStatus {
  periodNumber: number;
  timeSlot: string;
  teacherLedGrade: GradeLevel;
  teacherLedSubject: Subject;
  teacherLedTopic: string;
  status: 'Upcoming' | 'In Progress' | 'Completed' | 'Partially Completed' | 'Rescheduled';
  completedAt?: string;
  observation?: string;
  quickAssessmentSummary?: {
    evaluatedCount: number;
    yesCount: number;
    withHelpCount: number;
    noCount: number;
  };
}

// Quick Assessment Result
export interface QuickAssessmentRecord {
  id: string;
  studentId: string;
  studentName: string;
  grade: GradeLevel;
  subject: Subject;
  topic: string;
  date: string;
  q1CanSolve: 'yes' | 'with_help' | 'no';
  q2CanExplain: 'yes' | 'with_help' | 'no';
  q3CanSolveIndependently: 'yes' | 'with_help' | 'no';
  resultingStatus: LearningStatus;
}

// Teacher Support & Substitution
export interface TeacherSupportRequest {
  id: string;
  requesterTeacherId: string;
  requesterTeacherName: string;
  supportingTeacherId: string;
  supportingTeacherName: string;
  grade: GradeLevel;
  subject: Subject;
  topic: string;
  lessonsPending: number;
  preferredDate: string;
  preferredPeriod: string;
  reason: string;
  status:
    | 'suggested'
    | 'requested'
    | 'accepted_by_teacher'
    | 'approved_by_coordinator'
    | 'in_progress'
    | 'completed'
    | 'declined';
  dateCreated: string;
  completedAt?: string;
}

// Classroom Balance
export interface ClassroomBalanceData {
  overallScore: number; // e.g. 86%
  gradeCoverage: Record<GradeLevel, number>;
  subjectCoverage: Record<Subject, number>;
  teacherLedHours: number;
  independentHours: number;
  alerts: string[];
}
