import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  X,
  Filter,
  ChevronDown,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Eye,
  Ban,
  CheckCircle,
  Mail,
  Phone,
  Calendar,
  User,
  MapPin,
  Shield,
  AlertTriangle,
  ExternalLink,
  Save,
} from "lucide-react";
import MoveBackButton from "@/components/ui/MoveBackButton";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Assuming axios is installed, otherwise use fetch
import databaseService from "@/services/database.services";

// --- Sub-Components ---

const SearchInput = ({
  searchTerm,
  setSearchTerm,
  suggestions,
  showSuggestions,
  setShowSuggestions,
  onSuggestionClick,
}) => (
  <div className="relative flex-1 max-w-2xl">
    <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 z-10" />
    <input
      type="text"
      placeholder="Search users..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      onFocus={() => setShowSuggestions(true)}
      className="w-full pl-14 pr-12 py-4 bg-white/70 backdrop-blur-sm border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-gray-500/20 focus:border-gray-500 placeholder-gray-400 font-medium transition-all duration-300 shadow-lg"
    />
    {searchTerm && (
      <button
        onClick={() => {
          setSearchTerm("");
          setShowSuggestions(false);
        }}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
      >
        <X className="w-5 h-5" />
      </button>
    )}
    {showSuggestions && suggestions.length > 0 && (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute top-full left-0 right-0 mt-2 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-xl shadow-xl z-50"
      >
        {suggestions.map((suggestion, index) => (
          <button
            key={index}
            onClick={() => onSuggestionClick(suggestion)}
            className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors first:rounded-t-xl last:rounded-b-xl border-b border-gray-100 last:border-b-0"
          >
            <div className="flex items-center gap-3">
              <Search className="w-4 h-4 text-gray-400" />
              <span className="text-gray-700 font-medium">{suggestion}</span>
            </div>
          </button>
        ))}
      </motion.div>
    )}
  </div>
);

const FilterDropdown = ({ value, setValue, options, className = "" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const currentOption =
    options.find((opt) => opt.value === value) || options[0];
  const CurrentIcon = currentOption?.icon || Filter;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-6 py-4 bg-white/70 backdrop-blur-sm border-2 border-gray-200 rounded-2xl hover:border-gray-300 focus:outline-none focus:ring-4 focus:ring-gray-500/20 focus:border-gray-500 font-medium text-gray-700 transition-all duration-300 shadow-lg min-w-[180px]"
      >
        <CurrentIcon className="w-5 h-5" />
        <span>{currentOption?.label}</span>
        <ChevronDown
          className={`w-4 h-4 transition-transform duration-200 ml-auto ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden"
          >
            {options.map((option) => {
              const IconComponent = option.icon;
              return (
                <button
                  key={option.value}
                  onClick={() => {
                    setValue(option.value);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0 ${
                    value === option.value
                      ? "bg-gray-50 text-gray-700"
                      : "text-gray-700"
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                  <span className="font-medium">{option.label}</span>
                  {value === option.value && (
                    <div className="w-2 h-2 bg-gray-500 rounded-full ml-auto"></div>
                  )}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Pagination = ({ currentPage, totalPages, setCurrentPage }) => {
  // ... (Existing Pagination logic remains unchanged)
  // For brevity, using the same logic as your provided code
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4 mt-12">
        <button
         onClick={() => handlePageChange(currentPage - 1)}
         disabled={currentPage === 1}
         className="p-3 rounded-xl bg-white border border-gray-200 shadow-sm disabled:opacity-50"
        >
            <ChevronLeftIcon className="w-5 h-5"/>
        </button>
        <span className="font-medium text-gray-700">Page {currentPage} of {totalPages}</span>
        <button
         onClick={() => handlePageChange(currentPage + 1)}
         disabled={currentPage === totalPages}
         className="p-3 rounded-xl bg-white border border-gray-200 shadow-sm disabled:opacity-50"
        >
            <ChevronRightIcon className="w-5 h-5"/>
        </button>
    </div>
  );
};

const StatusBadge = ({ status }) => {
  const statusConfig = {
    active: {
      color: "text-green-700",
      bg: "bg-green-100",
      icon: CheckCircle,
      text: "Active",
    },
    pending_verification: {
        color: "text-blue-700",
        bg: "bg-blue-100",
        icon: Shield,
        text: "Pending",
    },
    suspended: {
      color: "text-yellow-700",
      bg: "bg-yellow-100",
      icon: AlertTriangle,
      text: "Suspended",
    },
    blocked: {
      color: "text-red-700",
      bg: "bg-red-100",
      icon: Ban,
      text: "Blocked",
    },
  };

  const config = statusConfig[status] || statusConfig.active;
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${config.bg} ${config.color}`}
    >
      <Icon className="w-4 h-4" />
      {config.text}
    </span>
  );
};

