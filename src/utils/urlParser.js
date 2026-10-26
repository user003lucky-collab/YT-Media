/**
 * Smart URL, Drive & Thumbnail Parser Engine
 * Handles YouTube Videos & Shorts, Google Drive Videos, Audios, Photos & Banners
 */

export const DEFAULT_MUSIC_COVER = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&h=600&q=85";

/**
 * Direct Stream URL Resolver (No Redirects)
 * Extracts Google Drive ID from standard share or view URLs and returns direct stream endpoint
 * that HTML5 <audio> can stream without external redirects.
 */
export const resolveAudioStreamUrl = (url) => {
  if (!url) return '';
  
  // Extract Google Drive ID from standard share or view URLs
  const driveIdMatch = url.match(/\/d\/([a-zA-Z0-9_-]+)/) || url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (driveIdMatch && driveIdMatch[1]) {
    const fileId = driveIdMatch[1];
    // Direct stream endpoint that HTML5 <audio> can stream without redirects
    return `https://docs.google.com/uc?export=download&id=${fileId}`;
  }
  
  return url; // Native direct MP3, AAC, WAV, or streaming URL
};

/**
 * Extracts a Google Drive File ID from any Google Drive or Google Docs URL format.
 * Supports:
 *  - drive.google.com/file/d/FILE_ID/view...
 *  - drive.google.com/file/d/FILE_ID
 *  - drive.google.com/open?id=FILE_ID
 *  - drive.google.com/uc?id=FILE_ID
 *  - drive.google.com/uc?export=download&id=FILE_ID
 *  - drive.usercontent.google.com/download?id=FILE_ID...
 *  - docs.google.com/file/d/FILE_ID...
 *  - docs.google.com/uc?id=FILE_ID...
 */
export function extractDriveFileId(url) {
  if (!url || typeof url !== 'string') return null;
  const cleanUrl = url.trim();

  // Pattern 1: /file/d/FILE_ID
  const matchFileD = cleanUrl.match(/(?:drive|docs)\.google\.com\/file\/d\/([a-zA-Z0-9_-]{15,})/i);
  if (matchFileD && matchFileD[1]) return matchFileD[1];

  // Pattern 2: ?id=FILE_ID or &id=FILE_ID
  const matchIdParam = cleanUrl.match(/[?&]id=([a-zA-Z0-9_-]{15,})/i);
  if (matchIdParam && matchIdParam[1] && (cleanUrl.includes('google') || cleanUrl.includes('drive'))) {
    return matchIdParam[1];
  }

  // Pattern 3: direct drive.google.com with identifier
  const matchDriveDirect = cleanUrl.match(/drive\.google\.com\/.*?([a-zA-Z0-9_-]{25,})/i);
  if (matchDriveDirect && matchDriveDirect[1]) return matchDriveDirect[1];

  return null;
}

/**
 * Converts any image URL into a high-speed, direct CDN image.
 * For Google Drive links, extracts the File ID and uses Google's direct lh3 CDN endpoint,
 * with fallbacks handled via getDriveThumbnailFallbacks().
 */
export function parseImageUrl(url) {
  if (!url || typeof url !== 'string') return DEFAULT_MUSIC_COVER;
  const cleanUrl = url.trim();
  if (!cleanUrl) return DEFAULT_MUSIC_COVER;

  const driveId = extractDriveFileId(cleanUrl);
  if (driveId) {
    // lh3.googleusercontent.com/d/ID=w1600 is Google's ultra-fast image CDN for Drive files
    return `https://lh3.googleusercontent.com/d/${driveId}=w1600`;
  }

  return cleanUrl;
}

/**
 * Provides ordered image fallback URLs for Google Drive images in case one endpoint is restricted
 */
export function getDriveThumbnailFallbacks(url) {
  const driveId = extractDriveFileId(url);
  if (!driveId) return [url || DEFAULT_MUSIC_COVER];
  return [
    `https://lh3.googleusercontent.com/d/${driveId}=w1600`,
    `https://lh3.googleusercontent.com/d/${driveId}`,
    `https://drive.google.com/thumbnail?id=${driveId}&sz=w1600`,
    `https://docs.google.com/uc?export=view&id=${driveId}`,
    DEFAULT_MUSIC_COVER
  ];
}

/**
 * Resolves playable audio stream URLs and candidate fallback endpoints.
 * For Google Drive links:
 * - Generates direct download streams for HTML5 <audio>
 * - Provides Google's official embed preview player (https://drive.google.com/file/d/ID/preview)
 *   as a zero-fail fallback if direct streams are restricted by cookies/quotas.
 */
