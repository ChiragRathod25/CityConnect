import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  MapPin, 
  Star, 
  CheckCircle, 
  ArrowRight, 
  Menu, 
  X, 
  Utensils, 
  Scissors, 
  Shield,
  Clock,
  CreditCard,
  Users,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Play,
  Zap,
  HardHat,
  Car,
  Stethoscope,
  PenTool,
  Sparkles
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Enhanced Animated List Component
const AnimatedList = ({ children, delay = 2000, className = "" }) => {
  const [index, setIndex] = useState(0);
  const childrenArray = React.Children.toArray(children);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % childrenArray.length);
    }, delay);

    return () => clearInterval(interval);
  }, [childrenArray.length, delay]);

  const itemsToShow = childrenArray.slice(0, index + 1).slice(-3);

  return (
    <div className={`flex flex-col items-center gap-4 ${className}`}>
      {itemsToShow.map((item, idx) => (
        <div
          key={idx}
          className="w-full animate-slide-up opacity-0"
          style={{
            animation: `slideUp 0.6s ease-out ${idx * 0.15}s forwards`,
          }}
        >
          {item}
        </div>
      ))}
    </div>
  );
};

// Enhanced Marquee component
const Marquee = ({ children, speed = 50 }) => {
  return (
    <div className="overflow-hidden whitespace-nowrap">
      <div 
        className="inline-block animate-marquee"
        style={{
          animation: `marquee ${speed}s linear infinite`
        }}
      >
        {children}
      </div>
    </div>
  );
};

// Enhanced Animated gradient text
const AnimatedGradientText = ({ children, className = "" }) => {
  return (
    <span className={`bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 bg-clip-text text-transparent animate-gradient bg-[length:200%_200%] ${className}`}>
      {children}
    </span>
  );
};

// Enhanced Tilted card component with better 3D effect
const TiltedCard = ({ children, className = "" }) => {
  const [transform, setTransform] = useState('');
  
  const handleMouseMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (y - centerY) / 6;
    const rotateY = (centerX - x) / 6;
    
    setTransform(`perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`);
  };
  
  const handleMouseLeave = () => {
    setTransform('perspective(1200px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)');
  };
  
  return (
    <div
      className={`transition-all duration-300 ease-out ${className}`}
      style={{ transform }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </div>
  );
};

