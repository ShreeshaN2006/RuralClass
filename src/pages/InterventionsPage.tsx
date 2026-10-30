import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TRANSLATIONS } from '../utils/translations';
import { InterventionOption, InterventionSuggestion } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import {
  HeartHandshake,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  ShieldCheck,
  UserCheck,
  BookOpen,
  Plus,
  MessageSquare,
  AlertTriangle,
  Users,
} from 'lucide-react';

export const InterventionsPage: React.FC = () => {
  const {
    pendingSuggestions,
    activeInterventions,
    teacher,
    language,
    acceptIntervention,
    dismissIntervention,
    completeActiveIntervention,
    addObservationToIntervention,
    showToast,
  } = useApp();

  const t = TRANSLATIONS[language];

  // Selected option per suggestion id
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  // Observation note state for active interventions
  const [activeNoteInputId, setActiveNoteInputId] = useState<string | null>(null);
  const [noteText, setNoteText] = useState<string>('');

  const handleSelectOption = (suggestionId: string, optionId: string) => {
    setSelectedOptions(prev => ({
      ...prev,
      [suggestionId]: optionId,
    }));
  };

  const handleAccept = (suggestion: InterventionSuggestion) => {
    const chosenOptionId = selectedOptions[suggestion.id] || suggestion.suggestedActions[0].id;
    const option = suggestion.suggestedActions.find(o => o.id === chosenOptionId) || suggestion.suggestedActions[0];
    acceptIntervention(suggestion, option);
  };

  const handleSaveObservation = (interventionId: string) => {
    if (noteText.trim()) {
      const formattedNote = `[${teacher.name} - ${teacher.role}]: ${noteText.trim()}`;
      addObservationToIntervention(interventionId, formattedNote);
      setNoteText('');
      setActiveNoteInputId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-stone-900 tracking-tight flex items-center gap-2">
            <HeartHandshake className="w-6 h-6 text-amber-700" />
            <span>{t.interventionsTitle}</span>
          </h1>
          <p className="text-sm text-stone-600 mt-1">
            {t.interventionsSub} • <span className="text-stone-800 font-semibold">{teacher.name}</span> ({language === 'kn' ? teacher.roleKn : teacher.role})
          </p>
        </div>

        {/* Ethical Reminder */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 font-medium self-start sm:self-auto">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{language === 'kn' ? 'ಶಿಕ್ಷಕರ ತೀರ್ಮಾನವೇ ಅಂತಿಮ' : 'Teacher makes the final call'}</span>
        </div>
      </div>

      {/* Pending Intervention Suggestions (Section 22 & 23) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold text-stone-700 uppercase tracking-wider flex items-center gap-2">
            <span>Pending Learning Gap Recommendations</span>
            <span className="px-2 py-0.5 rounded-full bg-amber-200 text-amber-900 font-bold text-[10px]">
              {pendingSuggestions.length}
            </span>
          </h2>
          <span className="text-[11px] text-stone-400">Deterministic rule-triggered</span>
        </div>

        {pendingSuggestions.length > 0 ? (
          <div className="space-y-4">
            {pendingSuggestions.map(suggestion => {
              const currentSelectedOptId =
                selectedOptions[suggestion.id] || suggestion.suggestedActions[0].id;

              return (
                <div
                  key={suggestion.id}
                  className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden transition-all hover:border-amber-300"
                >
                  {/* Suggestion Card Header */}
                  <div className="p-4 sm:p-5 bg-gradient-to-r from-stone-50 to-amber-50/40 border-b border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-700 text-white flex items-center justify-center font-bold text-base shadow-xs">
                        {suggestion.studentName.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-base text-stone-900">
                            {suggestion.studentName} — {suggestion.studentGrade}
                          </h3>
                          <StatusBadge status={suggestion.status} size="sm" />
                        </div>
                        <p className="text-xs text-stone-600">
                          Learning Area:{' '}
                          <span className="font-semibold text-stone-900">
                            {suggestion.subject} ({suggestion.topic})
                          </span>{' '}
                          • Recent performance:{' '}
                          <strong className="text-amber-800">{suggestion.recentScore}%</strong>
                        </p>
                      </div>
                    </div>

                    {/* Explainability Tag (Section 23 & 41) */}
                    <div className="px-3 py-1.5 rounded-xl bg-amber-100/80 border border-amber-300 text-amber-950 text-xs font-semibold self-start sm:self-auto">
                      {language === 'kn' ? suggestion.ruleTriggeredKn : suggestion.ruleTriggered}
                    </div>
                  </div>

                  {/* Body: 4 Actionable Choices */}
                  <div className="p-4 sm:p-5 space-y-4">
                    <div>
                      <div className="text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                        {language === 'kn' ? 'ಶಿಫಾರಸು ಮಾಡಿದ ಬೋಧನಾ ಕ್ರಮಗಳು (ಒಂದನ್ನು ಆಯ್ಕೆಮಾಡಿ)' : 'Recommended Actions (Select best fit for your classroom):'}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {suggestion.suggestedActions.map(action => {
                          const isSelected = currentSelectedOptId === action.id;
                          return (
                            <div
                              key={action.id}
                              onClick={() => handleSelectOption(suggestion.id, action.id)}
                              className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                                isSelected
                                  ? 'bg-amber-50/90 border-amber-500 shadow-2xs ring-1 ring-amber-500'
                                  : 'bg-stone-50/60 border-stone-200 hover:border-stone-300 hover:bg-stone-50'
                              }`}
                            >
                              <div className="flex items-start justify-between gap-2 mb-1">
                                <div className="flex items-center gap-2">
                                  <input
                                    type="radio"
                                    name={`choice_${suggestion.id}`}
                                    checked={isSelected}
                                    onChange={() => handleSelectOption(suggestion.id, action.id)}
                                    className="w-4 h-4 text-amber-600 focus:ring-amber-500"
                                  />
                                  <span className="font-bold text-xs sm:text-sm text-stone-900">
                                    {language === 'kn' ? action.titleKn : action.title}
                                  </span>
                                </div>
                                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-stone-200 text-stone-700 shrink-0">
                                  {action.estimatedMinutes} min
                                </span>
                              </div>

                              <p className="text-xs text-stone-600 pl-6 leading-relaxed">
                                {language === 'kn' ? action.descriptionKn : action.description}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Teacher Decision Bar (Section 41) */}
                    <div className="pt-3 border-t border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="text-xs text-stone-500 italic">
                        <strong>{t.whySuggested}:</strong>{' '}
                        {language === 'kn' ? suggestion.explanationKn : suggestion.explanation}
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-auto">
                        <button
                          onClick={() => dismissIntervention(suggestion.id)}
                          className="px-3.5 py-2 border border-stone-300 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-xl text-xs font-semibold transition-colors"
                        >
                          {t.btnDismiss}
                        </button>
                        <button
                          onClick={() => handleAccept(suggestion)}
                          className="px-4 py-2 bg-amber-700 hover:bg-amber-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>{t.btnAccept}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-8 text-center bg-white rounded-2xl border border-stone-200 text-stone-500">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
            <p className="text-sm font-semibold text-stone-800">{t.noPendingInterventions}</p>
            <p className="text-xs text-stone-500 mt-1">All current learning gaps have been addressed or resolved.</p>
          </div>
        )}
      </div>

      {/* Active Interventions Tracker (Section 24) */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold text-stone-700 uppercase tracking-wider flex items-center gap-2">
            <span>{t.activeInterventionsTitle}</span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 font-bold text-[10px]">
              {activeInterventions.filter(a => a.status === 'Active').length} Active
            </span>
          </h2>
          <span className="text-[11px] text-stone-400">Classroom follow-up history</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {activeInterventions.map(item => {
            const isActive = item.status === 'Active';
            return (
              <div
                key={item.id}
                className={`bg-white rounded-2xl border p-4 sm:p-5 flex flex-col justify-between shadow-xs transition-all ${
                  isActive ? 'border-amber-300 bg-amber-50/20' : 'border-stone-200 opacity-90'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-stone-900">
                        {item.studentName} ({item.studentGrade})
                      </span>
                      <span className="text-xs text-stone-500">• {item.subject}</span>
                    </div>
                    <StatusBadge status={item.status} size="sm" />
                  </div>

                  <h3 className="text-sm font-bold text-stone-900">
                    {item.interventionTitle}
                  </h3>
                  <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                    {item.interventionDescription}
                  </p>

                  {/* Metadata */}
                  <div className="mt-3 pt-2 border-t border-stone-100 flex items-center gap-4 text-[11px] text-stone-500">
                    <span>
                      {t.assignedByLabel}: <strong>{item.assignedBy}</strong>
                    </span>
                    <span>
                      {t.dateLabel}: <strong>{item.dateAssigned}</strong>
                    </span>
                  </div>

                  {/* Notes list */}
                  {item.notes.length > 0 && (
                    <div className="mt-2.5 p-2 rounded-lg bg-stone-50 border border-stone-200 text-xs text-stone-700 space-y-1">
                      <div className="font-semibold text-[10px] uppercase text-stone-500">Observations</div>
                      {item.notes.map((note, idx) => (
                        <div key={idx} className="text-stone-600 text-[11px] flex items-start gap-1">
                          <span>•</span>
                          <span>{note}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Actions & Observation Input */}
                <div className="mt-4 pt-3 border-t border-stone-100 space-y-2">
                  {activeNoteInputId === item.id ? (
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={noteText}
                        onChange={e => setNoteText(e.target.value)}
                        placeholder="Add classroom observation note..."
                        className="w-full px-3 py-1.5 border border-stone-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-amber-600"
                        autoFocus
                      />
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setActiveNoteInputId(null);
                            setNoteText('');
                          }}
                          className="px-2.5 py-1 text-xs text-stone-600 hover:bg-stone-100 rounded"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSaveObservation(item.id)}
                          className="px-3 py-1 bg-amber-700 text-white rounded text-xs font-semibold"
                        >
                          Save Note
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between gap-2">
                      <button
                        onClick={() => setActiveNoteInputId(item.id)}
                        className="text-xs font-semibold text-stone-700 hover:text-stone-900 hover:bg-stone-100 px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1"
                      >
                        <MessageSquare className="w-3.5 h-3.5 text-stone-500" />
                        <span>{t.btnAddObservation}</span>
                      </button>

                      {isActive && (
                        <button
                          onClick={() => completeActiveIntervention(item.id)}
                          className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 shadow-2xs"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>{t.btnMarkInterventionCompleted}</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
