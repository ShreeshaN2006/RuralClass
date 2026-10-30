import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TRANSLATIONS } from '../utils/translations';
import {
  School as SchoolIcon,
  Wifi,
  WifiOff,
  User,
  Info,
  LogOut,
  ChevronDown,
  Menu,
  RotateCw,
  RefreshCw,
  Users,
  Check,
} from 'lucide-react';

interface TopbarProps {
  onToggleMobileSidebar: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({ onToggleMobileSidebar }) => {
  const {
    school,
    schools,
    teacher,
    allTeachers,
    switchTeacher,
    language,
    setLanguage,
    switchSchool,
    isOfflineMode,
    pendingSyncCount,
    toggleOfflineMode,
    syncNow,
    openAboutModal,
    logout,
  } = useApp();

  const t = TRANSLATIONS[language];
  const [isSchoolMenuOpen, setIsSchoolMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [showAllTeachersInMenu, setShowAllTeachersInMenu] = useState(false);

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-xs border-b border-stone-200 px-4 lg:px-6 py-2.5">
      <div className="flex items-center justify-between gap-2">
        {/* Left: Mobile hamburger & School Info */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onToggleMobileSidebar}
            className="lg:hidden p-2 rounded-lg text-stone-600 hover:bg-stone-100 transition-colors"
            aria-label="Toggle navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* School Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsSchoolMenuOpen(!isSchoolMenuOpen)}
              className="flex items-center gap-2 p-1.5 -ml-1 rounded-lg hover:bg-stone-100 transition-colors text-left"
              aria-label="Select school"
            >
              <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                <SchoolIcon className="w-4 h-4" />
              </div>
              <div className="min-w-0 hidden sm:block">
                <div className="text-xs font-bold text-stone-900 truncate flex items-center gap-1.5">
                  <span>{language === 'kn' ? school.nameKn : school.name}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                </div>
                <div className="text-[11px] text-stone-500 truncate">
                  {language === 'kn' ? school.locationKn : school.location} • {school.grades.length} Grades
                </div>
              </div>
            </button>

            {isSchoolMenuOpen && (
              <div className="absolute left-0 mt-2 w-72 sm:w-80 bg-white rounded-xl shadow-xl border border-stone-200 p-2 z-50">
                <div className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider px-3 py-1.5">
                  {t.switchSchool}
                </div>
                {schools.map(s => (
                  <button
                    key={s.id}
                    onClick={() => {
                      switchSchool(s.id);
                      setIsSchoolMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2.5 rounded-lg text-xs flex flex-col gap-0.5 transition-colors ${
                      s.id === school.id
                        ? 'bg-amber-50 text-amber-900 font-semibold border border-amber-200'
                        : 'text-stone-700 hover:bg-stone-100'
                    }`}
                  >
                    <span className="font-medium text-stone-900">{language === 'kn' ? s.nameKn : s.name}</span>
                    <span className="text-[11px] text-stone-500">{language === 'kn' ? s.locationKn : s.location}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Section 6 Offline-First Sync Indicator */}
          <div className="flex items-center gap-1">
            <button
              onClick={toggleOfflineMode}
              title={isOfflineMode ? 'Click to simulate online connection' : 'Click to simulate offline mode'}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border transition-all ${
                isOfflineMode
                  ? 'bg-amber-50 text-amber-900 border-amber-300'
                  : 'bg-emerald-50 text-emerald-900 border-emerald-300'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${isOfflineMode ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`} />
              <span className="hidden sm:inline">
                {isOfflineMode
                  ? pendingSyncCount > 0
                    ? `🟠 Offline — ${pendingSyncCount} changes waiting`
                    : '🟠 Offline (Stored Locally)'
                  : '🟢 Synced'}
              </span>
              <span className="sm:hidden">{isOfflineMode ? 'Offline' : 'Synced'}</span>
            </button>

            {isOfflineMode && pendingSyncCount > 0 && (
              <button
                onClick={syncNow}
                className="p-1 rounded-lg bg-amber-100 text-amber-900 hover:bg-amber-200 text-xs font-semibold"
                title="Sync now"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Bilingual Language Switcher Toggle */}
          <div className="inline-flex rounded-lg p-0.5 bg-stone-100 border border-stone-200">
            <button
              onClick={() => setLanguage('en')}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
                language === 'en'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              English
            </button>
            <button
              onClick={() => setLanguage('kn')}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all font-sans ${
                language === 'kn'
                  ? 'bg-amber-700 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              ಕನ್ನಡ
            </button>
          </div>

          {/* About Modal Button */}
          <button
            onClick={openAboutModal}
            className="p-1.5 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors"
            title={t.aboutRuralClass}
            aria-label="About RuralClass"
          >
            <Info className="w-5 h-5 text-stone-600" />
          </button>

          {/* Teacher Profile / Switcher / Logout */}
          <div className="relative">
            <button
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              className="flex items-center gap-2 p-1 rounded-lg hover:bg-stone-100 transition-colors"
              aria-label="Teacher profile menu"
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ring-2 ring-amber-200 ${
                teacher.avatarColor || 'bg-amber-700 text-white'
              }`}>
                {teacher.name.charAt(0)}
              </div>
              <div className="hidden lg:block text-left text-xs">
                <div className="font-semibold text-stone-900">{language === 'kn' ? teacher.nameKn : teacher.name}</div>
                <div className="text-[11px] text-stone-500">{teacher.role.split('&')[0]}</div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-stone-400 hidden sm:block" />
            </button>

            {isProfileMenuOpen && (
              <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white rounded-2xl shadow-2xl border border-stone-200 p-3 z-50 animate-in fade-in zoom-in-95 duration-100">
                {/* Current Active Teacher Header */}
                <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200/60 mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm shadow-xs ${
                      teacher.avatarColor || 'bg-amber-700 text-white'
                    }`}>
                      {teacher.name.charAt(0)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-bold text-xs text-stone-900 truncate">
                        {language === 'kn' ? teacher.nameKn : teacher.name}
                      </div>
                      <div className="text-[11px] text-amber-900 font-medium truncate">
                        {language === 'kn' ? teacher.roleKn || teacher.role : teacher.role}
                      </div>
                      <div className="text-[10px] text-stone-500 truncate mt-0.5">
                        {school.name}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Switch Teacher Quick Selector */}
                <div className="mb-2">
                  <div className="flex items-center justify-between px-1 mb-1.5">
                    <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider flex items-center gap-1">
                      <Users className="w-3.5 h-3.5" />
                      <span>{language === 'kn' ? 'ಶಿಕ್ಷಕರನ್ನು ಬದಲಾಯಿಸಿ' : 'Switch Teacher Account'}</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowAllTeachersInMenu(!showAllTeachersInMenu)}
                      className="text-[11px] text-amber-700 font-semibold hover:underline"
                    >
                      {showAllTeachersInMenu ? 'Show School Only' : 'View All (11)'}
                    </button>
                  </div>

                  <div className="max-h-48 overflow-y-auto space-y-1 pr-1">
                    {allTeachers
                      .filter(t => showAllTeachersInMenu || t.schoolId === school.id)
                      .map(t => {
                        const isCurrent = t.id === teacher.id;
                        return (
                          <button
                            key={t.id}
                            onClick={() => {
                              switchTeacher(t.id);
                              setIsProfileMenuOpen(false);
                            }}
                            className={`w-full text-left p-2 rounded-xl text-xs flex items-center justify-between gap-2 transition-all ${
                              isCurrent
                                ? 'bg-amber-100/70 text-amber-950 font-bold border border-amber-300/60'
                                : 'text-stone-700 hover:bg-stone-100 hover:text-stone-900'
                            }`}
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <div className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-[10px] shrink-0 ${
                                t.avatarColor || 'bg-stone-700 text-white'
                              }`}>
                                {t.name.charAt(0)}
                              </div>
                              <div className="min-w-0">
                                <div className="truncate font-semibold leading-tight">
                                  {language === 'kn' ? t.nameKn : t.name}
                                </div>
                                <div className="text-[10px] text-stone-500 truncate">
                                  {t.assignedGrades.join(', ')} • {t.role.split(' ')[0]}
                                </div>
                              </div>
                            </div>
                            {isCurrent && (
                              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                            )}
                          </button>
                        );
                      })}
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="pt-2 border-t border-stone-100 space-y-1">
                  <button
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      openAboutModal();
                    }}
                    className="w-full text-left px-3 py-2 text-xs text-stone-700 hover:bg-stone-100 rounded-lg flex items-center gap-2 font-medium"
                  >
                    <Info className="w-4 h-4 text-stone-500" />
                    <span>{t.aboutRuralClass}</span>
                  </button>
                  <button
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      logout();
                    }}
                    className="w-full text-left px-3 py-2 text-xs text-rose-700 hover:bg-rose-50 rounded-lg flex items-center gap-2 font-medium"
                  >
                    <LogOut className="w-4 h-4 text-rose-500" />
                    <span>{language === 'kn' ? 'ಸೈನ್ ಔಟ್' : 'Sign Out'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
