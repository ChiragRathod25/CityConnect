import  { useState } from "react";
import axios from "axios";
import { Loader2, CreditCard } from "lucide-react";
import { useSelector } from "react-redux";
import {useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const PaymentPage = () => {
  // const activeUser = useSelector((state) => state.user.user);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  // const { state } = useLocation();
  // const appointmentData = state?.appointmentData ;
  // const doctor = state?.doctor;
  // console.log(doctor);
  // console.log(appointmentData);

  const checkoutHandler = async () => {
  if (!window.Razorpay) {
    alert("Razorpay SDK failed to load. Please check your internet connection.");
    return;
  }

  const options = {
    key: import.meta.env.VITE_RAZORPAY_KEY_ID, // Replace with your key
    amount: 50000, // in paise (50000 = ₹500)
    currency: "INR",
    name: "My App",
    description: "Test Transaction",
    handler: function (response) {
      console.log(response.razorpay_payment_id);
      console.log(response.razorpay_order_id);
      console.log(response.razorpay_signature);
    },
    prefill: {
      name: "Neel Sathvara",
      email: "neel@example.com",
      contact: "9999999999",
    },
    theme: {
      color: "#3399cc",
    },
  };

  const rzp1 = new window.Razorpay(options);
  rzp1.open();
};


  // const checkoutHandler = async (amount) => {
  //   setIsLoading(true);
  //   try {
  //     // const {
  //     //   data: { key },
  //     // } = await axios.get(`${import.meta.env.VITE_API_URL}/pay/getkey`);

  //     // const {
  //     //   data: { order },
  //     // } = await axios.post(`${import.meta.env.VITE_API_URL}/pay/checkout`, {
  //     //   amount,
  //     // });

  //     const notes= {
  //       // appointmentId: appointmentData._id,
  //       // doctorId: appointmentData?.doctorId,
  //       // patientId: appointmentData?.patientId,
  //       // appointmentDate: appointmentData?.date,
  //       // appointmentTime: appointmentData?.time,
  //       amount,
  //     }

  //     const options = {
  //       // key,
  //       // amount: order.amount,
  //       currency: "INR",
  //       name: "6 Pack Programmer",
  //       description: "Doctor Appointment Payment",
  //       image: "https://avatars.githubusercontent.com/u/25058652?v=4",
  //       // order_id: order.id,
  //       //callback_url: "http://localhost:5001/pay/paymentverification",
  //       handler: async function(response) {
  //         try {
  //           // await axios.post(`${import.meta.env.VITE_API_URL}/pay/paymentverification`, {
  //           //   razorpay_order_id: response.razorpay_order_id,
  //           //   razorpay_payment_id: response.razorpay_payment_id,
  //           //   razorpay_signature: response.razorpay_signature,
  //           //   notes: notes
  //           // });
  //           navigate("/payment-success", { 
  //             state: { 
  //               paymentId: response.razorpay_payment_id,
  //               // doctor,
  //               // appointmentData
  //             } 
  //           });
  //         } catch (error) {
  //           console.error("Payment verification failed:", error);
  //         //  toast.error("Payment verification failed");
  //         // toast("error","Payment Verification Failed...!");
  //          navigate("/payment-failed");
  //         }
  //       },
  //       prefill: {
  //       //  name: activeUser?.name || appointmentData.patientForm?.name || "Guest",
  //         // email: activeUser?.email || appointmentData.patientForm?.email || "guest@example.com",
  //         // contact: appointmentData.patientForm?.number || "9999999999",
  //       },
  //       notes:notes,
  //       theme: {
  //         color: "#4f46e5",
  //       },
  //     };
  //     console.log(options.notes);
  //     const razor = new window.Razorpay(options);
  //     razor.open();
  //   } catch (error) {
  //     console.error("Payment Error:", error);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-4">Confirm Payment</h1>
        <p className="text-sm text-gray-500 text-center mb-6">Pay ₹100</p>

        <button
          onClick={() => checkoutHandler()}
          disabled={isLoading}
          className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold text-white transition ${
            isLoading ? "bg-gray-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"
          }`}
        >
          {isLoading ? (
            <>
              <Loader2 className="animate-spin h-5 w-5" /> Processing...
            </>
          ) : (
            <>
              <CreditCard className="h-5 w-5" /> Pay ₹100
            </>
          )}
        </button>
      </div>
    </div>
  );d
};

export default PaymentPage;
