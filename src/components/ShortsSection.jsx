import React, { useState, useEffect } from 'react';
import { 
  ChevronUp, 
  ChevronDown, 
  Heart, 
  Share2, 
  Volume2, 
  VolumeX, 
  Check, 
  Sparkles,
  Smartphone
} from 'lucide-react';
import { parseMediaSource } from '../utils/urlParser';

export default function ShortsSection({ shorts, onSelectVideo }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [likes, setLikes] = useState({});
  const [copiedId, setCopiedId] = useState(null);
  const [isMuted, setIsMuted] = useState(false);

  const activeShort = shorts[currentIndex] || shorts[0];

  // Up/Down Keyboard Navigation on Desktop
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        handlePrev();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        handleNext();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, shorts.length]);

  const handleNext = () => {
    if (currentIndex < shorts.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleLike = (id) => {
    setLikes((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleShare = (short) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(short.mediaUrl);
      setCopiedId(short.id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  if (!shorts || shorts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center liquid-glass rounded-3xl">
        <Smartphone className="size-12 text-[#d4af37] mb-3" />
        <h3 className="text-lg font-semibold text-[#fbf8ee]">No Shorts Available</h3>
        <p className="text-xs text-[#a8a49c] mt-1">Add vertical reels in the Admin Studio.</p>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center select-none py-2">
      {/* ============================================================== */}
      {/* PC / DESKTOP VIEW (>= 1024px) - Centered 9:16 Glass Theater    */}
      {/* ============================================================== */}
      <div className="hidden lg:flex items-center justify-center gap-8 w-full max-w-4xl relative">
        {/* Ambient Side Glow */}
        <div className="absolute w-[450px] h-[75vh] rounded-full bg-gradient-to-b from-[#ff0033]/15 via-[#d4af37]/20 to-[#4f46e5]/15 blur-[120px] pointer-events-none -z-10" />

        {/* Floating Navigation Paddles Left */}
        <div className="flex flex-col gap-4">
          <button
            type="button"
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className={`size-12 rounded-full liquid-glass flex items-center justify-center border border-white/15 transition-all ${
              currentIndex === 0
                ? 'opacity-30 cursor-not-allowed'
                : 'hover:border-[#d4af37] text-white hover:scale-105 active:scale-95 cursor-pointer shadow-lg'
            }`}
            title="Previous Short (Up Arrow)"
          >
            <ChevronUp className="size-6" />
          </button>
          <span className="text-center text-xs font-semibold text-[#a8a49c] tabular-nums">
            {currentIndex + 1} / {shorts.length}
          </span>
          <button
            type="button"
            onClick={handleNext}
            disabled={currentIndex === shorts.length - 1}
            className={`size-12 rounded-full liquid-glass flex items-center justify-center border border-white/15 transition-all ${
              currentIndex === shorts.length - 1
                ? 'opacity-30 cursor-not-allowed'
                : 'hover:border-[#d4af37] text-white hover:scale-105 active:scale-95 cursor-pointer shadow-lg'
            }`}
            title="Next Short (Down Arrow)"
          >
            <ChevronDown className="size-6" />
          </button>
        </div>

        {/* 9:16 Centered Vertical Frame */}
        <div className="relative w-full max-w-[420px] h-[80vh] rounded-[34px] liquid-glass-elevated border border-white/20 shadow-2xl overflow-hidden flex flex-col">
          {/* Active Short Player */}
          <ShortPlayerCard
            short={activeShort}
            isLiked={!!likes[activeShort.id]}
            onLike={() => handleLike(activeShort.id)}
            onShare={() => handleShare(activeShort)}
            isCopied={copiedId === activeShort.id}
          />
        </div>
      </div>

      {/* ============================================================== */}
      {/* MOBILE VIEW (< 1024px) - True Snap-Scrolling Reel Feed        */}
      {/* ============================================================== */}
      <div className="lg:hidden w-full h-[calc(100dvh-10rem)] snap-y snap-mandatory overflow-y-scroll no-scrollbar rounded-2xl">
        {shorts.map((short, idx) => (
          <div
            key={short.id}
            className="w-full h-full snap-start snap-always relative mb-4 rounded-3xl overflow-hidden liquid-glass border border-white/15 shadow-2xl flex flex-col justify-end"
          >
            <ShortPlayerCard
              short={short}
              isLiked={!!likes[short.id]}
              onLike={() => handleLike(short.id)}
              onShare={() => handleShare(short)}
              isCopied={copiedId === short.id}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

// Inner helper component for rendering a single Short card with player & glass overlay buttons
function ShortPlayerCard({ short, isLiked, onLike, onShare, isCopied }) {
  const parsed = parseMediaSource(short.mediaUrl);

  return (
    <div className="relative w-full h-full bg-black/90 flex flex-col justify-between overflow-hidden">
      {/* Background/Video Feed */}
      <div className="absolute inset-0 z-0">
        {parsed.type === 'drive' ? (
          <iframe
            src={parsed.embedUrl}
            title={short.title}
            className="w-full h-full border-0 pointer-events-auto"
            allow="autoplay; encrypted-media; fullscreen"
            allowFullScreen
          />
        ) : parsed.type === 'youtube' || parsed.type === 'youtube-short' ? (
          <iframe
            src={parsed.embedUrl}
            title={short.title}
            className="w-full h-full border-0 pointer-events-auto"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <div className="relative w-full h-full">
            <img
              src={short.thumbnailUrl}
              alt={short.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40" />
          </div>
        )}
      </div>

      {/* Top Glass Badge */}
      <div className="relative z-10 flex items-center justify-between p-4 pointer-events-none">
        <span className="px-3 py-1 rounded-full text-[11px] font-semibold bg-black/50 text-[#d4af37] border border-[#d4af37]/40 backdrop-blur-md">
          {short.genre || 'Reel Deck'}
        </span>
        <span className="text-[11px] text-white/70 bg-black/40 px-2 py-0.5 rounded-md backdrop-blur-sm">
          {short.duration || '0:30'}
        </span>
      </div>

      {/* Floating Glass Action Icons on Right Edge */}
      <div className="absolute right-3 bottom-20 z-20 flex flex-col items-center gap-4">
        {/* Like Button */}
        <button
          type="button"
          onClick={onLike}
          className="flex flex-col items-center gap-1 active:scale-90 transition-transform cursor-pointer"
        >
          <div
            className={`size-12 rounded-full liquid-glass-elevated flex items-center justify-center border transition-all ${
              isLiked
                ? 'bg-red-500/20 border-red-500 text-red-500 shadow-[0_0_15px_rgba(255,0,51,0.5)]'
                : 'border-white/20 text-white hover:text-red-400'
            }`}
          >
            <Heart className={`size-5 ${isLiked ? 'fill-current' : ''}`} />
          </div>
          <span className="text-[10px] font-semibold text-white drop-shadow">
            {(short.likes || 120) + (isLiked ? 1 : 0)}
          </span>
        </button>

        {/* Share Button */}
        <button
          type="button"
          onClick={onShare}
          className="flex flex-col items-center gap-1 active:scale-90 transition-transform cursor-pointer"
        >
          <div className="size-12 rounded-full liquid-glass-elevated flex items-center justify-center border border-white/20 text-white hover:text-[#d4af37]">
            {isCopied ? <Check className="size-5 text-emerald-400" /> : <Share2 className="size-5" />}
          </div>
          <span className="text-[10px] font-semibold text-white drop-shadow">
            {isCopied ? 'Copied' : 'Share'}
          </span>
        </button>
      </div>

      {/* Bottom Caption Overlay */}
      <div className="relative z-10 p-5 bg-gradient-to-t from-black/95 via-black/60 to-transparent pointer-events-none">
        <h3 className="text-lg font-semibold text-[#fbf8ee] drop-shadow-md">
          {short.title}
        </h3>
        {short.description && (
          <p className="mt-1 text-xs text-[#cec7b8] line-clamp-2 drop-shadow">
            {short.description}
          </p>
        )}
      </div>
    </div>
  );
}
