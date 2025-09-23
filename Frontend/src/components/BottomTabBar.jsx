import { Home, Grid3X3, User, MapPin } from 'lucide-react';
import { useLocation, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const BottomTabBar = () => {
  const location = useLocation();
  const user = useSelector((state) => state.auth.userData);

  const getProfileRoute = () => {
    if (!user) return '/login'; 
    
    switch (user.role) {
      case 'admin':
        return '/admin';
      case 'businessman':
        return '/businessman-profile';
      case 'user':
      default:
        return '/user-profile';
    }
  };

  const tabs = [
    { name: 'Home', icon: Home, path: '/' },
    { name: 'Category', icon: Grid3X3, path: '/category' },
    { name: 'Nearby', icon: MapPin, path: '/nearby' },
    { name: 'Profile', icon: User, path: getProfileRoute() },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg flex justify-around py-3 z-50">
      {tabs.map(({ name, icon: Icon, path }) => {
        const isActive = location.pathname === path;
        return (
          <Link
            key={name}
            to={path}
            className={`flex flex-col items-center ${
              isActive ? 'text-gray-900' : 'text-gray-500'
            } hover:text-gray-700`}
          >
            <Icon className="w-6 h-6" />
            <span className="text-xs mt-1">{name}</span>
          </Link>
        );
      })}
    </div>
  );
};

export default BottomTabBar;