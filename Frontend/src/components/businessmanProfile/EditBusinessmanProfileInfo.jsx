import React, { useState, useEffect } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Building2, 
  Clock, 
  CreditCard, 
  FileText,
  ChevronRight,
  Edit3,
  ArrowLeft,
  Settings,
  Home,
  Truck,
  Shield,
  Briefcase,
  Calendar,
  Upload,
  CheckCircle
} from 'lucide-react';

const EditProfileNavigation = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const editOptions = [
    {
      id: 'contact-info',
      title: 'Contact Information',
      description: 'Update your personal contact details',
      icon: User,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      hoverColor: 'hover:bg-blue-100',
      subItems: [
        { 
          id: 'name-edit', 
          title: 'Edit Name', 
          icon: User,
          route: '/edit/name-edit',
          description: 'Update your full name'
        },
        { 
          id: 'email-edit', 
          title: 'Edit Email', 
          icon: Mail,
          route: '/edit/email-edit',
          description: 'Change email with verification'
        },
        { 
          id: 'phone-edit', 
          title: 'Edit Phone', 
          icon: Phone,
          route: '/edit/phone-edit',
          description: 'Update phone with OTP verification'
        }
      ]
    },
    {
      id: 'location',
      title: 'Location & Address',
      description: 'Update your business location and address',
      icon: MapPin,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      hoverColor: 'hover:bg-green-100',
      route: '/edit/location-edit'
    },
    {
      id: 'business-info',
      title: 'Business Information',
      description: 'Edit business details and description',
      icon: Building2,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      hoverColor: 'hover:bg-purple-100',
      route: '/edit/business-edit'
    },
    {
      id: 'payment-methods',
      title: 'Payment Methods',
      description: 'Manage accepted payment options',
      icon: CreditCard,
      color: 'bg-orange-500',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      hoverColor: 'hover:bg-orange-100',
      route: '/edit/payment-edit'
    },
    {
      id: 'business-hours',
      title: 'Business Hours',
      description: 'Set your operating hours and schedule',
      icon: Clock,
      color: 'bg-indigo-500',
      bgColor: 'bg-indigo-50',
      borderColor: 'border-indigo-200',
      hoverColor: 'hover:bg-indigo-100',
      route: '/edit/hours-edit'
    },
    {
      id: 'services',
      title: 'Services Available',
      description: 'Configure delivery and home service options',
      icon: Truck,
      color: 'bg-teal-500',
      bgColor: 'bg-teal-50',
      borderColor: 'border-teal-200',
      hoverColor: 'hover:bg-teal-100',
      route: '/edit/services-edit'
    },
    {
      id: 'documents',
      title: 'Document Upload',
      description: 'Upload and manage your documents',
      icon: FileText,
      color: 'bg-red-500',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      hoverColor: 'hover:bg-red-100',
      route: '/edit/documents-edit'
    }
  ];

  const handleNavigation = (route) => {
    // In a real app, you would use React Router
    alert(`Navigating to: ${route}`);
  };

  const handleBack = () => {
    alert('Going back to profile');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <div className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
        
        {/* Header */}
        <div className={`bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-gray-200 overflow-hidden mb-6 sm:mb-8 transition-all duration-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
          <div className="relative bg-gradient-to-r from-gray-800 via-gray-700 to-gray-900 p-4 sm:p-6 lg:p-8">
            <div className="flex items-center justify-between">
              <button
                onClick={handleBack}
                className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/30 text-white rounded-xl transition-all duration-300 hover:scale-105"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="font-medium hidden sm:inline">Back to Profile</span>
              </button>
              
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-white/10 rounded-xl">
                  <Settings className="w-6 h-6 text-white" />
                </div>
                <div className="text-white">
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold">Edit Profile</h1>
                  <p className="text-gray-300 text-sm sm:text-base">Update your information</p>
                </div>
              </div>
              
              <div className="w-16 sm:w-24" /> {/* Spacer for alignment */}
            </div>
          </div>
        </div>

        {/* Edit Options List */}
        <div className="space-y-4 sm:space-y-6">
          {editOptions.map((option, index) => (
            <div
              key={option.id}
              className={`transition-all duration-500 ${
                isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
              }`}
              style={{ transitionDelay: `${(index + 1) * 100}ms` }}
            >
              {option.subItems ? (
                // Contact Information with Sub-items
                <div className={`bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 ${option.bgColor} ${option.borderColor}`}>
                  <div className="p-4 sm:p-6">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className={`p-3 ${option.color} text-white rounded-xl shadow-lg`}>
                        <option.icon className="w-5 h-5 sm:w-6 sm:h-6" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-1">{option.title}</h3>
                        <p className="text-sm sm:text-base text-gray-600">{option.description}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
                      {option.subItems.map((subItem, subIndex) => (
                        <button
                          key={subItem.id}
                          onClick={() => handleNavigation(subItem.route)}
                          onMouseEnter={() => setHoveredItem(`${option.id}-${subIndex}`)}
                          onMouseLeave={() => setHoveredItem(null)}
                          className={`group p-4 bg-white border-2 border-gray-200 rounded-xl hover:border-gray-300 hover:shadow-lg transition-all duration-300 text-left ${
                            hoveredItem === `${option.id}-${subIndex}` ? 'scale-105 shadow-xl' : ''
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="p-2 bg-gray-100 group-hover:bg-gray-200 rounded-lg transition-all duration-300">
                              <subItem.icon className="w-4 h-4 text-gray-600" />
                            </div>
                            <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all duration-300" />
                          </div>
                          <h4 className="font-semibold text-gray-800 mb-1 text-sm sm:text-base">{subItem.title}</h4>
                          <p className="text-xs sm:text-sm text-gray-600">{subItem.description}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                // Regular Edit Options
                <button
                  onClick={() => handleNavigation(option.route)}
                  onMouseEnter={() => setHoveredItem(option.id)}
                  onMouseLeave={() => setHoveredItem(null)}
                  className={`group w-full bg-white rounded-2xl shadow-lg border border-gray-200 p-4 sm:p-6 hover:shadow-xl transition-all duration-300 text-left ${
                    option.hoverColor
                  } ${hoveredItem === option.id ? 'scale-102 shadow-2xl' : ''}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`p-3 ${option.color} text-white rounded-xl shadow-lg group-hover:scale-110 transition-all duration-300`}>
                        <option.icon className="w-5 h-5 sm:w-6 sm:h-6" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-1 group-hover:text-gray-900 transition-colors">
                          {option.title}
                        </h3>
                        <p className="text-sm sm:text-base text-gray-600 group-hover:text-gray-700 transition-colors">
                          {option.description}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <div className="hidden sm:block">
                        <div className="p-2 bg-gray-100 group-hover:bg-gray-200 rounded-lg transition-all duration-300">
                          <Edit3 className="w-4 h-4 text-gray-600" />
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-2 transition-all duration-300" />
                    </div>
                  </div>
                  
                  {/* Progress indicator */}
                  <div className="mt-4 pt-3 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-sm text-gray-600">Configured</span>
                      </div>
                      <div className="text-xs text-gray-500">
                        Last updated: 2 days ago
                      </div>
                    </div>
                  </div>
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className={`mt-8 sm:mt-12 text-center transition-all duration-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`} style={{ transitionDelay: '800ms' }}>
          <div className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 bg-white/80 backdrop-blur-sm rounded-full shadow-lg border border-gray-200 hover:bg-white hover:shadow-xl transition-all duration-300">
            <Shield className="w-4 h-4 text-blue-600 mr-2" />
            <span className="text-sm text-gray-600 font-medium">
              Your data is secure and encrypted
            </span>
          </div>
        </div>
      </div>

      <style jsx>{`
        .hover\:scale-102:hover {
          transform: scale(1.02);
        }
        
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-slideInRight {
          animation: slideInRight 0.5s ease-out;
        }
        
        .animate-slideInUp {
          animation: slideInUp 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default EditProfileNavigation;