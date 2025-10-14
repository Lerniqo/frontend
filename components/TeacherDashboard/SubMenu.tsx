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
}

export default function SubMenu({
  items,
  activeItem,
  onItemChange,
  title: _title,
}: SubMenuProps) {
  return (
    <div className="border-b border-gray-200">
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
    </div>
  );
}
