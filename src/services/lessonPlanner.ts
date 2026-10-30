import { GradeLevel, LessonPlan, LessonPlanActivity, MultiGradeIndependentActivity, Subject } from '../types';

export interface LessonPlanInput {
  grade: GradeLevel;
  subject: Subject;
  topic: string;
  objective: string;
  durationMinutes: number;
  learningLevel: 'Beginner' | 'Developing' | 'Grade-level' | 'Advanced';
  materials: string[];
  schoolId: string;
  teacherId?: string;
  multiGradeEnabled?: boolean;
}

export const TOPIC_PRESETS: Record<Subject, string[]> = {
  Mathematics: [
    'Addition with Carrying',
    'Multiplication Tables (2-5)',
    'Single-digit Subtraction with Borrowing',
    'Fractions: Halves & Quarters',
    'Perimeter & Measurement with Scale',
  ],
  Kannada: [
    'Aksharamale Vowels & Consonants',
    'Ottakshara Reading & Writing',
    'Kavite Waachana: Belaku',
    'Simple Sentence Building',
    'Sandhi & Compound Words',
  ],
  English: [
    'Naming Words & Everyday Objects',
    'Action Verbs & Simple Sentences',
    'Opposites & Prepositions (in/on/under)',
    'Oral Rhymes & Phonics',
    'Short Paragraph: My Village',
  ],
  'Environmental Studies': [
    'Water Conservation in the Village',
    'Parts of Plants & Leaf Identification',
    'Food Chains & Local Wildlife',
    'Cleanliness & Personal Hygiene',
    'Our Community Helpers',
  ],
};

export const COMMON_MATERIALS = [
  'Blackboard & Chalk',
  'Textbook',
  'Student Notebooks',
  'Flashcards',
  'Local Objects (Tamarind seeds, stones, leaves)',
  'Chart Paper',
];

/**
 * Builds structured timed lesson plan steps based on duration
 */
