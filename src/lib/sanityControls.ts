import { stegaClean } from 'next-sanity'

export type GallerySize = 'compact' | 'wide' | 'portrait'
export type GallerySide = 'left' | 'right'
export type MapTone = 'wine' | 'coral' | 'sage' | 'ink'

export function gallerySize(value?: string): GallerySize {
  const cleanValue = stegaClean(value)
  return cleanValue === 'compact' || cleanValue === 'portrait' || cleanValue === 'wide' ? cleanValue : 'wide'
}

export function gallerySide(value?: string): GallerySide {
  return stegaClean(value) === 'right' ? 'right' : 'left'
}

export function mapTone(value?: string): MapTone {
  const cleanValue = stegaClean(value)
  return cleanValue === 'coral' || cleanValue === 'sage' || cleanValue === 'ink' ? cleanValue : 'wine'
}
