export default function ForumPage() {
  return (
    <div className="h-screen w-screen overflow-hidden">
      {/* Forum Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-start pt-16 pointer-events-none">
        <div className="max-w-6xl mx-auto text-white p-8 space-y-6 h-full overflow-y-auto">
          <h1 className="text-4xl font-bold text-center mb-8">Student Forum</h1>

          {/* Forum Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-gradient-to-br from-blue-600/20 to-indigo-600/20 backdrop-blur-sm rounded-xl p-4 border border-blue-400/30 text-center">
              <h3 className="text-sm font-semibold mb-1">Active Discussions</h3>
              <p className="text-2xl font-bold text-blue-300">23</p>
            </div>

            <div className="bg-gradient-to-br from-green-600/20 to-emerald-600/20 backdrop-blur-sm rounded-xl p-4 border border-green-400/30 text-center">
              <h3 className="text-sm font-semibold mb-1">Your Posts</h3>
              <p className="text-2xl font-bold text-green-300">8</p>
            </div>

            <div className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 backdrop-blur-sm rounded-xl p-4 border border-purple-400/30 text-center">
              <h3 className="text-sm font-semibold mb-1">Helpful Answers</h3>
              <p className="text-2xl font-bold text-purple-300">15</p>
            </div>

            <div className="bg-gradient-to-br from-yellow-600/20 to-orange-600/20 backdrop-blur-sm rounded-xl p-4 border border-yellow-400/30 text-center">
              <h3 className="text-sm font-semibold mb-1">Reputation</h3>
              <p className="text-2xl font-bold text-yellow-300">142</p>
            </div>
          </div>

          {/* Recent Discussions */}
          <div className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-sm rounded-xl p-6 border border-gray-400/30">
            <h2 className="text-2xl font-semibold mb-6">Recent Discussions</h2>

            <div className="space-y-4">
              {/* Discussion Item */}
              <div className="bg-white/5 rounded-lg p-4 border border-gray-600/30 hover:bg-white/10 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-medium text-white">
                    Need help with calculus derivatives
                  </h3>
                  <span className="text-xs text-gray-400">2 min ago</span>
                </div>
                <p className="text-gray-300 text-sm mb-3">
                  I&apos;m struggling with the chain rule and when to apply it. Can
                  someone explain with examples?
                </p>
                <div className="flex items-center space-x-4 text-xs text-gray-400">
                  <span>👤 by Sarah Johnson</span>
                  <span>💬 3 replies</span>
                  <span>📚 Mathematics</span>
                </div>
              </div>

              {/* Discussion Item */}
              <div className="bg-white/5 rounded-lg p-4 border border-gray-600/30 hover:bg-white/10 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-medium text-white">
                    Chemistry lab safety question
                  </h3>
                  <span className="text-xs text-gray-400">15 min ago</span>
                </div>
                <p className="text-gray-300 text-sm mb-3">
                  What are the proper procedures for handling acid solutions in
                  the lab?
                </p>
                <div className="flex items-center space-x-4 text-xs text-gray-400">
                  <span>👤 by Mike Chen</span>
                  <span>💬 7 replies</span>
                  <span>🧪 Chemistry</span>
                </div>
              </div>

              {/* Discussion Item */}
              <div className="bg-white/5 rounded-lg p-4 border border-gray-600/30 hover:bg-white/10 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-medium text-white">
                    Study group for upcoming physics exam
                  </h3>
                  <span className="text-xs text-gray-400">1 hour ago</span>
                </div>
                <p className="text-gray-300 text-sm mb-3">
                  Looking for students to form a study group for the physics
                  midterm next week.
                </p>
                <div className="flex items-center space-x-4 text-xs text-gray-400">
                  <span>👤 by Alex Rivera</span>
                  <span>💬 12 replies</span>
                  <span>⚡ Physics</span>
                </div>
              </div>

              {/* Discussion Item */}
              <div className="bg-white/5 rounded-lg p-4 border border-gray-600/30 hover:bg-white/10 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-medium text-white">
                    Essay writing tips for English literature
                  </h3>
                  <span className="text-xs text-gray-400">3 hours ago</span>
                </div>
                <p className="text-gray-300 text-sm mb-3">
                  How do you structure an analytical essay for Shakespeare&apos;s
                  plays?
                </p>
                <div className="flex items-center space-x-4 text-xs text-gray-400">
                  <span>👤 by Emma Davis</span>
                  <span>💬 9 replies</span>
                  <span>📖 English</span>
                </div>
              </div>
            </div>
          </div>

          {/* New Post Button */}
          <div className="flex justify-center">
            <button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 pointer-events-auto">
              Start New Discussion
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
