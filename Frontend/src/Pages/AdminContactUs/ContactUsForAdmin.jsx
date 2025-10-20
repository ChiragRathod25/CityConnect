import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  X,
  Mail,
  Phone,
  MessageSquare,
  Calendar,
  Search,
} from "lucide-react";
import MoveBackButton from "@/components/ui/MoveBackButton";

// Pagination Component
const Pagination = ({ currentPage, totalPages, setCurrentPage }) => {
  const [inputPage, setInputPage] = useState(currentPage.toString());

  const handlePageChange = (page) => {
    setCurrentPage(page);
    setInputPage(page.toString());
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputPage(value);

    const pageNum = parseInt(value);
    if (pageNum >= 1 && pageNum <= totalPages) {
      setCurrentPage(pageNum);
    }
  };

  const handleInputKeyPress = (e) => {
    if (e.key === "Enter") {
      const pageNum = parseInt(inputPage);
      if (pageNum >= 1 && pageNum <= totalPages) {
        handlePageChange(pageNum);
      } else {
        setInputPage(currentPage.toString());
      }
    }
  };

  return (
    <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4 mt-12">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-white/80 backdrop-blur-sm border-2 border-gray-200 text-gray-600 shadow-lg sm:shadow-xl transition-all duration-300 ${
          currentPage === 1
            ? "opacity-50 cursor-not-allowed"
            : "hover:border-gray-400 hover:bg-white hover:shadow-xl sm:hover:shadow-2xl transform hover:-translate-y-1"
        } w-full sm:w-auto`}
      >
        <div className="flex items-center justify-center gap-2">
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          <span className="sm:hidden font-medium">Previous</span>
        </div>
      </motion.button>

      <div className="flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-3 sm:py-4 bg-white/80 backdrop-blur-sm border-2 border-gray-200 rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl w-full sm:w-auto justify-center">
        <span className="text-gray-700 text-base sm:text-lg font-medium sm:font-semibold whitespace-nowrap">
          Page
        </span>
        <input
          type="text"
          min="1"
          max={totalPages}
          value={inputPage}
          onChange={handleInputChange}
          onKeyPress={handleInputKeyPress}
          onBlur={() => {
            const pageNum = parseInt(inputPage);
            if (isNaN(pageNum) || pageNum < 1 || pageNum > totalPages) {
              setInputPage(currentPage.toString());
            }
          }}
          className="w-16 sm:w-20 text-center border-2 border-gray-300 rounded-lg sm:rounded-xl px-2 sm:px-3 py-1 sm:py-2 text-base sm:text-lg font-semibold sm:font-bold text-gray-800 focus:outline-none focus:border-gray-500 focus:ring-4 focus:ring-gray-500/20 shadow-inner"
        />
        <span className="text-gray-700 text-base sm:text-lg font-medium sm:font-semibold whitespace-nowrap">
          of {totalPages}
        </span>
      </div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-white/80 backdrop-blur-sm border-2 border-gray-200 text-gray-600 shadow-lg sm:shadow-xl transition-all duration-300 ${
          currentPage === totalPages
            ? "opacity-50 cursor-not-allowed"
            : "hover:border-gray-400 hover:bg-white hover:shadow-xl sm:hover:shadow-2xl transform hover:-translate-y-1"
        } w-full sm:w-auto`}
      >
        <div className="flex items-center justify-center gap-2">
          <span className="sm:hidden font-medium">Next</span>
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>
      </motion.button>
    </div>
  );
};

