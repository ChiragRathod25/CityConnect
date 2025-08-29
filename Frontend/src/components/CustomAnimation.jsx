import { motion } from "framer-motion";
import { useEffect, useRef } from 'react';


export const MovingDots = ({ density = 15, speed = 8 }) => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {[...Array(density)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute w-1 h-1 bg-gray-600/30 rounded-full"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
        }}
        animate={{
          y: [0, -30, 0],
          x: [0, Math.random() * 20 - 10, 0],
          opacity: [0.2, 0.6, 0.2],
        }}
        transition={{
          duration: speed + Math.random() * 4,
          repeat: Infinity,
          delay: Math.random() * 2,
          ease: "easeInOut",
        }}
      />
    ))}
  </div>
);

export const MovingLines = ({ count = 6 }) => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <svg className="w-full h-full opacity-5">
      {[...Array(count)].map((_, i) => {
        const startX = Math.random() * 100;
        const startY = Math.random() * 100;
        const endX = Math.random() * 100;
        const endY = Math.random() * 100;

        return (
          <motion.line
            key={i}
            x1={`${startX}%`}
            y1={`${startY}%`}
            x2={`${endX}%`}
            y2={`${endY}%`}
            stroke="currentColor"
            strokeWidth="1"
            className="text-gray-700"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.2 }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              repeatType: "reverse",
              delay: i * 0.5,
            }}
          />
        );
      })}
    </svg>
  </div>
);

export const MovingSnakes = ({ count = 4 }) => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {[...Array(count)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute w-0.5 bg-gradient-to-b from-gray-600/20 via-gray-700/15 to-transparent"
        style={{
          height: "300px",
          left: `${20 + i * 25}%`,
        }}
        animate={{
          y: [
            -300,
            typeof window !== "undefined" ? window.innerHeight + 100 : 800,
          ],
          x: [
            0,
            Math.sin(Date.now() / 1000 + i) * 50,
            Math.cos(Date.now() / 1000 + i) * 30,
          ],
        }}
        transition={{
          duration: 8 + Math.random() * 4,
          repeat: Infinity,
          ease: "linear",
          delay: i * 1.5,
        }}
      />
    ))}
  </div>
);

export const GeometricShapes = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {[...Array(8)].map((_, i) => (
      <motion.div
        key={i}
        className={`absolute ${
          i % 3 === 0
            ? "w-4 h-4 rotate-45 border border-gray-600/15"
            : i % 3 === 1
            ? "w-3 h-3 rounded-full bg-gray-700/10"
            : "w-6 h-1 bg-gray-600/15"
        }`}
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
        }}
        animate={{
          rotate: [0, 360],
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.3, 0.1],
        }}
        transition={{
          duration: 6 + Math.random() * 4,
          repeat: Infinity,
          delay: Math.random() * 2,
        }}
      />
    ))}
  </div>
);


// import { useEffect, useRef } from 'react';

// GSAP would need to be imported in a real project
// For this demo, we'll use CSS animations as GSAP isn't available in this environment

