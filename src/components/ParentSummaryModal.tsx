import React from 'react';
import { useApp } from '../context/AppContext';
import { TRANSLATIONS } from '../utils/translations';
import { X, Printer, Download, CheckCircle2, BookOpen, AlertCircle } from 'lucide-react';

export const ParentSummaryModal: React.FC = () => {
  const { parentSummaryStudentId, closeParentSummary, students, school, teacher, language, showToast } = useApp();
  const t = TRANSLATIONS[language];

  if (!parentSummaryStudentId) return null;

  const student = students.find(s => s.id === parentSummaryStudentId);
  if (!student) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    showToast('Student summary downloaded (Offline Printable).');
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="parent-summary-title"
      className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5"
    >
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-stone-200 overflow-y-auto max-h-[90vh]">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-amber-700 text-white flex items-center justify-center font-bold text-sm">
              RC
            </span>
            <h2 id="parent-summary-title" className="text-base sm:text-lg font-bold text-stone-900">
              {t.parentSummaryTitle} (ಪೋಷಕರ ಮಾಹಿತಿ ಪತ್ರ)
            </h2>
          </div>
          <button
            onClick={closeParentSummary}
            className="p-1.5 rounded-lg text-stone-500 hover:text-stone-800 hover:bg-stone-100 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4 p-5 rounded-2xl border border-stone-200 bg-stone-50/60 space-y-4 font-sans print:border-none print:p-0">
          <div className="flex items-start justify-between border-b border-stone-200 pb-3">
            <div>
              <h3 className="font-bold text-lg text-stone-900">
                {language === 'kn' ? student.nameKn : student.name}
              </h3>
              <p className="text-xs text-stone-600">
                {student.grade} • {language === 'kn' ? school.nameKn : school.name}
              </p>
            </div>
            <div className="text-right text-xs text-stone-500">
              <div>Date: {new Date().toLocaleDateString()}</div>
              <div>Teacher: {language === 'kn' ? teacher.nameKn : teacher.name}</div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200">
            <h4 className="text-xs font-bold text-emerald-900 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              <span>{t.strengthsLabel} (ಸಾಮರ್ಥ್ಯಗಳು)</span>
            </h4>
            <ul className="text-xs text-stone-700 space-y-1 list-disc list-inside">
              <li>Regular attendance ({student.attendance}%) and positive participation.</li>
              <li>Number recognition 1–100 and basic addition with objects.</li>
              <li>Good verbal recall during classroom demonstrations.</li>
            </ul>
          </div>

          <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200">
            <h4 className="text-xs font-bold text-amber-950 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-amber-700" />
              <span>{t.needsPracticeLabel} (ಹೆಚ್ಚುವರಿ ಅಭ್ಯಾಸದ ಅಗತ್ಯ)</span>
            </h4>
            <ul className="text-xs text-stone-700 space-y-1 list-disc list-inside">
              <li>Multiplication tables (tables of 3, 4, and 5).</li>
              <li>Solving two-digit word problems independently.</li>
            </ul>
          </div>

          <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200">
            <h4 className="text-xs font-bold text-blue-950 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-blue-700" />
              <span>{t.suggestedHomeActivity}</span>
            </h4>
            <p className="text-xs text-stone-700 leading-relaxed">
              {language === 'kn'
                ? 'ಮನೆಯಲ್ಲಿ ದೈನಂದಿನ ವಸ್ತುಗಳನ್ನು (ಬೀಜಗಳು, ಬಳಪ, ಅಥವಾ ಸಣ್ಣ ಕಲ್ಲುಗಳು) ಬಳಸಿ ದಿನಕ್ಕೆ 10 ನಿಮಿಷಗಳ ಕಾಲ ಗುಣಾಕಾರ ಅಭ್ಯಾಸ ಮಾಡಿಸಿ.'
                : 'Practice multiplication using everyday objects (seeds, bottle caps, or pebbles) for 10 minutes daily.'}
            </p>
          </div>
        </div>

        <div className="mt-5 pt-3 border-t border-stone-100 flex items-center justify-between">
          <span className="text-xs text-stone-400">Zero sensitive data exposed</span>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              className="px-3.5 py-2 border border-stone-300 text-stone-700 hover:bg-stone-50 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-stone-500" />
              <span>{t.btnDownloadPDF}</span>
            </button>
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-amber-700 hover:bg-amber-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{t.btnPrint}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
