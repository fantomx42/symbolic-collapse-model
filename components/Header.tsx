
import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="bg-gray-800 bg-opacity-50 shadow-lg backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center space-x-3">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10 text-purple-400">
              <path fillRule="evenodd" d="M14.615 1.585a.75.75 0 0 1 0 1.06L11.939 5.322a.75.75 0 0 1-1.06 0L8.204 2.646a.75.75 0 1 1 1.06-1.061L11.4 3.717l2.155-2.156a.75.75 0 0 1 1.06 0Zm-3.841 9.408 4.664 4.663a.75.75 0 0 1-1.06 1.06L10.246 12.2l-1.756 1.756a.75.75 0 1 1-1.06-1.06l2.334-2.333a.75.75 0 0 1 1.06 0ZM8.779 8.77a.75.75 0 0 1 .326 1.376l-.06.034L5.732 12.2l1.03 1.03a.75.75 0 0 1-1.06 1.06L4.673 13.268a2.25 2.25 0 0 1 0-3.182l1.03-1.03-.027-.027A.75.75 0 0 1 8.779 8.78Zm.927-4.44V1.5a.75.75 0 0 1 1.5 0v2.019a2.253 2.253 0 0 1 .358.358l1.854 1.853a.75.75 0 1 1-1.06 1.06L10.5 5.732l-1.318 1.318a.75.75 0 0 1-1.061-1.06L9.707 4.44Z" clipRule="evenodd" />
              <path d="m10.26 16.205-.326-1.376.06-.034 3.313-2.037L12.28 11.73a.75.75 0 1 1 1.06-1.06l1.03 1.03.028.028A.75.75 0 0 1 14.4 13.28l-.326 1.376-.06.034-3.313 2.037-1.03-1.03a.75.75 0 0 1-.373-.622Zm2.503-11.995 2.333 2.334a.75.75 0 1 1-1.06 1.06L12.28 5.847l-2.155 2.156a.75.75 0 1 1-1.06-1.061l2.646-2.646a.75.75 0 0 1 1.06 0Z" />
            </svg>
          <h1 className="text-2xl font-bold text-purple-300 tracking-tight">Symbolic Collapse Model Explorer</h1>
        </div>
      </div>
    </header>
  );
};
