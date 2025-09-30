import { useState, useEffect } from "react";
import { TopBar, SideDrawer, BottomTabBar } from "./components/index.js";
import FooterComponent from "./components/Footer";
import HeaderComponent from "./components/Navbar";

function Layout({ children }) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isPWA, setIsPWA] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Detect if running as PWA
    const checkPWA =
      window.matchMedia("(display-mode: standalone)").matches ||
      window.navigator.standalone;
    setIsPWA(checkPWA);

    // Detect if mobile device
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    const mobileCheck =
      /android|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
        userAgent.toLowerCase()
      );
    setIsMobile(mobileCheck);
  }, []);

  const isMobilePWA = isPWA && isMobile;
  const location = window.location.pathname == "/start";
  
  return (
    <div className="min-h-screen  flex flex-col">
      {/* HEADER */}
      {!isMobilePWA && !location && (
        <header className="text-white sticky top-0 z-50 backdrop-blur-lg">
          <div className="container mb-16 lg:mb-20 flex justify-center items-center px-4">
            <HeaderComponent />
          </div>
        </header>
      )}

      {/* MOBILE PWA TOPBAR */}
      {isMobilePWA && (
        <div className="sm:hidden z-200 sticky top-0">
          <TopBar
            onMenuClick={() => setIsDrawerOpen(true)}
            notificationsCount={3}
          />
          <SideDrawer
            isOpen={isDrawerOpen}
            onClose={() => setIsDrawerOpen(false)}
          />
        </div>
      )}

      {/* MAIN */}
      <div className="min-h-screen flex-grow">{children}</div>

      {/* FOOTER */}
      {isMobilePWA ? (
        <div className="sm:hidden z-200 mt-10">1
          <BottomTabBar />
        </div>
      ) : ( 
        !location && <FooterComponent />
      )}
    </div>
  );
}

export default Layout;
