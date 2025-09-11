export default function AITutorPage() {
  return (
    <div className="h-screen w-screen overflow-hidden">
      {/* AI Tutor Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <div className="max-w-4xl mx-auto text-white p-8 space-y-6">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">AI Tutor Assistant</h1>
            <p className="text-xl text-gray-300">
              Get instant help with your studies
            </p>
          </div>

          {/* AI Tutor Interface */}
          <div className="bg-gradient-to-br from-purple-800/40 to-blue-900/40 backdrop-blur-sm rounded-xl p-6 border border-purple-400/30">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-semibold">AI Tutor</h2>
                <p className="text-sm text-gray-300">
                  Online and ready to help
                </p>
              </div>
              <div className="ml-auto">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              </div>
            </div>

            {/* Chat Area */}
            <div className="bg-gray-900/50 rounded-lg p-4 h-64 overflow-y-auto mb-4 space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-xs">
                  AI
                </div>
                <div className="bg-purple-600/30 rounded-lg p-3 max-w-xs">
                  <p className="text-sm">
                    Hello! I&apos;m your AI tutor. What subject would you like help
                    with today?
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 justify-end">
                <div className="bg-blue-600/30 rounded-lg p-3 max-w-xs">
                  <p className="text-sm">
                    I need help with quadratic equations
                  </p>
                </div>
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-xs">
                  You
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-xs">
                  AI
                </div>
                <div className="bg-purple-600/30 rounded-lg p-3 max-w-xs">
                  <p className="text-sm">
                    Great! Quadratic equations are in the form ax² + bx + c = 0.
                    Would you like me to explain the quadratic formula or help
                    with a specific problem?
                  </p>
                </div>
              </div>
            </div>

            {/* Input Area */}
            <div className="flex space-x-3 pointer-events-auto">
              <input
                type="text"
                placeholder="Ask me anything about your studies..."
                className="flex-1 bg-gray-800/50 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
              />
              <button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-2 rounded-lg transition-all duration-300">
                Send
              </button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="bg-gradient-to-br from-blue-600/20 to-indigo-600/20 backdrop-blur-sm rounded-xl p-4 border border-blue-400/30 text-center hover:bg-blue-600/30 transition-all duration-300 pointer-events-auto">
              <div className="text-2xl mb-2">📊</div>
              <p className="text-sm font-medium">Math Help</p>
            </button>

            <button className="bg-gradient-to-br from-green-600/20 to-emerald-600/20 backdrop-blur-sm rounded-xl p-4 border border-green-400/30 text-center hover:bg-green-600/30 transition-all duration-300 pointer-events-auto">
              <div className="text-2xl mb-2">🧪</div>
              <p className="text-sm font-medium">Science</p>
            </button>

            <button className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 backdrop-blur-sm rounded-xl p-4 border border-purple-400/30 text-center hover:bg-purple-600/30 transition-all duration-300 pointer-events-auto">
              <div className="text-2xl mb-2">📚</div>
              <p className="text-sm font-medium">Literature</p>
            </button>

            <button className="bg-gradient-to-br from-yellow-600/20 to-orange-600/20 backdrop-blur-sm rounded-xl p-4 border border-yellow-400/30 text-center hover:bg-yellow-600/30 transition-all duration-300 pointer-events-auto">
              <div className="text-2xl mb-2">🌍</div>
              <p className="text-sm font-medium">History</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
