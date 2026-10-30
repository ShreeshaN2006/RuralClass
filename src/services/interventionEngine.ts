import { Assessment, GradeLevel, InterventionOption, InterventionSuggestion, LearningStatus, Student, Subject } from '../types';
import { calculateLearningStatus, hasConsecutiveLowScores } from '../utils/scoringRules';

export interface RuleEvaluationResult {
  needsIntervention: boolean;
  status: LearningStatus;
  ruleExplanation: string;
  ruleExplanationKn: string;
  topic: string;
  topicKn: string;
  subject: Subject;
  recentScore: number;
}

/**
 * Deterministically evaluates whether a student needs an intervention suggestion
 * based on transparent, explainable educational rules.
 */
export function evaluateStudentForIntervention(
  student: Student,
  assessments: Assessment[]
): RuleEvaluationResult | null {
  // Filter assessments for this student
  const studentAssessments = assessments.filter(a => a.studentId === student.id);

  if (studentAssessments.length === 0) {
    // Fall back to student subject levels
    const lowSubject = student.subjects.find(s => s.status === 'Needs support' || s.averageScore < 50);
    if (lowSubject) {
      return {
        needsIntervention: true,
        status: 'Needs support',
        ruleExplanation: `Reason: Overall ${lowSubject.subject} average (${lowSubject.averageScore}%) is below 50% support threshold.`,
        ruleExplanationKn: `ಕಾರಣ: ${lowSubject.subject} ವಿಷಯದಲ್ಲಿ ಒಟ್ಟಾರೆ ಸರಾಸರಿ (${lowSubject.averageScore}%) 50% ಕ್ಕಿಂತ ಕಡಿಮೆಯಿದೆ.`,
        topic: lowSubject.subject === 'Mathematics' ? 'Multiplication' : 'Reading comprehension',
        topicKn: lowSubject.subject === 'Mathematics' ? 'ಗುಣಾಕಾರ' : 'ವಾಚನ ಗ್ರಹಿಕೆ',
        subject: lowSubject.subject,
        recentScore: lowSubject.averageScore,
      };
    }
    return null;
  }

  // Check last assessments sorted by date
  const sorted = [...studentAssessments].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const percentages = sorted.map(a => Math.round((a.score / a.maxScore) * 100));
  const latestAssessment = sorted[sorted.length - 1];
  const latestPercentage = percentages[percentages.length - 1];

  // Rule 1: Two consecutive scores below 50%
  if (hasConsecutiveLowScores(percentages, 50)) {
    return {
      needsIntervention: true,
      status: 'Needs support',
      ruleExplanation: `Reason: 2 recent assessments below 50% in ${latestAssessment.subject} (${latestAssessment.topic}: ${latestPercentage}%).`,
      ruleExplanationKn: `ಕಾರಣ: ${latestAssessment.subject} ವಿಷಯದಲ್ಲಿ ಇತ್ತೀಚಿನ 2 ಮೌಲ್ಯಮಾಪನಗಳು 50% ಕ್ಕಿಂತ ಕಡಿಮೆ (${latestAssessment.topic}: ${latestPercentage}%).`,
      topic: latestAssessment.topic,
      topicKn: latestAssessment.topicKn || latestAssessment.topic,
      subject: latestAssessment.subject,
      recentScore: latestPercentage,
    };
  }

  // Rule 2: Single latest score below 50%
  if (latestPercentage < 50) {
    return {
      needsIntervention: true,
      status: 'Needs support',
      ruleExplanation: `Reason: Latest assessment in ${latestAssessment.topic} was ${latestPercentage}% (below 50% threshold).`,
      ruleExplanationKn: `ಕಾರಣ: ${latestAssessment.topic} ವಿಷಯದಲ್ಲಿ ಇತ್ತೀಚಿನ ಅಂಕ ${latestPercentage}% (50% ಕ್ಕಿಂತ ಕಡಿಮೆ).`,
      topic: latestAssessment.topic,
      topicKn: latestAssessment.topicKn || latestAssessment.topic,
      subject: latestAssessment.subject,
      recentScore: latestPercentage,
    };
  }

  // Rule 3: 50% - 60% developing requiring follow-up
  if (latestPercentage < 60) {
    return {
      needsIntervention: true,
      status: 'Follow-up',
      ruleExplanation: `Reason: Developing performance in ${latestAssessment.topic} (${latestPercentage}%). Follow-up reinforcement recommended.`,
      ruleExplanationKn: `ಕಾರಣ: ${latestAssessment.topic} ವಿಷಯದಲ್ಲಿ ಕಲಿಕೆ ಸುಧಾರಿಸುತ್ತಿದೆ (${latestPercentage}%). ಅನುಸರಣಾ ಅಭ್ಯಾಸ ಶಿಫಾರಸು ಮಾಡಲಾಗಿದೆ.`,
      topic: latestAssessment.topic,
      topicKn: latestAssessment.topicKn || latestAssessment.topic,
      subject: latestAssessment.subject,
      recentScore: latestPercentage,
    };
  }

  return null;
}

