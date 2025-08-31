'use client';

import React from 'react';

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

export default function SubMenu({ items, activeItem, onItemChange, title }: SubMenuProps) {
  return (
    <div className="mb-12">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
        <p className="text-slate-400">Choose a section to manage</p>
      </div>

      <div className="flex justify-center">
        <div className="backdrop-blur-xl bg-white/5 rounded-2xl border border-white/10 shadow-xl p-2">
          <div className="flex space-x-2">
            {items.map((item) => (
              <button
                key={item.id}
                onClick={() => onItemChange(item.id)}
                className={`relative px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center space-x-3 ${
                  activeItem === item.id
                    ? `bg-gradient-to-r ${item.color} text-white shadow-lg transform scale-105`
                    : 'text-slate-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.label}</span>
                {activeItem === item.id && (
                  <div className="absolute inset-0 rounded-xl bg-white/20 animate-pulse"></div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
