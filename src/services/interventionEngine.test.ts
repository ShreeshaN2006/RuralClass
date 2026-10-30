import test from 'node:test';
import assert from 'node:assert/strict';
import { evaluateStudentForIntervention, buildInterventionOptions } from './interventionEngine';
import { Student, Assessment } from '../types';
import { calculateLearningStatus, hasConsecutiveLowScores } from '../utils/scoringRules';

test('scoring rules calculate correct status thresholds', () => {
  assert.equal(calculateLearningStatus(45), 'Needs support');
  assert.equal(calculateLearningStatus(49), 'Needs support');
  assert.equal(calculateLearningStatus(50), 'Developing');
  assert.equal(calculateLearningStatus(65), 'Developing');
  assert.equal(calculateLearningStatus(70), 'Developing');
  assert.equal(calculateLearningStatus(71), 'On track');
  assert.equal(calculateLearningStatus(95), 'On track');
});

test('consecutive low scores detection works accurately', () => {
  assert.equal(hasConsecutiveLowScores([60, 48, 45]), true);
  assert.equal(hasConsecutiveLowScores([45, 75]), false);
  assert.equal(hasConsecutiveLowScores([40]), false); // needs at least 2
  assert.equal(hasConsecutiveLowScores([80, 85, 90]), false);
});

test('intervention engine generates explainable trigger for Rahul with low multiplication scores', () => {
  const dummyStudent: Student = {
    id: 'student_rahul',
    schoolId: 'school_hallikeri',
    name: 'Rahul',
    nameKn: 'ರಾಹುಲ್',
    grade: 'Grade 3',
    attendance: 91,
    absentCountThisMonth: 3,
    readingStatus: 'Good',
    mathStatus: 'Developing',
    overallStatus: 'Needs support',
    subjects: [
      { subject: 'Mathematics', level: 'Developing', averageScore: 55, status: 'Needs support', trend: 'down' },
      { subject: 'Kannada', level: 'Grade-level', averageScore: 78, status: 'On track', trend: 'stable' },
    ],
    teacherObservation: 'Understands basic addition but struggles with multiplication tables.',
    teacherObservationKn: 'ಮೂಲ ಸಂಕಲನ ತಿಳಿದಿದೆ ಆದರೆ ಗುಣಾಕಾರದಲ್ಲಿ ಸಮಸ್ಯೆ ಎದುರಿಸುತ್ತಿದ್ದಾನೆ.',
  };

  const assessments: Assessment[] = [
    {
      id: 'a1',
      studentId: 'student_rahul',
      schoolId: 'school_hallikeri',
      subject: 'Mathematics',
      topic: 'Addition with carrying',
      score: 11,
      maxScore: 20, // 55%
      date: '2026-10-15',
      observation: 'Solved 2-digit sums',
    },
    {
      id: 'a2',
      studentId: 'student_rahul',
      schoolId: 'school_hallikeri',
      subject: 'Mathematics',
      topic: 'Multiplication basics',
      score: 9,
      maxScore: 20, // 45% (<50%)
      date: '2026-10-22',
      observation: 'Struggled with table of 3',
    },
    {
      id: 'a3',
      studentId: 'student_rahul',
      schoolId: 'school_hallikeri',
      subject: 'Mathematics',
      topic: 'Multiplication tables',
      score: 9,
      maxScore: 20, // 45% (consecutive < 50%)
      date: '2026-10-28',
      observation: 'Needs concrete object practice',
    },
  ];

  const result = evaluateStudentForIntervention(dummyStudent, assessments);
  assert.ok(result !== null);
  assert.equal(result.needsIntervention, true);
  assert.equal(result.status, 'Needs support');
  assert.ok(result.ruleExplanation.includes('2 recent assessments below 50%'));

  const options = buildInterventionOptions(dummyStudent.name, dummyStudent.grade, 'Mathematics', 'Multiplication');
  assert.equal(options.length, 4, 'Should provide 4 practical choices for rural classroom');
  assert.ok(options.some(o => o.type === '10-min practice'));
  assert.ok(options.some(o => o.type === 'peer-learning'));
  assert.ok(options.some(o => o.type === 'low-resource worksheet'));
  assert.ok(options.some(o => o.type === 'teacher re-teaching'));
});