export function generateLessonPlan(input: LessonPlanInput): LessonPlan {
  const { grade, subject, topic, objective, durationMinutes, learningLevel, materials, schoolId, teacherId = 'teacher_anita' } = input;

  // Split duration proportionally into 5 pedagogical phases:
  // 1. Introduction (10-15%)
  // 2. Teacher-led instruction (25-30%)
  // 3. Guided practice (25%)
  // 4. Independent / Peer activity (25%)
  // 5. Quick check / assessment (10-15%)
  let introMin = Math.max(3, Math.round(durationMinutes * 0.12));
  let teachMin = Math.max(5, Math.round(durationMinutes * 0.28));
  let guidedMin = Math.max(5, Math.round(durationMinutes * 0.25));
  let indepMin = Math.max(5, Math.round(durationMinutes * 0.25));
  let assessMin = durationMinutes - (introMin + teachMin + guidedMin + indepMin);
  if (assessMin < 3) {
    assessMin = 4;
    guidedMin -= 1;
  }

  const activities: LessonPlanActivity[] = [
    {
      phase: '1. Introduction & Hook',
      phaseKn: '1. ಪರಿಚಯ ಮತ್ತು ಆಸಕ್ತಿ ಮೂಡಿಸುವಿಕೆ',
      durationMin: introMin,
      teacherAction: `Connect ${topic} to daily rural life using concrete examples or questions. Demonstrate basic idea with local objects or quick chalk diagram.`,
      teacherActionKn: `ದೈನಂದಿನ ಗ್ರಾಮೀಣ ಜೀವನದ ಉದಾಹರಣೆಗಳನ್ನು ನೀಡಿ ವಿಷಯವನ್ನು ಪ್ರಾರಂಭಿಸಿ. ಕಲ್ಲು ಅಥವಾ ಬೀಜಗಳನ್ನು ಬಳಸಿ ಪರಿಕಲ್ಪನೆಯನ್ನು ತೋರಿಸಿ.`,
      studentAction: `Observe demonstration, respond to questions, and recall previous lesson concepts.`,
      studentActionKn: `ಶಿಕ್ಷಕರ ಉದಾಹರಣೆಗಳನ್ನು ಗಮನಿಸಿ ಮತ್ತು ಪ್ರಶ್ನೆಗಳಿಗೆ ಉತ್ತರಿಸಿ.`,
    },
    {
      phase: '2. Teacher-led Direct Instruction',
      phaseKn: '2. ಶಿಕ್ಷಕರ ನೇರ ಬೋಧನೆ',
      durationMin: teachMin,
      teacherAction: `Explain core concept on blackboard step-by-step. Break down rules clearly for ${learningLevel} level learners. Highlight common mistakes.`,
      teacherActionKn: `ಕಪ್ಪುಹಲಗೆಯ ಮೇಲೆ ಹಂತ-ಹಂತವಾಗಿ ಪರಿಕಲ್ಪನೆಯನ್ನು ವಿವರಿಸಿ. ಸಾಮಾನ್ಯ ತಪ್ಪುಗಳನ್ನು ತಿದ್ದಿ.`,
      studentAction: `Follow board steps in notebooks, repeat key terminology, and ask clarifying doubts.`,
      studentActionKn: `ಕಪ್ಪುಹಲಗೆಯ ಮೇಲಿನ ಹಂತಗಳನ್ನು ನೋಟ್‌ಬುಕ್‌ನಲ್ಲಿ ಬರೆದುಕೊಂಡು ಸಂಶಯಗಳನ್ನು ಕೇಳಿ.`,
    },
    {
      phase: '3. Guided Practice with Teacher',
      phaseKn: '3. ಮಾರ್ಗದರ್ಶಿತ ಅಭ್ಯಾಸ',
      durationMin: guidedMin,
      teacherAction: `Write 2-3 sample problems/sentences on blackboard. Guide the entire grade to solve together aloud before calling volunteers to board.`,
      teacherActionKn: `2-3 ಉದಾಹರಣೆಗಳನ್ನು ಹಲಗೆಯ ಮೇಲೆ ಬರೆದು ಎಲ್ಲರೊಂದಿಗೆ ಜೊತೆಯಾಗಿ ಪರಿಹರಿಸಿ.`,
      studentAction: `Solve in real time in notebooks, verify steps with neighbors, and volunteer answers.`,
      studentActionKn: `ನೋಟ್‌ಬುಕ್‌ನಲ್ಲಿ ಲೆಕ್ಕ ಮಾಡಿ ಜೊತೆಗಾರರೊಂದಿಗೆ ತಾಳೆ ನೋಡಿ.`,
    },
    {
      phase: '4. Independent / Peer Activity',
      phaseKn: '4. ಸ್ವತಂತ್ರ / ಜೊತೆಗಾರ ಅಭ್ಯಾಸ',
      durationMin: indepMin,
      teacherAction: `Assign 4 textbook or slate questions. Circulate quietly or allow independent work while attending to other classroom needs.`,
      teacherActionKn: `4 ಅಭ್ಯಾಸ ಪ್ರಶ್ನೆಗಳನ್ನು ನೀಡಿ ಸ್ವತಂತ್ರವಾಗಿ ಅಥವಾ ಜೋಡಿಯಾಗಿ ಮಾಡಲು ತಿಳಿಸಿ.`,
      studentAction: `Work independently on slates or paper, comparing answers in pairs once finished.`,
      studentActionKn: `ಹಲಗೆ ಅಥವಾ ನೋಟ್‌ಬುಕ್‌ನಲ್ಲಿ ಸ್ವತಂತ್ರವಾಗಿ ಲೆಕ್ಕ ಮಾಡಿ ಗೆಳೆಯರೊಂದಿಗೆ ಪರಿಶೀಲಿಸಿ.`,
    },
    {
      phase: '5. Quick Check & Summary',
      phaseKn: '5. ಸಂಕ್ಷಿಪ್ತ ಮೌಲ್ಯಮಾಪನ ಮತ್ತು ಮುಕ್ತಾಯ',
      durationMin: assessMin,
      teacherAction: `Ask 2 quick exit-ticket questions. Note students who need follow-up in RuralClass assessment tracker. Assign light home practice.`,
      teacherActionKn: `2 ಸರಳ ಮೌಖಿಕ ಪ್ರಶ್ನೆಗಳನ್ನು ಕೇಳಿ ಗ್ರಹಿಕೆಯನ್ನು ಪರೀಕ್ಷಿಸಿ. ಅನುಸರಣೆ ಅಗತ್ಯವಿರುವ ವಿದ್ಯಾರ್ಥಿಗಳನ್ನು ಗುರುತಿಸಿ.`,
      studentAction: `Answer check questions on slates, show slates to teacher, and note home practice.`,
      studentActionKn: `ಹಲಗೆಯ ಮೇಲೆ ಉತ್ತರ ಬರೆದು ಶಿಕ್ಷಕರಿಗೆ ತೋರಿಸಿ.`,
    },
  ];

  // Multi-Grade Activities for other grades running simultaneously
  const allGrades: GradeLevel[] = ['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5'];
  const otherGrades = allGrades.filter(g => g !== grade);

  const multiGradeActivities: MultiGradeIndependentActivity[] = otherGrades.map(g => {
    switch (g) {
      case 'Grade 1':
        return {
          grade: 'Grade 1',
          activityTitle: 'Number & Akshara Slate Practice',
          activityTitleKn: 'ಸಂಖ್ಯೆ ಮತ್ತು ಅಕ್ಷರ ಹಲಗೆ ಅಭ್ಯಾಸ',
          activityType: 'Independent',
          description: 'Count tamarind seeds from 1 to 20 and trace vowels on slates with chalk.',
          descriptionKn: 'ಹುಣಸೆ ಬೀಜಗಳನ್ನು 1 ರಿಂದ 20 ರವರೆಗೆ ಎಣಿಸಿ ಬಳಪದಿಂದ ಸ್ವರಗಳನ್ನು ಬರೆಯಿರಿ.',
        };
      case 'Grade 2':
        return {
          grade: 'Grade 2',
          activityTitle: 'Addition Flashcards & Reading',
          activityTitleKn: 'ಸಂಕಲನ ಕಾರ್ಡ್ ಮತ್ತು ವಾಚನ',
          activityType: 'Peer',
          description: 'Pair up with a partner to solve single-digit addition cards; check answers with sticks.',
          descriptionKn: 'ಜೊತೆಗಾರನೊಂದಿಗೆ ಸಂಕಲನ ಕಾರ್ಡ್‌ಗಳನ್ನು ಬಿಡಿಸಿ ಸಣ್ಣ ಕಡ್ಡಿಗಳಿಂದ ಉತ್ತರ ತಾಳೆ ನೋಡಿ.',
        };
      case 'Grade 3':
        return {
          grade: 'Grade 3',
          activityTitle: 'Multiplication Grid & Story Corner',
          activityTitleKn: 'ಗುಣಾಕಾರ ಪಟ್ಟಿ ಮತ್ತು ಕಥಾ ಮೂಲೆ',
          activityType: 'Independent',
          description: 'Fill 2x, 3x, and 4x multiplication table grid worksheet, then read textbook page 22.',
          descriptionKn: '2, 3 ಮತ್ತು 4 ರ ಮಗ್ಗಿ ಪಟ್ಟಿಯನ್ನು ಭರ್ತಿ ಮಾಡಿ ನಂತರ ಪಠ್ಯಪುಸ್ತಕದ ಪುಟ 22 ಓದಿ.',
        };
      case 'Grade 4':
        return {
          grade: 'Grade 4',
          activityTitle: 'Reading Comprehension & EVS Chart',
          activityTitleKn: 'ವಾಚನ ಗ್ರಹಿಕೆ ಮತ್ತು ಪರಿಸರ ನಕ್ಷೆ',
          activityType: 'Group',
          description: 'Read Chapter 3 Kannada story silently and answer 3 questions in notebooks.',
          descriptionKn: 'ಕನ್ನಡದ 3ನೇ ಅಧ್ಯಾಯವನ್ನು ಮೌನವಾಗಿ ಓದಿ 3 ಪ್ರಶ್ನೆಗಳಿಗೆ ಉತ್ತರ ಬರೆಯಿರಿ.',
        };
      case 'Grade 5':
        return {
          grade: 'Grade 5',
          activityTitle: 'Math Problem Solving & River Map',
          activityTitleKn: 'ಗಣಿತ ಲೆಕ್ಕ ಮತ್ತು ನದಿಗಳ ನಕ್ಷೆ',
          activityType: 'Peer',
          description: 'Solve perimeter problems on page 48; mark Karnataka rivers on notebook map outline.',
          descriptionKn: 'ಪುಟ 48 ರ ಸುತ್ತಳತೆ ಲೆಕ್ಕಗಳನ್ನು ಮಾಡಿ ನಕ್ಷೆಯಲ್ಲಿ ನದಿಗಳನ್ನು ಗುರುತಿಸಿ.',
        };
    }
  });

  return {
    id: `lp_${Date.now()}`,
    teacherId,
    schoolId,
    grade,
    subject,
    topic,
    objective: objective || `Students will demonstrate understanding of ${topic} through teacher guidance and structured practice.`,
    durationMinutes,
    learningLevel,
    materials: materials.length > 0 ? materials : ['Blackboard & Chalk', 'Textbook', 'Notebooks'],
    activities,
    multiGradeActivities,
    status: 'Ready',
    createdAt: new Date().toISOString(),
  };
}
