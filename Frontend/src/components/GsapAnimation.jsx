import  { useEffect, useRef } from 'react';

// Note: You'll need to install GSAP: npm install gsap
// For now, I'll create the structure without actual GSAP imports since it's not available in this environment

// Color palette from your design
const colors = {
  lightBG: '#f8fafc',
  lightBG2: '#e2e8f0', 
  darkText: '#1f2937',
  mediumText: '#374151',
  lightText: '#6b7280',
  subtleText: '#9ca3af',
  borderLight: '#d1d5db',
  border: '#e5e7eb',
  cardBG: '#f3f4f6',
  softBG: '#f9fafb',
  white: '#ffffff',
  black: '#000000'
};

// 1. Floating Orbs Animation
const FloatingOrbs = ({ density = 15, speed = 20 }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    // GSAP Animation Logic (pseudo-code structure)
    // import { gsap } from 'gsap';
    
    const container = containerRef.current;
    if (!container) return;

    // Create orbs dynamically
    for (let i = 0; i < density; i++) {
      const orb = document.createElement('div');
      orb.className = 'floating-orb';
      orb.style.cssText = `
        position: absolute;
        width: ${Math.random() * 100 + 20}px;
        height: ${Math.random() * 100 + 20}px;
        background: linear-gradient(45deg, ${colors.lightBG2}, ${colors.cardBG});
        border-radius: 50%;
        opacity: ${Math.random() * 0.6 + 0.1};
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        backdrop-filter: blur(2px);
        border: 1px solid ${colors.border};
      `;
      container.appendChild(orb);

      // GSAP animation would go here:
      // gsap.to(orb, {
      //   x: `random(-200, 200)`,
      //   y: `random(-200, 200)`,
      //   duration: speed + Math.random() * 10,
      //   repeat: -1,
      //   yoyo: true,
      //   ease: "power1.inOut"
      // });
    }

    return () => {
      container.innerHTML = '';
    };
  }, [density, speed]);

  return (
    <div 
      ref={containerRef}
      className="absolute inset-0 pointer-events-none overflow-hidden"
      style={{ backgroundColor: colors.lightBG }}
    />
  );
};

// 2. Geometric Pattern Animation
const GeometricPattern = ({ complexity = 20 }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    for (let i = 0; i < complexity; i++) {
      const shape = document.createElement('div');
      const isCircle = Math.random() > 0.5;
      const size = Math.random() * 60 + 20;
      
      shape.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        background: ${Math.random() > 0.5 ? colors.lightBG2 : colors.cardBG};
        border: 1px solid ${colors.border};
        ${isCircle ? 'border-radius: 50%;' : `transform: rotate(${Math.random() * 360}deg);`}
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        opacity: ${Math.random() * 0.4 + 0.1};
      `;
      container.appendChild(shape);

      // GSAP rotation animation:
      // gsap.to(shape, {
      //   rotation: 360,
      //   duration: 15 + Math.random() * 20,
      //   repeat: -1,
      //   ease: "none"
      // });
    }

    return () => {
      container.innerHTML = '';
    };
  }, [complexity]);

  return (
    <div 
      ref={containerRef}
      className="absolute inset-0 pointer-events-none overflow-hidden"
    />
  );
};

// 3. Wave Pattern Animation  
const WavePattern = ({ waves = 5, amplitude = 100 }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    for (let i = 0; i < waves; i++) {
      const wave = document.createElement('div');
      wave.style.cssText = `
        position: absolute;
        width: 120%;
        height: ${60 + Math.random() * 40}px;
        background: linear-gradient(90deg, transparent, ${colors.lightBG2}40, transparent);
        border-radius: 50px;
        left: -10%;
        top: ${(100 / waves) * i}%;
        transform-origin: center;
      `;
      container.appendChild(wave);

      // GSAP wave animation:
      // gsap.to(wave, {
      //   x: "100vw",
      //   duration: 20 + i * 5,
      //   repeat: -1,
      //   ease: "none"
      // });
    }

    return () => {
      container.innerHTML = '';
    };
  }, [waves, amplitude]);

  return (
    <div 
      ref={containerRef}
      className="absolute inset-0 pointer-events-none overflow-hidden"
    />
  );
};

// 4. Particle System Animation
const ParticleSystem = ({ particles = 50, speed = 15 }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    for (let i = 0; i < particles; i++) {
      const particle = document.createElement('div');
      const size = Math.random() * 4 + 1;
      
      particle.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        background: ${Math.random() > 0.5 ? colors.lightText : colors.subtleText};
        border-radius: 50%;
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        opacity: ${Math.random() * 0.8 + 0.2};
      `;
      container.appendChild(particle);

      // GSAP particle animation:
      // gsap.to(particle, {
      //   y: `-${Math.random() * 200 + 100}px`,
      //   x: `${(Math.random() - 0.5) * 100}px`,
      //   opacity: 0,
      //   duration: speed + Math.random() * 10,
      //   repeat: -1,
      //   ease: "power2.out"
      // });
    }

    return () => {
      container.innerHTML = '';
    };
  }, [particles, speed]);

  return (
    <div 
      ref={containerRef}
      className="absolute inset-0 pointer-events-none overflow-hidden"
    />
  );
};

