import React from 'react';
import { ArrowLeft } from 'lucide-react';

const MoveBackButton = ({ onClick, className = "" }) => {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center px-4 md:px-6 py-2.5 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 ease-in-out group ${className}`}
    >
      <ArrowLeft className="w-4 h-4 mr-2 animate-bounce transition-transform duration-200 group-hover:-translate-x-0.5" />
      Move Back
    </button>
  );
};

export default MoveBackButton;