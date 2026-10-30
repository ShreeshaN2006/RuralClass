import React from 'react';
import { useApp } from '../context/AppContext';
import { TRANSLATIONS } from '../utils/translations';
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  TrendingUp,
  UserCheck,
  BookOpen,
  Users,
  Sparkles,
} from 'lucide-react';

interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const { language } = useApp();
  const t = TRANSLATIONS[language];

  const sizeClasses = size === 'sm' ? 'text-xs px-2 py-0.5 gap-1' : 'text-xs md:text-sm px-2.5 py-1 gap-1.5 font-medium';

  switch (status) {
    case 'On track':
      return (
        <span className={`inline-flex items-center rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 ${sizeClasses}`}>
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          {t.statusOnTrack}
        </span>
      );
    case 'Improving':
      return (
        <span className={`inline-flex items-center rounded-full bg-blue-50 text-blue-800 border border-blue-200 ${sizeClasses}`}>
          <TrendingUp className="w-3.5 h-3.5 text-blue-600 shrink-0" />
          {t.statusImproving}
        </span>
      );
    case 'Needs support':
    case 'Needs practice':
      return (
        <span className={`inline-flex items-center rounded-full bg-amber-50 text-amber-800 border border-amber-300 font-semibold ${sizeClasses}`}>
          <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
          {t.statusNeedsSupport}
        </span>
      );
    case 'Follow-up':
      return (
        <span className={`inline-flex items-center rounded-full bg-orange-50 text-orange-800 border border-orange-200 ${sizeClasses}`}>
          <Clock className="w-3.5 h-3.5 text-orange-600 shrink-0" />
          {t.statusFollowUp}
        </span>
      );
    case 'Teacher-led':
      return (
        <span className={`inline-flex items-center rounded-full bg-amber-100 text-amber-900 border border-amber-300 font-bold ${sizeClasses}`}>
          <UserCheck className="w-3.5 h-3.5 text-amber-700 shrink-0" />
          {t.typeTeacherLed}
        </span>
      );
    case 'Independent':
    case 'Independent Activity':
      return (
        <span className={`inline-flex items-center rounded-full bg-stone-100 text-stone-800 border border-stone-200 ${sizeClasses}`}>
          <BookOpen className="w-3.5 h-3.5 text-stone-600 shrink-0" />
          {t.typeIndependent}
        </span>
      );
    case 'Group':
    case 'Group Activity':
      return (
        <span className={`inline-flex items-center rounded-full bg-indigo-50 text-indigo-800 border border-indigo-200 ${sizeClasses}`}>
          <Users className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
          {t.typeGroup}
        </span>
      );
    case 'Peer':
    case 'Peer Learning':
      return (
        <span className={`inline-flex items-center rounded-full bg-teal-50 text-teal-800 border border-teal-200 ${sizeClasses}`}>
          <Sparkles className="w-3.5 h-3.5 text-teal-600 shrink-0" />
          {t.typePeer}
        </span>
      );
    case 'Ready':
      return (
        <span className={`inline-flex items-center rounded-full bg-stone-100 text-stone-700 border border-stone-300 ${sizeClasses}`}>
          <Clock className="w-3.5 h-3.5 text-stone-500 shrink-0" />
          {t.statusReady}
        </span>
      );
    case 'In progress':
      return (
        <span className={`inline-flex items-center rounded-full bg-amber-50 text-amber-800 border border-amber-200 ${sizeClasses}`}>
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse shrink-0"></span>
          {t.statusInProgress}
        </span>
      );
    case 'Completed':
    case 'Active':
      return (
        <span className={`inline-flex items-center rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 ${sizeClasses}`}>
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          {status === 'Active' ? t.statusActive : t.statusCompleted}
        </span>
      );
    default:
      return (
        <span className={`inline-flex items-center rounded-full bg-stone-100 text-stone-700 border border-stone-200 ${sizeClasses}`}>
          {status}
        </span>
      );
  }
};
