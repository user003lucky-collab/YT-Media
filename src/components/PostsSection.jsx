import React, { useState, useEffect } from 'react';
import { Heart, X, ChevronLeft, ChevronRight, Share2, ZoomIn, Check } from 'lucide-react';
import { parseImageUrl } from '../utils/urlParser';

export default function PostsSection({ posts }) {
  const [likes, setLikes] = useState({});
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleLike = (id, e) => {
    e.stopPropagation();
    setLikes((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const openLightbox = (index) => {
    setLightboxIndex(index);
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
  };

  // Lightbox arrow key listener
  useEffect(() => {
    if (lightboxIndex === null) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') nextPhoto();
      if (e.key === 'ArrowLeft') prevPhoto();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex]);

  const nextPhoto = () => {
    if (lightboxIndex !== null && lightboxIndex < posts.length - 1) {
      setLightboxIndex((prev) => prev + 1);
    }
  };

  const prevPhoto = () => {
    if (lightboxIndex !== null && lightboxIndex > 0) {
      setLightboxIndex((prev) => prev - 1);
    }
  };

  const activePost = lightboxIndex !== null ? posts[lightboxIndex] : null;

  return (
    <div className="w-full">
      {/* Header Info */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-semibold text-[#fbf8ee] tracking-tight">
            Visual Feed &amp; Gallery
          </h2>
          <p className="text-xs sm:text-sm text-[#a8a49c] mt-0.5">
            Photographic essays, Google Drive high-resolution captures &amp; journal notes
          </p>
        </div>
      </div>

      {/* Grid: 1-col on mobile, 2-col on tablet, 3-col on PC */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post, index) => {
          const isLiked = !!likes[post.id];
          const imgUrl = parseImageUrl(post.thumbnailUrl || post.mediaUrl);

          return (
            <article
              key={post.id}
              onClick={() => openLightbox(index)}
              className="group liquid-glass rounded-[26px] overflow-hidden border border-white/12 hover:border-[#d4af37]/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl cursor-pointer flex flex-col justify-between"
            >
              {/* Image Container with 4:5 luxury aspect ratio */}
              <div className="relative aspect-[4/5] overflow-hidden bg-black/40">
                <img
                  src={imgUrl}
                  alt={post.title}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />

                {/* Glass Tag Badge */}
                <div className="absolute top-3.5 left-3.5">
                  <span className="px-3 py-1 rounded-full text-[11px] font-semibold bg-[#040407]/60 backdrop-blur-md text-[#d4af37] border border-[#d4af37]/30">
                    {post.tag || 'Photo essay'}
                  </span>
                </div>

                {/* Heart Button */}
                <button
                  type="button"
                  onClick={(e) => handleLike(post.id, e)}
                  aria-label="Like post"
                  className={`size-10 rounded-full liquid-glass-elevated absolute bottom-3.5 right-3.5 flex items-center justify-center border transition-all active:scale-90 ${
                    isLiked
                      ? 'bg-red-500/25 border-red-500 text-red-500 shadow-[0_0_12px_rgba(255,0,51,0.5)]'
                      : 'border-white/20 text-white hover:text-red-400'
                  }`}
                >
                  <Heart className={`size-4.5 ${isLiked ? 'fill-current' : ''}`} />
                </button>

                {/* Hover Zoom Indicator */}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                  <span className="size-11 rounded-full liquid-glass flex items-center justify-center text-white">
                    <ZoomIn className="size-5" />
                  </span>
                </div>
              </div>

              {/* Caption Block */}
              <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-[#fbf8ee] leading-snug">
                    {post.title}
                  </h3>
                  {post.description && (
                    <p className="mt-1.5 text-xs sm:text-sm text-[#c6c0b6] line-clamp-2 leading-relaxed">
                      {post.description}
                    </p>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-[#a9a49d]">
                  <span>{post.date || 'Curated'}</span>
                  <span className="font-medium text-[#cec7b8]">
                    {(post.likes || 140) + (isLiked ? 1 : 0)} likes
                  </span>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* Spatial Full-Screen Lightbox Modal */}
      {lightboxIndex !== null && activePost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 md:p-10 select-none animate-in fade-in duration-200">
          {/* Refractive backdrop */}
          <div
            onClick={closeLightbox}
            className="absolute inset-0 bg-[#040407]/90 backdrop-blur-3xl"
          />

          {/* Lightbox Controls */}
          <div className="absolute top-5 right-5 z-20 flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                if (navigator.clipboard) {
                  navigator.clipboard.writeText(activePost.mediaUrl);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }
              }}
              className="px-3 py-1.5 rounded-xl liquid-glass text-xs font-semibold text-[#e8d8a7] border border-white/20 flex items-center gap-1.5"
            >
              {copied ? <Check className="size-4 text-emerald-400" /> : <Share2 className="size-4" />}
              <span>{copied ? 'Link Copied' : 'Share'}</span>
            </button>
            <button
              type="button"
              onClick={closeLightbox}
              className="size-10 rounded-full liquid-glass flex items-center justify-center text-white border border-white/20 hover:scale-105 active:scale-95"
            >
              <X className="size-6" />
            </button>
          </div>

          {/* Navigation Arrows */}
          {lightboxIndex > 0 && (
            <button
              type="button"
              onClick={prevPhoto}
              className="hidden sm:flex absolute left-6 top-1/2 -translate-y-1/2 z-20 size-12 rounded-full liquid-glass items-center justify-center text-white border border-white/20 hover:scale-110 active:scale-95"
            >
              <ChevronLeft className="size-6" />
            </button>
          )}

          {lightboxIndex < posts.length - 1 && (
            <button
              type="button"
              onClick={nextPhoto}
              className="hidden sm:flex absolute right-6 top-1/2 -translate-y-1/2 z-20 size-12 rounded-full liquid-glass items-center justify-center text-white border border-white/20 hover:scale-110 active:scale-95"
            >
              <ChevronRight className="size-6" />
            </button>
          )}

          {/* Center Lightbox Container */}
          <div className="relative z-10 max-w-5xl w-full max-h-[90vh] flex flex-col md:flex-row liquid-glass-elevated rounded-3xl overflow-hidden border border-white/20 shadow-2xl">
            {/* Main Photo View */}
            <div className="flex-1 bg-black/95 flex items-center justify-center overflow-hidden min-h-[300px] sm:min-h-[450px]">
              <img
                src={parseImageUrl(activePost.thumbnailUrl || activePost.mediaUrl)}
                alt={activePost.title}
                className="max-h-[85vh] w-full object-contain p-2"
              />
            </div>

            {/* Side Information Panel */}
            <div className="w-full md:w-80 p-6 flex flex-col justify-between border-t md:border-t-0 md:border-l border-white/10 bg-white/[0.02]">
              <div>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#d4af37]/15 text-[#e5cc83] border border-[#d4af37]/30">
                  {activePost.tag || 'Gallery Capture'}
                </span>
                <h3 className="font-display text-2xl font-semibold text-[#fbf8ee] mt-3">
                  {activePost.title}
                </h3>
                {activePost.description && (
                  <p className="mt-2 text-sm text-[#cec7b8] leading-relaxed">
                    {activePost.description}
                  </p>
                )}
              </div>

              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                <span className="text-xs text-[#a9a49d]">{activePost.date}</span>
                <button
                  type="button"
                  onClick={(e) => handleLike(activePost.id, e)}
                  className="flex items-center gap-1.5 text-xs font-semibold text-[#fbf8ee]"
                >
                  <Heart
                    className={`size-4 ${
                      likes[activePost.id] ? 'fill-current text-red-500' : 'text-white'
                    }`}
                  />
                  <span>
                    {(activePost.likes || 140) + (likes[activePost.id] ? 1 : 0)}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
