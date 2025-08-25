import { useEffect, useRef } from 'react';

const MovingDotsBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);

    // Dot properties
    const dots = [];
    const numDots = 80;
    const maxDistance = 150;

    // Create dots
    for (let i = 0; i < numDots; i++) {
      dots.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        radius: Math.random() * 3 + 1,
        opacity: Math.random() * 0.6 + 0.2
      });
    }

    // Animation function
    const animate = () => {
      // Clear canvas with matching homepage background
      ctx.fillStyle = 'rgba(249, 250, 251, 0.05)'; // Very light gray matching homepage
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update and draw dots
      dots.forEach((dot, i) => {
        // Update position
        dot.x += dot.vx;
        dot.y += dot.vy;

        // Bounce off walls
        if (dot.x < 0 || dot.x > canvas.width) dot.vx *= -1;
        if (dot.y < 0 || dot.y > canvas.height) dot.vy *= -1;

        // Keep dots within bounds
        dot.x = Math.max(0, Math.min(canvas.width, dot.x));
        dot.y = Math.max(0, Math.min(canvas.height, dot.y));

        // Draw dot with homepage matching colors
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dot.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(75, 85, 99, ${dot.opacity})`; // Gray-600 to match homepage
        ctx.fill();

        // Draw connections to nearby dots
        for (let j = i + 1; j < dots.length; j++) {
          const dx = dots[j].x - dot.x;
          const dy = dots[j].y - dot.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < maxDistance) {
            ctx.beginPath();
            ctx.moveTo(dot.x, dot.y);
            ctx.lineTo(dots[j].x, dots[j].y);
            const opacity = (1 - distance / maxDistance) * 0.2;
            ctx.strokeStyle = `rgba(75, 85, 99, ${opacity})`; // Matching gray color
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      });

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', setCanvasSize);
    };
  }, []);

  return (
    <div className="fixed inset-0 -z-10">
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ 
          background: 'linear-gradient(135deg, #f9fafb 0%, #f3f4f6 25%, #ffffff 50%, #f9fafb 75%, #e5e7eb 100%)' 
        }}
      />
      
      {/* CSS-only animated dots matching homepage colors */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating dots with homepage matching colors */}
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-gray-600 rounded-full opacity-20 animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 10}s`,
              animationDuration: `${15 + Math.random() * 10}s`
            }}
          />
        ))}
        
        {/* Additional larger dots */}
        {[...Array(8)].map((_, i) => (
          <div
            key={`large-${i}`}
            className="absolute w-1 h-1 bg-gray-700 rounded-full opacity-30 animate-pulse animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 8}s`,
              animationDuration: `${20 + Math.random() * 15}s`
            }}
          />
        ))}
      </div>
      
      {/* Gradient overlays for depth matching homepage */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-gray-300/10 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-tr from-gray-400/5 via-transparent to-gray-500/5 pointer-events-none" />
    </div>
  );
};

const StylingBackground1 = () => {
  return (
    <div className="relative min-h-screen">
      {/* Moving Dots Background */}
      <MovingDotsBackground />
      
      {/* Your existing homepage content goes here */}
      <div className="relative z-10 flex items-center justify-center min-h-screen">
        <div className="text-center text-gray-800 px-4">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-gray-700 to-gray-800 bg-clip-text text-transparent">
            Welcome to CityConnect
          </h1>
          <p className="text-xl md:text-2xl text-[#374151] mb-8 max-w-2xl mx-auto">
            Discover amazing local businesses in your community with our interactive platform
          </p>
          <button className="px-8 py-4 bg-gradient-to-r from-gray-800 to-gray-900 rounded-full font-semibold text-white hover:from-gray-900 hover:to-black transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
            Get Started
          </button>
        </div>
      </div>

      {/* Custom styles for animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) translateX(0px);
            opacity: 0.2;
          }
          25% {
            transform: translateY(-20px) translateX(10px);
            opacity: 0.4;
          }
          50% {
            transform: translateY(-40px) translateX(-5px);
            opacity: 0.6;
          }
          75% {
            transform: translateY(-20px) translateX(-15px);
            opacity: 0.3;
          }
        }
        
        .animate-float {
          animation: float linear infinite;
        }
        
        @keyframes fadeInMove {
          0% {
            opacity: 0;
            transform: translate(-20px, 20px);
          }
          50% {
            opacity: 0.6;
          }
          100% {
            opacity: 0.2;
            transform: translate(20px, -20px);
          }
        }
      `}</style>
    </div>
  );
};

export default StylingBackground1;