import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { projects } from '../constants';
import { ArrowLeft, MapPin, Wrench, Calendar, Info } from 'lucide-react';
import Lightbox from '../components/Lightbox';

const BeforeAfterSlider: React.FC<{ before?: string; after?: string }> = ({ before, after }) => {
    const [sliderPosition, setSliderPosition] = useState(50);
    const [isDragging, setIsDragging] = useState(false);

    if (!before || !after) return null;

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!isDragging) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
        setSliderPosition((x / rect.width) * 100);
    };

    const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = Math.max(0, Math.min(e.touches[0].clientX - rect.left, rect.width));
        setSliderPosition((x / rect.width) * 100);
    };

    return (
        <div className="mt-16 mb-16">
             <h3 className="text-2xl font-syne font-bold text-zinc-900 dark:text-white mb-6 text-center uppercase transition-colors duration-500">Transformation <span className="text-yc-yellow">Reveal</span></h3>
             <div 
                className="relative w-full aspect-[16/9] overflow-hidden cursor-ew-resize select-none border border-zinc-200 dark:border-zinc-700"
                onMouseDown={() => setIsDragging(true)}
                onMouseUp={() => setIsDragging(false)}
                onMouseLeave={() => setIsDragging(false)}
                onMouseMove={handleMouseMove}
                onTouchMove={handleTouchMove}
            >
                <img src={after} alt="After" className="absolute inset-0 w-full h-full object-cover" />
                
                <div 
                    className="absolute inset-0 w-full h-full overflow-hidden"
                    style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
                >
                    <img src={before} alt="Before" className="absolute inset-0 w-full h-full object-cover grayscale" />
                    <div className="absolute top-4 left-4 bg-black/70 px-3 py-1 text-white text-xs font-bold uppercase">Before</div>
                </div>
                
                <div className="absolute top-4 right-4 bg-yc-yellow text-black px-3 py-1 text-xs font-bold uppercase">After</div>

                <div 
                    className="absolute top-0 bottom-0 w-1 bg-yc-yellow cursor-ew-resize z-20"
                    style={{ left: `${sliderPosition}%` }}
                >
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-yc-yellow rounded-full flex items-center justify-center shadow-lg">
                        <div className="flex gap-[2px]">
                            <div className="w-[2px] h-3 bg-black"></div>
                            <div className="w-[2px] h-3 bg-black"></div>
                        </div>
                    </div>
                </div>
            </div>
            <p className="text-center text-zinc-500 text-xs mt-4 uppercase tracking-widest">Drag slider to see restoration process</p>
        </div>
    );
};

