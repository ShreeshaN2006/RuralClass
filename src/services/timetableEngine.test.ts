import test from 'node:test';
import assert from 'node:assert/strict';
import { generateConflictFreeTimetable } from './timetableEngine';
import { TimetableConfig, GradeLevel } from '../types';

test('timetable engine generates conflict-free schedule for 5 grades', () => {
  const config: TimetableConfig = {
    schoolId: 'school_hallikeri',
    grades: ['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5'],
    subjects: ['Mathematics', 'Kannada', 'English', 'Environmental Studies'],
    periodCount: 6,
    periodDurationMin: 40,
    startTime: '09:00 AM',
  };

  const timetable = generateConflictFreeTimetable(config, 'teacher_anita');

  assert.equal(timetable.periods.length, 6, 'Should generate exactly 6 periods');

  // Verify that in each period:
  // 1. Exactly one grade is teacher-led
  // 2. All other grades have independent, group, or peer activities
  // 3. The teacher is never assigned to two grades simultaneously
  timetable.periods.forEach((period, idx) => {
    assert.ok(period.teacherLedGrade, `Period ${idx + 1} must have a teacher-led grade`);

    const assignedTeacherGrades: GradeLevel[] = [];
    Object.entries(period.gradeActivities).forEach(([grade, act]) => {
      if (act.type === 'Teacher-led') {
        assignedTeacherGrades.push(grade as GradeLevel);
      }
    });

    assert.equal(
      assignedTeacherGrades.length,
      1,
      `Period ${idx + 1} must have EXACTLY ONE teacher-led grade, got: ${assignedTeacherGrades.join(', ')}`
    );
    assert.equal(
      assignedTeacherGrades[0],
      period.teacherLedGrade,
      `Period ${idx + 1} teacherLedGrade must match the one with Teacher-led activity`
    );

    // Verify all 5 grades are present in gradeActivities
    config.grades.forEach(g => {
      assert.ok(period.gradeActivities[g], `Period ${idx + 1} must assign an activity for ${g}`);
    });
  });

  // Verify explainability rationale is populated
  assert.ok(timetable.rationale.length > 20, 'Timetable must include an explainable rationale');
  assert.ok(timetable.rationaleKn.length > 20, 'Timetable must include Kannada rationale');
});

test('timetable engine throws error if no grades selected', () => {
  const emptyConfig: TimetableConfig = {
    schoolId: 'school_hallikeri',
    grades: [],
    subjects: ['Mathematics'],
    periodCount: 4,
    periodDurationMin: 40,
    startTime: '09:00 AM',
  };

  assert.throws(() => {
    generateConflictFreeTimetable(emptyConfig);
  }, /Please select at least one grade/);
});
