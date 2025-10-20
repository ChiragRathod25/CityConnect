import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { LoadingComponent } from "./index.js";

function AuthLayout({ children, authentication = true }) {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const authStatus = useSelector((state) => state.auth.status);
  console.log("Redux store data:", useSelector((state) => state));

  useEffect(() => {
    if (authentication === false) {
      console.log("Authentication is not required!");
    } else if (authentication && authStatus !== authentication) {
      console.log("User not authenticated, redirecting to login.");
      navigate("/login");
    }
    setLoading(false);
  }, [authStatus, navigate, authentication]);

  if (loading) {
    return <LoadingComponent customLoadingMsg={`Verifying user...`} />;
  }

  return (
    <div className="min-h-screen bg-gray-100  ">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-1  sm:mt-8">
        {children}
      </div>
    </div>
  );
}

export default AuthLayout;