// --- Updated UserDetailsModal ---
const UserDetailsModal = ({ user, isOpen, onClose, onStatusChange }) => {
  const navigate = useNavigate();
  const [currentStatus, setCurrentStatus] = useState(user?.status);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (user) setCurrentStatus(user.status);
  }, [user]);

  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "unset";
    return () => (document.body.style.overflow = "unset");
  }, [isOpen]);

  if (!isOpen || !user) return null;

  const handleSaveStatus = async () => {
    setIsUpdating(true);
    console.log("Updating status for user:", user.id, "to", currentStatus);
    await onStatusChange(user.id, currentStatus);
    setIsUpdating(false);
    onClose();
  };

  const navigateToFullProfile = () => {
    navigate(`/user/${user.id}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-md"
        onClick={onClose}
      ></div>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden border border-gray-200 flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="bg-gray-900 px-6 py-4 flex items-center justify-between shrink-0">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <User className="w-5 h-5" />
            User Details
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-2 rounded-full hover:bg-gray-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content - Scrollable */}
        <div className="p-6 overflow-y-auto">
            {/* Header Info */}
            <div className="flex items-start gap-4 mb-6">
                <img 
                    src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=random`} 
                    alt={user.name} 
                    className="w-20 h-20 rounded-2xl object-cover shadow-md border-2 border-gray-100"
                />
                <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-800">{user.name}</h3>
                    <p className="text-gray-500 font-medium">@{user.username}</p>
                    <div className="flex gap-2 mt-2">
                        <StatusBadge status={user.status} />
                        <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm font-medium capitalize">
                            {user.role}
                        </span>
                    </div>
                </div>
            </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 block">Contact Info</label>
                <div className="space-y-3 mt-2">
                    <div className="flex items-center gap-2 text-gray-700">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span className="truncate">{user.email}</span>
                        {user.isEmailVerified && <CheckCircle className="w-3 h-3 text-green-500" />}
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span>{user.phone || 'N/A'}</span>
                        {user.isPhoneVerified && <CheckCircle className="w-3 h-3 text-green-500" />}
                    </div>
                </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                 <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 block">Personal Info</label>
                 <div className="space-y-3 mt-2">
                    <div className="flex items-center gap-2 text-gray-700">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span>{user.city}</span>
                    </div>
                     <div className="flex items-center gap-2 text-gray-700">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span>Joined: {new Date(user.joinDate).toLocaleDateString()}</span>
                    </div>
                 </div>
            </div>
          </div>

          {/* Admin Controls Section */}
          <div className="border-t border-gray-200 pt-6">
            <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-gray-500" />
                Admin Controls
            </h4>
            
            <div className="bg-blue-50/50 rounded-2xl p-5 border border-blue-100">
                <div className="flex flex-col sm:flex-row items-end gap-4">
                    <div className="flex-1 w-full">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Account Status
                        </label>
                        <select
                            value={currentStatus}
                            onChange={(e) => setCurrentStatus(e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-300 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                        >
                            <option value="pending_verification">Pending Verification</option>
                            <option value="active">Active</option>
                            <option value="suspended">Suspended</option>
                            <option value="blocked">Blocked</option>
                        </select>
                    </div>
                    
                    <button
                        onClick={handleSaveStatus}
                        disabled={isUpdating || currentStatus === user.status}
                        className={`px-6 py-2.5 rounded-xl font-medium flex items-center justify-center gap-2 transition-all ${
                            isUpdating || currentStatus === user.status
                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg'
                        }`}
                    >
                        {isUpdating ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <Save className="w-4 h-4" />
                        )}
                        Update Status
                    </button>
                </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 shrink-0">
             <button
                onClick={navigateToFullProfile}
                className="flex items-center gap-2 px-5 py-2.5 bg-white border-2 border-gray-200 text-gray-700 rounded-xl font-medium hover:border-gray-400 hover:text-gray-900 transition-all"
            >
                <ExternalLink className="w-4 h-4" />
                View Full Profile
            </button>
            <button
                onClick={onClose}
                className="px-5 py-2.5 bg-gray-800 text-white rounded-xl font-medium hover:bg-gray-900 transition-all shadow-md"
            >
                Close
            </button>
        </div>
      </motion.div>
    </div>
  );
};

