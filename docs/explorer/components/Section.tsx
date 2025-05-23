
import React, { useState } from 'react';

interface SectionProps {
  title: string;
  children: React.ReactNode;
  initiallyOpen?: boolean;
}

export const Section: React.FC<SectionProps> = ({ title, children, initiallyOpen = false }) => {
  const [isOpen, setIsOpen] = useState(initiallyOpen);

  return (
    <section className="bg-gray-800 bg-opacity-60 p-6 rounded-xl shadow-xl backdrop-blur-sm border border-gray-700">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left flex justify-between items-center mb-4 focus:outline-none"
      >
        <h2 className="text-2xl font-semibold text-purple-400 hover:text-purple-300 transition-colors">{title}</h2>
        <span className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180' : 'rotate-0'}`}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-6 h-6 text-purple-400">
            <path fillRule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
          </svg>
        </span>
      </button>
      {isOpen && <div className="mt-2 text-gray-300">{children}</div>}
    </section>
  );
};
    