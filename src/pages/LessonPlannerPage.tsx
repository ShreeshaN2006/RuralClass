import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TRANSLATIONS } from '../utils/translations';
import { GradeLevel, LessonPlan, Subject } from '../types';
import {
  generateLessonPlan,
  COMMON_MATERIALS,
  TOPIC_PRESETS,
} from '../services/lessonPlanner';
import {
  BookOpen,
  Sparkles,
  Save,
  CheckCircle2,
  Clock,
  Layers,
  Users,
  UserCheck,
  Check,
  RotateCcw,
} from 'lucide-react';

export const LessonPlannerPage: React.FC = () => {
  const {
    school,
    teacher,
    lessonPlans,
    language,
    saveLessonPlan,
    markLessonCompleted,
    showToast,
  } = useApp();

  const t = TRANSLATIONS[language];

  // Form state (default pre-set for Hackathon Demo Step 4: Grade 3, Mathematics, Multiplication)
  const [grade, setGrade] = useState<GradeLevel>('Grade 3');
  const [subject, setSubject] = useState<Subject>('Mathematics');
  const [topic, setTopic] = useState<string>('Multiplication Tables (2-5)');
  const [objective, setObjective] = useState<string>(
    'Students will solve 1-digit multiplication problems with concrete seeds and repeated addition models.'
  );
  const [durationMinutes, setDurationMinutes] = useState<number>(40);
  const [learningLevel, setLearningLevel] = useState<'Beginner' | 'Developing' | 'Grade-level' | 'Advanced'>('Developing');
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([
    'Blackboard & Chalk',
    'Student Notebooks',
    'Local Objects (Tamarind seeds, stones, leaves)',
  ]);
  const [multiGradeMode, setMultiGradeMode] = useState<boolean>(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [availableResources, setAvailableResources] = useState<Record<string, boolean>>({
    blackboard: true,
    textbook: true,
    paper: true,
    chalk: true,
    flashcards: true,
    printer: false,
    internet: false,
    projector: false,
  });

  const toggleResource = (id: string) => {
    setAvailableResources(prev => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Active generated lesson plan (starts with sample or generated)
  const [currentPlan, setCurrentPlan] = useState<LessonPlan | null>(() => {
    return lessonPlans[0] || null;
  });

  const toggleMaterial = (mat: string) => {
    if (selectedMaterials.includes(mat)) {
      setSelectedMaterials(selectedMaterials.filter(m => m !== mat));
    } else {
      setSelectedMaterials([...selectedMaterials, mat]);
    }
  };

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) {
      showToast('Please enter a topic.');
      return;
    }

    setIsGenerating(true);
    setTimeout(() => {
      const generated = generateLessonPlan({
        grade,
        subject,
        topic: topic.trim(),
        objective: objective.trim(),
        durationMinutes,
        learningLevel,
        materials: selectedMaterials,
        schoolId: school.id,
        teacherId: teacher.id,
        multiGradeEnabled: multiGradeMode,
      });

      setCurrentPlan(generated);
      setIsGenerating(false);
      showToast(language === 'kn' ? 'ಪಾಠ ಯೋಜನೆ ಸಿದ್ಧವಾಗಿದೆ.' : 'Lesson plan generated successfully.');
    }, 350);
  };

  const handleSave = () => {
    if (currentPlan) {
      saveLessonPlan(currentPlan);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-stone-900 tracking-tight">
            {t.lessonTitle}
          </h1>
          <p className="text-sm text-stone-600 mt-1">
            {t.lessonSub}
          </p>
        </div>

        {/* Multi-Grade Mode Toggle (Section 17) */}
        <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 px-3.5 py-2 rounded-xl self-start sm:self-auto">
          <div className="flex flex-col">
            <span className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-amber-700" />
              <span>{t.multiGradeModeToggle}</span>
            </span>
            <span className="text-[10px] text-amber-800">
              {multiGradeMode ? 'Shows simultaneous tasks for other grades' : 'Single grade only'}
            </span>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={multiGradeMode}
            onClick={() => setMultiGradeMode(!multiGradeMode)}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
              multiGradeMode ? 'bg-amber-700' : 'bg-stone-300'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                multiGradeMode ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form: Parameters (Section 15) */}
        <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-stone-200 shadow-xs h-fit space-y-4">
          <h2 className="text-sm font-bold text-stone-900 uppercase tracking-wider pb-2 border-b border-stone-100 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-amber-700" />
            <span>Lesson Setup</span>
          </h2>

          <form onSubmit={handleGenerate} className="space-y-4">
            {/* Grade & Subject */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  {t.lblGrade}
                </label>
                <select
                  value={grade}
                  onChange={e => setGrade(e.target.value as GradeLevel)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs font-semibold bg-white focus:outline-none focus:ring-2 focus:ring-amber-600"
                >
                  {school.grades.map(g => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  {t.lblSubject}
                </label>
                <select
                  value={subject}
                  onChange={e => {
                    const s = e.target.value as Subject;
                    setSubject(s);
                    const presets = TOPIC_PRESETS[s];
                    if (presets && presets[0]) setTopic(presets[0]);
                  }}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs font-semibold bg-white focus:outline-none focus:ring-2 focus:ring-amber-600"
                >
                  <option value="Mathematics">Mathematics (ಗಣಿತ)</option>
                  <option value="Kannada">Kannada (ಕನ್ನಡ)</option>
                  <option value="English">English (ಇಂಗ್ಲಿಷ್)</option>
                  <option value="Environmental Studies">Environmental Studies (ಪರಿಸರ ಅಧ್ಯಯನ)</option>
                </select>
              </div>
            </div>

            {/* Topic & Preset options */}
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                {t.lblTopic}
              </label>
              <input
                type="text"
                value={topic}
                onChange={e => setTopic(e.target.value)}
                placeholder="e.g. Addition with Carrying"
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-600"
                required
              />
              {/* Presets chips */}
              <div className="flex flex-wrap gap-1 mt-1.5">
                {(TOPIC_PRESETS[subject] || []).slice(0, 3).map(p => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setTopic(p)}
                    className="text-[10px] px-2 py-0.5 rounded bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-200"
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Learning Objective */}
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                {t.lblLearningObjective}
              </label>
              <textarea
                rows={2}
                value={objective}
                onChange={e => setObjective(e.target.value)}
                placeholder="What will students be able to do by the end of the lesson?"
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-amber-600 resize-none"
              />
            </div>

            {/* Duration & Learning Level */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  {t.lblAvailableTime}
                </label>
                <select
                  value={durationMinutes}
                  onChange={e => setDurationMinutes(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs font-semibold bg-white focus:outline-none focus:ring-2 focus:ring-amber-600"
                >
                  <option value={20}>20 minutes</option>
                  <option value={30}>30 minutes</option>
                  <option value={40}>40 minutes (Standard)</option>
                  <option value={60}>60 minutes</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  {t.lblLearningLevel}
                </label>
                <select
                  value={learningLevel}
                  onChange={e => setLearningLevel(e.target.value as any)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs font-semibold bg-white focus:outline-none focus:ring-2 focus:ring-amber-600"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Developing">Developing</option>
                  <option value="Grade-level">Grade-level</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>
            </div>

            {/* Available Resources (Section 3: Low-Resource Adaptation) */}
            <div className="pt-2 border-t border-stone-100">
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                {t.lblAvailableResources}
              </label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                  { id: 'blackboard', label: 'Blackboard (ಕಪ್ಪುಹಲಗೆ)' },
                  { id: 'textbook', label: 'Textbook (ಪಠ್ಯಪುಸ್ತಕ)' },
                  { id: 'paper', label: 'Paper / Slates (ಹಾಳೆ/ಹಲಗೆ)' },
                  { id: 'chalk', label: 'Chalk (ಬಳಪ)' },
                  { id: 'flashcards', label: 'Flashcards' },
                  { id: 'printer', label: 'Printer (ಮುದ್ರಕ)' },
                  { id: 'internet', label: 'Internet (ಅಂತರ್ಜಾಲ)' },
                  { id: 'projector', label: 'Projector (ಪ್ರೊಜೆಕ್ಟರ್)' },
                ].map(res => (
                  <label key={res.id} className="flex items-center gap-2 p-1.5 rounded-lg bg-stone-50 border border-stone-200 cursor-pointer hover:bg-stone-100/70">
                    <input
                      type="checkbox"
                      checked={!!availableResources[res.id]}
                      onChange={() => toggleResource(res.id)}
                      className="rounded text-amber-600 focus:ring-amber-500 cursor-pointer"
                    />
                    <span className="text-[11px] text-stone-800 font-medium">{res.label}</span>
                  </label>
                ))}
              </div>

              {/* Dynamic rural adaptation notice */}
              <div className="mt-2.5 p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-[11px] text-emerald-900 space-y-1">
                {!availableResources.internet && (
                  <div className="flex items-center gap-1.5 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Lesson activities have been adapted for offline classroom use.</span>
                  </div>
                )}
                {!availableResources.printer ? (
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Printer unavailable: Recommend blackboard exercises, slates, and oral pair work.</span>
                  </div>
                ) : (
                  <div className="text-[10px] text-stone-600">
                    • Printer available: Printable student practice sheets can be used.
                  </div>
                )}
                {availableResources.internet && (
                  <div className="text-[10px] text-stone-600">
                    • Internet connected: Online reference links permitted.
                  </div>
                )}
              </div>
            </div>

            {/* Generate Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isGenerating}
                className="w-full py-2.5 bg-amber-700 hover:bg-amber-800 text-white rounded-xl text-xs sm:text-sm font-bold transition-all shadow-xs flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Sparkles className={`w-4 h-4 text-amber-200 ${isGenerating ? 'animate-spin' : ''}`} />
                <span>{isGenerating ? 'Creating lesson structure...' : t.btnGenerateLesson}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right Output: Structured Lesson Plan & Multi-Grade breakdown (Section 16 & 17) */}
        <div className="lg:col-span-7 space-y-5">
          {currentPlan ? (
            <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
              {/* Header card info */}
              <div className="p-5 bg-gradient-to-r from-stone-900 to-stone-800 text-white">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-500 text-stone-950 font-bold text-xs">
                      {currentPlan.grade}
                    </span>
                    <span className="text-amber-200 text-xs font-medium">
                      {currentPlan.subject}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-stone-300 font-mono">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    <span>{currentPlan.durationMinutes} min</span>
                  </div>
                </div>

                <h2 className="text-xl font-bold text-white tracking-tight">
                  {currentPlan.topic}
                </h2>
                <p className="text-xs text-stone-300 mt-1 leading-relaxed">
                  <strong>Objective:</strong> {currentPlan.objective}
                </p>

                <div className="mt-3 pt-3 border-t border-stone-700/80 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-1 text-[11px] text-stone-300">
                    <span className="text-stone-400">Materials:</span>
                    <span className="font-medium text-amber-200">{currentPlan.materials.join(', ')}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleSave}
                      className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 shadow-xs"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>{t.btnSaveLesson}</span>
                    </button>
                    <button
                      onClick={() => markLessonCompleted(currentPlan.id)}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 shadow-xs"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{t.btnMarkCompleted}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Multi-Grade Concurrent Activities (Section 17 - Distinctive Feature) */}
              {multiGradeMode && currentPlan.multiGradeActivities && currentPlan.multiGradeActivities.length > 0 && (
                <div className="p-4 sm:p-5 bg-amber-50/60 border-b border-amber-200">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-amber-800" />
                      <h3 className="text-xs font-bold text-amber-950 uppercase tracking-wider">
                        {t.independentGroupsTitle}
                      </h3>
                    </div>
                    <span className="text-[10px] text-amber-800 font-semibold bg-amber-100 px-2 py-0.5 rounded">
                      Zero digital overhead
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {currentPlan.multiGradeActivities.map(act => (
                      <div key={act.grade} className="p-3 bg-white rounded-xl border border-amber-200/80 shadow-2xs">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-xs text-stone-900">{act.grade}</span>
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                            act.activityType === 'Peer'
                              ? 'bg-teal-50 text-teal-800 border border-teal-200'
                              : act.activityType === 'Group'
                              ? 'bg-indigo-50 text-indigo-800 border border-indigo-200'
                              : 'bg-stone-100 text-stone-700 border border-stone-200'
                          }`}>
                            {act.activityType}
                          </span>
                        </div>
                        <div className="text-xs font-semibold text-stone-800">
                          {language === 'kn' ? act.activityTitleKn : act.activityTitle}
                        </div>
                        <p className="text-[11px] text-stone-600 mt-0.5">
                          {language === 'kn' ? act.descriptionKn : act.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Timed Step-by-Step Pedagogical Phases (Section 16) */}
              <div className="p-4 sm:p-5 space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-stone-100">
                  <UserCheck className="w-4 h-4 text-amber-700" />
                  <h3 className="text-xs font-bold text-stone-800 uppercase tracking-wider">
                    {t.activeTeacherGroup}: {currentPlan.grade} Step-by-Step Breakdown
                  </h3>
                </div>

                <div className="space-y-3">
                  {currentPlan.activities.map((act, index) => (
                    <div
                      key={index}
                      className="p-3.5 rounded-xl border border-stone-200 bg-stone-50/50 hover:bg-white transition-colors"
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-bold text-xs sm:text-sm text-stone-900">
                          {language === 'kn' ? act.phaseKn : act.phase}
                        </span>
                        <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-stone-200/70 text-stone-800">
                          {act.durationMin} min
                        </span>
                      </div>

                      <div className="space-y-1 text-xs">
                        <div>
                          <strong className="text-amber-800 font-semibold">Teacher: </strong>
                          <span className="text-stone-700">
                            {language === 'kn' ? act.teacherActionKn : act.teacherAction}
                          </span>
                        </div>
                        <div>
                          <strong className="text-stone-700 font-semibold">Students: </strong>
                          <span className="text-stone-600">
                            {language === 'kn' ? act.studentActionKn : act.studentAction}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-stone-200 p-8 text-center text-stone-500">
              <BookOpen className="w-12 h-12 text-stone-300 mx-auto mb-3" />
              <p className="text-sm font-medium">{t.noLessonGeneratedYet}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
