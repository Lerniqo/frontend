export default function ProgressPage() {
  return (
    <div className="h-screen w-screen overflow-hidden">
      {/* Progress Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-start pt-20 pointer-events-none">
        <div className="max-w-6xl mx-auto text-white p-8 space-y-6">
          <h1 className="text-4xl font-bold text-center mb-8">
            Learning Progress
          </h1>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-600/20 to-indigo-600/20 backdrop-blur-sm rounded-xl p-6 border border-blue-400/30 text-center">
              <h3 className="text-lg font-semibold mb-2">Total Hours</h3>
              <p className="text-3xl font-bold text-blue-300">124</p>
            </div>

            <div className="bg-gradient-to-br from-green-600/20 to-emerald-600/20 backdrop-blur-sm rounded-xl p-6 border border-green-400/30 text-center">
              <h3 className="text-lg font-semibold mb-2">Completed Lessons</h3>
              <p className="text-3xl font-bold text-green-300">47</p>
            </div>

            <div className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 backdrop-blur-sm rounded-xl p-6 border border-purple-400/30 text-center">
              <h3 className="text-lg font-semibold mb-2">Current Streak</h3>
              <p className="text-3xl font-bold text-purple-300">15 days</p>
            </div>
          </div>

          {/* Subject Progress */}
          <div className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-sm rounded-xl p-6 border border-gray-400/30">
            <h2 className="text-2xl font-semibold mb-6">Subject Progress</h2>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-lg">Mathematics</span>
                  <span className="text-green-300">85%</span>
                </div>
                <div className="w-full bg-gray-700/50 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full"
                    style={{ width: "85%" }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-lg">Science</span>
                  <span className="text-blue-300">72%</span>
                </div>
                <div className="w-full bg-gray-700/50 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-indigo-500 h-3 rounded-full"
                    style={{ width: "72%" }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-lg">English</span>
                  <span className="text-purple-300">91%</span>
                </div>
                <div className="w-full bg-gray-700/50 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full"
                    style={{ width: "91%" }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-lg">History</span>
                  <span className="text-yellow-300">68%</span>
                </div>
                <div className="w-full bg-gray-700/50 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-yellow-500 to-orange-500 h-3 rounded-full"
                    style={{ width: "68%" }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-gradient-to-br from-indigo-600/20 to-purple-600/20 backdrop-blur-sm rounded-xl p-6 border border-indigo-400/30">
            <h2 className="text-2xl font-semibold mb-4">Recent Activity</h2>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>Completed &ldquo;Algebra Fundamentals&rdquo; - 2 hours ago</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span>Started &ldquo;Chemical Reactions&rdquo; - 5 hours ago</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                <span>Earned &ldquo;Quick Learner&rdquo; badge - 1 day ago</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