/**
 * Builds the 4 standard actionable, low-resource intervention suggestions for rural primary classrooms
 */
export function buildInterventionOptions(
  studentName: string,
  grade: GradeLevel,
  subject: Subject,
  topic: string
): InterventionOption[] {
  if (subject === 'Mathematics') {
    return [
      {
        id: 'opt_1',
        title: `10-minute ${topic} concrete practice`,
        titleKn: `10 ನಿಮಿಷಗಳ ${topic} ವಸ್ತು ಆಧಾರಿತ ಅಭ್ಯಾಸ`,
        type: '10-min practice',
        description: `Use repeated addition examples with familiar seeds, pebbles, or chalk marks on the classroom floor.`,
        descriptionKn: `ಹುಣಸೆ ಬೀಜಗಳು ಅಥವಾ ಸಣ್ಣ ಕಲ್ಲುಗಳನ್ನು ಬಳಸಿ ಪುನರಾವರ್ತಿತ ಸಂಕಲನದ ಮೂಲಕ ಗುಣಾಕಾರ ಪರಿಕಲ್ಪನೆಯನ್ನು ತಿಳಿಸಿ.`,
        estimatedMinutes: 10,
      },
      {
        id: 'opt_2',
        title: `Peer learning with confident classmate`,
        titleKn: `ಸ್ನೇಹಿತರೊಂದಿಗೆ ಜೊತೆಗಾರ ಕಲಿಕೆ`,
        type: 'peer-learning',
        description: `Pair ${studentName} with a Grade ${grade.replace('Grade ', '')} student who has demonstrated mastery in ${topic}.`,
        descriptionKn: `${studentName} ಅವರನ್ನು ಈ ವಿಷಯದಲ್ಲಿ ಪ್ರವೀಣನಾಗಿರುವ ಸಹಪಾಠಿಯೊಂದಿಗೆ ಜೊತೆಗೂಡಿಸಿ ಅಭ್ಯಾಸ ಮಾಡಿಸಿ.`,
        estimatedMinutes: 15,
      },
      {
        id: 'opt_3',
        title: `Low-resource 5-question worksheet`,
        titleKn: `5 ಸರಳ ಪ್ರಶ್ನೆಗಳ ಕಾರ್ಯಹಾಳೆ`,
        type: 'low-resource worksheet',
        description: `Provide a short slate or paper worksheet with five simple real-life grocery shop problems.`,
        descriptionKn: `ಅಂಗಡಿಯ ವ್ಯಾಪಾರದ ಸನ್ನಿವೇಶಗಳನ್ನು ಒಳಗೊಂಡ 5 ಸರಳ ಪ್ರಶ್ನೆಗಳಿರುವ ಹಲಗೆ ಅಥವಾ ಕಾಗದದ ಹಾಳೆಯನ್ನು ನೀಡಿ.`,
        estimatedMinutes: 15,
      },
      {
        id: 'opt_4',
        title: `Teacher small-group re-teaching`,
        titleKn: `ಶಿಕ್ಷಕರ ಸಣ್ಣ ಗುಂಪಿನ ಪುನರ್ ಬೋಧನೆ`,
        type: 'teacher re-teaching',
        description: `Review multiplication tables from 2 to 5 on blackboard during the next teacher-led rotation slot.`,
        descriptionKn: `ಮುಂದಿನ ಶಿಕ್ಷಕರ ಅವಧಿಯಲ್ಲಿ ಕಪ್ಪುಹಲಗೆಯ ಮೇಲೆ 2 ರಿಂದ 5 ರವರೆಗಿನ ಮಗ್ಗಿಗಳನ್ನು ಮರುಪರಿಶೀಲಿಸಿ.`,
        estimatedMinutes: 10,
      },
    ];
  }

  // Reading / Kannada / English / EVS
  return [
    {
      id: 'opt_1',
      title: `10-minute guided phonics / word practice`,
      titleKn: `10 ನಿಮಿಷಗಳ ಅಕ್ಷರ ವಾಚನ ಅಭ್ಯಾಸ`,
      type: '10-min practice',
      description: `Read 5 vocabulary cards aloud together, breaking down compound letters (ottaksara/vowels).`,
      descriptionKn: `ಒತ್ತಕ್ಷರ ಹಾಗೂ ಪದ ಕಾರ್ಡ್‌ಗಳನ್ನು ಶಿಕ್ಷಕರೊಂದಿಗೆ ಗಟ್ಟಿಯಾಗಿ ಓದುವ 10 ನಿಮಿಷಗಳ ಅಭ್ಯಾಸ.`,
      estimatedMinutes: 10,
    },
    {
      id: 'opt_2',
      title: `Peer reading partner`,
      titleKn: `ಜೊತೆಗಾರ ವಾಚನ ಚಟುವಟಿಕೆ`,
      type: 'peer-learning',
      description: `Pair ${studentName} with a classmate to read alternate sentences from textbook story.`,
      descriptionKn: `ಪಾಠದ ವಾಕ್ಯಗಳನ್ನು ಒಬ್ಬರಾದ ಮೇಲೆ ಒಬ್ಬರು ಓದುವಂತೆ ಸಹಪಾಠಿಯೊಂದಿಗೆ ಜೋಡಿ ಮಾಡಿ.`,
      estimatedMinutes: 15,
    },
    {
      id: 'opt_3',
      title: `Picture-to-word matching card`,
      titleKn: `ಚಿತ್ರ-ಪದ ಹೊಂದಾಣಿಕೆ ಕಾರ್ಡ್`,
      type: 'low-resource worksheet',
      description: `Draw lines connecting textbook illustrations to their written names in notebook.`,
      descriptionKn: `ನೋಟ್‌ಬುಕ್‌ನಲ್ಲಿ ಚಿತ್ರಗಳನ್ನು ನೋಡಿ ಸರಿಯಾದ ಹೆಸರಿಗೆ ಗೆರೆ ಎಳೆಯುವ ಸರಳ ಚಟುವಟಿಕೆ.`,
      estimatedMinutes: 12,
    },
    {
      id: 'opt_4',
      title: `Teacher re-teaching at blackboard`,
      titleKn: `ಕಪ್ಪುಹಲಗೆಯ ಬಳಿ ಶಿಕ್ಷಕರ ಮಾರ್ಗದರ್ಶನ`,
      type: 'teacher re-teaching',
      description: `Targeted 5-minute review of difficult words before silent reading time.`,
      descriptionKn: `ಮೌನ ವಾಚನಕ್ಕೆ ಮುನ್ನ ಕಷ್ಟಕರ ಪದಗಳನ್ನು ಕಪ್ಪುಹಲಗೆಯ ಮೇಲೆ ಬರೆದು ಅರ್ಥ ವಿವರಿಸಿ.`,
      estimatedMinutes: 10,
    },
  ];
}

