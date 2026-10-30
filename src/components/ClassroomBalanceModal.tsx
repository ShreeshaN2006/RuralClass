import React from 'react';
import { useApp } from '../context/AppContext';
import { TRANSLATIONS } from '../utils/translations';
import { X, Scale, AlertTriangle, CheckCircle2, Clock, Calendar, ArrowRight } from 'lucide-react';

export const ClassroomBalanceModal: React.FC = () => {
  const { isBalanceModalOpen, closeBalanceModal, classroomBalance, language, setCurrentView } = useApp();
  const t = TRANSLATIONS[language];

  if (!isBalanceModalOpen) return null;

  const handleAdjustTimetable = () => {
    closeBalanceModal();
    setCurrentView('timetable');
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="balance-modal-title"
      className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5"
    >
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-stone-200 overflow-y-auto max-h-[90vh]">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
              <Scale className="w-4 h-4" />
            </span>
            <h2 id="balance-modal-title" className="text-base sm:text-lg font-bold text-stone-900">
              {t.classroomBalanceTitle}
            </h2>
          </div>
          <button
            onClick={closeBalanceModal}
            className="p-1.5 rounded-lg text-stone-500 hover:text-stone-800 hover:bg-stone-100 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-stone-600 mt-3">
          {t.classroomBalanceSub}
        </p>

        {/* Overall Score Highlight */}
        <div className="my-4 p-4 rounded-xl bg-gradient-to-r from-amber-50 to-stone-100 border border-amber-200 flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-amber-950 uppercase tracking-wider">
              Weekly Multi-Grade Balance
            </div>
            <div className="text-3xl font-extrabold text-stone-900 mt-0.5">
              {classroomBalance.overallScore}%
            </div>
            <div className="text-[11px] text-stone-500">
              Balanced direct instruction vs independent practice
            </div>
          </div>
          <div className="text-right text-xs text-stone-600 space-y-1">
            <div className="flex items-center gap-1.5 justify-end">
              <Clock className="w-3.5 h-3.5 text-amber-700" />
              <span>Teacher-Led: <strong>{classroomBalance.teacherLedHours} hrs</strong></span>
            </div>
            <div className="flex items-center gap-1.5 justify-end">
              <span>Independent: <strong>{classroomBalance.independentHours} hrs</strong></span>
            </div>
          </div>
        </div>

        {/* Grade Breakdown Table (Section 10) */}
        <div className="space-y-2">
          <div className="text-xs font-bold text-stone-700 uppercase tracking-wider">
            {t.gradeCoverageTitle}
          </div>
          <div className="space-y-1.5">
            {Object.entries(classroomBalance.gradeCoverage).map(([grade, score]) => (
              <div
                key={grade}
                className="p-2.5 rounded-xl border border-stone-200 bg-stone-50 flex items-center justify-between text-xs"
              >
                <span className="font-semibold text-stone-900">{grade}</span>
                <div className="flex items-center gap-3">
                  <div className="w-28 bg-stone-200 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        score >= 88 ? 'bg-emerald-600' : score >= 84 ? 'bg-amber-600' : 'bg-rose-500'
                      }`}
                      style={{ width: `${score}%` }}
                    />
                  </div>
                  <span className={`font-mono font-bold w-10 text-right ${
                    score < 84 ? 'text-rose-600' : 'text-stone-800'
                  }`}>
                    {score}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Planning Alert */}
        <div className="mt-4 p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-950 flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div className="font-bold">Planning Recommendation:</div>
            <p className="text-stone-700 leading-relaxed">
              "Grade 4 Mathematics has received less direct instruction this week (81%). Consider allocating an extra teacher-led rotation slot or requesting teacher support."
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-5 pt-3 border-t border-stone-100 flex items-center justify-between">
          <span className="text-[11px] text-stone-400">Transparent planning indicator</span>
          <button
            onClick={handleAdjustTimetable}
            className="px-4 py-2 bg-amber-700 hover:bg-amber-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>{t.btnAdjustTimetable}</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </button>
        </div>
      </div>
    </div>
  );
};
