import React from 'react';
import { Play, Pause, Music, Disc3, Sparkles, Cloud } from 'lucide-react';
import { parseImageUrl, DEFAULT_MUSIC_COVER, extractDriveFileId } from '../utils/urlParser';

export default function MusicSection({ tracks, currentTrack, isPlaying, onSelectTrack }) {
  return (
    <div className="w-full">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-semibold text-[#fbf8ee] tracking-tight">
            Sonic Lounge &amp; Audio Suites
          </h2>
          <p className="text-xs sm:text-sm text-[#a8a49c] mt-0.5">
            Lossless audio streams, ambient recordings, and cinematic compositions
          </p>
        </div>
      </div>

      {/* Grid: 2-column on mobile, 3 on tablet, 4-5 on PC */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
        {tracks.map((track) => {
          const isCurrent = currentTrack?.id === track.id;
          const isTrackPlaying = isCurrent && isPlaying;
          const isDrive = Boolean(extractDriveFileId(track.mediaUrl) || track.provider === 'Drive Cloud');
          const imgUrl = parseImageUrl(track.thumbnailUrl) || DEFAULT_MUSIC_COVER;

          return (
            <article
              key={track.id}
              onClick={() => onSelectTrack(track)}
              className="group relative liquid-glass rounded-[24px] p-3 sm:p-4 border border-white/12 hover:border-[#d4af37]/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl cursor-pointer flex flex-col"
            >
              {/* 1:1 Square Album Artwork with 3D Vinyl Peeking Out */}
              <div className="relative aspect-square w-full rounded-2xl overflow-hidden mb-3 bg-black/40">
                {/* 3D Vinyl Record peeking out */}
                <div
                  className={`vinyl-disc absolute right-[-20%] top-[10%] size-[80%] rounded-full opacity-60 transition-transform duration-500 ${
                    isTrackPlaying
                      ? 'spinning-vinyl opacity-95 translate-x-3'
                      : 'group-hover:translate-x-3 group-hover:opacity-90'
                  }`}
                >
                  <span className="absolute top-1/2 left-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#d4af37] bg-[#111014]" />
                </div>

                {/* Album Cover Front Jacket */}
                <img
                  src={imgUrl}
                  alt={track.title}
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = DEFAULT_MUSIC_COVER;
                  }}
                  className="relative z-10 w-full h-full object-cover rounded-xl shadow-lg transition-transform duration-500 group-hover:scale-102"
                />

                {/* Drive Badge if from Google Drive */}
                {isDrive && (
                  <span className="absolute z-20 top-2 left-2 flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-black/75 text-[#e5cc83] border border-[#d4af37]/40 backdrop-blur-md">
                    <Cloud className="size-3 text-[#d4af37]" />
                    <span>Drive</span>
                  </span>
                )}

                {/* Play Button Overlay */}
                <button
                  type="button"
                  aria-label={`Play ${track.title}`}
                  className={`absolute z-20 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-11 rounded-full flex items-center justify-center transition-all ${
                    isTrackPlaying
                      ? 'bg-[#d4af37] text-black scale-100 shadow-[0_0_15px_rgba(212,175,55,0.6)]'
                      : 'liquid-glass-elevated text-white opacity-0 group-hover:opacity-100 group-hover:scale-105'
                  }`}
                >
                  {isTrackPlaying ? (
                    <Pause className="size-5 fill-current" />
                  ) : (
                    <Play className="size-5 fill-current ml-0.5" />
                  )}
                </button>

                {/* Equalizer Wave Indicator if playing */}
                {isTrackPlaying && (
                  <div className="absolute z-20 bottom-2 left-2 flex items-center gap-0.5 px-2 py-1 rounded-md bg-black/60 backdrop-blur-sm">
                    <span className="w-0.5 h-3 bg-[#d4af37] animate-pulse" />
                    <span className="w-0.5 h-4 bg-[#d4af37] animate-pulse delay-75" />
                    <span className="w-0.5 h-2 bg-[#d4af37] animate-pulse delay-150" />
                  </div>
                )}
              </div>

              {/* Title & Artist Info */}
              <div className="min-w-0 flex-1">
                <h3
                  className={`text-sm sm:text-base font-semibold truncate ${
                    isCurrent ? 'text-[#e6cf8c]' : 'text-[#fbf8ee]'
                  }`}
                >
                  {track.title}
                </h3>
                <p className="text-xs text-[#a8a49c] truncate mt-0.5">
                  {track.artist || 'YT Media'}
                </p>
                <div className="flex items-center justify-between text-[11px] text-[#7d7a74] mt-2 pt-2 border-t border-white/5">
                  <span className="truncate mr-2">{track.genre || 'Soundtrack'}</span>
                  <span className="shrink-0">{track.duration || '4:00'}</span>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
