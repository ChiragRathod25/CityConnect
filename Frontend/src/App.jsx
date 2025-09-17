import { useDispatch } from "react-redux";
import Layout from "./Layout";
import { useEffect, useState } from "react";
import { login, logout } from "./slices/userSlice/authSlices.js";
import databaseService from "./services/database.services.js";
import { Outlet } from "react-router-dom";

function App() {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
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
      <div className="flex items-center justify-center min-h-screen p-1 scale-80 sm:scale-100">
        <div className="flex flex-col items-center gap-6 px-8 py-12 rounded-2xl shadow-xl border border-[#F2AE66]/30 bg-white/70 backdrop-blur-md transition-all w-full max-w-lg">
          <div className="relative w-24 h-24 border-8 border-[#F2AE66] rounded-full flex items-center justify-center bg-[#FFF4EC]">
            <div className="loader w-16 h-16 border-4 border-[#F2AE66] border-t-[#C30E59] rounded-full animate-spin"></div>
          </div>

          <h2 className="text-xl font-semibold text-[#C30E59] tracking-wide">
            Just a moment...
          </h2>

          <p className="text-sm text-gray-600 text-center max-w-xs">
            We are fetching your data and setting up the app.
          </p>

          <div className="w-24 h-1 bg-gradient-to-r from-[#F2AE66] to-[#C30E59] rounded-full animate-pulse" />
        </div>
      </div>
    );
  }
  return (
    <div className="bg-gray-0 min-h-screen">
      <Layout>
        <main>
          <Outlet />
        </main>
      </Layout>
    
    </div>
  );
}

export default App;
