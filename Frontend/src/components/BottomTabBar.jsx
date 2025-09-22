import { Home, Calendar, User,Atom} from 'lucide-react';
import { useLocation, Link } from 'react-router-dom';

const tabs = [
  { name: 'Home', icon: Home, path: '/' },
  { name: 'Post', icon: Atom, path: '/post'},
  { name: 'Events', icon: Calendar, path: '/event' },
  { name: 'Profile', icon: User, path: '/profile' },
];

const BottomTabBar = () => {
  const location = useLocation();

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#C30E59] text-white shadow-inner flex justify-around py-2 z-50">
      {tabs.map(({ name, icon: Icon, path }) => {
        const isActive = location.pathname === path;
        return (
          <Link
            key={name}
            to={path}
            className={`flex flex-col items-center ${
              isActive ? 'text-[#F2AE66]' : 'text-white'
            } hover:text-[#F2AE66]`}
          >
            <Icon className="w-6 h-6" />
            <span className="text-xs">{name}</span>
          </Link>
        );
      })}
    </div>
  );
};

export default BottomTabBar;