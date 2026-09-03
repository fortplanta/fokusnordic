import { stegaClean } from 'next-sanity'

export type GallerySize = 'compact' | 'wide' | 'portrait'
export type GallerySide = 'left' | 'right'

export function gallerySize(value?: string): GallerySize {
  const cleanValue = stegaClean(value)
  return cleanValue === 'compact' || cleanValue === 'portrait' || cleanValue === 'wide' ? cleanValue : 'wide'
}

export function gallerySide(value?: string): GallerySide {
  return stegaClean(value) === 'right' ? 'right' : 'left'
}
