import React from "react";
import { AnimatedList } from "@/components/magicui/animated-list";
import { Iphone15Pro } from "@/components/magicui/iphone-15-pro";

// ✅ Define the live updates array properly
const liveUpdates = [
  {
    name: "Road Closure Alert",
    description: "Construction work in progress",
    time: "5m ago",
    icon: "🚧",
    color: "#FF3D71",
  },
  {
    name: "Power Outage",
    description: "Scheduled maintenance",
    time: "12m ago",
    icon: "⚡",
    color: "#FFB800",
  },
  {
    name: "New Bus Route",
    description: "Express service launched",
    time: "1h ago",
    icon: "🚌",
    color: "#00C9A7",
  },
  {
    name: "Community Event",
    description: "Local festival starting",
    time: "2h ago",
    icon: "🎉",
    color: "#1E86FF",
  },
  {
    name: "Traffic Update",
    description: "Heavy congestion reported",
    time: "3h ago",
    icon: "🚗",
    color: "#FF6B6B",
  },
  {
    name: "Weather Alert",
    description: "Rain expected this evening",
    time: "4h ago",
    icon: "🌧️",
    color: "#4ECDC4",
  },
];

// Single update card
const UpdateNotification = ({ name, description, icon, color, time }) => {
  return (
    <figure className="relative mx-auto min-h-fit w-full cursor-pointer overflow-hidden rounded-xl p-3 transition-all duration-200 ease-in-out hover:scale-[102%] bg-white/10 backdrop-blur-md border border-white/20">
      <div className="flex flex-row items-center gap-3">
        <div
          className="flex size-8 items-center justify-center rounded-lg"
          style={{
            backgroundColor: color,
          }}
        >
          <span className="text-sm">{icon}</span>
        </div>
        <div className="flex flex-col overflow-hidden flex-1">
          <figcaption className="flex flex-row items-center whitespace-pre text-white">
            <span className="text-xs font-medium">{name}</span>
            <span className="mx-1 text-xs">·</span>
            <span className="text-xs text-gray-400">{time}</span>
          </figcaption>
          <p className="text-xs text-gray-300 mt-1">{description}</p>
        </div>
      </div>
    </figure>
  );
};

// Phone screen content
const CityConnectContent = () => {
  return (
    <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-blue-500/20 p-4 flex flex-col">
      {/* Header */}
      <div className="text-white text-lg font-bold mb-4 pt-8">CityConnect</div>

      {/* Live Updates */}
      <div className="flex-1 min-h-0">
        <div className="text-green-400 text-sm font-medium mb-3 flex items-center">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-2"></div>
          Live Updates
        </div>

        <div className="h-full overflow-y-auto">
          <AnimatedList className="space-y-2 pb-4">
            {liveUpdates.map((update, index) => (
              <UpdateNotification {...update} key={index} />
            ))}
          </AnimatedList>
        </div>
      </div>
    </div>
  );
};

// Orbiting background
const OrbitingCircles = ({ children }) => {
  return (
    <div className="relative">
      {/* Outer orbit */}
      <div
        className="absolute inset-0 animate-spin"
        style={{ animationDuration: "20s" }}
      >
        <div className="absolute w-8 h-8 bg-blue-500/30 rounded-full -top-4 left-1/2 transform -translate-x-1/2 blur-sm"></div>
        <div className="absolute w-6 h-6 bg-green-500/40 rounded-full top-1/4 -right-3 blur-sm"></div>
        <div className="absolute w-10 h-10 bg-purple-500/20 rounded-full -bottom-5 left-1/4 blur-sm"></div>
        <div className="absolute w-7 h-7 bg-pink-500/30 rounded-full top-3/4 -left-4 blur-sm"></div>
      </div>

      {/* Inner orbit */}
      <div
        className="absolute inset-0 animate-spin"
        style={{ animationDuration: "15s", animationDirection: "reverse" }}
      >
        <div className="absolute w-5 h-5 bg-yellow-500/40 rounded-full top-1/3 right-1/4 blur-sm"></div>
        <div className="absolute w-9 h-9 bg-cyan-500/25 rounded-full bottom-1/3 right-1/3 blur-sm"></div>
      </div>

      {children}
    </div>
  );
};

// Final Demo
const CityConnectDemo = () => {
  return (
    <div className="flex justify-center my-10 md:my-20">
      <OrbitingCircles>
        <Iphone15Pro className="w-[280px] h-[560px] md:w-[320px] md:h-[640px]">
          <CityConnectContent />
        </Iphone15Pro>
      </OrbitingCircles>
    </div>
  );
};

export default CityConnectDemo;
