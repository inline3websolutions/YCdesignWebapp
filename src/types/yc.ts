import type { Media, RestoredMoto, CustomMotorcycle, Manufacturer, Sale } from '@/payload-types'

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

// Helper function to get manufacturer name from relationship (exported for use in other files)
export function getManufacturerName(
  manufacturer: string | number | Manufacturer | null | undefined,
): string {
  // Check for populated relationship object
  if (typeof manufacturer === 'object' && manufacturer !== null && 'name' in manufacturer) {
    return manufacturer.name || ''
  }
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
    engine: getManufacturerName(moto.manufacturer),
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
    engine: getManufacturerName(moto.manufacturer),
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

// Helper function to convert Payload Sale to SaleBike
export function saleToSaleBike(sale: Sale): SaleBike {
  const mainImage = sale.mainImage as Media | undefined
  const gallery = sale.gallery as Media[] | undefined
  const galleryUrls = gallery?.map((img) => img.url).filter((url): url is string => !!url) || []

  // Convert lowercase status from Payload to capitalized status for frontend
  const statusMap: Record<string, SaleBike['status']> = {
    available: 'Available',
    reserved: 'Reserved',
    sold: 'Sold',
  }

  // Extract features array
  const features = sale.features?.map((f) => f.feature) || []

  return {
    id: String(sale.id),
    title: sale.title,
    price: sale.price,
    status: statusMap[sale.status] || 'Available',
    year: String(sale.year),
    engine: sale.engine,
    mileage: sale.mileage,
    description: getPlainTextFromRichText(sale.description),
    mainImage: mainImage?.url || '/placeholder.jpg',
    gallery: galleryUrls,
    features,
    slug: sale.slug || undefined,
  }
}
