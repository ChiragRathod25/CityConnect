export const Button = ({
  onClick,
  disabled,
  loading,
  children,
  variant = "primary",
  icon = null,
  className = "",
  size = "normal",
  bgColor = null,
  iconRight = false,
}) => {
  const getButtonStyles = () => {
    if (bgColor) {
      return {
        backgroundColor: bgColor,
        boxShadow: `0 10px 25px ${bgColor}66`,
      };
    }

    switch (variant) {
      case "primary":
        return {
          backgroundColor: "#374151",
          boxShadow: "0 10px 25px rgba(55, 65, 81, 0.3)",
        };
      case "secondary":
        return {
          backgroundColor: "#6b7280",
          boxShadow: "0 10px 25px rgba(107, 114, 128, 0.3)",
        };
      case "outline":
        return {
          backgroundColor: "#f8fafc",
          borderColor: "#d1d5db",
          color: "#6b7280",
        };
      case "success":
        return {
          backgroundColor: "#10b981",
          boxShadow: "0 10px 25px rgba(16, 185, 129, 0.3)",
        };
      case "danger":
        return {
          backgroundColor: "#ef4444",
          boxShadow: "0 10px 25px rgba(239, 68, 68, 0.3)",
        };
      case "warning":
        return {
          backgroundColor: "#f59e0b",
          boxShadow: "0 10px 25px rgba(245, 158, 11, 0.3)",
        };
      default:
        // By Default Primary
        return {
          backgroundColor: "#374151",
          boxShadow: "0 10px 25px rgba(55, 65, 81, 0.3)",
        };
    }
  };

  const sizeClasses = size === "small" ? "py-3" : "py-4";
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`w-full ${sizeClasses} px-4 rounded-xl font-semibold focus:outline-none focus:ring-2 focus:ring-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center justify-center space-x-2 group ${
        variant === "outline" ? "border" : "text-white"
      } ${className}`}
      style={getButtonStyles()}
    >
      {loading ? (
        <>
          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          <span className="text-sm sm:text-base">
            {typeof children === "string" ? `${children}...` : children}
          </span>
        </>
      ) : !iconRight ? (
        <>
          <span className="text-sm sm:text-base">{children}</span>
          {icon && (
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              {icon}
            </svg>
          )}
        </>
      ) : (
        <>
          {icon && (
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              {icon}
            </svg>
          )}
          <span className="text-sm sm:text-base">{children}</span>
        </>
      )}
    </button>
  );
};
