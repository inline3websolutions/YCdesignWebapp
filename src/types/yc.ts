import type { Media, RestoredMoto, CustomMotorcycle, Manufacturer } from '@/payload-types'

export interface Project {
  id: string
  title: string
  category: 'Restoration' | 'Modification'
  year: string
  engine?: string
  image: string
  gallery: string[]
  description: string
  beforeImage?: string
  afterImage?: string
  clientLocation?: string
  slug?: string
}

export interface Testimonial {
  id: string
  name: string
  role: string
  text: string
  rating: number
}

export interface SaleBike {
  id: string
  title: string
  price: string
  status: 'Available' | 'Sold' | 'Reserved'
  year: string
  engine: string
  mileage: string
  description: string
  mainImage: string
  gallery: string[]
  features: string[]
  slug?: string
}

// Helper function to get manufacturer name from relationship or legacy string
function getManufacturerName(
  manufacturer: string | number | Manufacturer | null | undefined,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  doc?: any,
): string {
  // First priority: check for populated relationship object (most reliable)
  if (typeof manufacturer === 'object' && manufacturer !== null && 'name' in manufacturer) {
    return manufacturer.name || ''
  }

  // Second: check if manufacturer is a plain string (legacy data, not an ObjectId)
  if (typeof manufacturer === 'string') {
    // If it looks like a MongoDB ObjectId (24 hex chars), it's an unpopulated relationship
    if (/^[a-f0-9]{24}$/i.test(manufacturer)) {
      // Check manufacturerLegacy for actual name (but also validate it's not an ObjectId)
      if (
        doc?.manufacturerLegacy &&
        typeof doc.manufacturerLegacy === 'string' &&
        !/^[a-f0-9]{24}$/i.test(doc.manufacturerLegacy)
      ) {
        return doc.manufacturerLegacy
      }
      return '' // Unpopulated relationship with no legacy name
    }
    return manufacturer // Legacy string data (actual name)
  }

  // Third: check manufacturerLegacy as fallback (but validate it's not an ObjectId)
  if (
    doc?.manufacturerLegacy &&
    typeof doc.manufacturerLegacy === 'string' &&
    !/^[a-f0-9]{24}$/i.test(doc.manufacturerLegacy)
  ) {
    return doc.manufacturerLegacy
  }

  // Handle number (shouldn't happen, but just in case)
  if (typeof manufacturer === 'number') return ''

  return ''
}

// Helper function to convert Payload RestoredMoto to Project
export function restoredMotoToProject(moto: RestoredMoto): Project {
  const heroImage = moto.heroImage as Media | undefined
  const images = moto.images as Media[] | undefined
  const galleryUrls = images?.map((img) => img.url).filter((url): url is string => !!url) || []

  return {
    id: String(moto.id),
    title: moto.name,
    category: 'Restoration',
    year: String(moto.year),
    engine: getManufacturerName(moto.manufacturer, moto),
    image: heroImage?.url || '/placeholder.jpg',
    gallery: galleryUrls,
    description: getPlainTextFromRichText(moto.content),
    beforeImage: images?.[0]?.url || undefined,
    afterImage: heroImage?.url || undefined,
    clientLocation: 'India',
    slug: moto.slug || undefined,
  }
}

// Helper function to convert Payload CustomMotorcycle to Project
export function customMotoToProject(moto: CustomMotorcycle): Project {
  const heroImage = moto.heroImage as Media | undefined
  const images = moto.images as Media[] | undefined
  const galleryUrls = images?.map((img) => img.url).filter((url): url is string => !!url) || []

  return {
    id: String(moto.id),
    title: moto.name,
    category: 'Modification',
    year: String(moto.year),
    engine: getManufacturerName(moto.manufacturer, moto),
    image: heroImage?.url || '/placeholder.jpg',
    gallery: galleryUrls,
    description: getPlainTextFromRichText(moto.content),
    beforeImage: images?.[0]?.url || undefined,
    afterImage: heroImage?.url || undefined,
    clientLocation: 'India',
    slug: moto.slug || undefined,
  }
}

