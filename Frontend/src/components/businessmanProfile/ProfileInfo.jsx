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
  Camera,
  Briefcase,
  Calendar,
  Globe,
  Shield,
  CheckCircle,
  Upload,
  Download,
  Eye,
  Home,
  Truck,
  Edit3,
  Settings
} from 'lucide-react';
import Confetti from '../SimpleConfettie';
import { useNavigate } from 'react-router-dom';


const ProfileSection = ({ title, icon: Icon, children, className = "" }) => (
  <div className={`bg-white rounded-2xl shadow-lg border border-gray-200 p-4 sm:p-6 hover:shadow-xl transition-all duration-300 group ${className}`}>
    <div className="flex items-center space-x-3 mb-4 sm:mb-6">
      <div className="p-2.5 sm:p-3 bg-gray-800 text-white rounded-xl group-hover:bg-gray-700 transition-all duration-300">
        <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
      </div>
      <h2 className="text-lg sm:text-xl font-bold text-gray-800">{title}</h2>
    </div>
    {children}
  </div>
);

const InfoCard = ({ label, value, icon: Icon, type = "text", verified = false, className = "" }) => (
  <div className={`p-3 sm:p-4 bg-gray-50 rounded-xl border border-gray-200 hover:bg-gray-100 hover:shadow-md transition-all duration-300 group ${className}`}>
    <div className="flex items-start justify-between">
      <div className="flex items-center space-x-2 sm:space-x-3 flex-1">
        {Icon && (
          <div className="p-2 bg-gray-200 rounded-lg group-hover:bg-gray-300 transition-all duration-300">
            <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-600" />
          </div>
        )}
        <div className="flex-1">
          <p className="text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wide">{label}</p>
          <p className={`text-sm sm:text-base font-semibold text-gray-800 mt-1 ${type === 'email' ? 'break-all' : ''}`}>
            {value || 'Not provided'}
          </p>
        </div>
      </div>
      {verified && (
        <div className="ml-2 p-1 bg-green-100 rounded-full">
          <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
        </div>
      )}
    </div>
  </div>
);

const DocumentCard = ({ title, status, type, onView, onDownload, className = "" }) => {
  const statusColors = {
    verified: 'bg-green-100 text-green-800',
    pending: 'bg-yellow-100 text-yellow-800',
    required: 'bg-red-100 text-red-800'
  };

  return (
    <div className={`p-3 sm:p-4 bg-white border-2 border-gray-200 rounded-xl hover:border-gray-300 hover:shadow-lg transition-all duration-300 ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
          <h3 className="text-sm sm:text-base font-semibold text-gray-800">{title}</h3>
        </div>
        <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${statusColors[status]}`}>
          {status === 'verified' ? 'Verified' : status === 'pending' ? 'Pending' : 'Required'}
        </span>
      </div>
      
      <p className="text-xs sm:text-sm text-gray-600 mb-3">{type}</p>
      
      <div className="flex space-x-2">
        <button
          onClick={onView}
          className="flex-1 flex items-center justify-center space-x-1 sm:space-x-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors text-xs sm:text-sm font-medium"
        >
          <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
          <span>View</span>
        </button>
        <button
          onClick={onDownload}
          className="flex-1 flex items-center justify-center space-x-1 sm:space-x-2 px-3 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors text-xs sm:text-sm font-medium"
        >
          <Download className="w-3 h-3 sm:w-4 sm:h-4" />
          <span>Download</span>
        </button>
      </div>
    </div>
  );
};

const PaymentMethodBadge = ({ method, className = "" }) => (
  <div className={`inline-flex items-center space-x-2 px-3 sm:px-4 py-2 bg-gray-100 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-200 transition-all duration-300 ${className}`}>
    <CreditCard className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
    <span>{method}</span>
  </div>
);

const ServiceBadge = ({ service, available, icon: Icon, className = "" }) => (
  <div className={`flex items-center justify-between p-3 sm:p-4 rounded-xl border-2 transition-all duration-300 hover:shadow-md ${
    available 
      ? 'bg-green-50 border-green-200 hover:border-green-300' 
      : 'bg-gray-50 border-gray-200 hover:border-gray-300'
  } ${className}`}>
    <div className="flex items-center space-x-2 sm:space-x-3">
      <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${available ? 'text-green-600' : 'text-gray-400'}`} />
      <span className={`text-sm sm:text-base font-medium ${available ? 'text-green-800' : 'text-gray-600'}`}>
        {service}
      </span>
    </div>
    <div className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full ${available ? 'bg-green-500' : 'bg-gray-300'}`} />
  </div>
);

