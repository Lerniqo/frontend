export default function NavigationPanel() {
  return (
    <div className="flex-1 h-full">
      <div className="bg-gradient-to-br from-purple-800/40 to-blue-900/40 p-6 rounded-xl shadow-2xl h-full w-full backdrop-blur-sm border border-purple-400/30">
        <h2 className="text-xl font-bold text-white mb-6 tracking-wide">
          Navigation
        </h2>
        <nav className="space-y-3">
          <a
            href="#"
            className="flex items-center px-4 py-3 text-blue-200 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300 group"
          >
            <span className="w-2 h-2 bg-blue-400 rounded-full mr-3 group-hover:bg-purple-300 transition-colors duration-300"></span>
            Dashboard
          </a>
          <a
            href="#"
            className="flex items-center px-4 py-3 text-blue-200 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300 group"
          >
            <span className="w-2 h-2 bg-blue-400 rounded-full mr-3 group-hover:bg-purple-300 transition-colors duration-300"></span>
            Profile
          </a>
          <a
            href="#"
            className="flex items-center px-4 py-3 text-blue-200 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300 group"
          >
            <span className="w-2 h-2 bg-blue-400 rounded-full mr-3 group-hover:bg-purple-300 transition-colors duration-300"></span>
            Settings
          </a>
        </nav>
      </div>
    </div>
  );
}
