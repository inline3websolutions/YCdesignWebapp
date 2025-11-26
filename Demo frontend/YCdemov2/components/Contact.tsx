import React, { useRef, useEffect } from 'react';

const Contact: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.gsap || !window.ScrollTrigger) return;
    const { gsap, ScrollTrigger } = window;
    gsap.registerPlugin(ScrollTrigger);

    gsap.fromTo(contentRef.current,
        { opacity: 0, y: 30 },
        {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top 80%"
            }
        }
    );
  }, []);

  return (
    <section id="contact" ref={containerRef} className="py-24 bg-yc-yellow relative overflow-hidden">
      {/* Texture */}
      <div className="absolute inset-0 bg-yc-dark opacity-10" 
           style={{ backgroundImage: 'radial-gradient(circle at center, transparent 0%, #09090B 100%)' }} />
      
      <div className="container mx-auto px-6 relative z-10 text-center">
        <div ref={contentRef} className="opacity-0">
            <h2 className="text-black font-syne font-bold text-5xl md:text-7xl mb-6 uppercase tracking-tight">
                Ready to Build<br />Your Legend?
            </h2>
            <p className="text-black/70 font-rubik text-xl max-w-2xl mx-auto mb-10 font-medium">
                Whether it's a full restoration or a custom modification, let's discuss your vision.
            </p>
            
            <a 
                href="https://wa.me/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-10 py-5 bg-yc-dark dark:bg-black text-white dark:text-yc-yellow font-syne font-bold text-lg uppercase tracking-wider hover:bg-zinc-800 transition-colors shadow-2xl"
            >
                Start Conversation via WhatsApp
            </a>
        </div>
      </div>
    </section>
  );
};

export default Contact;