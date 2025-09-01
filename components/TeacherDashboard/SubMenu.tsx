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
        <h3 className="text-2xl font-bold text-white mb-2 drop-shadow-lg">{title}</h3>
        <p className="text-slate-400">Choose a section to manage</p>
      </div>

      <div className="flex justify-center">
        <div className="relative backdrop-blur-2xl bg-white/10 rounded-3xl border border-white/20 shadow-2xl p-3 before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/30 before:via-white/10 before:to-transparent before:rounded-3xl">
          <div className="relative z-10 flex space-x-3">
            {items.map((item) => (
              <button
                key={item.id}
                onClick={() => onItemChange(item.id)}
                className={`relative px-8 py-4 rounded-2xl font-medium transition-all duration-500 flex items-center space-x-4 backdrop-blur-sm overflow-hidden ${
                  activeItem === item.id
                    ? `bg-gradient-to-r ${item.color} text-white shadow-2xl transform scale-110 border border-white/30`
                    : 'text-slate-300 hover:text-white hover:bg-white/20 hover:backdrop-blur-lg hover:border hover:border-white/30 hover:shadow-xl hover:scale-105'
                }`}
              >
                <span className="text-xl drop-shadow-sm relative z-10">{item.icon}</span>
                <span className="relative z-10 drop-shadow-sm">{item.label}</span>
                {activeItem === item.id && (
                  <>
                    <div className="absolute inset-0 rounded-2xl bg-white/10 animate-pulse"></div>
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-white/20 via-transparent to-white/20 animate-pulse"></div>
                  </>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
