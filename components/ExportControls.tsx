import React from 'react';

type OutputFormat = 'png' | 'jpeg';

interface ExportControlsProps {
  outputFormat: OutputFormat;
  setOutputFormat: (format: OutputFormat) => void;
  jpegQuality: number;
  setJpegQuality: (quality: number) => void;
  isDisabled: boolean;
}

const DownloadIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
);

export const ExportControls: React.FC<ExportControlsProps> = ({
  outputFormat,
  setOutputFormat,
  jpegQuality,
  setJpegQuality,
  isDisabled,
}) => {
  return (
    <div className="space-y-4 animate-slide-fade-in-up">
      <div className="flex items-center gap-2">
        <DownloadIcon className="w-5 h-5 text-slate-400" />
        <h3 className="text-lg font-semibold text-slate-200">Export Settings</h3>
      </div>
      
      <div className="space-y-2">
        <label className="block text-sm font-medium text-slate-300">Format</label>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => setOutputFormat('png')}
            disabled={isDisabled}
            className={`px-3 py-2 text-sm font-semibold rounded-md transition-colors ${
              outputFormat === 'png' ? 'bg-cyan-600 text-white' : 'bg-slate-700 hover:bg-slate-600 text-slate-300'
            } disabled:opacity-50`}
          >
            PNG
          </button>
          <button
            onClick={() => setOutputFormat('jpeg')}
            disabled={isDisabled}
            className={`px-3 py-2 text-sm font-semibold rounded-md transition-colors ${
              outputFormat === 'jpeg' ? 'bg-cyan-600 text-white' : 'bg-slate-700 hover:bg-slate-600 text-slate-300'
            } disabled:opacity-50`}
          >
            JPEG
          </button>
        </div>
        <p className="text-xs text-slate-500">
            {outputFormat === 'png' ? 'Best for transparency and quality.' : 'Best for smaller file sizes.'}
        </p>
      </div>

      {outputFormat === 'jpeg' && (
        <div className="space-y-2 animate-fade-in">
          <label htmlFor="jpegQuality" className="block text-sm font-medium text-slate-300 mb-2">JPEG Quality: {Math.round(jpegQuality * 100)}%</label>
          <input 
            type="range" 
            id="jpegQuality" 
            min="0.1" 
            max="1" 
            step="0.01"
            value={jpegQuality} 
            onChange={e => setJpegQuality(parseFloat(e.target.value))} 
            disabled={isDisabled} 
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500 disabled:opacity-50"
          />
        </div>
      )}
    </div>
  );
};
