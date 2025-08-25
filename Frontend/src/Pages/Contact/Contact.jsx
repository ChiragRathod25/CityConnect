import { motion } from "framer-motion";
import axiosClient from "../../utils/axiosClient";
import { toast } from "react-toastify";
import locales from "../../locales/contact.locales.json";
import { useSelector } from "react-redux";
const Contact = () => {
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      name: e.target.name.value,
      email: e.target.email.value,
      message: e.target.message.value,
    };
    e.target.name.value = "";
    e.target.email.value = "";
    e.target.message.value = "";

    try {
      const { data } = await axiosClient.post("/admin/api/contact", formData);

      if (data.success) {
        toast.success("Message sent successfully!");
      } else {
        toast.error("Failed to send message.");
      }
    } catch (error) {
      console.error("Error submitting contact form:", error);
    }
  };
  const { language } = useSelector((state) => state.user);
  const t = locales[language];

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#F8EFE5] p-4 md:p-10">
      <div className="flex flex-col md:flex-row bg-white p-6 md:p-10 border-t border-blue-500 rounded-lg shadow-lg w-full max-w-4xl">
        {/* Left Side - Form */}
        <div className="flex-1 p-4 md:p-6 border border-blue-500 rounded-md">
          <h2 className="text-2xl font-bold mb-4 text-center md:text-left">
            {t.contact_us}
          </h2>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder={t.enter_name}
              className="w-full p-3 border border-black rounded-md"
            />
            <input
              type="email"
              name="email"
              placeholder={t.email}
              className="w-full p-3 border border-black rounded-md"
            />
            <textarea
              name="message"
              placeholder={t.your_message}
              className="w-full p-3 border border-black rounded-md"
            ></textarea>
            <motion.button
              type="submit"
              className="w-full p-3 cursor-pointer bg-orange-300 text-white font-semibold rounded-md shadow-md hover:bg-orange-400"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {t.send}
            </motion.button>
          </form>
        </div>
  
        {/* Right Side - Map & Address */}
        <div className="flex-1 relative p-4 md:p-6 border border-blue-500 rounded-md mt-6 md:mt-0 md:ml-6">
          <div className="w-full h-48 md:h-64 bg-gray-200">
            <iframe
              title="map"
              className="w-full h-full"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3719.610316002294!2d72.92096197590192!3d22.561906779497294!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395e4eb4df1e1f41%3A0x7793e761d7f80a4b!2sVallabh%20Vidyanagar%2C%20Anand%2C%20Gujarat%2C%20India!5e0!3m2!1sen!2sin!4v1708841000000!5m2!1sen!2sin"
              allowFullScreen=""
              loading="lazy"
            ></iframe>
          </div>
          <div className="absolute bottom-2 text-center left-4 bg-[#F8EFE5] p-2 md:p-4 shadow-md rounded-md">
            <h3 className="font-semibold text-sm md:text-base">{t.address}</h3>
            <p className="text-xs md:text-sm">NearByGo</p>
            <p className="text-xs md:text-sm">V.V.Nagar</p>
            <p className="text-xs md:text-sm">+91 987654321</p>
          </div>
        </div>
      </div>
    </div>
  );
  
};

export default Contact;
