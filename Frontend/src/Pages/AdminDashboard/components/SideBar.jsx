import { useState } from 'react';
import { Link } from 'react-router-dom';

const SideBar = () => {
  const menu = [ "All Businesses","Deleted Businesses","All Contacts"];
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const closeSidebar = () => {
    setIsOpen(false);
  };

  const style1 = " left-[150px] text-white text-2xl md:top-[94px] md:left-[200px]";
  const style2 = " left-4  text-black font-bold text-2xl p-[6px]";
  const btnStyle = `${isOpen ? style1 : style2}`

  return (
    
      <div >
        
      {/* Hamburger Button for Mobile */}
      <button
        onClick={toggleSidebar}
        className={`lg:hidden absolute md:top-[86px] top-20 z-50 rounded-full ${btnStyle}`}>
        ☰
      </button>

      {/* Sidebar */}
      <div
        className={`min-h-[800px]  z-50 inset-y-0 left-0 md:p-3 md:text-xl md:w-64 w-48 bg-[#3B2E2E] text-white transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 transition-transform duration-200 ease-in-out`}
      >
        <div className="p-4">
          <h2 className="text-2xl font-bold">Admin</h2>
          <ul className="mt-6">
            {
              menu.map(
                (item) => (
                  <li key={item} className="mb-2 ">
                    <Link
                     to={`/admin/${item.trim().replace(/\s/g, "").toLowerCase()}`}
                      onClick={closeSidebar} 
                      className="block p-2 hover:bg-grey-800 rounded"
                    >
                      {item}
                    </Link>
                  </li>
                )
              )
            }
          </ul>
        </div>
      </div>
        
    </div>
  );
};

export default SideBar;