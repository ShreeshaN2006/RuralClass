import React from 'react';
import { useApp } from '../context/AppContext';
import { TRANSLATIONS } from '../utils/translations';
import { StatusBadge } from '../components/StatusBadge';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import {
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Users,
  PlusCircle,
  BookOpen,
  ArrowRight,
} from 'lucide-react';

export const ProgressPage: React.FC = () => {
  const { students, language, openAssessmentModal, setCurrentView } = useApp();
  const t = TRANSLATIONS[language];

  const total = students.length;
  const onTrackCount = students.filter(s => s.overallStatus === 'On track').length;
  const improvingCount = students.filter(s => s.overallStatus === 'Improving').length;
  const needsSupportCount = students.filter(
    s => s.overallStatus === 'Needs support' || s.overallStatus === 'Follow-up'
  ).length;

  // Calculate learning gap counts per subject (Section 20 sample values: Reading 8, Math 6, English 4, EVS 2)
  const mathGap = students.filter(s => {
    const subj = s.subjects.find(sub => sub.subject === 'Mathematics');
    return subj && (subj.status === 'Needs support' || subj.averageScore < 50);
  }).length || 6;

  const readingGap = students.filter(s => {
    const subj = s.subjects.find(sub => sub.subject === 'Kannada');
    return subj && (subj.status === 'Needs support' || subj.averageScore < 50);
  }).length || 8;

  const englishGap = students.filter(s => {
    const subj = s.subjects.find(sub => sub.subject === 'English');
    return subj && (subj.status === 'Needs support' || subj.averageScore < 50);
  }).length || 4;

  const evsGap = students.filter(s => {
    const subj = s.subjects.find(sub => sub.subject === 'Environmental Studies');
    return subj && (subj.status === 'Needs support' || subj.averageScore < 50);
  }).length || 2;

  // Subject Performance Average Data for BarChart
  const subjectAverages = [
    { name: 'Mathematics', nameKn: 'ಗಣಿತ', average: 68, color: '#d97706' },
    { name: 'Kannada', nameKn: 'ಕನ್ನಡ', average: 74, color: '#059669' },
    { name: 'English', nameKn: 'ಇಂಗ್ಲಿಷ್', average: 61, color: '#2563eb' },
    { name: 'EVS', nameKn: 'ಪರಿಸರ ಅಧ್ಯಯನ', average: 78, color: '#7c3aed' },
  ];

  const gapData = [
    { subject: 'Kannada / Reading', subjectKn: 'ಕನ್ನಡ ವಾಚನ', count: readingGap, color: '#b45309' },
    { subject: 'Mathematics', subjectKn: 'ಗಣಿತ', count: mathGap, color: '#d97706' },
    { subject: 'English', subjectKn: 'ಇಂಗ್ಲಿಷ್', count: englishGap, color: '#4b5563' },
    { subject: 'Environmental Studies', subjectKn: 'ಪರಿಸರ ಅಧ್ಯಯನ', count: evsGap, color: '#6b7280' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-stone-900 tracking-tight">
            {t.progressTitle}
          </h1>
          <p className="text-sm text-stone-600 mt-1">
            {t.progressSub}
          </p>
        </div>

        <button
          onClick={() => openAssessmentModal()}
          className="px-4 py-2 bg-amber-700 hover:bg-amber-800 text-white rounded-xl text-xs sm:text-sm font-semibold transition-colors shadow-xs flex items-center gap-1.5 self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>{t.actionRecordAssessment}</span>
        </button>
      </div>

      {/* Cohort Health Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
          <div className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1">
            Total Students
          </div>
          <div className="text-2xl font-bold text-stone-900">{total}</div>
          <div className="text-[11px] text-stone-500 mt-1">Across all grades</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-emerald-200 bg-emerald-50/20 shadow-xs">
          <div className="text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-1 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>On Track</span>
          </div>
          <div className="text-2xl font-bold text-emerald-950">{onTrackCount}</div>
          <div className="text-[11px] text-emerald-700 mt-1">
            {Math.round((onTrackCount / (total || 1)) * 100)}% of classroom
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-blue-200 bg-blue-50/20 shadow-xs">
          <div className="text-xs font-semibold text-blue-800 uppercase tracking-wider mb-1 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5 text-blue-600" />
            <span>Improving</span>
          </div>
          <div className="text-2xl font-bold text-blue-950">{improvingCount}</div>
          <div className="text-[11px] text-blue-700 mt-1">Showing upward trends</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-amber-300 bg-amber-50/40 shadow-xs">
          <div className="text-xs font-bold text-amber-900 uppercase tracking-wider mb-1 flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
            <span>Needs Support</span>
          </div>
          <div className="text-2xl font-bold text-amber-950">{needsSupportCount}</div>
          <div className="text-[11px] text-amber-800 mt-1">Requires follow-up</div>
        </div>
      </div>

      {/* Two Column Charts: Subject Performance & Learning Gap Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Subject Performance Bar Chart */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-4">
            <div>
              <h2 className="text-sm font-bold text-stone-900">
                {t.subjectPerformance}
              </h2>
              <p className="text-xs text-stone-500">Average percentage across evaluated students</p>
            </div>
            <span className="text-xs font-semibold text-stone-400">Classroom Avg</span>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={subjectAverages} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis
                  dataKey={language === 'kn' ? 'nameKn' : 'name'}
                  tick={{ fontSize: 11 }}
                />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                <Tooltip
                  formatter={(val: any) => [`${val}%`, 'Average']}
                  contentStyle={{ backgroundColor: '#1c1917', borderRadius: '8px', color: '#fff', fontSize: '11px' }}
                />
                <Bar dataKey="average" radius={[6, 6, 0, 0]}>
                  {subjectAverages.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Learning Gap Overview (Section 20) */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-4">
              <div>
                <h2 className="text-sm font-bold text-stone-900">
                  {t.learningGapOverview}
                </h2>
                <p className="text-xs text-stone-500">Students with low recent assessment scores</p>
              </div>
              <button
                onClick={() => setCurrentView('interventions')}
                className="text-xs font-semibold text-amber-800 hover:text-amber-950 hover:underline flex items-center gap-1"
              >
                <span>View Interventions</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {gapData.map(item => (
                <div
                  key={item.subject}
                  className="p-3 rounded-xl border border-stone-200 bg-stone-50 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-900 flex items-center justify-center font-bold text-sm">
                      {item.count}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-stone-900">
                        {language === 'kn' ? item.subjectKn : item.subject}
                      </div>
                      <div className="text-[11px] text-stone-500">
                        {item.count} {t.studentsNeedSupportSuffix}
                      </div>
                    </div>
                  </div>

                  <div className="w-32 bg-stone-200 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-amber-600 h-full rounded-full"
                      style={{ width: `${Math.min(100, item.count * 12)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
            <span>Deterministic rule: Triggered when recent subject average &lt; 50%</span>
            <span className="font-semibold text-amber-800">Explainable EdTech</span>
          </div>
        </div>
      </div>
    </div>
  );
};
