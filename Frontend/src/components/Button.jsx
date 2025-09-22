import React from 'react';

function Button({
  children,
  className = '',
  onClick,
  variant = 'primary', // New prop for variant
  ...props
}) {
  // Define color classes based on the variant prop
  const colorClasses = {
    primary: 'bg-[#C30E59] text-white hover:bg-[#E82561]', // Dark Pink
    secondary: 'bg-[#F2AE66] text-black hover:bg-[#E8E7AB]', // Light Yellow
    // success: 'bg-[#E82561] text-white hover:bg-[#F2AE66]', // Bright Pink
    success: 'bg-[#10B981] text-white hover:bg-[#059669]', // Green Variant
    danger: 'bg-[#C30E59] text-white hover:bg-[#E82561]', // Dark Pink
  };

  return (
    <div className="w-full flex justify-center">
      <button
        className={`rounded-lg px-4 py-2 transition duration-300 ease-in-out transform ${colorClasses[variant]} 
        ${className} hover:scale-105 hover:cursor-pointer`}
        onClick={onClick}
        {...props}
      >
        {children}
      </button>
    </div>
  );
}

export default Button;
