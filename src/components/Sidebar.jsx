import React from 'react';
import { 
  Home, 
  Film, 
  Smartphone, 
  Image as ImageIcon, 
  Disc3, 
  Armchair,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, isCollapsed, setIsCollapsed }) {
  const navItems = [
    { id: 'Home', label: 'Home', icon: Home },
    { id: 'Videos', label: 'Videos', icon: Film },
    { id: 'Shorts', label: 'Shorts', icon: Smartphone },
    { id: 'Post', label: 'Post', icon: ImageIcon },
    { id: 'Music', label: 'Music', icon: Disc3 },
  ];

  return (
    <aside
      className={`hidden lg:flex flex-col liquid-glass rounded-[32px] p-4 transition-all duration-300 relative isolate select-none ${
        isCollapsed ? 'w-20' : 'w-60'
      }`}
    >
      {/* Decorative Sidebar Glow */}
      <div
        aria-hidden="true"
        className="absolute -left-10 top-20 h-48 w-16 rounded-full bg-[#d4af37]/10 blur-3xl pointer-events-none -z-10"
      />

      {/* Sidebar Header Row with Collapse Toggle */}
      <div className={`mb-6 flex items-center text-[#d1cdc3] ${isCollapsed ? 'justify-center' : 'justify-between px-2'}`}>
        {!isCollapsed && (
          <span className="text-xs uppercase tracking-wider text-[#9e9b95] font-semibold">
            Collection
          </span>
        )}
        <button
          type="button"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="size-8 rounded-xl liquid-glass flex items-center justify-center text-[#d1cdc3] hover:text-[#d4af37] hover:border-white/20 active:scale-95 transition-all cursor-pointer"
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? <ChevronRight className="size-4" /> : <ChevronLeft className="size-4" />}
        </button>
      </div>

      {/* Navigation List */}
      <nav className="flex flex-col gap-2.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-3.5 h-13 rounded-2xl font-medium transition-all duration-200 cursor-pointer ${
                isCollapsed ? 'justify-center px-0' : 'px-4 text-left'
              } ${
                isActive
                  ? 'bg-gradient-to-r from-[#d4af37]/20 via-[#d4af37]/10 to-transparent border border-[#d4af37]/35 text-[#fbf8ee] shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]'
                  : 'text-[#d8d5cc] hover:text-white hover:bg-white/[0.05] border border-transparent'
              }`}
            >
              <Icon
                className={`size-5 shrink-0 transition-transform ${
                  isActive ? 'text-[#d4af37] scale-110' : 'text-[#beb9ad]'
                }`}
              />
              {!isCollapsed && (
                <span className="text-sm tracking-tight">{item.label}</span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom Promo Card */}
      {!isCollapsed && (
        <div className="mt-auto pt-8 pb-2 border-t border-white/10 px-2">
          <div className="flex flex-col items-start gap-2 text-[#d6bd78] mb-2">
            <Armchair className="size-5" />
            <span className="font-display text-lg font-semibold tracking-tight">Private screening</span>
          </div>
          <p className="text-xs leading-relaxed text-[#bbb7ad]">
            A little distance from everything else.
          </p>
        </div>
      )}
    </aside>
  );
}
