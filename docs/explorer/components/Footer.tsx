
import React from 'react';

export const Footer: React.FC = () => {
  const references = [
    { name: "Shannon, C. E. (1948). A mathematical theory of communication.", text: "Bell System Technical Journal." },
    { name: "Postman, N. (1985). Amusing Ourselves to Death.", text: "Penguin." },
    { name: "Lazarus, R. S. (1966). Psychological stress and the coping process.", text: "McGraw-Hill." },
    { name: "Hofstadter, D. R. (1979). Gödel, Escher, Bach.", text: "Basic Books." },
    { name: "Bostrom, N. (2014). Superintelligence: Paths, Dangers, Strategies.", text: "Oxford University Press." },
    { name: "Wheeler, T. (2025). Symbolic Collapse Model.", text: "GitHub: fantomx42/symbolic-collapse-model" },
  ];

  return (
    <footer className="bg-gray-800 bg-opacity-50 shadow-top mt-12 py-8 text-center text-gray-400 backdrop-blur-md">
      <div className="container mx-auto px-4">
        <h3 className="text-lg font-semibold text-purple-300 mb-3">Preliminary References</h3>
        <ul className="text-xs space-y-1 mb-6 max-w-2xl mx-auto">
          {references.map((ref, index) => (
            <li key={index}>
              <span className="font-medium">{ref.name}</span> {ref.text}
            </li>
          ))}
        </ul>
        <p className="text-sm">
          Symbolic Collapse Model Explorer &copy; {new Date().getFullYear()}. 
          Inspired by the concepts presented in the SCM paper.
        </p>
         <p className="text-xs mt-1">
          This is a conceptual tool for exploration and educational purposes.
        </p>
      </div>
    </footer>
  );
};
    