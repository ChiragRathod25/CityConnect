import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Loader } from 'lucide-react';

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: '1',
      role: 'assistant',
      content: "👋 Hello! I'm your AI assistant. I'm here to help answer your questions and assist you with various tasks. Feel free to ask me anything!\n\nSome things I can help with:\n• General knowledge questions\n• Problem-solving\n• Information research\n• Creative ideas\n• And much more!\n\nWhat can I help you with today?",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const API_KEY = import.meta.env.VITE_GROQ_API_KEY;

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue.trim(),
      timestamp: new Date(),
    };

    const currentInput = inputValue.trim();
    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const chatHistory = messages.map((msg) => ({
        role: msg.role === 'assistant' ? 'assistant' : 'user',
        content: msg.content,
      }));

      chatHistory.push({
        role: 'user',
        content: currentInput,
      });

      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: chatHistory,
          temperature: 0.7,
          max_tokens: 2048,
          top_p: 1,
          stream: false
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error.message || 'API Error');
      }

      const aiResponse = data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content 
        ? data.choices[0].message.content 
        : 'Sorry, I could not generate a response.';
      
      const aiMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      
      const errorMsg = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `❌ Sorry! I encountered an error: ${error.message || 'Unknown error'}. Please try again.`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="pointer-events-auto fixed bottom-28 right-4 sm:bottom-24 sm:right-6 w-[calc(100vw-2rem)] h-[calc(100vh-20rem)] sm:w-[420px] sm:h-[650px] max-h-[calc(100vh-8rem)] bg-[#d1d5db] rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] flex flex-col overflow-hidden"
            style={{ 
              boxShadow: '0 10px 40px -10px rgba(0,0,0,0.2), 0 0 0 1px rgba(0,0,0,0.05)'
            }}
          >
            {/* Messages Container - Full height with padding for input */}
            <div className="flex-1 overflow-y-auto px-3 pt-3 pb-28 sm:px-5 sm:pt-5 sm:pb-32 space-y-3 sm:space-y-4 bg-[#d1d5db]">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] sm:max-w-[80%] px-3 py-2 sm:px-4 sm:py-2.5 rounded-2xl ${
                      message.role === 'user'
                        ? 'bg-[#6b7280] text-white rounded-br-md shadow-sm'
                        : 'bg-white text-[#1f2937] rounded-bl-md shadow-sm'
                    }`}
                  >
                    <p className="text-xs sm:text-[13px] leading-relaxed whitespace-pre-wrap break-words">
                      {message.content}
                    </p>
                    <p className={`text-[10px] sm:text-[11px] mt-1 sm:mt-1.5 ${
                      message.role === 'user' ? 'text-white/60' : 'text-[#9ca3af]'
                    }`}>
                      {message.timestamp.toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </motion.div>
              ))}

              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="bg-white px-3 py-2 sm:px-4 sm:py-2.5 rounded-2xl rounded-bl-md flex items-center gap-2 shadow-sm">
                    <Loader className="w-3 h-3 sm:w-3.5 sm:h-3.5 animate-spin text-[#6b7280]" />
                    <p className="text-xs sm:text-[13px] text-[#6b7280]">Thinking...</p>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Area - Fixed at bottom */}
            <div className="absolute bottom-0 left-0 right-0 bg-[#d1d5db] px-3 pb-3 pt-3 sm:px-5 sm:pb-5 sm:pt-4">
              <div className="flex gap-2 sm:gap-2.5 items-center">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  disabled={isLoading}
                  className="flex-1 px-3 py-2.5 sm:px-4 sm:py-3 rounded-full bg-white/80 backdrop-blur-sm border-0 focus:outline-none focus:ring-2 focus:ring-[#6b7280]/30 text-xs sm:text-[13px] placeholder-[#9ca3af] disabled:opacity-60 transition-all text-[#1f2937] shadow-sm"
                />
                <button
                  onClick={sendMessage}
                  disabled={isLoading || !inputValue.trim()}
                  className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#6b7280] text-white flex items-center justify-center hover:bg-[#4b5563] disabled:opacity-50 disabled:hover:bg-[#6b7280] transition-all shadow-md flex-shrink-0"
                  title="Send message"
                >
                  <Send className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                </button>
              </div>
              <p className="text-[10px] sm:text-[11px] text-[#6b7280] mt-1.5 sm:mt-2 text-center">
                Press Enter to send
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`pointer-events-auto fixed bottom-20 right-4 sm:bottom-6 sm:right-6 w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center shadow-xl text-white transition-all ${
          isOpen
            ? 'bg-[#4b5563] hover:bg-[#374151]'
            : 'bg-[#6b7280] hover:bg-[#4b5563]'
        }`}
        style={{
          boxShadow: isOpen 
            ? '0 8px 25px -5px rgba(75, 85, 99, 0.4)' 
            : '0 10px 30px -5px rgba(107, 114, 128, 0.5)'
        }}
        title={isOpen ? 'Close chatbot' : 'Open chatbot'}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2.5} />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2.5} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}