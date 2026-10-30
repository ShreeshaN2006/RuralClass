import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle, Info } from 'lucide-react';

export const Toast: React.FC = () => {
  const { toastMessage } = useApp();

  if (!toastMessage) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-5 right-5 z-50 max-w-md bg-stone-900 text-white px-4 py-3 rounded-lg shadow-xl flex items-center gap-3 border border-stone-700 animate-in fade-in slide-in-from-bottom-2 duration-200"
    >
      <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
      <span className="text-sm font-medium">{toastMessage}</span>
    </div>
  );
};
