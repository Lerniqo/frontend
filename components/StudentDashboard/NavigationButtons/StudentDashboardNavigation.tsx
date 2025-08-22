import ProfileNavigationButton from "./ProfileNavigationButton";
import LearningPathButton from "./LearningPathButton";
import EventsButton from "./EventsButton";
import ForumButton from "./ForumButton";
import StoreButton from "./StoreButton";

export default function StudentDashboardNavigation() {
  return (
    <div
      className="top-2 absolute left-1/2 -translate-x-1/2 pointer-events-auto bg-gradient-to-r from-blue-100/70 via-teal-50/60 to-white/80 backdrop-blur-md h-20 px-4 py-4 rounded-full shadow-md flex items-center justify-between gap-3"
      style={{ width: "calc(100vw - 20px)" }}
    >
      <div className="flex flex-row gap-2">
        <StoreButton />
        <EventsButton />

        <ForumButton />
      </div>
      <div className="flex flex-row gap-3">
        <LearningPathButton />
        <ProfileNavigationButton />
      </div>
    </div>
  );
}