export const StunningGSAPBackground = () => {
  const containerRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    // In a real project, you would use GSAP here like:
    // gsap.from(titleRef.current, { opacity: 0, y: 100, duration: 1.5 });
    // For now, we'll use CSS animations
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden" style={{
      background: 'linear-gradient(135deg, #f9fafb 0%, #f3f4f6 25%, #ffffff 50%, #f9fafb 75%, #e5e7eb 100%)'
    }}>
      {/* Floating Orbs */}
      <div className="fixed inset-0 pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <div
            key={`orb-${i}`}
            className={`absolute rounded-full animate-float-orb opacity-60`}
            style={{
              width: `${80 + Math.random() * 70}px`,
              height: `${80 + Math.random() * 70}px`,
              background: `radial-gradient(circle at ${30 + Math.random() * 30}% ${20 + Math.random() * 30}%, rgba(156, 163, 175, 0.6), rgba(75, 85, 99, 0.3))`,
              boxShadow: `0 0 ${40 + Math.random() * 40}px rgba(156, 163, 175, 0.4)`,
              filter: 'blur(1px)',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.8}s`,
              animationDuration: `${12 + Math.random() * 8}s`
            }}
          />
        ))}
      </div>

      {/* Morphing Shapes */}
      <div className="fixed inset-0 pointer-events-none">
        {[...Array(3)].map((_, i) => (
          <div
            key={`morph-${i}`}
            className="absolute animate-morph"
            style={{
              width: `${100 + Math.random() * 50}px`,
              height: `${100 + Math.random() * 50}px`,
              background: 'linear-gradient(135deg, rgba(156, 163, 175, 0.3), rgba(107, 114, 128, 0.2))',
              borderRadius: '50%',
              filter: 'blur(1.5px)',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 1.5}s`,
              animationDuration: `${15 + Math.random() * 10}s`
            }}
          />
        ))}
      </div>

      {/* Wave Layers */}
      <div className="fixed inset-0 pointer-events-none">
        {[...Array(3)].map((_, i) => (
          <div
            key={`wave-${i}`}
            className="absolute animate-wave"
            style={{
              width: '200%',
              height: '200%',
              background: `linear-gradient(${45 + i * 30}deg, 
                rgba(156, 163, 175, 0.1) 0%, 
                rgba(229, 231, 235, 0.05) 25%, 
                rgba(107, 114, 128, 0.08) 50%, 
                rgba(75, 85, 99, 0.06) 75%, 
                rgba(156, 163, 175, 0.04) 100%)`,
              borderRadius: '50%',
              filter: 'blur(2px)',
              left: '-50%',
              top: '-50%',
              transform: `rotate(${i * 120}deg)`,
              animationDelay: `${i * 2}s`,
              animationDuration: `${30 + i * 10}s`
            }}
          />
        ))}
      </div>

      {/* Flowing Particles */}
      <div className="fixed inset-0 pointer-events-none">
        {[...Array(25)].map((_, i) => (
          <div
            key={`particle-${i}`}
            className="absolute animate-particle"
            style={{
              width: '4px',
              height: '4px',
              background: 'radial-gradient(circle, rgba(75, 85, 99, 0.8), rgba(75, 85, 99, 0.2))',
              borderRadius: '50%',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 8}s`,
              animationDuration: `${8 + Math.random() * 12}s`
            }}
          />
        ))}
      </div>

      {/* Light Rays */}
      <div className="fixed inset-0 pointer-events-none">
        {[...Array(3)].map((_, i) => (
          <div
            key={`ray-${i}`}
            className="absolute animate-light-ray"
            style={{
              width: '2px',
              height: '100vh',
              background: `linear-gradient(90deg, 
                transparent 0%, 
                rgba(156, 163, 175, 0.1) 20%, 
                rgba(229, 231, 235, 0.2) 50%, 
                rgba(156, 163, 175, 0.1) 80%, 
                transparent 100%)`,
              transformOrigin: 'left center',
              left: `${Math.random() * 100}%`,
              top: '0',
              transform: `rotate(${Math.random() * 30 - 15}deg)`,
              animationDelay: `${i * 3}s`,
              animationDuration: `${8 + Math.random() * 4}s`
            }}
          />
        ))}
      </div>

      {/* Gradient overlays for depth - same as original */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-gray-300/10 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-tr from-gray-400/5 via-transparent to-gray-500/5 pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen">
        <div className="text-center text-gray-800 px-4">
          <h1 
            ref={titleRef}
            className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-gray-700 to-gray-800 bg-clip-text text-transparent animate-slide-up"
          >
            Welcome to CityConnect
          </h1>
          <p 
            ref={subtitleRef}
            className="text-xl md:text-2xl text-[#374151] mb-8 max-w-2xl mx-auto animate-slide-up-delay"
          >
            Discover amazing local businesses in your community with our
            interactive platform
          </p>
          <button 
            ref={buttonRef}
            className="px-8 py-4 bg-gradient-to-r from-gray-800 to-gray-900 rounded-full font-semibold text-white hover:from-gray-900 hover:to-black transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl animate-slide-up-delay-2"
          >
            Get Started
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes float-orb {
          0%, 100% {
            transform: translate(0px, 0px) scale(1) rotate(0deg);
            opacity: 0.6;
          }
          25% {
            transform: translate(-30px, -40px) scale(1.1) rotate(90deg);
            opacity: 0.8;
          }
          50% {
            transform: translate(40px, -20px) scale(0.9) rotate(180deg);
            opacity: 0.7;
          }
          75% {
            transform: translate(-20px, 30px) scale(1.05) rotate(270deg);
            opacity: 0.9;
          }
        }

        @keyframes morph {
          0%, 100% {
            transform: translate(0px, 0px) rotate(0deg);
            border-radius: 50%;
            width: 100px;
            height: 100px;
          }
          25% {
            transform: translate(50px, -30px) rotate(45deg);
            border-radius: 30% 70% 20% 80%;
            width: 120px;
            height: 80px;
          }
          50% {
            transform: translate(-30px, 40px) rotate(90deg);
            border-radius: 80% 20% 70% 30%;
            width: 80px;
            height: 140px;
          }
          75% {
            transform: translate(20px, -50px) rotate(135deg);
            border-radius: 40% 60% 40% 60%;
            width: 110px;
            height: 110px;
          }
        }

        @keyframes wave {
          0% {
            transform: rotate(0deg) scale(1);
          }
          50% {
            transform: rotate(180deg) scale(1.1);
          }
          100% {
            transform: rotate(360deg) scale(1);
          }
        }

        @keyframes particle {
          0%, 100% {
            transform: translate(0px, 0px) scale(1);
            opacity: 0.3;
          }
          25% {
            transform: translate(60px, -40px) scale(1.5);
            opacity: 0.7;
          }
          50% {
            transform: translate(-40px, 60px) scale(0.8);
            opacity: 0.5;
          }
          75% {
            transform: translate(80px, 20px) scale(1.2);
            opacity: 0.8;
          }
        }

        @keyframes light-ray {
          0% {
            transform: translateX(-200px) rotate(-15deg);
            opacity: 0;
          }
          50% {
            opacity: 0.6;
          }
          100% {
            transform: translateX(calc(100vw + 200px)) rotate(-15deg);
            opacity: 0;
          }
        }

        @keyframes slide-up {
          0% {
            opacity: 0;
            transform: translateY(100px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-float-orb {
          animation: float-orb ease-in-out infinite;
        }

        .animate-morph {
          animation: morph ease-in-out infinite;
        }

        .animate-wave {
          animation: wave linear infinite;
        }

        .animate-particle {
          animation: particle ease-in-out infinite;
        }

        .animate-light-ray {
          animation: light-ray linear infinite;
        }

        .animate-slide-up {
          animation: slide-up 1.5s ease-out forwards;
        }

        .animate-slide-up-delay {
          animation: slide-up 1.2s ease-out 0.3s forwards;
          opacity: 0;
        }

        .animate-slide-up-delay-2 {
          animation: slide-up 1s ease-out 0.6s forwards;
          opacity: 0;
        }

        /* Mouse interaction effect */
        .animate-float-orb:hover {
          animation-play-state: paused;
          transform: scale(1.2) !important;
          transition: transform 0.3s ease;
        }

        .animate-morph:hover {
          animation-play-state: paused;
          transform: scale(1.1) rotate(45deg) !important;
          transition: transform 0.5s ease;
        }
      `}</style>
    </div>
  );
};

export const StylingHomePageBackground = () => {
  return <StunningGSAPBackground />;
};
// export const MovingDotsBackground = () => {
//   const canvasRef = useRef(null);

//   useEffect(() => {
//     const canvas = canvasRef.current;
//     const ctx = canvas.getContext('2d');
    
//     // Set canvas size
//     const setCanvasSize = () => {
//       canvas.width = window.innerWidth;
//       canvas.height = window.innerHeight;
//     };
    
//     setCanvasSize();
//     window.addEventListener('resize', setCanvasSize);

//     // Dot properties
//     const dots = [];
//     const numDots = 80;
//     const maxDistance = 150;

//     // Create dots
//     for (let i = 0; i < numDots; i++) {
//       dots.push({
//         x: Math.random() * canvas.width,
//         y: Math.random() * canvas.height,
//         vx: (Math.random() - 0.5) * 0.8,
//         vy: (Math.random() - 0.5) * 0.8,
//         radius: Math.random() * 3 + 1,
//         opacity: Math.random() * 0.6 + 0.2
//       });
//     }

//     // Animation function
//     const animate = () => {
//       // Clear canvas with matching homepage background
//       ctx.fillStyle = 'rgba(249, 250, 251, 0.05)'; // Very light gray matching homepage
//       ctx.fillRect(0, 0, canvas.width, canvas.height);

//       // Update and draw dots
//       dots.forEach((dot, i) => {
//         // Update position
//         dot.x += dot.vx;
//         dot.y += dot.vy;

//         // Bounce off walls
//         if (dot.x < 0 || dot.x > canvas.width) dot.vx *= -1;
//         if (dot.y < 0 || dot.y > canvas.height) dot.vy *= -1;

//         // Keep dots within bounds
//         dot.x = Math.max(0, Math.min(canvas.width, dot.x));
//         dot.y = Math.max(0, Math.min(canvas.height, dot.y));

//         // Draw dot with homepage matching colors
//         ctx.beginPath();
//         ctx.arc(dot.x, dot.y, dot.radius, 0, Math.PI * 2);
//         ctx.fillStyle = `rgba(75, 85, 99, ${dot.opacity})`; // Gray-600 to match homepage
//         ctx.fill();

//         // Draw connections to nearby dots
//         for (let j = i + 1; j < dots.length; j++) {
//           const dx = dots[j].x - dot.x;
//           const dy = dots[j].y - dot.y;
//           const distance = Math.sqrt(dx * dx + dy * dy);

//           if (distance < maxDistance) {
//             ctx.beginPath();
//             ctx.moveTo(dot.x, dot.y);
//             ctx.lineTo(dots[j].x, dots[j].y);
//             const opacity = (1 - distance / maxDistance) * 0.2;
//             ctx.strokeStyle = `rgba(75, 85, 99, ${opacity})`; // Matching gray color
//             ctx.lineWidth = 0.5;
//             ctx.stroke();
//           }
//         }
//       });

//       requestAnimationFrame(animate);
//     };

//     animate();

//     return () => {
//       window.removeEventListener('resize', setCanvasSize);
//     };
//   }, []);

//   return (
//     <div className="fixed inset-0 -z-10">
//       <canvas
//         ref={canvasRef}
//         className="w-full h-full"
//         style={{ 
//           background: 'linear-gradient(135deg, #f9fafb 0%, #f3f4f6 25%, #ffffff 50%, #f9fafb 75%, #e5e7eb 100%)' 
//         }}
//       />
      
//       {/* CSS-only animated dots matching homepage colors */}
//       <div className="absolute inset-0 overflow-hidden pointer-events-none">
//         {/* Floating dots with homepage matching colors */}
//         {[...Array(15)].map((_, i) => (
//           <div
//             key={i}
//             className="absolute w-2 h-2 bg-gray-600 rounded-full opacity-20 animate-float"
//             style={{
//               left: `${Math.random() * 100}%`,
//               top: `${Math.random() * 100}%`,
//               animationDelay: `${Math.random() * 10}s`,
//               animationDuration: `${15 + Math.random() * 10}s`
//             }}
//           />
//         ))}
        
//         {/* Additional larger dots */}
//         {[...Array(8)].map((_, i) => (
//           <div
//             key={`large-${i}`}
//             className="absolute w-1 h-1 bg-gray-700 rounded-full opacity-30 animate-pulse animate-float"
//             style={{
//               left: `${Math.random() * 100}%`,
//               top: `${Math.random() * 100}%`,
//               animationDelay: `${Math.random() * 8}s`,
//               animationDuration: `${20 + Math.random() * 15}s`
//             }}
//           />
//         ))}
//       </div>
      
//       {/* Gradient overlays for depth matching homepage */}
//       <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-gray-300/10 pointer-events-none" />
//       <div className="absolute inset-0 bg-gradient-to-tr from-gray-400/5 via-transparent to-gray-500/5 pointer-events-none" />
//     </div>
//   );
// };

// export const StylingHomePageBackground = () => {
//   return (
//     <div className="relative min-h-screen">
//       <MovingDotsBackground />

//       <div className="relative z-10 flex items-center justify-center min-h-screen">
//         <div className="text-center text-gray-800 px-4">
//           <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-gray-700 to-gray-800 bg-clip-text text-transparent">
//             Welcome to CityConnect
//           </h1>
//           <p className="text-xl md:text-2xl text-[#374151] mb-8 max-w-2xl mx-auto">
//             Discover amazing local businesses in your community with our
//             interactive platform
//           </p>
//           <button className="px-8 py-4 bg-gradient-to-r from-gray-800 to-gray-900 rounded-full font-semibold text-white hover:from-gray-900 hover:to-black transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
//             Get Started
//           </button>
//         </div>
//       </div>

//       <style jsx>{`
//         @keyframes float {
//           0%,
//           100% {
//             transform: translateY(0px) translateX(0px);
//             opacity: 0.2;
//           }
//           25% {
//             transform: translateY(-20px) translateX(10px);
//             opacity: 0.4;
//           }
//           50% {
//             transform: translateY(-40px) translateX(-5px);
//             opacity: 0.6;
//           }
//           75% {
//             transform: translateY(-20px) translateX(-15px);
//             opacity: 0.3;
//           }
//         }

//         .animate-float {
//           animation: float linear infinite;
//         }

//         @keyframes fadeInMove {
//           0% {
//             opacity: 0;
//             transform: translate(-20px, 20px);
//           }
//           50% {
//             opacity: 0.6;
//           }
//           100% {
//             opacity: 0.2;
//             transform: translate(20px, -20px);
//           }
//         }
//       `}</style>
//     </div>
//   );
// };


export const SnakeAnimatedBackground = ({
  intensity = "medium", // 'low', 'medium', 'high'
  theme = "gray", // 'gray', 'silver', 'charcoal'
  style = "modern", // 'modern', 'minimal', 'elegant'
}) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Set canvas size
    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    setCanvasSize();
    window.addEventListener("resize", setCanvasSize);

    // Intensity settings
    const intensityConfig = {
      low: { snakes: 3, trailLength: 15, speed: 0.8, particles: 20 },
      medium: { snakes: 5, trailLength: 25, speed: 1.2, particles: 35 },
      high: { snakes: 8, trailLength: 40, speed: 1.8, particles: 50 },
    };

    const config = intensityConfig[intensity];

    // Gray theme colors for white background
    const themes = {
      gray: {
        primary: [75, 85, 99], // gray-600
        secondary: [156, 163, 175], // gray-400
        accent: [107, 114, 128], // gray-500
      },
      silver: {
        primary: [100, 116, 139], // slate-500
        secondary: [148, 163, 184], // slate-400
        accent: [71, 85, 105], // slate-600
      },
      charcoal: {
        primary: [55, 65, 81], // gray-700
        secondary: [107, 114, 128], // gray-500
        accent: [31, 41, 55], // gray-800
      },
    };

    const currentTheme = themes[theme];

    // Snake class
    class Snake {
      constructor() {
        this.segments = [];
        this.direction = { x: 1, y: 0 };
        this.speed = config.speed;
        this.segmentSize = Math.random() * 6 + 3; // Slightly smaller for elegance
        this.trailLength = config.trailLength;

        // Random starting position
        const startX = Math.random() * canvas.width;
        const startY = Math.random() * canvas.height;

        // Initialize segments
        for (let i = 0; i < this.trailLength; i++) {
          this.segments.push({
            x: startX - i * this.segmentSize,
            y: startY,
            opacity: 0.8 - (i / this.trailLength) * 0.6, // Adjust opacity for white bg
            size: this.segmentSize * (1 - (i / this.trailLength) * 0.5),
          });
        }

        this.changeDirectionTimer = 0;
        this.nextDirectionChange = Math.random() * 120 + 60;
      }

      update() {
        // Change direction periodically
        this.changeDirectionTimer++;
        if (this.changeDirectionTimer >= this.nextDirectionChange) {
          this.changeDirection();
          this.changeDirectionTimer = 0;
          this.nextDirectionChange = Math.random() * 120 + 60;
        }

        // Calculate new head position
        const head = this.segments[0];
        const newX = head.x + this.direction.x * this.speed;
        const newY = head.y + this.direction.y * this.speed;

        // Wrap around screen
        let wrappedX = newX;
        let wrappedY = newY;

        if (newX > canvas.width + 50) wrappedX = -50;
        if (newX < -50) wrappedX = canvas.width + 50;
        if (newY > canvas.height + 50) wrappedY = -50;
        if (newY < -50) wrappedY = canvas.height + 50;

        // Add new head
        this.segments.unshift({
          x: wrappedX,
          y: wrappedY,
          opacity: 0.8,
          size: this.segmentSize,
        });

        // Remove tail if too long
        if (this.segments.length > this.trailLength) {
          this.segments.pop();
        }

        // Update segment properties
        this.segments.forEach((segment, index) => {
          segment.opacity = 0.8 - (index / this.trailLength) * 0.6;
          segment.size =
            this.segmentSize * (1 - (index / this.trailLength) * 0.5);
        });
      }

      changeDirection() {
        const directions = [
          { x: 1, y: 0 }, // right
          { x: -1, y: 0 }, // left
          { x: 0, y: 1 }, // down
          { x: 0, y: -1 }, // up
          { x: 1, y: 1 }, // diagonal down-right
          { x: -1, y: -1 }, // diagonal up-left
          { x: 1, y: -1 }, // diagonal up-right
          { x: -1, y: 1 }, // diagonal down-left
        ];

        this.direction =
          directions[Math.floor(Math.random() * directions.length)];
      }

      draw() {
        this.segments.forEach((segment, index) => {
          const [r, g, b] =
            index === 0
              ? currentTheme.primary
              : index < 5
              ? currentTheme.secondary
              : currentTheme.accent;
          const color = `rgba(${r}, ${g}, ${b}, ${segment.opacity})`;

          // Draw segment with subtle shadow for depth
          if (style === "modern") {
            ctx.shadowColor = `rgba(${r}, ${g}, ${b}, 0.3)`;
            ctx.shadowBlur = 8;
            ctx.shadowOffsetX = 1;
            ctx.shadowOffsetY = 1;
          }

          ctx.beginPath();
          ctx.arc(segment.x, segment.y, segment.size, 0, Math.PI * 2);
          ctx.fillStyle = color;
          ctx.fill();

          // Add inner highlight for modern style
          if (style === "modern" && index < 3) {
            const highlightGradient = ctx.createRadialGradient(
              segment.x - segment.size * 0.3,
              segment.y - segment.size * 0.3,
              0,
              segment.x,
              segment.y,
              segment.size
            );
            highlightGradient.addColorStop(
              0,
              `rgba(255, 255, 255, ${segment.opacity * 0.4})`
            );
            highlightGradient.addColorStop(1, `rgba(255, 255, 255, 0)`);

            ctx.beginPath();
            ctx.arc(segment.x, segment.y, segment.size, 0, Math.PI * 2);
            ctx.fillStyle = highlightGradient;
            ctx.fill();
          }

          ctx.shadowBlur = 0;
          ctx.shadowOffsetX = 0;
          ctx.shadowOffsetY = 0;
        });
      }
    }

    // Particle class for additional effects
    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 1;
        this.vy = (Math.random() - 0.5) * 1;
        this.life = Math.random() * 100 + 50;
        this.maxLife = this.life;
        this.size = Math.random() * 2 + 0.5;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.life--;

        // Wrap around screen
        if (this.x > canvas.width) this.x = 0;
        if (this.x < 0) this.x = canvas.width;
        if (this.y > canvas.height) this.y = 0;
        if (this.y < 0) this.y = canvas.height;

        return this.life > 0;
      }

      draw() {
        const opacity = (this.life / this.maxLife) * 0.3;
        const [r, g, b] = currentTheme.accent;

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${opacity})`;
        ctx.fill();
      }
    }

    // Initialize snakes and particles
    const snakes = [];
    const particles = [];

    for (let i = 0; i < config.snakes; i++) {
      snakes.push(new Snake());
    }

    for (let i = 0; i < config.particles; i++) {
      particles.push(new Particle());
    }

    // Animation loop
    const animate = () => {
      // Clear with very subtle trail effect for white background
      ctx.fillStyle = "rgba(255, 255, 255, 0.15)"; // Light fade for trail effect
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update and draw snakes
      snakes.forEach((snake) => {
        snake.update();
        snake.draw();
      });

      // Update and draw particles
      for (let i = particles.length - 1; i >= 0; i--) {
        if (particles[i].update()) {
          particles[i].draw();
        } else {
          particles.splice(i, 1);
          particles.push(new Particle()); // Replace with new particle
        }
      }

      // Draw subtle connections between snake heads
      if (style === "modern") {
        for (let i = 0; i < snakes.length; i++) {
          for (let j = i + 1; j < snakes.length; j++) {
            const snake1 = snakes[i];
            const snake2 = snakes[j];
            const head1 = snake1.segments[0];
            const head2 = snake2.segments[0];

            const distance = Math.sqrt(
              Math.pow(head2.x - head1.x, 2) + Math.pow(head2.y - head1.y, 2)
            );

            if (distance < 150) {
              const opacity = (1 - distance / 150) * 0.1;
              const [r, g, b] = currentTheme.secondary;

              ctx.beginPath();
              ctx.moveTo(head1.x, head1.y);
              ctx.lineTo(head2.x, head2.y);
              ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${opacity})`;
              ctx.lineWidth = 1;
              ctx.stroke();
            }
          }
        }
      }

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", setCanvasSize);
    };
  }, [intensity, theme, style]);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{
          background:
            style === "minimal"
              ? "#ffffff"
              : style === "elegant"
              ? "linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)"
              : "linear-gradient(135deg, #ffffff 0%, #f8fafc 50%, #f1f5f9 100%)",
        }}
      />

      {/* Additional overlay effects for white background */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Subtle texture overlay */}
        {style === "elegant" && (
          <div
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: `
                radial-gradient(circle at 1px 1px, rgba(0,0,0,0.1) 1px, transparent 0)
              `,
              backgroundSize: "20px 20px",
            }}
          />
        )}

        {/* Gradient overlays for depth */}
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-gray-50/30" />
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-transparent to-slate-50/20" />
      </div>
    </div>
  );
};



