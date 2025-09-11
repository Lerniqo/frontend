import NavigationPanel from "./DashboardInterativeItems/NavigationPanel";
import WelcomeMessageBar from "./DashboardInterativeItems/WelcomeMessageBar";
import ProfileNavigationButton from "./DashboardInterativeItems/ProfileNavigationButton";
import NotificationsSection from "./DashboardInterativeItems/NotificationsSection";

export default function DashboardButtons() {
  return (
    <>
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none flex flex-row justify-between p-4 space-y-4 gap-4">
        <NavigationPanel />
        <WelcomeMessageBar />
        <div className="flex flex-col gap-3 flex-1 bg-gradient-to-br from-purple-800/40 to-blue-900/40 p-4 rounded-xl shadow-2xl h-full w-full backdrop-blur-sm border border-purple-400 border-opacity-30">
          <ProfileNavigationButton />
          <NotificationsSection />
        </div>
      </div>
      {/* Have to implement below botton actualy as a new component */}
      <div className="fixed bottom-6 right-6 z-50">
        <button className="w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full shadow-2xl hover:shadow-purple-500/50 hover:scale-110 transition-all duration-300 flex items-center justify-center group border-2 border-purple-400/30 backdrop-blur-sm">
          <div className="relative">
            {/* AI Brain Icon */}
            <svg
              className="w-8 h-8 text-white group-hover:text-purple-200 transition-colors duration-300"
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
            {/* Pulsing dot indicator */}
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
          </div>
        </button>
      </div>
    </>
  );
}
