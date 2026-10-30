import { Teacher } from '../types';
import { DEMO_TEACHERS, DEMO_SCHOOLS } from '../data/mockData';

export interface AuthResult {
  success: boolean;
  teacher?: Teacher;
  error?: string;
}

export interface QuickLoginOption {
  id: string;
  name: string;
  nameKn: string;
  role: string;
  roleKn?: string;
  schoolId: string;
  schoolName: string;
  schoolNameKn: string;
  assignedGrades: string[];
  email?: string;
  avatarColor: string;
  syllabusCompletion: number;
  defaultPassword: string;
}

/**
 * Returns list of quick teacher login options enriched with school metadata
 */
export function getAvailableTeacherLogins(teachers: Teacher[] = Object.values(DEMO_TEACHERS)): QuickLoginOption[] {
  return teachers.map(teacher => {
    const school = DEMO_SCHOOLS.find(s => s.id === teacher.schoolId);
    return {
      id: teacher.id,
      name: teacher.name,
      nameKn: teacher.nameKn,
      role: teacher.role,
      roleKn: teacher.roleKn,
      schoolId: teacher.schoolId,
      schoolName: school ? school.name : teacher.schoolId,
      schoolNameKn: school ? school.nameKn : teacher.schoolId,
      assignedGrades: teacher.assignedGrades,
      email: teacher.email,
      avatarColor: teacher.avatarColor || 'bg-amber-700 text-white',
      syllabusCompletion: teacher.syllabusCompletion,
      defaultPassword: teacher.defaultPassword || 'demo123',
    };
  });
}

/**
 * Pure authentication validator
 * Matches teacher by id, case-insensitive name or email.
 * Accepts universal demo password 'demo123', specific teacher password, or <id>123.
 */
export function authenticateTeacher(
  identifier: string,
  password?: string,
  teachers: Teacher[] = Object.values(DEMO_TEACHERS)
): AuthResult {
  const cleanId = (identifier || '').trim().toLowerCase();
  if (!cleanId) {
    return {
      success: false,
      error: 'Please enter a Teacher ID or email address.',
    };
  }

  // Find matching teacher
  const matchedTeacher = teachers.find(t => {
    const idMatch = t.id.toLowerCase() === cleanId;
    const emailMatch = t.email?.toLowerCase() === cleanId;
    const nameMatch = t.name.toLowerCase().replace(/\s+/g, '') === cleanId.replace(/\s+/g, '');
    const cleanIdWithoutPrefix = cleanId.startsWith('teacher_') ? cleanId : `teacher_${cleanId}`;
    const prefixMatch = t.id.toLowerCase() === cleanIdWithoutPrefix;
    return idMatch || emailMatch || nameMatch || prefixMatch;
  });

  if (!matchedTeacher) {
    return {
      success: false,
      error: `Teacher account "${identifier}" not found. Please choose from the registered teacher profiles below.`,
    };
  }

  // Password validation:
  // In demo / hackathon mode:
  // - 'demo123' works for any account
  // - matchedTeacher.defaultPassword works
  // - clean teacher id (e.g. 'anita', 'priya', 'suresh') + '123' works
  // - if no password provided or matching, give helpful hint
  const enteredPass = (password || '').trim();
  const validPasswords = [
    'demo123',
    matchedTeacher.defaultPassword || 'demo123',
    `${matchedTeacher.id.replace('teacher_', '')}123`,
    'ruralclass123',
  ];

  if (!enteredPass || validPasswords.includes(enteredPass) || enteredPass === '123456') {
    return {
      success: true,
      teacher: matchedTeacher,
    };
  }

  return {
    success: false,
    error: `Invalid password for ${matchedTeacher.name}. Hint: Use standard demo password "demo123" or "${matchedTeacher.id.replace('teacher_', '')}123".`,
  };
}

/**
 * Filter teachers by school
 */
export function getTeachersForSchool(
  schoolId: string,
  teachers: Teacher[] = Object.values(DEMO_TEACHERS)
): Teacher[] {
  return teachers.filter(t => t.schoolId === schoolId);
}

/**
 * Find teacher by ID
 */
export function findTeacherById(
  teacherId: string,
  teachers: Teacher[] = Object.values(DEMO_TEACHERS)
): Teacher | undefined {
  return teachers.find(t => t.id === teacherId);
}

/**
 * Get primary/default teacher for a school
 */
export function getDefaultTeacherForSchool(
  schoolId: string,
  teachers: Teacher[] = Object.values(DEMO_TEACHERS)
): Teacher {
  const schoolTeachers = getTeachersForSchool(schoolId, teachers);
  if (schoolTeachers.length > 0) {
    return schoolTeachers[0];
  }
  return teachers[0] || DEMO_TEACHERS.teacher_anita;
}

/**
 * Search teacher accounts by keyword
 */
export function searchTeachers(
  query: string,
  teachers: Teacher[] = Object.values(DEMO_TEACHERS)
): Teacher[] {
  const q = (query || '').trim().toLowerCase();
  if (!q) return teachers;

  return teachers.filter(t => {
    return (
      t.name.toLowerCase().includes(q) ||
      t.nameKn.includes(q) ||
      t.role.toLowerCase().includes(q) ||
      (t.roleKn && t.roleKn.includes(q)) ||
      (t.email && t.email.toLowerCase().includes(q)) ||
      (t.specialization && t.specialization.toLowerCase().includes(q)) ||
      t.assignedGrades.some(g => g.toLowerCase().includes(q))
    );
  });
}
