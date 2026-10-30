import test from 'node:test';
import assert from 'node:assert/strict';
import {
  authenticateTeacher,
  getAvailableTeacherLogins,
  getTeachersForSchool,
  findTeacherById,
  getDefaultTeacherForSchool,
  searchTeachers,
} from './authService';
import { DEMO_TEACHERS } from '../data/mockData';

test('getAvailableTeacherLogins returns all 11 teacher logins enriched with school info', () => {
  const logins = getAvailableTeacherLogins();
  assert.equal(logins.length, 11);
  const anita = logins.find(l => l.id === 'teacher_anita');
  assert.ok(anita);
  assert.equal(anita.schoolId, 'school_hallikeri');
  assert.equal(anita.defaultPassword, 'demo123');

  const suresh = logins.find(l => l.id === 'teacher_suresh');
  assert.ok(suresh);
  assert.equal(suresh.schoolId, 'school_belagavi');

  const renuka = logins.find(l => l.id === 'teacher_renuka');
  assert.ok(renuka);
  assert.equal(renuka.schoolId, 'school_kundgol');
});

test('authenticateTeacher authenticates by ID with standard demo123 password', () => {
  const result = authenticateTeacher('teacher_anita', 'demo123');
  assert.equal(result.success, true);
  assert.ok(result.teacher);
  assert.equal(result.teacher.id, 'teacher_anita');
});

test('authenticateTeacher allows prefix-less ID like "anita" or "priya"', () => {
  const res1 = authenticateTeacher('anita', 'demo123');
  assert.equal(res1.success, true);
  assert.equal(res1.teacher?.id, 'teacher_anita');

  const res2 = authenticateTeacher('priya', 'priya123');
  assert.equal(res2.success, true);
  assert.equal(res2.teacher?.id, 'teacher_priya');
});

test('authenticateTeacher allows authentication by official teacher email', () => {
  const res = authenticateTeacher('suresh.angadi@ruralclass.edu.in', 'demo123');
  assert.equal(res.success, true);
  assert.equal(res.teacher?.id, 'teacher_suresh');
  assert.equal(res.teacher?.schoolId, 'school_belagavi');
});

test('authenticateTeacher rejects unknown account and provides helpful message', () => {
  const res = authenticateTeacher('non_existent_teacher', 'demo123');
  assert.equal(res.success, false);
  assert.match(res.error || '', /not found/i);
});

test('authenticateTeacher rejects invalid password and provides helpful hint', () => {
  const res = authenticateTeacher('teacher_anita', 'wrong_pass_xyz');
  assert.equal(res.success, false);
  assert.match(res.error || '', /Invalid password/i);
  assert.match(res.error || '', /demo123/i);
});

test('getTeachersForSchool returns correct teacher list per school', () => {
  const hallikeriTeachers = getTeachersForSchool('school_hallikeri');
  assert.equal(hallikeriTeachers.length, 5);
  assert.ok(hallikeriTeachers.some(t => t.id === 'teacher_anita'));
  assert.ok(hallikeriTeachers.some(t => t.id === 'teacher_manjunath'));

  const belagaviTeachers = getTeachersForSchool('school_belagavi');
  assert.equal(belagaviTeachers.length, 4);
  assert.ok(belagaviTeachers.some(t => t.id === 'teacher_suresh'));
  assert.ok(belagaviTeachers.some(t => t.id === 'teacher_meena'));

  const kundgolTeachers = getTeachersForSchool('school_kundgol');
  assert.equal(kundgolTeachers.length, 2);
  assert.ok(kundgolTeachers.some(t => t.id === 'teacher_renuka'));
});

test('searchTeachers filters properly by name, role or grade', () => {
  const mathTeachers = searchTeachers('math');
  assert.ok(mathTeachers.length >= 3);

  const naliKali = searchTeachers('Nali-Kali');
  assert.ok(naliKali.length >= 1);
  assert.equal(naliKali[0].id, 'teacher_deepa');

  const kannadaQuery = searchTeachers('ಮೀನಾ');
  assert.equal(kannadaQuery.length, 1);
  assert.equal(kannadaQuery[0].id, 'teacher_meena');
});
