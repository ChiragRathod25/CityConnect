import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, Sparkles, Loader2, Wand2, History } from "lucide-react";

const AIImageGenerator = () => {
  const [prompt, setPrompt] = useState("");
  const [generatedImage, setGeneratedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [history, setHistory] = useState([]);

  const colors = {
    lightBg: "#ECF2F9",
    darkText: "#1f2937",
    mediumText: "#374151",
    lightText: "#6b7280",
    subtleText: "#9ca3af",
    border: "#e5e7eb",
    cardBg: "#f3f4f6",
    softBg: "#f9fafb",
    white: "#ffffff",
  };

  const generateImage = async () => {
    if (!prompt.trim()) {
      setError("Please enter a description");
      return;
    }

    setLoading(true);
    setError("");
    setGeneratedImage(null);

    try {
      const encodedPrompt = encodeURIComponent(prompt);
      const seed = Math.floor(Math.random() * 1000000);
      const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1024&height=1024&seed=${seed}&nologo=true`;

      const img = new Image();

      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = imageUrl;
      });

      setGeneratedImage(imageUrl);

      const newHistoryItem = {
        id: Date.now(),
        prompt,
        imageUrl,
        timestamp: new Date().toLocaleString(),
      };
      setHistory((prev) => [newHistoryItem, ...prev].slice(0, 4));
    } catch (err) {
      setError("Failed to generate image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const downloadImage = async () => {
    if (!generatedImage) return;

    try {
      const response = await fetch(generatedImage);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `ai-generated-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      window.open(generatedImage, "_blank");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey && !loading) {
      e.preventDefault();
      generateImage();
    }
  };

  const examplePrompts = [
    "A futuristic cityscape at night with neon lights",
    "Peaceful zen garden with cherry blossoms",
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.lightBg }}>
      {/* Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="py-6 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center items-center gap-3">
            <motion.div
              whileHover={{ rotate: 180 }}
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="p-2.5 rounded-xl"
              style={{ backgroundColor: colors.cardBg }}
            >
              <Sparkles size={26} style={{ color: colors.darkText }} />
            </motion.div>
            <div>
              <h1
                className="text-2xl sm:text-3xl font-bold tracking-tight"
                style={{ color: colors.darkText }}
              >
                AI Image Generator
              </h1>
            </div>
          </div>
        </div>
      </motion.header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Input Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-6"
          >
            {/* Main Input Card */}
            <div
              className="rounded-2xl p-6 sm:p-8 shadow-sm"
              style={{ backgroundColor: colors.white }}
            >
              <div className="flex items-center gap-2 mb-6">
                <Wand2 size={22} style={{ color: colors.mediumText }} />
                <h2
                  className="text-xl font-semibold"
                  style={{ color: colors.darkText }}
                >
                  Create Image
                </h2>
              </div>

              <div className="space-y-5">
                <div>
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Describe your image in detail..."
                    className="w-full px-4 py-4 rounded-xl border-2 focus:outline-none transition-all resize-none text-base"
                    style={{
                      backgroundColor: colors.softBg,
                      borderColor: colors.border,
                      color: colors.darkText,
                    }}
                    rows="6"
                  />
                </div>

                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="px-4 py-3 rounded-xl text-sm"
                      style={{ backgroundColor: "#fee2e2", color: "#991b1b" }}
                    >
                      {error}
                    </motion.div>
                  )}
                </AnimatePresence>

                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={generateImage}
                  disabled={loading || !prompt.trim()}
                  className="w-full py-4 px-6 rounded-xl font-semibold transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                  style={{
                    backgroundColor: colors.darkText,
                    color: colors.white,
                  }}
                >
                  {loading ? (
                    <>
                      <Loader2 size={22} className="animate-spin" />
                      <span>Generating...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles size={22} />
                      <span>Generate Image</span>
                    </>
                  )}
                </motion.button>
              </div>
            </div>

            {/* Example Prompts */}
            <div
              className="rounded-2xl p-6 shadow-sm"
              style={{ backgroundColor: colors.white }}
            >
              <h3
                className="text-sm font-semibold mb-4"
                style={{ color: colors.mediumText }}
              >
                Example Prompts
              </h3>
              <div className="space-y-3">
                {examplePrompts.map((example, idx) => (
                  <motion.button
                    key={idx}
                    whileHover={{ x: 4 }}
                    onClick={() => setPrompt(example)}
                    className="w-full text-left px-4 py-3 rounded-xl text-sm transition-all"
                    style={{
                      backgroundColor: colors.softBg,
                      color: colors.lightText,
                    }}
                  >
                    {example}
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Output Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {/* Generated Image */}
            <div
              className="rounded-2xl p-6 sm:p-8 shadow-sm"
              style={{ backgroundColor: colors.white }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2
                  className="text-xl font-semibold"
                  style={{ color: colors.darkText }}
                >
                  Result
                </h2>
                {generatedImage && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={downloadImage}
                    className="px-4 py-2.5 rounded-xl shadow-sm flex items-center gap-2 font-medium text-sm"
                    style={{
                      backgroundColor: colors.darkText,
                      color: colors.white,
                    }}
                  >
                    <Download size={18} />
                    <span>Download</span>
                  </motion.button>
                )}
              </div>

              <div
                className="rounded-xl overflow-hidden flex items-center justify-center aspect-square"
                style={{
                  backgroundColor: colors.softBg,
                  border: `2px dashed ${colors.border}`,
                }}
              >
                <AnimatePresence mode="wait">
                  {loading ? (
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex flex-col items-center gap-4"
                    >
                      <Loader2
                        size={56}
                        className="animate-spin"
                        style={{ color: colors.lightText }}
                      />
                      <p
                        className="text-base font-medium"
                        style={{ color: colors.mediumText }}
                      >
                        Creating...
                      </p>
                    </motion.div>
                  ) : generatedImage ? (
                    <motion.div
                      key="image"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3 }}
                      className="w-full h-full"
                    >
                      <img
                        src={generatedImage}
                        alt="Generated"
                        className="w-full h-full object-cover"
                      />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="placeholder"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex flex-col items-center gap-4 text-center p-8"
                    >
                      <div
                        className="p-5 rounded-2xl"
                        style={{ backgroundColor: colors.cardBg }}
                      >
                        <Sparkles
                          size={48}
                          style={{ color: colors.lightText }}
                        />
                      </div>
                      <div>
                        <p
                          className="font-semibold text-lg mb-1"
                          style={{ color: colors.mediumText }}
                        >
                          No image yet
                        </p>
                        <p
                          className="text-sm"
                          style={{ color: colors.subtleText }}
                        >
                          Enter a prompt to get started
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* History Section */}
            {history.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="rounded-2xl p-6 shadow-sm"
                style={{ backgroundColor: colors.white }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <History size={20} style={{ color: colors.mediumText }} />
                  <h3
                    className="text-lg font-semibold"
                    style={{ color: colors.darkText }}
                  >
                    Recent
                  </h3>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {history.map((item) => (
                    <motion.div
                      key={item.id}
                      whileHover={{ scale: 1.03 }}
                      onClick={() => {
                        setGeneratedImage(item.imageUrl);
                        setPrompt(item.prompt);
                      }}
                      className="cursor-pointer rounded-xl overflow-hidden border-2 transition-all"
                      style={{ borderColor: colors.border }}
                    >
                      <img
                        src={item.imageUrl}
                        alt={item.prompt}
                        className="w-full aspect-square object-cover"
                      />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default AIImageGenerator;
