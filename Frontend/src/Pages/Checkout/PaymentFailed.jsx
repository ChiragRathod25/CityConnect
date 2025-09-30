import { useEffect } from "react";
import { XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PaymentFailed = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/all-doctors");
    }, 10000);

    return () => clearTimeout(timer);
  }, [navigate]);

  const handleClick = () => {
    navigate("/all-doctors");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-100 to-red-200 px-4">
      <div
        onClick={handleClick}
        className="cursor-pointer bg-white shadow-xl rounded-2xl p-10 max-w-md w-full text-center animate-fade-in hover:shadow-2xl transition"
      >
        <div className="flex justify-center mb-4">
          <XCircle className="text-red-500 w-12 h-12" />
        </div>
        <h2 className="text-2xl font-bold text-red-700">Payment Failed ❌</h2>
        <p className="mt-3 text-gray-600">Please try again later or contact support.</p>
        <p className="mt-1 text-sm text-gray-400">Click anywhere here or wait 10 seconds...</p>
      </div>
    </div>
  );
};

export default PaymentFailed;
