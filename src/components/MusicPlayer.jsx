import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  ChevronDown, 
  Shuffle, 
  Repeat,
  Music2,
  Cloud
} from 'lucide-react';
import { 
  parseImageUrl, 
  resolveAudioStreamUrl, 
  DEFAULT_MUSIC_COVER 
} from '../utils/urlParser';

// Time formatting helper
const formatTime = (timeInSec) => {
  if (isNaN(timeInSec) || !isFinite(timeInSec) || timeInSec <= 0) return '0:00';
  const mins = Math.floor(timeInSec / 60);
  const secs = Math.floor(timeInSec % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

export default function MusicPlayer({ currentTrack, isPlaying, setIsPlaying, onNext, onPrev }) {
  const audioRef = useRef(null);
  
  // Real-time playback timeline state
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [progressPercent, setProgressPercent] = useState(0);

  // Volume & secondary controls
  const [volume, setVolume] = useState(0.75);
  const [isMuted, setIsMuted] = useState(false);
  const [isExpandedMobile, setIsExpandedMobile] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);

  const streamSrc = resolveAudioStreamUrl(currentTrack?.url || currentTrack?.mediaUrl);
  const coverUrl = parseImageUrl(currentTrack?.thumbnailUrl) || DEFAULT_MUSIC_COVER;

  // Track change listener: load stream, reset timeline, play if active
  useEffect(() => {
    if (!audioRef.current || !currentTrack) return;
    const url = resolveAudioStreamUrl(currentTrack.url || currentTrack.mediaUrl);
    if (audioRef.current.src !== url) {
      audioRef.current.src = url;
      audioRef.current.load();
    }
    setCurrentTime(0);
    setProgressPercent(0);
    if (currentTrack.durationSec) {
      setDuration(currentTrack.durationSec);
    }
    if (isPlaying) {
      audioRef.current.play().catch((err) => {
        console.error('Audio stream playback failed:', err);
      });
    }
  }, [currentTrack]);

  // Sync external isPlaying state changes
  useEffect(() => {
    if (!audioRef.current) return;
    if (isPlaying) {
      if (audioRef.current.paused) {
        audioRef.current.play().catch((err) => {
          console.error('Audio stream playback failed:', err);
        });
      }
    } else {
      if (!audioRef.current.paused) {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  // Fixed Play/Pause Toggle Handler (handles browser promises directly)
  const handleTogglePlay = async () => {
    if (!audioRef.current) return;
    
    try {
      if (audioRef.current.paused) {
        await audioRef.current.play();
        setIsPlaying(true);
      } else {
        audioRef.current.pause();
        setIsPlaying(false);
      }
    } catch (err) {
      console.error('Audio stream playback failed:', err);
    }
  };

  // Real-Time Scrubber & Click-To-Seek Implementation
  const handleSeek = (e) => {
    if (!audioRef.current || !duration) return;
    const bar = e.currentTarget.getBoundingClientRect();
    const clickPositionX = e.clientX - bar.left;
    const boundedRatio = Math.max(0, Math.min(1, clickPositionX / bar.width));
    const newSeekTime = boundedRatio * duration;
    
    audioRef.current.currentTime = newSeekTime;
    setCurrentTime(newSeekTime);
    setProgressPercent(boundedRatio * 100);
  };

  const handleVolumeChange = (e) => {
    const vol = parseFloat(e.target.value);
    setVolume(vol);
    setIsMuted(vol === 0);
    if (audioRef.current) {
      audioRef.current.volume = vol;
    }
  };

  const toggleMute = () => {
    if (isMuted) {
      setIsMuted(false);
      if (audioRef.current) audioRef.current.volume = volume || 0.75;
    } else {
      setIsMuted(true);
      if (audioRef.current) audioRef.current.volume = 0;
    }
  };

  // Keyboard shortcut listener (Space = play/pause, Left/Right = seek 5s)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;
      if (e.code === 'Space') {
        e.preventDefault();
        handleTogglePlay();
      } else if (e.code === 'ArrowRight' && audioRef.current) {
        audioRef.current.currentTime = Math.min(duration, audioRef.current.currentTime + 5);
      } else if (e.code === 'ArrowLeft' && audioRef.current) {
        audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - 5);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, duration]);

  if (!currentTrack) return null;

  return (
    <>
      {/* Root Persistent HTML5 Audio Engine */}
      <audio
        ref={audioRef}
        src={streamSrc}
        preload="metadata"
        onLoadedMetadata={(e) => {
          setDuration(e.currentTarget.duration || 0);
        }}
        onTimeUpdate={(e) => {
          const current = e.currentTarget.currentTime || 0;
          const total = e.currentTarget.duration || duration || 0;
          setCurrentTime(current);
          setProgressPercent(total > 0 ? (current / total) * 100 : 0);
        }}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => {
          if (isRepeat && audioRef.current) {
            audioRef.current.currentTime = 0;
            audioRef.current.play();
          } else {
            setIsPlaying(false);
            onNext();
          }
        }}
      />

      {/* ============================================================== */}
      {/* 1. PC / DESKTOP VIEW (>= 1024px) - Floating Luxury Glass Deck */}
      {/* ============================================================== */}
      <div className="hidden lg:flex fixed bottom-5 left-8 right-8 z-40">
        <div className="liquid-glass-elevated w-full flex items-center justify-between gap-6 rounded-full px-7 py-3.5 border border-white/20 shadow-2xl backdrop-blur-3xl">
          {/* Track Album & 3D Vinyl Disc Block */}
          <div className="flex items-center gap-4 w-[280px] shrink-0">
            <div className="relative size-16 shrink-0 flex items-center justify-center">
              <div
                className={`vinyl-disc absolute inset-0 rounded-full flex items-center justify-center transition-transform ${
                  isPlaying ? 'spinning-vinyl' : 'paused-vinyl'
                }`}
              >
                <img
                  src={coverUrl}
                  alt={currentTrack.title}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = DEFAULT_MUSIC_COVER;
                  }}
                  className="size-7 rounded-full object-cover"
                />
                <span className="absolute top-1/2 left-1/2 size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#d4af37] bg-[#0c0c0e]" />
                <span className="pointer-events-none absolute inset-0 rounded-full bg-[conic-gradient(from_20deg,transparent_15%,#ffffff15_24%,transparent_35%,transparent_65%,#ffffff10_74%,transparent_85%)]" />
              </div>
            </div>

            <div className="min-w-0 flex-1 leading-tight">
              <div className="flex items-center gap-1.5">
                <h4 className="text-base font-semibold text-[#f0dfae] truncate">
                  {currentTrack.title}
                </h4>
                {currentTrack.mediaUrl && currentTrack.mediaUrl.includes('drive.google.com') && (
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#d4af37]/20 text-[#e5cc83] border border-[#d4af37]/35">
                    Drive
                  </span>
                )}
              </div>
              <p className="text-xs text-[#c9c2b2] truncate mt-0.5">
                {currentTrack.artist || 'YT Media Sound'} &bull; {currentTrack.genre || 'Sonic Lounge'}
              </p>
              <span className="text-[11px] font-medium text-[#d4af37] block mt-0.5">
                {isPlaying ? 'Now Playing' : 'Paused'}
              </span>
            </div>
          </div>

          {/* Central Playback Controls */}
          <div className="flex items-center gap-4 shrink-0">
            <button
              type="button"
              onClick={() => setIsShuffle(!isShuffle)}
              className={`size-8 flex items-center justify-center transition-colors cursor-pointer ${
                isShuffle ? 'text-[#d4af37]' : 'text-[#aaa59a] hover:text-white'
              }`}
              title={isShuffle ? 'Shuffle Active' : 'Enable Shuffle'}
            >
              <Shuffle className="size-4" />
            </button>
            <button
              type="button"
              onClick={onPrev}
              className="size-9 flex items-center justify-center text-[#dfdbd0] hover:text-[#d4af37] active:scale-95 transition-all cursor-pointer"
              title="Previous Track"
            >
              <SkipBack className="size-5" />
            </button>
            <button
              type="button"
              onClick={handleTogglePlay}
              className="size-12 rounded-full bg-gradient-to-r from-[#e1cc91] to-[#d4af37] text-[#1d190f] flex items-center justify-center shadow-[0_0_20px_rgba(212,175,55,0.4)] active:scale-95 hover:scale-105 transition-all cursor-pointer"
              title={isPlaying ? 'Pause (Space)' : 'Play (Space)'}
            >
              {isPlaying ? (
                <Pause className="size-5 fill-current" />
              ) : (
                <Play className="size-5 fill-current ml-0.5" />
              )}
            </button>
            <button
              type="button"
              onClick={onNext}
              className="size-9 flex items-center justify-center text-[#dfdbd0] hover:text-[#d4af37] active:scale-95 transition-all cursor-pointer"
              title="Next Track"
            >
              <SkipForward className="size-5" />
            </button>
            <button
              type="button"
              onClick={() => setIsRepeat(!isRepeat)}
              className={`size-8 flex items-center justify-center transition-colors cursor-pointer ${
                isRepeat ? 'text-[#d4af37]' : 'text-[#aaa59a] hover:text-white'
              }`}
              title={isRepeat ? 'Repeat Active' : 'Enable Repeat'}
            >
              <Repeat className="size-4" />
            </button>
          </div>

          {/* Real-Time Scrubber & Click-To-Seek Timeline */}
          <div className="flex-1 max-w-2xl flex items-center gap-3 px-4">
            <span className="text-xs text-zinc-400 font-mono w-10 text-right tabular-nums">
              {formatTime(currentTime)}
            </span>
            
            <div 
              onClick={handleSeek} 
              className="relative flex-1 h-1.5 bg-white/10 rounded-full cursor-pointer group py-2"
            >
              {/* Background Bar */}
              <div className="relative w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                {/* Dynamic Progress Fill */}
                <div 
                  className="h-full bg-red-500 rounded-full transition-[width] duration-75 ease-linear"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              
              {/* Draggable/Hoverable Scrub Indicator Dot */}
              <div 
                className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-red-500 rounded-full shadow-[0_0_10px_#ef4444] pointer-events-none transition-transform group-hover:scale-125"
                style={{ left: `calc(${progressPercent}% - 7px)` }}
              />
            </div>

            <span className="text-xs text-zinc-400 font-mono w-10 tabular-nums">
              {formatTime(duration)}
            </span>

            {/* Subtle Audio Waveform Visualizer */}
            <div className="hidden xl:flex items-center gap-0.5 ml-2">
              {[4, 8, 14, 9, 16, 20, 11, 15, 6, 12, 18, 7, 10, 5].map((h, i) => (
                <span
                  key={i}
                  style={{ height: `${isPlaying ? h : 4}px` }}
                  className="w-0.5 bg-red-500/70 rounded-full transition-all duration-200"
                />
              ))}
            </div>
          </div>

          {/* Volume Control */}
          <div className="flex items-center gap-2.5 w-[140px] shrink-0 justify-end">
            <button
              type="button"
              onClick={toggleMute}
              className="text-[#cec7b6] hover:text-white cursor-pointer"
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted || volume === 0 ? <VolumeX className="size-4 text-red-400" /> : <Volume2 className="size-4" />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              className="w-20 h-1 cursor-pointer accent-[#d4af37]"
            />
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 2. MOBILE VIEW (< 1024px) - Non-Overlapping Mini Capsule       */}
      {/* Docked directly at bottom-20 (ABOVE bottom-3 pill dock)        */}
      {/* ============================================================== */}
      <div className="lg:hidden fixed bottom-20 left-3 right-3 z-40">
        <div
          onClick={() => setIsExpandedMobile(true)}
          className="liquid-glass-elevated flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-2xl border border-white/20 shadow-2xl active:scale-98 transition-all cursor-pointer backdrop-blur-2xl"
        >
          {/* Mini Vinyl & Track Info */}
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="relative size-10 shrink-0 flex items-center justify-center">
              <div
                className={`vinyl-disc absolute inset-0 rounded-full flex items-center justify-center ${
                  isPlaying ? 'spinning-vinyl' : 'paused-vinyl'
                }`}
              >
                <img
                  src={coverUrl}
                  alt={currentTrack.title}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = DEFAULT_MUSIC_COVER;
                  }}
                  className="size-4 rounded-full object-cover"
                />
              </div>
            </div>

            <div className="min-w-0 flex-1 leading-tight">
              <h5 className="text-xs font-semibold text-[#f0dfae] truncate">
                {currentTrack.title}
              </h5>
              <p className="text-[10px] text-[#bbb5a7] truncate mt-0.5 font-mono">
                {currentTrack.artist || 'YT Media'} &bull; {formatTime(currentTime)} / {formatTime(duration)}
              </p>
            </div>
          </div>

          {/* Quick Play/Pause & Next Button */}
          <div className="flex items-center gap-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={handleTogglePlay}
              className="size-9 rounded-full bg-[#d4af37] text-[#1d190f] flex items-center justify-center active:scale-90 transition-transform shadow-md cursor-pointer"
            >
              {isPlaying ? (
                <Pause className="size-4 fill-current" />
              ) : (
                <Play className="size-4 fill-current ml-0.5" />
              )}
            </button>
            <button
              type="button"
              onClick={onNext}
              className="size-8 flex items-center justify-center text-[#dfdbd0] active:scale-90 cursor-pointer"
            >
              <SkipForward className="size-4" />
            </button>
            <button
              type="button"
              onClick={() => setIsExpandedMobile(true)}
              className="size-7 flex items-center justify-center text-[#9f9b90] cursor-pointer"
            >
              <Maximize2 className="size-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 3. MOBILE FULL-SCREEN EXPANDED VINYL PLAYER SHEET              */}
      {/* ============================================================== */}
      {isExpandedMobile && (
        <div className="lg:hidden fixed inset-0 z-50 flex flex-col justify-between p-6 bg-[#040407]/95 backdrop-blur-3xl animate-in fade-in slide-in-from-bottom-6">
          {/* Sheet Header */}
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setIsExpandedMobile(false)}
              className="size-10 rounded-full liquid-glass flex items-center justify-center text-[#cec7b8] cursor-pointer"
            >
              <ChevronDown className="size-6" />
            </button>
            <span className="text-xs uppercase tracking-widest font-semibold text-[#d4af37]">
              Now Playing
            </span>
            <div className="size-10" />
          </div>

          {/* Center 3D Turntable Vinyl */}
          <div className="my-auto flex flex-col items-center">
            <div className="relative size-64 sm:size-72 rounded-full p-2 liquid-glass-elevated shadow-2xl flex items-center justify-center">
              <div
                className={`vinyl-disc size-full rounded-full flex items-center justify-center ${
                  isPlaying ? 'spinning-vinyl' : 'paused-vinyl'
                }`}
              >
                <img
                  src={coverUrl}
                  alt={currentTrack.title}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = DEFAULT_MUSIC_COVER;
                  }}
                  className="size-24 rounded-full object-cover border-2 border-[#d4af37]/40 shadow-inner"
                />
                <span className="absolute top-1/2 left-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[#d4af37] bg-[#0c0c0e]" />
              </div>
            </div>

            <div className="text-center mt-8 max-w-xs">
              <h3 className="font-display text-2xl font-semibold text-[#fbf8ee] truncate">
                {currentTrack.title}
              </h3>
              <p className="text-sm text-[#cec7b8] mt-1">
                {currentTrack.artist || 'Dhiraj Kondalwar & Vorex Sound'}
              </p>
              <span className="inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium bg-[#d4af37]/15 text-[#e5cc83] border border-[#d4af37]/30">
                {currentTrack.genre || 'Sonic Lounge'}
              </span>
            </div>
          </div>

          {/* Scrubber & Controls */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 w-full">
              <span className="text-xs text-zinc-400 font-mono w-10 text-right tabular-nums">
                {formatTime(currentTime)}
              </span>
              
              <div 
                onClick={handleSeek} 
                className="relative flex-1 h-1.5 bg-white/10 rounded-full cursor-pointer group py-2"
              >
                {/* Background Bar */}
                <div className="relative w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                  {/* Dynamic Progress Fill */}
                  <div 
                    className="h-full bg-red-500 rounded-full transition-[width] duration-75 ease-linear"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                
                {/* Draggable/Hoverable Scrub Indicator Dot */}
                <div 
                  className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-red-500 rounded-full shadow-[0_0_10px_#ef4444] pointer-events-none"
                  style={{ left: `calc(${progressPercent}% - 7px)` }}
                />
              </div>

              <span className="text-xs text-zinc-400 font-mono w-10 tabular-nums">
                {formatTime(duration)}
              </span>
            </div>

            {/* Main Buttons */}
            <div className="flex items-center justify-center gap-8">
              <button
                type="button"
                onClick={onPrev}
                className="size-12 rounded-full liquid-glass flex items-center justify-center text-[#fbf8ee] active:scale-90 cursor-pointer"
              >
                <SkipBack className="size-6" />
              </button>
              <button
                type="button"
                onClick={handleTogglePlay}
                className="size-16 rounded-full bg-[#d4af37] text-[#1d190f] flex items-center justify-center shadow-[0_0_30px_rgba(212,175,55,0.5)] active:scale-95 cursor-pointer"
              >
                {isPlaying ? <Pause className="size-7 fill-current" /> : <Play className="size-7 fill-current ml-1" />}
              </button>
              <button
                type="button"
                onClick={onNext}
                className="size-12 rounded-full liquid-glass flex items-center justify-center text-[#fbf8ee] active:scale-90 cursor-pointer"
              >
                <SkipForward className="size-6" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
