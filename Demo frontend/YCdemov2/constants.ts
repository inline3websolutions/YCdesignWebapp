import { Project, SaleBike } from './types';

export const projects: Project[] = [
  {
    id: 'rest-001',
    title: 'Royal Enfield G2 1965',
    category: 'Restoration',
    year: '1965 / 2023',
    engine: '350cc Bullet',
    image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?q=80&w=1000&auto=format&fit=crop',
    description: 'A complete ground-up restoration of the legendary G2 engine Bullet. We retained the original heavy crank thump while upgrading the electricals for reliability. The paint is a custom mix of British Racing Green with hand-painted gold pinstripes.',
    clientLocation: 'Pune, India',
    beforeImage: 'https://images.unsplash.com/photo-1622340248270-b8ba57c3d230?q=80&w=1000&auto=format&fit=crop',
    afterImage: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?q=80&w=1000&auto=format&fit=crop'
  },
  {
    id: 'mod-001',
    title: 'Interceptor 650 "Silver Ghost"',
    category: 'Modification',
    year: '2022',
    engine: '650cc Twin',
    image: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?q=80&w=1000&auto=format&fit=crop',
    description: 'A stripped-down cafe racer build focused on weight reduction and aerodynamics. Features a hand-beaten aluminum cowl, custom clip-ons, and a high-performance exhaust system that screams performance.',
    clientLocation: 'Mumbai, India',
  },
  {
    id: 'rest-002',
    title: 'Yezdi Roadking Type B',
    category: 'Restoration',
    year: '1984 / 2024',
    engine: '250cc 2-Stroke',
    image: 'https://images.unsplash.com/photo-1609630875171-b1321377ee65?q=80&w=1000&auto=format&fit=crop',
    description: 'Bringing back the ring-a-ding-ding sound of the 80s. This Roadking was found in a scrap condition. We sourced original Czech parts and rebuilt the twin exhaust system to factory specs.',
    clientLocation: 'Goa, India',
  },
  {
    id: 'mod-002',
    title: 'Himalayan "Dakar Edition"',
    category: 'Modification',
    year: '2021',
    engine: '411cc Single',
    image: 'https://images.unsplash.com/photo-1625043484550-df60256f6ea5?q=80&w=1000&auto=format&fit=crop',
    description: 'Built for the tough terrain. Long travel suspension, rally tower navigation mount, and a custom extended fuel tank for long-range expeditions.',
    clientLocation: 'Ladakh, India',
  },
  {
    id: 'rest-003',
    title: 'Yamaha RD350 HT',
    category: 'Restoration',
    year: '1985 / 2023',
    engine: '350cc Twin Cylinder',
    image: 'https://images.unsplash.com/photo-1449426468159-d96dbf08f19f?q=80&w=1000&auto=format&fit=crop',
    description: 'The widowmaker reborn. Complete engine blueprinting, electronic ignition upgrade, and US-spec barrel porting for maximum power delivery.',
    clientLocation: 'Bangalore, India',
  },
  {
    id: 'mod-003',
    title: 'Continental GT "Blackout"',
    category: 'Modification',
    year: '2023',
    engine: '650cc Twin',
    image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c3d?q=80&w=1000&auto=format&fit=crop',
    description: 'Zero chrome, all attitude. Matte black finish with gloss black racing stripes. Custom LED lighting integration and shortened subframe.',
    clientLocation: 'Delhi, India',
  }
];

export const saleBikes: SaleBike[] = [
    {
        id: 'sale-001',
        title: 'Honda CB750 Nighthawk',
        price: '₹ 4,50,000',
        status: 'Available',
        year: '1998',
        engine: '750cc Inline-4',
        mileage: '24,000 km',
        description: 'A pristine example of the reliable Nighthawk series. This unit has been tastefully modified with a brat-style seat, LED lighting, and a custom 4-into-1 exhaust system that sings. Fully serviced carbs and new tires.',
        mainImage: 'https://images.unsplash.com/photo-1599819811279-d5ad9cccf838?q=80&w=1000&auto=format&fit=crop',
        features: ['Custom Exhaust', 'LED Indicators', 'Brat Seat', 'New Tires', 'Serviced Carbs'],
        gallery: [
            'https://images.unsplash.com/photo-1599819811279-d5ad9cccf838?q=80&w=1000&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1615172282427-9a5752d358cd?q=80&w=1000&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?q=80&w=1000&auto=format&fit=crop'
        ]
    },
    {
        id: 'sale-002',
        title: 'Yamaha RX100 Restomod',
        price: '₹ 1,85,000',
        status: 'Available',
        year: '1992',
        engine: '98cc 2-Stroke',
        mileage: '1,200 km (Post Rebuild)',
        description: 'The street legend. Fully restored frame-up build. Ported barrel for extra punch, expansion chamber exhaust, and a stunning Midnight Blue paint job with original gold decals. Papers current.',
        mainImage: 'https://images.unsplash.com/photo-1609630875171-b1321377ee65?q=80&w=1000&auto=format&fit=crop',
        features: ['Ported Barrel', 'Expansion Chamber', 'Disc Brake Upgrade', 'New Electricals'],
        gallery: [
            'https://images.unsplash.com/photo-1609630875171-b1321377ee65?q=80&w=1000&auto=format&fit=crop',
             'https://images.unsplash.com/photo-1449426468159-d96dbf08f19f?q=80&w=1000&auto=format&fit=crop'
        ]
    },
    {
        id: 'sale-003',
        title: 'BMW R80 Café Racer',
        price: '₹ 12,00,000',
        status: 'Reserved',
        year: '1986',
        engine: '800cc Boxer Twin',
        mileage: '45,000 km',
        description: 'A German masterpiece re-imagined. Mono-shock conversion, Motogadget electronics, and a handmade aluminum tank. This is a collector-grade build for the discerning rider.',
        mainImage: 'https://images.unsplash.com/photo-1622185135505-2d795003994a?q=80&w=1000&auto=format&fit=crop',
        features: ['Motogadget M-Unit', 'Handmade Tank', 'Mono-shock', 'Bar-end Mirrors'],
        gallery: [
             'https://images.unsplash.com/photo-1622185135505-2d795003994a?q=80&w=1000&auto=format&fit=crop',
             'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?q=80&w=1000&auto=format&fit=crop'
        ]
    }
];