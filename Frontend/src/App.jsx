import { useDispatch } from "react-redux";
import Layout from "./Layout";
import { useEffect, useState } from "react";
import { login, logout } from "./slices/userSlice/authSlices.js";
import databaseService from "./services/database.services.js";
import { Outlet } from "react-router-dom";
import { 
  setDeferredPrompt, 
  clearDeferredPrompt, 
  isPWAInstalled,
  markPWAInstalled 
} from './utils/installPromptStore.js';
import MyToaster from "./MyToaster";
import LoadingComponent from "./components/LoadingComponent";

function App() {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  
  
  useEffect(() => {
  const handleBeforeInstallPrompt = (event) => {
    event.preventDefault();
    console.log("beforeinstallprompt fired", event);
    setDeferredPrompt(event); // Always set it, let the InstallApp component handle the logic
  };

  const handleAppInstalled = () => {
    console.log("PWA was installed");
    clearDeferredPrompt();
  };

  window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
  window.addEventListener("appinstalled", handleAppInstalled);

  return () => {
    window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.removeEventListener("appinstalled", handleAppInstalled);
  };
}, []);


  useEffect(() => {
    // Register the service worker
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/service-worker.js")
          .then((registration) => {
            console.log("ServiceWorker registered: ", registration);
          })
          .catch((error) => {
            console.log("ServiceWorker registration failed: ", error);
          });
      });
    }

    const getCurrentUser = async () => {
      await databaseService
        .getCurrentuser()
        .then((response) => {
          if (response.data) {
            console.log("User is logged in:", response.data);
            dispatch(login(response.data));
          } else {
            dispatch(logout());
          }
        })
        .finally(() => setLoading(false));
    };
    getCurrentUser();
  }, []);

  if (loading) {
    return (
      <LoadingComponent/>
    );
  }
  return (
    <div className="bg-gray-0 min-h-screen">
      <Layout>
        <main>
          <MyToaster />
          <Outlet />
        </main>
      </Layout>
    </div>
  );
}

export default App;
