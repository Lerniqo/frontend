export default function StudentDashboardPage() {
  return (
    <div className="w-full h-full flex gap-4">
      <div className="flex-2 h-1/4 bg-gradient-to-br from-purple-800/40 to-blue-900/40 rounded-xl shadow-2xl backdrop-blur-sm border border-purple-400/30">
        <div className="p-6 h-full flex flex-col justify-center items-center">
          <h1 className="text-3xl font-semibold text-white tracking-tight mb-2">
            Welcome to Lerniqo
          </h1>
          <p className="mt-2 text-sm text-purple-100/90">
            Your personalized student dashboard for courses, progress, and
            tasks.
          </p>
        </div>
      </div>
      <div className="flex-1 flex flex-col bg-gradient-to-br from-purple-800/10 to-blue-900/10 rounded-xl shadow-2xl backdrop-blur-sm border border-purple-400/10 p-3 gap-3">
        {/* Profile Section */}
        <div className="flex-1 flex flex-row bg-gradient-to-br from-purple-800/40 to-blue-900/40 rounded-xl shadow-2xl backdrop-blur-sm border border-purple-400/30 p-4">
          <div className="flex-1 flex flex-col justify-center">
            <h2 className="text-xl font-semibold text-white mb-2">
              Student Profile
            </h2>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-purple-200 text-sm">Name:</span>
                <span className="text-white font-medium">John Doe</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-purple-200 text-sm">Class:</span>
                <span className="text-white font-medium">10th Grade</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-purple-200 text-sm">Student ID:</span>
                <span className="text-white font-medium">#ST2024001</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-purple-200 text-sm">Progress:</span>
                <div className="flex-1 bg-purple-900/50 rounded-full h-2 ml-2">
                  <div className="bg-gradient-to-r from-purple-400 to-blue-400 h-2 rounded-full w-3/4"></div>
                </div>
                <span className="text-white text-sm">75%</span>
              </div>
            </div>
          </div>
          <div className="flex-1 flex items-center justify-center p-4">
            <div className="w-24 h-24 bg-gradient-to-br from-purple-400 to-blue-400 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-white text-2xl font-bold">JD</span>
            </div>
          </div>
        </div>

        {/* Notifications Section */}
        <div className="flex-2 bg-gradient-to-br from-purple-800/40 to-blue-900/40 rounded-xl shadow-2xl backdrop-blur-sm border border-purple-400/30 p-4">
          <div className="h-full flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-white">
                Notifications
              </h2>
              <div className="bg-purple-500 text-white text-xs px-2 py-1 rounded-full">
                3 new
              </div>
            </div>
            <div className="flex-1 space-y-3 overflow-y-auto">
              <div className="bg-purple-900/30 rounded-lg p-3 border border-purple-400/20">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                  <div className="flex-1">
                    <p className="text-white text-sm font-medium">
                      New assignment uploaded
                    </p>
                    <p className="text-purple-200 text-xs mt-1">
                      Mathematics - Chapter 5 exercises are now available
                    </p>
                    <p className="text-purple-300 text-xs mt-1">2 hours ago</p>
                  </div>
                </div>
              </div>

              <div className="bg-purple-900/30 rounded-lg p-3 border border-purple-400/20">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                  <div className="flex-1">
                    <p className="text-white text-sm font-medium">
                      Quiz completed
                    </p>
                    <p className="text-purple-200 text-xs mt-1">
                      Great job! You scored 85% in Science Quiz #3
                    </p>
                    <p className="text-purple-300 text-xs mt-1">1 day ago</p>
                  </div>
                </div>
              </div>

              <div className="bg-purple-900/30 rounded-lg p-3 border border-purple-400/20">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                  <div className="flex-1">
                    <p className="text-white text-sm font-medium">
                      Upcoming deadline
                    </p>
                    <p className="text-purple-200 text-xs mt-1">
                      History project submission due in 2 days
                    </p>
                    <p className="text-purple-300 text-xs mt-1">3 days ago</p>
                  </div>
                </div>
              </div>

              <div className="bg-purple-900/30 rounded-lg p-3 border border-purple-400/20">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                  <div className="flex-1">
                    <p className="text-white text-sm font-medium">
                      New lesson available
                    </p>
                    <p className="text-purple-200 text-xs mt-1">
                      English Literature - Poetry Analysis module is ready
                    </p>
                    <p className="text-purple-300 text-xs mt-1">1 week ago</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-purple-400/20">
              <button className="w-full text-center text-purple-300 text-sm">
                View all notifications
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
