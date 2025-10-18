import React from 'react';
import type { TextOverlayConfig, TextPosition } from '../types';

interface TextOverlayControlsProps {
  textConfig: TextOverlayConfig;
  onTextConfigChange: (newConfig: Partial<TextOverlayConfig>) => void;
  isDisabled: boolean;
}

const TypeIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="4 7 4 4 20 4 20 7" />
        <line x1="9" y1="20" x2="15" y2="20" />
        <line x1="12" y1="4" x2="12" y2="20" />
    </svg>
);

export const TextOverlayControls: React.FC<TextOverlayControlsProps> = ({
  textConfig,
  onTextConfigChange,
  isDisabled,
}) => {
  const handlePositionChange = (position: TextPosition) => {
    // These percentages are based on the text's center point
    const positions = {
      topLeft: { x: 15, y: 15 },
      topCenter: { x: 50, y: 15 },
      topRight: { x: 85, y: 15 },
      center: { x: 50, y: 50 },
      bottomLeft: { x: 15, y: 85 },
      bottomCenter: { x: 50, y: 85 },
      bottomRight: { x: 85, y: 85 },
    };
    onTextConfigChange(positions[position]);
  };

  return (
    <div className="space-y-4 animate-slide-fade-in-up">
      <div className="flex items-center gap-2">
        <TypeIcon className="w-5 h-5 text-slate-400" />
        <h3 className="text-lg font-semibold text-slate-200">Add Text to Image</h3>
      </div>
      
      <div className="space-y-3">
        <input
          type="text"
          placeholder="Enter your text..."
          value={textConfig.content}
          onChange={(e) => onTextConfigChange({ content: e.target.value })}
          disabled={isDisabled}
          className="w-full bg-slate-700 border border-slate-600 rounded-md p-2 focus:ring-2 focus:ring-cyan-500 focus:outline-none transition disabled:opacity-50"
        />
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="textColor" className="block text-sm font-medium text-slate-300 mb-1">Color</label>
            <input
              type="color"
              id="textColor"
              value={textConfig.color}
              onChange={(e) => onTextConfigChange({ color: e.target.value })}
              disabled={isDisabled}
              className="w-full h-10 p-1 bg-slate-700 border border-slate-600 rounded-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>
          <div>
            <label htmlFor="textSize" className="block text-sm font-medium text-slate-300 mb-1">Size: {textConfig.size}</label>
            <input
              type="range"
              id="textSize"
              min="12"
              max="128"
              step="1"
              value={textConfig.size}
              onChange={(e) => onTextConfigChange({ size: parseInt(e.target.value, 10) })}
              disabled={isDisabled}
              className="w-full h-10 bg-transparent appearance-none [&::-webkit-slider-runnable-track]:h-2 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-slate-700 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-cyan-500 cursor-pointer disabled:opacity-50"
            />
          </div>
        </div>
        <div>
          <label htmlFor="textPosition" className="block text-sm font-medium text-slate-300 mb-1">Position</label>
          <select
            id="textPosition"
            onChange={(e) => handlePositionChange(e.target.value as TextPosition)}
            disabled={isDisabled}
            className="w-full bg-slate-700 border border-slate-600 rounded-md p-2 focus:ring-2 focus:ring-cyan-500 focus:outline-none transition disabled:opacity-50"
            value="center" // Let it be a trigger, not a state reflection
          >
            <option value="center">Center</option>
            <option value="topLeft">Top Left</option>
            <option value="topCenter">Top Center</option>
            <option value="topRight">Top Right</option>
            <option value="bottomLeft">Bottom Left</option>
            <option value="bottomCenter">Bottom Center</option>
            <option value="bottomRight">Bottom Right</option>
          </select>
        </div>
      </div>
    </div>
  );
};
