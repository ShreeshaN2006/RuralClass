import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TRANSLATIONS } from '../utils/translations';
import { Subject } from '../types';
import { X, CheckCircle2, HelpCircle, AlertCircle, Save } from 'lucide-react';

export const QuickAssessmentModal: React.FC = () => {
  const {
    quickAssessmentStudentId,
    closeQuickAssessmentModal,
    students,
    recordQuickAssessment,
    teacher,
    language,
  } = useApp();

  const t = TRANSLATIONS[language];

  const student = students.find(s => s.id === quickAssessmentStudentId);

  const [subject, setSubject] = useState<Subject>('Mathematics');
  const [topic, setTopic] = useState<string>('Multiplication with Concrete Objects');
  const [q1, setQ1] = useState<'yes' | 'with_help' | 'no'>('with_help');
  const [q2, setQ2] = useState<'yes' | 'with_help' | 'no'>('with_help');
  const [q3, setQ3] = useState<'yes' | 'with_help' | 'no'>('no');

  if (!quickAssessmentStudentId || !student) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    recordQuickAssessment(student.id, q1, q2, q3, topic, subject);
  };

  // Preview score
  const scoreMap = { yes: 10, with_help: 5, no: 0 };
  const total = scoreMap[q1] + scoreMap[q2] + scoreMap[q3];
  const perc = Math.round((total / 30) * 100);
  const projectedStatus = perc >= 70 ? 'On track' : perc >= 50 ? 'Improving' : 'Needs support';

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="quick-assessment-title"
      className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5"
    >
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-stone-200">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div>
            <h2 id="quick-assessment-title" className="text-base font-bold text-stone-900">
              {t.quickAssessmentBtn}
            </h2>
            <p className="text-xs text-stone-500">
              Evaluating: <strong className="text-stone-800">{student.name}</strong> ({student.grade}) • Observer: <strong className="text-stone-800">{teacher.name}</strong>
            </p>
          </div>
          <button
            onClick={closeQuickAssessmentModal}
            className="p-1.5 rounded-lg text-stone-500 hover:text-stone-800 hover:bg-stone-100 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                Subject
              </label>
              <select
                value={subject}
                onChange={e => setSubject(e.target.value as Subject)}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs bg-white focus:outline-none focus:ring-2 focus:ring-amber-600"
              >
                <option value="Mathematics">Mathematics</option>
                <option value="Kannada">Kannada</option>
                <option value="English">English</option>
                <option value="Environmental Studies">Environmental Studies</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                Topic
              </label>
              <input
                type="text"
                value={topic}
                onChange={e => setTopic(e.target.value)}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-amber-600 font-semibold"
                required
              />
            </div>
          </div>

          {/* 3 Check Questions (Section 4) */}
          <div className="space-y-3 pt-2">
            {/* Question 1 */}
            <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 space-y-2">
              <span className="text-xs font-bold text-stone-800 block">
                1. Can the student solve a basic problem in this topic?
              </span>
              <div className="grid grid-cols-3 gap-2">
                {(['yes', 'with_help', 'no'] as const).map(opt => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setQ1(opt)}
                    className={`py-1.5 px-2 rounded-lg text-xs font-semibold border transition-all ${
                      q1 === opt
                        ? opt === 'yes'
                          ? 'bg-emerald-100 text-emerald-900 border-emerald-400'
                          : opt === 'with_help'
                          ? 'bg-amber-100 text-amber-900 border-amber-400'
                          : 'bg-rose-100 text-rose-900 border-rose-400'
                        : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    {opt === 'yes' ? 'Yes' : opt === 'with_help' ? 'With help' : 'No'}
                  </button>
                ))}
              </div>
            </div>

            {/* Question 2 */}
            <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 space-y-2">
              <span className="text-xs font-bold text-stone-800 block">
                2. Can the student explain the method?
              </span>
              <div className="grid grid-cols-3 gap-2">
                {(['yes', 'with_help', 'no'] as const).map(opt => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setQ2(opt)}
                    className={`py-1.5 px-2 rounded-lg text-xs font-semibold border transition-all ${
                      q2 === opt
                        ? opt === 'yes'
                          ? 'bg-emerald-100 text-emerald-900 border-emerald-400'
                          : opt === 'with_help'
                          ? 'bg-amber-100 text-amber-900 border-amber-400'
                          : 'bg-rose-100 text-rose-900 border-rose-400'
                        : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    {opt === 'yes' ? 'Yes' : opt === 'with_help' ? 'With help' : 'No'}
                  </button>
                ))}
              </div>
            </div>

            {/* Question 3 */}
            <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 space-y-2">
              <span className="text-xs font-bold text-stone-800 block">
                3. Can the student solve a similar problem independently?
              </span>
              <div className="grid grid-cols-3 gap-2">
                {(['yes', 'with_help', 'no'] as const).map(opt => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setQ3(opt)}
                    className={`py-1.5 px-2 rounded-lg text-xs font-semibold border transition-all ${
                      q3 === opt
                        ? opt === 'yes'
                          ? 'bg-emerald-100 text-emerald-900 border-emerald-400'
                          : opt === 'with_help'
                          ? 'bg-amber-100 text-amber-900 border-amber-400'
                          : 'bg-rose-100 text-rose-900 border-rose-400'
                        : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    {opt === 'yes' ? 'Yes' : opt === 'with_help' ? 'With help' : 'No'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Real-time Resulting Status Preview */}
          <div className="p-3 rounded-xl bg-stone-100 border border-stone-200 flex items-center justify-between text-xs">
            <span>
              Calculated Score: <strong>{total} / 30 ({perc}%)</strong>
            </span>
            <span className={`font-bold px-2 py-0.5 rounded-full ${
              projectedStatus === 'On track'
                ? 'bg-emerald-100 text-emerald-800'
                : projectedStatus === 'Improving'
                ? 'bg-blue-100 text-blue-800'
                : 'bg-amber-200 text-amber-900'
            }`}>
              {projectedStatus}
            </span>
          </div>

          <div className="pt-3 border-t border-stone-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={closeQuickAssessmentModal}
              className="px-3.5 py-2 border border-stone-300 text-stone-700 hover:bg-stone-50 rounded-xl text-xs font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-amber-700 hover:bg-amber-800 text-white rounded-xl text-xs font-bold transition-colors shadow-xs flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Quick Assessment</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
