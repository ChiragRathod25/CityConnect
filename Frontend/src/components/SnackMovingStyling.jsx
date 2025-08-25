import { useEffect, useRef } from 'react';
import SignupPage from '../Pages/Signup/Signup';
import LoginPage from '../Pages/Login/Login';

export const SnakeAnimatedBackground = ({ 
  intensity = 'medium', // 'low', 'medium', 'high'
  theme = 'gray', // 'gray', 'silver', 'charcoal'
  style = 'modern' // 'modern', 'minimal', 'elegant'
}) => {
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

    // Intensity settings
    const intensityConfig = {
      low: { snakes: 3, trailLength: 15, speed: 0.8, particles: 20 },
      medium: { snakes: 5, trailLength: 25, speed: 1.2, particles: 35 },
      high: { snakes: 8, trailLength: 40, speed: 1.8, particles: 50 }
    };

    const config = intensityConfig[intensity];

    // Gray theme colors for white background
    const themes = {
      gray: {
        primary: [75, 85, 99], // gray-600
        secondary: [156, 163, 175], // gray-400
        accent: [107, 114, 128] // gray-500
      },
      silver: {
        primary: [100, 116, 139], // slate-500
        secondary: [148, 163, 184], // slate-400
        accent: [71, 85, 105] // slate-600
      },
      charcoal: {
        primary: [55, 65, 81], // gray-700
        secondary: [107, 114, 128], // gray-500
        accent: [31, 41, 55] // gray-800
      }
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
            opacity: 0.8 - (i / this.trailLength * 0.6), // Adjust opacity for white bg
            size: this.segmentSize * (1 - i / this.trailLength * 0.5)
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
          size: this.segmentSize
        });

        // Remove tail if too long
        if (this.segments.length > this.trailLength) {
          this.segments.pop();
        }

        // Update segment properties
        this.segments.forEach((segment, index) => {
          segment.opacity = 0.8 - (index / this.trailLength * 0.6);
          segment.size = this.segmentSize * (1 - index / this.trailLength * 0.5);
        });
      }

      changeDirection() {
        const directions = [
          { x: 1, y: 0 },   // right
          { x: -1, y: 0 },  // left
          { x: 0, y: 1 },   // down
          { x: 0, y: -1 },  // up
          { x: 1, y: 1 },   // diagonal down-right
          { x: -1, y: -1 }, // diagonal up-left
          { x: 1, y: -1 },  // diagonal up-right
          { x: -1, y: 1 }   // diagonal down-left
        ];
        
        this.direction = directions[Math.floor(Math.random() * directions.length)];
      }

      draw() {
        this.segments.forEach((segment, index) => {
          const [r, g, b] = index === 0 ? currentTheme.primary : 
                           index < 5 ? currentTheme.secondary : currentTheme.accent;
          const color = `rgba(${r}, ${g}, ${b}, ${segment.opacity})`;

          // Draw segment with subtle shadow for depth
          if (style === 'modern') {
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
          if (style === 'modern' && index < 3) {
            const highlightGradient = ctx.createRadialGradient(
              segment.x - segment.size * 0.3, 
              segment.y - segment.size * 0.3, 
              0,
              segment.x, segment.y, 
              segment.size
            );
            highlightGradient.addColorStop(0, `rgba(255, 255, 255, ${segment.opacity * 0.4})`);
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
      ctx.fillStyle = 'rgba(255, 255, 255, 0.15)'; // Light fade for trail effect
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update and draw snakes
      snakes.forEach(snake => {
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
      if (style === 'modern') {
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
      window.removeEventListener('resize', setCanvasSize);
    };
  }, [intensity, theme, style]);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ 
          background: style === 'minimal' 
            ? '#ffffff'
            : style === 'elegant'
            ? 'linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)'
            : 'linear-gradient(135deg, #ffffff 0%, #f8fafc 50%, #f1f5f9 100%)'
        }}
      />
      
      {/* Additional overlay effects for white background */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Subtle texture overlay */}
        {style === 'elegant' && (
          <div 
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: `
                radial-gradient(circle at 1px 1px, rgba(0,0,0,0.1) 1px, transparent 0)
              `,
              backgroundSize: '20px 20px'
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

// Example usage component
const ExamplePage = () => {
  return (
    <div className="relative min-h-screen">
      {/* Snake Animated Background - Just call the component! */}
      <SnakeAnimatedBackground 
        intensity="medium" 
        theme="gray" 
        style="modern" 
      />

    
      
      {/* Your page content */}
      <div className="relative z-10 flex items-center justify-center min-w-lg min-h-screen">
        <div className=" py-10  md:py-20 px-4">
      <SignupPage/>
        </div>
      </div>
    </div>
  );
};

export default ExamplePage;


export const ExamplePage2 = () => {
  return (
    <div className="relative min-h-screen">
      {/* Snake Animated Background - Just call the component! */}
      <SnakeAnimatedBackground 
        intensity="medium" 
        theme="gray" 
        style="modern" 
      />


      
      {/* Your page content */}
      <div className="relative z-10 flex items-center justify-center min-w-lg min-h-screen">
        <div className="py-10  md:py-20 px-4">
          <LoginPage/>
        </div>
      </div>
    </div>
  );
};
