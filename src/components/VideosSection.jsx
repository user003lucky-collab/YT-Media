import React from 'react';
import { Play, Film, Cloud, Clock } from 'lucide-react';
import { parseMediaSource, parseImageUrl } from '../utils/urlParser';

export default function VideosSection({ videos, onSelectVideo }) {
  return (
    <div className="w-full">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-semibold text-[#fbf8ee] tracking-tight">
            Ambilight Cinema Lounge
          </h2>
          <p className="text-xs sm:text-sm text-[#a8a49c] mt-0.5">
            4K masterworks, YouTube cinema streams, and Google Drive private archives
          </p>
        </div>
      </div>

      {/* Grid: 1-col on mobile, 2-col on tablet, 3-4 on PC */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {videos.map((video) => {
          const parsed = parseMediaSource(video.mediaUrl);
          const thumb = parseImageUrl(video.thumbnailUrl || parsed.thumbnailUrl);
          const isDrive = parsed.type === 'drive' || video.provider === 'Drive Cloud';

          return (
            <article
              key={video.id}
              onClick={() => onSelectVideo(video)}
              className="group liquid-glass rounded-[26px] overflow-hidden border border-white/12 hover:border-[#d4af37]/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl cursor-pointer flex flex-col justify-between"
            >
              {/* 16:9 Thumbnail Container */}
              <div className="relative aspect-video w-full overflow-hidden bg-black/50">
                <img
                  src={thumb}
                  alt={video.title}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />

                {/* Bottom Gradient Fade */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#040407]/80 via-transparent to-transparent pointer-events-none" />

                {/* Source Badge (YouTube vs Drive Cloud) */}
                <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-black/60 text-[#f5f3ea] backdrop-blur-md border border-white/10">
                  {isDrive ? (
                    <Cloud className="size-3 text-[#06b6d4]" />
                  ) : (
                    <Film className="size-3 text-[#ff0033]" />
                  )}
                  <span>{isDrive ? 'Drive Cloud' : 'YouTube'}</span>
                </div>

                {/* Duration Badge */}
                {video.duration && (
                  <div className="absolute bottom-3 right-3 flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-black/65 text-white/90 backdrop-blur-sm">
                    <Clock className="size-2.5 text-[#d4af37]" />
                    <span>{video.duration}</span>
                  </div>
                )}

                {/* Glowing Liquid Glass Play Overlay Button */}
                <button
                  type="button"
                  aria-label={`Play ${video.title}`}
                  className="size-12 rounded-full liquid-glass-elevated absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center text-[#fbf8ee] border border-white/20 shadow-xl transition-all duration-300 group-hover:scale-115 group-hover:bg-[#d4af37] group-hover:text-black group-hover:border-[#d4af37]"
                >
                  <Play className="size-5 fill-current ml-0.5" />
                </button>
              </div>

              {/* Title & Description Block */}
              <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-[#fbf8ee] leading-snug group-hover:text-[#d4af37] transition-colors">
                    {video.title}
                  </h3>
                  {video.description && (
                    <p className="mt-1.5 text-xs sm:text-sm text-[#b8b3a8] line-clamp-2 leading-relaxed">
                      {video.description}
                    </p>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-[#8c887e]">
                  <span>{video.date || 'Vault Archive'}</span>
                  <span className="text-[#d4af37] font-medium">Watch in Cinema &rarr;</span>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
