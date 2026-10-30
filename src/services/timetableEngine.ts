import { GradeLevel, Subject, Timetable, TimetableConfig, TimetablePeriodAssignment } from '../types';

export interface ActivityTemplate {
  subject: Subject;
  topic: string;
  topicKn: string;
  independentTasks: { title: string; titleKn: string; type: 'Independent' | 'Group' | 'Peer'; desc: string; descKn: string }[];
}

export const GRADE_ACTIVITIES: Record<GradeLevel, ActivityTemplate[]> = {
  'Grade 1': [
    {
      subject: 'Mathematics',
      topic: 'Number recognition 1-20',
      topicKn: 'ಸಂಖ್ಯೆ ಗುರುತಿಸುವಿಕೆ 1-20',
      independentTasks: [
        { title: 'Tamarind Seed Counting', titleKn: 'ಹುಣಸೆ ಬೀಜಗಳ ಎಣಿಕೆ', type: 'Independent', desc: 'Count and group tamarind seeds into sets of 5', descKn: 'ಹುಣಸೆ ಬೀಜಗಳನ್ನು 5 ರ ಗುಂಪುಗಳಾಗಿ ಎಣಿಸಿ' },
        { title: 'Slate Number Tracing', titleKn: 'ಹಲಗೆಯ ಮೇಲೆ ಸಂಖ್ಯೆ ಬರೆಯುವುದು', type: 'Independent', desc: 'Trace numbers 1 to 10 on slate with chalk', descKn: 'ಹಲಗೆಯ ಮೇಲೆ 1 ರಿಂದ 10 ರವರೆಗೆ ಬಳಪದಿಂದ ಬರೆಯಿರಿ' },
      ],
    },
    {
      subject: 'Kannada',
      topic: 'Aksharamale vowels',
      topicKn: 'ಕನ್ನಡ ವರ್ಣಮಾಲೆ ಸ್ವರಗಳು',
      independentTasks: [
        { title: 'Vowel Flashcard Match', titleKn: 'ಸ್ವರ ಕಾರ್ಡ್ ಹೊಂದಾಣಿಕೆ', type: 'Peer', desc: 'Pair up with classmate to match sound flashcards', descKn: 'ಜೊತೆಗಾರನೊಂದಿಗೆ ಸ್ವರ ಕಾರ್ಡ್‌ಗಳನ್ನು ಹೊಂದಿಸಿ' },
        { title: 'Letter Clay Modeling', titleKn: 'ಮಣ್ಣಿನ ಅಕ್ಷರ ರಚನೆ', type: 'Independent', desc: 'Form simple letters using clay or sand tray', descKn: 'ಮರಳಿನ ತಟ್ಟೆಯಲ್ಲಿ ಅಕ್ಷರಗಳನ್ನು ಬರೆಯಿರಿ' },
      ],
    },
    {
      subject: 'Environmental Studies',
      topic: 'My Family & School',
      topicKn: 'ನನ್ನ ಕುಟುಂಬ ಮತ್ತು ಶಾಲೆ',
      independentTasks: [
        { title: 'Family Tree Drawing', titleKn: 'ಕುಟುಂಬದ ಚಿತ್ರ ಬಿಡಿಸುವುದು', type: 'Independent', desc: 'Draw pictures of home and school objects', descKn: 'ಮನೆ ಮತ್ತು ಶಾಲೆಯ ವಸ್ತುಗಳ ಚಿತ್ರ ಬಿಡಿಸಿ' },
      ],
    },
    {
      subject: 'English',
      topic: 'Oral rhymes & Alphabet A-H',
      topicKn: 'ಸರಳ ಇಂಗ್ಲಿಷ್ ಕವನಗಳು',
      independentTasks: [
        { title: 'Picture Word Matching', titleKn: 'ಚಿತ್ರ ಪದ ಹೊಂದಾಣಿಕೆ', type: 'Group', desc: 'Identify apple, ball, cat using chart cards', descKn: 'ಚಿತ್ರ ಕಾರ್ಡ್ ನೋಡಿ ಪದಗಳನ್ನು ಗುರುತಿಸಿ' },
      ],
    },
  ],
  'Grade 2': [
    {
      subject: 'Mathematics',
      topic: 'Single-digit addition & shapes',
      topicKn: 'ಏಕ ಅಂಕಿಯ ಸಂಕಲನ ಮತ್ತು ಆಕಾರಗಳು',
      independentTasks: [
        { title: 'Pebble Addition Card', titleKn: 'ಸಣ್ಣ ಕಲ್ಲುಗಳ ಸಂಕಲನ', type: 'Independent', desc: 'Solve 6 addition sums using pebbles or sticks', descKn: 'ಕಲ್ಲುಗಳನ್ನು ಬಳಸಿ 6 ಸಂಕಲನ ಲೆಕ್ಕಗಳನ್ನು ಬಿಡಿಸಿ' },
        { title: '2D Shape Tracing', titleKn: 'ಆಕಾರ ಗುರುತಿಸುವಿಕೆ', type: 'Peer', desc: 'Find triangle, circle, square shapes in classroom', descKn: 'ತರಗತಿಯಲ್ಲಿರುವ ವಿವಿಧ ಆಕಾರಗಳನ್ನು ಗುರುತಿಸಿ' },
      ],
    },
    {
      subject: 'Kannada',
      topic: 'Vyanjanagalu & simple words',
      topicKn: 'ವ್ಯಂಜನಗಳು ಮತ್ತು ಸರಳ ಪದಗಳು',
      independentTasks: [
        { title: 'Notebook Word Copying', titleKn: 'ಪುಸ್ತಕದಲ್ಲಿ ಪದ ಬರೆಯುವುದು', type: 'Independent', desc: 'Write 5 simple two-letter words in notebook', descKn: 'ನೋಟ್‌ಬುಕ್‌ನಲ್ಲಿ 5 ಸರಳ ಎರಡು ಅಕ್ಷರದ ಪದ ಬರೆಯಿರಿ' },
      ],
    },
    {
      subject: 'Environmental Studies',
      topic: 'Plants around us',
      topicKn: 'ನಮ್ಮ ಸುತ್ತಲಿನ ಸಸ್ಯಗಳು',
      independentTasks: [
        { title: 'Leaf Outline Scrapbook', titleKn: 'ಎಲೆಗಳ ಸಂಗ್ರಹ', type: 'Group', desc: 'Sort collected school garden leaves by size', descKn: 'ಶಾಲಾ ತೋಟದ ಎಲೆಗಳನ್ನು ಗಾತ್ರದ ಪ್ರಕಾರ ವಿಂಗಡಿಸಿ' },
      ],
    },
    {
      subject: 'English',
      topic: 'Naming words',
      topicKn: 'ನಾಮಪದಗಳು',
      independentTasks: [
        { title: 'Object Naming Cards', titleKn: 'ವಸ್ತುಗಳ ಹೆಸರು ಬರೆಯುವುದು', type: 'Independent', desc: 'Write names of classroom items (pen, bag, book)', descKn: 'ತರಗತಿಯ ವಸ್ತುಗಳ ಹೆಸರುಗಳನ್ನು ಇಂಗ್ಲಿಷ್‌ನಲ್ಲಿ ಬರೆಯಿರಿ' },
      ],
    },
  ],
  'Grade 3': [
    {
      subject: 'Mathematics',
      topic: 'Multiplication & 2-digit addition with carrying',
      topicKn: 'ಗುಣಾಕಾರ ಮತ್ತು ದಶಕ ಸಹಿತ ಸಂಕಲನ',
      independentTasks: [
        { title: 'Multiplication Grid Sheet', titleKn: 'ಗುಣಾಕಾರ ಪಟ್ಟಿ ಅಭ್ಯಾಸ', type: 'Independent', desc: 'Complete multiplication table grid for 2, 3, 4', descKn: '2, 3, 4 ರ ಮಗ್ಗಿ ಪಟ್ಟಿಯನ್ನು ಪೂರ್ಣಗೊಳಿಸಿ' },
        { title: 'Word Problem Buddy Check', titleKn: 'ಸಮಸ್ಯೆ ಪರಿಹಾರ ಜೋಡಿ ಪರೀಕ್ಷೆ', type: 'Peer', desc: 'Solve 2 real-life shopkeeper problems in pairs', descKn: 'ವ್ಯಾಪಾರದ ಎರಡು ಲೆಕ್ಕಗಳನ್ನು ಜೊತೆಯಾಗಿ ಪರಿಹರಿಸಿ' },
      ],
    },
    {
      subject: 'Kannada',
      topic: 'Kavite reading & Gunithaksharagalu',
      topicKn: 'ಕವಿತೆ ವಾಚನ ಮತ್ತು ಗುಣಿತಾಕ್ಷರಗಳು',
      independentTasks: [
        { title: 'Silent Reading Corner', titleKn: 'ಮೌನ ವಾಚನ ಮೂಲೆ', type: 'Independent', desc: 'Read textbook story page 24 and list new words', descKn: 'ಪುಸ್ತಕದ ಪುಟ 24 ಓದಿ ಹೊಸ ಪದಗಳನ್ನು ಪಟ್ಟಿ ಮಾಡಿ' },
      ],
    },
    {
      subject: 'Environmental Studies',
      topic: 'Water sources and conservation',
      topicKn: 'ನೀರಿನ ಮೂಲಗಳು ಮತ್ತು ಸಂರಕ್ಷಣೆ',
      independentTasks: [
        { title: 'Water Use Charting', titleKn: 'ನೀರಿನ ಬಳಕೆಯ ಪಟ್ಟಿ', type: 'Group', desc: 'Create a chart on village water usage and saving tips', descKn: 'ಹಳ್ಳಿಯ ನೀರಿನ ಬಳಕೆ ಮತ್ತು ಉಳಿತಾಯದ ಪಟ್ಟಿ ಮಾಡಿ' },
      ],
    },
    {
      subject: 'English',
      topic: 'Simple sentence construction',
      topicKn: 'ಸರಳ ವಾಕ್ಯ ರಚನೆ',
      independentTasks: [
        { title: 'Fill-in-the-blank Card', titleKn: 'ಬಿಟ್ಟ ಸ್ಥಳ ತುಂಬುವ ಕಾರ್ಡ್', type: 'Independent', desc: 'Complete sentences using is / are / am', descKn: 'is / are ಬಳಸಿ ವಾಕ್ಯಗಳನ್ನು ಪೂರ್ಣಗೊಳಿಸಿ' },
      ],
    },
  ],
  'Grade 4': [
    {
      subject: 'Mathematics',
      topic: 'Division basics & fractions',
      topicKn: 'ಭಾಗಾಕಾರ ಮತ್ತು ಭಿನ್ನರಾಶಿಗಳು',
      independentTasks: [
        { title: 'Fraction Paper Folding', titleKn: 'ಕಾಗದ ಮಡಚಿ ಭಿನ್ನರಾಶಿ ತಿಳಿಯುವುದು', type: 'Independent', desc: 'Fold square paper to show 1/2, 1/4 and 3/4', descKn: 'ಕಾಗದವನ್ನು ಮಡಚಿ 1/2 ಮತ್ತು 1/4 ಭಾಗಗಳನ್ನು ತೋರಿಸಿ' },
        { title: 'Division Practice Card', titleKn: 'ಭಾಗಾಕಾರ ಅಭ್ಯಾಸ ಕಾರ್ಡ್', type: 'Peer', desc: 'Verify division with remainder using check formula', descKn: 'ಶೇಷ ಸಹಿತ ಭಾಗಾಕಾರ ಲೆಕ್ಕಗಳನ್ನು ಪರಿಶೀಲಿಸಿ' },
      ],
    },
    {
      subject: 'Kannada',
      topic: 'Gadya lesson reading & comprehension',
      topicKn: 'ಗದ್ಯ ಪಾಠ ವಾಚನ ಮತ್ತು ಗ್ರಹಿಕೆ',
      independentTasks: [
        { title: 'Question & Answer Exercise', titleKn: 'ಪ್ರಶ್ನೋತ್ತರ ಅಭ್ಯಾಸ', type: 'Independent', desc: 'Answer 3 comprehension questions from chapter 4', descKn: 'ಅಧ್ಯಾಯ 4 ರಿಂದ 3 ಪ್ರಶ್ನೆಗಳಿಗೆ ಉತ್ತರ ಬರೆಯಿರಿ' },
      ],
    },
    {
      subject: 'Environmental Studies',
      topic: 'Our Community & Food chains',
      topicKn: 'ನಮ್ಮ ಸಮುದಾಯ ಮತ್ತು ಆಹಾರ ಸರಪಳಿ',
      independentTasks: [
        { title: 'Food Chain Diagram', titleKn: 'ಆಹಾರ ಸರಪಳಿಯ ನಕ್ಷೆ', type: 'Group', desc: 'Draw producer-consumer-decomposer cycle', descKn: 'ಉತ್ಪಾದಕ ಮತ್ತು ಗ್ರಾಹಕರ ಸರಪಳಿ ಚಿತ್ರ ಬಿಡಿಸಿ' },
      ],
    },
    {
      subject: 'English',
      topic: 'Opposites & Action words',
      topicKn: 'ವಿರುದ್ಧ ಪದಗಳು ಮತ್ತು ಕ್ರಿಯಾಪದಗಳು',
      independentTasks: [
        { title: 'Vocabulary Crossword', titleKn: 'ಪದಬಂಧ ಕಾರ್ಡ್', type: 'Independent', desc: 'Write antonyms for 10 common verbs', descKn: '10 ಸಾಮಾನ್ಯ ಕ್ರಿಯಾಪದಗಳಿಗೆ ವಿರುದ್ಧ ಪದಗಳನ್ನು ಬರೆಯಿರಿ' },
      ],
    },
  ],
  'Grade 5': [
    {
      subject: 'Mathematics',
      topic: 'Geometry angles, perimeter & area',
      topicKn: 'ಕೋನಗಳು, ಸುತ್ತಳತೆ ಮತ್ತು ವಿಸ್ತೀರ್ಣ',
      independentTasks: [
        { title: 'Perimeter Measurement', titleKn: 'ಮೇಜಿನ ಸುತ್ತಳತೆ ಅಳತೆ', type: 'Peer', desc: 'Measure classroom desk and blackboard perimeter with scale', descKn: 'ಸ್ಕೇಲ್ ಬಳಸಿ ತರಗತಿಯ ಮೇಜು ಮತ್ತು ಕಪ್ಪುಹಲಗೆಯ ಸುತ್ತಳತೆ ಅಳೆಯಿರಿ' },
      ],
    },
    {
      subject: 'Environmental Studies',
      topic: 'Natural resources of Karnataka',
      topicKn: 'ಕರ್ನಾಟಕದ ನೈಸರ್ಗಿಕ ಸಂಪನ್ಮೂಲಗಳು',
      independentTasks: [
        { title: 'Karnataka River Map', titleKn: 'ಕರ್ನಾಟಕದ ನದಿಗಳ ನಕ್ಷೆ', type: 'Independent', desc: 'Mark Krishna and Kaveri river paths in outline map', descKn: 'ಕರ್ನಾಟಕದ ನಕ್ಷೆಯಲ್ಲಿ ಕೃಷ್ಣಾ ಮತ್ತು ಕಾವೇರಿ ನದಿಗಳನ್ನು ಗುರುತಿಸಿ' },
      ],
    },
    {
      subject: 'Kannada',
      topic: 'Vyakaran - Sandhi and Samasa',
      topicKn: 'ಕನ್ನಡ ವ್ಯಾಕರಣ - ಸಂಧಿಗಳು',
      independentTasks: [
        { title: 'Sandhi Split Practice', titleKn: 'ಸಂಧಿ ಬಿಡಿಸಿ ಬರೆಯುವ ಅಭ್ಯಾಸ', type: 'Independent', desc: 'Split 6 compound Kannada words into root components', descKn: '6 ಸಂಯುಕ್ತ ಪದಗಳನ್ನು ಬಿಡಿಸಿ ಸಂಧಿ ಹೆಸರಿಸಿ' },
      ],
    },
    {
      subject: 'English',
      topic: 'Short paragraph writing',
      topicKn: 'ಕಿರು ಪ್ರಬಂಧ ರಚನೆ',
      independentTasks: [
        { title: 'Paragraph on Village Fair', titleKn: 'ಗ್ರಾಮದ ಜಾತ್ರೆಯ ಕುರಿತು ಪ್ರಬಂಧ', type: 'Independent', desc: 'Write 5 connected sentences describing the village market', descKn: 'ಗ್ರಾಮದ ಸಂತೆಯ ಕುರಿತು 5 ವಾಕ್ಯಗಳನ್ನು ಬರೆಯಿರಿ' },
      ],
    },
  ],
};

