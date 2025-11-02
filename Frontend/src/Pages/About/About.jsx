import React, { useState, useEffect, useRef } from "react";
import {
  Users,
  Heart,
  Target,
  Sparkles,
  Award,
  TrendingUp,
  Shield,
  Zap,
  Globe,
  CheckCircle,
  ArrowRight,
  MapPin,
  Store,
  MessageCircle,
  Clock,
  Search,
  DollarSign,
  Headphones,
  Star,
} from "lucide-react";

// Custom hook for intersection observer
const useInView = (options = {}) => {
  const ref = useRef(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsInView(true);
      }
    }, { threshold: 0.1, ...options });

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  return [ref, isInView];
};

// Counter Animation Component
const AnimatedCounter = ({ target, suffix = "+" }) => {
  const [count, setCount] = useState(0);
  const [ref, isInView] = useInView();

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const duration = 2000;
      const increment = target / (duration / 16);

      const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
          setCount(target);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, 16);

      return () => clearInterval(timer);
    }
  }, [isInView, target]);

  return (
    <div ref={ref} className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-2">
      {target >= 1000 ? `${Math.floor(count / 1000)}K${suffix}` : `${count}${suffix}`}
    </div>
  );
};

const AboutPage = () => {
  const [heroRef, heroInView] = useInView();
  const [storyLeftRef, storyLeftInView] = useInView();
  const [storyRightRef, storyRightInView] = useInView();
  const [howTitleRef, howTitleInView] = useInView();
  const [featuresTitleRef, featuresTitleInView] = useInView();
  const [statsTitleRef, statsTitleInView] = useInView();
  const [ctaRef, ctaInView] = useInView();

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#f8fafc" }}>
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(60px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInLeft {
          from {
            opacity: 0;
            transform: translateX(-60px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fadeInRight {
          from {
            opacity: 0;
            transform: translateX(60px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        @keyframes pulseGlow {
          0%, 100% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 0.5;
            transform: scale(1.2);
          }
        }

        @keyframes rotate {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .animate-in {
          animation: fadeInUp 0.8s ease-out forwards;
        }

        .animate-left {
          animation: fadeInLeft 0.8s ease-out forwards;
        }

        .animate-right {
          animation: fadeInRight 0.8s ease-out forwards;
        }

        .animate-scale {
          animation: scaleIn 0.6s ease-out forwards;
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-pulse-glow {
          animation: pulseGlow 8s ease-in-out infinite;
        }

        .animate-rotate {
          animation: rotate 20s linear infinite;
        }

        .stagger-1 { animation-delay: 0.1s; }
        .stagger-2 { animation-delay: 0.2s; }
        .stagger-3 { animation-delay: 0.3s; }
        .stagger-4 { animation-delay: 0.4s; }
        .stagger-5 { animation-delay: 0.5s; }
        .stagger-6 { animation-delay: 0.6s; }

        .hover-lift {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .hover-lift:hover {
          transform: translateY(-10px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
        }

        .hover-scale {
          transition: transform 0.3s ease;
        }

        .hover-scale:hover {
          transform: scale(1.05);
        }

        .hover-rotate {
          transition: transform 0.5s ease;
        }

        .hover-rotate:hover {
          transform: rotate(5deg) scale(1.05);
        }

        .glass-effect {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
      `}</style>

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-black py-20 md:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black opacity-90" />
        
        <div className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-pink-500/10 to-orange-500/10 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '2s' }} />
        
        <div className="container mx-auto px-4 relative z-10">
          <div ref={heroRef} className={`text-center text-white max-w-4xl mx-auto ${heroInView ? 'animate-in' : 'opacity-0'}`}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium mb-6 glass-effect">
              <Sparkles size={16} className="text-yellow-400" />
              About CityConnect
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-6 leading-tight">
              Your Local Business
              <br />
              <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Discovery Platform
              </span>
            </h1>

            <p className="text-lg md:text-xl lg:text-2xl text-white/90 font-light max-w-3xl mx-auto mb-8">
              Bridging the gap between local businesses and customers through smart technology, verified reviews, and community-driven recommendations.
            </p>

            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <div className="glass-effect px-4 py-2 rounded-full">
                <span className="font-semibold">Founded:</span> 2020
              </div>
              <div className="glass-effect px-4 py-2 rounded-full">
                <span className="font-semibold">Headquarters:</span> Surat, India
              </div>
              <div className="glass-effect px-4 py-2 rounded-full">
                <span className="font-semibold">Team Size:</span> 50+ Professionals
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Our Story Section */}
      <div className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div ref={storyLeftRef} className={`${storyLeftInView ? 'animate-left' : 'opacity-0'}`}>
              <div className="relative">
                <div className="rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl hover-rotate">
                  <img 
                    src="https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800&h=600&fit=crop" 
                    alt="Local business community" 
                    className="w-full h-[400px] md:h-[500px] object-cover"
                  />
                </div>
                <div className="absolute -bottom-6 -right-6 bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-6 rounded-2xl shadow-xl animate-float">
                  <Store size={32} className="mb-2" />
                  <div className="font-bold text-2xl">5,000+</div>
                  <div className="text-sm">Verified Businesses</div>
                </div>
              </div>
            </div>

            <div ref={storyRightRef} className={`${storyRightInView ? 'animate-right' : 'opacity-0'}`}>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 text-gray-800 text-sm font-medium mb-4">
                <Target size={16} className="text-blue-500" />
                Our Story
              </div>

              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                Built by Community, For Community
              </h2>

              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                CityConnect started when our founders noticed a disconnect: talented local businesses struggled with online visibility, while customers couldn't find authentic, trustworthy local services.
              </p>

              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                We created a platform that combines AI-powered matching, verified customer reviews, and real-time availability to make discovering local businesses as easy as finding global brands.
              </p>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-purple-400 to-blue-500 flex items-center justify-center flex-shrink-0">
                    <Shield size={20} className="text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">100% Verified Businesses</h4>
                    <p className="text-gray-600 text-sm">Every business undergoes thorough verification before joining our platform</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center flex-shrink-0">
                    <MessageCircle size={20} className="text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">Real Customer Reviews</h4>
                    <p className="text-gray-600 text-sm">Authentic feedback from verified customers who've used the services</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-yellow-400 to-orange-500 flex items-center justify-center flex-shrink-0">
                    <Zap size={20} className="text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">Smart Matching Algorithm</h4>
                    <p className="text-gray-600 text-sm">AI-powered recommendations based on your preferences and location</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-16 md:py-24 bg-[#ECF2F9]">
        <div className="container mx-auto px-4">
          <div ref={howTitleRef} className={`text-center mb-16 ${howTitleInView ? 'animate-in' : 'opacity-0'}`}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white text-gray-800 text-sm font-medium mb-4 shadow-sm">
              <Clock size={16} className="text-purple-500" />
              How CityConnect Works
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Simple, Smart, Seamless
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              Connecting you with the perfect local business in just a few clicks
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                step: 1,
                title: "Search & Discover",
                description: "Browse businesses by category, location, or use our smart search to find exactly what you need",
                gradient: "from-purple-400 to-purple-600"
              },
              {
                step: 2,
                title: "Compare & Review",
                description: "Check ratings, read authentic reviews, and compare services to make the best choice",
                gradient: "from-blue-400 to-blue-600"
              },
              {
                step: 3,
                title: "Book & Connect",
                description: "Book appointments instantly, message businesses, and get real-time availability updates",
                gradient: "from-green-400 to-green-600"
              },
              {
                step: 4,
                title: "Experience & Share",
                description: "Enjoy the service and share your experience to help others in your community",
                gradient: "from-orange-400 to-orange-600"
              }
            ].map((item, index) => (
              <div
                key={index}
                className={`bg-white rounded-2xl p-6 shadow-lg border border-gray-200 hover-lift ${howTitleInView ? `animate-scale stagger-${index + 1}` : 'opacity-0'}`}
              >
                <div className={`w-16 h-16 bg-gradient-to-r ${item.gradient} rounded-2xl flex items-center justify-center text-white font-black text-2xl mb-4 mx-auto`}>
                  {item.step}
                </div>
                <h3 className="text-xl font-bold text-gray-900 text-center mb-3">{item.title}</h3>
                <p className="text-gray-600 text-center text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Platform Features */}
      <div className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div ref={featuresTitleRef} className={`text-center mb-16 ${featuresTitleInView ? 'animate-in' : 'opacity-0'}`}>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Why Choose CityConnect?
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              Powerful features designed to make local business discovery effortless
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Search,
                title: "Advanced Search",
                description: "Filter by distance, ratings, availability, price range, and more to find your perfect match",
                gradient: "from-purple-400 to-indigo-500"
              },
              {
                icon: MapPin,
                title: "Location-Based",
                description: "Discover businesses near you with real-time distance calculations and route optimization",
                gradient: "from-blue-400 to-cyan-500"
              },
              {
                icon: DollarSign,
                title: "Secure Payments",
                description: "Multiple payment options with bank-level encryption for safe and convenient transactions",
                gradient: "from-green-400 to-emerald-500"
              },
              {
                icon: Headphones,
                title: "24/7 Support",
                description: "Round-the-clock customer service to assist with bookings, queries, and issue resolution",
                gradient: "from-yellow-400 to-orange-500"
              },
              {
                icon: Heart,
                title: "Save Favorites",
                description: "Bookmark your favorite businesses for quick access and get notified of special offers",
                gradient: "from-pink-400 to-rose-500"
              },
              {
                icon: Star,
                title: "Rewards Program",
                description: "Earn points with every booking and redeem them for discounts and exclusive deals",
                gradient: "from-indigo-400 to-purple-500"
              }
            ].map((feature, index) => (
              <div key={index} className={`text-center ${featuresTitleInView ? `animate-scale stagger-${index + 1}` : 'opacity-0'}`}>
                <div className={`w-20 h-20 bg-gradient-to-r ${feature.gradient} rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl hover-scale`}>
                  <feature.icon size={40} className="text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 md:py-24 bg-black relative overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-r from-pink-500/20 to-orange-500/20 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '4s' }} />

        <div className="container mx-auto px-4 relative z-10">
          <div ref={statsTitleRef} className={`text-center mb-16 ${statsTitleInView ? 'animate-in' : 'opacity-0'}`}>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">Our Impact in Numbers</h2>
            <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">Real results that make a difference in communities across the country</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {[
              { icon: Store, target: 5000, label: "Verified Businesses", gradient: "from-blue-400 to-blue-600" },
              { icon: Users, target: 100000, label: "Active Users", gradient: "from-green-400 to-green-600" },
              { icon: MapPin, target: 250, label: "Cities Covered", gradient: "from-purple-400 to-purple-600" },
              { icon: Star, number: "4.9★", label: "Average Rating", gradient: "from-orange-400 to-orange-600", isRating: true }
            ].map((stat, index) => (
              <div
                key={index}
                className={`text-center p-6 md:p-8 rounded-2xl md:rounded-3xl hover-lift ${statsTitleInView ? `animate-scale stagger-${index + 1}` : 'opacity-0'}`}
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.05)",
                  backdropFilter: "blur(16px)",
                  border: "1px solid rgba(255, 255, 255, 0.1)"
                }}
              >
                <div className={`w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 bg-gradient-to-r ${stat.gradient} rounded-2xl flex items-center justify-center shadow-2xl`}>
                  <stat.icon size={32} className="text-white" />
                </div>
                {stat.isRating ? (
                  <div className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-2">
                    {stat.number}
                  </div>
                ) : (
                  <AnimatedCounter target={stat.target} />
                )}
                <div className="text-sm md:text-base text-gray-300 font-semibold">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 md:py-24" style={{ backgroundColor: "#f8fafc" }}>
        <div className="container mx-auto px-4">
          <div ref={ctaRef} className={`bg-gradient-to-r from-gray-800 to-gray-900 rounded-3xl p-8 md:p-16 text-center relative overflow-hidden ${ctaInView ? 'animate-in' : 'opacity-0'}`}>
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-rotate" />

            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium text-white mb-6 glass-effect">
                <Sparkles size={16} className="text-yellow-400" />
                Join Our Community
              </div>

              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
                Ready to Discover Amazing Local Businesses?
              </h2>

              <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
                Whether you're a customer looking for services or a business ready to grow, CityConnect is here for you
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="px-8 py-4 bg-white text-gray-900 rounded-xl font-semibold text-lg shadow-lg hover-scale flex items-center justify-center gap-3">
                  <Search size={20} />
                  Explore Businesses
                  <ArrowRight size={20} />
                </button>

                <button className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-xl font-semibold text-lg hover:bg-white hover:text-gray-900 transition-all duration-300 flex items-center justify-center gap-3">
                  <Store size={20} />
                  Register Your Business
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;