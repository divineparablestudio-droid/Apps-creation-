import React from 'react';

interface ApiKeySelectorProps {
  onSelectKey: () => void;
}

const KeyIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/>
    </svg>
);

export const ApiKeySelector: React.FC<ApiKeySelectorProps> = ({ onSelectKey }) => {
  return (
    <div className="p-4 bg-slate-800 border border-slate-700 rounded-lg text-center space-y-4">
      <KeyIcon className="w-10 h-10 mx-auto text-cyan-400"/>
      <h3 className="text-lg font-semibold text-white">Authorize Video Generation</h3>
      <div className="text-sm text-slate-400 text-left space-y-3">
        <p>To use the powerful Veo video model, a one-time authorization is required. This ensures usage is securely tied to your Google AI Studio account.</p>
        <ol className="list-decimal list-inside space-y-1 pl-2 font-medium text-slate-300">
            <li>Click the button below to open a secure dialog.</li>
            <li>In the dialog, <strong>select an existing API key</strong>.</li>
            <li>If you don't have a key, the dialog will guide you to <strong>create one</strong>. Make sure it's enabled for the Gemini API.</li>
        </ol>
      </div>
      <button
        onClick={onSelectKey}
        className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-2 px-4 rounded-md transition-all transform hover:scale-105 flex items-center justify-center"
      >
        Authorize and Select API Key
      </button>
      <p className="text-xs text-slate-500">
        If you've just created a key, the first attempt might fail. Please try again.
      </p>
      <a 
        href="https://ai.google.dev/gemini-api/docs/billing" 
        target="_blank" 
        rel="noopener noreferrer"
        className="text-xs text-slate-500 hover:text-cyan-400 underline"
      >
        Learn more about billing for Gemini API
      </a>
    </div>
  );
};