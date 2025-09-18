import React, { useState, useEffect } from 'react';

const NotFoundPage = () => {
  const [eyePosition, setEyePosition] = useState({ x: 0, y: 0 });
  const [isBlinking, setIsBlinking] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [animationPhase, setAnimationPhase] = useState(0);

  // Handle screen resize for responsiveness
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Mouse tracking for eyes on desktop
  useEffect(() => {
    if (!isMobile) {
      const handleMouseMove = (e) => {
        const rect = document.getElementById('face-container')?.getBoundingClientRect();
        if (rect) {
          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;
          const x = (e.clientX - centerX) * 0.03;
          const y = (e.clientY - centerY) * 0.03;
          setEyePosition({ 
            x: Math.max(-6, Math.min(6, x)), 
            y: Math.max(-6, Math.min(6, y)) 
          });
        }
      };

      window.addEventListener('mousemove', handleMouseMove);
      return () => window.removeEventListener('mousemove', handleMouseMove);
    }
  }, [isMobile]);

  // Smooth automatic eye movement on mobile using sinusoidal motion
  useEffect(() => {
    if (isMobile) {
      const interval = setInterval(() => {
        setAnimationPhase((prev) => prev + 0.1);
        const x = Math.sin(animationPhase) * 4;
        const y = Math.cos(animationPhase) * 4;
        setEyePosition({ x, y });
      }, 50);
      return () => clearInterval(interval);
    }
  }, [isMobile, animationPhase]);

  // Blinking animation
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 180);
    }, 4000);

    return () => clearInterval(blinkInterval);
  }, []);

  const Eye = ({ className }) => (
    <div className={`relative bg-[#e2e8f0] rounded-full shadow-md ${className}`}>
      <div 
        className={`absolute bg-[#1e2937] rounded-full transition-all duration-100 ease-out ${
          isBlinking ? 'scale-y-0' : 'scale-y-100'
        }`}
        style={{
          width: '40%',
          height: '40%',
          top: '50%',
          left: '50%',
          transform: `translate(calc(-50% + ${eyePosition.x}px), calc(-50% + ${eyePosition.y}px)) ${isBlinking ? 'scaleY(0)' : 'scaleY(1)'}`,
        }}
      >
        <div className="absolute top-1 left-1 bg-[#f8fafc] rounded-full" style={{ width: '25%', height: '25%' }}></div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen py-30 md:py-20  bg-[#f8fafc] flex flex-col relative overflow-hidden animate-fadeIn">
      

      {/* Main Content */}
      <main className="flex-1 flex flex-col justify-center items-center px-4 relative z-10">
        
        {/* 404 Title with Animation */}
        <div className="text-center mb-4 md:mb-6 animate-scaleUp">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-[#1e2937] mb-2 tracking-tight leading-none">
            <span className="drop-shadow-lg">404</span>
          </h1>
          <div className="h-0.5 w-16 md:w-24 bg-[#94a3b8]/60 mx-auto rounded"></div>
        </div>
        
        {/* Error Message */}
        <div className="text-center mb-8 md:mb-16 max-w-xs sm:max-w-md animate-fadeInUp">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-[#1e2937] mb-2 leading-tight">
            <span className="drop-shadow-md">Page Not Found</span>
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-[#64748b] leading-relaxed font-medium">
            <span className="drop-shadow-sm">Oops! The page you're looking for doesn't exist.</span>
          </p>
        </div>

        {/* Character Face */}
        <div className="relative mb-6 md:mb-10 animate-float">
          <div id="face-container" className="relative w-32 h-32 sm:w-40 sm:h-40 md:w-56 md:h-56 lg:w-72 lg:h-72 mx-auto">
            {/* Face Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#e2e8f0] via-[#d1d5db] to-[#94a3b8] rounded-full shadow-lg border-2 border-slate-400"></div>
            
            {/* Eyes Container */}
            <div className="absolute inset-0 flex justify-center items-center">
              <div className="flex space-x-4 sm:space-x-6 md:space-x-8 -mt-4 md:-mt-6">
                <Eye className="w-8 h-6 sm:w-10 sm:h-8 md:w-12 md:h-10 lg:w-16 lg:h-12" />
                <Eye className="w-8 h-6 sm:w-10 sm:h-8 md:w-12 md:h-10 lg:w-16 lg:h-12" />
              </div>
            </div>
            
            {/* Nose */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1.5 w-1.5 h-1.5 md:w-2 md:h-2 bg-[#64748b] rounded-full shadow-sm"></div>

            {/* Mouth with 404 */}
            <div className="absolute bottom-6 sm:bottom-8 md:bottom-10 lg:bottom-12 left-1/2 transform -translate-x-1/2">
              <div className="relative w-16 h-8 sm:w-20 sm:h-10 md:w-24 md:h-12 lg:w-28 lg:h-14 bg-gradient-to-b from-[#d1d5db] to-[#94a3b8] rounded-full shadow-lg flex items-center justify-center border-2 border-slat-700">
                <div className="bg-[#f8fafc] rounded-full w-12 h-6 sm:w-16 sm:h-8 md:w-20 md:h-10 lg:w-24 lg:h-12 flex items-center justify-center shadow-inner">
                  <span className="text-[#1e2937] font-bold text-xs sm:text-sm md:text-base lg:text-lg tracking-tight">404</span>
                </div>
              </div>
            </div>
            
            {/* Cheek Blush */}
            <div className="absolute top-1/3 left-1 sm:left-2 md:left-3 w-3 h-2 sm:w-4 sm:h-3 md:w-5 md:h-4 bg-[#d1d5db]/40 rounded-full blur-sm"></div>
            <div className="absolute top-1/3 right-1 sm:right-2 md:right-3 w-3 h-2 sm:w-4 sm:h-3 md:w-5 md:h-4 bg-[#d1d5db]/40 rounded-full blur-sm"></div>
          </div>
          
          {/* "Oh" Text with Line */}
          <div className="absolute  sm:mt-4 md:mt-3 -top-4 sm:-top-6 md:-top-8 lg:-top-10 left-1/2 transform -translate-x-1/2 text-center animate-bounce">
            <span className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-light text-[#1e2937] drop-shadow-md tracking-tight">Oh</span>
            <div className="w-px h-4 sm:h-6 md:h-8 lg:h-10 bg-[#94a3b8]/50 mx-auto mt-1"></div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center w-full max-w-xs animate-fadeInUp">
          <button 
            onClick={() => window.location.href = '/'}
            className="w-full sm:w-auto px-4 py-2 md:px-6 md:py-3 bg-[#e2e8f0]/25 backdrop-blur-md border-2 border-[#d1d5db]/30 rounded-lg text-[#1e2937] font-semibold hover:bg-[#e2e8f0]/35 hover:scale-105 hover:shadow-[0_0_10px_rgba(226,232,240,0.5)] hover:border-black transition-all duration-300 ease-out shadow-md text-sm md:text-base"
          >
            Go Home
          </button>
          <button 
            onClick={() => window.history.back()}
            className="w-full sm:w-auto px-4 py-2 md:px-6 md:py-3 bg-[#64748b]/80 backdrop-blur-md rounded-lg text-[#f8fafc] font-semibold hover:bg-black hover:scale-105 hover:shadow-[0_0_10px_rgba(226,232,240,0.5)] transition-all duration-300 ease-out hover:border-gray-500 border-2 shadow-md  border-[#d1d5db]/30 text-sm md:text-base"
          >
            Go Back
          </button>
        </div>
      </main>
    </div>
  );
};

// CSS Animations
const styles = `
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes scaleUp {
    from { transform: scale(0.9); }
    to { transform: scale(1); }
  }
  @keyframes float {
    0% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
    100% { transform: translateY(0); }
  }
  @keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-5px); }
  }
  .animate-fadeIn { animation: fadeIn 1s ease-out; }
  .animate-fadeInUp { animation: fadeInUp 1s ease-out; }
  .animate-scaleUp { animation: scaleUp 1s ease-out; }
  .animate-float { animation: float 3s ease-in-out infinite; }
  .animate-bounce { animation: bounce 2s ease-in-out infinite; }
`;

export default NotFoundPage;