const BusinessmanProfileInfo = () => {
  const [activeTab, setActiveTab] = useState('personal');
  const [showConfetti, setShowConfetti] = useState(false);
  const navigate = useNavigate();

  // Trigger confetti on component mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowConfetti(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleEditButton = () => {
      navigate('edit-profile');
  }

  const profileData = {
    personal: {
      name: "Alex Johnson",
      email: "alex.johnson@business.com",
      phone: "+1 (555) 123-4567",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face"
    },
    business: {
      name: "Creative Digital Solutions",
      type: "Technology Services",
      category: "Software Development",
      experience: "5+ Years",
      description: "We specialize in creating innovative digital solutions for modern businesses. Our team focuses on user-centric design, cutting-edge technology, and delivering exceptional results that drive growth and success.",
      address: "123 Innovation Drive, Tech District, San Francisco, CA 94105",
      city: "San Francisco",
      state: "California",
      district: "Tech District",
      pincode: "94105",
      openingTime: "9:00 AM",
      closingTime: "6:00 PM",
      weeklyOff: "Sunday",
      paymentMethods: ["Cash", "Card", "UPI", "Net Banking", "Digital Wallet"],
      services: {
        delivery: { available: true, note: "Available for software delivery and setup" },
        homeService: { available: true, note: "On-site consultation and support available" }
      }
    },
    documents: {
      kyc: [
        { title: "Aadhaar Card", status: "verified", type: "Government ID Proof" },
        { title: "PAN Card", status: "verified", type: "Tax Identification" }
      ],
      business: [
        { title: "GST Certificate", status: "verified", type: "Business Registration" },
        { title: "Business License", status: "pending", type: "Operating License" }
      ],
      professional: [
        { title: "Professional Portfolio", status: "verified", type: "Work Samples & Certifications" }
      ]
    }
  };

  const tabs = [
    { id: 'personal', label: 'Personal Info', icon: User },
    { id: 'business', label: 'Business Details', icon: Building2 },
    { id: 'location', label: 'Location & Services', icon: MapPin },
    { id: 'documents', label: 'Documents', icon: FileText }
  ];

  const handleDocumentView = (docTitle) => {
    alert(`Viewing ${docTitle}`);
  };

  const handleDocumentDownload = (docTitle) => {
    alert(`Downloading ${docTitle}`);
  };

  return (
    <div className="min-h-screen ">
      <Confetti trigger={showConfetti} />
      
      <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
        
        {/* Header Profile Card */}
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-gray-200 overflow-hidden mb-6 sm:mb-8">
          <div className="relative bg-gradient-to-r from-gray-800 via-gray-700 to-gray-900 p-4 sm:p-6 lg:p-8">
            
            <div className="flex flex-col lg:flex-row items-center justify-between space-y-4 lg:space-y-0 lg:space-x-6">
              <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
                <div className="relative group">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 lg:w-32 lg:h-32 rounded-full overflow-hidden border-4 border-white/30 shadow-2xl group-hover:scale-105 transition-transform duration-300">
                    <img
                      src={profileData.personal.avatar}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 sm:w-7 sm:h-7 bg-green-500 border-4 border-white rounded-full">
                    <div className="w-full h-full bg-green-400 rounded-full animate-pulse" />
                  </div>
                  <div className="absolute inset-0 rounded-full bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-2">
                    <Camera className="w-4 h-4 text-white" />
                  </div>
                </div>
                
                <div className="flex-1 text-center sm:text-left text-white">
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2">
                    {profileData.personal.name}
                  </h1>
                  <p className="text-gray-200 mb-2 text-sm sm:text-base">
                    {profileData.business.name}
                  </p>
                  <div className="flex items-center justify-center sm:justify-start space-x-2 mb-4">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    <span className="text-gray-300 text-sm">Active Profile</span>
                  </div>
                  
                  {/* Edit Profile Button - Mobile */}
                  <div className="block lg:hidden">
                    <button
                      onClick={handleEditButton}
                      className="inline-flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/30 text-white rounded-lg transition-all duration-300 hover:scale-105"
                    >
                      <Edit3 className="w-4 h-4" />
                      <span className="text-sm font-medium">Edit Profile</span>
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Edit Profile Button - Desktop */}
              <div className="hidden lg:block">
                <button
                  onClick={handleEditButton}
                  className="inline-flex items-center space-x-2 px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/30 text-white rounded-xl transition-all duration-300 hover:scale-105"
                >
                  <Edit3 className="w-5 h-5" />
                  <span className="font-medium">Edit Profile</span>
                </button>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="bg-gray-50 border-t border-gray-200 relative overflow-hidden">
            {/* Active tab indicator */}
            <div 
              className="absolute bottom-0 h-1 bg-gray-800 transition-all duration-500 ease-out"
              style={{
                width: '25%',
                transform: `translateX(${tabs.findIndex(tab => tab.id === activeTab) * 100}%)`
              }}
            />
            
            <div className="flex overflow-x-auto scrollbar-hide">
              {tabs.map((tab, index) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 min-w-fit flex items-center justify-center space-x-2 px-4 sm:px-6 py-3 sm:py-4 text-sm font-medium transition-all duration-300 ${
                    activeTab === tab.id
                      ? 'text-gray-800 bg-white shadow-md'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content Sections */}
        <div className="space-y-4 sm:space-y-6">
          
          {/* Personal Information */}
          {activeTab === 'personal' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 animate-fadeIn">
              <ProfileSection title="Contact Information" icon={User}>
                <div className="space-y-3 sm:space-y-4">
                  <InfoCard 
                    label="Full Name" 
                    value={profileData.personal.name} 
                    icon={User}
                    verified={true}
                  />
                  <InfoCard 
                    label="Email Address" 
                    value={profileData.personal.email} 
                    icon={Mail}
                    type="email"
                    verified={true}
                  />
                  <InfoCard 
                    label="Contact Number" 
                    value={profileData.personal.phone} 
                    icon={Phone}
                    verified={true}
                  />
                </div>
              </ProfileSection>

              <ProfileSection title="Profile Status" icon={Shield}>
                <div className="space-y-3 sm:space-y-4">
                  <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <div>
                        <p className="font-semibold text-green-800">Profile Verified</p>
                        <p className="text-sm text-green-600">All documents verified successfully</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Email and Phone Verification Status */}
                  <div className="grid grid-cols-1 gap-3">
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Mail className="w-4 h-4 text-blue-600" />
                          <span className="text-sm font-medium text-blue-800">Email Verified</span>
                        </div>
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      </div>
                    </div>
                    
                    <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Phone className="w-4 h-4 text-purple-600" />
                          <span className="text-sm font-medium text-purple-800">Phone Verified</span>
                        </div>
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-center">
                      <p className="text-2xl font-bold text-gray-600">98%</p>
                      <p className="text-sm text-gray-600">Profile Complete</p>
                    </div>
                    <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-center">
                      <p className="text-2xl font-bold text-gray-600">5+</p>
                      <p className="text-sm text-gray-600">Years Active</p>
                    </div>
                  </div>
                </div>
              </ProfileSection>
            </div>
          )}

          {/* Business Details */}
          {activeTab === 'business' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 animate-fadeIn">
              <ProfileSection title="Business Information" icon={Building2}>
                <div className="space-y-3 sm:space-y-4">
                  <InfoCard 
                    label="Business Name" 
                    value={profileData.business.name} 
                    icon={Building2}
                  />
                  <InfoCard 
                    label="Business Type" 
                    value={profileData.business.type} 
                    icon={Briefcase}
                  />
                  <InfoCard 
                    label="Category" 
                    value={profileData.business.category} 
                    icon={Globe}
                  />
                  <InfoCard 
                    label="Experience" 
                    value={profileData.business.experience} 
                    icon={Calendar}
                  />
                </div>
              </ProfileSection>

              <ProfileSection title="Business Description" icon={FileText}>
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                    {profileData.business.description}
                  </p>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <h4 className="font-semibold text-gray-800 mb-3">Payment Methods</h4>
                  <div className="flex flex-wrap gap-2">
                    {profileData.business.paymentMethods.map((method, index) => (
                      <PaymentMethodBadge key={index} method={method} />
                    ))}
                  </div>
                </div>
              </ProfileSection>
            </div>
          )}

          {/* Location & Services */}
          {activeTab === 'location' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 animate-fadeIn">
              <ProfileSection title="Business Location" icon={MapPin}>
                <div className="space-y-3 sm:space-y-4">
                  <InfoCard 
                    label="Complete Address" 
                    value={profileData.business.address} 
                    icon={MapPin}
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <InfoCard 
                      label="City" 
                      value={profileData.business.city} 
                    />
                    <InfoCard 
                      label="State" 
                      value={profileData.business.state} 
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <InfoCard 
                      label="District" 
                      value={profileData.business.district} 
                    />
                    <InfoCard 
                      label="Pincode" 
                      value={profileData.business.pincode} 
                    />
                  </div>
                </div>
              </ProfileSection>

              <div className="space-y-4 sm:space-y-6">
                <ProfileSection title="Business Hours" icon={Clock}>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <InfoCard 
                      label="Opening Time" 
                      value={profileData.business.openingTime} 
                      icon={Clock}
                    />
                    <InfoCard 
                      label="Closing Time" 
                      value={profileData.business.closingTime} 
                      icon={Clock}
                    />
                    <InfoCard 
                      label="Weekly Off" 
                      value={profileData.business.weeklyOff} 
                      icon={Calendar}
                    />
                  </div>
                </ProfileSection>

                <ProfileSection title="Services Available" icon={Truck}>
                  <div className="space-y-3">
                    <ServiceBadge 
                      service="Home Service" 
                      available={profileData.business.services.homeService.available}
                      icon={Home}
                    />
                    <ServiceBadge 
                      service="Delivery Available" 
                      available={profileData.business.services.delivery.available}
                      icon={Truck}
                    />
                  </div>
                  
                  <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-700">
                      <strong>Service Notes:</strong> {profileData.business.services.homeService.note}
                    </p>
                  </div>
                </ProfileSection>
              </div>
            </div>
          )}

          {/* Documents */}
          {activeTab === 'documents' && (
            <div className="space-y-4 sm:space-y-6 animate-fadeIn">
              <ProfileSection title="KYC Documents" icon={Shield} className="bg-blue-50 border-blue-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {profileData.documents.kyc.map((doc, index) => (
                    <DocumentCard
                      key={index}
                      title={doc.title}
                      status={doc.status}
                      type={doc.type}
                      onView={() => handleDocumentView(doc.title)}
                      onDownload={() => handleDocumentDownload(doc.title)}
                    />
                  ))}
                </div>
              </ProfileSection>

              <ProfileSection title="Business Documents" icon={Building2} className="bg-yellow-50 border-yellow-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {profileData.documents.business.map((doc, index) => (
                    <DocumentCard
                      key={index}
                      title={doc.title}
                      status={doc.status}
                      type={doc.type}
                      onView={() => handleDocumentView(doc.title)}
                      onDownload={() => handleDocumentDownload(doc.title)}
                    />
                  ))}
                </div>
              </ProfileSection>

              <ProfileSection title="Professional Documents" icon={Briefcase} className="bg-green-50 border-green-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {profileData.documents.professional.map((doc, index) => (
                    <DocumentCard
                      key={index}
                      title={doc.title}
                      status={doc.status}
                      type={doc.type}
                      onView={() => handleDocumentView(doc.title)}
                      onDownload={() => handleDocumentDownload(doc.title)}
                    />
                  ))}
                </div>
              </ProfileSection>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 sm:mt-12 text-center">
          <div className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 bg-white/80 backdrop-blur-sm rounded-full shadow-lg border border-gray-200 hover:bg-white hover:shadow-xl transition-all duration-300">
            <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
            <span className="text-sm text-gray-600 font-medium">
              Profile last updated: {new Date().toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long', 
                day: 'numeric'
              })}
            </span>
          </div>
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
        
        .hover\:scale-102:hover {
          transform: scale(1.02);
        }
      `}</style>
    </div>
  );
};

export default BusinessmanProfileInfo;