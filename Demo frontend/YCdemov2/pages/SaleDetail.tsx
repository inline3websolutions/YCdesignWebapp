import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { saleBikes } from '../constants';
import { ArrowLeft, Check } from 'lucide-react';
import Lightbox from '../components/Lightbox';

const SaleDetail: React.FC = () => {
  const { id } = useParams();
  const bike = saleBikes.find(p => p.id === id);
  const containerRef = useRef<HTMLDivElement>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  useEffect(() => {
    if (!containerRef.current || !window.gsap) return;

    window.gsap.fromTo(containerRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.5 }
    );

    window.gsap.fromTo(".sale-animate",
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, delay: 0.2, ease: "power2.out" }
    );
  }, [id]);

  if (!bike) {
    return (
        <div className="h-screen flex items-center justify-center text-zinc-900 dark:text-white">
            <div className="text-center">
                <h1 className="text-4xl font-syne mb-4">Bike Not Found</h1>
                <Link to="/sales" className="text-yc-yellow underline">Back to Inventory</Link>
            </div>
        </div>
    );
  }

  const handleImageClick = (index: number) => {
      setLightboxIndex(index);
      setLightboxOpen(true);
  };

  return (
    <>
        <div ref={containerRef} className="min-h-screen bg-zinc-50 dark:bg-yc-dark opacity-0 pb-20 transition-colors duration-500">
        
        {/* Navigation Breadcrumb */}
        <div className="pt-24 px-6 container mx-auto mb-8">
            <Link to="/sales" className="inline-flex items-center gap-2 text-zinc-500 hover:text-yc-yellow transition-colors font-rubik text-sm uppercase tracking-wider">
                <ArrowLeft size={16} /> Back to Inventory
            </Link>
        </div>

        <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            {/* Left Column: Gallery Grid */}
            <div className="space-y-4">
                <div 
                    className="aspect-[4/3] overflow-hidden bg-zinc-200 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 cursor-zoom-in group relative"
                    onClick={() => handleImageClick(0)}
                >
                    <img src={bike.mainImage} alt={bike.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                        <span className="opacity-0 group-hover:opacity-100 text-white font-syne uppercase tracking-wider text-sm border border-white px-4 py-2 bg-black/30 backdrop-blur-sm transition-opacity">View Gallery</span>
                    </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                    {bike.gallery.slice(1).map((img, idx) => (
                        <div 
                            key={idx}
                            className="aspect-square overflow-hidden bg-zinc-200 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 cursor-zoom-in group"
                            onClick={() => handleImageClick(idx + 1)}
                        >
                            <img src={img} alt={`Gallery ${idx}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-80 group-hover:opacity-100" />
                        </div>
                    ))}
                </div>
            </div>

            {/* Right Column: Details */}
            <div className="sale-animate">
                <div className="flex items-start justify-between border-b border-zinc-200 dark:border-zinc-800 pb-6 mb-8 transition-colors duration-500">
                    <div>
                         <span className={`inline-block px-3 py-1 text-xs font-bold uppercase tracking-wider mb-4 ${
                            bike.status === 'Available' ? 'bg-green-500/20 text-green-600 dark:text-green-500' : 
                            bike.status === 'Reserved' ? 'bg-orange-500/20 text-orange-500 border border-orange-500/50' : 'bg-red-500/20 text-red-500'
                        }`}>
                            {bike.status}
                        </span>
                        <h1 className="text-4xl md:text-5xl font-syne font-bold text-zinc-900 dark:text-white leading-tight transition-colors duration-500">
                            {bike.title}
                        </h1>
                    </div>
                    <div className="text-right">
                        <span className="block text-3xl font-syne font-bold text-yc-yellow">{bike.price}</span>
                        <span className="text-zinc-500 text-xs uppercase tracking-widest">Ex-Showroom</span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-y-6 gap-x-12 mb-10 text-sm font-rubik">
                    <div>
                        <span className="block text-zinc-500 uppercase tracking-widest text-xs mb-1">Year</span>
                        <span className="text-zinc-900 dark:text-white text-lg">{bike.year}</span>
                    </div>
                    <div>
                        <span className="block text-zinc-500 uppercase tracking-widest text-xs mb-1">Engine</span>
                        <span className="text-zinc-900 dark:text-white text-lg">{bike.engine}</span>
                    </div>
                    <div>
                        <span className="block text-zinc-500 uppercase tracking-widest text-xs mb-1">Mileage</span>
                        <span className="text-zinc-900 dark:text-white text-lg">{bike.mileage}</span>
                    </div>
                    <div>
                        <span className="block text-zinc-500 uppercase tracking-widest text-xs mb-1">Warranty</span>
                        <span className="text-zinc-900 dark:text-white text-lg">6 Months (Engine)</span>
                    </div>
                </div>

                <div className="prose prose-lg max-w-none mb-10 prose-zinc dark:prose-invert">
                    <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-lg transition-colors duration-500">{bike.description}</p>
                </div>

                <div className="bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 p-6 mb-10 transition-colors duration-500 shadow-sm dark:shadow-none">
                    <h3 className="text-zinc-900 dark:text-white font-syne font-bold uppercase mb-4 transition-colors duration-500">Modifications & Features</h3>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {bike.features.map((feature, i) => (
                            <li key={i} className="flex items-center gap-3 text-zinc-600 dark:text-zinc-400 transition-colors duration-500">
                                <Check size={16} className="text-yc-yellow" />
                                <span>{feature}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                <a 
                    href={`https://wa.me/919876543210?text=I'm interested in the ${bike.title} (ID: ${bike.id})`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full bg-yc-yellow text-black text-center py-4 font-syne font-bold uppercase tracking-wider hover:bg-zinc-900 hover:text-white transition-colors"
                >
                    Inquire to Purchase
                </a>
                <p className="text-center text-zinc-500 text-xs mt-4 uppercase tracking-wider">
                    Worldwide shipping assistance available
                </p>
            </div>
        </div>
        </div>
        
        <Lightbox 
            images={bike.gallery} 
            isOpen={lightboxOpen} 
            onClose={() => setLightboxOpen(false)}
            startIndex={lightboxIndex}
        />
    </>
  );
};

export default SaleDetail;