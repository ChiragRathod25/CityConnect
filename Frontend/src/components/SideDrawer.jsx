import { X } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const SideDrawer = ({ isOpen, onClose }) => {
  const user = useSelector((state) => state.auth.userData);
  const navigate = useNavigate();
  const links = {
    section1: [
      {
        name: 'Home',
        to: '/',
      },
      {
        name: 'Parent',
        to: '/parent',
      },
      {
        name: 'Achievement',
        to: '/achievement',
      },
      {
        name: 'Talent',
        to: '/talent',
      },
    ],

    section2: [
      {
        name: 'About',
        to: '/about',
      },
      {
        name: 'Contact Us',
        to: '/contact',
      },
      {
        name: 'Logout',
        to: '/logout',
      },
    ],
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div className="fixed inset-0 bg-transparent bg-opacity-50 z-40" onClick={onClose} />
      )}

      {/* Sliding Drawer */}
      <motion.div
        initial={{ x: '-100%' }}
        animate={{ x: isOpen ? 0 : '-100%' }}
        transition={{ duration: 0.3 }}
        className="fixed top-0 left-0 w-64 h-full bg-[#C30E59] text-white shadow-lg z-50 p-4"
      >
        {/* Close Button */}
        <button onClick={onClose} className="mb-4 hover:text-[#F2AE66]">
          <X className="w-6 h-6" />
        </button>

        {/* Profile */}
        {user ? (
          <div
            className="flex items-center mb-4  flex-col"
            onClick={() => {
              onClose();
              navigate('/profile');
            }}
          >
            <img
              src={
                user?.avatar ||
                `/avatar.webp` ||
                'https://www.pngkey.com/png/full/115-1150420_avatar-png-pic-male-avatar-icon-png.png'
              }
              alt={user?.firstName}
              className="w-12 h-12 rounded-full"
            />
            <p className="text-sm text-center text-gray-300">@{user?.username}</p>
            <div className="text-center">
              <h2 className="text-lg font-semibold">
                {user?.firstName} {user?.lastName}
              </h2>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-4 mb-4 pb-4 flex-col">
            <Link
              to="/login"
              onClick={onClose}
              className="text-lg font-semibold hover:text-[#F2AE66]"
            >
              Login to view profile
            </Link>
          </div>
        )}

        {/* Menu Items */}
        <nav className="flex flex-col gap-4">
          {links &&
            Object.keys(links).map((section, index) => (
              <div key={index} className="space-y-2 flex flex-col">
                <hr className="border-[#F2AE66] border-opacity-50" />

                {links[section].map((link, index) => (
                  <>
                    {/* do not show logout btn if user is already loggedout */}
                    {!user && link.name === 'Logout' ? null : (
                      <Link
                        key={index}
                        to={link.to}
                        onClick={onClose}
                        className="text-lg font-semibold hover:text-[#F2AE66]"
                      >
                        {link.name}
                      </Link>
                    )}
                  </>
                ))}
              </div>
            ))}
        </nav>
      </motion.div>
    </>
  );
};

export default SideDrawer;