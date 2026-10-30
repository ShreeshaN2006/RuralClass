import React from 'react';
import { useApp, NavigationTab } from '../context/AppContext';
import { TRANSLATIONS } from '../utils/translations';
import {
  LayoutDashboard,
  Calendar,
  BookOpen,
  Users,
  BarChart3,
  HeartHandshake,
  School as SchoolIcon,
  Settings,
  X,
  PlayCircle,
  FolderOpen,
  UserCheck,
  FileText,
  ShieldCheck,
  Scale,
} from 'lucide-react';

interface SidebarProps {
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isMobileOpen, onCloseMobile }) => {
  const { currentView, setCurrentView, language, pendingSuggestions, supportRequests } = useApp();
  const t = TRANSLATIONS[language];

  const pendingSupportCount = supportRequests.filter(r => r.status === 'requested' || r.status === 'accepted_by_teacher').length;

  const navGroups: {
    title: string;
    items: { id: NavigationTab; label: string; icon: React.FC<{ className?: string }>; badge?: number }[];
  }[] = [
    {
      title: 'Overview',
      items: [{ id: 'dashboard', label: t.navDashboard, icon: LayoutDashboard }],
    },
    {
      title: t.navGroupTeaching,
      items: [
        { id: 'todaysClassroom', label: t.navTodaysClassroom, icon: PlayCircle },
        { id: 'timetable', label: t.navTimetable, icon: Calendar },
        { id: 'lessonPlanner', label: t.navLessonPlanner, icon: BookOpen },
        { id: 'activityBank', label: t.navActivityBank, icon: FolderOpen },
      ],
    },
    {
      title: t.navGroupStudents,
      items: [
        { id: 'students', label: t.navStudents, icon: Users },
        { id: 'attendance', label: t.navAttendance, icon: UserCheck },
        { id: 'progress', label: t.navProgress, icon: BarChart3 },
        {
          id: 'interventions',
          label: t.navInterventions,
          icon: HeartHandshake,
          badge: pendingSuggestions.length > 0 ? pendingSuggestions.length : undefined,
        },
      ],
    },
    {
      title: t.navGroupCollaboration,
      items: [
        {
          id: 'teacherSupport',
          label: t.navTeacherSupport,
          icon: HeartHandshake,
          badge: pendingSupportCount > 0 ? pendingSupportCount : undefined,
        },
        { id: 'weeklySummary', label: t.navWeeklySummary, icon: FileText },
      ],
    },
    {
      title: t.navGroupGeneral,
      items: [
        { id: 'school', label: t.navSchool, icon: SchoolIcon },
        { id: 'settings', label: t.navSettings, icon: Settings },
      ],
    },
  ];

  const content = (
    <div className="flex flex-col h-full bg-stone-900 text-stone-200">
      {/* Brand Header */}
      <div className="p-4 sm:p-5 border-b border-stone-800 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-600 text-white flex items-center justify-center font-bold text-lg shadow-md shadow-amber-900/40">
            RC
          </div>
          <div>
            <div className="font-bold text-base text-white tracking-tight flex items-center gap-1.5">
              <span>RuralClass</span>
              <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded font-mono font-normal">
                MVP
              </span>
            </div>
            <p className="text-[11px] text-stone-400 leading-tight">
              {language === 'kn' ? 'ಬಹು-ತರಗತಿ ಕೊಠಡಿ ಸಹಾಯಕ' : 'Multi-Grade Classroom Assistant'}
            </p>
          </div>
        </div>

        {/* Close button on mobile */}
        <button
          onClick={onCloseMobile}
          className="lg:hidden p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
          aria-label="Close navigation"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Nav List Grouped */}
      <nav className="flex-1 p-3 space-y-4 overflow-y-auto">
        {navGroups.map((group, gIdx) => (
          <div key={gIdx} className="space-y-1">
            <div className="text-[10px] font-bold uppercase tracking-wider text-stone-400 px-3 py-1">
              {group.title}
            </div>
            {group.items.map(item => {
              const Icon = item.icon;
              const isActive = currentView === item.id || (item.id === 'students' && currentView === 'studentProfile');
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentView(item.id);
                    onCloseMobile();
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-amber-600 text-white shadow-sm shadow-amber-950/30 font-semibold'
                      : 'text-stone-300 hover:bg-stone-800/80 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-stone-400'}`} />
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold shrink-0 ${
                      isActive ? 'bg-white text-amber-700' : 'bg-amber-500 text-stone-900'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Ethical Notice & Footer Tagline */}
      <div className="p-3.5 border-t border-stone-800 text-[11px] text-stone-400 space-y-1.5 shrink-0">
        <div className="flex items-start gap-1.5 text-stone-300">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
          <p className="leading-snug">
            {language === 'kn' ? 'ಶಿಕ್ಷಕರ ತೀರ್ಮಾನವೇ ಅಂತಿಮ' : 'Teacher-in-the-loop priority.'}
          </p>
        </div>
        <p className="text-[10px] text-stone-500 italic">
          "{t.tagline}"
        </p>
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden lg:block w-64 shrink-0 h-screen sticky top-0 border-r border-stone-800 shadow-xl z-40">
        {content}
      </aside>

      {isMobileOpen && (
        <div role="dialog" aria-modal="true" className="lg:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-stone-950/60 backdrop-blur-xs transition-opacity" onClick={onCloseMobile} />
          <div className="relative w-72 max-w-xs h-full z-10 shadow-2xl">
            {content}
          </div>
        </div>
      )}
    </>
  );
};
