import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { TRANSLATIONS } from '../utils/translations';
import { Subject } from '../types';
import { X, CheckCircle2, AlertCircle } from 'lucide-react';
import { TOPIC_PRESETS } from '../services/lessonPlanner';

export const RecordAssessmentModal: React.FC = () => {
  const {
    isAssessmentModalOpen,
    closeAssessmentModal,
    students,
    recordAssessment,
    preselectedStudentForAssessment,
    teacher,
    language,
  } = useApp();

  const t = TRANSLATIONS[language];

  const [studentId, setStudentId] = useState<string>('');
  const [subject, setSubject] = useState<Subject>('Mathematics');
  const [topic, setTopic] = useState<string>('Multiplication tables 2 to 5');
  const [score, setScore] = useState<number | ''>(10);
  const [maxScore, setMaxScore] = useState<number | ''>(20);
  const [observation, setObservation] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (preselectedStudentForAssessment) {
      setStudentId(preselectedStudentForAssessment);
    } else if (students.length > 0) {
      setStudentId(students[0].id);
    }
  }, [preselectedStudentForAssessment, students]);

  if (!isAssessmentModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!studentId) {
      setError(language === 'kn' ? 'ದಯವಿಟ್ಟು ವಿದ್ಯಾರ್ಥಿಯನ್ನು ಆಯ್ಕೆಮಾಡಿ.' : 'Please select a student.');
      return;
    }
    if (!topic.trim()) {
      setError(language === 'kn' ? 'ದಯವಿಟ್ಟು ವಿಷಯದ ಹೆಸರನ್ನು ನಮೂದಿಸಿ.' : 'Please enter a topic.');
      return;
    }
    if (score === '' || score < 0) {
      setError(language === 'kn' ? 'ಮಾನ್ಯ ಅಂಕವನ್ನು ನಮೂದಿಸಿ.' : 'Please enter a valid score (>= 0).');
      return;
    }
    if (maxScore === '' || maxScore <= 0) {
      setError(language === 'kn' ? 'ಮಾನ್ಯ ಗರಿಷ್ಠ ಅಂಕವನ್ನು ನಮೂದಿಸಿ.' : 'Maximum score must be greater than 0.');
      return;
    }
    if (Number(score) > Number(maxScore)) {
      setError(language === 'kn' ? 'ಗಳಿಸಿದ ಅಂಕವು ಗರಿಷ್ಠ ಅಂಕಕ್ಕಿಂತ ಹೆಚ್ಚಾಗಿರಬಾರದು.' : 'Score cannot be greater than maximum score.');
      return;
    }

    recordAssessment({
      studentId,
      subject,
      topic: topic.trim(),
      score: Number(score),
      maxScore: Number(maxScore),
      date: new Date().toISOString().split('T')[0],
      observation: observation.trim(),
    });
  };

  const currentStudent = students.find(s => s.id === studentId);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="record-assessment-title"
      className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4"
    >
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-stone-200">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div>
            <h2 id="record-assessment-title" className="text-lg font-bold text-stone-900">
              {t.recordAssessmentTitle}
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Evaluating Teacher: <span className="font-semibold text-stone-800">{teacher.name}</span> ({language === 'kn' ? teacher.roleKn : teacher.role})
            </p>
          </div>
          <button
            onClick={closeAssessmentModal}
            className="p-1.5 rounded-lg text-stone-500 hover:text-stone-800 hover:bg-stone-100 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mt-3 p-3 bg-rose-50 border border-rose-200 rounded-lg flex items-center gap-2 text-rose-800 text-sm">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label htmlFor="assessment-student" className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
              {t.colStudent}
            </label>
            <select
              id="assessment-student"
              value={studentId}
              onChange={e => setStudentId(e.target.value)}
              className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-amber-600"
            >
              {students.map(s => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.grade})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="assessment-subject" className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                {t.lblSubject}
              </label>
              <select
                id="assessment-subject"
                value={subject}
                onChange={e => {
                  const s = e.target.value as Subject;
                  setSubject(s);
                  const presets = TOPIC_PRESETS[s];
                  if (presets && presets[0]) setTopic(presets[0]);
                }}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-amber-600"
              >
                <option value="Mathematics">Mathematics (ಗಣಿತ)</option>
                <option value="Kannada">Kannada (ಕನ್ನಡ)</option>
                <option value="English">English (ಇಂಗ್ಲಿಷ್)</option>
                <option value="Environmental Studies">Environmental Studies (ಪರಿಸರ ಅಧ್ಯಯನ)</option>
              </select>
            </div>

            <div>
              <label htmlFor="assessment-topic" className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                {t.lblTopic}
              </label>
              <input
                id="assessment-topic"
                type="text"
                value={topic}
                onChange={e => setTopic(e.target.value)}
                placeholder="e.g. Multiplication tables"
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-600"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="assessment-score" className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                {t.lblScore}
              </label>
              <input
                id="assessment-score"
                type="number"
                min="0"
                value={score}
                onChange={e => setScore(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-600 font-semibold"
                required
              />
            </div>

            <div>
              <label htmlFor="assessment-maxscore" className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                {t.lblMaxScore}
              </label>
              <input
                id="assessment-maxscore"
                type="number"
                min="1"
                value={maxScore}
                onChange={e => setMaxScore(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-600 font-semibold"
                required
              />
            </div>
          </div>

          {score !== '' && maxScore !== '' && Number(maxScore) > 0 && (
            <div className="text-xs text-stone-600 bg-stone-50 p-2 rounded border border-stone-200 flex items-center justify-between">
              <span>
                {language === 'kn' ? 'ಶೇಕಡಾವಾರು ಅಂಕ:' : 'Calculated Percentage:'}{' '}
                <strong>{Math.round((Number(score) / Number(maxScore)) * 100)}%</strong>
              </span>
              <span className="text-xs font-medium text-stone-500">
                {Number(score) / Number(maxScore) < 0.5 ? '⚠️ Needs support (<50%)' : '✅ Passing'}
              </span>
            </div>
          )}

          <div>
            <label htmlFor="assessment-observation" className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
              {t.lblObservation}
            </label>
            <textarea
              id="assessment-observation"
              rows={2}
              value={observation}
              onChange={e => setObservation(e.target.value)}
              placeholder="e.g. Solved with sticks, but needs multiplication table practice"
              className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-600 resize-none"
            />
          </div>

          <div className="pt-3 border-t border-stone-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={closeAssessmentModal}
              className="px-4 py-2 border border-stone-300 text-stone-700 rounded-lg text-sm font-medium hover:bg-stone-50 transition-colors"
            >
              {t.cancel}
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-amber-700 text-white rounded-lg text-sm font-medium hover:bg-amber-800 transition-colors shadow-sm flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              {t.save}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
