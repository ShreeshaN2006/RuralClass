import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TRANSLATIONS } from '../utils/translations';
import { ActivityBankItem, GradeLevel, Subject } from '../types';
import {
  BookOpen,
  Filter,
  PlusCircle,
  Users,
  Clock,
  Sparkles,
  Layers,
  Search,
  Check,
  ShieldCheck,
} from 'lucide-react';

export const ActivityBankPage: React.FC = () => {
  const { activityBank, addActivityToTimetable, language, school } = useApp();
  const t = TRANSLATIONS[language];

  const [selectedGrade, setSelectedGrade] = useState<string>('All');
  const [selectedSubject, setSelectedSubject] = useState<string>('All');
  const [selectedMode, setSelectedMode] = useState<string>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredActivities = activityBank.filter(item => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.titleKn.includes(searchQuery) ||
      item.topic.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesGrade = selectedGrade === 'All' || item.grade === selectedGrade;
    const matchesSubject = selectedSubject === 'All' || item.subject === selectedSubject;
    const matchesMode = selectedMode === 'All' || item.mode === selectedMode;
    const matchesDifficulty = selectedDifficulty === 'All' || item.difficulty === selectedDifficulty;

    return matchesSearch && matchesGrade && matchesSubject && matchesMode && matchesDifficulty;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-stone-900 tracking-tight flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-amber-700" />
            <span>{t.activityBankTitle}</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 font-bold">
              {filteredActivities.length} Activities
            </span>
          </h1>
          <p className="text-sm text-stone-600 mt-1">
            {t.activityBankSub}
          </p>
        </div>

        {/* Low-resource badge */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold self-start sm:self-auto">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Zero Expensive Materials</span>
        </div>
      </div>

      {/* Low-resource Classroom Guarantee Notice */}
      <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-amber-950 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-700 shrink-0" />
          <span>{t.lowResourcePrioritized}</span>
        </div>
        <span className="text-stone-400 text-[11px] hidden sm:inline">Autonomous Rural Classroom Kit</span>
      </div>

      {/* Filter and Search Bar (Section 2) */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search activities by name or topic (e.g. bottle caps, seeds, reading)..."
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-600 bg-stone-50/50"
          />
        </div>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Grade filter */}
          <select
            value={selectedGrade}
            onChange={e => setSelectedGrade(e.target.value)}
            className="px-3 py-2 text-xs font-semibold border border-stone-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-amber-600 text-stone-700"
          >
            <option value="All">{t.allGrades}</option>
            {school.grades.map(g => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>

          {/* Subject filter */}
          <select
            value={selectedSubject}
            onChange={e => setSelectedSubject(e.target.value)}
            className="px-3 py-2 text-xs font-semibold border border-stone-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-amber-600 text-stone-700"
          >
            <option value="All">All Subjects</option>
            <option value="Mathematics">Mathematics</option>
            <option value="Kannada">Kannada</option>
            <option value="English">English</option>
            <option value="Environmental Studies">Environmental Studies</option>
          </select>

          {/* Mode filter */}
          <select
            value={selectedMode}
            onChange={e => setSelectedMode(e.target.value)}
            className="px-3 py-2 text-xs font-semibold border border-stone-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-amber-600 text-stone-700"
          >
            <option value="All">All Modes</option>
            <option value="Individual">Individual (ವೈಯಕ್ತಿಕ)</option>
            <option value="Pair">Pair (ಜೊತೆಗಾರ)</option>
            <option value="Group">Group (ಗುಂಪು)</option>
          </select>

          {/* Difficulty filter */}
          <select
            value={selectedDifficulty}
            onChange={e => setSelectedDifficulty(e.target.value)}
            className="px-3 py-2 text-xs font-semibold border border-stone-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-amber-600 text-stone-700"
          >
            <option value="All">All Levels</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Challenging">Challenging</option>
          </select>
        </div>
      </div>

      {/* Activity Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredActivities.map(item => (
          <div
            key={item.id}
            className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs hover:border-amber-300 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              {/* Header Badges */}
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-1.5">
                  <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-bold text-xs">
                    {item.grade}
                  </span>
                  <span className="text-xs text-stone-500 font-medium">{item.subject}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                    item.mode === 'Pair'
                      ? 'bg-teal-50 text-teal-800 border border-teal-200'
                      : item.mode === 'Group'
                      ? 'bg-indigo-50 text-indigo-800 border border-indigo-200'
                      : 'bg-stone-100 text-stone-700 border border-stone-200'
                  }`}>
                    {item.mode}
                  </span>
                  <span className="text-[10px] font-mono text-stone-500 bg-stone-100 px-1.5 py-0.5 rounded">
                    {item.durationMinutes}m
                  </span>
                </div>
              </div>

              {/* Title */}
              <h2 className="text-base font-bold text-stone-900 tracking-tight">
                {language === 'kn' ? item.titleKn : item.title}
              </h2>
              <div className="text-[11px] text-amber-800 font-semibold mt-0.5">
                Topic: {language === 'kn' ? item.topicKn : item.topic}
              </div>

              {/* Description */}
              <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                {language === 'kn' ? item.descriptionKn : item.description}
              </p>

              {/* Materials */}
              <div className="mt-3 p-2 rounded-lg bg-stone-50 border border-stone-200 text-[11px] text-stone-600">
                <strong className="text-stone-800 font-semibold">Materials: </strong>
                <span>{item.materials.join(', ')}</span>
              </div>

              {/* Instructions */}
              <div className="mt-2.5 space-y-1">
                <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">
                  Quick Steps:
                </span>
                <ul className="text-[11px] text-stone-600 space-y-0.5 list-disc list-inside">
                  {item.instructions.map((step, idx) => (
                    <li key={idx}>{step}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Bottom Button */}
            <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
              <span className="text-[10px] text-stone-400 font-mono">
                Diff: {item.difficulty}
              </span>
              <button
                onClick={() => addActivityToTimetable(item)}
                className="px-3.5 py-1.5 bg-amber-700 hover:bg-amber-800 text-white rounded-xl text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5"
              >
                <PlusCircle className="w-3.5 h-3.5 text-amber-200" />
                <span>{t.btnAddToTimetable}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
