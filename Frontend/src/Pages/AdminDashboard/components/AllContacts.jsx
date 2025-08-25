import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axiosClient from "../../../utils/axiosClient";
import { toast } from "react-toastify";
import { translateText } from "../../../utils/translateService";
import { useSelector } from "react-redux";

const AllContacts = () => {
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const { language } = useSelector((state) => state.user);
  const fetchContacts = async () => {
    try {
      const { data } = await axiosClient.get("admin/api/allcontacts");
      if (data.success) {
        const contactsWithTranslatedCities = await Promise.all(
          data.message.map(async (contact) => ({
            ...contact,
            name:await translateText(contact.name,language),
            city: await translateText(contact.city, language),
          }))
        );
        setContacts(contactsWithTranslatedCities);
      }
    } catch (error) {
      console.error("Error Fetching All Contacts:", error);
    }
  };
  
  useEffect(() => {
    fetchContacts();
  }, [language]);


  const handleDeleteContact = async (id) => {
    if (!window.confirm("Are you sure you want to delete this contact?"))
      return;

    try {
      const { data } = await axiosClient.delete(`/admin/api/allcontacts/${id}`);
      if (data.success) {
        setContacts((prev) => prev.filter((contact) => contact._id !== id));
        toast.success("Contact deleted successfully!");
      } else {
        toast.error("Failed to delete contact. Please try again.");
      }
      fetchContacts();
    } catch (error) {
      console.error("Error in delete contact: Frontend", error);
      toast.error("Failed to delete contact. Please try again.");
    }
  };

  return (
    <div className="w-full min-h-full flex flex-col  items-center bg-gray-200 p-4">
      <motion.h1
        className="p-2 md:m-2 lg:pt-0  text-2xl  sm:text-3xl font-bold text-center mb-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Contact List
      </motion.h1>

      <div className="w-full   lg:max-w-6xl sm:max-w-2xl md:max-w-3xl  md:max-h-[1500px] overflow-y-auto bg-white shadow-lg rounded-lg p-2 sm:p-4">
        {contacts.map((contact, index) => (
          <motion.div
            key={contact.id || index}
            className="bg-gray-300 shadow rounded-lg p-3 sm:p-4 gap-1 flex flex-col sm:flex-row justify-between items-start sm:items-center mb-5 mt-2"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.3 }}
          >
            <div className="relative p-5 flex w-full md:w-0 items-center justify-center z-0">
              <div className="absolute w-12 h-12 bg-gradient-to-r from-[#00c6ff] to-[#0072ff] rounded-full"></div>
              <span className="text-2xl font-semibold relative ">
                {index + 1}
              </span>
            </div>

            <div className="w-full">
              <p className="text-xl md:text-2xl font-semibold text-center">
                {contact.name}
              </p>
              <p className="text-blue-600  md:text-xl text-center ">
                {contact.email}
              </p>
            </div>

            <motion.button
              onClick={() => setSelectedContact(contact)}
              whileHover={{ scale: 0.9 }}
              whileTap={{ scale: 1.4 }}
              className="mt-2 mr-2 sm:mt-0 bg-yellow-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-yellow-600 transition w-full sm:w-auto"
            >
              Reason
            </motion.button>

            <motion.button
              whileHover={{ scale: 0.9 }}
              whileTap={{ scale: 1.4 }}
              className="mt-2 mr-2 sm:mt-0 bg-green-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-600 transition w-full sm:w-auto"
              onClick={() => {
                const email = contact.email;
                if (email) {
                  window.location.href = `https://mail.google.com/mail/?view=cm&to=${email}`;
                } else {
                  alert("No email found!");
                }
              }}
            >
              Email
            </motion.button>

            <motion.button
              onClick={() => handleDeleteContact(contact._id)}
              whileHover={{ scale: 0.9 }}
              whileTap={{ scale: 1.4 }}
              className="mt-2 sm:mt-0 bg-red-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-600 transition w-full sm:w-auto"
            >
              Delete
            </motion.button>
          </motion.div>
        ))}
      </div>

      {selectedContact && (
        <>
          <div
            className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-40"
            onClick={() => setSelectedContact(null)}
          ></div>

          <motion.div
            className="fixed bg-white shadow-2xl p-6 rounded-lg w-[90%] sm:w-[450px] max-w-[90%] z-50"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            style={{
              minHeight: "150px",
              maxHeight: "80vh",
              overflowY: "auto",
            }}
          >
            <button
              onClick={() => setSelectedContact(null)}
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 text-xl"
            >
              ✖
            </button>

            <h2 className="text-2xl font-semibold mb-4 text-center">Reason</h2>
            <div
              className="overflow-y-auto"
              style={{ maxHeight: "65vh", wordBreak: "break-word" }}
            >
              <p className="text-gray-700 text-center">
                {selectedContact.message || "No Reason Provided"}
              </p>
            </div>
          </motion.div>
        </>
      )}
    </div>
  );
};

export default AllContacts;
