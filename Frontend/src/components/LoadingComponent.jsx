import React from 'react';
import { Atom } from 'react-loading-indicators';

const LoadingComponent = () => {
  return (
    <div className="flex items-center justify-center min-h-screen p-1 scale-80 sm:scale-100">
      <div className="flex flex-col items-center gap-6 px-8 py-12 rounded-2xl shadow-xl border-2 border-gray-300/30 bg-gray-100/70 backdrop-blur-md transition-all w-full max-w-lg text-xl">
        <Atom 
          color="#4B5563"
          size="medium"
          text="Loading..."
          textColor="#6B7280"
        />
        
        <p className="text-lg text-gray-500 text-center max-w-xs">
          Preparing your app, almost there!
        </p>

        <div className="w-24 h-1 bg-gradient-to-r from-gray-400 to-gray-600 rounded-full animate-pulse" />
      </div>
    </div>
  );
};

export default LoadingComponent;