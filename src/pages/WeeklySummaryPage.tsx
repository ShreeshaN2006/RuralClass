import React from 'react';
import { useApp } from '../context/AppContext';
import { TRANSLATIONS } from '../utils/translations';
import {
  Calendar,
  CheckCircle2,
  AlertTriangle,
  Users,
  BookOpen,
  HeartHandshake,
  ArrowRight,
  TrendingUp,
  FileText,
} from 'lucide-react';

export const WeeklySummaryPage: React.FC = () => {
  const { setCurrentView, activeInterventions, language } = useApp();
  const t = TRANSLATIONS[language];

  const handlePlanNextWeek = () => {
    setCurrentView('timetable');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-stone-900 tracking-tight flex items-center gap-2">
            <FileText className="w-6 h-6 text-amber-700" />
            <span>{t.weeklySummaryTitle}</span>
          </h1>
          <p className="text-sm text-stone-600 mt-1">
            {t.weeklySummarySub}
          </p>
        </div>

        <button
          onClick={handlePlanNextWeek}
          className="px-4 py-2 bg-amber-700 hover:bg-amber-800 text-white rounded-xl text-xs sm:text-sm font-bold transition-all shadow-xs flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Calendar className="w-4 h-4" />
          <span>{t.btnPlanNextWeek}</span>
          <ArrowRight className="w-4 h-4 ml-1" />
        </button>
      </div>

      {/* Primary KPI Metrics (Section 8) */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
          <div className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider mb-1">
            Lessons Planned
          </div>
          <div className="text-2xl font-extrabold text-stone-900">20</div>
          <div className="text-[11px] text-stone-400 mt-0.5">Across 5 grades</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-emerald-200 bg-emerald-50/20 shadow-xs">
          <div className="text-[11px] font-semibold text-emerald-800 uppercase tracking-wider mb-1">
            Lessons Completed
          </div>
          <div className="text-2xl font-extrabold text-emerald-950">18</div>
          <div className="text-[11px] text-emerald-700 mt-0.5">90% completion rate</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-blue-200 bg-blue-50/20 shadow-xs">
          <div className="text-[11px] font-semibold text-blue-800 uppercase tracking-wider mb-1">
            Students Assessed
          </div>
          <div className="text-2xl font-extrabold text-blue-950">34</div>
          <div className="text-[11px] text-blue-700 mt-0.5">Formative check-ins</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-amber-300 bg-amber-50/40 shadow-xs">
          <div className="text-[11px] font-bold text-amber-900 uppercase tracking-wider mb-1">
            Follow-up Needed
          </div>
          <div className="text-2xl font-extrabold text-amber-950">6</div>
          <div className="text-[11px] text-amber-800 mt-0.5">Active support flags</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-purple-200 bg-purple-50/20 shadow-xs col-span-2 lg:col-span-1">
          <div className="text-[11px] font-semibold text-purple-800 uppercase tracking-wider mb-1">
            Interventions
          </div>
          <div className="text-2xl font-extrabold text-purple-950">4</div>
          <div className="text-[11px] text-purple-700 mt-0.5">Completed successfully</div>
        </div>
      </div>

      {/* Areas Needing Attention Section (Section 8) */}
      <div className="bg-white rounded-2xl border border-stone-200 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            <h2 className="text-base font-bold text-stone-900">
              {t.areasNeedingAttention}
            </h2>
          </div>
          <span className="text-xs text-stone-400">Targeted Multi-Grade Focus</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Attention Area 1: Grade 3 Mathematics */}
          <div className="p-4 rounded-xl border border-amber-300 bg-amber-50/40 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-stone-900">
                Grade 3 — Mathematics
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-amber-200 text-amber-950">
                5 students
              </span>
            </div>
            <p className="text-xs text-stone-700 leading-relaxed">
              5 students need additional concrete object practice in multiplication tables (tables of 3 and 4). Suggested action: Schedule two 10-minute peer practice blocks using tamarind seeds.
            </p>
            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setCurrentView('interventions')}
                className="text-xs font-bold text-amber-800 hover:text-amber-950 hover:underline flex items-center gap-1"
              >
                <span>View Suggested Actions</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Attention Area 2: Grade 2 Reading */}
          <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/40 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-stone-900">
                Grade 2 — Reading
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-200 text-blue-950">
                3 students
              </span>
            </div>
            <p className="text-xs text-stone-700 leading-relaxed">
              3 students are still developing fluency with Kannada compound vowels (Ottakshara). Suggested action: Pair with Grade 2 confident peers during morning silent reading.
            </p>
            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setCurrentView('students')}
                className="text-xs font-bold text-blue-800 hover:text-blue-950 hover:underline flex items-center gap-1"
              >
                <span>View Students</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Collaborative Support Recap */}
      <div className="p-5 rounded-2xl border border-stone-200 bg-stone-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center shrink-0">
            <HeartHandshake className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-stone-900">
              Teacher Support Collaboration
            </h3>
            <p className="text-xs text-stone-600 mt-0.5">
              2 teacher substitution / support sessions were completed this week, ensuring zero lost periods.
            </p>
          </div>
        </div>

        <button
          onClick={() => setCurrentView('teacherSupport')}
          className="px-4 py-2 border border-stone-300 text-stone-800 hover:bg-white rounded-xl text-xs font-semibold self-start sm:self-auto"
        >
          View Support Log
        </button>
      </div>
    </div>
  );
};
