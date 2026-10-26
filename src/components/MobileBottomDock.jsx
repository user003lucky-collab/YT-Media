import React from 'react';
import { Home, Film, Smartphone, Image as ImageIcon, Disc3 } from 'lucide-react';

export default function MobileBottomDock({ activeTab, setActiveTab }) {
  const tabs = [
    { id: 'Home', label: 'Home', icon: Home },
    { id: 'Videos', label: 'Videos', icon: Film },
    { id: 'Shorts', label: 'Shorts', icon: Smartphone },
    { id: 'Post', label: 'Post', icon: ImageIcon },
    { id: 'Music', label: 'Music', icon: Disc3 },
  ];

  return (
    <div className="lg:hidden fixed bottom-3 left-3 right-3 h-16 rounded-2xl liquid-glass-elevated z-50 flex items-center justify-around px-2 border border-white/20 shadow-2xl backdrop-blur-2xl">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center justify-center min-w-[54px] min-h-[48px] py-1 rounded-xl transition-all duration-200 active:scale-95 cursor-pointer relative ${
              isActive ? 'text-[#fbf8ee]' : 'text-[#a8a49c] hover:text-[#d8d5cc]'
            }`}
          >
            {/* Active Glow Pill Background */}
            {isActive && (
              <span className="absolute inset-0 rounded-xl bg-[#d4af37]/15 border border-[#d4af37]/30 shadow-[0_0_12px_rgba(212,175,55,0.25)] -z-10" />
            )}

            <Icon
              className={`size-5 transition-transform duration-200 ${
                isActive ? 'text-[#d4af37] scale-110' : 'text-[#a8a49c]'
              }`}
            />
            <span
              className={`text-[10px] tracking-tight mt-0.5 ${
                isActive ? 'font-semibold text-[#fbf8ee]' : 'font-normal'
              }`}
            >
              {tab.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
