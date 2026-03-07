import fs from 'fs';
import path from 'path';

export type GalleryItem = { src: string; alt: string; type: 'image' | 'video' };

const IMAGE_EXT = /\.(jpg|jpeg|png|gif|webp)$/i;
const VIDEO_EXT = /\.(webm|mp4|mov)$/i;

/**
 * Reads public/gallery and returns all image/video files for the FactoryGallery.
 * Call from a Server Component (e.g. page.tsx).
 */
export function getGalleryItems(): GalleryItem[] {
  const galleryDir = path.join(process.cwd(), 'public', 'gallery');
  if (!fs.existsSync(galleryDir)) return [];

  const files = fs.readdirSync(galleryDir);
  return files
    .filter((f) => IMAGE_EXT.test(f) || VIDEO_EXT.test(f))
    .sort((a, b) => a.localeCompare(b))
    .map((f) => ({
      src: '/gallery/' + encodeURIComponent(f),
      alt: 'ALTEG factory — production and facility',
      type: (VIDEO_EXT.test(f) ? 'video' : 'image') as 'image' | 'video',
    }));
}