/**
 * Generates intervention suggestions for all students in a school
 */
export function generateInterventionSuggestions(
  students: Student[],
  assessments: Assessment[]
): InterventionSuggestion[] {
  const suggestions: InterventionSuggestion[] = [];

  students.forEach(student => {
    const evalResult = evaluateStudentForIntervention(student, assessments);
    if (evalResult && evalResult.needsIntervention) {
      suggestions.push({
        id: `sug_${student.id}_${Date.now()}`,
        studentId: student.id,
        studentName: student.name,
        studentGrade: student.grade,
        subject: evalResult.subject,
        topic: evalResult.topic,
        topicKn: evalResult.topicKn,
        recentScore: evalResult.recentScore,
        status: evalResult.status,
        ruleTriggered: evalResult.ruleExplanation,
        ruleTriggeredKn: evalResult.ruleExplanationKn,
        explanation: `Suggested because ${student.name}'s performance in ${evalResult.subject} indicated a learning gap (${evalResult.recentScore}%). Interventions are tailored for rural multi-grade execution.`,
        explanationKn: `${student.name} ಅವರ ${evalResult.subject} ಕಲಿಕೆಯಲ್ಲಿ ನ್ಯೂನತೆ ಕಂಡುಬಂದಿದ್ದರಿಂದ (${evalResult.recentScore}%) ಈ ಹಸ್ತಕ್ಷೇಪವನ್ನು ಶಿಫಾರಸು ಮಾಡಲಾಗಿದೆ. ಗ್ರಾಮೀಣ ಶಾಲೆಗೆ ತಕ್ಕಂತೆ ರೂಪಿಸಲಾಗಿದೆ.`,
        suggestedActions: buildInterventionOptions(student.name, student.grade, evalResult.subject, evalResult.topic),
      });
    }
  });

  return suggestions;
}
