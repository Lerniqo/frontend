"use client";

import React from "react";

interface SubMenuProps {
  items: Array<{
    id: string;
    label: string;
    icon: string;
    color: string;
  }>;
  activeItem: string;
  onItemChange: (itemId: string) => void;
  title: string;
  actionButton?: {
    label: string;
    onClick: () => void;
    icon?: string;
  };
}

export default function SubMenu({
  items,
  activeItem,
  onItemChange,
  title: _title,
  actionButton,
}: SubMenuProps) {
  return (
    <div className="border-b border-gray-200">
      <div className="flex items-center justify-between">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          {items.map((item) => (
            <button
              key={item.id}
              onClick={() => onItemChange(item.id)}
              className={`${
                activeItem === item.id
                  ? "border-purple-600 text-purple-700"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } whitespace-nowrap py-5 px-2 border-b-2 font-semibold text-lg transition-all duration-300`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {actionButton && (
          <button
            onClick={actionButton.onClick}
            className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 whitespace-nowrap"
          >
            {actionButton.icon && <span>{actionButton.icon}</span>}
            {actionButton.label}
          </button>
        )}
      </div>
    </div>
  );
}
