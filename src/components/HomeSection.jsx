import React from 'react';
import { Play, ArrowUpRight, Film, Smartphone, Disc3, Image as ImageIcon, Sparkles, Clock, Heart } from 'lucide-react';
import { parseImageUrl, parseMediaSource, DEFAULT_MUSIC_COVER } from '../utils/urlParser';

export default function HomeSection({
  heroBanner,
  videos,
  shorts,
  posts,
  music,
  onSelectVideo,
  onSelectTrack,
  onNavigateTab,
  currentTrack,
  isPlaying
}) {
  const trendingVideos = videos.slice(0, 2);
  const quickMusic = music.slice(0, 3);
  const latestShorts = shorts.slice(0, 3);
  const featuredPosts = posts.slice(0, 2);

  return (
    <div className="w-full space-y-10 sm:space-y-12">
      {/* ============================================================== */}
      {/* 1. 3D PARALLAX HERO BANNER                                     */}
      {/* ============================================================== */}
      {heroBanner?.show && (
        <section
          aria-labelledby="featured-hero-title"
          className="aperture-card relative isolate h-[38vh] sm:h-[46vh] lg:h-[52vh] min-h-[320px] sm:min-h-[420px] rounded-[32px] sm:rounded-[42px] overflow-hidden bg-[#181d20] shadow-2xl"
        >
          {/* Background Image with Ken Burns Zoom */}
          <img
            src={parseImageUrl(heroBanner.imageUrl)}
            alt={heroBanner.title}
            className="ken-burns absolute inset-0 -z-20 size-full object-cover object-[center_55%]"
          />

          {/* Refractive Ambient Overlays */}
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(4,7,9,0.92)_0%,rgba(4,7,9,0.55)_50%,rgba(4,7,9,0.15)_85%),linear-gradient(0deg,rgba(4,7,9,0.95)_0%,transparent_75%)]" />

          {/* Top Specular Accent Border Line */}
          <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-[#f5e8b2]/70 via-[#d4af37]/40 via-[#06b6d4]/40 to-transparent" />

          {/* Content Block */}
          <div className="absolute bottom-6 sm:bottom-10 left-6 sm:left-12 max-w-[620px] z-10 pr-4">
            {/* Meta Row Badges */}
            <div className="flex items-center gap-2.5 text-xs text-[#e3d5b1] mb-2 sm:mb-3">
              <span className="px-3 py-1 rounded-full bg-[#d4af37]/20 border border-[#d4af37]/35 text-[#f5e8b2] font-semibold text-[11px] sm:text-xs">
                {heroBanner.categoryBadge || 'Featured Cinema'}
              </span>
              <span className="size-1 rounded-full bg-[#c9b98e]" />
              <span className="text-[#cec7b8]">{heroBanner.duration || '12 min'}</span>
              <span className="size-1 rounded-full bg-[#c9b98e]" />
              <span className="text-[#d4af37] font-semibold">{heroBanner.quality || '4K HDR'}</span>
            </div>

            {/* Main Headline */}
            <h1
              id="featured-hero-title"
              className="font-display text-3xl sm:text-5xl lg:text-6xl font-medium tracking-tight text-[#fbf8ee] leading-[1.05]"
            >
              {heroBanner.title}
            </h1>

            {/* Tagline */}
            <p className="mt-2 sm:mt-3 text-xs sm:text-sm lg:text-base leading-relaxed text-[#dedcd6] max-w-lg line-clamp-2">
              {heroBanner.tagline}
            </p>

            {/* Play Featured Button */}
            <button
              type="button"
              onClick={() => {
                const videoToPlay = videos.find((v) => v.featured) || videos[0];
                if (videoToPlay) onSelectVideo(videoToPlay);
              }}
              className="mt-4 sm:mt-6 flex h-11 sm:h-13 items-center gap-3 rounded-full bg-gradient-to-r from-[#e4cf91] via-[#d4af37] to-[#e8d8a7] px-6 sm:px-7 text-xs sm:text-sm font-bold text-[#1f1a10] shadow-[0_0_30px_rgba(212,175,55,0.4)] active:scale-95 hover:scale-105 transition-all cursor-pointer"
            >
              <Play className="size-4.5 fill-current" />
              <span>Play Featured</span>
            </button>
          </div>
        </section>
      )}

      {/* ============================================================== */}
      {/* 2. UPPER ROW: TRENDING VIDEOS + QUICK-PLAY MUSIC              */}
      {/* ============================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.55fr_1fr] gap-8">
        {/* Trending Videos */}
        <section aria-labelledby="trending-heading" className="min-w-0">
          <div className="mb-4 flex items-center justify-between">
            <h2 id="trending-heading" className="text-lg sm:text-xl font-semibold tracking-tight text-[#fbf8ee] flex items-center gap-2">
              <Film className="size-4.5 text-[#d4af37]" />
              <span>Trending Videos</span>
            </h2>
            <button
              type="button"
              onClick={() => onNavigateTab('Videos')}
              className="flex items-center gap-1.5 text-xs text-[#c8c3b7] hover:text-[#d4af37] transition-colors"
            >
              <span>All videos</span>
              <ArrowUpRight className="size-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {trendingVideos.map((video) => (
              <article
                key={video.id}
                onClick={() => onSelectVideo(video)}
                className="group liquid-glass rounded-[22px] overflow-hidden border border-white/10 hover:border-[#d4af37]/40 transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col justify-between"
              >
                <div className="relative aspect-video w-full overflow-hidden bg-black/40">
                  <img
                    src={parseImageUrl(video.thumbnailUrl)}
                    alt={video.title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  <span className="absolute bottom-2.5 left-3 text-[11px] text-white font-medium">
                    {video.provider || 'YouTube'}
                  </span>
                  <span className="absolute right-3 bottom-2.5 rounded-md bg-black/60 px-2 py-0.5 text-[11px] text-white font-medium">
                    {video.duration || '12:00'}
                  </span>
                  <button
                    type="button"
                    className="liquid-glass-elevated absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-11 rounded-full flex items-center justify-center text-white group-hover:bg-[#d4af37] group-hover:text-black transition-all"
                  >
                    <Play className="size-4.5 fill-current ml-0.5" />
                  </button>
                </div>
                <div className="p-4">
                  <h3 className="text-sm sm:text-base font-semibold text-[#fbf8ee] truncate group-hover:text-[#d4af37]">
                    {video.title}
                  </h3>
                  <p className="mt-1 text-xs text-[#a9a49c] line-clamp-1">
                    {video.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Quick-Play Music Tracks */}
        <section aria-labelledby="quick-music-heading" className="min-w-0">
          <div className="mb-4 flex items-center justify-between">
            <h2 id="quick-music-heading" className="text-lg sm:text-xl font-semibold tracking-tight text-[#fbf8ee] flex items-center gap-2">
              <Disc3 className="size-4.5 text-[#d4af37]" />
              <span>Quick-Play Music Tracks</span>
            </h2>
            <button
              type="button"
              onClick={() => onNavigateTab('Music')}
              className="flex items-center gap-1.5 text-xs text-[#c8c3b7] hover:text-[#d4af37] transition-colors"
            >
              <span>View all</span>
              <ArrowUpRight className="size-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {quickMusic.map((track) => {
              const isCurrent = currentTrack?.id === track.id;
              const isTrackPlaying = isCurrent && isPlaying;
              return (
                <article
                  key={track.id}
                  onClick={() => onSelectTrack(track)}
                  className="group liquid-glass rounded-2xl p-3 flex items-center gap-3.5 border border-white/10 hover:border-[#d4af37]/35 transition-all cursor-pointer"
                >
                  <div className="relative size-14 shrink-0 rounded-xl overflow-hidden bg-black/40">
                    <img
                      src={parseImageUrl(track.thumbnailUrl) || DEFAULT_MUSIC_COVER}
                      alt={track.title}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = DEFAULT_MUSIC_COVER;
                      }}
                      className="size-full object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3
                      className={`text-sm font-semibold truncate ${
                        isCurrent ? 'text-[#d4af37]' : 'text-[#fbf8ee]'
                      }`}
                    >
                      {track.title}
                    </h3>
                    <p className="text-xs text-[#a9a49c] truncate mt-0.5">
                      {track.genre || 'Ambient'} &bull; {track.duration || '4:00'}
                    </p>
                  </div>
                  <button
                    type="button"
                    className={`size-9 rounded-full flex items-center justify-center border transition-all ${
                      isTrackPlaying
                        ? 'bg-[#d4af37] text-black border-[#d4af37]'
                        : 'border-[#d4af37]/30 text-[#e6cf8c] group-hover:bg-white/10'
                    }`}
                  >
                    <Play className="size-4 fill-current ml-0.5" />
                  </button>
                </article>
              );
            })}
          </div>
        </section>
      </div>

      {/* ============================================================== */}
      {/* 3. LOWER ROW: LATEST SHORTS PREVIEW + FEATURED POSTS          */}
      {/* ============================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-8">
        {/* Latest Shorts Preview */}
        <section aria-labelledby="shorts-heading" className="min-w-0">
          <div className="mb-4 flex items-center justify-between">
            <h2 id="shorts-heading" className="text-lg sm:text-xl font-semibold tracking-tight text-[#fbf8ee] flex items-center gap-2">
              <Smartphone className="size-4.5 text-[#d4af37]" />
              <span>Latest Shorts Preview</span>
            </h2>
            <button
              type="button"
              onClick={() => onNavigateTab('Shorts')}
              className="flex items-center gap-1.5 text-xs text-[#c8c3b7] hover:text-[#d4af37] transition-colors"
            >
              <span>Explore Shorts</span>
              <ArrowUpRight className="size-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-3.5 sm:gap-4">
            {latestShorts.map((short) => (
              <article
                key={short.id}
                onClick={() => onNavigateTab('Shorts')}
                className="group liquid-glass relative aspect-[9/16] rounded-2xl sm:rounded-[22px] overflow-hidden border border-white/10 hover:border-[#d4af37]/40 transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col justify-end p-3 sm:p-4"
              >
                <img
                  src={parseImageUrl(short.thumbnailUrl)}
                  alt={short.title}
                  loading="lazy"
                  className="absolute inset-0 size-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/20" />

                <button
                  type="button"
                  className="liquid-glass absolute top-2.5 right-2.5 size-8 rounded-full flex items-center justify-center text-white"
                >
                  <Play className="size-3.5 fill-current ml-0.5" />
                </button>

                <div className="relative z-10">
                  <h3 className="text-xs sm:text-sm font-semibold text-white leading-tight truncate">
                    {short.title}
                  </h3>
                  <p className="text-[10px] sm:text-xs text-[#d8d5cc] mt-0.5">
                    {short.duration || '0:30'}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Featured Posts */}
        <section aria-labelledby="posts-heading" className="min-w-0">
          <div className="mb-4 flex items-center justify-between">
            <h2 id="posts-heading" className="text-lg sm:text-xl font-semibold tracking-tight text-[#fbf8ee] flex items-center gap-2">
              <ImageIcon className="size-4.5 text-[#d4af37]" />
              <span>Featured Posts</span>
            </h2>
            <button
              type="button"
              onClick={() => onNavigateTab('Post')}
              className="flex items-center gap-1.5 text-xs text-[#c8c3b7] hover:text-[#d4af37] transition-colors"
            >
              <span>View feed</span>
              <ArrowUpRight className="size-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {featuredPosts.map((post) => (
              <article
                key={post.id}
                onClick={() => onNavigateTab('Post')}
                className="group liquid-glass rounded-2xl overflow-hidden border border-white/10 hover:border-[#d4af37]/40 transition-all cursor-pointer flex flex-col justify-between"
              >
                <div className="relative aspect-[4/5] overflow-hidden bg-black/40">
                  <img
                    src={parseImageUrl(post.thumbnailUrl)}
                    alt={post.title}
                    loading="lazy"
                    className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-black/50 text-[#d4af37] backdrop-blur-sm">
                    {post.tag || 'Essay'}
                  </span>
                </div>
                <div className="p-3">
                  <h3 className="text-xs sm:text-sm font-semibold text-[#fbf8ee] truncate group-hover:text-[#d4af37]">
                    {post.title}
                  </h3>
                  <p className="text-[11px] text-[#a9a49d] truncate mt-0.5">
                    {post.date || 'Curated'}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