// --- Main Component ---

export default function AdminUserManagement() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [sortBy, setSortBy] = useState("name");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const usersPerPage = 10;
  

  // Fetch Users from API
  useEffect(() => {
    const loadUsers = async () => {
        try {
            setIsLoading(true);
            const response = await databaseService.getAllUsers();
            console.log("Fetched users:", response);
            if (response.success) {
                // Map API data to component structure
                const mappedUsers = response.data.map(u => ({
                    id: u._id,
                    name: `${u.firstName || ''} ${u.lastName || ''}`.trim() || u.username,
                    email: u.email,
                    username: u.username,
                    phone: u.phoneNumber,
                    avatar: u.avatar,
                    city: "Not Set", // API doesn't seem to have city, handle fallback
                    status: u.status,
                    role: u.role,
                    isEmailVerified: u.isEmailVerified,
                    isPhoneVerified: u.isPhoneVerified,
                    dob: null, 
                    joinDate: u.createdAt,
                }));
                setUsers(mappedUsers);
            }
        } catch (error) {
            console.error("Failed to fetch users", error);
        } finally {
            setIsLoading(false);
        }
    };
    loadUsers();
  }, []);

  // Handle Status Update via Service
  const handleStatusUpdate = async (userId, newStatus) => {
    try {
        console.log("Updating status for user ID:", userId, "to", newStatus);
        const response = await databaseService.updateUserStatus(userId, newStatus);
        console.log("Status update response:", response);
        
        // Optimistic UI update or fetch again
        setUsers(prevUsers => prevUsers.map(u => 
            u.id === userId ? { ...u, status: newStatus } : u
        ));

        // Update selectedUser if modal is open to reflect change immediately
        if (selectedUser && selectedUser.id === userId) {
            setSelectedUser(prev => ({ ...prev, status: newStatus }));
        }

        // alert("Status updated successfully"); // Replace with toast notification
    } catch (error) {
        console.error("Failed to update status", error);
        alert("Failed to update status");
    }
  };

  // Sort options
  const sortOptions = [
    { value: "name", label: "Sort by Name", icon: User },
    { value: "blocked", label: "Blocked Users", icon: Ban },
  ];

  // Filter and sort users
  const filteredUsers = users
    .filter(
      (user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.username.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((user) => {
      if (sortBy === "blocked") return user.status === "blocked";
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      return 0;
    });

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const startIndex = (currentPage - 1) * usersPerPage;
  const currentUsers = filteredUsers.slice(startIndex, startIndex + usersPerPage);

  // Search suggestions
  const suggestions = searchTerm.length > 0
    ? [...new Set(users
        .filter(user => user.name.toLowerCase().includes(searchTerm.toLowerCase()))
        .slice(0, 5)
        .map(user => user.name)
      )]
    : [];

  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion);
    setShowSuggestions(false);
  };

  const handleViewDetails = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleBackToProfile = () => {
    navigate("/admin");
  };

  return (
    <div className="min-h-screen py-5 bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto mb-5">
         <MoveBackButton onClick={handleBackToProfile} />
      </div>
      
      <div className="max-w-7xl pb-10 mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 sm:mb-10 text-center"
        >
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-800">User Management</h1>
          <p className="text-gray-600 mt-2">Manage user accounts and permissions</p>
        </motion.div>

        {/* Search and Filter */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4 items-center justify-center max-w-4xl mx-auto">
          <SearchInput
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            suggestions={suggestions}
            showSuggestions={showSuggestions}
            setShowSuggestions={setShowSuggestions}
            onSuggestionClick={handleSuggestionClick}
          />
          <FilterDropdown
            value={sortBy}
            setValue={setSortBy}
            options={sortOptions}
          />
        </div>

        {/* Loading State */}
        {isLoading ? (
            <div className="flex justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
        ) : (
        <>
            {/* Stats Cards - Simplified for brevity */}
            <div className="mb-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
                 <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                    <div className="text-gray-500 text-sm font-medium">Total Users</div>
                    <div className="text-2xl font-bold text-gray-800">{users.length}</div>
                 </div>
                 <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                    <div className="text-gray-500 text-sm font-medium">Active</div>
                    <div className="text-2xl font-bold text-green-600">{users.filter(u => u.status === 'active').length}</div>
                 </div>
                 {/* Add more stats as needed */}
            </div>

            {/* Table */}
            <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-white/20"
            >
            <div className="overflow-x-auto">
                <table className="w-full">
                <thead className="bg-gray-800 text-white">
                    <tr>
                    <th className="px-6 py-4 text-left font-semibold">User</th>
                    <th className="px-6 py-4 text-left font-semibold">Contact</th>
                    <th className="px-6 py-4 text-left font-semibold">Role</th>
                    <th className="px-6 py-4 text-left font-semibold">Status</th>
                    <th className="px-6 py-4 text-center font-semibold">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {currentUsers.map((user, index) => (
                    <motion.tr
                        key={user.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.05 }}
                        className="border-b border-gray-100 hover:bg-gray-50"
                    >
                        <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                                <img 
                                    src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=random`} 
                                    alt="" 
                                    className="w-10 h-10 rounded-full bg-gray-200 object-cover"
                                />
                                <div>
                                    <div className="font-semibold text-gray-800">{user.name}</div>
                                    <div className="text-xs text-gray-500">@{user.username}</div>
                                </div>
                            </div>
                        </td>
                        <td className="px-6 py-4">
                            <div className="text-sm text-gray-700">{user.email}</div>
                            <div className="text-xs text-gray-500">{user.phone || 'No phone'}</div>
                        </td>
                         <td className="px-6 py-4">
                             <span className="capitalize px-2 py-1 bg-gray-100 rounded text-xs font-medium text-gray-600">
                                {user.role}
                             </span>
                        </td>
                        <td className="px-6 py-4">
                            <StatusBadge status={user.status} />
                        </td>
                        <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                            <button
                                onClick={() => handleViewDetails(user)}
                                className="flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors font-medium text-sm"
                            >
                                <Eye className="w-4 h-4" />
                                <span>Details & Manage</span>
                            </button>
                        </div>
                        </td>
                    </motion.tr>
                    ))}
                </tbody>
                </table>
            </div>
            
            {/* Mobile View Placeholder (List view) */}
            <div className="md:hidden p-4 space-y-4">
                 {currentUsers.map(user => (
                     <div key={user.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-200" onClick={() => handleViewDetails(user)}>
                         <div className="flex justify-between items-start mb-2">
                             <div className="flex gap-3">
                                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-lg font-bold text-gray-500">
                                    {user.name.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-800">{user.name}</h3>
                                    <p className="text-xs text-gray-500">{user.email}</p>
                                </div>
                             </div>
                             <StatusBadge status={user.status} />
                         </div>
                         <button className="w-full mt-2 py-2 bg-gray-50 text-gray-600 text-sm font-medium rounded-lg">
                             View Details
                         </button>
                     </div>
                 ))}
            </div>

            {currentUsers.length === 0 && (
                 <div className="text-center py-10 text-gray-500">No users found.</div>
            )}
            </motion.div>

            {totalPages > 1 && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    setCurrentPage={setCurrentPage}
                />
            )}
        </>
        )}
      </div>

      <AnimatePresence>
        {showModal && (
          <UserDetailsModal
            user={selectedUser}
            isOpen={showModal}
            onClose={() => setShowModal(false)}
            onStatusChange={handleStatusUpdate}
          />
        )}
      </AnimatePresence>
    </div>
  );
}