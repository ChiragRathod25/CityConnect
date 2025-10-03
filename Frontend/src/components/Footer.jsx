import { Mail, MapPin, Phone, Store, Heart, Shield, Award, Clock, Star, ArrowRight, Facebook, Instagram, Twitter, Linkedin } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br from-[#1f2937] via-[#374151] to-[#1f2937] text-white relative overflow-hidden">
    
      <div className="absolute inset-0 bg-gradient-to-t from-[#000000]/20 to-transparent"></div>
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#2e8f0]/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#6b7280]/10 rounded-full blur-3xl"></div>
      
      <div className="relative border-b border-[#d1d5db]/20 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-[#2e8f0] to-[#6b7280] rounded-full mb-6">
              <Mail className="text-[#ffffff]" size={24} />
            </div>
            <h3 className="text-3xl font-bold mb-4 bg-gradient-to-r from-[#ffffff] to-[#9ca3af] bg-clip-text text-transparent">
              Stay Connected with Local Businesses
            </h3>
            <p className="text-[#9ca3af] mb-8 max-w-2xl mx-auto">
              Get the latest updates on new businesses, special offers, and community events delivered straight to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-6 py-3 bg-[#f3f4f6]/10 backdrop-blur-sm border border-[#d1d5db]/30 rounded-lg text-[#ffffff] placeholder-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#2e8f0] focus:border-transparent transition-all"
              />
              <button className="px-8 py-3 bg-gradient-to-r from-[#2e8f0] to-[#6b7280] rounded-lg font-semibold hover:from-[#f9fafb] hover:to-[#e5e7eb] hover:text-[#1f2937] transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2">
                Subscribe <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="relative py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
            
            {/* Brand Section */}
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="bg-gradient-to-r from-[#2e8f0] to-[#6b7280] p-3 rounded-xl shadow-lg">
                  <Store className="text-[#ffffff]" size={28} />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-[#ffffff] to-[#9ca3af] bg-clip-text text-transparent">
                  CityConnect
                </span>
              </div>
              <p className="text-[#9ca3af] mb-6 leading-relaxed">
                Your trusted platform for discovering and connecting with the best local businesses in your community. We're passionate about supporting local entrepreneurs and helping customers find exactly what they need.
              </p>
              
              {/* Trust Indicators */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="text-center p-3 bg-[#f3f4f6]/10 rounded-lg backdrop-blur-sm border border-[#e5e7eb]/20">
                  <div className="flex justify-center mb-2">
                    <Shield className="text-[#2e8f0]" size={24} />
                  </div>
                  <div className="text-sm text-[#f8fafc] font-semibold">Verified</div>
                  <div className="text-xs text-[#9ca3af]">Businesses</div>
                </div>
                <div className="text-center p-3 bg-[#f3f4f6]/10 rounded-lg backdrop-blur-sm border border-[#e5e7eb]/20">
                  <div className="flex justify-center mb-2">
                    <Award className="text-[#f9fafb]" size={24} />
                  </div>
                  <div className="text-sm text-[#f8fafc] font-semibold">Award</div>
                  <div className="text-xs text-[#9ca3af]">Winning</div>
                </div>
                <div className="text-center p-3 bg-[#f3f4f6]/10 rounded-lg backdrop-blur-sm border border-[#e5e7eb]/20">
                  <div className="flex justify-center mb-2">
                    <Heart className="text-[#6b7280]" size={24} />
                  </div>
                  <div className="text-sm text-[#f8fafc] font-semibold">Community</div>
                  <div className="text-xs text-[#9ca3af]">Focused</div>
                </div>
              </div>

              {/* Social Media */}
              <div className="flex space-x-4">
                <div className="group bg-[#f3f4f6]/10 backdrop-blur-sm p-3 rounded-lg hover:bg-[#2e8f0] border border-[#d1d5db]/20 transition-all duration-300 cursor-pointer">
                  <Facebook size={20} className="group-hover:scale-110 transition-transform" />
                </div>
                <div className="group bg-[#f3f4f6]/10 backdrop-blur-sm p-3 rounded-lg hover:bg-[#6b7280] border border-[#d1d5db]/20 transition-all duration-300 cursor-pointer">
                  <Instagram size={20} className="group-hover:scale-110 transition-transform" />
                </div>
                <div className="group bg-[#f3f4f6]/10 backdrop-blur-sm p-3 rounded-lg hover:bg-[#9ca3af] border border-[#d1d5db]/20 transition-all duration-300 cursor-pointer">
                  <Twitter size={20} className="group-hover:scale-110 transition-transform" />
                </div>
                <div className="group bg-[#f3f4f6]/10 backdrop-blur-sm p-3 rounded-lg hover:bg-[#374151] border border-[#d1d5db]/20 transition-all duration-300 cursor-pointer">
                  <Linkedin size={20} className="group-hover:scale-110 transition-transform" />
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold mb-6 text-[#ffffff]">Quick Links</h4>
              <ul className="space-y-4">
                {[
                  { label: "Home", href: "#" },
                  { label: "Find Businesses", href: "#" },
                  { label: "List Your Business", href: "#" },
                  { label: "About Us", href: "#" },
                  { label: "Contact", href: "#" },
                  { label: "Blog", href: "#" },
                  { label: "Help Center", href: "#" }
                ].map((link, index) => (
                  <li key={index}>
                    <a 
                      href={link.href} 
                      className="text-[#9ca3af] hover:text-[#ffffff] transition-colors duration-300 flex items-center group"
                    >
                      <ArrowRight size={14} className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-[#2e8f0]" />
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Categories */}
            <div>
              <h4 className="text-lg font-semibold mb-6 text-[#ffffff]">Popular Categories</h4>
              <ul className="space-y-4">
                {[
                  { label: "Restaurants & Cafes", count: "150+" },
                  { label: "Retail & Shopping", count: "200+" },
                  { label: "Professional Services", count: "180+" },
                  { label: "Health & Wellness", count: "120+" },
                  { label: "Home Services", count: "90+" },
                  { label: "Beauty & Spa", count: "80+" },
                  { label: "Automotive", count: "60+" }
                ].map((category, index) => (
                  <li key={index}>
                    <a 
                      href="#" 
                      className="text-[#9ca3af] hover:text-[#ffffff] transition-colors duration-300 flex items-center justify-between group"
                    >
                      <span className="group-hover:translate-x-1 transition-transform duration-300">
                        {category.label}
                      </span>
                      <span className="text-xs text-[#6b7280] bg-[#f3f4f6]/20 px-2 py-1 rounded-full border border-[#e5e7eb]/30">
                        {category.count}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact & Business Hours */}
            <div>
              <h4 className="text-lg font-semibold mb-6 text-[#ffffff]">Get in Touch</h4>
              <div className="space-y-4 mb-8">
                <div className="flex items-start space-x-3 group">
                  <div className="bg-[#2e8f0] p-2 rounded-lg group-hover:bg-[#6b7280] transition-colors">
                    <Mail size={16} />
                  </div>
                  <div>
                    <div className="text-[#9ca3af] group-hover:text-[#ffffff] transition-colors">
                      info@CityConnect.com
                    </div>
                    <div className="text-xs text-[#6b7280]">General inquiries</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3 group">
                  <div className="bg-[#2e8f0] p-2 rounded-lg group-hover:bg-[#6b7280] transition-colors">
                    <Phone size={16} />
                  </div>
                  <div>
                    <div className="text-[#9ca3af] group-hover:text-[#ffffff] transition-colors">
                      +1 (555) 123-4567
                    </div>
                    <div className="text-xs text-[#6b7280]">Support hotline</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3 group">
                  <div className="bg-[#2e8f0] p-2 rounded-lg group-hover:bg-[#6b7280] transition-colors">
                    <MapPin size={16} />
                  </div>
                  <div>
                    <div className="text-[#9ca3af] group-hover:text-[#ffffff] transition-colors">
                      123 Business Avenue
                    </div>
                    <div className="text-xs text-[#6b7280]">Suite 456, City, ST 12345</div>
                  </div>
                </div>
              </div>

              {/* Business Hours */}
              <div className="bg-[#f3f4f6]/10 backdrop-blur-sm rounded-lg p-4 border border-[#e5e7eb]/20">
                <div className="flex items-center space-x-2 mb-3">
                  <Clock size={16} className="text-[#2e8f0]" />
                  <span className="text-sm font-semibold text-[#ffffff]">Support Hours</span>
                </div>
                <div className="space-y-1 text-xs text-[#9ca3af]">
                  <div className="flex justify-between">
                    <span>Mon - Fri</span>
                    <span>9:00 AM - 8:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Saturday</span>
                    <span>10:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sunday</span>
                    <span>12:00 PM - 5:00 PM</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="relative border-t border-[#d1d5db]/20 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center justify-between space-y-4 lg:space-y-0">
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-6 text-sm text-[#9ca3af]">
              <p>© {currentYear} CityConnect. All rights reserved.</p>
              <div className="flex items-center space-x-1">
                <span>Made with</span>
                <Heart size={12} className="text-[#6b7280] animate-pulse" />
                <span>for local communities</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-6 text-sm">
              <a href="#" className="text-[#9ca3af] hover:text-[#ffffff] transition-colors">Privacy Policy</a>
              <a href="#" className="text-[#9ca3af] hover:text-[#ffffff] transition-colors">Terms of Service</a>
              <a href="#" className="text-[#9ca3af] hover:text-[#ffffff] transition-colors">Cookie Policy</a>
              <div className="flex items-center space-x-1 text-[#f9fafb]">
                <Star size={12} fill="currentColor" />
                <span className="text-xs">4.9/5 Customer Rating</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;