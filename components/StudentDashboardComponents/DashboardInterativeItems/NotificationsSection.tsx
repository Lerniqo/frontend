export default function NotificationsSection() {
  return (
    <div className="flex-1 bg-gradient-to-br from-purple-800/40 to-blue-900/40 rounded-xl p-4 backdrop-blur-sm border border-purple-400/30 h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Notifications</h3>
        <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
      </div>

      <div className="space-y-3 max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-purple-400/50 scrollbar-track-transparent">
        {/* Assignment Due Notification */}
        <div className="bg-white/10 rounded-lg p-3 border-l-4 border-orange-400 hover:bg-white/20 transition-colors duration-200">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h4 className="text-sm font-medium text-white mb-1">
                Assignment Due
              </h4>
              <p className="text-xs text-blue-200/80">
                Math homework is due tomorrow at 11:59 PM
              </p>
              <span className="text-xs text-orange-300 mt-1 block">
                Due in 18 hours
              </span>
            </div>
            <div className="w-2 h-2 bg-orange-400 rounded-full ml-2"></div>
          </div>
        </div>

        {/* New Message Notification */}
        <div className="bg-white/10 rounded-lg p-3 border-l-4 border-blue-400 hover:bg-white/20 transition-colors duration-200">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h4 className="text-sm font-medium text-white mb-1">
                New Message
              </h4>
              <p className="text-xs text-blue-200/80">
                Your teacher posted feedback on your essay
              </p>
              <span className="text-xs text-blue-300 mt-1 block">
                2 minutes ago
              </span>
            </div>
            <div className="w-2 h-2 bg-blue-400 rounded-full ml-2"></div>
          </div>
        </div>

        {/* Grade Posted Notification */}
        <div className="bg-white/10 rounded-lg p-3 border-l-4 border-green-400 hover:bg-white/20 transition-colors duration-200">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h4 className="text-sm font-medium text-white mb-1">
                Grade Posted
              </h4>
              <p className="text-xs text-blue-200/80">
                Your Science quiz grade is now available
              </p>
              <span className="text-xs text-green-300 mt-1 block">
                1 hour ago
              </span>
            </div>
            <div className="w-2 h-2 bg-green-400 rounded-full ml-2"></div>
          </div>
        </div>

        {/* Event Reminder */}
        <div className="bg-white/10 rounded-lg p-3 border-l-4 border-purple-400 hover:bg-white/20 transition-colors duration-200">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h4 className="text-sm font-medium text-white mb-1">
                Event Reminder
              </h4>
              <p className="text-xs text-blue-200/80">
                Virtual study group starts in 30 minutes
              </p>
              <span className="text-xs text-purple-300 mt-1 block">
                Starting soon
              </span>
            </div>
            <div className="w-2 h-2 bg-purple-400 rounded-full ml-2"></div>
          </div>
        </div>

        {/* Course Update */}
        <div className="bg-white/10 rounded-lg p-3 border-l-4 border-yellow-400 hover:bg-white/20 transition-colors duration-200">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h4 className="text-sm font-medium text-white mb-1">
                Course Update
              </h4>
              <p className="text-xs text-blue-200/80">
                New learning materials added to History class
              </p>
              <span className="text-xs text-yellow-300 mt-1 block">
                3 hours ago
              </span>
            </div>
            <div className="w-2 h-2 bg-yellow-400 rounded-full ml-2"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
