import React from 'react';
import { Search, SlidersHorizontal, Lock, Play, X } from 'lucide-react';

export default function Header({
  siteTitle,
  brandAttribution,
  searchQuery,
  setSearchQuery,
  onOpenStudio,
  onLockVault,
  mobileSearchOpen,
  setMobileSearchOpen
}) {
  return (
    <header className="liquid-glass sticky top-3 sm:top-5 z-40 flex items-center justify-between gap-3 sm:gap-6 rounded-[22px] sm:rounded-[28px] px-4 sm:px-6 py-3 sm:py-3.5 mb-6 transition-all duration-300">
      {/* Brand Identity Block */}
      <div className="flex items-center gap-3 sm:gap-3.5 shrink-0 max-w-[240px] sm:max-w-[400px]">
        <div className="liquid-glass flex size-10 sm:size-12 shrink-0 items-center justify-center rounded-2xl sm:rounded-[18px] text-[#e6ce8c] border border-white/15 shadow-inner">
          <Play className="size-4 sm:size-5 fill-current ml-0.5" />
        </div>
        <div className="leading-tight select-none">
          <span className="block text-base sm:text-lg font-semibold tracking-tight text-[#fbf8ee]">
            {siteTitle || 'YT Media'} <span className="text-xs sm:text-sm text-[#d6bf7c]">•</span>
          </span>
          <span className="block text-[11px] sm:text-xs font-normal text-[#d4d1c8] truncate">
            {brandAttribution}
          </span>
        </div>
      </div>

      {/* Instant Search Bar (Desktop) */}
      <div className="hidden md:flex relative flex-1 max-w-xl mx-4">
        <label htmlFor="media-search" className="sr-only">
          Search collection
        </label>
        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#c8c6c1]">
          <Search className="size-4 sm:size-5" />
        </span>
        <input
          id="media-search"
          type="search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search videos, shorts, posts, audio tracks..."
          className="h-11 sm:h-12 w-full rounded-2xl border border-white/10 bg-[#050508]/45 pl-11 pr-10 text-xs sm:text-sm text-[#f5f3ea] placeholder:text-[#9e9b95] focus:outline-none focus:border-[#d4af37]/60 focus:bg-[#050508]/70 transition-all"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/50 hover:text-white"
          >
            <X className="size-4" />
          </button>
        )}
      </div>

      {/* Header Right Action Group */}
      <div className="flex shrink-0 items-center gap-2 sm:gap-4">
        {/* Mobile Search Toggle */}
        <button
          type="button"
          onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
          className="md:hidden flex size-10 items-center justify-center rounded-xl liquid-glass border border-white/10 text-[#e3e0d8] active:scale-95"
          aria-label="Toggle Search"
        >
          <Search className="size-4" />
        </button>

        {/* Admin Studio Toggle */}
        <button
          type="button"
          onClick={onOpenStudio}
          className="flex h-10 sm:h-12 items-center gap-2 rounded-xl sm:rounded-[18px] border border-white/15 bg-white/[0.04] px-3 sm:px-4 text-xs sm:text-sm font-medium text-[#e3e0d8] hover:bg-white/[0.09] hover:border-[#d4af37]/40 active:scale-95 transition-all cursor-pointer"
        >
          <SlidersHorizontal className="size-4 text-[#d4af37]" />
          <span className="hidden sm:inline">Admin Studio</span>
        </button>

        <span className="hidden sm:block h-6 w-px bg-white/12" />

        {/* Lock Vault Button */}
        <button
          type="button"
          onClick={onLockVault}
          className="flex h-10 sm:h-12 items-center gap-2 rounded-xl sm:rounded-[18px] border border-[#d4af37]/35 bg-[#d4af37]/10 px-3 sm:px-4 text-xs sm:text-sm font-semibold text-[#e8d8a7] hover:bg-[#d4af37]/20 active:scale-95 transition-all cursor-pointer shadow-[0_0_15px_rgba(212,175,55,0.15)]"
          title="Lock platform vault"
        >
          <Lock className="size-4" />
          <span className="hidden sm:inline">Lock Vault</span>
        </button>
      </div>

      {/* Mobile Search Dropdown Bar */}
      {mobileSearchOpen && (
        <div className="md:hidden absolute top-[102%] left-0 right-0 p-3 liquid-glass rounded-2xl border border-white/15 animate-in fade-in slide-in-from-top-2">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-[#c8c6c1]" />
            <input
              type="search"
              autoFocus
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search media..."
              className="h-10 w-full rounded-xl border border-white/15 bg-[#050508]/80 pl-10 pr-9 text-xs text-[#f5f3ea] placeholder:text-[#9e9b95] focus:outline-none focus:border-[#d4af37]"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50"
              >
                <X className="size-4" />
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