/**
 * Format minutes offset from 09:00 AM into human-readable HH:MM format
 */
export function formatTimeSlot(startMinutesFrom9AM: number, durationMinutes: number): string {
  const startTotalMinutes = 9 * 60 + startMinutesFrom9AM;
  const endTotalMinutes = startTotalMinutes + durationMinutes;

  const formatHMM = (totalMin: number) => {
    let hours = Math.floor(totalMin / 60);
    const mins = totalMin % 60;
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours > 12 ? hours - 12 : hours;
    return `${displayHours}:${mins.toString().padStart(2, '0')} ${ampm}`;
  };

  return `${formatHMM(startTotalMinutes)} - ${formatHMM(endTotalMinutes)}`;
}

/**
 * Generates a conflict-free multi-grade timetable.
 * Guarantee: Exactly 1 grade is Teacher-Led per period.
 * All other active grades have independent / peer / group work.
 * Avoids consecutive same-grade teacher instruction whenever possible.
 */
export function generateConflictFreeTimetable(
  config: TimetableConfig,
  teacherId: string = 'teacher_anita'
): Timetable {
  const { schoolId, grades, subjects, periodCount, periodDurationMin } = config;

  if (grades.length === 0) {
    throw new Error('Please select at least one grade to generate a timetable.');
  }

  const periods: TimetablePeriodAssignment[] = [];
  let lastAssignedGrade: GradeLevel | null = null;

  for (let p = 0; p < periodCount; p++) {
    // Choose which grade receives teacher instruction this period
    // Prefer round-robin among active grades while avoiding lastAssignedGrade
    let chosenGrade: GradeLevel;
    if (grades.length === 1) {
      chosenGrade = grades[0];
    } else {
      // Find candidate grades that are not the same as lastAssignedGrade
      const candidates = grades.filter(g => g !== lastAssignedGrade);
      const indexInCandidates = p % candidates.length;
      chosenGrade = candidates[indexInCandidates];
    }
    lastAssignedGrade = chosenGrade;

    // Pick a subject for the teacher-led grade (cycling subjects)
    const subjectIndex = (p + grades.indexOf(chosenGrade)) % subjects.length;
    const chosenSubject = subjects[subjectIndex];

    // Find a matching template topic
    const gradeTemplates = GRADE_ACTIVITIES[chosenGrade] || [];
    const matchedTemplate = gradeTemplates.find(t => t.subject === chosenSubject) || gradeTemplates[0] || {
      subject: chosenSubject,
      topic: `${chosenSubject} Core Concept`,
      topicKn: `${chosenSubject} ಮೂಲ ಪರಿಕಲ್ಪನೆ`,
      independentTasks: [{ title: 'Workbook Exercise', titleKn: 'ಅಭ್ಯಾಸ ಪುಸ್ತಕ', type: 'Independent', desc: 'Solve exercises', descKn: 'ಅಭ್ಯಾಸ ಬಿಡಿಸಿ' }]
    };

    // Calculate time slot (account for a 20 min morning break after period 2)
    let minutesOffset = p * periodDurationMin;
    if (p >= 2) {
      minutesOffset += 20; // 20-minute morning interval
    }
    const timeSlot = formatTimeSlot(minutesOffset, periodDurationMin);

    // Build activities for every active grade
    const gradeActivities: Record<GradeLevel, {
      type: 'Teacher-led' | 'Independent' | 'Group' | 'Peer';
      activity: string;
      activityKn: string;
      subject: Subject;
    }> = {} as any;

    grades.forEach(grade => {
      if (grade === chosenGrade) {
        gradeActivities[grade] = {
          type: 'Teacher-led',
          activity: `Direct Instruction: ${matchedTemplate.topic}`,
          activityKn: `ಶಿಕ್ಷಕರ ನೇರ ಬೋಧನೆ: ${matchedTemplate.topicKn}`,
          subject: chosenSubject,
        };
      } else {
        // Independent / Group / Peer task
        const otherGradeTemplates = GRADE_ACTIVITIES[grade] || [];
        const otherTemplate = otherGradeTemplates[p % otherGradeTemplates.length];
        const task = otherTemplate?.independentTasks?.[0] || {
          title: 'Reading & Worksheet Practice',
          titleKn: 'ವಾಚನ ಮತ್ತು ಅಭ್ಯಾಸ ಹಾಳೆ',
          type: 'Independent' as const,
          desc: 'Complete scheduled chapter exercise in notebook',
          descKn: 'ನೋಟ್‌ಬುಕ್‌ನಲ್ಲಿ ಅಧ್ಯಾಯದ ಅಭ್ಯಾಸವನ್ನು ಪೂರ್ಣಗೊಳಿಸಿ',
        };

        gradeActivities[grade] = {
          type: task.type,
          activity: `${task.title} (${otherTemplate?.subject || 'Practice'})`,
          activityKn: `${task.titleKn} (${otherTemplate?.subject || 'ಅಭ್ಯಾಸ'})`,
          subject: otherTemplate?.subject || 'Mathematics',
        };
      }
    });

    periods.push({
      periodNumber: p + 1,
      timeSlot,
      teacherLedGrade: chosenGrade,
      teacherLedSubject: chosenSubject,
      teacherLedTopic: matchedTemplate.topic,
      teacherLedTopicKn: matchedTemplate.topicKn,
      status: p === 0 ? 'In progress' : 'Ready',
      gradeActivities,
    });
  }

  // Generate explainability rationale
  const gradeNames = grades.join(', ');
  const rationale = `Conflict-free schedule verified: The teacher is assigned to direct instruction for one grade at a time, rotating across ${grades.length} grades (${gradeNames}). Non-instructed grades receive age-appropriate independent counting, reading, or peer-collaboration tasks requiring zero digital overhead. A 20-minute recess is factored after Period 2.`;
  const rationaleKn = `ಸಂಘರ್ಷ-ಮುಕ್ತ ವೇಳಾಪಟ್ಟಿ ದೃಢೀಕರಿಸಲಾಗಿದೆ: ಶಿಕ್ಷಕರು ಪ್ರತಿ ಅವಧಿಯಲ್ಲಿ ಕೇವಲ ಒಂದು ತರಗತಿಗೆ ನೇರ ಬೋಧನೆ ನೀಡುತ್ತಾರೆ (${grades.length} ತರಗತಿಗಳು: ${gradeNames}). ಉಳಿದ ತರಗತಿಗಳಿಗೆ ವಯೋಮಾನಕ್ಕೆ ತಕ್ಕಂತೆ ಸ್ವತಂತ್ರ ಅಭ್ಯಾಸ, ಮೌನ ವಾಚನ ಮತ್ತು ಜೊತೆಗಾರ ಚಟುವಟಿಕೆಗಳನ್ನು ನಿಗದಿಪಡಿಸಲಾಗಿದೆ. ಎರಡನೇ ಅವಧಿಯ ನಂತರ 20 ನಿಮಿಷಗಳ ವಿಶ್ರಾಂತಿ ಸಮಯವನ್ನು ಸೇರಿಸಲಾಗಿದೆ.`;

  return {
    id: `tt_${Date.now()}`,
    schoolId,
    teacherId,
    day: 'Today (Demo Schedule)',
    config,
    periods,
    rationale,
    rationaleKn,
    accepted: true,
    createdAt: new Date().toISOString(),
  };
}
