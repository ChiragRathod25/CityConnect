import axios from "axios";

export const translateText = async (text, targetLanguage) => {
  try {
    if (!text || text.trim() === "") return text; // Prevent empty text from being translated
    const response = await axios.post("http://localhost:3000/translate", {
      text,
      targetLanguage,
    });

    console.log("🟢 Translation API Response:", response.data);

    return response.data.translatedText || text; // Return translated text or original if undefined
  } catch (error) {
    return text; // Return original text if translation fails
  }
};