export function getAudioPlaybackSources(url) {
  if (!url || typeof url !== 'string') {
    return {
      isDrive: false,
      isYouTube: false,
      isAudio: false,
      primaryUrl: '',
      candidateUrls: [],
      embedPreviewUrl: '',
      driveId: null
    };
  }

  const clean = url.trim();
  const driveId = extractDriveFileId(clean);

  if (driveId) {
    return {
      isDrive: true,
      isYouTube: false,
      isAudio: true,
      driveId,
      primaryUrl: `https://docs.google.com/uc?export=download&id=${driveId}`,
      candidateUrls: [
        `https://docs.google.com/uc?export=download&id=${driveId}`,
        `https://drive.google.com/uc?id=${driveId}&export=download`,
        `https://drive.usercontent.google.com/download?id=${driveId}&export=download&authuser=0`
      ],
      embedPreviewUrl: `https://drive.google.com/file/d/${driveId}/preview`
    };
  }

  // Check if YouTube
  const ytMatch = clean.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/i
  );
  if (ytMatch && ytMatch[1]) {
    const videoId = ytMatch[1];
    return {
      isDrive: false,
      isYouTube: true,
      isAudio: true,
      driveId: null,
      primaryUrl: clean,
      candidateUrls: [clean],
      embedPreviewUrl: `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&playsinline=1`
    };
  }

  return {
    isDrive: false,
    isYouTube: false,
    isAudio: true,
    driveId: null,
    primaryUrl: clean,
    candidateUrls: [clean],
    embedPreviewUrl: ''
  };
}

/**
 * Parses time string like "4:32" or "12 min" or 272 into seconds
 */
export function parseDurationToSec(duration) {
  if (typeof duration === 'number' && !isNaN(duration)) return duration;
  if (!duration || typeof duration !== 'string') return 0;

  const clean = duration.trim();
  if (clean.includes(':')) {
    const parts = clean.split(':').map((p) => parseInt(p, 10));
    if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
      return parts[0] * 60 + parts[1];
    }
    if (parts.length === 3 && !isNaN(parts[0]) && !isNaN(parts[1]) && !isNaN(parts[2])) {
      return parts[0] * 3600 + parts[1] * 60 + parts[2];
    }
  }

  const minMatch = clean.match(/(\d+)\s*(?:min|m)/i);
  if (minMatch) return parseInt(minMatch[1], 10) * 60;

  const num = parseInt(clean, 10);
  return isNaN(num) ? 0 : num;
}

/**
 * Universal media source inspector for YouTube, Drive, direct videos, and audios
 */
export function parseMediaSource(url) {
  if (!url || typeof url !== 'string') {
    return {
      type: 'unknown',
      embedUrl: '',
      thumbnailUrl: '',
      originalUrl: '',
      provider: 'Direct'
    };
  }

  const cleanUrl = url.trim();

  // 1. YouTube Matcher
  const ytMatch = cleanUrl.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/i
  );

  if (ytMatch && ytMatch[1]) {
    const videoId = ytMatch[1];
    const isShort = cleanUrl.includes('/shorts/');
    return {
      type: isShort ? 'youtube-short' : 'youtube',
      id: videoId,
      embedUrl: `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&playsinline=1`,
      thumbnailUrl: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
      fallbackThumbnail: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
      originalUrl: cleanUrl,
      provider: 'YouTube'
    };
  }

  // 2. Google Drive Matcher (File Links)
  const driveId = extractDriveFileId(cleanUrl);
  if (driveId) {
    return {
      type: 'drive',
      id: driveId,
      embedUrl: `https://drive.google.com/file/d/${driveId}/preview`,
      streamUrl: `https://docs.google.com/uc?export=download&id=${driveId}`,
      thumbnailUrl: `https://lh3.googleusercontent.com/d/${driveId}=w1600`,
      fallbackThumbnail: `https://drive.google.com/thumbnail?id=${driveId}&sz=w1600`,
      originalUrl: cleanUrl,
      provider: 'Drive Cloud'
    };
  }

  // 3. Direct Audio Files (.mp3, .wav, .ogg, .aac, .m4a, pixabay CDN)
  if (/\.(mp3|wav|ogg|aac|m4a|flac)(\?.*)?$/i.test(cleanUrl) || cleanUrl.includes('/audio/')) {
    return {
      type: 'audio',
      embedUrl: cleanUrl,
      thumbnailUrl: DEFAULT_MUSIC_COVER,
      originalUrl: cleanUrl,
      provider: 'Audio Stream'
    };
  }

  // 4. Direct Video Files (.mp4, .webm, .mov)
  if (/\.(mp4|webm|mov)(\?.*)?$/i.test(cleanUrl)) {
    return {
      type: 'direct-video',
      embedUrl: cleanUrl,
      thumbnailUrl: '',
      originalUrl: cleanUrl,
      provider: 'Direct Video'
    };
  }

  // 5. Direct Image Links
  if (/\.(jpg|jpeg|png|webp|avif)(\?.*)?$/i.test(cleanUrl) || cleanUrl.includes('images.unsplash.com') || cleanUrl.includes('images.pexels.com')) {
    return {
      type: 'image',
      embedUrl: cleanUrl,
      thumbnailUrl: cleanUrl,
      originalUrl: cleanUrl,
      provider: 'High-Res Photo'
    };
  }

  // Fallback default
  return {
    type: 'generic',
    embedUrl: cleanUrl,
    thumbnailUrl: cleanUrl,
    originalUrl: cleanUrl,
    provider: 'Web Link'
  };
}
