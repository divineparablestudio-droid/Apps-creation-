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


export const Header: React.FC = () => {
  return (
    <header className="text-center p-4 md:p-6">
      <div className="flex items-center justify-center gap-3 mb-2">
        <BrainIcon className="w-8 h-8 text-cyan-400" />
        <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight bg-gradient-to-r from-sky-400 to-cyan-300 bg-clip-text text-transparent">
          Brosteve AI Tech
        </h1>
      </div>
      <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto">
        Your all-in-one AI creative suite for images and design.
      </p>
    </header>
  );
};
