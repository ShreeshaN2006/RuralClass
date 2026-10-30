import React from 'react';
import { useApp } from '../context/AppContext';
import { TRANSLATIONS } from '../utils/translations';
import {
  Settings as SettingsIcon,
  Globe,
  Database,
  RotateCcw,
  ShieldCheck,
  Lock,
  User,
  HeartHandshake,
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const {
    language,
    setLanguage,
    resetAllDemoData,
    teacher,
    allTeachers,
    switchTeacher,
    school,
    showToast,
  } = useApp();

  const t = TRANSLATIONS[language];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-stone-900 tracking-tight flex items-center gap-2">
          <SettingsIcon className="w-6 h-6 text-amber-700" />
          <span>{t.navSettings}</span>
        </h1>
        <p className="text-sm text-stone-600 mt-1">
          {language === 'kn' ? 'ರೂರಲ್ ಕ್ಲಾಸ್ ಆದ್ಯತೆಗಳು ಮತ್ತು ಗೌಪ್ಯತಾ ನಿಯಂತ್ರಣಗಳು.' : 'RuralClass application preferences and privacy controls.'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Language Preference */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 pb-2 border-b border-stone-100">
            <Globe className="w-5 h-5 text-amber-700" />
            <h2 className="text-sm font-bold text-stone-900">
              {language === 'kn' ? 'ಭಾಷಾ ಆದ್ಯತೆ (Language Preference)' : 'Language Preference'}
            </h2>
          </div>

          <p className="text-xs text-stone-600">
            Select your preferred interface language. RuralClass is localized for teachers and school heads in Karnataka.
          </p>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setLanguage('en')}
              className={`p-3.5 rounded-xl border text-left font-semibold text-xs transition-all ${
                language === 'en'
                  ? 'bg-amber-100/70 border-amber-400 text-amber-950 shadow-2xs'
                  : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
              }`}
            >
              <div className="font-bold text-sm text-stone-900 mb-0.5">English</div>
              <div className="text-[11px] text-stone-500 font-normal">Standard English</div>
            </button>

            <button
              onClick={() => setLanguage('kn')}
              className={`p-3.5 rounded-xl border text-left font-semibold text-xs transition-all ${
                language === 'kn'
                  ? 'bg-amber-100/70 border-amber-400 text-amber-950 shadow-2xs'
                  : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
              }`}
            >
              <div className="font-bold text-sm text-stone-900 mb-0.5 font-sans">ಕನ್ನಡ (Kannada)</div>
              <div className="text-[11px] text-stone-500 font-normal">ಸರಳ ಕನ್ನಡ ಇಂಟರ್ಫೇಸ್</div>
            </button>
          </div>
        </div>

        {/* Demo Data Management */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 pb-2 border-b border-stone-100">
            <Database className="w-5 h-5 text-amber-700" />
            <h2 className="text-sm font-bold text-stone-900">
              {language === 'kn' ? 'ಡೆಮೊ ಡೇಟಾ ನಿರ್ವಹಣೆ' : 'Demo Data Management'}
            </h2>
          </div>

          <p className="text-xs text-stone-600">
            Reset all students, assessments, timetables, and interventions back to initial hackathon presentation defaults.
          </p>

          <div>
            <button
              onClick={resetAllDemoData}
              className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-semibold border border-stone-300 transition-colors flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5 text-stone-600" />
              <span>Reset to Default Demo Data</span>
            </button>
          </div>
        </div>
      </div>

      {/* Active Teacher Profile & Switcher */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-stone-200 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-stone-100">
          <div className="flex items-center gap-2.5">
            <User className="w-5 h-5 text-amber-700" />
            <div>
              <h2 className="text-sm font-bold text-stone-900">
                {language === 'kn' ? 'ಸಕ್ರಿಯ ಶಿಕ್ಷಕರ ಪ್ರೊಫೈಲ್ ಮತ್ತು ಖಾತೆ ಬದಲಾವಣೆ' : 'Active Teacher Profile & Account Switcher'}
              </h2>
              <p className="text-xs text-stone-500">
                Currently logged in as {teacher.name} ({teacher.id})
              </p>
            </div>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 self-start sm:self-auto">
            11 Teacher Accounts Active
          </span>
        </div>

        {/* Current Teacher Summary Box */}
        <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg shadow-xs ${
              teacher.avatarColor || 'bg-amber-700 text-white'
            }`}>
              {teacher.name.charAt(0)}
            </div>
            <div>
              <div className="font-bold text-sm text-stone-900">
                {language === 'kn' ? teacher.nameKn : teacher.name}
              </div>
              <div className="text-xs text-amber-900 font-medium">
                {language === 'kn' ? teacher.roleKn || teacher.role : teacher.role}
              </div>
              <div className="text-[11px] text-stone-500 mt-0.5">
                {school.name} • {teacher.email}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="text-left md:text-right">
              <span className="text-[11px] text-stone-500 block">Assigned Grades:</span>
              <span className="text-xs font-bold text-stone-800">{teacher.assignedGrades.join(', ')}</span>
            </div>
            <div className="text-left md:text-right">
              <span className="text-[11px] text-stone-500 block">Syllabus Progress:</span>
              <span className="text-xs font-bold text-amber-800">{teacher.syllabusCompletion}%</span>
            </div>
          </div>
        </div>

        {/* Quick Switch to any other teacher */}
        <div>
          <h3 className="text-xs font-bold text-stone-700 uppercase tracking-wider mb-2.5">
            {language === 'kn' ? 'ಇತರ ಶಿಕ್ಷಕರ ಖಾತೆಗೆ ಬದಲಾಯಿಸಿ:' : 'Switch to Another Teacher Account:'}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
            {allTeachers.map(t => {
              const isCurrent = t.id === teacher.id;
              return (
                <button
                  key={t.id}
                  onClick={() => switchTeacher(t.id)}
                  className={`p-2.5 rounded-xl border text-left transition-all flex items-center justify-between gap-2 ${
                    isCurrent
                      ? 'bg-amber-100/70 border-amber-400 ring-1 ring-amber-400 font-bold'
                      : 'bg-stone-50 border-stone-200 hover:bg-white hover:border-amber-300'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                      t.avatarColor || 'bg-stone-700 text-white'
                    }`}>
                      {t.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs text-stone-900 truncate font-semibold">
                        {language === 'kn' ? t.nameKn : t.name}
                      </div>
                      <div className="text-[10px] text-stone-500 truncate">
                        {t.assignedGrades.join(', ')} • {t.role.split(' ')[0]}
                      </div>
                    </div>
                  </div>
                  {isCurrent && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-700 text-white font-bold shrink-0">
                      Active
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Ethical Tech & Privacy Statement (Section 33 & 34) */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
        <div className="flex items-center gap-2.5 pb-2 border-b border-stone-100">
          <ShieldCheck className="w-5 h-5 text-emerald-700" />
          <h2 className="text-sm font-bold text-stone-900">
            {language === 'kn' ? 'ಜವಾಬ್ದಾರಿಯುತ ತಂತ್ರಜ್ಞಾನ ಮತ್ತು ಗೌಪ್ಯತೆ ನೀತಿ' : 'Responsible AI & Student Privacy'}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-stone-700">
          <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 space-y-1.5">
            <div className="font-bold text-stone-900 flex items-center gap-1.5">
              <HeartHandshake className="w-4 h-4 text-amber-700" />
              <span>Teacher Judgment Priority</span>
            </div>
            <p className="text-stone-600 leading-relaxed">
              {t.ethicalNotice} RuralClass does not claim to diagnose learning disabilities or categorize children's innate abilities. It uses transparent, deterministic rules to assist lesson planning and timely classroom follow-up.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 space-y-1.5">
            <div className="font-bold text-stone-900 flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-emerald-700" />
              <span>Data Minimisation</span>
            </div>
            <p className="text-stone-600 leading-relaxed">
              No Aadhaar numbers, phone numbers, home addresses, or sensitive personal information are ever recorded or transmitted. All demo data is strictly fictional and stored securely.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