// Helper to extract plain text from Lexical rich text
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getPlainTextFromRichText(content: any): string {
  if (!content || !content.root || !content.root.children) {
    return ''
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const extractText = (node: any): string => {
    if (node.type === 'text') {
      return node.text || ''
    }
    if (node.children) {
      return node.children.map(extractText).join(' ')
    }
    return ''
  }

  return content.root.children.map(extractText).join(' ').trim().substring(0, 300)
}

// Static testimonials data
export const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Vikram Rathore',
    role: 'Collector',
    rating: 5,
    text: "YC Design didn't just restore my '68 Bonneville; they breathed new life into it. The attention to detail on the engine block polishing and the custom seat fabrication is world-class.",
  },
  {
    id: '2',
    name: 'Aditya Mehta',
    role: 'Racing Enthusiast',
    rating: 5,
    text: "I wanted a cafe racer that could handle Mumbai traffic but look like it belonged on a track. The build quality exceeds anything I've seen in India. Pure brutal elegance.",
  },
  {
    id: '3',
    name: 'Sarah Jenkins',
    role: 'Architect',
    rating: 5,
    text: 'The fusion of industrial aesthetics and classic motorcycle heritage is seamless. My modified Enfield draws a crowd wherever I park. Truly building icons.',
  },
]

// Static sales data (can be replaced with a Payload collection later)
export const saleBikes: SaleBike[] = [
  {
    id: 'sale-001',
    title: 'Honda CB750 Nighthawk',
    price: '₹ 4,50,000',
    status: 'Available',
    year: '1998',
    engine: '750cc Inline-4',
    mileage: '24,000 km',
    description:
      'A pristine example of the reliable Nighthawk series. This unit has been tastefully modified with a brat-style seat, LED lighting, and a custom 4-into-1 exhaust system that sings. Fully serviced carbs and new tires.',
    mainImage:
      'https://images.unsplash.com/photo-1599819811279-d5ad9cccf838?q=80&w=1000&auto=format&fit=crop',
    features: ['Custom Exhaust', 'LED Indicators', 'Brat Seat', 'New Tires', 'Serviced Carbs'],
    gallery: [
      'https://images.unsplash.com/photo-1599819811279-d5ad9cccf838?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1615172282427-9a5752d358cd?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?q=80&w=1000&auto=format&fit=crop',
    ],
  },
  {
    id: 'sale-002',
    title: 'Yamaha RX100 Restomod',
    price: '₹ 1,85,000',
    status: 'Available',
    year: '1992',
    engine: '98cc 2-Stroke',
    mileage: '1,200 km (Post Rebuild)',
    description:
      'The street legend. Fully restored frame-up build. Ported barrel for extra punch, expansion chamber exhaust, and a stunning Midnight Blue paint job with original gold decals. Papers current.',
    mainImage:
      'https://images.unsplash.com/photo-1609630875171-b1321377ee65?q=80&w=1000&auto=format&fit=crop',
    features: ['Ported Barrel', 'Expansion Chamber', 'Disc Brake Upgrade', 'New Electricals'],
    gallery: [
      'https://images.unsplash.com/photo-1609630875171-b1321377ee65?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1449426468159-d96dbf08f19f?q=80&w=1000&auto=format&fit=crop',
    ],
  },
  {
    id: 'sale-003',
    title: 'BMW R80 Café Racer',
    price: '₹ 12,00,000',
    status: 'Reserved',
    year: '1986',
    engine: '800cc Boxer Twin',
    mileage: '45,000 km',
    description:
      'A German masterpiece re-imagined. Mono-shock conversion, Motogadget electronics, and a handmade aluminum tank. This is a collector-grade build for the discerning rider.',
    mainImage:
      'https://images.unsplash.com/photo-1622185135505-2d795003994a?q=80&w=1000&auto=format&fit=crop',
    features: ['Motogadget M-Unit', 'Handmade Tank', 'Mono-shock', 'Bar-end Mirrors'],
    gallery: [
      'https://images.unsplash.com/photo-1622185135505-2d795003994a?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?q=80&w=1000&auto=format&fit=crop',
    ],
  },
]