// Main Admin Dashboard
const ContactMessagesAdmin = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const messagesPerPage = 6;

  // Mock data - Replace with API call
  const [allMessages] = useState([
    {
      _id: "1",
      name: "John Doe",
      email: "john@example.com",
      phone: "9876543210",
      subject: "Website Design Inquiry",
      message:
        "I'm interested in your web design services. Can you provide more details about your pricing and timeline for a complete website redesign?",
      createdAt: "2025-01-15T10:30:00",
      updatedAt: "2025-01-15T10:30:00",
    },
    {
      _id: "2",
      name: "Sarah Johnson",
      email: "sarah@company.com",
      phone: "8765432109",
      subject: "Partnership Proposal",
      message:
        "We'd like to explore partnership opportunities. Our company specializes in digital marketing and we see great synergy with your services.",
      createdAt: "2025-01-14T14:20:00",
      updatedAt: "2025-01-14T14:20:00",
    },
    {
      _id: "3",
      name: "Mike Wilson",
      email: "mike.w@email.com",
      phone: "7654321098",
      subject: "Technical Support Request",
      message:
        "I'm experiencing issues with the contact form submission. The form doesn't seem to be working properly on mobile devices.",
      createdAt: "2025-01-13T09:15:00",
      updatedAt: "2025-01-13T09:15:00",
    },
    {
      _id: "4",
      name: "Emma Davis",
      email: "emma.davis@mail.com",
      phone: "6543210987",
      subject: "General Feedback",
      message:
        "Your website looks amazing! The design is modern and user-friendly. Just wanted to share some positive feedback.",
      createdAt: "2025-01-12T16:45:00",
      updatedAt: "2025-01-12T16:45:00",
    },
    {
      _id: "5",
      name: "Robert Brown",
      email: "robert.b@domain.com",
      phone: "5432109876",
      subject: "Enterprise Solutions",
      message:
        "Do you offer enterprise solutions? We have a team of 50+ people and need a comprehensive digital platform.",
      createdAt: "2025-01-11T11:30:00",
      updatedAt: "2025-01-11T11:30:00",
    },
    {
      _id: "6",
      name: "Lisa Anderson",
      email: "lisa@example.org",
      phone: "4321098765",
      subject: "Meeting Request",
      message:
        "I'd like to schedule a meeting to discuss potential collaboration on an upcoming project.",
      createdAt: "2025-01-10T13:00:00",
      updatedAt: "2025-01-10T13:00:00",
    },
    {
      _id: "7",
      name: "David Lee",
      email: "david.lee@company.net",
      phone: "3210987654",
      subject: "Bug Report",
      message:
        "Found a bug in the checkout process. The payment gateway doesn't accept certain credit card types.",
      createdAt: "2025-01-09T15:20:00",
      updatedAt: "2025-01-09T15:20:00",
    },
    {
      _id: "8",
      name: "Anna Martinez",
      email: "anna.m@business.com",
      phone: "2109876543",
      subject: "Quote Request",
      message:
        "Could you provide a detailed quote for developing a mobile application for iOS and Android?",
      createdAt: "2025-01-08T10:10:00",
      updatedAt: "2025-01-08T10:10:00",
    },
    {
      _id: "9",
      name: "James Taylor",
      email: "james.t@email.co",
      phone: "1098765432",
      subject: "Consultation Inquiry",
      message:
        "Interested in a consultation session to discuss our digital transformation strategy.",
      createdAt: "2025-01-07T14:30:00",
      updatedAt: "2025-01-07T14:30:00",
    },
  ]);

  const filteredMessages = allMessages.filter(
    (msg) =>
      msg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredMessages.length / messagesPerPage);
  const indexOfLastMessage = currentPage * messagesPerPage;
  const indexOfFirstMessage = indexOfLastMessage - messagesPerPage;
  const currentMessages = filteredMessages.slice(
    indexOfFirstMessage,
    indexOfLastMessage
  );

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleBackToProfile = () => {
    navigate("/admin");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] via-[#e2e8f0] to-[#f3f4f6] pb-20 pt-4  px-4 sm:px-6 lg:px-8">
      <div className="relative mb-5 sm:mb-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <MoveBackButton onClick={handleBackToProfile} />
          </div>
        </div>
      </div>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 sm:mb-10 text-center"
        >
          <div className="flex flex-col items-center justify-center mb-2">
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-16 h-16 p-3 bg-[#1f2937] rounded-2xl shadow-xl"
            >
              <MessageSquare className="w-10 h-10 animate-pulse text-[#9ca3af]" />
            </motion.div>
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-3xl pt-4 lg:text-4xl font-bold text-[#1f2937]"
            >
              Contact Messages
            </motion.h1>
          </div>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-[#6b7280] text-md sm:text-base lg:text-lg max-w-2xl mx-auto"
          >
            View and manage customer inquiries
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6 mb-8 sm:mb-10"
        >
          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
          >
            <div className="relative group">
              <input
                type="text"
                placeholder="Search by name, email, or subject..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-12 sm:pl-14 px-6 sm:px-7 py-4 sm:py-5 pr-14 sm:pr-16 text-base sm:text-lg rounded-2xl sm:rounded-3xl bg-white/90 backdrop-blur-md border-2 border-[#e2e8f0] text-[#1f2937] placeholder-[#9ca3af] focus:outline-none focus:border-[#6b7280] focus:ring-4 focus:ring-[#6b7280]/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:bg-white"
              />
              <div className="absolute left-5 sm:left-6 top-1/2 -translate-y-1/2 text-[#9ca3af] group-focus-within:text-[#6b7280] transition-colors duration-300">
                <Search className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 100 }}
          >
            <div className="bg-white/70 backdrop-blur-md rounded-2xl sm:rounded-3xl p-5 sm:p-7 shadow-2xl border-2 border-[#e2e8f0] hover:shadow-[0_20px_50px_rgba(0,0,0,0.15)] transition-all duration-300 h-full">
              <div className="flex items-center justify-between h-full">
                <div>
                  <p className="text-[#6b7280] text-sm sm:text-base mb-2 font-medium">
                    Total Messages
                  </p>
                  <p className="text-3xl sm:text-4xl font-bold text-[#1f2937]">
                    {filteredMessages.length}
                  </p>
                </div>
                <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl bg-gradient-to-br from-[#1f2937] to-[#374151] flex items-center justify-center shadow-lg">
                  <MessageSquare className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Messages Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
        >
          <AnimatePresence mode="popLayout">
            {currentMessages.map((message, index) => (
              <motion.div
                key={message._id}
                layout
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -20 }}
                transition={{
                  delay: index * 0.05,
                  type: "spring",
                  stiffness: 300,
                  damping: 25,
                }}
                whileHover={{ y: -8, scale: 1.02 }}
                onClick={() => setSelectedMessage(message)}
                className="group bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-5 sm:p-7 shadow-lg hover:shadow-2xl cursor-pointer border-2 border-[#e2e8f0] hover:border-[#d1d5db] transition-all duration-300"
              >
                <div className="flex justify-between items-start mb-4 sm:mb-5">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg sm:text-xl text-[#1f2937] mb-1 group-hover:text-[#374151] transition-colors">
                      {message.name}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs sm:text-sm text-[#9ca3af]">
                      <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      <span>{formatDate(message.createdAt)}</span>
                    </div>
                  </div>
                </div>

                <div className="mb-4 sm:mb-5">
                  <h4 className="font-semibold text-base sm:text-lg text-[#374151] mb-2 line-clamp-1">
                    {message.subject}
                  </h4>
                  <p className="text-[#6b7280] text-sm sm:text-base line-clamp-2 leading-relaxed">
                    {message.message}
                  </p>
                </div>

                <div className="space-y-2 sm:space-y-3 pt-4 sm:pt-5 border-t-2 border-[#f3f4f6]">
                  <div className="flex items-center gap-2.5 sm:gap-3 text-xs sm:text-sm">
                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#f3f4f6] flex items-center justify-center flex-shrink-0">
                      <Mail className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-[#6b7280]" />
                    </div>
                    <span className="text-[#374151] truncate font-medium">
                      {message.email}
                    </span>
                  </div>
                  <div className="flex items-center gap-2.5 sm:gap-3 text-xs sm:text-sm">
                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#f3f4f6] flex items-center justify-center flex-shrink-0">
                      <Phone className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-[#6b7280]" />
                    </div>
                    <span className="text-[#374151] font-medium">
                      {message.phone}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* No Results */}
        {currentMessages.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 sm:py-20"
          >
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#f3f4f6] mx-auto mb-4 sm:mb-6 flex items-center justify-center">
              <MessageSquare className="w-10 h-10 sm:w-12 sm:h-12 text-[#9ca3af]" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-[#374151] mb-2">
              No messages found
            </h3>
            <p className="text-[#6b7280]">Try adjusting your search</p>
          </motion.div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
          />
        )}

        {/* Message Modal */}
        <AnimatePresence>
          {selectedMessage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-[#000000]/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
              onClick={() => setSelectedMessage(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                transition={{ type: "spring", damping: 25 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-3xl sm:rounded-[2.5rem] p-6 sm:p-10 max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border-2 border-[#e2e8f0]"
              >
                <div className="flex justify-between items-start mb-6 sm:mb-8">
                  <div>
                    <h2 className="text-2xl sm:text-4xl font-bold text-[#1f2937] mb-2">
                      {selectedMessage.name}
                    </h2>
                    <div className="flex items-center gap-2 text-sm sm:text-base text-[#6b7280]">
                      <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span>{formatDate(selectedMessage.createdAt)}</span>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setSelectedMessage(null)}
                    className="p-2.5 sm:p-3 hover:bg-[#f3f4f6] rounded-xl sm:rounded-2xl transition-all duration-300"
                  >
                    <X className="w-6 h-6 sm:w-7 sm:h-7 text-[#6b7280]" />
                  </motion.button>
                </div>

                <div className="space-y-5 sm:space-y-6">
                  <div className="bg-[#f8fafc] rounded-2xl sm:rounded-3xl p-4 sm:p-6 border-2 border-[#e2e8f0]">
                    <label className="text-xs sm:text-sm font-bold text-[#9ca3af] uppercase tracking-wider mb-2 block">
                      Email
                    </label>
                    <p className="text-base sm:text-lg text-[#1f2937] font-medium">
                      {selectedMessage.email}
                    </p>
                  </div>
                  <div className="bg-[#f8fafc] rounded-2xl sm:rounded-3xl p-4 sm:p-6 border-2 border-[#e2e8f0]">
                    <label className="text-xs sm:text-sm font-bold text-[#9ca3af] uppercase tracking-wider mb-2 block">
                      Phone
                    </label>
                    <p className="text-base sm:text-lg text-[#1f2937] font-medium">
                      {selectedMessage.phone}
                    </p>
                  </div>
                  <div className="bg-[#f8fafc] rounded-2xl sm:rounded-3xl p-4 sm:p-6 border-2 border-[#e2e8f0]">
                    <label className="text-xs sm:text-sm font-bold text-[#9ca3af] uppercase tracking-wider mb-2 block">
                      Subject
                    </label>
                    <p className="text-base sm:text-lg text-[#1f2937] font-semibold">
                      {selectedMessage.subject}
                    </p>
                  </div>
                  <div className="bg-[#f8fafc] rounded-2xl sm:rounded-3xl p-4 sm:p-6 border-2 border-[#e2e8f0]">
                    <label className="text-xs sm:text-sm font-bold text-[#9ca3af] uppercase tracking-wider mb-3 block">
                      Message
                    </label>
                    <p className="text-sm sm:text-base text-[#374151] leading-relaxed whitespace-pre-wrap">
                      {selectedMessage.message}
                    </p>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedMessage(null)}
                  className="w-full mt-6 sm:mt-8 px-6 sm:px-8 py-4 sm:py-5 bg-gradient-to-r from-[#1f2937] to-[#374151] text-white rounded-2xl sm:rounded-3xl font-bold text-base sm:text-lg hover:shadow-2xl transition-all duration-300"
                >
                  Close
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default ContactMessagesAdmin;
