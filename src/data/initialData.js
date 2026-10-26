/**
 * Pre-loaded initial showcase content for YT Media
 */

export const INITIAL_SETTINGS = {
  siteTitle: "YT Media",
  brandAttribution: "Powered by Vorex Agency | Built by Dhiraj Kondalwar",
  theme: "gold", // "gold" | "crimson" | "violet" | "emerald"
  heroBanner: {
    show: true,
    title: "Where the land ends",
    tagline: "Black sand, silver water. A moment at the edge of Iceland.",
    categoryBadge: "Coastal Film",
    duration: "12 min",
    quality: "4K Cinema",
    imageUrl: "https://images.pexels.com/photos/33010644/pexels-photo-33010644.jpeg?auto=compress&cs=tinysrgb&w=1800&h=850&fit=crop&q=85",
    mediaUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
  }
};

export const INITIAL_ITEMS = [
  // VIDEOS
  {
    id: "vid-1",
    category: "Videos",
    title: "Where the land ends",
    description: "A quiet study of the Icelandic coast and volcanic shorelines.",
    mediaUrl: "https://www.youtube.com/watch?v=1La4QzGeaaQ", // Scenic cinematic 4K
    thumbnailUrl: "https://images.unsplash.com/photo-1790283124162-338b2f8e9171?auto=format&fit=crop&w=1200&h=675&q=85",
    duration: "12:08",
    featured: true,
    date: "25 Oct 2026",
    provider: "YouTube"
  },
  {
    id: "vid-2",
    category: "Videos",
    title: "The shape of silence",
    description: "Brutalist architecture, shadow gradients, and passing afternoon light.",
    mediaUrl: "https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OGvE2upms/view", // Google Drive format
    thumbnailUrl: "https://images.unsplash.com/photo-1741524915320-8fee76e41424?auto=format&fit=crop&w=1200&h=675&q=85",
    duration: "08:46",
    featured: true,
    date: "24 Oct 2026",
    provider: "Drive Cloud"
  },
  {
    id: "vid-3",
    category: "Videos",
    title: "Nocturne in Kyoto",
    description: "Deep obsidian bamboo forests and wet cobblestone lanterns at dusk.",
    mediaUrl: "https://www.youtube.com/watch?v=ysz5S6PUM-U",
    thumbnailUrl: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&h=675&q=85",
    duration: "15:22",
    featured: false,
    date: "22 Oct 2026",
    provider: "YouTube"
  },

  // SHORTS
  {
    id: "short-1",
    category: "Shorts",
    title: "Into the red",
    description: "Concrete passage lit by a red-orange sunset glow.",
    genre: "Architecture",
    duration: "0:34",
    mediaUrl: "https://www.youtube.com/shorts/3jz_K3m_q6U",
    thumbnailUrl: "https://images.unsplash.com/photo-1784034292954-e988c2e1ce15?auto=format&fit=crop&w=480&h=853&q=85",
    featured: true,
    likes: 428,
    date: "26 Oct 2026",
    provider: "YouTube"
  },
  {
    id: "short-2",
    category: "Shorts",
    title: "Between walls",
    description: "A narrow concrete passage opening to the evening celestial sky.",
    genre: "Visual Reel",
    duration: "0:42",
    mediaUrl: "https://www.youtube.com/shorts/5qap5aO4i9A",
    thumbnailUrl: "https://images.unsplash.com/photo-1779020847308-50d6ddd1a544?auto=format&fit=crop&w=480&h=853&q=85",
    featured: true,
    likes: 892,
    date: "25 Oct 2026",
    provider: "YouTube"
  },
  {
    id: "short-3",
    category: "Shorts",
    title: "A slower ascent",
    description: "Sunlight tracing a curved floating concrete staircase.",
    genre: "Cinema Reel",
    duration: "0:28",
    mediaUrl: "https://www.youtube.com/shorts/kJQP7kiw5Fk",
    thumbnailUrl: "https://images.unsplash.com/photo-1743760676341-ac13322116ad?auto=format&fit=crop&w=480&h=853&q=85",
    featured: true,
    likes: 1240,
    date: "23 Oct 2026",
    provider: "YouTube"
  },

  // POSTS
  {
    id: "post-1",
    category: "Post",
    title: "Notes from the coast",
    description: "The tide leaves a different line every time. A photographic study of volcanic black sand and turbulent sea.",
    mediaUrl: "https://images.unsplash.com/photo-1790283124162-338b2f8e9171?auto=format&fit=crop&w=900&h=1125&q=85",
    thumbnailUrl: "https://images.unsplash.com/photo-1790283124162-338b2f8e9171?auto=format&fit=crop&w=900&h=1125&q=85",
    featured: true,
    likes: 312,
    date: "24 October",
    tag: "Photo essay"
  },
  {
    id: "post-2",
    category: "Post",
    title: "Light held in glass",
    description: "Amber architectural glass catching the late autumn sun. The colours behind the sound of Afterglow.",
    mediaUrl: "https://images.unsplash.com/photo-1683799286400-69220fa89f48?auto=format&fit=crop&w=900&h=1125&q=85",
    thumbnailUrl: "https://images.unsplash.com/photo-1683799286400-69220fa89f48?auto=format&fit=crop&w=900&h=1125&q=85",
    featured: true,
    likes: 580,
    date: "22 October",
    tag: "Studio notes"
  },
  {
    id: "post-3",
    category: "Post",
    title: "Monolithic sanctuary",
    description: "Curated raw textures and spatial acoustic baffles inside the private screening chamber.",
    mediaUrl: "https://images.unsplash.com/photo-1741524915320-8fee76e41424?auto=format&fit=crop&w=900&h=1125&q=85",
    thumbnailUrl: "https://images.unsplash.com/photo-1741524915320-8fee76e41424?auto=format&fit=crop&w=900&h=1125&q=85",
    featured: false,
    likes: 219,
    date: "20 October",
    tag: "Spatial design"
  },

  // MUSIC
  {
    id: "music-drive-1",
    category: "Music",
    title: "Celestial Drift (Drive Stream)",
    artist: "Vorex Sound Studio",
    album: "Obsidian Cloud",
    genre: "Ambient Stream",
    duration: "4:15",
    durationSec: 255,
    mediaUrl: "https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OGvE2upms/view",
    thumbnailUrl: "https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OGvE2upms/view",
    featured: true,
    date: "26 Oct 2026",
    provider: "Drive Cloud"
  },
  {
    id: "music-1",
    category: "Music",
    title: "Afterglow",
    artist: "Dhiraj Kondalwar & Vorex Sound",
    album: "Amber Studies",
    genre: "Ambient",
    duration: "4:32",
    durationSec: 272,
    mediaUrl: "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=ambient-piano-amp-strings-10711.mp3",
    thumbnailUrl: "https://images.unsplash.com/photo-1683799286400-69220fa89f48?auto=format&fit=crop&w=400&h=400&q=85",
    featured: true,
    date: "26 Oct 2026"
  },
  {
    id: "music-2",
    category: "Music",
    title: "Low tide",
    artist: "Vorex Acoustic",
    album: "Atlantic Minimal",
    genre: "Piano Solo",
    duration: "3:56",
    durationSec: 236,
    mediaUrl: "https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=piano-moment-9835.mp3",
    thumbnailUrl: "https://images.pexels.com/photos/33010644/pexels-photo-33010644.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop&q=85",
    featured: true,
    date: "24 Oct 2026"
  },
  {
    id: "music-3",
    category: "Music",
    title: "Rooms of light",
    artist: "Spatial Synthesizer Collective",
    album: "Obsidian Horizons",
    genre: "Electronic",
    duration: "5:18",
    durationSec: 318,
    mediaUrl: "https://cdn.pixabay.com/download/audio/2022/10/14/audio_9939f77cb7.mp3?filename=lofi-study-112191.mp3",
    thumbnailUrl: "https://images.unsplash.com/photo-1784034292954-e988c2e1ce15?auto=format&fit=crop&w=400&h=400&q=85",
    featured: true,
    date: "21 Oct 2026"
  }
];