// iPhone 15 Pro Mockup Component
const iPhone15Mockup = ({ children, className = "" }) => {
  return (
    <div className={`relative ${className}`}>
      {/* Glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-green-500/30 to-blue-500/30 rounded-[60px] blur-2xl scale-110"></div>
      
      {/* Phone frame */}
      <div className="relative bg-gradient-to-br from-gray-800 to-gray-900 p-2 rounded-[60px] shadow-2xl">
        {/* Dynamic Island */}
        <div className="absolute top-6 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-black rounded-full z-20"></div>
        
        {/* Screen */}
        <div className="bg-black rounded-[50px] overflow-hidden w-[280px] h-[600px] relative">
          {/* Status bar */}
          <div className="absolute top-0 left-0 right-0 h-12 bg-black z-10 flex items-center justify-between px-6 text-white text-sm">
            <span>9:41</span>
            <div className="flex items-center space-x-1">
              <div className="w-4 h-2 border border-white rounded-sm">
                <div className="w-full h-full bg-green-500 rounded-sm"></div>
              </div>
            </div>
          </div>
          
          {/* Content area */}
          <div className="pt-12 h-full">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

// MacBook Pro Mockup Component
const MacBookMockup = ({ children, className = "" }) => {
  return (
    <div className={`relative ${className}`}>
      {/* Glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-3xl blur-3xl scale-110"></div>
      
     
      <div className="relative">
    
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-4 rounded-2xl shadow-2xl">
        
          <div className="bg-black rounded-xl overflow-hidden aspect-[16/10] relative">
            
            <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-700 rounded-full z-10"></div>
            
            <div className="w-full h-full">
              {children}
            </div>
          </div>
        </div>
        
        {/* Base */}
        <div className="bg-gradient-to-br from-gray-700 to-gray-800 h-4 rounded-b-3xl transform perspective-1000 rotateX-12 shadow-lg"></div>
        
        {/* Reflection */}
        <div className="absolute inset-0 bg-gradient-to-t from-white/5 to-transparent rounded-2xl pointer-events-none"></div>
      </div>
    </div>
  );
};


const OrbitingCircles = ({ children }) => {
  return (
    <div className="relative flex items-center justify-center">
     
      <div className="absolute inset-0">
      
        <div className="absolute inset-0 animate-spin" style={{ animationDuration: '20s' }}>
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-green-500 rounded-full shadow-lg shadow-green-500/50"></div>
        </div>
        
      
        <div className="absolute inset-4 animate-spin" style={{ animationDuration: '15s', animationDirection: 'reverse' }}>
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-blue-500 rounded-full shadow-lg shadow-blue-500/50"></div>
        </div>
        
      
        <div className="absolute inset-8 animate-spin" style={{ animationDuration: '25s' }}>
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-purple-500 rounded-full shadow-lg shadow-purple-500/50"></div>
        </div>
      </div>
      
      {children}
    </div>
  );
};


const Stepper = ({ steps, currentStep = 0 }) => {
  return (
    <div className="flex items-center justify-between w-full max-w-4xl mx-auto">
      {steps.map((step, index) => (
        <div key={index} className="flex items-center">
          <div className="flex flex-col items-center">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold transition-all duration-500 ${
              index <= currentStep ? 'bg-gradient-to-r from-green-500 to-blue-500 shadow-2xl shadow-green-500/50 scale-110' : 'bg-gray-800 border border-gray-700'
            }`}>
              {index <= currentStep ? <CheckCircle size={24} /> : index + 1}
            </div>
            <div className="mt-3 text-center">
              <div className={`font-medium transition-colors duration-300 ${index <= currentStep ? 'text-green-400' : 'text-gray-500'}`}>
                {step.title}
              </div>
              <div className="text-sm text-gray-400 max-w-[120px] mt-1">
                {step.description}
              </div>
            </div>
          </div>
          {index < steps.length - 1 && (
            <div className={`flex-1 h-1 mx-4 rounded-full transition-all duration-500 ${
              index < currentStep ? 'bg-gradient-to-r from-green-500 to-blue-500 shadow-lg shadow-green-500/50' : 'bg-gray-700'
            }`}></div>
          )}
        </div>
      ))}
    </div>
  );
};

const CityConnectLanding = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [email, setEmail] = useState('');
  const videoRef = useRef(null);

  const categories = [
    { name: "Tailor", icon: Scissors, color: "from-blue-500 to-blue-600", count: "350+ shops" },
    { name: "Cobbler", icon: HardHat, color: "from-amber-500 to-orange-500", count: "180+ craftsmen" },
    { name: "Rickshaw", icon: Car, color: "from-green-500 to-green-600", count: "500+ drivers" },
    { name: "Restaurant", icon: Utensils, color: "from-red-500 to-pink-500", count: "800+ places" },
    { name: "Medical", icon: Stethoscope, color: "from-pink-500 to-rose-500", count: "120+ centers" },
    { name: "Stationery", icon: PenTool, color: "from-purple-500 to-indigo-500", count: "200+ stores" },
    { name: "Electronics", icon: Zap, color: "from-yellow-500 to-orange-500", count: "150+ shops" },
    { name: "Beauty", icon: Sparkles, color: "from-indigo-500 to-purple-500", count: "220+ salons" },
  ];

  const services = [
    {
      title: "Real-time Location",
      description: "Track services and shops near your area in real-time.",
      icon: MapPin
    },
    {
      title: "Verified Sellers",
      description: "All businesses are verified to ensure trust and authenticity.",
      icon: Shield
    },
    {
      title: "Easy Booking",
      description: "Book appointments or services with one click.",
      icon: Clock
    },
    {
      title: "Secure Payments",
      description: "Multiple payment options with complete security.",
      icon: CreditCard
    }
  ];

  const liveUpdates = [
    {
      type: "review",
      title: "New review",
      subtitle: "5-star rating for Kumar Electronics",
      time: "2m ago",
      location: "Sayajigunj",
      icon: "⭐",
      color: "from-yellow-500 to-orange-500"
    },
    {
      type: "service",
      title: "Service request",
      subtitle: "Cobbler service needed in Area 12",
      time: "12m ago",
      location: "Area 12",
      icon: "🔧",
      color: "from-blue-500 to-cyan-500"
    },
    {
      type: "delivery",
      title: "Quick delivery",
      subtitle: "Food delivery completed in Alkapuri",
      time: "5m ago",
      location: "Alkapuri",
      icon: "🚚",
      color: "from-green-500 to-emerald-500"
    },
    {
      type: "booking",
      title: "New booking",
      subtitle: "Rickshaw booked for VIP Road",
      time: "8m ago", 
      location: "VIP Road",
      icon: "🛺",
      color: "from-purple-500 to-pink-500"
    },
    {
      type: "shop",
      title: "Shop opened",
      subtitle: "Patel Medical Store is now open",
      time: "15m ago",
      location: "Fatehgunj",
      icon: "🏪",
      color: "from-teal-500 to-cyan-500"
    }
  ];

  const testimonials = [
    {
      name: "Ravi Patel",
      role: "Local Shop Owner",
      feedback: "CityConnect helped me grow my shop's visibility. Customers can now easily find me.",
      rating: 5
    },
    {
      name: "Anjali Sharma",
      role: "Customer", 
      feedback: "I found the best local services in just a few clicks. Smooth experience!",
      rating: 5
    },
    {
      name: "Vikram Singh",
      role: "Rickshaw Driver",
      feedback: "More bookings, better income. CityConnect changed my business completely.",
      rating: 5
    }
  ];

  const steps = [
    { title: "Sign Up", description: "Create your account in seconds" },
    { title: "Explore", description: "Browse local businesses near you" },
    { title: "Connect", description: "Book services with one click" },
    { title: "Enjoy", description: "Experience seamless local commerce" }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % steps.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Auto-play video when it comes into view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && videoRef.current) {
            videoRef.current.play();
          }
        });
      },
      { threshold: 0.3 }
    );

    if (videoRef.current) {
      observer.observe(videoRef.current);
    }

    return () => observer.disconnect();
  }, []);


  const handleSubscribe = (e) => {
    e.preventDefault();
    alert('Thank you for subscribing!');
    setEmail('');
  };

  const navigate = useNavigate();

  return (
    <div className="min-h-screen hide-scrollbar h-screen overflow-y-scroll bg-black text-white relative overflow-hidden">
      {/* Content */}
      

      <div className="relative z-10">
        {/* Enhanced Navigation */}
        <nav className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-xl border-b border-gray-800/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <div className="text-2xl font-bold">
                  <AnimatedGradientText>CityConnect</AnimatedGradientText>
                </div>
              </div>
              
              <div className="hidden md:block">
                <div className="flex items-center space-x-8">
                  <a href="#features" className="text-gray-300 hover:text-green-400 transition-all duration-300 hover:scale-105">Features</a>
                  <a href="#services" className="text-gray-300 hover:text-green-400 transition-all duration-300 hover:scale-105">Services</a>
                  <a href="#showcase" className="text-gray-300 hover:text-green-400 transition-all duration-300 hover:scale-105">Demo</a>
                  <a href="#about" className="text-gray-300 hover:text-green-400 transition-all duration-300 hover:scale-105">About</a>
                  <button className="bg-gray-800/80 hover:bg-gray-700 px-4 py-2 rounded-xl transition-all duration-300 backdrop-blur-md border border-gray-700" onClick={() => navigate('/login')}>
                    Login
                  </button>
                  <button className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 px-4 py-2 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg shadow-green-500/25"
                onClick={() => navigate('/signup')}>
                    Sign Up
                  </button>
                </div>
              </div>

              <div className="md:hidden">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
              </div>
            </div>
          </div>

          {/* Enhanced Mobile menu */}
          {isMenuOpen && (
            <div className="md:hidden bg-black/95 backdrop-blur-xl border-b border-gray-800">
              <div className="px-2 pt-2 pb-3 space-y-1">
                <a href="#features" className="block px-3 py-2 text-gray-300 hover:text-green-400 rounded-lg hover:bg-gray-800/50 transition-all">Features</a>
                <a href="#services" className="block px-3 py-2 text-gray-300 hover:text-green-400 rounded-lg hover:bg-gray-800/50 transition-all">Services</a>
                <a href="#showcase" className="block px-3 py-2 text-gray-300 hover:text-green-400 rounded-lg hover:bg-gray-800/50 transition-all">Demo</a>
                <a href="#about" className="block px-3 py-2 text-gray-300 hover:text-green-400 rounded-lg hover:bg-gray-800/50 transition-all">About</a>
                <button className="block w-full text-left px-3 py-2 text-gray-300 hover:text-green-400 rounded-lg hover:bg-gray-800/50 transition-all" onClick={() => navigate('/login')}>Login</button>
                <button className="block w-full text-left px-3 py-2 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg mt-2 transition-all transform hover:scale-105" onClick={() => navigate('/signup')}>Sign Up</button>
              </div>
            </div>
          )}
        </nav>

        {/* Enhanced Hero Section with iPhone */}
        <section className="min-h-screen  flex items-center justify-center pt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-center lg:text-left order-2 lg:order-1">
              <div className="animate-slide-up">
                <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold mb-6 leading-tight">
                  <AnimatedGradientText>Connecting</AnimatedGradientText>
                  <br />
                  <span className="text-white">Local Businesses</span>
                  <br />
                  <span className="text-green-400">with Customers</span>
                </h1>
              </div>
              
              <div className="animate-slide-up mx-5 md:mx-0" style={{ animationDelay: '0.2s' }}>
                <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-lg mx-auto lg:mx-0">
                  Discover services and shops around you with CityConnect. Find local businesses, book services, and support your community.
                </p>
              </div>

              {/* Enhanced Search Bar */}
              <div className="relative mb-8 animate-slide-up" style={{ animationDelay: '0.4s' }}>
                <div className="flex  items-center bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-4 hover:border-green-500/50 hover:bg-gray-800/70 transition-all duration-300 shadow-2xl">
                  <Search className="text-gray-400 mr-3" size={24} />
                  <input
                    type="text"
                    placeholder="Search for shops, services, rickshaw booking..."
                    className="flex-1 bg-transparent text-white placeholder-gray-400 outline-none text-sm md:text-base"
                  />
                  <button className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 px-4 md:px-6 py-2 rounded-xl transition-all duration-300 ml-4 text-sm md:text-base shadow-lg shadow-green-500/25 transform hover:scale-105">
                    Explore
                  </button>
                </div>
              </div>

              <div className="animate-slide-up mb-7" style={{ animationDelay: '0.6s' }}>
                <button className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 px-6 md:px-8 py-3 md:py-4 rounded-2xl text-base md:text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-2xl shadow-green-500/30" onClick={() => navigate('/login')}>
                  Get Started <ArrowRight className="inline ml-2" size={20} />
                </button>
              </div>
            </div>

            {/* Right Content - iPhone Demo with Orbiting Elements */}
            <div className="flex justify-center order-1 lg:order-2">
              <div className="scale-85 md:scale-90 lg:scale-100">
                <OrbitingCircles>
                  <iPhone15Mockup>
                    <div className="bg-gradient-to-br from-green-500/10 to-blue-500/10  rounded-[30px] p-4 flex flex-col backdrop-blur-md w-full">
                      <div className="text-white text-lg font-bold mb-4 flex items-center">
                        <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center mr-3">
                          <MapPin size={16} className="text-white" />
                        </div>
                        CityConnect
                      </div>
                      
                      <div className="flex-1">
                        <div className="text-green-400 text-sm font-medium mb-3 flex items-center">
                          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-2"></div>
                          Live Updates
                        </div>
                        
                        <AnimatedList delay={3000} className="space-y-2">
                          {liveUpdates.map((update, index) => (
                            <div key={index} className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/20 hover:bg-white/15 transition-all duration-300">
                              <div className="flex items-start space-x-3">
                                <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${update.color} flex items-center justify-center text-sm shadow-lg`}>
                                  {update.icon}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="text-white text-xs font-medium">{update.title}</div>
                                  <div className="text-gray-300 text-xs mt-1">{update.subtitle}</div>
                                  <div className="flex items-center justify-between mt-2">
                                    <span className="text-blue-400 text-xs flex items-center">
                                      <MapPin className="w-2 h-2 mr-1" />
                                      {update.location}
                                    </span>
                                    <span className="text-gray-400 text-xs">{update.time}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </AnimatedList>
                      </div>
                    </div>
                  </iPhone15Mockup>
                </OrbitingCircles>
              </div>
            </div>
          </div>
        </section>

        {/* Enhanced Marquee Section */}
        <section className="py-12 border-y border-gray-800/50 bg-black/60 backdrop-blur-xl">
          <Marquee speed={40}>
            <div className="flex items-center space-x-16 text-gray-400">
              <span className="text-2xl font-bold flex items-center"><span className="text-3xl mr-2">🏪</span> Local Shops</span>
              <span className="text-2xl font-bold flex items-center"><span className="text-3xl mr-2">🔧</span> Quick Services</span>
              <span className="text-2xl font-bold flex items-center"><span className="text-3xl mr-2">🚗</span> Instant Booking</span>
              <span className="text-2xl font-bold flex items-center"><span className="text-3xl mr-2">⭐</span> Trusted Reviews</span>
              <span className="text-2xl font-bold flex items-center"><span className="text-3xl mr-2">💳</span> Secure Payments</span>
              <span className="text-2xl font-bold flex items-center"><span className="text-3xl mr-2">📍</span> Real-time Tracking</span>
            </div>
          </Marquee>
        </section>

        {/* NEW: MacBook Showcase Section */}
        <section className="py-20 bg-black/40 backdrop-blur-xl" id="showcase">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-6xl font-bold mb-6">
                <AnimatedGradientText>See CityConnect</AnimatedGradientText>
                <br />
                <span className="text-white">in Action</span>
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Experience the power of local business discovery with our intuitive dashboard and real-time features
              </p>
            </div>

            <div className="flex justify-center">
              <MacBookMockup className="max-w-4xl">
                <div className="relative h-full bg-gradient-to-br from-gray-900 via-black to-gray-900">
                  {/* Video Background */}
                  <video
                    ref={videoRef}
                    className="absolute inset-0 w-full h-full object-cover opacity-80"
                    muted
                    loop
                    playsInline
                    autoPlay
                  >
                    <source src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" type="video/mp4" />
                  </video>
                  
                  {/* Overlay Content */}
                  <div className="absolute inset-0 bg-black/40 backdrop-blur-sm">
                    <div className="h-full flex flex-col justify-center items-center text-center p-8">
                      <div className="bg-black/60 backdrop-blur-xl rounded-2xl p-8 border border-gray-700/50 max-w-md">
                        <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-2xl shadow-green-500/50">
                          <Play className="text-white" size={32} />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-3">
                          <AnimatedGradientText>Live Demo</AnimatedGradientText>
                        </h3>
                        <p className="text-gray-300 mb-6">
                          Watch how CityConnect transforms local business discovery
                        </p>
                        <button className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg shadow-green-500/25">
                          Watch Demo
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </MacBookMockup>
            </div>
          </div>
        </section>

        {/* Enhanced Interactive Categories */}
        <section className="py-20 bg-black/30 backdrop-blur-xl" id="features">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-6xl font-bold mb-6">
                <AnimatedGradientText>Explore Categories</AnimatedGradientText>
              </h2>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                Find exactly what you need from our wide range of local business categories
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {categories.map((category, index) => {
                const Icon = category.icon;
                return (
                  <TiltedCard key={index}>
                    <div className="group cursor-pointer">
                      <div className={`bg-gradient-to-br ${category.color} p-6 rounded-2xl text-center transition-all duration-300 group-hover:shadow-2xl group-hover:shadow-green-500/30 border border-white/10 backdrop-blur-md transform group-hover:scale-105`}>
                        <div className="bg-white/20 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-white/30 transition-all duration-300">
                          <Icon size={32} className="text-white" />
                        </div>
                        <h3 className="text-lg font-semibold text-white mb-2">{category.name}</h3>
                        <div className="text-xs text-white/80 mb-3">{category.count}</div>
                        <button className="bg-white/20 hover:bg-white/40 px-4 py-2 rounded-xl text-sm transition-all duration-300 transform hover:scale-105 border border-white/20">
                          Browse
                        </button>
                      </div>
                    </div>
                  </TiltedCard>
                );
              })}
            </div>
          </div>
        </section>

        {/* Enhanced Live Updates Section */}
        <section className="py-20 bg-black/50 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl md:text-6xl font-bold mb-6">
                  <AnimatedGradientText>Live Updates</AnimatedGradientText> 
                  <br />
                  <span className="text-white">from Your City</span>
                </h2>
                <p className="text-xl text-gray-300 mb-8">
                  Stay connected with real-time updates from local businesses. See new reviews, service requests, and activity happening around you.
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-center group">
                    <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center mr-4 group-hover:bg-green-500/30 transition-all">
                      <CheckCircle className="text-green-500" size={16} />
                    </div>
                    <span className="text-gray-300 group-hover:text-white transition-colors">Real-time notifications</span>
                  </div>
                  <div className="flex items-center group">
                    <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center mr-4 group-hover:bg-green-500/30 transition-all">
                      <CheckCircle className="text-green-500" size={16} />
                    </div>
                    <span className="text-gray-300 group-hover:text-white transition-colors">Live business status</span>
                  </div>
                  <div className="flex items-center group">
                    <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center mr-4 group-hover:bg-green-500/30 transition-all">
                      <CheckCircle className="text-green-500" size={16} />
                    </div>
                    <span className="text-gray-300 group-hover:text-white transition-colors">Community updates</span>
                  </div>
                </div>
              </div>

              <div className="relative">
                <TiltedCard>
                  <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 rounded-3xl p-8 border border-gray-700/50 backdrop-blur-xl shadow-2xl">
                    <div className="text-green-400 font-semibold mb-6 flex items-center">
                      <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse mr-2 shadow-lg shadow-green-400/50"></div>
                      Live Updates
                    </div>
                    
                    <AnimatedList delay={2500} className="max-h-[400px] overflow-hidden">
                      {liveUpdates.map((update, index) => (
                        <div key={index} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all duration-300 hover:border-green-500/30">
                          <div className="flex items-start space-x-3">
                            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${update.color} flex items-center justify-center text-lg shadow-lg`}>
                              {update.icon}
                            </div>
                            <div className="flex-1">
                              <div className="text-white font-medium text-sm mb-1">{update.title}</div>
                              <div className="text-gray-300 text-sm mb-2">{update.subtitle}</div>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center text-blue-400 text-xs">
                                  <MapPin className="w-3 h-3 mr-1" />
                                  {update.location}
                                </div>
                                <div className="flex items-center text-gray-400 text-xs">
                                  <Clock className="w-3 h-3 mr-1" />
                                  {update.time}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </AnimatedList>
                  </div>
                </TiltedCard>
              </div>
            </div>
          </div>
        </section>

{/* Mobile-Optimized Stepper Section */}
<section className="py-12 sm:py-16 lg:py-20 bg-black/60 backdrop-blur-xl">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="text-center mb-8 sm:mb-12 lg:mb-16">
      <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold mb-3 sm:mb-4 lg:mb-6 px-2">
        How <AnimatedGradientText>CityConnect</AnimatedGradientText> Works
      </h2>
      <p className="text-base sm:text-lg lg:text-xl text-gray-300 max-w-2xl mx-auto px-4">
        Simple steps to connect with your local community
      </p>
    </div>

    <div className="bg-gray-800/30 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 border border-gray-700/50 mx-2 sm:mx-0">
      {/* Mobile: Vertical Layout */}
      <div className="block sm:hidden space-y-6">
        {steps.map((step, index) => (
          <div key={index} className="flex items-start space-x-4">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold transition-all duration-500 flex-shrink-0 ${
              index <= currentStep ? 'bg-gradient-to-r from-green-500 to-blue-500 shadow-lg shadow-green-500/50' : 'bg-gray-700'
            }`}>
              {index <= currentStep ? <CheckCircle size={16} /> : index + 1}
            </div>
            <div className="flex-1 min-w-0">
              <div className={`font-semibold text-base transition-colors duration-300 ${index <= currentStep ? 'text-green-400' : 'text-gray-400'}`}>
                {step.title}
              </div>
              <div className="text-sm text-gray-300 mt-1 leading-relaxed">
                {step.description}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop: Horizontal Layout */}
      <div className="hidden sm:block">
        <div className="flex items-center justify-between w-full">
          {steps.map((step, index) => (
            <div key={index} className="flex items-center flex-1">
              <div className="flex flex-col items-center w-full">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold transition-all duration-500 ${
                  index <= currentStep ? 'bg-gradient-to-r from-green-500 to-blue-500 shadow-2xl shadow-green-500/50 scale-110' : 'bg-gray-800 border border-gray-700'
                }`}>
                  {index <= currentStep ? <CheckCircle size={24} /> : index + 1}
                </div>
                <div className="mt-3 text-center max-w-[140px]">
                  <div className={`font-medium transition-colors duration-300 ${index <= currentStep ? 'text-green-400' : 'text-gray-500'}`}>
                    {step.title}
                  </div>
                  <div className="text-sm text-gray-400 mt-1 leading-relaxed">
                    {step.description}
                  </div>
                </div>
              </div>
              {index < steps.length - 1 && (
                <div className={`h-1 flex-1 mx-4 rounded-full transition-all duration-500 ${
                  index < currentStep ? 'bg-gradient-to-r from-green-500 to-blue-500 shadow-lg shadow-green-500/50' : 'bg-gray-700'
                }`}></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
</section>

        {/* Enhanced Services Section */}
        <section className="py-20 bg-black/40 backdrop-blur-xl" id="services">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-6xl font-bold mb-6">
                Why Choose <AnimatedGradientText>CityConnect</AnimatedGradientText>
              </h2>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">Everything you need for local business discovery and connection</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {services.map((service, index) => {
                const Icon = service.icon;
                return (
                  <TiltedCard key={index}>
                    <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-8 text-center hover:border-green-500/50 transition-all duration-300 group hover:bg-gray-800/70 shadow-xl">
                      <div className="bg-gradient-to-br from-green-500 to-blue-500 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-green-500/50 group-hover:shadow-green-500/70 group-hover:scale-110 transition-all duration-300">
                        <Icon size={32} className="text-white" />
                      </div>
                      <h3 className="text-xl font-semibold mb-3 group-hover:text-green-400 transition-colors">{service.title}</h3>
                      <p className="text-gray-300 group-hover:text-gray-200 transition-colors">{service.description}</p>
                    </div>
                  </TiltedCard>
                );
              })}
            </div>
          </div>
        </section>

        {/* Enhanced Map Section */}
        <section className="py-20 bg-black/60 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl md:text-6xl font-bold mb-6">
                  Find Businesses <AnimatedGradientText>Near You</AnimatedGradientText>
                </h2>
                <p className="text-xl text-gray-300 mb-8">
                  Our live map updates in real-time to help you connect with local sellers. Never miss out on the services you need.
                </p>
                
                <div className="space-y-6">
                  <div className="flex items-center group">
                    <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center mr-4 group-hover:bg-green-500/30 transition-all duration-300">
                      <CheckCircle className="text-green-500" size={24} />
                    </div>
                    <div>
                      <div className="text-white font-semibold group-hover:text-green-400 transition-colors">Real-time business locations</div>
                      <div className="text-gray-400 text-sm">See exactly where businesses are operating</div>
                    </div>
                  </div>
                  <div className="flex items-center group">
                    <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mr-4 group-hover:bg-blue-500/30 transition-all duration-300">
                      <CheckCircle className="text-blue-500" size={24} />
                    </div>
                    <div>
                      <div className="text-white font-semibold group-hover:text-blue-400 transition-colors">Live availability status</div>
                      <div className="text-gray-400 text-sm">Know if shops are open before you visit</div>
                    </div>
                  </div>
                  <div className="flex items-center group">
                    <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mr-4 group-hover:bg-purple-500/30 transition-all duration-300">
                      <CheckCircle className="text-purple-500" size={24} />
                    </div>
                    <div>
                      <div className="text-white font-semibold group-hover:text-purple-400 transition-colors">Instant navigation</div>
                      <div className="text-gray-400 text-sm">Get directions with one tap</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative">
                <TiltedCard>
                  <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 rounded-3xl p-8 border border-gray-700/50 backdrop-blur-xl shadow-2xl">
                    <div className="aspect-square bg-gradient-to-br from-green-500/10 to-blue-500/10 rounded-2xl flex items-center justify-center relative overflow-hidden border border-gray-700/30">
                      {/* Animated map pins */}
                      <MapPin className="text-green-400 absolute top-4 left-4 animate-bounce shadow-lg" size={24} />
                      <MapPin className="text-blue-400 absolute top-8 right-8 animate-bounce shadow-lg" size={20} style={{animationDelay: '0.5s'}} />
                      <MapPin className="text-purple-400 absolute bottom-6 left-8 animate-bounce shadow-lg" size={28} style={{animationDelay: '1s'}} />
                      <MapPin className="text-yellow-400 absolute bottom-4 right-4 animate-bounce shadow-lg" size={22} style={{animationDelay: '1.5s'}} />
                      <MapPin className="text-pink-400 absolute top-1/2 left-6 animate-bounce shadow-lg" size={18} style={{animationDelay: '2s'}} />
                      
                      {/* Center content */}
                      <div className="text-center z-10">
                        <div className="text-6xl mb-4 filter drop-shadow-lg">🗺️</div>
                        <div className="text-green-400 font-semibold text-lg">Live Map</div>
                        <div className="text-gray-300 text-sm">Real-time Updates</div>
                        <div className="mt-4 bg-white/10 backdrop-blur-md rounded-lg px-4 py-2 border border-white/20">
                          <div className="text-green-400 text-xs font-medium">248 businesses nearby</div>
                        </div>
                      </div>
                      
                      {/* Pulse effect */}
                      <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-blue-500/5 rounded-2xl animate-pulse"></div>
                    </div>
                  </div>
                </TiltedCard>
              </div>
            </div>
          </div>
        </section>

        {/* Enhanced Testimonials */}
        <section className="py-20 bg-black/40 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-6xl font-bold mb-6">
                What Our <AnimatedGradientText>Users Say</AnimatedGradientText>
              </h2>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">Trusted by thousands of local businesses and customers across the city</p>
            </div>

            <div className="relative max-w-4xl mx-auto">
              <div className="overflow-hidden rounded-3xl">
                <div 
                  className="flex transition-transform duration-700 ease-in-out"
                  style={{ transform: `translateX(-${currentTestimonial * 100}%)` }}
                >
                  {testimonials.map((testimonial, index) => (
                    <div key={index} className="w-full flex-shrink-0 px-4">
                      <TiltedCard>
                        <div className="bg-gray-800/60 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-10 text-center shadow-2xl hover:bg-gray-800/80 transition-all duration-300">
                          <div className="flex justify-center mb-6">
                            {[...Array(testimonial.rating)].map((_, i) => (
                              <Star key={i} className="text-yellow-400 fill-current shadow-lg" size={28} />
                            ))}
                          </div>
                          
                          <p className="text-xl text-gray-300 mb-8 italic leading-relaxed">
                            "{testimonial.feedback}"
                          </p>
                          
                          <div className="flex items-center justify-center">
                            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-500 rounded-2xl flex items-center justify-center mr-4 shadow-2xl shadow-green-500/50">
                              <Users className="text-white" size={28} />
                            </div>
                            <div className="text-left">
                              <div className="font-bold text-white text-lg">{testimonial.name}</div>
                              <div className="text-gray-400">{testimonial.role}</div>
                            </div>
                          </div>
                        </div>
                      </TiltedCard>
                    </div>
                  ))}
                </div>
              </div>

              {/* Enhanced Navigation dots */}
              <div className="flex justify-center mt-8 space-x-3">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentTestimonial(index)}
                    className={`w-4 h-4 rounded-full transition-all duration-300 ${
                      index === currentTestimonial 
                        ? 'bg-gradient-to-r from-green-500 to-blue-500 shadow-lg shadow-green-500/50 scale-125' 
                        : 'bg-gray-600 hover:bg-gray-500'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Enhanced Seller Section */}
        <section className="py-20 bg-black/60 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <TiltedCard>
              <div className="bg-gradient-to-br from-green-500/10 to-blue-500/10 rounded-3xl border border-gray-700/50 p-12 text-center backdrop-blur-xl shadow-2xl">
                <div className="max-w-3xl mx-auto">
                  <h2 className="text-4xl md:text-6xl font-bold mb-6">
                    <AnimatedGradientText>Become a Seller</AnimatedGradientText>
                  </h2>
                  <p className="text-xl text-gray-300 mb-8">
                    Expand your business by joining CityConnect and reach more customers instantly. Join thousands of successful local businesses.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                    <button className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 px-6 md:px-8 py-4 rounded-2xl text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-2xl shadow-green-500/30"
                    onClick={() => navigate('/signup')}>
                      Register as Seller <ArrowRight className="inline ml-2" size={20} />
                    </button>
                    <button className="border border-gray-600 hover:border-green-500 px-8 py-4 rounded-2xl text-lg font-semibold transition-all duration-300 hover:bg-green-500/10 backdrop-blur-md">
                      Learn More
                    </button>
                  </div>
                  
                  {/* Stats */}
                  <div className="grid md:grid-cols-3 gap-8 mt-12 pt-8 border-t border-gray-700/50">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-400 mb-2">2,400+</div>
                      <div className="text-gray-400">Active Sellers</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-400 mb-2">50K+</div>
                      <div className="text-gray-400">Happy Customers</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-purple-400 mb-2">98%</div>
                      <div className="text-gray-400">Satisfaction Rate</div>
                    </div>
                  </div>
                </div>
              </div>
            </TiltedCard>
          </div>
        </section>

        {/* Enhanced Footer */}
        <footer className="bg-black/90 backdrop-blur-xl border-t border-gray-800/50 pt-20 pb-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Enhanced Newsletter Section */}
            <div className="bg-gradient-to-br from-green-500/10 to-blue-500/10 rounded-3xl border border-gray-700/50 p-10 mb-16 backdrop-blur-xl shadow-2xl">
              <div className="text-center">
                <h3 className="text-3xl md:text-4xl font-bold mb-4">
                  <AnimatedGradientText>Stay Connected</AnimatedGradientText>
                </h3>
                <p className="text-gray-300 mb-8 text-lg">Subscribe to get the latest updates, offers, and local business insights</p>
                
                <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="flex-1 bg-gray-800/60 border border-gray-700/50 rounded-xl px-6 py-4 text-white placeholder-gray-400 focus:outline-none focus:border-green-500 focus:bg-gray-800/80 transition-all duration-300 backdrop-blur-md"
                    required
                  />
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg shadow-green-500/25"
                  >
                    Subscribe
                  </button>
                </form>
              </div>
            </div>

            <div className="grid md:grid-cols-4 gap-8 mb-12">
              {/* Brand */}
              <div className="md:col-span-1">
                <div className="text-2xl font-bold mb-4">
                  <AnimatedGradientText>CityConnect</AnimatedGradientText>
                </div>
                <p className="text-gray-400 mb-6 leading-relaxed">
                  Connecting local businesses with customers for a thriving community ecosystem powered by technology.
                </p>
                
                {/* Enhanced Social Media */}
                <div className="flex space-x-4">
                  <a href="#" className="bg-gray-800/60 hover:bg-gradient-to-r hover:from-blue-600 hover:to-blue-700 p-3 rounded-xl transition-all duration-300 transform hover:scale-110 shadow-lg backdrop-blur-md">
                    <Facebook size={20} />
                  </a>
                  <a href="#" className="bg-gray-800/60 hover:bg-gradient-to-r hover:from-blue-400 hover:to-blue-500 p-3 rounded-xl transition-all duration-300 transform hover:scale-110 shadow-lg backdrop-blur-md">
                    <Twitter size={20} />
                  </a>
                  <a href="#" className="bg-gray-800/60 hover:bg-gradient-to-r hover:from-pink-500 hover:to-purple-500 p-3 rounded-xl transition-all duration-300 transform hover:scale-110 shadow-lg backdrop-blur-md">
                    <Instagram size={20} />
                  </a>
                  <a href="#" className="bg-gray-800/60 hover:bg-gradient-to-r hover:from-blue-600 hover:to-indigo-600 p-3 rounded-xl transition-all duration-300 transform hover:scale-110 shadow-lg backdrop-blur-md">
                    <Linkedin size={20} />
                  </a>
                </div>
              </div>

              {/* Quick Links */}
              <div>
                <h4 className="text-lg font-semibold mb-6 text-green-400">Quick Links</h4>
                <ul className="space-y-3">
                  <li><a href="/about" className="text-gray-400 hover:text-green-400 transition-all duration-300 hover:translate-x-1">About Us</a></li>
                  <li><a href="/contact" className="text-gray-400 hover:text-green-400 transition-all duration-300 hover:translate-x-1">Contact</a></li>
                  <li><a href="/careers" className="text-gray-400 hover:text-green-400 transition-all duration-300 hover:translate-x-1">Careers</a></li>
                  <li><a href="/help" className="text-gray-400 hover:text-green-400 transition-all duration-300 hover:translate-x-1">Help Center</a></li>
                </ul>
              </div>

              {/* Services */}
              <div>
                <h4 className="text-lg font-semibold mb-6 text-green-400">Services</h4>
                <ul className="space-y-3">
                  <li><a href="#" className="text-gray-400 hover:text-green-400 transition-all duration-300 hover:translate-x-1">Find Businesses</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-green-400 transition-all duration-300 hover:translate-x-1">Book Services</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-green-400 transition-all duration-300 hover:translate-x-1">Rickshaw Booking</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-green-400 transition-all duration-300 hover:translate-x-1">Business Listings</a></li>
                </ul>
              </div>

              {/* Support */}
              <div>
                <h4 className="text-lg font-semibold mb-6 text-green-400">Support</h4>
                <ul className="space-y-3">
                  <li><a href="#" className="text-gray-400 hover:text-green-400 transition-all duration-300 hover:translate-x-1">Privacy Policy</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-green-400 transition-all duration-300 hover:translate-x-1">Terms of Service</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-green-400 transition-all duration-300 hover:translate-x-1">Cookie Policy</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-green-400 transition-all duration-300 hover:translate-x-1">GDPR</a></li>
                </ul>
              </div>
            </div>

            {/* Enhanced Copyright */}
            <div className="border-t border-gray-800/50 pt-8 text-center">
              <p className="text-gray-400 text-lg">
                © 2025 CityConnect. Crafted with <span className="text-red-500 animate-pulse">❤️</span> for local businesses.
              </p>
              <p className="text-gray-500 text-sm mt-2">
                Built with React, TailwindCSS & Modern Web Technologies
              </p>
            </div>
          </div>
        </footer>

        {/* Enhanced Floating CTA */}
        <div className="fixed bottom-8 right-8 z-50">
          <div className="relative">
            {/* Pulse effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-blue-500 rounded-full animate-ping opacity-20"></div>
            <button className="relative bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 p-4 rounded-full shadow-2xl shadow-green-500/30 transition-all duration-300 transform hover:scale-110 backdrop-blur-md" onClick={() => navigate('/login')}>
              <ArrowRight className="text-white" size={24} />
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced Custom Styles */}
      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        @keyframes slideUp {
          0% {
            opacity: 0;
            transform: translateY(40px) scale(0.9);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        @keyframes fadeInUp {
          0% {
            opacity: 0;
            transform: translateY(30px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 4s ease infinite;
        }
        
        .animate-marquee {
          animation: marquee 60s linear infinite;
        }
        
        .animate-slide-up {
          animation: slideUp 0.6s ease-out forwards;
        }
        
        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
        }
        
        /* Enhanced scrolling */
        html {
          scroll-behavior: smooth;
        }
        
        /* Enhanced scrollbar */
        ::-webkit-scrollbar {
          width: 10px;
        }
        
        ::-webkit-scrollbar-track {
          background: #111827;
          border-radius: 5px;
        }
        
        ::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #10b981, #3b82f6);
          border-radius: 5px;
          box-shadow: 0 0 10px rgba(16, 185, 129, 0.3);
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #059669, #2563eb);
          box-shadow: 0 0 15px rgba(16, 185, 129, 0.5);
        }
        
        /* Glassmorphism utilities */
        .glass {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .glass-dark {
          background: rgba(0, 0, 0, 0.2);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        /* Enhanced perspective utilities */
        .perspective-1000 {
          perspective: 1000px;
        }
        
        .rotateX-12 {
          transform: rotateX(12deg);
        }
        
        /* Glow effects */
        .glow-green {
          box-shadow: 0 0 30px rgba(16, 185, 129, 0.3);
        }
        
        .glow-blue {
          box-shadow: 0 0 30px rgba(59, 130, 246, 0.3);
        }
        
        /* Improved animations */
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        /* Particle effects */
        .particle {
          position: absolute;
          width: 2px;
          height: 2px;
          background: #10b981;
          border-radius: 50%;
          animation: particle 20s linear infinite;
        }
        
        @keyframes particle {
          0% {
            transform: translateY(100vh) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(-100vh) rotate(360deg);
            opacity: 0;
          }
        }
        
        /* Enhanced responsive design */
        @media (max-width: 768px) {
          .animate-slide-up {
            animation: slideUp 0.4s ease-out forwards;
          }
        }
        
        /* Performance optimizations */
        * {
          will-change: auto;
        }
        
        .transform-gpu {
          transform: translateZ(0);
        }
      `}</style>
    </div>
  );
};

export default CityConnectLanding;