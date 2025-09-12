export default function SettingsPage() {
  return (
    <div className="h-screen w-screen overflow-hidden">
      {/* Settings Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-start pt-16 pointer-events-none">
        <div className="max-w-4xl mx-auto text-white p-8 space-y-6 h-full overflow-y-auto">
          <h1 className="text-4xl font-bold text-center mb-8">Settings</h1>

          {/* Profile Settings */}
          <div className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-sm rounded-xl p-6 border border-gray-400/30 mb-6">
            <h2 className="text-2xl font-semibold mb-6">Profile Settings</h2>

            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-xl">JD</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-medium">John Doe</h3>
                  <p className="text-gray-400">john.doe@student.edu</p>
                </div>
                <button className="bg-blue-600/30 hover:bg-blue-600/50 px-4 py-2 rounded-lg transition-colors pointer-events-auto">
                  Edit Profile
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value="John Doe"
                    className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-2 text-white pointer-events-auto"
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Student ID
                  </label>
                  <input
                    type="text"
                    value="STU2024001"
                    className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-2 text-white pointer-events-auto"
                    readOnly
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Notification Settings */}
          <div className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-sm rounded-xl p-6 border border-gray-400/30 mb-6">
            <h2 className="text-2xl font-semibold mb-6">
              Notification Settings
            </h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium">Email Notifications</h3>
                  <p className="text-gray-400 text-sm">
                    Receive updates via email
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer pointer-events-auto">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    defaultChecked
                  />
                  <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium">Push Notifications</h3>
                  <p className="text-gray-400 text-sm">
                    Get notified about assignments and sessions
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer pointer-events-auto">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    defaultChecked
                  />
                  <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium">Study Reminders</h3>
                  <p className="text-gray-400 text-sm">
                    Daily study session reminders
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer pointer-events-auto">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Learning Preferences */}
          <div className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-sm rounded-xl p-6 border border-gray-400/30 mb-6">
            <h2 className="text-2xl font-semibold mb-6">
              Learning Preferences
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Preferred Learning Style
                </label>
                <select className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-2 text-white pointer-events-auto">
                  <option>Visual</option>
                  <option>Auditory</option>
                  <option>Kinesthetic</option>
                  <option>Reading/Writing</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Study Session Duration
                </label>
                <select className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-2 text-white pointer-events-auto">
                  <option>30 minutes</option>
                  <option>45 minutes</option>
                  <option>60 minutes</option>
                  <option>90 minutes</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Difficulty Level
                </label>
                <select className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-2 text-white pointer-events-auto">
                  <option>Beginner</option>
                  <option>Intermediate</option>
                  <option>Advanced</option>
                  <option>Expert</option>
                </select>
              </div>
            </div>
          </div>

          {/* Privacy & Security */}
          <div className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-sm rounded-xl p-6 border border-gray-400/30 mb-6">
            <h2 className="text-2xl font-semibold mb-6">Privacy & Security</h2>

            <div className="space-y-4">
              <button className="w-full bg-blue-600/30 hover:bg-blue-600/50 text-left px-4 py-3 rounded-lg transition-colors pointer-events-auto">
                <h3 className="font-medium">Change Password</h3>
                <p className="text-gray-400 text-sm">
                  Update your account password
                </p>
              </button>

              <button className="w-full bg-green-600/30 hover:bg-green-600/50 text-left px-4 py-3 rounded-lg transition-colors pointer-events-auto">
                <h3 className="font-medium">Two-Factor Authentication</h3>
                <p className="text-gray-400 text-sm">
                  Add extra security to your account
                </p>
              </button>

              <button className="w-full bg-purple-600/30 hover:bg-purple-600/50 text-left px-4 py-3 rounded-lg transition-colors pointer-events-auto">
                <h3 className="font-medium">Privacy Settings</h3>
                <p className="text-gray-400 text-sm">
                  Control who can see your profile
                </p>
              </button>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-center space-x-4">
            <button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 pointer-events-auto">
              Save Changes
            </button>
            <button className="bg-gray-600/30 hover:bg-gray-600/50 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 pointer-events-auto">
              Reset to Default
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
