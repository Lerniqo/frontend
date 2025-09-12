import React, { useState, useEffect } from "react";
import { User } from "lucide-react";
import { userService } from "../../../services/userService";

const ProfileButton = ({ onClick, className = "" }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [profileImage, setProfileImage] = useState("");

  useEffect(() => {
    const fetchProfileImage = async () => {
      const response = await userService.getProfileImage();
      if (response.success) {
        setProfileImage(response.imageUrl);
      }
    };

    fetchProfileImage();
  }, []);

  return (
    <button
      onClick={onClick}
      className={`relative group transition-all duration-300 ease-in-out ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-label="Profile Navigation"
    >
      {/* Outer glow ring */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-emerald-400 via-teal-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-lg scale-110" />

      {/* Gradient border wrapper */}
      <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-emerald-400/40 via-teal-500/40 to-blue-600/40 p-1 shadow-lg shadow-teal-500/25">
        {/* Main circular container with white background */}
        <div
          className={`
            overflow-hidden
          w-full h-full rounded-full 
          bg-white
          flex items-center justify-center
          transition-all duration-300 ease-in-out
          ${isHovered ? "scale-105 shadow-xl shadow-teal-500/40" : "scale-100"}
          active:scale-95
        `}
        >
          {/* Profile Icon with gradient background */}
          <img src={profileImage ? profileImage : "/globe.svg"} alt="" />
          <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center"></div>
        </div>
      </div>

      {/* Status indicator dot */}
      <div className="absolute -top-1 -right-1 w-5 h-5 bg-white rounded-full border-2 border-emerald-400 shadow-sm">
        <div className="w-3 h-3 bg-gradient-to-br from-emerald-400 via-teal-500 to-blue-600 rounded-full animate-pulse m-0.5" />
      </div>
    </button>
  );
};

export default ProfileButton;
