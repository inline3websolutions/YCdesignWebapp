import type { Media, RestoredMoto, CustomMotorcycle, Manufacturer, Sale } from '@/payload-types'

export interface Project {
  id: string
  title: string
  category: 'Restoration' | 'Modification'
  year: string
  engine?: string
  image: ImageType
  gallery: ImageType[]
  description: string
  beforeImage?: ImageType
  afterImage?: ImageType
  clientLocation?: string
  slug?: string
}

export interface ImageType {
  url: string
  width: number
  height: number
  alt: string
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
  mainImage: ImageType
  gallery: ImageType[]
  features: string[]
  slug?: string
  manufacturer: string
  numberOfOwners?: string
  registrationDate?: string
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
  return ''
}

// Helper to safely get image data
const getImageData = (img: Media | undefined | string): ImageType => {
  if (typeof img === 'string') {
    return {
      url: img,
      width: 0,
      height: 0,
      alt: '',
    }
  }
  return {
    url: img?.url || '/placeholder.jpg',
    width: img?.width || 0,
    height: img?.height || 0,
    alt: img?.alt || '',
  }
}

// Helper function to convert Payload RestoredMoto to Project
export function restoredMotoToProject(moto: RestoredMoto): Project {
  const heroImage = moto.heroImage as Media | undefined
  const images = moto.images as Media[] | undefined

  return {
    id: String(moto.id),
    title: moto.name,
    category: 'Restoration',
    year: String(moto.year),
    engine: getManufacturerName(moto.manufacturer),
    image: getImageData(heroImage),
    gallery: images?.map(getImageData) || [],
    description: getPlainTextFromRichText(moto.content),
    beforeImage: images?.[0] ? getImageData(images[0]) : undefined,
    afterImage: heroImage ? getImageData(heroImage) : undefined,
    clientLocation: 'India',
    slug: moto.slug || undefined,
  }
}

// Helper function to convert Payload CustomMotorcycle to Project
export function customMotoToProject(moto: CustomMotorcycle): Project {
  const heroImage = moto.heroImage as Media | undefined
  const images = moto.images as Media[] | undefined

  return {
    id: String(moto.id),
    title: moto.name,
    category: 'Modification',
    year: String(moto.year),
    engine: getManufacturerName(moto.manufacturer),
    image: getImageData(heroImage),
    gallery: images?.map(getImageData) || [],
    description: getPlainTextFromRichText(moto.content),
    beforeImage: images?.[0] ? getImageData(images[0]) : undefined,
    afterImage: heroImage ? getImageData(heroImage) : undefined,
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
    manufacturer: getManufacturerName(sale.manufacturer),
    numberOfOwners: sale.numberOfOwners || undefined,
    registrationDate: sale.registrationDate || undefined,
    mileage: sale.mileage,
    description: getPlainTextFromRichText(sale.description),
    mainImage: getImageData(mainImage),
    gallery: gallery?.map(getImageData) || [],
    features,
    slug: sale.slug || undefined,
  }
}
