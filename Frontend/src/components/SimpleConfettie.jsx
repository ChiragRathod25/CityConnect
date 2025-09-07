import { useEffect, useState } from "react";

const Confetti = ({ trigger }) => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    if (trigger) {
      const newParticles = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        x: Math.random() * window.innerWidth,
        y: -10,
        vx: (Math.random() - 0.5) * 4,
        vy: Math.random() * 3 + 2,
        color: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'][Math.floor(Math.random() * 5)],
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 10
      }));
      setParticles(newParticles);

      const animateParticles = () => {
        setParticles(prevParticles => 
          prevParticles.map(particle => ({
            ...particle,
            x: particle.x + particle.vx,
            y: particle.y + particle.vy,
            vy: particle.vy + 0.1,
            rotation: particle.rotation + particle.rotationSpeed
          })).filter(particle => particle.y < window.innerHeight + 10)
        );
      };

      const interval = setInterval(animateParticles, 16);
      setTimeout(() => {
        clearInterval(interval);
        setParticles([]);
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [trigger]);

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {particles.map(particle => (
        <div
          key={particle.id}
          className="absolute w-2 h-2 rounded-sm"
          style={{
            left: particle.x,
            top: particle.y,
            backgroundColor: particle.color,
            transform: `rotate(${particle.rotation}deg)`
          }}
        />
      ))}
    </div>
  );
};

export default Confetti;