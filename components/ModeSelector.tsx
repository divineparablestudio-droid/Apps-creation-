import React from 'react';
import type { AppMode } from '../types';

interface ModeSelectorProps {
  activeMode: AppMode;
  onModeChange: (mode: AppMode) => void;
  isDisabled: boolean;
}

const TextIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 6.1H3" />
        <path d="M21 12.1H3" />
        <path d="M15.1 18.1H3" />
    </svg>
);

const EditIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
    </svg>
);

const LayoutIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        <line x1="3" y1="9" x2="21" y2="9" />
        <line x1="9" y1="21" x2="9" y2="9" />
    </svg>
);

const modes: { id: AppMode; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'textToImage', label: 'Text-to-Image', icon: TextIcon },
    { id: 'imageEditing', label: 'Image Editing', icon: EditIcon },
    { id: 'graphicDesign', label: 'Graphic Design', icon: LayoutIcon },
];

export const ModeSelector: React.FC<ModeSelectorProps> = ({ activeMode, onModeChange, isDisabled }) => {
    return (
        <div className="grid grid-cols-3 gap-2 bg-slate-800 p-1 rounded-lg">
            {modes.map(mode => (
                <button
                    key={mode.id}
                    onClick={() => onModeChange(mode.id)}
                    disabled={isDisabled}
                    className={`flex items-center justify-center gap-2 px-3 py-2 text-xs sm:text-sm font-semibold rounded-md transition-all transform hover:scale-105 ${
                        activeMode === mode.id
                            ? 'bg-cyan-600 text-white shadow'
                            : 'bg-transparent text-slate-300 hover:bg-slate-700'
                    } disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100`}
                >
                    <mode.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="hidden sm:inline">{mode.label}</span>
                </button>
            ))}
        </div>
    );
};
