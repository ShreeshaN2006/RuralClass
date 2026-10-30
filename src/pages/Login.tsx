import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { TRANSLATIONS } from '../utils/translations';
import { getAvailableTeacherLogins, QuickLoginOption } from '../services/authService';
import {
  GraduationCap,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  BookOpen,
  Calendar,
  HeartHandshake,
  Users,
  Search,
  School as SchoolIcon,
  CheckCircle2,
  KeyRound,
  AlertCircle,
  Award,
} from 'lucide-react';

export const Login: React.FC = () => {
  const { loginDemo, loginAsTeacher, loginWithCredentials, language, setLanguage, allTeachers } = useApp();
  const t = TRANSLATIONS[language];

  const teacherLogins = useMemo(() => getAvailableTeacherLogins(allTeachers), [allTeachers]);

  // Tab & search states
  const [selectedSchoolFilter, setSelectedSchoolFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'cards' | 'form'>('cards');

  // Form states
  const [teacherId, setTeacherId] = useState('teacher_anita');
  const [password, setPassword] = useState('demo123');
  const [formError, setFormError] = useState<string | null>(null);

  // Filtered teachers
  const filteredTeachers = useMemo(() => {
    return teacherLogins.filter(item => {
      const matchesSchool = selectedSchoolFilter === 'all' || item.schoolId === selectedSchoolFilter;
      const q = searchQuery.trim().toLowerCase();
      if (!q) return matchesSchool;

      const matchesQuery =
        item.name.toLowerCase().includes(q) ||
        item.nameKn.includes(q) ||
        item.role.toLowerCase().includes(q) ||
        (item.roleKn && item.roleKn.includes(q)) ||
        item.schoolName.toLowerCase().includes(q) ||
        item.assignedGrades.some(g => g.toLowerCase().includes(q)) ||
        (item.email && item.email.toLowerCase().includes(q));

      return matchesSchool && matchesQuery;
    });
  }, [teacherLogins, selectedSchoolFilter, searchQuery]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    const result = loginWithCredentials(teacherId, password);
    if (!result.success && result.error) {
      setFormError(result.error);
    }
  };

  const handleSelectTeacherForForm = (teacher: QuickLoginOption) => {
    setTeacherId(teacher.id);
    setPassword(teacher.defaultPassword);
    setActiveTab('form');
    setFormError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-100 via-stone-50 to-amber-50/40 flex flex-col justify-between p-4 sm:p-6 lg:p-8">
      {/* Top bar with branding & language selector */}
      <header className="max-w-6xl w-full mx-auto flex items-center justify-between pb-4 border-b border-stone-200/70">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-700 text-white flex items-center justify-center font-bold text-lg shadow-md">
            RC
          </div>
          <div>
            <span className="font-bold text-stone-900 tracking-tight text-xl block leading-tight">RuralClass</span>
            <span className="text-[11px] text-stone-500 hidden sm:inline">
              Multi-Grade Planning & Explainable Student Support
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="inline-flex rounded-xl p-0.5 bg-white border border-stone-200 shadow-2xs">
            <button
              onClick={() => setLanguage('en')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                language === 'en' ? 'bg-amber-700 text-white shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              English
            </button>
            <button
              onClick={() => setLanguage('kn')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all font-sans ${
                language === 'kn' ? 'bg-amber-700 text-white shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              ಕನ್ನಡ
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-6xl w-full mx-auto my-6">
        {/* Hero Title */}
        <div className="text-center max-w-2xl mx-auto mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-semibold mb-3 border border-amber-300">
            <Sparkles className="w-3.5 h-3.5 text-amber-700" />
            <span>
              {language === 'kn' ? '11 ಶಿಕ್ಷಕರ ಲಾಗಿನ್‌ಗಳು ಲಭ್ಯವಿದೆ' : '11 Dedicated Rural Teacher Logins Ready'}
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
            {language === 'kn' ? 'ಶಿಕ್ಷಕರ ಖಾತೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ' : 'Select a Teacher Account to Sign In'}
          </h1>
          <p className="text-sm sm:text-base text-stone-600 mt-2 font-medium">
            {language === 'kn'
              ? 'ಕರ್ನಾಟಕದ ಗ್ರಾಮೀಣ ಪ್ರಾಥಮಿಕ ಶಾಲೆಗಳ ಬಹು-ತರಗತಿ ಬೋಧಕರಿಗಾಗಿ ವಿನ್ಯಾಸಗೊಳಿಸಲಾಗಿದೆ'
              : 'Empowering multi-grade educators across Karnataka with conflict-free timetables and explainable student interventions.'}
          </p>
        </div>

        {/* View Mode Switcher Tabs */}
        <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
          <div className="inline-flex rounded-xl p-1 bg-stone-200/80 border border-stone-300 shadow-2xs">
            <button
              onClick={() => setActiveTab('cards')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'cards'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Users className="w-4 h-4 text-amber-700" />
              <span>{language === 'kn' ? 'ಶಿಕ್ಷಕರ ಪಟ್ಟಿ (1-Click Login)' : 'Teacher Profiles (1-Click Login)'}</span>
              <span className="px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-800 text-[10px]">
                {teacherLogins.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('form')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'form'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <KeyRound className="w-4 h-4 text-amber-700" />
              <span>{language === 'kn' ? 'ಐಡಿ ಮತ್ತು ಪಾಸ್‌ವರ್ಡ್' : 'Manual ID & Password'}</span>
            </button>
          </div>

          {/* Quick Demo Button (Highlighted) */}
          <button
            type="button"
            onClick={loginDemo}
            className="py-2.5 px-4 bg-amber-700 hover:bg-amber-800 text-white font-semibold rounded-xl text-xs sm:text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2 group self-start sm:self-auto"
          >
            <Sparkles className="w-4 h-4 text-amber-200 group-hover:rotate-12 transition-transform" />
            <span>{language === 'kn' ? 'ತ್ವರಿತ ಡೆಮೊ (ಅನಿತಾ ಶಿಕ್ಷಕಿ)' : 'Quick Demo: Anita Teacher'}</span>
            <ArrowRight className="w-4 h-4 text-amber-200 ml-0.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Tab 1: Teacher Cards View */}
        {activeTab === 'cards' && (
          <div className="space-y-4">
            {/* Filter and Search Bar */}
            <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
              {/* School Filter Chips */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-xs font-bold text-stone-500 uppercase tracking-wider mr-1 hidden sm:inline">
                  {language === 'kn' ? 'ಶಾಲೆ:' : 'School:'}
                </span>
                <button
                  onClick={() => setSelectedSchoolFilter('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    selectedSchoolFilter === 'all'
                      ? 'bg-amber-700 text-white shadow-2xs'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  {language === 'kn' ? 'ಎಲ್ಲಾ ಶಾಲೆಗಳು' : 'All Schools'} ({teacherLogins.length})
                </button>
                <button
                  onClick={() => setSelectedSchoolFilter('school_hallikeri')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    selectedSchoolFilter === 'school_hallikeri'
                      ? 'bg-amber-700 text-white shadow-2xs'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  GHPS Hallikeri (5)
                </button>
                <button
                  onClick={() => setSelectedSchoolFilter('school_belagavi')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    selectedSchoolFilter === 'school_belagavi'
                      ? 'bg-amber-700 text-white shadow-2xs'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  GPS Belagavi (4)
                </button>
                <button
                  onClick={() => setSelectedSchoolFilter('school_kundgol')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    selectedSchoolFilter === 'school_kundgol'
                      ? 'bg-amber-700 text-white shadow-2xs'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  GLPS Kundgol (2)
                </button>
              </div>

              {/* Search input */}
              <div className="relative min-w-[220px]">
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder={language === 'kn' ? 'ಹೆಸರು, ತರಗತಿ ಅಥವಾ ವಿಷಯ ಹುಡುಕಿ...' : 'Search teacher, grade, subject...'}
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600"
                />
              </div>
            </div>

            {/* Teachers Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTeachers.map(teacher => {
                const initial = teacher.name.charAt(0);
                return (
                  <div
                    key={teacher.id}
                    className="bg-white rounded-2xl border border-stone-200/90 hover:border-amber-400 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
                  >
                    <div>
                      {/* Top Header of Card */}
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-base shadow-sm ring-2 ring-stone-100 ${
                              teacher.avatarColor || 'bg-amber-700 text-white'
                            }`}
                          >
                            {initial}
                          </div>
                          <div>
                            <h3 className="font-bold text-stone-900 text-sm group-hover:text-amber-800 transition-colors">
                              {language === 'kn' ? teacher.nameKn : teacher.name}
                            </h3>
                            <p className="text-[11px] text-amber-900 font-medium">
                              {language === 'kn' ? teacher.roleKn || teacher.role : teacher.role}
                            </p>
                          </div>
                        </div>

                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-stone-100 text-stone-600 font-semibold shrink-0">
                          ID: {teacher.id.replace('teacher_', '')}
                        </span>
                      </div>

                      {/* School & Location */}
                      <div className="text-xs text-stone-600 flex items-center gap-1.5 mb-2.5">
                        <SchoolIcon className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                        <span className="truncate">
                          {language === 'kn' ? teacher.schoolNameKn : teacher.schoolName}
                        </span>
                      </div>

                      {/* Grades Chips */}
                      <div className="flex items-center gap-1.5 flex-wrap mb-3">
                        <span className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider mr-1">
                          Grades:
                        </span>
                        {teacher.assignedGrades.map(g => (
                          <span
                            key={g}
                            className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 text-[11px] font-semibold"
                          >
                            {g}
                          </span>
                        ))}
                      </div>

                      {/* Syllabus completion progress bar */}
                      <div className="bg-stone-50 rounded-lg p-2.5 border border-stone-100 mb-4">
                        <div className="flex items-center justify-between text-[11px] font-semibold text-stone-600 mb-1">
                          <span>Syllabus Covered</span>
                          <span className="text-amber-800 font-bold">{teacher.syllabusCompletion}%</span>
                        </div>
                        <div className="w-full bg-stone-200 h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-amber-600 h-1.5 rounded-full"
                            style={{ width: `${teacher.syllabusCompletion}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="pt-3 border-t border-stone-100 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => loginAsTeacher(teacher.id)}
                        className="flex-1 py-2 px-3 bg-amber-700 hover:bg-amber-800 text-white font-semibold rounded-xl text-xs shadow-xs transition-colors flex items-center justify-center gap-1.5"
                      >
                        <span>{language === 'kn' ? 'ಲಾಗಿನ್ ಆಗಿ' : `Sign in as ${teacher.name.split(' ')[0]}`}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleSelectTeacherForForm(teacher)}
                        title="Fill ID and password into manual form"
                        className="p-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-semibold transition-colors"
                      >
                        <KeyRound className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredTeachers.length === 0 && (
              <div className="bg-white rounded-2xl border border-stone-200 p-8 text-center">
                <Users className="w-8 h-8 text-stone-400 mx-auto mb-2" />
                <p className="text-sm font-semibold text-stone-700">No teachers found matching "{searchQuery}"</p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedSchoolFilter('all');
                  }}
                  className="mt-2 text-xs text-amber-700 font-semibold underline"
                >
                  Clear search and school filters
                </button>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Manual Form View */}
        {activeTab === 'form' && (
          <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl border border-stone-200 p-6 sm:p-8">
            <div className="text-center mb-6">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 mx-auto flex items-center justify-center mb-3 shadow-inner">
                <KeyRound className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold text-stone-900 tracking-tight">
                {language === 'kn' ? 'ಶಿಕ್ಷಕರ ಐಡಿ ಮೂಲಕ ಸೈನ್ ಇನ್' : 'Sign In with Teacher ID'}
              </h2>
              <p className="text-xs text-stone-500 mt-1">
                Enter your registered ID (e.g. <code>teacher_anita</code>, <code>priya</code>, <code>suresh</code>)
              </p>
            </div>

            {formError && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="teacher-id"
                  className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1"
                >
                  {language === 'kn' ? 'ಶಿಕ್ಷಕರ ಐಡಿ (Teacher ID)' : 'Teacher ID / Email'}
                </label>
                <div className="relative">
                  <input
                    id="teacher-id"
                    type="text"
                    value={teacherId}
                    onChange={e => {
                      setTeacherId(e.target.value);
                      setFormError(null);
                    }}
                    placeholder="e.g. teacher_anita, priya, suresh"
                    className="w-full px-3.5 py-2.5 border border-stone-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-600 bg-stone-50/50"
                    required
                  />
                </div>

                {/* Quick teacher suggestion chips */}
                <div className="mt-2 flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10px] text-stone-400 font-medium">Quick Pick:</span>
                  {teacherLogins.slice(0, 4).map(t => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => {
                        setTeacherId(t.id);
                        setPassword(t.defaultPassword);
                        setFormError(null);
                      }}
                      className="px-2 py-0.5 rounded bg-stone-100 hover:bg-amber-100 hover:text-amber-900 text-stone-700 text-[10px] font-semibold transition-colors"
                    >
                      {t.name.split(' ')[0]}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label
                    htmlFor="teacher-pass"
                    className="block text-xs font-semibold text-stone-700 uppercase tracking-wider"
                  >
                    {language === 'kn' ? 'ಪಾಸ್‌ವರ್ಡ್ (Password)' : 'Password'}
                  </label>
                  <button
                    type="button"
                    onClick={() => setPassword('demo123')}
                    className="text-[11px] text-amber-700 hover:underline font-semibold"
                  >
                    Fill "demo123"
                  </button>
                </div>
                <input
                  id="teacher-pass"
                  type="password"
                  value={password}
                  onChange={e => {
                    setPassword(e.target.value);
                    setFormError(null);
                  }}
                  className="w-full px-3.5 py-2.5 border border-stone-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-600 bg-stone-50/50"
                  required
                />
                <p className="text-[10px] text-stone-500 mt-1">
                  Demo password for all accounts is <code>demo123</code>.
                </p>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-stone-900 hover:bg-stone-800 text-white font-medium rounded-xl text-sm transition-colors shadow-xs"
              >
                {language === 'kn' ? 'ಸೈನ್ ಇನ್ (Sign In)' : 'Sign In to RuralClass'}
              </button>
            </form>

            <div className="mt-5 pt-4 border-t border-stone-100 text-center">
              <button
                type="button"
                onClick={() => setActiveTab('cards')}
                className="text-xs text-amber-800 font-semibold hover:underline inline-flex items-center gap-1"
              >
                <span>Browse all 11 Teacher Profiles</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Feature highlights below */}
      <footer className="max-w-4xl w-full mx-auto pt-6 border-t border-stone-200/80">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center text-xs text-stone-600">
          <div className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-white/70 border border-stone-200 shadow-2xs">
            <Calendar className="w-4 h-4 text-amber-700 shrink-0" />
            <span>Conflict-Free Multi-Grade Timetables</span>
          </div>
          <div className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-white/70 border border-stone-200 shadow-2xs">
            <BookOpen className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>Multi-Grade Lesson Plans & Activity Bank</span>
          </div>
          <div className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-white/70 border border-stone-200 shadow-2xs">
            <HeartHandshake className="w-4 h-4 text-blue-700 shrink-0" />
            <span>Explainable Pedagogical Interventions</span>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-center gap-2 text-[11px] text-stone-500">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>
            {language === 'kn'
              ? 'ಶಿಕ್ಷಕರ ಕೇಂದ್ರಿತ ಗೌಪ್ಯತೆ: ಡೇಟಾ ಸ್ಥಳೀಯವಾಗಿ ಸಂಗ್ರಹವಾಗುತ್ತದೆ ಮತ್ತು ಆಫ್‌ಲೈನ್‌ನಲ್ಲಿ ಸಂಪೂರ್ಣವಾಗಿ ಕಾರ್ಯನಿರ್ವಹಿಸುತ್ತದೆ.'
              : 'Local-first architecture: Works fully offline in school tablets with zero cloud latency.'}
          </span>
        </div>
      </footer>
    </div>
  );
};
