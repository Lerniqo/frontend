export default function LearningPathPage() {
  return (
    <div className="h-screen w-screen overflow-hidden">
      {/* Learning Path Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <div className="max-w-4xl mx-auto text-center space-y-6 text-white p-8">
          <h1 className="text-4xl font-bold mb-8">Learning Path</h1>

          {/* Path Progress */}
          <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 backdrop-blur-sm rounded-xl p-6 border border-purple-400/30">
            <h2 className="text-2xl font-semibold mb-4">
              Your Current Progress
            </h2>
            <div className="w-full bg-gray-700/50 rounded-full h-4 mb-4">
              <div className="bg-gradient-to-r from-purple-500 to-blue-500 h-4 rounded-full w-3/4"></div>
            </div>
            <p className="text-lg">75% Complete - 3 of 4 modules finished</p>
          </div>

          {/* Learning Modules */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
            <div className="bg-gradient-to-br from-green-600/20 to-emerald-600/20 backdrop-blur-sm rounded-xl p-4 border border-green-400/30">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                <h3 className="text-lg font-semibold">Module 1: Basics</h3>
              </div>
              <p className="text-sm text-gray-300">Completed ✓</p>
            </div>

            <div className="bg-gradient-to-br from-green-600/20 to-emerald-600/20 backdrop-blur-sm rounded-xl p-4 border border-green-400/30">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                <h3 className="text-lg font-semibold">
                  Module 2: Intermediate
                </h3>
              </div>
              <p className="text-sm text-gray-300">Completed ✓</p>
            </div>

            <div className="bg-gradient-to-br from-green-600/20 to-emerald-600/20 backdrop-blur-sm rounded-xl p-4 border border-green-400/30">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                <h3 className="text-lg font-semibold">Module 3: Advanced</h3>
              </div>
              <p className="text-sm text-gray-300">Completed ✓</p>
            </div>

            <div className="bg-gradient-to-br from-yellow-600/20 to-orange-600/20 backdrop-blur-sm rounded-xl p-4 border border-yellow-400/30">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
                <h3 className="text-lg font-semibold">Module 4: Expert</h3>
              </div>
              <p className="text-sm text-gray-300">In Progress...</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
