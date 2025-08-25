import { motion } from "framer-motion";
import Nevil from "../../assets/Nevil.jpg";
import Ansh from "../../assets/Ansh.jpg";
import Dev from "../../assets/Dev.jpg";
import Neel from "../../assets/Neel.jpg";
import locales from "../../locales/about.local.json";
import { useState } from "react";
import { useSelector } from "react-redux";

const founders = [
  { name: "Ansh Kubavat", image: Ansh },
  { name: "Neel Sathvara", image: Neel },
  { name: "Nevil Nakrani", image: Nevil },
  { name: "Dev Mali", image: Dev },
];

const About = () => {
  const { language } = useSelector((state) => state.user);
  const t = locales[language];
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="container mx-auto p-6 ">
      {/* Our Story */}
      <div className="mb-8 p-6 bg-[#FEF6EF] shadow-lg rounded-2xl border">
        <h2 className="text-3xl font-bold mb-4">{t.ourStoryTitle}</h2>
        <p className="text-lg text-gray-700">{t.ourStoryDesc1}</p>
        <p className="text-lg text-gray-700 mt-4">{t.ourStoryDesc2}</p>
      </div>

      {/* Meet the Founders */}
      <div className="mb-8 p-6 bg-[#FEF6EF] shadow-lg rounded-2xl border">
        <h2 className="text-3xl font-bold mb-4">{t.meetFounders}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {founders.map((founder, index) => (
            <motion.div whileHover={{ scale: 1.05 }} key={index} className="text-center">
              <img src={founder.image} alt={founder.name} className="w-32 h-32 mx-auto rounded-full object-cover object-top" />
              <h3 className="text-xl font-semibold mt-3">{founder.name}</h3>
              <p className="text-gray-500">{t.founderRole}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Our Journey & Evolution */}
      <div className="mb-8 p-6 bg-[#FEF6EF] shadow-lg rounded-2xl border">
        <h2 className="text-3xl font-bold mb-4">{t.ourJourneyTitle}</h2>
        <ul className="list-disc ml-6 mt-2 text-lg text-gray-700">
          <li>{t.ourJourneyPoint1}</li>
          <li>{t.ourJourneyPoint2}</li>
          <li>{t.ourJourneyPoint3}</li>
        </ul>
      </div>

      {/* Our Mission & Vision */}
      <div className="mb-8 p-6 bg-[#FEF6EF] shadow-lg rounded-2xl border">
        <h2 className="text-3xl font-bold mb-4">{t.missionVisionTitle}</h2>
        <ul className="list-disc ml-6 mt-2 text-lg text-gray-700">
          <li>{t.missionPoint1}</li>
          <li>{t.missionPoint2}</li>
          <li>{t.missionPoint3}</li>
        </ul>
        <p className="text-lg text-gray-700 mt-4">
          <strong>{t.visionTitle}</strong> {t.visionDesc}
        </p>
      </div>
    </div>
  );
};

export default About;