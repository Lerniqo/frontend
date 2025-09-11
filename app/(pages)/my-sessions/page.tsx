export default function MySessionsPage() {
  return (
    <div className="h-screen w-screen overflow-hidden">
      {/* My Sessions Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-start pt-16 pointer-events-none">
        <div className="max-w-6xl mx-auto text-white p-8 space-y-6 h-full overflow-y-auto">
          <h1 className="text-4xl font-bold text-center mb-8">My Sessions</h1>

          {/* Session Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-600/20 to-indigo-600/20 backdrop-blur-sm rounded-xl p-6 border border-blue-400/30 text-center">
              <h3 className="text-lg font-semibold mb-2">Upcoming Sessions</h3>
              <p className="text-3xl font-bold text-blue-300">3</p>
            </div>

            <div className="bg-gradient-to-br from-green-600/20 to-emerald-600/20 backdrop-blur-sm rounded-xl p-6 border border-green-400/30 text-center">
              <h3 className="text-lg font-semibold mb-2">
                Completed This Week
              </h3>
              <p className="text-3xl font-bold text-green-300">7</p>
            </div>

            <div className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 backdrop-blur-sm rounded-xl p-6 border border-purple-400/30 text-center">
              <h3 className="text-lg font-semibold mb-2">Total Hours</h3>
              <p className="text-3xl font-bold text-purple-300">45</p>
            </div>
          </div>

          {/* Upcoming Sessions */}
          <div className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-sm rounded-xl p-6 border border-gray-400/30 mb-6">
            <h2 className="text-2xl font-semibold mb-6">Upcoming Sessions</h2>

            <div className="space-y-4">
              <div className="bg-blue-600/20 rounded-lg p-4 border border-blue-400/30">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-medium">Mathematics Tutoring</h3>
                  <span className="text-sm bg-blue-600/30 px-2 py-1 rounded">
                    Live
                  </span>
                </div>
                <p className="text-gray-300 text-sm mb-2">
                  Algebra and Geometry review session
                </p>
                <div className="flex items-center justify-between text-sm text-gray-400">
                  <span>📅 Today, 3:00 PM - 4:00 PM</span>
                  <span>👨‍🏫 Prof. Johnson</span>
                </div>
              </div>

              <div className="bg-green-600/20 rounded-lg p-4 border border-green-400/30">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-medium">Chemistry Lab Session</h3>
                  <span className="text-sm bg-green-600/30 px-2 py-1 rounded">
                    Scheduled
                  </span>
                </div>
                <p className="text-gray-300 text-sm mb-2">
                  Organic chemistry experiments
                </p>
                <div className="flex items-center justify-between text-sm text-gray-400">
                  <span>📅 Tomorrow, 10:00 AM - 12:00 PM</span>
                  <span>👩‍🏫 Dr. Smith</span>
                </div>
              </div>

              <div className="bg-purple-600/20 rounded-lg p-4 border border-purple-400/30">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-medium">
                    English Literature Discussion
                  </h3>
                  <span className="text-sm bg-purple-600/30 px-2 py-1 rounded">
                    Scheduled
                  </span>
                </div>
                <p className="text-gray-300 text-sm mb-2">
                  Shakespeare analysis group session
                </p>
                <div className="flex items-center justify-between text-sm text-gray-400">
                  <span>📅 Friday, 2:00 PM - 3:30 PM</span>
                  <span>👩‍🏫 Ms. Williams</span>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Sessions */}
          <div className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-sm rounded-xl p-6 border border-gray-400/30">
            <h2 className="text-2xl font-semibold mb-6">Recent Sessions</h2>

            <div className="space-y-4">
              <div className="bg-gray-700/30 rounded-lg p-4 border border-gray-600/30">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-medium">
                    Physics Problem Solving
                  </h3>
                  <span className="text-sm bg-gray-600/30 px-2 py-1 rounded">
                    Completed
                  </span>
                </div>
                <p className="text-gray-300 text-sm mb-2">
                  Mechanics and thermodynamics
                </p>
                <div className="flex items-center justify-between text-sm text-gray-400">
                  <span>📅 Yesterday, 4:00 PM - 5:30 PM</span>
                  <span>⭐ Rated 5/5</span>
                </div>
              </div>

              <div className="bg-gray-700/30 rounded-lg p-4 border border-gray-600/30">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-medium">History Study Group</h3>
                  <span className="text-sm bg-gray-600/30 px-2 py-1 rounded">
                    Completed
                  </span>
                </div>
                <p className="text-gray-300 text-sm mb-2">
                  World War II timeline review
                </p>
                <div className="flex items-center justify-between text-sm text-gray-400">
                  <span>📅 Monday, 1:00 PM - 2:00 PM</span>
                  <span>⭐ Rated 4/5</span>
                </div>
              </div>
            </div>
          </div>

          {/* Schedule New Session Button */}
          <div className="flex justify-center">
            <button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 pointer-events-auto">
              Schedule New Session
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