const ProjectDetail: React.FC = () => {
  const { id } = useParams();
  const project = projects.find(p => p.id === id);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Lightbox State
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Mock secondary gallery images for demonstration
  const extraImages = [
      "https://images.unsplash.com/photo-1558981321-3814a41f3cde?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1558980394-0a06c4631733?q=80&w=1200&auto=format&fit=crop",
      // Include project main image in the gallery as well
      project?.image || ""
  ].filter(Boolean);

  useEffect(() => {
    if (!containerRef.current || !window.gsap) return;

    window.gsap.fromTo(containerRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.5 }
    );

    window.gsap.fromTo(".detail-animate",
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, delay: 0.2, ease: "power2.out" }
    );
  }, [id]);

  if (!project) {
    return (
        <div className="h-screen flex items-center justify-center text-zinc-900 dark:text-white">
            <div className="text-center">
                <h1 className="text-4xl font-syne mb-4">Project Not Found</h1>
                <Link to="/portfolio" className="text-yc-yellow underline">Back to Portfolio</Link>
            </div>
        </div>
    );
  }

  return (
    <div ref={containerRef} className="min-h-screen bg-zinc-50 dark:bg-yc-dark opacity-0 transition-colors duration-500">
      {/* Detail Hero */}
      <div className="relative h-[60vh] md:h-[80vh] w-full">
         <div className="absolute inset-0">
             <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
             <div className="absolute inset-0 bg-gradient-to-t from-zinc-50 dark:from-yc-dark via-black/40 to-transparent transition-colors duration-500" />
         </div>
         <div className="absolute top-24 left-6 z-20">
             <Link to="/portfolio" className="inline-flex items-center gap-2 text-white/80 hover:text-yc-yellow transition-colors font-rubik text-sm uppercase tracking-wider bg-black/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
                <ArrowLeft size={16} /> Back to Archives
             </Link>
         </div>
         <div className="absolute bottom-0 w-full p-6 md:p-12 z-20">
             <div className="container mx-auto">
                 <span className="detail-animate inline-block px-3 py-1 bg-yc-yellow text-black font-bold uppercase text-xs tracking-wider mb-4 opacity-0">
                    {project.category}
                 </span>
                 <h1 className="detail-animate text-4xl md:text-7xl font-syne font-bold text-white max-w-4xl opacity-0">
                    {project.title}
                 </h1>
             </div>
         </div>
      </div>

      <div className="container mx-auto px-6 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
              {/* Specs Sidebar */}
              <div className="lg:col-span-1">
                  <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-8 sticky top-32 transition-colors duration-500 shadow-sm dark:shadow-none">
                      <h3 className="text-zinc-900 dark:text-white font-syne font-bold text-xl uppercase mb-6 border-b border-zinc-200 dark:border-zinc-800 pb-4 transition-colors duration-500">Build Specs</h3>
                      
                      <div className="space-y-6">
                          <div className="flex items-start gap-4">
                              <Calendar className="text-yc-yellow shrink-0" size={20} />
                              <div>
                                  <span className="block text-zinc-500 text-xs uppercase tracking-wider mb-1">Year / Model</span>
                                  <span className="text-zinc-800 dark:text-white font-rubik">{project.year}</span>
                              </div>
                          </div>
                          
                          <div className="flex items-start gap-4">
                              <Wrench className="text-yc-yellow shrink-0" size={20} />
                              <div>
                                  <span className="block text-zinc-500 text-xs uppercase tracking-wider mb-1">Engine</span>
                                  <span className="text-zinc-800 dark:text-white font-rubik">{project.engine}</span>
                              </div>
                          </div>

                          <div className="flex items-start gap-4">
                              <MapPin className="text-yc-yellow shrink-0" size={20} />
                              <div>
                                  <span className="block text-zinc-500 text-xs uppercase tracking-wider mb-1">Client Location</span>
                                  <span className="text-zinc-800 dark:text-white font-rubik">{project.clientLocation}</span>
                              </div>
                          </div>

                          <div className="flex items-start gap-4">
                              <Info className="text-yc-yellow shrink-0" size={20} />
                              <div>
                                  <span className="block text-zinc-500 text-xs uppercase tracking-wider mb-1">Build ID</span>
                                  <span className="text-zinc-800 dark:text-white font-rubik uppercase">{project.id}</span>
                              </div>
                          </div>
                      </div>

                      <a href="/#contact" className="block w-full mt-8 bg-transparent border border-yc-yellow text-yc-yellow text-center py-3 font-syne font-bold uppercase hover:bg-yc-yellow hover:text-black transition-all">
                          Enquire Similar Build
                      </a>
                  </div>
              </div>

              {/* Main Content */}
              <div className="lg:col-span-2">
                  <div className="prose prose-lg max-w-none prose-zinc dark:prose-invert">
                      <h2 className="text-3xl font-syne text-zinc-900 dark:text-white mb-6 transition-colors duration-500">The Story</h2>
                      <p className="text-zinc-600 dark:text-zinc-400 font-rubik leading-relaxed transition-colors duration-500">
                          {project.description}
                      </p>
                      <p className="text-zinc-600 dark:text-zinc-400 font-rubik leading-relaxed mt-4 transition-colors duration-500">
                          Every curve and component has been considered. We stripped the machine down to its bare essentials, sandblasted the frame, and rebuilt the engine with precision tolerances that exceed the original factory specifications.
                      </p>
                  </div>

                  <BeforeAfterSlider before={project.beforeImage} after={project.image} />

                  {/* Interactive Gallery Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-12">
                      {extraImages.slice(0, 2).map((img, idx) => (
                          <div 
                              key={idx} 
                              className="relative h-64 overflow-hidden border border-zinc-200 dark:border-zinc-800 group cursor-zoom-in"
                              onClick={() => {
                                  setLightboxIndex(idx);
                                  setLightboxOpen(true);
                              }}
                          >
                              <img 
                                  src={img} 
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                                  alt={`Detail ${idx + 1}`} 
                              />
                              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                                  <span className="opacity-0 group-hover:opacity-100 text-white font-syne uppercase text-xs tracking-wider border border-white/50 px-3 py-1 bg-black/30 backdrop-blur-sm transition-opacity">
                                      Expand
                                  </span>
                              </div>
                          </div>
                      ))}
                  </div>
              </div>
          </div>
      </div>

      <Lightbox 
          images={extraImages}
          isOpen={lightboxOpen}
          onClose={() => setLightboxOpen(false)}
          startIndex={lightboxIndex}
      />
    </div>
  );
};

export default ProjectDetail;