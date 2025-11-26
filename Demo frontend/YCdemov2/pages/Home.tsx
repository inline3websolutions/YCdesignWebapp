import React, { useEffect, useRef } from 'react';
import About from '../components/About';
import Hero from '../components/Hero';
import PortfolioGrid from '../components/PortfolioGrid';
import Testimonials from '../components/Testimonials';
import Contact from '../components/Contact';
import { projects } from '../constants';

const Home: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current && window.gsap) {
        window.gsap.to(containerRef.current, { opacity: 1, duration: 0.5 });
    }
  }, []);

  return (
    <div ref={containerRef} className="opacity-0">
      <Hero />
      <About />
      <PortfolioGrid 
        title="RETRO SOUL REBORN" 
        subtitle="Recent Restorations" 
        projects={projects} 
        filter="Restoration" 
        viewAllLink="/portfolio?filter=Restoration"
      />
      <PortfolioGrid 
        title="CUSTOM PERFORMANCE" 
        subtitle="Recent Modifications" 
        projects={projects} 
        filter="Modification" 
        viewAllLink="/portfolio?filter=Modification"
      />
      <Testimonials />
      <Contact />
    </div>
  );
};

export default Home;