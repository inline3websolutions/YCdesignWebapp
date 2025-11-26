export interface Project {
  id: string;
  title: string;
  category: 'Restoration' | 'Modification';
  year: string;
  engine: string;
  image: string;
  description: string;
  beforeImage?: string;
  afterImage?: string;
  clientLocation?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  text: string;
  rating: number;
}

export interface SaleBike {
  id: string;
  title: string;
  price: string;
  status: 'Available' | 'Sold' | 'Reserved';
  year: string;
  engine: string;
  mileage: string;
  description: string;
  mainImage: string;
  gallery: string[];
  features: string[];
}

declare global {
  interface Window {
    gsap: any;
    ScrollTrigger: any;
  }
}