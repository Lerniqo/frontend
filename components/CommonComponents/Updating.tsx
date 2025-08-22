export default function UpdatingComponent() {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-100/80 via-green-50/80 to-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="relative">
        {/* Main spinning circle */}
        <div className="w-16 h-16 border-4 border-transparent rounded-full animate-spin">
          <div className="absolute inset-0 border-4 border-t-blue-500 border-r-green-400 border-b-blue-300 border-l-green-300 rounded-full animate-spin"></div>
        </div>

        {/* Inner pulsing dot */}
        <div className="absolute inset-4 bg-gradient-to-br from-blue-400 to-green-400 rounded-full animate-pulse shadow-lg"></div>

        {/* Outer spinning rings */}
        <div
          className="absolute -inset-2 border-2 border-transparent rounded-full animate-spin"
          style={{ animationDuration: "2s", animationDirection: "reverse" }}
        >
          <div className="absolute inset-0 border-2 border-t-transparent border-r-blue-200 border-b-transparent border-l-green-200 rounded-full"></div>
        </div>

        {/* Loading text */}
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 text-center">
          <p className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent animate-pulse">
            Updating...
          </p>
          <div className="flex justify-center mt-2 space-x-1">
            <div
              className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
              style={{ animationDelay: "0ms" }}
            ></div>
            <div
              className="w-2 h-2 bg-green-400 rounded-full animate-bounce"
              style={{ animationDelay: "150ms" }}
            ></div>
            <div
              className="w-2 h-2 bg-blue-300 rounded-full animate-bounce"
              style={{ animationDelay: "300ms" }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}
