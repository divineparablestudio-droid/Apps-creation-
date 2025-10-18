import React from 'react';

const BrainIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v0A2.5 2.5 0 0 1 9.5 7v0A2.5 2.5 0 0 1 7 4.5v0A2.5 2.5 0 0 1 9.5 2Z" />
    <path d="M14.5 2A2.5 2.5 0 0 1 17 4.5v0A2.5 2.5 0 0 1 14.5 7v0A2.5 2.5 0 0 1 12 4.5v0A2.5 2.5 0 0 1 14.5 2Z" />
    <path d="M12 17.5a2.5 2.5 0 0 1 2.5-2.5v0a2.5 2.5 0 0 1-5 0v0A2.5 2.5 0 0 1 12 17.5Z" />
    <path d="M5 12.5A2.5 2.5 0 0 1 7.5 10v0a2.5 2.5 0 0 1-5 0v0A2.5 2.5 0 0 1 5 12.5Z" />
    <path d="M19 12.5a2.5 2.5 0 0 1 2.5-2.5v0a2.5 2.5 0 0 1-5 0v0A2.5 2.5 0 0 1 19 12.5Z" />
    <path d="M12 12a2.5 2.5 0 0 1-2.5-2.5v0A2.5 2.5 0 0 1 12 7v0a2.5 2.5 0 0 1 2.5 2.5v0A2.5 2.5 0 0 1 12 12Z" />
    <path d="M4.5 7A2.5 2.5 0 0 0 7 4.5" />
    <path d="M19.5 7A2.5 2.5 0 0 1 17 4.5" />
    <path d="M10 14.5a2.5 2.5 0 0 0-2.5 2.5" />
    <path d="M14 14.5a2.5 2.5 0 0 1 2.5 2.5" />
    <path d="M17 9.5a2.5 2.5 0 0 1-2.5 2.5" />
    <path d="M7 9.5a2.5 2.5 0 0 0 2.5 2.5" />
  </svg>
);

interface HomePageProps {
  onStart: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onStart }) => {
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center text-center p-4 overflow-hidden relative animate-fade-in">
      {/* Animated background gradient */}
      <div className="absolute top-0 left-0 w-full h-full bg-slate-900 z-0">
          <div className="absolute top-[-20%] left-[-20%] w-[40%] h-[40%] bg-cyan-500/10 rounded-full filter blur-3xl animate-blob"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-sky-600/10 rounded-full filter blur-3xl animate-blob animation-delay-2000"></div>
          <div className="absolute top-[30%] right-[15%] w-[30%] h-[30%] bg-purple-600/10 rounded-full filter blur-3xl animate-blob animation-delay-4000"></div>
      </div>
      
      <div className="relative z-10 flex flex-col items-center">
        <div className="flex items-center justify-center gap-3 mb-4 animate-fade-in-up">
            <BrainIcon className="w-12 h-12 text-cyan-400" />
            <h1 className="text-5xl sm:text-6xl font-bold text-white tracking-tight bg-gradient-to-r from-sky-400 to-cyan-300 bg-clip-text text-transparent">
              Brosteve AI Tech
            </h1>
        </div>
        <p className="text-slate-300 text-lg sm:text-xl max-w-2xl mx-auto mb-8 animate-fade-in-up animation-delay-300">
            Unleash your creativity. Generate and edit stunning visuals with the power of AI.
        </p>

        <button
          onClick={onStart}
          className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 px-8 rounded-lg transition-all transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-cyan-500/50 shadow-lg shadow-cyan-500/20 animate-fade-in-up animation-delay-600"
        >
          Start Creating
        </button>
      </div>
    </div>
  );
};
