"use client";

import React, { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";
import {
  FaChalkboardTeacher,
  FaUserGraduate,
  FaUserShield,
} from "react-icons/fa";

interface UserTypeSelectorProps {
  onSelectRole: (selectedRole: string) => void;
  initialSelection?: string;
}

interface UserTypeOption {
  id: string;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  description: string;
}

const userTypes: UserTypeOption[] = [
  {
    id: "teacher",
    label: "Teacher",
    icon: FaChalkboardTeacher,
    description:
      "Create lessons and guide students through their learning journey",
  },
  {
    id: "student",
    label: "Student",
    icon: FaUserGraduate,
    description:
      "Access personalized lessons, quizzes, and contests to improve skills",
  },
  {
    id: "admin",
    label: "Admin",
    icon: FaUserShield,
    description:
      "Manage the platform, oversee users, and monitor learning progress",
  },
];

export default function UserTypeSelector({
  onSelectRole,
  initialSelection,
}: UserTypeSelectorProps) {
  const [selectedRole, setSelectedRole] = useState<string>(
    initialSelection || ""
  );
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initial animation for cards appearing
    gsap.fromTo(
      cardRefs.current,
      {
        opacity: 0,
        y: 30,
        scale: 0.9,
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.6,
        stagger: 0.1,
        ease: "power2.out",
      }
    );
  }, []);

  const handleCardHover = (index: number, isEntering: boolean) => {
    const card = cardRefs.current[index];
    if (!card) return;

    if (isEntering) {
      gsap.to(card, {
        scale: 1.05,
        y: -5,
        duration: 0.3,
        ease: "power2.out",
      });

      gsap.to(card.querySelector(".card-shadow"), {
        opacity: 1,
        duration: 0.3,
        ease: "power2.out",
      });
    } else {
      gsap.to(card, {
        scale: selectedRole === userTypes[index].id ? 1.02 : 1,
        y: 0,
        duration: 0.3,
        ease: "power2.out",
      });

      gsap.to(card.querySelector(".card-shadow"), {
        opacity: 0,
        duration: 0.3,
        ease: "power2.out",
      });
    }
  };

  const handleRoleSelect = (roleId: string, index: number) => {
    const previousSelection = selectedRole;
    setSelectedRole(roleId);
    onSelectRole(roleId);

    // Animate the selection
    const card = cardRefs.current[index];
    if (!card) return;

    // Pulse animation for selection
    gsap.to(card, {
      scale: 1.1,
      duration: 0.15,
      ease: "power2.out",
      yoyo: true,
      repeat: 1,
      onComplete: () => {
        gsap.to(card, {
          scale: 1.02,
          duration: 0.2,
          ease: "power2.out",
        });
      },
    });

    // Animate selection indicator
    gsap.fromTo(
      card.querySelector(".selection-indicator"),
      {
        scale: 0,
        opacity: 0,
      },
      {
        scale: 1,
        opacity: 1,
        duration: 0.4,
        ease: "back.out(1.7)",
      }
    );

    // If there was a previous selection, animate it out
    if (previousSelection && previousSelection !== roleId) {
      const previousIndex = userTypes.findIndex(
        (type) => type.id === previousSelection
      );
      if (previousIndex !== -1) {
        const previousCard = cardRefs.current[previousIndex];
        if (previousCard) {
          gsap.to(previousCard, {
            scale: 1,
            duration: 0.3,
            ease: "power2.out",
          });

          gsap.to(previousCard.querySelector(".selection-indicator"), {
            scale: 0,
            opacity: 0,
            duration: 0.2,
            ease: "power2.in",
          });
        }
      }
    }
  };

  return (
    <div ref={containerRef} className="w-full max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-2">
          Choose Your Role
        </h2>
        <p className="text-gray-600">
          Select the option that best describes you
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {userTypes.map((userType, index) => {
          const IconComponent = userType.icon;
          const isSelected = selectedRole === userType.id;

          return (
            <div
              key={userType.id}
              ref={(el) => {
                cardRefs.current[index] = el;
              }}
              className={`
                relative cursor-pointer transition-all duration-200 rounded-2xl overflow-hidden
                ${
                  isSelected
                    ? "bg-gradient-to-br from-green-50 to-blue-50 border-2 border-green-400"
                    : "bg-white border-2 border-gray-200 hover:border-gray-300"
                }
              `}
              onMouseEnter={() => handleCardHover(index, true)}
              onMouseLeave={() => handleCardHover(index, false)}
              onClick={() => handleRoleSelect(userType.id, index)}
            >
              {/* Shadow layer for hover effect */}
              <div className="card-shadow absolute inset-0 bg-gradient-to-br from-green-100/20 to-blue-100/20 opacity-0 pointer-events-none rounded-2xl" />

              {/* Selection indicator */}
              {isSelected && (
                <div className="selection-indicator absolute top-4 right-4 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              )}

              <div className="relative z-10 p-8 text-center">
                {/* Icon */}
                <div
                  className={`
                  inline-flex items-center justify-center w-20 h-20 rounded-full mb-6 transition-colors duration-200
                  ${
                    isSelected
                      ? "bg-gradient-to-br from-green-400 to-blue-400 text-white"
                      : "bg-gray-100 text-gray-600 group-hover:bg-gray-200"
                  }
                `}
                >
                  <IconComponent size={36} />
                </div>

                {/* Label */}
                <h3
                  className={`
                  text-xl font-semibold mb-2 transition-colors duration-200
                  ${isSelected ? "text-green-700" : "text-gray-800"}
                `}
                >
                  {userType.label}
                </h3>

                {/* Description */}
                <p
                  className={`
                  text-sm transition-colors duration-200
                  ${isSelected ? "text-green-600" : "text-gray-500"}
                `}
                >
                  {userType.description}
                </p>
              </div>

              {/* Bottom accent line */}
              <div
                className={`
                h-1 w-full transition-all duration-300
                ${
                  isSelected
                    ? "bg-gradient-to-r from-green-400 to-blue-400"
                    : "bg-gray-200"
                }
              `}
              />
            </div>
          );
        })}
      </div>

      {/* {selectedRole && (
        <div className="mt-8 text-center">
          <p className="text-gray-600">
            Selected:{" "}
            <span className="font-semibold text-green-600 capitalize">
              {selectedRole}
            </span>
          </p>
        </div>
      )} */}
    </div>
  );
}
