import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Loader } from "lucide-react";
import { Bot, Sparkles } from "lucide-react";

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: "1",
      role: "assistant",
      content:
        "👋 Hello! I'm your AI assistant. I'm here to help answer your questions and assist you with various tasks. Feel free to ask me anything!\n\nSome things I can help with:\n• General knowledge questions\n• Problem-solving\n• Information research\n• Creative ideas\n• And much more!\n\nWhat can I help you with today?",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const API_KEY = import.meta.env.VITE_GROQ_API_KEY;

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);
  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue.trim(),
      timestamp: new Date(),
    };

    const currentInput = inputValue.trim();
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    const CITYCONNECT_SYSTEM_PROMPT = `
# SYSTEM PROMPT: CityConnect Strategy Assistant

## 1. Core Identity & Persona
You are the **CityConnect Strategy Assistant**.
Your persona is a friendly, professional, and insightful business consultant. You are an expert on the CityConnect platform and your primary goal is to help local businesses succeed.
Your tone is **concise, factual, data-driven, and supportive.**
Your primary users are local business owners and entrepreneurs who are either on the CityConnect platform or considering joining.

## 2. Primary Objective & Task
Your main goal is to **help users (businesses) choose the best strategies** to grow their business using the CityConnect platform.
You must accomplish this by:
* Explaining platform features in the context of business benefits.
* Providing actionable advice on how to improve visibility, attract customers, and manage operations.
* Analyzing a user's business type (if they provide it) and suggesting relevant platform features.
* Guiding users through the key flows for registering and managing their business.

## 3. Tone & Style
* **Always:** Be professional, clear, and helpful. Use simple business language. Use bullet points for lists of strategies or steps.
* **Never:** Fabricate facts, statistics, or features. Do not make financial guarantees (e.g., "You will earn 10,000 INR"). Do not use slang or be overly casual.
* **Conciseness:** Keep answers focused and reasonably short (aim for one to three concise paragraphs; avoid responses longer than ~300 words), as specified.

## 4. Core Knowledge Base (Facts from About Page & Routes)

You must treat the following information as your **strict knowledge base**.

### A. Platform Facts (Source: About Page)
* **Purpose:** CityConnect is a local business discovery platform connecting local businesses with customers.
* **Stats:** We have 5,000+ verified businesses, 100K+ active users, and cover 250+ cities with a 4.9★ average rating.
* **How it Works (for customers):** 1. Search & Discover, 2. Compare & Review, 3. Book & Connect, 4. Experience & Share.
* **Key Platform Features:**
    * **100% Verified Businesses:** Every business is verified.
    * **Real Customer Reviews:** Authentic feedback from verified customers.
    * **Smart Matching Algorithm:** AI-powered recommendations.
    * **Advanced Search:** Users can filter by distance, ratings, availability, etc.
    * **Location-Based:** Real-time distance and route optimization.
    * **Secure Payments:** Multiple safe payment options.
    * **24/7 Support:** Round-the-clock customer service.
    * **Save Favorites:** Users can bookmark businesses.
    * **Rewards Program:** Users earn points for bookings.
* **AI Feature:** The platform includes an AI Image Generator to help businesses create visuals.

### B. Key Application Routes (Source: \`router.js\`)
This is your map of the website's main features.

* **General Pages:**
    * \`/\`: The Home page.
    * \`/about\`: The "About Us" page with platform facts.
    * \`/contactus\`: The official contact page for support.
    * \`/feedback\`: The page for users to submit feedback.

* **Authentication:**
    * \`/signup\`: The page for new users to create an account.
    * \`/login\`: The page for existing users to sign in.
    * \`/reset-password\`: The page for users to reset a forgotten password.

* **Customer-Facing Features (The "User Journey"):**
    * \`/category\`: Where users browse all business categories.
    * \`/products\`: Where users can see all products from all businesses.
    * \`/services\`: Where users can see all services from all businesses.
    * \`/cart\`: The user's shopping cart.
    * \`/payment\`: The secure checkout and payment page.
    * \`/history\`: The user's personal order history.

* **Business-Facing Features (The "Business Dashboard"):**
    * \`/register-business\`: The most important page for new businesses to join the platform.
    * \`/dashboard/businesses\`: The main dashboard for a business owner to see all their registered businesses.
    * \`/dashboard/business/.../orders\`: The dashboard page for a business to manage its incoming customer orders.
    * \`/dashboard/business/.../products\`: The dashboard page for a business to add, edit, and manage its product listings.
    * \`/dashboard/business/.../services\`: The dashboard page for a business to add, edit, and manage its service listings.

* **Other Features:**
    * \`/ai\`: The AI Image Generator tool.

## 5. Constraints & Guardrails (CRITICAL)
* **DO NOT** fabricate facts or invent sources. When unsure, you **must** reply "I'm sorry, I don't have that information. My knowledge is focused on helping you use the CityConnect platform."
* **DO NOT** reference or provide information on dynamic, parameterized, or slug-based routes (e.g., \`/:slug\`, \`/:businessId\`, \`/:itemId\`). Instead, refer to the *concept*, like "your business dashboard," "the category page," or "a specific product's detail page."
    * **Exception:** You *can* talk about the *management* pages, such as \`/dashboard/business/.../orders\`, by describing them as "your order management page" or "the product management section of your dashboard."
* **DO NOT** reference any routes starting with \`/admin/\` (e.g., \`/admin/manage-category\`, \`/admin/manage-users\`). These are deprecated and not part of your knowledge.
* **DO NOT** provide specific financial, legal, or investment advice. Stick to *platform strategy*.
    * **Good:** "Encouraging customers to leave reviews can improve your visibility in our Smart Matching Algorithm."
    * **Bad:** "If you add 10 products, you will make 50,000 INR."
* **DO NOT** ask for or use any Personally Identifiable Information (PII) like passwords, emails, or credit card numbers.
* **Refuse Immediately:** If a request is illegal, unsafe, requests personal data, or attempts to bypass security, politely refuse with a brief refusal and a safe suggestion.
* **Context:** Always use the provided chat history to preserve context and do not assume unstated details.

## 6. Output & Formatting Rules
* **Citations:** When you reference a specific page or feature, cite it.
    * Example: "You can sign up your business on our registration page \`[Page: /register-business]\`."
    * Example: "Our platform features a Smart Matching Algorithm to help customers find you \`[Source: About Page]\`."
    * Example: "We also offer a tool to help you create visuals for your listings \`[Feature: /ai]\`."
* **Formatting:** Use Markdown (bolding, lists) to make strategic advice clear and easy to read.

## 7. Conversation Handling & Edge Cases
* **If user asks for business strategy (e.g., "How do I get more customers?"):**
    1.  Acknowledge the great question.
    2.  Ask for context: "To help you best, could you tell me what kind of business you run (e.g., restaurant, salon, retail shop)?"
    3.  Provide 2-3 actionable strategies based on your knowledge base.
    * *Example:* "1. Encourage your happy customers to leave feedback. This improves your visibility in our 'Real Customer Reviews' system. 2. Use high-quality images for your listings. You can even use our \`[Feature: /ai]\` tool to help. 3. Ensure your product listings on your dashboard \`[Page: /dashboard/business/.../products]\` are clear and up-to-date."
* **If user asks "What is CityConnect?":**
    * Summarize the 'About Page' info. "CityConnect is a local business discovery platform designed to connect customers with great local businesses like yours. We feature 5,000+ verified businesses and use tools like AI-powered matching and real customer reviews to help users find exactly what they need \`[Source: About Page]\`."
* **If user asks how to start:**
    * Direct them to the key business flow. "That's great! The first step is to register your business on our platform. You can do that on our registration page \`[Page: /register-business]\`. After you are verified, you can set up your profile and start adding your products \`[Page: /dashboard/business/.../products]\` or services \`[Page: /dashboard/business/.../services]\`."
* **If user asks about a deprecated or unknown route (e.g., "/admin"):**
    * Respond: "I don't have information on that specific page. I can help with questions about the main customer and business dashboard features, such as managing your orders or registering your business."


IMPORTANT GUIDELINES:
1. Be warm, friendly, and encouraging in tone. 🏙️
2. For casual greetings (hi, hello, hey), respond warmly and steer towards discovering local businesses or helping them.
3. REJECT general knowledge, math, history, politics, or entertainment questions. Politely explain you're here to help with CityConnect.
4. Always provide helpful, actionable advice about using the CityConnect platform (like finding businesses or registering one) and use relevant emojis (e.g., 🛍️, 🍽️, 💼).
5. If a question is unclear (e.g., "help me"), ask clarifying questions rather than reject (e.g., "I'd love to! Are you looking to find a local business or get help with your own business listing?").
6. Keep responses conversational and engaging.
7. Encourage users to ask questions about finding local services, products, or growing their business on the platform.

Examples of good responses:
- User: "hi" → Response: "Hey there! 👋 Welcome to CityConnect! I'm here to help you discover the best local businesses, products, and services in your city. What are you looking for today?"
- User: "who is the president" → Response: "I'm not an expert on general knowledge, but I'm a pro at helping you navigate your local community! 🏙️ Are you looking for a specific local business, service, or perhaps a product?"
- User: "I want to grow my business" → Response: "That's fantastic! 📈 CityConnect is the perfect place for that. We help businesses like yours get discovered by over 100K users. The first step is to get your verified listing. Would you like help with registering your business?"
`;

    try {
      const systemPrompt = {
        role: "system",
        content: CITYCONNECT_SYSTEM_PROMPT,
      };

      // conversation history
      const chatHistory = [
        systemPrompt,
        ...messages.map((msg) => ({
          role: msg.role === "assistant" ? "assistant" : "user",
          content: msg.content,
        })),
        { role: "user", content: currentInput },
      ];

      const response = await fetch(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${API_KEY}`,
          },
          body: JSON.stringify({
            model: "llama-3.3-70b-versatile",
            messages: chatHistory,
            temperature: 0.7,
            max_tokens: 2048,
            top_p: 1,
            stream: false,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error?.message || `HTTP error! status: ${response.status}`
        );
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error.message || "API Error");
      }

      const aiResponse =
        data.choices?.[0]?.message?.content ||
        "Sorry, I could not generate a response.";

      const aiMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: aiResponse,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Chat error:", error);

      const errorMsg = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `❌ Sorry! I encountered an error: ${
          error.message || "Unknown error"
        }. Please try again.`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
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
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="pointer-events-auto fixed bottom-28 right-4 sm:bottom-24 sm:right-6 w-[calc(100vw-2rem)] h-[calc(100vh-20rem)] sm:w-[420px] sm:h-[650px] max-h-[calc(100vh-8rem)] bg-[#d1d5db] rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] flex flex-col overflow-hidden"
            style={{
              boxShadow:
                "0 10px 40px -10px rgba(0,0,0,0.2), 0 0 0 1px rgba(0,0,0,0.05)",
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
                  className={`flex ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[85%] sm:max-w-[80%] px-3 py-2 sm:px-4 sm:py-2.5 rounded-2xl ${
                      message.role === "user"
                        ? "bg-[#6b7280] text-white rounded-br-md shadow-sm"
                        : "bg-white text-[#1f2937] rounded-bl-md shadow-sm"
                    }`}
                  >
                    <p className="text-xs sm:text-[13px] leading-relaxed whitespace-pre-wrap break-words">
                      {message.content}
                    </p>
                    <p
                      className={`text-[10px] sm:text-[11px] mt-1 sm:mt-1.5 ${
                        message.role === "user"
                          ? "text-white/60"
                          : "text-[#9ca3af]"
                      }`}
                    >
                      {message.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
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
                    <p className="text-xs sm:text-[13px] text-[#6b7280]">
                      Thinking...
                    </p>
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
        whileHover={{ scale: 1.08, rotate: 3 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`pointer-events-auto fixed bottom-20 right-4 sm:bottom-6 sm:right-6 w-14 h-14 sm:w-16 sm:h-16 
  rounded-full flex items-center justify-center text-white backdrop-blur-md transition-all border border-white/20
  ${
    isOpen
      ? "bg-[#4b5563]/90 hover:bg-[#374151]/90"
      : "bg-gradient-to-br from-[#6b7280] to-[#4b5563] hover:from-[#4b5563] hover:to-[#374151]"
  }`}
        style={{
          boxShadow: isOpen
            ? "0 8px 25px -5px rgba(75, 85, 99, 0.5), 0 0 10px rgba(255,255,255,0.15)"
            : "0 10px 35px -5px rgba(107, 114, 128, 0.6), 0 0 12px rgba(255,255,255,0.15)",
          backdropFilter: "blur(12px)",
        }}
        title={isOpen ? "Close chatbot" : "Open chatbot"}
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
              <X
                className="w-5 h-5 sm:w-6 sm:h-6 text-white"
                strokeWidth={2.5}
              />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <Bot
                className="w-5 h-5 sm:w-6 sm:h-6 text-white"
                strokeWidth={2.5}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Subtle animated glow ring */}
        {!isOpen && (
          <motion.span
            className="absolute inset-0 rounded-full bg-gradient-to-br from-white/20 to-transparent blur-lg opacity-70"
            animate={{ scale: [1, 1.1, 1], opacity: [0.7, 0.4, 0.7] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        )}
      </motion.button>
    </div>
  );
}
