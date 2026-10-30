import React from 'react';
import { useApp } from '../context/AppContext';
import { TRANSLATIONS } from '../utils/translations';
import { X, Calendar, BookOpen, HeartHandshake, ShieldCheck, WifiOff } from 'lucide-react';

export const AboutModal: React.FC = () => {
  const { isAboutModalOpen, closeAboutModal, language } = useApp();
  const t = TRANSLATIONS[language];

  if (!isAboutModalOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="about-modal-title"
      className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4"
    >
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-stone-200 overflow-y-auto max-h-[90vh]">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-amber-700 text-white flex items-center justify-center font-bold text-lg">
              R
            </span>
            <h2 id="about-modal-title" className="text-xl font-bold text-stone-900">
              {t.aboutRuralClass}
            </h2>
          </div>
          <button
            onClick={closeAboutModal}
            className="p-1.5 rounded-lg text-stone-500 hover:text-stone-800 hover:bg-stone-100 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4 space-y-4 text-stone-700 text-sm leading-relaxed">
          <p className="font-medium text-stone-900">
            {language === 'kn'
              ? 'ರೂರಲ್ ಕ್ಲಾಸ್ ಗ್ರಾಮೀಣ ಮತ್ತು ಬಹು-ತರಗತಿಯ ಪ್ರಾಥಮಿಕ ಶಾಲೆಗಳಲ್ಲಿ ಶಿಕ್ಷಕರ ಸಮಯ ನಿರ್ವಹಣೆ ಮತ್ತು ಕಲಿಕಾ ಬೆಂಬಲವನ್ನು ಒಂದು ಸರಳ ಕಾರ್ಯವಿಧಾನದಲ್ಲಿ ಸಂಯೋಜಿಸುತ್ತದೆ.'
              : 'RuralClass helps teachers manage the complexity of multi-grade classrooms by connecting timetable planning, lesson preparation, and student progress in one practical workflow.'}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-4">
            <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-200">
              <div className="w-7 h-7 rounded-lg bg-amber-100 flex items-center justify-center text-amber-800 mb-2">
                <Calendar className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-stone-900 text-sm">
                {language === 'kn' ? 'ಯೋಜನೆ (Plan)' : 'Plan'}
              </h3>
              <p className="text-xs text-stone-600 mt-1">
                {language === 'kn'
                  ? 'ಸಂಘರ್ಷ-ಮುಕ್ತ ಬಹು-ತರಗತಿ ವೇಳಾಪಟ್ಟಿ ಸಿದ್ಧಪಡಿಸಿ.'
                  : 'Build practical multi-grade schedules with zero teacher overlap.'}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-emerald-50/80 border border-emerald-200">
              <div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-800 mb-2">
                <BookOpen className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-stone-900 text-sm">
                {language === 'kn' ? 'ಬೋಧನೆ (Teach)' : 'Teach'}
              </h3>
              <p className="text-xs text-stone-600 mt-1">
                {language === 'kn'
                  ? 'ಲಭ್ಯವಿರುವ ಸಂಪನ್ಮೂಲಗಳಿಗೆ ತಕ್ಕಂತೆ ಪಾಠ ಯೋಜಿಸಿ.'
                  : 'Structured lessons showing simultaneous activities for all grades.'}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-blue-50/80 border border-blue-200">
              <div className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center text-blue-800 mb-2">
                <HeartHandshake className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-stone-900 text-sm">
                {language === 'kn' ? 'ಬೆಂಬಲ (Support)' : 'Support'}
              </h3>
              <p className="text-xs text-stone-600 mt-1">
                {language === 'kn'
                  ? 'ಕಲಿಕಾ ನ್ಯೂನತೆಗಳಿಗೆ ಪಾರದರ್ಶಕ ಹಸ್ತಕ್ಷೇಪ ಆಯ್ಕೆಮಾಡಿ.'
                  : 'Turn assessment observations into actionable, low-resource follow-ups.'}
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-stone-100 border border-stone-200 text-xs space-y-2">
            <div className="flex items-center gap-2 font-semibold text-stone-900">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              <span>{language === 'kn' ? 'ಜವಾಬ್ದಾರಿಯುತ ತಂತ್ರಜ್ಞಾನ ಮತ್ತು ಗೌಪ್ಯತೆ' : 'Responsible EdTech & Privacy'}</span>
            </div>
            <p className="text-stone-600">
              {t.ethicalNotice}
            </p>
            <p className="text-stone-500">
              {language === 'kn'
                ? 'ಯಾವುದೇ ಆಧಾರ್ ಸಂಖ್ಯೆ, ಫೋನ್ ನಂಬರ್ ಅಥವಾ ಸೂಕ್ಷ್ಮ ವೈಯಕ್ತಿಕ ವಿವರಗಳನ್ನು ಸಂಗ್ರಹಿಸಲಾಗುವುದಿಲ್ಲ. ಸಂಪೂರ್ಣವಾಗಿ ಕನಿಷ್ಠ ಡೇಟಾ ತತ್ವವನ್ನು ಪಾಲಿಸಲಾಗಿದೆ.'
                : 'Data minimisation: No Aadhaar numbers, phone numbers, or private personal data collected.'}
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-stone-500 pt-1">
            <WifiOff className="w-4 h-4 text-stone-400" />
            <span>{t.offlineReady}</span>
          </div>
        </div>

        <div className="mt-5 pt-3 border-t border-stone-100 flex justify-end">
          <button
            onClick={closeAboutModal}
            className="px-4 py-2 bg-stone-900 text-white rounded-lg text-sm font-medium hover:bg-stone-800 transition-colors"
          >
            {t.close}
          </button>
        </div>
      </div>
    </div>
  );
};
