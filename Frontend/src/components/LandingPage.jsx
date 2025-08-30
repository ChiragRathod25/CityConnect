import React, {
  useState,
  useEffect,
  useRef,
  Children,
  cloneElement,
  forwardRef,
  isValidElement,
  useMemo,
} from "react";
import {
  ChevronDown,
  Play,
  Star,
  MapPin,
  Users,
  Briefcase,
  Heart,
  Quote,
  ArrowRight,
  Menu,
  X,
} from "lucide-react";

// Color Palette - Gray/Black Theme
const colors = {
  darkBg: "#0a0a0a",
  charcoal: "#1a1a1a",
  darkGray: "#2a2a2a",
  mediumGray: "#404040",
  lightGray: "#666666",
  silver: "#888888",
  lightSilver: "#aaaaaa",
  platinum: "#cccccc",
  smoke: "#e5e5e5",
  white: "#ffffff",
  accent: "#3b82f6",
  accentDark: "#1e40af",
};

// Video Animation Component
const VideoAnimation = ({ scrollY }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
        if (entry.isIntersecting && !isPlaying) {
          videoRef.current?.play();
          setIsPlaying(true);
        }
      },
      { threshold: 0.3 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [isPlaying]);

  // Create animated video-like effect with canvas
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let animationId;
    let time = 0;

    const animate = () => {
      time += 0.02;
      ctx.fillStyle = colors.darkBg;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Create animated network nodes
      const nodes = 12;
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const radius = Math.min(canvas.width, canvas.height) * 0.3;

      // Draw connections
      ctx.strokeStyle = colors.accent + "40";
      ctx.lineWidth = 2;
      for (let i = 0; i < nodes; i++) {
        for (let j = i + 1; j < nodes; j++) {
          const angle1 = (i / nodes) * Math.PI * 2 + time;
          const angle2 = (j / nodes) * Math.PI * 2 + time;
          const x1 = centerX + Math.cos(angle1) * radius;
          const y1 = centerY + Math.sin(angle1) * radius;
          const x2 = centerX + Math.cos(angle2) * radius;
          const y2 = centerY + Math.sin(angle2) * radius;

          if (Math.random() < 0.3) {
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
          }
        }
      }

      // Draw nodes
      for (let i = 0; i < nodes; i++) {
        const angle = (i / nodes) * Math.PI * 2 + time;
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;

        ctx.fillStyle = colors.accent;
        ctx.beginPath();
        ctx.arc(x, y, 6, 0, Math.PI * 2);
        ctx.fill();

        // Glow effect
        ctx.shadowBlur = 20;
        ctx.shadowColor = colors.accent;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // Central pulse
      const pulseRadius = 20 + Math.sin(time * 2) * 10;
      const gradient = ctx.createRadialGradient(
        centerX,
        centerY,
        0,
        centerX,
        centerY,
        pulseRadius
      );
      gradient.addColorStop(0, colors.accent + "80");
      gradient.addColorStop(1, colors.accent + "00");

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, pulseRadius, 0, Math.PI * 2);
      ctx.fill();

      animationId = requestAnimationFrame(animate);
    };

    if (isVisible) {
      canvas.width = 600;
      canvas.height = 400;
      animate();
    }

    return () => {
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, [isVisible]);

  return (
    <div ref={containerRef} className="relative">
      <div
        className="relative overflow-hidden rounded-2xl border-2"
        style={{ borderColor: colors.mediumGray }}
      >
        <canvas
          ref={canvasRef}
          className="w-full h-full object-cover transition-all duration-1000"
          style={{
            background: colors.charcoal,
            transform: isVisible ? "scale(1)" : "scale(0.95)",
            opacity: isVisible ? 1 : 0.7,
          }}
        />

        {/* Overlay UI */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4">
          <div className="flex items-center justify-between">
            <div>
              <h3
                className="text-lg font-semibold"
                style={{ color: colors.white }}
              >
                Local Network in Action
              </h3>
              <p className="text-sm" style={{ color: colors.lightSilver }}>
                Watch businesses connect and grow together
              </p>
            </div>
            <div className="w-10 h-10 rounded-full bg-black/50 flex items-center justify-center">
              <Play className="w-5 h-5" style={{ color: colors.white }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// GSAP Card Component
export const Card = forwardRef(({ customClass, ...rest }, ref) => (
  <div
    ref={ref}
    {...rest}
    className={`absolute top-1/2 left-1/2 rounded-xl border border-white bg-black [transform-style:preserve-3d] [will-change:transform] [backface-visibility:hidden] ${
      customClass ?? ""
    } ${rest.className ?? ""}`.trim()}
  />
));
Card.displayName = "Card";

// GSAP CardSwap Component
const CardSwap = ({
  width = 300,
  height = 200,
  cardDistance = 40,
  verticalDistance = 50,
  delay = 3000,
  pauseOnHover = true,
  onCardClick,
  skewAmount = 4,
  children,
}) => {
  const childArr = useMemo(() => Children.toArray(children), [children]);
  const refs = useMemo(
    () => childArr.map(() => React.createRef()),
    [childArr.length]
  );
  const order = useRef(Array.from({ length: childArr.length }, (_, i) => i));
  const container = useRef(null);
  const intervalRef = useRef();

  // Simple animation without GSAP dependency
  useEffect(() => {
    const total = refs.length;

    // Initial positioning
    refs.forEach((ref, i) => {
      if (ref.current) {
        const slot = {
          x: i * cardDistance,
          y: -i * verticalDistance,
          z: -i * cardDistance * 1.5,
          zIndex: total - i,
        };

        Object.assign(ref.current.style, {
          transform: `translate(-50%, -50%) translate3d(${slot.x}px, ${slot.y}px, ${slot.z}px) skewY(${skewAmount}deg)`,
          zIndex: slot.zIndex,
          transition: "all 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
        });
      }
    });

    const swap = () => {
      if (order.current.length < 2) return;

      const [front, ...rest] = order.current;
      const frontEl = refs[front].current;

      if (frontEl) {
        // Animate front card out
        frontEl.style.transform = `translate(-50%, -50%) translate3d(0px, 500px, 0px)`;

        setTimeout(() => {
          // Move other cards forward
          rest.forEach((idx, i) => {
            const el = refs[idx].current;
            if (el) {
              const slot = {
                x: i * cardDistance,
                y: -i * verticalDistance,
                z: -i * cardDistance * 1.5,
                zIndex: total - i,
              };

              el.style.zIndex = slot.zIndex;
              el.style.transform = `translate(-50%, -50%) translate3d(${slot.x}px, ${slot.y}px, ${slot.z}px) skewY(${skewAmount}deg)`;
            }
          });

          // Move front card to back
          const backSlot = {
            x: (total - 1) * cardDistance,
            y: -(total - 1) * verticalDistance,
            z: -(total - 1) * cardDistance * 1.5,
            zIndex: 1,
          };

          frontEl.style.zIndex = backSlot.zIndex;
          frontEl.style.transform = `translate(-50%, -50%) translate3d(${backSlot.x}px, ${backSlot.y}px, ${backSlot.z}px) skewY(${skewAmount}deg)`;

          order.current = [...rest, front];
        }, 400);
      }
    };

    intervalRef.current = setInterval(swap, delay);

    if (pauseOnHover && container.current) {
      const pause = () => clearInterval(intervalRef.current);
      const resume = () => {
        clearInterval(intervalRef.current);
        intervalRef.current = setInterval(swap, delay);
      };

      container.current.addEventListener("mouseenter", pause);
      container.current.addEventListener("mouseleave", resume);
    }

    return () => clearInterval(intervalRef.current);
  }, [
    cardDistance,
    verticalDistance,
    delay,
    pauseOnHover,
    skewAmount,
    refs.length,
  ]);

  const rendered = childArr.map((child, i) =>
    isValidElement(child)
      ? cloneElement(child, {
          key: i,
          ref: refs[i],
          style: { width, height, ...(child.props.style ?? {}) },
          onClick: (e) => {
            child.props.onClick?.(e);
            onCardClick?.(i);
          },
        })
      : child
  );

  return (
    <div
      ref={container}
      className="relative w-full h-96 flex items-center justify-center"
      style={{ perspective: "900px" }}
    >
      {rendered}
    </div>
  );
};

// Glass Surface Component
const GlassSurface = ({ children, className, ...props }) => (
  <div
    className={`backdrop-blur-xl border border-opacity-20 shadow-2xl ${className}`}
    style={{
      background: `rgba(42, 42, 42, 0.3)`,
      border: `1px solid ${colors.mediumGray}`,
      borderRadius: "16px",
    }}
  >
    {children}
  </div>
);

// Fade In Animation
const FadeInSection = ({ children, delay = 0, className }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 ease-out ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      } ${className}`}
    >
      {children}
    </div>
  );
};

// Animated Testimonials Component
const AnimatedTestimonials = ({ testimonials }) => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  return (
    <div className="relative h-96 overflow-hidden rounded-2xl">
      {testimonials.map((testimonial, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-all duration-700 ease-in-out ${
            index === current
              ? "opacity-100 translate-x-0"
              : index < current
              ? "opacity-0 -translate-x-full"
              : "opacity-0 translate-x-full"
          }`}
        >
          <GlassSurface className="h-full p-8 flex flex-col justify-center">
            <div className="flex items-start space-x-4">
              <img
                src={testimonial.src}
                alt={testimonial.name}
                className="w-16 h-16 rounded-full object-cover border-2"
                style={{ borderColor: colors.mediumGray }}
              />
              <div className="flex-1">
                <Quote
                  className="w-8 h-8 mb-4"
                  style={{ color: colors.accent }}
                />
                <blockquote
                  className="text-lg mb-4 italic leading-relaxed"
                  style={{ color: colors.lightSilver }}
                >
                  "{testimonial.quote}"
                </blockquote>
                <div>
                  <div
                    className="font-semibold"
                    style={{ color: colors.white }}
                  >
                    {testimonial.name}
                  </div>
                  <div className="text-sm" style={{ color: colors.silver }}>
                    {testimonial.designation}
                  </div>
                </div>
              </div>
            </div>
          </GlassSurface>
        </div>
      ))}

      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {testimonials.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === current ? "scale-125" : "scale-100"
            }`}
            style={{
              background: index === current ? colors.accent : colors.mediumGray,
            }}
          />
        ))}
      </div>
    </div>
  );
};

// Business Card Component
const BusinessCard = ({ business }) => (
  <div
    className="w-full h-full p-4 flex flex-col border rounded-xl overflow-hidden"
    style={{
      background: colors.charcoal,
      borderColor: colors.mediumGray,
    }}
  >
    <img
      src={business.image}
      alt={business.title}
      className="w-full h-32 object-cover rounded-lg mb-3"
    />
    <h3 className="text-lg font-bold mb-2" style={{ color: colors.white }}>
      {business.title}
    </h3>
    <p className="text-sm" style={{ color: colors.lightSilver }}>
      {business.description}
    </p>
  </div>
);

// Main Landing Page Component
export default function CityConnectLanding() {
  const [scrollY, setScrollY] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const businesses = [
    {
      id: 1,
      title: "Local Restaurants",
      image:
        "https://images.unsplash.com/photo-1556761175-b413da4baf72?q=80&w=500&auto=format",
      description: "Connect with neighborhood eateries and build partnerships",
    },
    {
      id: 2,
      title: "Service Providers",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=500&auto=format",
      description: "Find trusted local services and professionals",
    },
    {
      id: 3,
      title: "Retail Stores",
      image:
        "https://images.unsplash.com/photo-1554774853-719586f82d77?q=80&w=500&auto=format",
      description: "Discover unique local shops and boutiques",
    },
    {
      id: 4,
      title: "Professional Services",
      image:
        "https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?q=80&w=500&auto=format",
      description: "Network with local business professionals",
    },
  ];

  const testimonials = [
    {
      quote:
        "The attention to detail and innovative features have completely transformed our workflow. This is exactly what we've been looking for.",
      name: "Sarah Chen",
      designation: "Product Manager at TechFlow",
      src: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=3560&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      quote:
        "Implementation was seamless and the results exceeded our expectations. The platform's flexibility is remarkable.",
      name: "Michael Rodriguez",
      designation: "CTO at InnovateSphere",
      src: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      quote:
        "This solution has significantly improved our team's productivity. The intuitive interface makes complex tasks simple.",
      name: "Emily Watson",
      designation: "Operations Director at CloudScale",
      src: "https://images.unsplash.com/photo-1623582854588-d60de57fa33f?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className="relative min-h-screen"
      style={{ background: colors.darkBg }}
    >
      {/* Splash Cursor */}
      {/* <SplashCursor /> */}

      {/* Navbar */}
      <nav
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
          isScrolled ? "py-2" : "py-4"
        }`}
      >
        <GlassSurface
          className={`mx-4 px-6 transition-all duration-500 ${
            isScrolled ? "py-2" : "py-4"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: colors.accent }}
              >
                <MapPin className="w-5 h-5" style={{ color: colors.white }} />
              </div>
              <span
                className="text-2xl font-bold"
                style={{ color: colors.white }}
              >
                CityConnect
              </span>
            </div>

            <div className="hidden md:flex space-x-4">
              <button
                onClick={() => setShowAuthModal(true)}
                className="px-6 py-2 rounded-full border transition-all duration-300 hover:scale-105"
                style={{
                  background: `rgba(42, 42, 42, 0.5)`,
                  color: colors.white,
                  borderColor: colors.mediumGray,
                }}
              >
                Login
              </button>
              <button
                onClick={() => setShowAuthModal(true)}
                className="px-6 py-2 rounded-full hover:shadow-lg transition-all duration-300 hover:scale-105"
                style={{
                  background: colors.accent,
                  color: colors.white,
                }}
              >
                Sign Up
              </button>
            </div>

            <button
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{ color: colors.white }}
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>

          {mobileMenuOpen && (
            <div
              className="md:hidden mt-4 pt-4 border-t"
              style={{ borderColor: colors.mediumGray }}
            >
              <div className="flex flex-col space-y-2">
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="px-6 py-2 rounded-full border transition-all duration-300"
                  style={{
                    background: `rgba(42, 42, 42, 0.5)`,
                    color: colors.white,
                    borderColor: colors.mediumGray,
                  }}
                >
                  Login
                </button>
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="px-6 py-2 rounded-full hover:shadow-lg transition-all duration-300"
                  style={{
                    background: colors.accent,
                    color: colors.white,
                  }}
                >
                  Sign Up
                </button>
              </div>
            </div>
          )}
        </GlassSurface>
      </nav>

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center relative pt-24">
        <div className="text-center px-6 max-w-6xl mx-auto">
          <FadeInSection>
            <div
              className="text-8xl md:text-9xl font-black mb-4"
              style={{
                color: colors.white,
                transform: `translateY(${scrollY * 0.2}px)`,
              }}
            >
              Connect Local
            </div>
            <div
              className="text-6xl md:text-7xl font-bold mb-8"
              style={{
                color: colors.accent,
                transform: `translateY(${scrollY * 0.3}px)`,
              }}
            >
              Grow Together
            </div>
          </FadeInSection>

          <FadeInSection delay={300}>
            <GlassSurface className="max-w-2xl mx-auto p-8 mb-12">
              <p
                className="text-xl leading-relaxed"
                style={{ color: colors.lightSilver }}
              >
                Join thousands of local businesses building stronger
                communities. Connect, collaborate, and grow your business with
                neighbors who matter.
              </p>
            </GlassSurface>
          </FadeInSection>

          <FadeInSection delay={600}>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <button
                onClick={() => setShowAuthModal(true)}
                className="px-12 py-4 text-lg font-semibold rounded-full hover:shadow-2xl transition-all duration-500 transform hover:scale-105"
                style={{
                  background: colors.accent,
                  color: colors.white,
                }}
              >
                Get Started Today
                <ArrowRight className="inline-block ml-2 w-5 h-5" />
              </button>

              <div
                className="flex items-center space-x-4"
                style={{ color: colors.silver }}
              >
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-10 h-10 rounded-full border-2"
                      style={{
                        background: colors.mediumGray,
                        borderColor: colors.lightGray,
                      }}
                    />
                  ))}
                </div>
                <span className="text-sm">Join 10,000+ local businesses</span>
              </div>
            </div>
          </FadeInSection>

          <div
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce"
            style={{ transform: `translate(-50%, ${scrollY * 0.3}px)` }}
          >
            <ChevronDown className="w-8 h-8" style={{ color: colors.silver }} />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <FadeInSection>
            <div className="text-center mb-16">
              <h2
                className="text-5xl font-bold mb-6"
                style={{ color: colors.white }}
              >
                Why Choose CityConnect?
              </h2>
              <p
                className="text-xl max-w-2xl mx-auto"
                style={{ color: colors.lightSilver }}
              >
                Everything you need to build meaningful local business
                relationships
              </p>
            </div>
          </FadeInSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Users className="w-12 h-12" />,
                title: "Local Network",
                description:
                  "Connect with businesses in your neighborhood and build lasting partnerships",
              },
              {
                icon: <Briefcase className="w-12 h-12" />,
                title: "Business Growth",
                description:
                  "Expand your reach and discover new opportunities in your local market",
              },
              {
                icon: <Heart className="w-12 h-12" />,
                title: "Community Impact",
                description:
                  "Make a difference in your community while growing your business",
              },
            ].map((feature, index) => (
              <FadeInSection key={index} delay={index * 200}>
                <GlassSurface className="p-8 h-full hover:scale-105 transition-all duration-500">
                  <div style={{ color: colors.accent }} className="mb-6">
                    {feature.icon}
                  </div>
                  <h3
                    className="text-2xl font-bold mb-4"
                    style={{ color: colors.white }}
                  >
                    {feature.title}
                  </h3>
                  <p
                    className="leading-relaxed"
                    style={{ color: colors.lightSilver }}
                  >
                    {feature.description}
                  </p>
                </GlassSurface>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* Video Animation Section */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <FadeInSection>
              <div>
                <h2
                  className="text-5xl font-bold mb-6"
                  style={{ color: colors.white }}
                >
                  See Local Networks Come Alive
                </h2>
                <p
                  className="text-xl mb-8"
                  style={{ color: colors.lightSilver }}
                >
                  Watch how businesses in your area connect, collaborate, and
                  create opportunities together. Real connections, real growth,
                  real community impact.
                </p>

                <div className="space-y-4">
                  {[
                    "Real-time business connections",
                    "Community-driven growth",
                    "Seamless networking experience",
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ background: colors.accent }}
                      />
                      <span style={{ color: colors.lightSilver }}>
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </FadeInSection>

            <FadeInSection delay={300}>
              <VideoAnimation scrollY={scrollY} />
            </FadeInSection>
          </div>
        </div>
      </section>

      {/* Business CardSwap Section */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <FadeInSection>
            <div className="text-center mb-16">
              <h2
                className="text-5xl font-bold mb-6"
                style={{ color: colors.white }}
              >
                Local Businesses Love Us
              </h2>
              <p
                className="text-xl mb-8 max-w-3xl mx-auto"
                style={{ color: colors.lightSilver }}
              >
                From cafes to consultancies, restaurants to retail - businesses
                of all types are thriving with CityConnect's local networking
                platform.
              </p>
            </div>
          </FadeInSection>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1">
              <FadeInSection delay={300}>
                <div className="space-y-6">
                  {[
                    {
                      number: "10K+",
                      label: "Active local businesses",
                      icon: <Users className="w-6 h-6" />,
                    },
                    {
                      number: "50+",
                      label: "Cities and growing",
                      icon: <MapPin className="w-6 h-6" />,
                    },
                    {
                      number: "95%",
                      label: "Customer satisfaction",
                      icon: <Star className="w-6 h-6" />,
                    },
                  ].map((stat, index) => (
                    <div key={index} className="flex items-center space-x-4">
                      <div style={{ color: colors.accent }}>{stat.icon}</div>
                      <div>
                        <div
                          className="text-3xl font-bold"
                          style={{ color: colors.accent }}
                        >
                          {stat.number}
                        </div>
                        <div
                          className="text-sm"
                          style={{ color: colors.silver }}
                        >
                          {stat.label}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </FadeInSection>
            </div>

            <div className="order-1 lg:order-2">
              <FadeInSection delay={600}>
                <CardSwap
                  width={300}
                  height={200}
                  cardDistance={40}
                  verticalDistance={50}
                  delay={4000}
                  pauseOnHover={true}
                  skewAmount={4}
                >
                  {businesses.map((business) => (
                    <Card key={business.id}>
                      <BusinessCard business={business} />
                    </Card>
                  ))}
                </CardSwap>
              </FadeInSection>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <FadeInSection>
            <div className="text-center mb-16">
              <h2
                className="text-5xl font-bold mb-6"
                style={{ color: colors.white }}
              >
                What Our Community Says
              </h2>
              <p className="text-xl" style={{ color: colors.lightSilver }}>
                Real stories from real businesses in our network
              </p>
            </div>
          </FadeInSection>

          <FadeInSection delay={300}>
            <AnimatedTestimonials testimonials={testimonials} />
          </FadeInSection>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <FadeInSection>
            <GlassSurface className="p-12 text-center">
              <h2
                className="text-5xl font-bold mb-8"
                style={{ color: colors.white }}
              >
                Ready to Connect?
              </h2>

              <p
                className="text-xl mb-8 max-w-2xl mx-auto"
                style={{ color: colors.lightSilver }}
              >
                Join thousands of local businesses already growing together.
                Your community is waiting for you.
              </p>

              <button
                onClick={() => setShowAuthModal(true)}
                className="px-16 py-5 text-xl font-bold rounded-full hover:shadow-2xl transition-all duration-500 transform hover:scale-105"
                style={{
                  background: colors.accent,
                  color: colors.white,
                }}
              >
                Start Connecting Today
                <ArrowRight className="inline-block ml-3 w-6 h-6" />
              </button>
            </GlassSurface>
          </FadeInSection>
        </div>
      </section>

      {/* Footer */}
      <footer
        className="py-16 px-6"
        style={{ borderTop: `1px solid ${colors.darkGray}` }}
      >
        <FadeInSection>
          <GlassSurface className="max-w-7xl mx-auto p-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ background: colors.accent }}
                  >
                    <MapPin
                      className="w-5 h-5"
                      style={{ color: colors.white }}
                    />
                  </div>
                  <span
                    className="text-2xl font-bold"
                    style={{ color: colors.white }}
                  >
                    CityConnect
                  </span>
                </div>
                <p style={{ color: colors.lightSilver }}>
                  Connecting local businesses, building stronger communities.
                </p>
              </div>

              {[
                {
                  title: "Platform",
                  links: [
                    "How it Works",
                    "Features",
                    "Pricing",
                    "Success Stories",
                  ],
                },
                {
                  title: "Support",
                  links: ["Help Center", "Contact", "Community", "Resources"],
                },
                {
                  title: "Company",
                  links: ["About", "Blog", "Careers", "Press"],
                },
              ].map((section, index) => (
                <div key={index}>
                  <h4
                    className="font-semibold mb-4"
                    style={{ color: colors.white }}
                  >
                    {section.title}
                  </h4>
                  <ul className="space-y-2">
                    {section.links.map((link, linkIndex) => (
                      <li key={linkIndex}>
                        <a
                          href="#"
                          className="transition-colors duration-200 hover:underline"
                          style={{
                            color: colors.lightSilver,
                            textDecoration: "none",
                          }}
                          onMouseEnter={(e) =>
                            (e.target.style.color = colors.white)
                          }
                          onMouseLeave={(e) =>
                            (e.target.style.color = colors.lightSilver)
                          }
                        >
                          {link}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div
              className="mt-8 pt-8 text-center"
              style={{ borderTop: `1px solid ${colors.darkGray}` }}
            >
              <p style={{ color: colors.silver }}>
                © 2025 CityConnect. All rights reserved. Built with passion for
                local communities.
              </p>
            </div>
          </GlassSurface>
        </FadeInSection>
      </footer>

      {/* Auth Modal */}
      {showAuthModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0, 0, 0, 0.8)" }}
          onClick={() => setShowAuthModal(false)}
        >
          <GlassSurface
            className="w-full max-w-md p-8 relative transform scale-100 transition-all duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center mb-6">
              <h2
                className="text-3xl font-bold mb-2"
                style={{ color: colors.white }}
              >
                Welcome to CityConnect
              </h2>
              <p style={{ color: colors.lightSilver }}>
                Join your local business community
              </p>
            </div>

            <div className="space-y-4">
              <button
                className="w-full py-3 rounded-full font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105"
                style={{
                  background: colors.accent,
                  color: colors.white,
                }}
              >
                Sign Up Now
              </button>
              <button
                className="w-full py-3 rounded-full font-semibold border transition-all duration-300 hover:scale-105"
                style={{
                  background: `rgba(42, 42, 42, 0.5)`,
                  color: colors.white,
                  borderColor: colors.mediumGray,
                }}
              >
                Login Instead
              </button>
            </div>

            <button
              onClick={() => setShowAuthModal(false)}
              className="absolute top-4 right-4 transition-colors duration-200 hover:bg-gray-700 p-2 rounded-full"
              style={{ color: colors.lightSilver }}
            >
              <X className="w-5 h-5" />
            </button>
          </GlassSurface>
        </div>
      )}
    </div>
  );
}