// 5. Morphing Blobs Animation
const MorphingBlobs = ({ blobs = 8, morphSpeed = 12 }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    for (let i = 0; i < blobs; i++) {
      const blob = document.createElement('div');
      const size = Math.random() * 150 + 80;
      
      blob.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        background: linear-gradient(45deg, ${colors.cardBG}60, ${colors.softBG}40);
        border-radius: 50% 30% 70% 40%;
        left: ${Math.random() * 90}%;
        top: ${Math.random() * 90}%;
        opacity: 0.6;
        backdrop-filter: blur(1px);
        border: 1px solid ${colors.border}50;
      `;
      container.appendChild(blob);

      // GSAP morphing animation:
      // const morphValues = [
      //   "50% 30% 70% 40%",
      //   "40% 60% 30% 70%", 
      //   "70% 40% 50% 60%",
      //   "60% 70% 40% 50%"
      // ];
      
      // gsap.to(blob, {
      //   borderRadius: morphValues[Math.floor(Math.random() * morphValues.length)],
      //   duration: morphSpeed,
      //   repeat: -1,
      //   yoyo: true,
      //   ease: "power2.inOut"
      // });
    }

    return () => {
      container.innerHTML = '';
    };
  }, [blobs, morphSpeed]);

  return (
    <div 
      ref={containerRef}
      className="absolute inset-0 pointer-events-none overflow-hidden"
    />
  );
};

// 6. Grid Matrix Animation
const GridMatrix = ({ gridSize = 20, animationSpeed = 8 }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const cellSize = 100 / gridSize;

    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        const cell = document.createElement('div');
        
        cell.style.cssText = `
          position: absolute;
          width: ${cellSize}%;
          height: ${cellSize}%;
          border: 1px solid ${colors.border}30;
          left: ${col * cellSize}%;
          top: ${row * cellSize}%;
          background: ${Math.random() > 0.8 ? colors.lightBG2 + '20' : 'transparent'};
          transition: all 0.3s ease;
        `;
        container.appendChild(cell);

        // GSAP staggered animation:
        // gsap.to(cell, {
        //   backgroundColor: `${colors.cardBG}40`,
        //   duration: animationSpeed,
        //   repeat: -1,
        //   yoyo: true,
        //   delay: (row + col) * 0.1,
        //   ease: "power2.inOut"
        // });
      }
    }

    return () => {
      container.innerHTML = '';
    };
  }, [gridSize, animationSpeed]);

  return (
    <div 
      ref={containerRef}
      className="absolute inset-0 pointer-events-none overflow-hidden"
    />
  );
};

// 7. Spiral Animation
const SpiralAnimation = ({ spirals = 3, rotationSpeed = 25 }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    for (let i = 0; i < spirals; i++) {
      const spiral = document.createElement('div');
      const radius = 100 + i * 80;
      
      spiral.style.cssText = `
        position: absolute;
        width: ${radius}px;
        height: ${radius}px;
        border: 2px solid ${colors.border}40;
        border-top-color: ${colors.lightBG2}80;
        border-radius: 50%;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        opacity: 0.6;
      `;
      container.appendChild(spiral);

      // GSAP rotation animation:
      // gsap.to(spiral, {
      //   rotation: 360,
      //   duration: rotationSpeed + i * 5,
      //   repeat: -1,
      //   ease: "none"
      // });
    }

    return () => {
      container.innerHTML = '';
    };
  }, [spirals, rotationSpeed]);

  return (
    <div 
      ref={containerRef}
      className="absolute inset-0 pointer-events-none overflow-hidden"
    />
  );
};

// Demo Component showing all animations
const AnimationShowcase = () => {
  return (
    <div className="w-full h-screen bg-gray-50">
      <div className="grid grid-cols-2 lg:grid-cols-4 h-full">
        
        {/* Floating Orbs */}
        <div className="relative border border-gray-200 overflow-hidden">
          <FloatingOrbs density={10} speed={15} />
          <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-lg text-sm font-medium">
            Floating Orbs
          </div>
        </div>

        {/* Geometric Pattern */}
        <div className="relative border border-gray-200 overflow-hidden">
          <GeometricPattern complexity={15} />
          <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-lg text-sm font-medium">
            Geometric Pattern
          </div>
        </div>

        {/* Wave Pattern */}
        <div className="relative border border-gray-200 overflow-hidden">
          <WavePattern waves={4} />
          <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-lg text-sm font-medium">
            Wave Pattern
          </div>
        </div>

        {/* Particle System */}
        <div className="relative border border-gray-200 overflow-hidden">
          <ParticleSystem particles={30} speed={10} />
          <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-lg text-sm font-medium">
            Particle System
          </div>
        </div>

        {/* Morphing Blobs */}
        <div className="relative border border-gray-200 overflow-hidden">
          <MorphingBlobs blobs={5} morphSpeed={8} />
          <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-lg text-sm font-medium">
            Morphing Blobs
          </div>
        </div>

        {/* Grid Matrix */}
        <div className="relative border border-gray-200 overflow-hidden">
          <GridMatrix gridSize={12} animationSpeed={6} />
          <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-lg text-sm font-medium">
            Grid Matrix
          </div>
        </div>

        {/* Spiral Animation */}
        <div className="relative border border-gray-200 overflow-hidden">
          <SpiralAnimation spirals={2} rotationSpeed={20} />
          <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-lg text-sm font-medium">
            Spiral Animation
          </div>
        </div>

        {/* Combined Example */}
        <div className="relative border border-gray-200 overflow-hidden">
          <FloatingOrbs density={5} speed={20} />
          <GeometricPattern complexity={8} />
          <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-lg text-sm font-medium">
            Combined
          </div>
        </div>

      </div>
    </div>
  );
};

export default AnimationShowcase;

// Export individual components for use
export {
  FloatingOrbs,
  GeometricPattern, 
  WavePattern,
  ParticleSystem,
  MorphingBlobs,
  GridMatrix,
  SpiralAnimation
};