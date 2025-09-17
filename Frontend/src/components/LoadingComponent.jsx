import React from 'react'

function LoadingComponent({customLoadingMsg}) {
  return (
    <div className="flex flex-col items-center justify-center w-full py-8">
      <div className="loader mb-3" />
      <div className="text-[#C30E59] text-lg font-semibold tracking-wide animate-pulse">
        {customLoadingMsg ? customLoadingMsg : 'Just a moment...'}
      </div>
    </div>
  );
}

export default LoadingComponent