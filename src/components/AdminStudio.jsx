import React, { useState } from 'react';
import { 
  X, 
  Plus, 
  Save, 
  Trash2, 
  Edit3, 
  Sparkles, 
  Sliders, 
  Layers, 
  Image as ImageIcon, 
  Palette, 
  Eye, 
  Check, 
  ExternalLink,
  Film,
  Smartphone,
  Disc3,
  Clock,
  Pin,
  Cloud,
  Play,
  Pause,
  Music2,
  LogOut,
  ShieldCheck
} from 'lucide-react';
import { 
  parseMediaSource, 
  parseImageUrl, 
  DEFAULT_MUSIC_COVER, 
  extractDriveFileId, 
  getAudioPlaybackSources,
  resolveAudioStreamUrl
} from '../utils/urlParser';

export default function AdminStudio({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  items,
  onAddItem,
  onUpdateItem,
  onDeleteItem,
  onSignOutAdmin
}) {
  const [activeTab, setActiveTab] = useState('inventory'); // 'inventory' | 'add' | 'settings'
  const [inventoryFilter, setInventoryFilter] = useState('All');
  const [inventorySearch, setInventorySearch] = useState('');

  // Form State for Add / Edit
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    category: 'Videos',
    artist: '',
    album: '',
    mediaUrl: '',
    thumbnailUrl: '',
    description: '',
    duration: '',
    genre: '',
    featured: false
  });

  // Live in-studio audio test player state
  const [testAudioPlaying, setTestAudioPlaying] = useState(false);

  // Settings State Form
  const [siteForm, setSiteForm] = useState(settings);

  if (!isOpen) return null;

  // Live Thumbnail Calculation
  const parsedMedia = parseMediaSource(formData.mediaUrl);
  const liveThumbnail = parseImageUrl(formData.thumbnailUrl || parsedMedia.thumbnailUrl);
  const isDriveMedia = Boolean(extractDriveFileId(formData.mediaUrl));
  const audioSources = getAudioPlaybackSources(formData.mediaUrl);

  const handleEditClick = (item) => {
    setEditingId(item.id);
    setFormData({
      title: item.title || '',
      category: item.category || 'Videos',
      artist: item.artist || '',
      album: item.album || '',
      mediaUrl: item.mediaUrl || '',
      thumbnailUrl: item.thumbnailUrl || '',
      description: item.description || '',
      duration: item.duration || '',
      genre: item.genre || item.tag || '',
      featured: !!item.featured
    });
    setTestAudioPlaying(false);
    setActiveTab('add');
  };

  const handleResetForm = () => {
    setEditingId(null);
    setFormData({
      title: '',
      category: 'Videos',
      artist: '',
      album: '',
      mediaUrl: '',
      thumbnailUrl: '',
      description: '',
      duration: '',
      genre: '',
      featured: false
    });
    setTestAudioPlaying(false);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.mediaUrl) {
      alert('Please provide a title and media link.');
      return;
    }

    let finalThumbnail = formData.thumbnailUrl ? formData.thumbnailUrl.trim() : '';
    if (!finalThumbnail) {
      if (parsedMedia.thumbnailUrl) {
        finalThumbnail = parsedMedia.thumbnailUrl;
      } else if (formData.category === 'Music') {
        finalThumbnail = DEFAULT_MUSIC_COVER;
      }
    }

    const payload = {
      ...formData,
      thumbnailUrl: finalThumbnail,
      provider: isDriveMedia ? 'Drive Cloud' : parsedMedia.provider
    };

    if (editingId) {
      onUpdateItem(editingId, payload);
    } else {
      onAddItem(payload);
    }

    handleResetForm();
    setActiveTab('inventory');
  };

  const handleSaveSettings = (e) => {
    e.preventDefault();
    onUpdateSettings(siteForm);
    alert('Studio settings updated successfully.');
  };

  const filteredItems = items.filter((item) => {
    const matchesCategory = inventoryFilter === 'All' || item.category === inventoryFilter;
    const matchesSearch = item.title.toLowerCase().includes(inventorySearch.toLowerCase()) ||
                          (item.description && item.description.toLowerCase().includes(inventorySearch.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 md:p-8 select-none animate-in fade-in">
      {/* Backdrop */}
      <div onClick={onClose} className="absolute inset-0 bg-[#040407]/90 backdrop-blur-2xl" />

      {/* Main Studio Frame */}
      <div className="relative w-full max-w-6xl h-[92vh] liquid-glass-elevated rounded-[28px] sm:rounded-[36px] overflow-hidden border border-white/20 shadow-2xl flex flex-col">
        {/* Studio Top Bar */}
        <div className="flex items-center justify-between px-5 sm:px-8 py-4 border-b border-white/10 bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-2xl liquid-glass flex items-center justify-center text-[#d4af37] border border-[#d4af37]/30">
              <Sliders className="size-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-semibold text-[#fbf8ee] tracking-tight">
                  YT Media Studio
                </h2>
                <span className="px-2 py-0.5 rounded-md text-[9px] font-bold bg-[#d4af37]/20 text-[#e5cc83] border border-[#d4af37]/35 flex items-center gap-1">
                  <ShieldCheck className="size-3 text-[#d4af37]" /> Root Admin
                </span>
              </div>
              <p className="text-xs text-[#a8a49c]">
                Spatial Content Management &amp; Atmosphere Controls
              </p>
            </div>
          </div>

          {/* Navigation Pill Buttons */}
          <div className="flex items-center gap-2">
            <div className="flex items-center p-1 rounded-xl liquid-glass border border-white/10">
              <button
                type="button"
                onClick={() => { setActiveTab('inventory'); }}
                className={`px-3 sm:px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === 'inventory'
                    ? 'bg-[#d4af37] text-black shadow'
                    : 'text-[#cec7b8] hover:text-white'
                }`}
              >
                Inventory ({items.length})
              </button>
              <button
                type="button"
                onClick={() => { setActiveTab('add'); if (!editingId) handleResetForm(); }}
                className={`px-3 sm:px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === 'add'
                    ? 'bg-[#d4af37] text-black shadow'
                    : 'text-[#cec7b8] hover:text-white'
                }`}
              >
                {editingId ? 'Edit Media' : '+ Add Media'}
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('settings')}
                className={`px-3 sm:px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === 'settings'
                    ? 'bg-[#d4af37] text-black shadow'
                    : 'text-[#cec7b8] hover:text-white'
                }`}
              >
                Site &amp; Hero
              </button>
            </div>

            {/* Admin Sign Out Button */}
            {onSignOutAdmin && (
              <button
                type="button"
                onClick={onSignOutAdmin}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20 active:scale-95 transition-all text-xs font-semibold cursor-pointer ml-1"
                title="Terminate Admin Session"
              >
                <LogOut className="size-3.5" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="size-9 rounded-full liquid-glass flex items-center justify-center text-[#cec7b8] hover:text-white border border-white/10 active:scale-95 ml-1 cursor-pointer"
              title="Close Studio"
            >
              <X className="size-5" />
            </button>
          </div>
        </div>

        {/* Studio Content Area */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-8">
          {/* ============================================================== */}
          {/* TAB 1: MEDIA INVENTORY (PC TABLE / MOBILE CARDS)               */}
          {/* ============================================================== */}
          {activeTab === 'inventory' && (
            <div className="space-y-6">
              {/* Filter & Search Bar */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                {/* Category Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                  {['All', 'Videos', 'Shorts', 'Post', 'Music'].map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setInventoryFilter(cat)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                        inventoryFilter === cat
                          ? 'bg-[#d4af37]/20 border-[#d4af37] text-[#fbf8ee]'
                          : 'border-white/10 text-[#a8a49c] hover:border-white/20'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Search in Inventory */}
                <input
                  type="text"
                  placeholder="Filter by title..."
                  value={inventorySearch}
                  onChange={(e) => setInventorySearch(e.target.value)}
                  className="h-10 px-4 rounded-xl border border-white/10 bg-black/40 text-xs text-white placeholder:text-[#888] focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              {/* PC View: Modern Glass Table */}
              <div className="hidden md:block overflow-x-auto rounded-2xl border border-white/10 liquid-glass">
                <table className="w-full text-left text-xs text-[#cec7b8]">
                  <thead className="border-b border-white/10 bg-white/[0.03] text-[11px] uppercase tracking-wider text-[#9e9b95]">
                    <tr>
                      <th className="py-3.5 px-4">Preview</th>
                      <th className="py-3.5 px-4">Title &amp; Info</th>
                      <th className="py-3.5 px-4">Category</th>
                      <th className="py-3.5 px-4">Source / Platform</th>
                      <th className="py-3.5 px-4">Featured</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredItems.map((item) => (
                      <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="py-3 px-4 w-16">
                          <img
                            src={parseImageUrl(item.thumbnailUrl) || DEFAULT_MUSIC_COVER}
                            alt={item.title}
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src = DEFAULT_MUSIC_COVER;
                            }}
                            className="size-12 rounded-lg object-cover bg-black/50 border border-white/10"
                          />
                        </td>
                        <td className="py-3 px-4 min-w-[200px]">
                          <span className="font-semibold text-white block text-sm">
                            {item.title}
                          </span>
                          <span className="text-[11px] text-[#8e8a80] line-clamp-1">
                            {item.artist ? `${item.artist} • ` : ''}{item.description || item.mediaUrl}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-white/5 border border-white/10 text-[#d4af37]">
                            {item.category}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-[#aaa] truncate max-w-xs">
                          {extractDriveFileId(item.mediaUrl) ? (
                            <span className="flex items-center gap-1 text-[#e5cc83]">
                              <Cloud className="size-3.5" /> Drive Cloud
                            </span>
                          ) : (
                            item.provider || 'Direct'
                          )}
                        </td>
                        <td className="py-3 px-4">
                          {item.featured ? (
                            <span className="text-emerald-400 font-semibold flex items-center gap-1">
                              <Check className="size-3.5" /> Pinned
                            </span>
                          ) : (
                            <span className="text-[#666]">Standard</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => handleEditClick(item)}
                              className="size-8 rounded-lg liquid-glass flex items-center justify-center text-[#d4af37] hover:bg-white/10 border border-white/10 cursor-pointer"
                              title="Edit"
                            >
                              <Edit3 className="size-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                if (confirm(`Remove "${item.title}"?`)) onDeleteItem(item.id);
                              }}
                              className="size-8 rounded-lg liquid-glass flex items-center justify-center text-red-400 hover:bg-red-500/20 border border-white/10 cursor-pointer"
                              title="Delete"
                            >
                              <Trash2 className="size-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile View: Swipeable / Stacked Glass Cards */}
              <div className="md:hidden space-y-3">
                {filteredItems.map((item) => (
                  <div
                    key={item.id}
                    className="liquid-glass rounded-2xl p-3.5 border border-white/10 flex items-center gap-3.5"
                  >
                    <img
                      src={parseImageUrl(item.thumbnailUrl) || DEFAULT_MUSIC_COVER}
                      alt={item.title}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = DEFAULT_MUSIC_COVER;
                      }}
                      className="size-16 rounded-xl object-cover shrink-0 bg-black/50"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-semibold text-[#d4af37] px-2 py-0.5 rounded bg-white/5">
                          {item.category}
                        </span>
                        {item.featured && (
                          <span className="text-[10px] text-emerald-400 font-medium">
                            &bull; Pinned
                          </span>
                        )}
                      </div>
                      <h4 className="text-sm font-semibold text-white truncate mt-1">
                        {item.title}
                      </h4>
                      <p className="text-xs text-[#8e8a80] truncate mt-0.5">
                        {item.artist ? `${item.artist} • ` : ''}{item.description || item.mediaUrl}
                      </p>
                    </div>

                    <div className="flex flex-col gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleEditClick(item)}
                        className="size-8 rounded-lg liquid-glass flex items-center justify-center text-[#d4af37] border border-white/10"
                      >
                        <Edit3 className="size-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (confirm(`Remove "${item.title}"?`)) onDeleteItem(item.id);
                        }}
                        className="size-8 rounded-lg liquid-glass flex items-center justify-center text-red-400 border border-white/10"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* TAB 2: ADD / EDIT MEDIA (WITH LIVE THUMBNAIL & AUDIO PREVIEW) */}
          {/* ============================================================== */}
          {activeTab === 'add' && (
            <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-8">
              {/* Form Input Column */}
              <form onSubmit={handleFormSubmit} className="space-y-5">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-semibold text-white">
                    {editingId ? 'Modify Existing Media' : 'Publish New Spatial Media'}
                  </h3>
                  {editingId && (
                    <button
                      type="button"
                      onClick={handleResetForm}
                      className="text-xs text-[#a8a49c] hover:text-white"
                    >
                      Cancel Edit
                    </button>
                  )}
                </div>

                {/* Title */}
                <div>
                  <label className="block text-xs font-semibold text-[#cec7b8] mb-1.5">
                    Title / Caption *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Celestial Drift or Where the land ends"
                    className="w-full h-11 px-4 rounded-xl border border-white/15 bg-black/40 text-xs text-white focus:outline-none focus:border-[#d4af37]"
                  />
                </div>

                {/* Section Category Dropdown */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#cec7b8] mb-1.5">
                      Section Category *
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full h-11 px-3 rounded-xl border border-white/15 bg-[#0a0a10] text-xs text-white focus:outline-none focus:border-[#d4af37]"
                    >
                      <option value="Videos">Videos (Cinema Lounge)</option>
                      <option value="Shorts">Shorts (9:16 Vertical Reel)</option>
                      <option value="Post">Post (Photo Feed &amp; Gallery)</option>
                      <option value="Music">Music (Sonic Lounge)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#cec7b8] mb-1.5">
                      Duration / Tag (Optional)
                    </label>
                    <input
                      type="text"
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                      placeholder="e.g. 4:15 or 4K Cinema"
                      className="w-full h-11 px-4 rounded-xl border border-white/15 bg-black/40 text-xs text-white focus:outline-none focus:border-[#d4af37]"
                    />
                  </div>
                </div>

                {/* Music Specific: Artist & Album */}
                {formData.category === 'Music' && (
                  <div className="grid grid-cols-2 gap-4 animate-in fade-in">
                    <div>
                      <label className="block text-xs font-semibold text-[#cec7b8] mb-1.5">
                        Artist Name
                      </label>
                      <input
                        type="text"
                        value={formData.artist}
                        onChange={(e) => setFormData({ ...formData, artist: e.target.value })}
                        placeholder="e.g. Vorex Sound Studio"
                        className="w-full h-11 px-4 rounded-xl border border-white/15 bg-black/40 text-xs text-white focus:outline-none focus:border-[#d4af37]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#cec7b8] mb-1.5">
                        Album / Genre
                      </label>
                      <input
                        type="text"
                        value={formData.genre}
                        onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                        placeholder="e.g. Ambient / Piano"
                        className="w-full h-11 px-4 rounded-xl border border-white/15 bg-black/40 text-xs text-white focus:outline-none focus:border-[#d4af37]"
                      />
                    </div>
                  </div>
                )}

                {/* Media Source Link */}
                <div>
                  <label className="block text-xs font-semibold text-[#cec7b8] mb-1.5">
                    Media Source Link *
                  </label>
                  <input
                    type="url"
                    required
                    value={formData.mediaUrl}
                    onChange={(e) => setFormData({ ...formData, mediaUrl: e.target.value })}
                    placeholder="Paste YouTube, Google Drive share link, or direct MP4/MP3"
                    className="w-full h-11 px-4 rounded-xl border border-white/15 bg-black/40 text-xs text-white focus:outline-none focus:border-[#d4af37]"
                  />
                  <div className="mt-1 flex items-center justify-between text-[11px]">
                    <span className="text-[#8e8a80]">
                      Format: <strong className="text-[#d4af37]">{isDriveMedia ? 'Google Drive Cloud' : parsedMedia.provider}</strong>
                    </span>
                    {isDriveMedia && (
                      <span className="text-emerald-400 font-medium flex items-center gap-1">
                        <Check className="size-3" /> Auto-optimized for streaming
                      </span>
                    )}
                  </div>
                </div>

                {/* Google Drive Notice */}
                {isDriveMedia && (
                  <div className="flex items-center gap-2.5 p-3 rounded-xl bg-[#d4af37]/10 border border-[#d4af37]/25 text-[11px] text-[#e5cc83] animate-in fade-in">
                    <Cloud className="size-4 shrink-0 text-[#d4af37]" />
                    <span>
                      <strong>Google Drive link verified:</strong> Supports direct audio playback + Drive embed preview fallback. Ensure link access is set to <em>"Anyone with the link"</em>.
                    </span>
                  </div>
                )}

                {/* Custom Thumbnail Link */}
                <div>
                  <label className="block text-xs font-semibold text-[#cec7b8] mb-1.5">
                    Cover Artwork / Thumbnail URL (Optional)
                  </label>
                  <input
                    type="url"
                    value={formData.thumbnailUrl}
                    onChange={(e) => setFormData({ ...formData, thumbnailUrl: e.target.value })}
                    placeholder="Paste image URL or Google Drive photo link (auto-extracted if blank)"
                    className="w-full h-11 px-4 rounded-xl border border-white/15 bg-black/40 text-xs text-white focus:outline-none focus:border-[#d4af37]"
                  />
                  <span className="block text-[11px] text-[#8e8a80] mt-1">
                    Google Drive photo links are automatically converted to high-speed CDN URLs.
                  </span>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-semibold text-[#cec7b8] mb-1.5">
                    Description / Storyline
                  </label>
                  <textarea
                    rows="3"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Add background context, essay notes, or sonic details..."
                    className="w-full p-3 rounded-xl border border-white/15 bg-black/40 text-xs text-white focus:outline-none focus:border-[#d4af37]"
                  />
                </div>

                {/* Pin to Home Featured Toggle */}
                <div className="flex items-center gap-3 p-3 rounded-xl liquid-glass border border-white/10">
                  <input
                    type="checkbox"
                    id="featured-toggle"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="size-4 accent-[#d4af37] rounded"
                  />
                  <label htmlFor="featured-toggle" className="text-xs text-[#cec7b8] cursor-pointer flex items-center gap-1.5">
                    <Pin className="size-3.5 text-[#d4af37]" />
                    <span>Pin to Home Sanctuary Featured Row</span>
                  </label>
                </div>

                {/* Submit Action */}
                <button
                  type="submit"
                  className="w-full h-12 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#e5cc83] text-black font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg active:scale-98 transition-transform cursor-pointer"
                >
                  <Save className="size-4" />
                  <span>{editingId ? 'Save Changes' : 'Publish to Collection'}</span>
                </button>
              </form>

              {/* Live Preview Column */}
              <div className="liquid-glass rounded-2xl p-5 border border-white/10 flex flex-col justify-between">
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-[#d4af37] mb-3">
                    Live Thumbnail &amp; Embed Preview
                  </h4>

                  {/* Dynamic Category Preview */}
                  {formData.category === 'Music' ? (
                    <div className="relative aspect-square w-full max-w-[260px] mx-auto rounded-2xl overflow-hidden bg-black/60 border border-white/15 p-5 flex flex-col items-center justify-center text-center shadow-2xl">
                      {/* 3D Vinyl Disc Animation in Preview */}
                      <div className="relative size-32 rounded-full flex items-center justify-center mb-3">
                        <div className={`vinyl-disc absolute inset-0 rounded-full flex items-center justify-center ${testAudioPlaying ? 'spinning-vinyl' : 'paused-vinyl'}`}>
                          <img
                            src={liveThumbnail || DEFAULT_MUSIC_COVER}
                            alt="Preview"
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src = DEFAULT_MUSIC_COVER;
                            }}
                            className="size-14 rounded-full object-cover"
                          />
                          <span className="absolute size-2 rounded-full border border-[#d4af37] bg-[#111]" />
                        </div>
                      </div>

                      <h5 className="text-sm font-semibold text-[#f0dfae] truncate max-w-[200px]">
                        {formData.title || 'Sonic Lounge Track'}
                      </h5>
                      <p className="text-xs text-[#aaa] truncate max-w-[200px] mt-0.5">
                        {formData.artist || 'YT Media Sound'}
                      </p>

                      {/* In-Studio Audio Test Player */}
                      {formData.mediaUrl && (
                        <div className="mt-4 w-full">
                          <audio
                            src={resolveAudioStreamUrl(formData.mediaUrl)}
                            controls
                            className="w-full h-8 scale-90"
                            onPlay={() => setTestAudioPlaying(true)}
                            onPause={() => setTestAudioPlaying(false)}
                          />
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-black/80 border border-white/15 flex items-center justify-center">
                      {liveThumbnail ? (
                        <img
                          src={liveThumbnail}
                          alt="Preview"
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = DEFAULT_MUSIC_COVER;
                          }}
                          className="size-full object-cover"
                        />
                      ) : (
                        <div className="text-center p-4 text-[#888]">
                          <ImageIcon className="size-8 mx-auto mb-1 text-[#444]" />
                          <span className="text-xs">Paste link to view live preview</span>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="mt-4 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-[#d4af37]">
                      {formData.category} &bull; {isDriveMedia ? 'Drive Cloud' : parsedMedia.provider}
                    </span>
                    <h5 className="text-sm font-semibold text-white">
                      {formData.title || 'Untitled Media'}
                    </h5>
                    <p className="text-xs text-[#a9a49c] line-clamp-2">
                      {formData.description || 'No description provided.'}
                    </p>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-white/10 text-[11px] text-[#777]">
                  Smart Parser automatically detects YouTube IDs, Google Drive preview links, and high-speed thumbnails.
                </div>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* TAB 3: SITE & HERO BANNER CUSTOMIZER                           */}
          {/* ============================================================== */}
          {activeTab === 'settings' && (
            <form onSubmit={handleSaveSettings} className="space-y-6 max-w-2xl">
              <div>
                <h3 className="text-base font-semibold text-white">
                  Brand Identity &amp; Aesthetic Atmosphere
                </h3>
                <p className="text-xs text-[#a8a49c] mt-0.5">
                  Customize the brand attribution, site title, and liquid glass glow hue
                </p>
              </div>

              {/* Site Title */}
              <div>
                <label className="block text-xs font-semibold text-[#cec7b8] mb-1.5">
                  Platform Name
                </label>
                <input
                  type="text"
                  value={siteForm.siteTitle}
                  onChange={(e) => setSiteForm({ ...siteForm, siteTitle: e.target.value })}
                  className="w-full h-11 px-4 rounded-xl border border-white/15 bg-black/40 text-xs text-white focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              {/* Brand Attribution Subtitle */}
              <div>
                <label className="block text-xs font-semibold text-[#cec7b8] mb-1.5">
                  Brand Attribution Subtitle (CRITICAL)
                </label>
                <input
                  type="text"
                  value={siteForm.brandAttribution}
                  onChange={(e) => setSiteForm({ ...siteForm, brandAttribution: e.target.value })}
                  className="w-full h-11 px-4 rounded-xl border border-white/15 bg-black/40 text-xs text-white focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              {/* Theme Preset Radios */}
              <div>
                <label className="block text-xs font-semibold text-[#cec7b8] mb-2">
                  Atmosphere Theme Glow
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { id: 'gold', label: 'Gold Amber', color: '#d4af37' },
                    { id: 'crimson', label: 'Crimson Ember', color: '#ff0033' },
                    { id: 'violet', label: 'Electric Violet', color: '#8b5cf6' },
                    { id: 'emerald', label: 'Obsidian Emerald', color: '#10b981' }
                  ].map((thm) => (
                    <button
                      key={thm.id}
                      type="button"
                      onClick={() => setSiteForm({ ...siteForm, theme: thm.id })}
                      className={`flex items-center gap-2 p-3 rounded-xl border text-xs font-medium cursor-pointer transition-all ${
                        siteForm.theme === thm.id
                          ? 'bg-white/10 border-[#d4af37] text-white shadow-lg'
                          : 'bg-black/30 border-white/10 text-[#a8a49c] hover:border-white/20'
                      }`}
                    >
                      <span
                        style={{ backgroundColor: thm.color }}
                        className="size-3.5 rounded-full shrink-0 shadow-sm"
                      />
                      <span>{thm.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Parallax Hero Banner Options */}
              <div className="pt-4 border-t border-white/10">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-[#d4af37] mb-3">
                  Featured Top Hero Billboard
                </h4>

                {/* Show/Hide Hero Toggle */}
                <div className="flex items-center gap-3 mb-4">
                  <input
                    type="checkbox"
                    id="hero-show-toggle"
                    checked={siteForm.heroBanner.show}
                    onChange={(e) =>
                      setSiteForm({
                        ...siteForm,
                        heroBanner: { ...siteForm.heroBanner, show: e.target.checked }
                      })
                    }
                    className="size-4 accent-[#d4af37]"
                  />
                  <label htmlFor="hero-show-toggle" className="text-xs text-[#cec7b8] cursor-pointer">
                    Enable Top Parallax Hero Billboard
                  </label>
                </div>

                {/* Hero Title */}
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs text-[#a9a49d] mb-1">Hero Title</label>
                    <input
                      type="text"
                      value={siteForm.heroBanner.title}
                      onChange={(e) =>
                        setSiteForm({
                          ...siteForm,
                          heroBanner: { ...siteForm.heroBanner, title: e.target.value }
                        })
                      }
                      className="w-full h-10 px-3 rounded-xl border border-white/15 bg-black/40 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-[#a9a49d] mb-1">Tagline</label>
                    <input
                      type="text"
                      value={siteForm.heroBanner.tagline}
                      onChange={(e) =>
                        setSiteForm({
                          ...siteForm,
                          heroBanner: { ...siteForm.heroBanner, tagline: e.target.value }
                        })
                      }
                      className="w-full h-10 px-3 rounded-xl border border-white/15 bg-black/40 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-[#a9a49d] mb-1">Hero Image URL (or Google Drive)</label>
                    <input
                      type="url"
                      value={siteForm.heroBanner.imageUrl}
                      onChange={(e) =>
                        setSiteForm({
                          ...siteForm,
                          heroBanner: { ...siteForm.heroBanner, imageUrl: e.target.value }
                        })
                      }
                      className="w-full h-10 px-3 rounded-xl border border-white/15 bg-black/40 text-xs text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Save Settings Button */}
              <button
                type="submit"
                className="h-11 px-6 rounded-xl bg-[#d4af37] text-black font-bold text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-lg active:scale-98 transition-transform"
              >
                <Save className="size-4" />
                <span>Save Atmosphere Settings</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
