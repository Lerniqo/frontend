import React, { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";
import { useRouter } from "next/navigation";
import ProfileButton from "./ProfileButton";
import SettingButton from "./SettingButton";
import LogoutButton from "./LogoutButton";
import HideButton from "./HideButton";

export default function ProfileNavigationButton() {
  const [isExpanded, setIsExpanded] = useState(false);
  const router = useRouter();
  const settingButtonRef = useRef(null);
  const logoutButtonRef = useRef(null);
  const containerRef = useRef(null);
  const closeButtonRef = useRef(null);

  useEffect(() => {
    // Initialize the buttons to be hidden
    gsap.set(
      [
        settingButtonRef.current,
        logoutButtonRef.current,
        closeButtonRef.current,
      ],
      {
        opacity: 0,
        scale: 0,
        y: -10,
      }
    );
  }, []);

  const toggleExpansion = () => {
    if (isExpanded) {
      router.push("/Student/Profile");
      return;
    }
    setIsExpanded(!isExpanded);

    if (!isExpanded) {
      // Show the buttons with GSAP animation
      gsap
        .timeline()
        .to(
          [
            settingButtonRef.current,
            logoutButtonRef.current,
            closeButtonRef.current,
          ],
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.3,
            stagger: 0.1,
            ease: "back.out(1.7)",
          }
        );
    }
  };
  const toggleHide = () => {
    setIsExpanded(false);
    // Hide the buttons with GSAP animation
    gsap.to(
      [
        settingButtonRef.current,
        logoutButtonRef.current,
        closeButtonRef.current,
      ],
      {
        opacity: 0,
        scale: 0,
        y: -10,
        duration: 0.2,
        stagger: 0.05,
        ease: "power2.in",
      }
    );
  };

  return (
    <div ref={containerRef} className="">
      <ProfileButton onClick={toggleExpansion} />
      <div className="absolute top-21 right-4 flex flex-col gap-2">
        <div ref={settingButtonRef}>
          <SettingButton />
        </div>
        <div ref={logoutButtonRef}>
          <LogoutButton />
        </div>
        <div ref={closeButtonRef}>
          <HideButton onClick={toggleHide} />
        </div>
      </div>
    </div>
  );
}
