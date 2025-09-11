"use client";
import { useRouter } from "next/navigation";

export default function ProfileNavigationButton() {
  const router = useRouter();

  const handleProfileClick = () => {
    router.push("/settings");
  };

  return (
    <div
      onClick={handleProfileClick}
      className="w-full aspect-square bg-gradient-to-br from-purple-800/40 to-blue-900/40 rounded-xl flex flex-col items-center justify-center p-4 backdrop-blur-sm border border-purple-400/30 hover:bg-white/20 transition-all duration-300 cursor-pointer group"
    >
      <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-blue-500 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
        <span className="text-white font-bold text-lg">JD</span>
      </div>
      <div className="text-center">
        <h3 className="text-white font-semibold text-sm mb-1">John Doe</h3>
        <p className="text-blue-200/80 text-xs">Student</p>
        <div className="flex items-center justify-center mt-2">
          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
          <span className="text-green-300 text-xs ml-1">Online</span>
        </div>
      </div>
    </div>
  );
}
