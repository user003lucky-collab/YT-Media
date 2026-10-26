import React, { useEffect } from 'react';
import { X, Share2, Sparkles, Film, Cloud, Check } from 'lucide-react';
import { parseMediaSource } from '../utils/urlParser';

export default function VideoModal({ video, onClose }) {
  const [copied, setCopied] = React.useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!video) return null;

  const parsed = parseMediaSource(video.mediaUrl);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(video.mediaUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 md:p-10 select-none">
      {/* Darkened Refractive Glass Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-[#040407]/85 backdrop-blur-2xl transition-opacity animate-in fade-in"
      />

      {/* Ambilight Glowing Aura Radiating Behind the Frame */}
      <div className="absolute w-[80vw] max-w-4xl h-[55vh] rounded-full bg-gradient-to-tr from-[#d4af37]/25 via-[#ff0033]/20 to-[#06b6d4]/20 blur-[120px] pointer-events-none -z-10 animate-pulse" />

      {/* Modal Container */}
      <div className="relative w-full max-w-5xl liquid-glass-elevated rounded-[28px] sm:rounded-[36px] overflow-hidden border border-white/20 shadow-2xl flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-300">
        {/* Top Header Controls */}
        <div className="flex items-center justify-between px-5 sm:px-7 py-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#d4af37]/15 text-[#e5cc83] border border-[#d4af37]/30">
              {parsed.provider === 'Drive Cloud' ? (
                <Cloud className="size-3.5" />
              ) : (
                <Film className="size-3.5" />
              )}
              {parsed.provider}
            </span>
            <span className="text-xs text-[#a8a49c] hidden sm:inline">
              {video.duration || 'Cinema Stream'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleShare}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl liquid-glass text-xs font-medium text-[#cec7b8] hover:text-[#d4af37] border border-white/10 active:scale-95 transition-all cursor-pointer"
            >
              {copied ? <Check className="size-3.5 text-emerald-400" /> : <Share2 className="size-3.5" />}
              <span>{copied ? 'Copied' : 'Share'}</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="size-9 rounded-full liquid-glass flex items-center justify-center text-[#cec7b8] hover:text-white border border-white/10 active:scale-95 transition-all cursor-pointer"
            >
              <X className="size-5" />
            </button>
          </div>
        </div>

        {/* Video Player Frame with Ambilight Border */}
        <div className="relative aspect-video w-full bg-black/90 overflow-hidden">
          {parsed.type === 'drive' ? (
            <iframe
              src={parsed.embedUrl}
              title={video.title}
              className="w-full h-full border-0"
              allow="autoplay; encrypted-media; fullscreen"
              allowFullScreen
            />
          ) : parsed.type === 'youtube' || parsed.type === 'youtube-short' ? (
            <iframe
              src={parsed.embedUrl}
              title={video.title}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          ) : parsed.type === 'direct-video' ? (
            <video
              src={parsed.embedUrl}
              controls
              autoPlay
              className="w-full h-full object-contain"
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center p-6 text-[#cec7b8]">
              <Film className="size-12 mb-3 text-[#d4af37]" />
              <p className="text-base font-semibold">{video.title}</p>
              <a
                href={video.mediaUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-4 px-5 py-2 rounded-full bg-[#d4af37] text-black text-xs font-bold"
              >
                Open External Stream
              </a>
            </div>
          )}
        </div>

        {/* Bottom Details Footer */}
        <div className="p-5 sm:p-7 overflow-y-auto">
          <h2 className="font-display text-2xl sm:text-3xl font-semibold text-[#fbf8ee]">
            {video.title}
          </h2>
          {video.description && (
            <p className="mt-2 text-sm sm:text-base leading-relaxed text-[#c6c0b6]">
              {video.description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
