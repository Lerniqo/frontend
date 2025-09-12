export default function WelcomeMessageBar() {
  return (
    <div className="flex-3 bg-gradient-to-br from-purple-800/40 to-blue-900/40 p-6 rounded-xl shadow-2xl h-1/4 w-full backdrop-blur-sm border border-purple-400/30 flex flex-col justify-center">
      <div className="text-center space-y-3">
        <h1 className="text-3xl md:text-4xl font-bold text-white tracking-wide">
          Welcome to Your Dashboard
        </h1>
        <p className="text-lg text-blue-200/90 font-medium">
          Ready to continue your learning journey?
        </p>
        <div className="flex items-center justify-center space-x-2 mt-4">
          <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse delay-100"></div>
          <div className="w-2 h-2 bg-purple-300 rounded-full animate-pulse delay-200"></div>
        </div>
      </div>
    </div>
  );
}
