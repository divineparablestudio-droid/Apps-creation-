import React from 'react';
import type { DesignTemplate } from '../types';

interface DesignTemplatesProps {
  templates: DesignTemplate[];
  selectedTemplate: DesignTemplate | null;
  onSelectTemplate: (template: DesignTemplate | null) => void;
  isDisabled: boolean;
}

const XIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
);


export const DesignTemplates: React.FC<DesignTemplatesProps> = ({
  templates,
  selectedTemplate,
  onSelectTemplate,
  isDisabled,
}) => {
  return (
    <div className="space-y-3">
        <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-200">Design Templates</h3>
            {selectedTemplate && (
                 <button 
                    onClick={() => onSelectTemplate(null)} 
                    disabled={isDisabled}
                    className="flex items-center gap-1 text-xs font-semibold text-slate-400 hover:text-red-400 disabled:opacity-50 disabled:hover:text-slate-400 transition"
                >
                    <XIcon className="w-3 h-3"/>
                    Clear Template
                </button>
            )}
        </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {templates.map(template => (
          <button
            key={template.name}
            onClick={() => onSelectTemplate(template)}
            disabled={isDisabled}
            className={`p-3 flex flex-col items-center justify-center gap-2 rounded-lg text-sm font-semibold transition-all transform hover:-translate-y-1 border-2 ${
              selectedTemplate?.name === template.name
                ? 'bg-cyan-600/20 border-cyan-500 text-white'
                : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-cyan-600 hover:bg-slate-700/50'
            } disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-slate-700 disabled:hover:-translate-y-0`}
          >
            <template.icon className="w-6 h-6" />
            <span>{template.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};