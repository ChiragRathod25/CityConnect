import { Menu, Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";

const TopBar = ({ onMenuClick, notificationsCount }) => {
  const navigate = useNavigate();
  return (
    <div className="flex justify-between items-center p-4 bg-[#C30E59] text-white shadow-xl sticky top-0 z-50 backdrop-blur-lg">
      {/* Hamburger Icon */}
      <button onClick={onMenuClick} className="hover:text-[#F2AE66]">
        <Menu className="w-6 h-6" />
      </button>

      {/* Site Title */}
      <h1
        className="text-xl font-bold cursor-pointer hover:text-[#F2AE66]"
        onClick={() => navigate("/")}
      >
        CityConnect
      </h1>

      {/* Notifications */}
      <div
        className="relative cursor-pointer hover:text-[#F2AE66]"
        onClick={() => navigate("/notification")}
      >
        <Bell className="w-6 h-6" />
        {notificationsCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {notificationsCount}
          </span>
        )}
      </div>
    </div>
  );
};

export default TopBar;