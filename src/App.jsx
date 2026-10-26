import React, { useState, useEffect } from 'react';
import AmbientBackground from './components/AmbientBackground';
import VaultLock from './components/VaultLock';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import MobileBottomDock from './components/MobileBottomDock';
import HomeSection from './components/HomeSection';
import VideosSection from './components/VideosSection';
import ShortsSection from './components/ShortsSection';
import PostsSection from './components/PostsSection';
import MusicSection from './components/MusicSection';
import VideoModal from './components/VideoModal';
import MusicPlayer from './components/MusicPlayer';
import AdminStudio from './components/AdminStudio';
import AdminSecurityAuth from './components/AdminSecurityAuth';
import Footer from './components/Footer';

import { INITIAL_SETTINGS, INITIAL_ITEMS } from './data/initialData';

export default function App() {
  // Vault Security State (Master PIN: 1999)
  const [isLocked, setIsLocked] = useState(true);

  // Persistence State
  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('yt_media_settings');
      return saved ? JSON.parse(saved) : INITIAL_SETTINGS;
    } catch {
      return INITIAL_SETTINGS;
    }
  });

  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem('yt_media_items');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const hasDriveMusic = parsed.some((it) => it.id === 'music-drive-1');
          if (!hasDriveMusic) {
            const driveShowcase = INITIAL_ITEMS.find((it) => it.id === 'music-drive-1');
            return driveShowcase ? [driveShowcase, ...parsed] : parsed;
          }
          return parsed;
        }
      }
      return INITIAL_ITEMS;
    } catch {
      return INITIAL_ITEMS;
    }
  });

  // Navigation & Search State
  const [activeTab, setActiveTab] = useState('Home');
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Modals & Panels
  const [selectedVideo, setSelectedVideo] = useState(null);
  
  // Admin Studio Zero-Trust Security State (Passcode: 9765731850)
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(() => {
    try {
      return sessionStorage.getItem('yt_media_admin_authenticated') === 'true';
    } catch {
      return false;
    }
  });
  const [isAdminAuthOpen, setIsAdminAuthOpen] = useState(false);
  const [isStudioOpen, setIsStudioOpen] = useState(false);

  // Music Player Persistent State
  const musicTracks = items.filter((item) => item.category === 'Music');
  const [currentTrack, setCurrentTrack] = useState(() => musicTracks[0] || null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Keep currentTrack synchronized if none selected
  useEffect(() => {
    if (!currentTrack && musicTracks.length > 0) {
      setCurrentTrack(musicTracks[0]);
    }
  }, [musicTracks, currentTrack]);

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('yt_media_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('yt_media_items', JSON.stringify(items));
  }, [items]);

  // Set Theme Attribute on Root
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', settings.theme || 'gold');
  }, [settings.theme]);

  // Media Management Handlers
  const handleAddItem = (newItem) => {
    const itemWithId = {
      ...newItem,
      id: `media-${Date.now()}`,
      date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
    };
    setItems((prev) => [itemWithId, ...prev]);
    if (newItem.category === 'Music') {
      setCurrentTrack(itemWithId);
      setIsPlaying(true);
    }
  };

  const handleUpdateItem = (id, updatedFields) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updatedFields } : item))
    );
  };

  const handleDeleteItem = (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
    if (currentTrack?.id === id) {
      const remaining = musicTracks.filter((t) => t.id !== id);
      setCurrentTrack(remaining[0] || null);
    }
  };

  // Music Queue Next/Prev
  const handleNextTrack = () => {
    if (musicTracks.length === 0) return;
    const currentIndex = musicTracks.findIndex((t) => t.id === currentTrack?.id);
    const nextIndex = (currentIndex + 1) % musicTracks.length;
    setCurrentTrack(musicTracks[nextIndex]);
    setIsPlaying(true);
  };

  const handlePrevTrack = () => {
    if (musicTracks.length === 0) return;
    const currentIndex = musicTracks.findIndex((t) => t.id === currentTrack?.id);
    const prevIndex = (currentIndex - 1 + musicTracks.length) % musicTracks.length;
    setCurrentTrack(musicTracks[prevIndex]);
    setIsPlaying(true);
  };

  // Admin Studio Access Handlers (Security Passcode: 9765731850)
  const handleOpenStudio = () => {
    if (isAdminAuthenticated) {
      setIsStudioOpen(true);
    } else {
      setIsAdminAuthOpen(true);
    }
  };

  const handleAdminAuthenticated = () => {
    setIsAdminAuthenticated(true);
    try {
      sessionStorage.setItem('yt_media_admin_authenticated', 'true');
    } catch {}
    setIsAdminAuthOpen(false);
    setIsStudioOpen(true);
  };

  const handleSignOutAdmin = () => {
    setIsAdminAuthenticated(false);
    try {
      sessionStorage.removeItem('yt_media_admin_authenticated');
    } catch {}
    setIsStudioOpen(false);
  };

  const handleLockVault = () => {
    setIsLocked(true);
    setIsAdminAuthenticated(false);
    try {
      sessionStorage.removeItem('yt_media_admin_authenticated');
    } catch {}
    setIsStudioOpen(false);
    setIsAdminAuthOpen(false);
  };

  // Filter items based on activeTab and searchQuery
  const searchLower = searchQuery.toLowerCase().trim();
  const searchFiltered = items.filter((item) => {
    if (!searchLower) return true;
    return (
      item.title.toLowerCase().includes(searchLower) ||
      (item.description && item.description.toLowerCase().includes(searchLower)) ||
      (item.genre && item.genre.toLowerCase().includes(searchLower)) ||
      item.category.toLowerCase().includes(searchLower)
    );
  });

  const videos = searchFiltered.filter((i) => i.category === 'Videos');
  const shorts = searchFiltered.filter((i) => i.category === 'Shorts');
  const posts = searchFiltered.filter((i) => i.category === 'Post');
  const music = searchFiltered.filter((i) => i.category === 'Music');

  return (
    <div className="min-h-[100dvh] relative text-[#f5f3ea] flex flex-col justify-between selection:bg-[#d4af37]/30 selection:text-white">
      {/* 3D Liquid Aurora Ambient Glow */}
      <AmbientBackground />

      {/* Zero-Trust 3D Vault Lock Door */}
      {isLocked && (
        <VaultLock
          brandAttribution={settings.brandAttribution}
          onUnlock={() => setIsLocked(false)}
        />
      )}

      {/* Main Platform Body (rendered once vault is active) */}
      <div className={`flex-1 flex flex-col px-4 sm:px-8 py-3 sm:py-6 max-w-[1700px] w-full mx-auto transition-opacity duration-700 ${isLocked ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        {/* Sticky Luxury Header */}
        <Header
          siteTitle={settings.siteTitle}
          brandAttribution={settings.brandAttribution}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onOpenStudio={handleOpenStudio}
          onLockVault={handleLockVault}
          mobileSearchOpen={mobileSearchOpen}
          setMobileSearchOpen={setMobileSearchOpen}
        />

        {/* Dual Layout: Desktop Sidebar + Dynamic Section Area */}
        <div className="flex-1 flex gap-6 lg:gap-8 items-start min-h-[70vh]">
          {/* Desktop Collapsible 3D Sidebar */}
          <Sidebar
            activeTab={activeTab}
            setActiveTab={(tab) => {
              setActiveTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            isCollapsed={isSidebarCollapsed}
            setIsCollapsed={setIsSidebarCollapsed}
          />

          {/* Dynamic Content Views */}
          <main className="flex-1 min-w-0 pb-16">
            {activeTab === 'Home' && (
              <HomeSection
                heroBanner={settings.heroBanner}
                videos={videos}
                shorts={shorts}
                posts={posts}
                music={music}
                onSelectVideo={(video) => setSelectedVideo(video)}
                onSelectTrack={(track) => {
                  setCurrentTrack(track);
                  setIsPlaying(true);
                }}
                onNavigateTab={(tab) => setActiveTab(tab)}
                currentTrack={currentTrack}
                isPlaying={isPlaying}
              />
            )}

            {activeTab === 'Videos' && (
              <VideosSection
                videos={videos}
                onSelectVideo={(video) => setSelectedVideo(video)}
              />
            )}

            {activeTab === 'Shorts' && (
              <ShortsSection
                shorts={shorts}
                onSelectVideo={(video) => setSelectedVideo(video)}
              />
            )}

            {activeTab === 'Post' && (
              <PostsSection posts={posts} />
            )}

            {activeTab === 'Music' && (
              <MusicSection
                tracks={music}
                currentTrack={currentTrack}
                isPlaying={isPlaying}
                onSelectTrack={(track) => {
                  setCurrentTrack(track);
                  setIsPlaying(true);
                }}
              />
            )}

            {/* Portal Footer */}
            <Footer brandAttribution={settings.brandAttribution} />
          </main>
        </div>
      </div>

      {/* Persistent Sonic Bar / Music Player (PC deck + Mobile capsule + Vinyl sheet) */}
      {!isLocked && (
        <MusicPlayer
          currentTrack={currentTrack}
          isPlaying={isPlaying}
          setIsPlaying={setIsPlaying}
          onNext={handleNextTrack}
          onPrev={handlePrevTrack}
        />
      )}

      {/* Mobile Floating Bottom Navigation Dock */}
      {!isLocked && (
        <MobileBottomDock
          activeTab={activeTab}
          setActiveTab={(tab) => {
            setActiveTab(tab);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      )}

      {/* Ambilight Cinema Lounge Video Modal */}
      {selectedVideo && (
        <VideoModal
          video={selectedVideo}
          onClose={() => setSelectedVideo(null)}
        />
      )}

      {/* Zero-Trust Admin Studio Security Gate (Passcode: 9765731850) */}
      <AdminSecurityAuth
        isOpen={isAdminAuthOpen}
        onClose={() => setIsAdminAuthOpen(false)}
        onAuthenticated={handleAdminAuthenticated}
      />

      {/* Admin Studio Management Modal */}
      <AdminStudio
        isOpen={isStudioOpen}
        onClose={() => setIsStudioOpen(false)}
        settings={settings}
        onUpdateSettings={setSettings}
        items={items}
        onAddItem={handleAddItem}
        onUpdateItem={handleUpdateItem}
        onDeleteItem={handleDeleteItem}
        onSignOutAdmin={handleSignOutAdmin}
      />
    </div>
  );
}
