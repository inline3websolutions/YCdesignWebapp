import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { saleBikes } from '../constants';
import { ArrowUpRight, Tag, Gauge, Calendar } from 'lucide-react';

const Sales: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.gsap || !containerRef.current) return;
    
    const ctx = window.gsap.context(() => {
        window.gsap.fromTo(".sale-item", 
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, stagger: 0.1, duration: 0.6, ease: "power2.out" }
        );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
        ref={containerRef}
        className="pt-24 pb-12 min-h-screen transition-colors duration-500"
    >
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16">
            <div>
                <h1 className="text-5xl md:text-7xl font-syne font-bold text-zinc-900 dark:text-white mb-6 transition-colors duration-500">AVAILABLE <span className="text-yc-yellow">MACHINES</span></h1>
                <p className="text-zinc-600 dark:text-zinc-400 font-rubik max-w-lg text-lg transition-colors duration-500">
                    Own a piece of engineering history. Restored to perfection or custom built for the road ahead.
                </p>
            </div>
        </div>

        {/* Responsive Grid: 1 Col Mobile -> 2 Col Tablet -> 3 Col Desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {saleBikes.map((bike) => (
                <article
                    key={bike.id}
                    className="sale-item group opacity-0"
                >
                    <Link to={`/sales/${bike.id}`}>
                        <div className="relative overflow-hidden bg-zinc-200 dark:bg-zinc-800 aspect-[4/3] mb-5 border border-zinc-200 dark:border-zinc-800 group-hover:border-yc-yellow transition-all duration-500 rounded-sm">
                            {/* Status Badge */}
                            <div className="absolute top-4 left-4 z-20">
                                <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider shadow-lg rounded-sm ${
                                    bike.status === 'Available' ? 'bg-white text-black' : 
                                    bike.status === 'Reserved' ? 'bg-zinc-800 text-orange-500 border border-orange-500/50' : 'bg-zinc-900 text-zinc-500 border border-zinc-700'
                                }`}>
                                    {bike.status}
                                </span>
                            </div>

                             <div className={`absolute inset-0 transition-all z-10 ${
                                 bike.status === 'Available' ? 'bg-black/10 group-hover:bg-transparent' : 'bg-black/40 grayscale'
                             }`} />
                             
                            <img 
                                src={bike.mainImage} 
                                alt={bike.title} 
                                className={`w-full h-full object-cover transform transition-transform duration-700 ease-out ${
                                    bike.status === 'Available' ? 'group-hover:scale-105' : 'grayscale'
                                }`}
                            />
                             
                             {/* Price Tag Overlay */}
                             <div className="absolute bottom-4 right-4 z-20">
                                <span className={`px-3 py-2 font-syne font-bold text-sm shadow-xl backdrop-blur-md ${
                                    bike.status === 'Available' ? 'bg-yc-yellow text-black' : 'bg-zinc-800 text-zinc-400'
                                }`}>
                                    {bike.price}
                                </span>
                             </div>
                        </div>
                        
                        <div className="flex justify-between items-start">
                            <div className="w-full">
                                <h3 className={`text-2xl font-syne font-bold transition-colors ${
                                    bike.status === 'Available' ? 'text-zinc-900 dark:text-white group-hover:text-yc-yellow' : 'text-zinc-400 dark:text-zinc-500'
                                }`}>
                                    {bike.title}
                                </h3>
                                
                                <div className="grid grid-cols-2 gap-4 mt-4 border-t border-zinc-200 dark:border-zinc-800 pt-3 transition-colors duration-500">
                                    <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-500 text-xs font-rubik uppercase tracking-wider">
                                        <Calendar size={14} className="text-yc-yellow/70" />
                                        <span>{bike.year}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-500 text-xs font-rubik uppercase tracking-wider">
                                        <Gauge size={14} className="text-yc-yellow/70" />
                                        <span>{bike.engine}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Link>
                </article>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Sales;