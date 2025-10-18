import React from 'react';

interface ImageAdjustmentsProps {
  brightness: number;
  onBrightnessChange: (value: number) => void;
  contrast: number;
  onContrastChange: (value: number) => void;
  saturation: number;
  onSaturationChange: (value: number) => void;
  onReset: () => void;
  isDisabled: boolean;
}

const SlidersIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="4" y1="21" x2="4" y2="14" />
        <line x1="4" y1="10" x2="4" y2="3" />
        <line x1="12" y1="21" x2="12" y2="12" />
        <line x1="12" y1="8" x2="12" y2="3" />
        <line x1="20" y1="21" x2="20" y2="16" />
        <line x1="20" y1="12" x2="20" y2="3" />
        <line x1="1" y1="14" x2="7" y2="14" />
        <line x1="9" y1="8" x2="15" y2="8" />
        <line x1="17" y1="16" x2="23" y2="16" />
    </svg>
);

const RotateCcwIcon: React.FC<{ className?: string }> = ({ className }) => (
     <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="1 4 1 10 7 10" />
        <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
    </svg>
);

export const ImageAdjustments: React.FC<ImageAdjustmentsProps> = ({
  brightness,
  onBrightnessChange,
  contrast,
  onContrastChange,
  saturation,
  onSaturationChange,
  onReset,
  isDisabled,
}) => {
  return (
    <div className="space-y-4 pt-4 border-t border-slate-800">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
            <SlidersIcon className="w-5 h-5 text-slate-400"/>
            <h3 className="text-lg font-semibold text-slate-200">Image Adjustments</h3>
        </div>
        <button 
            onClick={onReset} 
            disabled={isDisabled}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-cyan-400 disabled:opacity-50 disabled:hover:text-slate-400 transition transform hover:scale-105"
            aria-label="Reset adjustments"
        >
            <RotateCcwIcon className="w-3 h-3"/>
            Reset
        </button>
      </div>
      
      <div>
        <label htmlFor="brightness" className="block text-sm font-medium text-slate-300 mb-2">Brightness: {brightness}</label>
        <input type="range" id="brightness" min="0" max="200" value={brightness} onChange={e => onBrightnessChange(parseInt(e.target.value, 10))} disabled={isDisabled} className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500 disabled:opacity-50"/>
      </div>

      <div>
        <label htmlFor="contrast" className="block text-sm font-medium text-slate-300 mb-2">Contrast: {contrast}</label>
        <input type="range" id="contrast" min="0" max="200" value={contrast} onChange={e => onContrastChange(parseInt(e.target.value, 10))} disabled={isDisabled} className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500 disabled:opacity-50"/>
      </div>
      
      <div>
        <label htmlFor="saturation" className="block text-sm font-medium text-slate-300 mb-2">Saturation: {saturation}</label>
        <input type="range" id="saturation" min="0" max="200" value={saturation} onChange={e => onSaturationChange(parseInt(e.target.value, 10))} disabled={isDisabled} className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500 disabled:opacity-50"/>
      </div>

    </div>
  );
};