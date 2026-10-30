import React from 'react';
import { useApp } from '../context/AppContext';
import { TRANSLATIONS } from '../utils/translations';
import { StatusBadge } from '../components/StatusBadge';
import {
  X,
  User,
  Calendar,
  AlertTriangle,
  TrendingUp,
  PlusCircle,
  HeartHandshake,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface StudentProfileModalProps {
  studentId: string;
  onClose: () => void;
}

export const StudentProfileModal: React.FC<StudentProfileModalProps> = ({ studentId, onClose }) => {
  const {
    students,
    assessments,
    language,
    openAssessmentModal,
    setCurrentView,
    pendingSuggestions,
    activeInterventions,
    addTeacherNote,
  } = useApp();

  const t = TRANSLATIONS[language];

  const student = students.find(s => s.id === studentId);
  if (!student) return null;

  const [noteText, setNoteText] = React.useState('');
  const [selectedTags, setSelectedTags] = React.useState<string[]>(['Mathematics', 'Needs Practice']);
  const availableTags = ['Mathematics', 'Multiplication', 'Reading', 'Kannada', 'English', 'Needs Practice', 'Peer Support', 'Improving'];

  const handleToggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteText.trim()) return;
    addTeacherNote(student.id, noteText.trim(), selectedTags);
    setNoteText('');
  };

  // Assessments for this student
  const studentAssessments = assessments
    .filter(a => a.studentId === student.id)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Chart data
  const chartData = studentAssessments.map(a => ({
    date: a.date.slice(5),
    topic: a.topic.length > 14 ? a.topic.slice(0, 14) + '...' : a.topic,
    score: Math.round((a.score / a.maxScore) * 100),
  }));

  // Has active intervention or pending suggestions?
  const studentSuggestion = pendingSuggestions.find(s => s.studentId === student.id);
  const studentActive = activeInterventions.find(a => a.studentId === student.id && a.status === 'Active');

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="student-profile-title"
      className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5"
    >
      <div className="bg-white rounded-2xl max-w-3xl w-full p-5 sm:p-6 shadow-2xl border border-stone-200 overflow-y-auto max-h-[92vh]">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-stone-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-700 text-white flex items-center justify-center font-bold text-xl shadow-xs">
              {student.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 id="student-profile-title" className="text-xl font-bold text-stone-900">
                  {language === 'kn' ? student.nameKn : student.name}
                </h2>
                <StatusBadge status={student.overallStatus} size="sm" />
              </div>
              <p className="text-xs text-stone-500 mt-0.5">
                {student.grade} • {student.attendance}% {t.colAttendance}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                openAssessmentModal(student.id);
              }}
              className="px-3 py-1.5 bg-amber-100 text-amber-900 hover:bg-amber-200 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1"
            >
              <PlusCircle className="w-3.5 h-3.5 text-amber-800" />
              <span>{t.addAssessmentBtn}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Learning Gap Notice if student needs support */}
        {(studentSuggestion || studentActive) && (
          <div className="mt-4 p-3.5 rounded-xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-bold text-amber-950 uppercase tracking-wider">
                  {studentActive ? 'Active Support Plan' : 'Learning Gap Identified'}
                </span>
                <p className="text-xs text-amber-900 mt-0.5">
                  {studentActive
                    ? studentActive.interventionTitle
                    : studentSuggestion?.ruleTriggered}
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                onClose();
                setCurrentView('interventions');
              }}
              className="px-3 py-1 bg-amber-700 hover:bg-amber-800 text-white rounded-lg text-xs font-semibold self-start sm:self-auto flex items-center gap-1 shadow-2xs"
            >
              <span>{studentActive ? 'Track Progress' : 'View Suggestions'}</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        )}

        <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Subject Performance Cards */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-stone-700 uppercase tracking-wider">
              {language === 'kn' ? 'ವಿಷಯವಾರು ಪ್ರಗತಿ' : 'Subject Mastery Breakdown'}
            </h3>
            <div className="space-y-2">
              {student.subjects.map(s => (
                <div
                  key={s.subject}
                  className="p-3 rounded-xl border border-stone-200 bg-stone-50/60 flex items-center justify-between"
                >
                  <div>
                    <div className="text-xs font-bold text-stone-900">{s.subject}</div>
                    <div className="text-[11px] text-stone-500">
                      Level: <span className="font-medium text-stone-700">{s.level}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-stone-900">{s.averageScore}%</div>
                    <StatusBadge status={s.status} size="sm" />
                  </div>
                </div>
              ))}
            </div>

            {/* Teacher Notes & Observations (Feature #7) */}
            <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-amber-950 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                  <span>Teacher Notes & Observations</span>
                </h4>
                <span className="text-[10px] text-amber-800 bg-amber-100 px-2 py-0.5 rounded font-medium">
                  Contextual Only
                </span>
              </div>

              {/* Main teacher observation */}
              <div className="p-2.5 rounded-lg bg-white/80 border border-amber-200/80 text-xs text-stone-700 leading-relaxed italic">
                "{language === 'kn' ? student.teacherObservationKn : student.teacherObservation}"
              </div>

              {/* Existing structured notes if any */}
              {student.notes && student.notes.length > 0 && (
                <div className="space-y-2 pt-1">
                  <div className="text-[11px] font-bold text-amber-950">Logged Notes:</div>
                  {student.notes.map(note => (
                    <div key={note.id} className="p-2 rounded-lg bg-white border border-stone-200 text-xs space-y-1">
                      <div className="text-stone-800 font-medium">{note.text}</div>
                      <div className="flex items-center justify-between text-[10px] text-stone-500">
                        <div className="flex flex-wrap gap-1">
                          {note.tags.map(tag => (
                            <span key={tag} className="px-1.5 py-0.2 bg-amber-100 text-amber-900 rounded font-semibold text-[9px]">
                              #{tag}
                            </span>
                          ))}
                        </div>
                        <span>{note.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Quick Add Teacher Note Form */}
              <form onSubmit={handleAddNote} className="space-y-2 pt-2 border-t border-amber-200/80">
                <div className="text-[11px] font-bold text-stone-800 flex items-center justify-between">
                  <span>Add Quick Observation</span>
                  <span className="text-[10px] text-stone-500 font-normal">Select tags:</span>
                </div>

                {/* Tag Selection Pills */}
                <div className="flex flex-wrap gap-1">
                  {availableTags.map(tag => {
                    const isSelected = selectedTags.includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => handleToggleTag(tag)}
                        className={`px-2 py-0.5 rounded-md text-[10px] font-semibold transition-colors ${
                          isSelected
                            ? 'bg-amber-800 text-white'
                            : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-100'
                        }`}
                      >
                        {tag}
                      </button>
                    );
                  })}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    placeholder="e.g. Understands multiplication using objects but struggles independently..."
                    className="flex-1 px-2.5 py-1.5 text-xs bg-white rounded-lg border border-amber-300 focus:outline-none focus:ring-1 focus:ring-amber-700"
                  />
                  <button
                    type="submit"
                    disabled={!noteText.trim()}
                    className="px-3 py-1.5 bg-amber-800 hover:bg-amber-900 text-white text-xs font-semibold rounded-lg disabled:opacity-50 transition-colors shrink-0"
                  >
                    Save Note
                  </button>
                </div>
                <p className="text-[10px] text-stone-500 italic">
                  Note: Subjective teacher notes are considered during intervention review and are never automatically converted into rigid student classifications.
                </p>
              </form>
            </div>
          </div>

          {/* Recharts Performance Trend Chart (Section 19) */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-stone-700 uppercase tracking-wider">
              {t.performanceTrend} (Recent Assessments)
            </h3>

            {chartData.length > 0 ? (
              <div className="p-3 rounded-xl border border-stone-200 bg-white">
                <div className="h-44 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                      <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#1c1917', borderRadius: '8px', color: '#fff', fontSize: '11px' }}
                      />
                      <Line
                        type="monotone"
                        dataKey="score"
                        stroke="#b45309"
                        strokeWidth={2.5}
                        dot={{ r: 4, fill: '#b45309' }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="text-[10px] text-stone-400 text-center mt-1">
                  Threshold: 50% passing • 70% on track
                </div>
              </div>
            ) : (
              <div className="p-6 text-center text-xs text-stone-400 bg-stone-50 rounded-xl border border-dashed border-stone-200">
                No assessments recorded yet for this student.
              </div>
            )}

            {/* Recent Assessment Records list */}
            <div>
              <h4 className="text-xs font-semibold text-stone-700 mb-2">
                {t.recentAssessments}
              </h4>
              <div className="space-y-1.5 max-h-36 overflow-y-auto">
                {studentAssessments.map(a => {
                  const perc = Math.round((a.score / a.maxScore) * 100);
                  return (
                    <div
                      key={a.id}
                      className="p-2 rounded-lg bg-stone-50 border border-stone-200 text-xs flex items-center justify-between"
                    >
                      <div>
                        <div className="font-medium text-stone-800">
                          {a.subject}: {a.topic}
                        </div>
                        <div className="text-[10px] text-stone-400">{a.date}</div>
                      </div>
                      <div className="text-right">
                        <span className={`font-bold ${perc < 50 ? 'text-amber-800' : 'text-stone-800'}`}>
                          {a.score}/{a.maxScore} ({perc}%)
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
          <span>Confidential rural classroom learner profile</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-stone-900 text-white rounded-lg font-medium hover:bg-stone-800 transition-colors"
          >
            {t.close}
          </button>
        </div>
      </div>
    </div>
  );
};
