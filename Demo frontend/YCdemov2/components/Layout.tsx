import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Instagram, Mail, MapPin, Phone, Sun, Moon } from 'lucide-react';
import Logo from './Logo';

const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // Scroll listener for style change
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);

    // Initial enter animation
    if (navRef.current && window.gsap) {
      window.gsap.fromTo(navRef.current, 
        { y: -100, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
      );
    }

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle Hash Scrolling
  useEffect(() => {
    if (location.hash) {
      setTimeout(() => {
        const id = location.hash.replace('#', '');
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }, [location]);

  const navLinks = [
    { name: 'Studio', mobileName: 'Studio', path: '/#about' },
    { name: 'Work', mobileName: 'Work', path: '/portfolio' },
    { name: 'Inventory', mobileName: 'Shop', path: '/sales' },
  ];

  const isActive = (path: string) => {
    const current = location.pathname + location.search + location.hash;
    if (path === '/portfolio' && current.includes('portfolio')) return true;
    if (path === '/sales' && current.includes('sales')) return true;
    if (path === '/' && current === '/') return true;
    if (path.includes('#') && current.includes(path)) return true;
    return false;
  };

  const handleNavClick = (path: string) => {
    if (path.startsWith('/#')) {
        const targetId = path.split('#')[1];
        if (location.pathname === '/') {
            const elem = document.getElementById(targetId);
            elem?.scrollIntoView({ behavior: 'smooth' });
        } else {
            navigate(path);
        }
    }
  };

  return (
      <nav
        ref={navRef}
        className={`fixed left-0 right-0 z-50 flex justify-center transition-all duration-500 ${
            scrolled ? 'top-4' : 'top-6'
        }`}
      >
        <div 
            className={`
                relative w-[95%] max-w-5xl 
                bg-white/80 dark:bg-[#09090B]/80 backdrop-blur-xl 
                border border-zinc-200 dark:border-white/10 
                rounded-full
                flex justify-between items-center 
                pl-4 pr-2 py-2 md:pl-6
                shadow-[0_8px_32px_rgba(0,0,0,0.1)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.5)]
                transition-all duration-500 ease-out
                ${scrolled ? 'bg-white/95 dark:bg-[#09090B]/95 border-zinc-300 dark:border-white/15 shadow-zinc-200/50 dark:shadow-black/60' : ''}
            `}
        >
            {/* Tech Decoration - Corner Accents */}
            <div className="hidden md:block absolute -top-[1px] left-10 w-8 h-[1px] bg-zinc-900/10 dark:bg-white/20" />
            <div className="hidden md:block absolute -bottom-[1px] right-10 w-8 h-[1px] bg-zinc-900/10 dark:bg-white/20" />
            
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group z-20 shrink-0">
                <Logo className="h-6 md:h-9 w-auto text-zinc-900 dark:text-white group-hover:text-yc-yellow transition-colors duration-300" />
            </Link>

            {/* Unified Navigation - Clean Island (Mobile & Desktop) */}
            <div className="flex items-center justify-center gap-0 md:gap-1 absolute left-1/2 -translate-x-1/2">
                {navLinks.map((link) => {
                    const active = isActive(link.path);
                    return (
                        <Link
                            key={link.name}
                            to={link.path}
                            onClick={() => handleNavClick(link.path)}
                            className={`
                                relative px-3 md:px-6 py-2 transition-colors duration-300 group
                                ${active ? 'text-zinc-900 dark:text-white' : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'}
                            `}
                        >
                            <span className="relative z-10 font-rubik uppercase tracking-widest font-bold text-[10px] md:text-xs">
                                <span className="md:hidden">{link.mobileName}</span>
                                <span className="hidden md:inline">{link.name}</span>
                            </span>
                            
                            {/* Modern Dot Indicator for Active State */}
                            <span className={`
                                absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-yc-yellow 
                                transition-all duration-300 
                                ${active ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 group-hover:opacity-50 group-hover:translate-y-0'}
                            `} />
                        </Link>
                    );
                })}
            </div>

            {/* CTA */}
            <div className="flex items-center gap-3 shrink-0 z-20">
                <Link
                    to="/#contact"
                    onClick={() => handleNavClick('/#contact')}
                    className="relative group overflow-hidden px-4 md:px-5 py-2 rounded-full border border-zinc-200 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-900/50 hover:border-yc-yellow/50 transition-colors duration-300"
                >
                    <span className="relative text-[10px] font-syne font-bold uppercase tracking-widest text-zinc-600 dark:text-zinc-300 group-hover:text-zinc-900 dark:group-hover:text-yc-yellow transition-colors duration-300">
                        <span className="md:hidden">Start</span>
                        <span className="hidden md:inline">Start Project</span>
                    </span>
                </Link>
            </div>
        </div>
      </nav>
  );
};

const Footer: React.FC<{ theme: string; toggleTheme: () => void }> = ({ theme, toggleTheme }) => {
  return (
    <footer className="bg-zinc-100 dark:bg-yc-dark border-t border-zinc-200 dark:border-zinc-800 pt-20 pb-10 relative overflow-hidden transition-colors duration-500">
      <div className="absolute inset-0 bg-brushed-metal opacity-5 pointer-events-none" />
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2">
            <div className="mb-6">
                 <Logo className="h-12 w-auto text-zinc-900 dark:text-white transition-colors duration-500" />
            </div>
            <p className="text-zinc-600 dark:text-zinc-400 font-rubik max-w-md leading-relaxed mb-8 transition-colors duration-500">
              Preserving Legends. Building Icons. We specialize in bringing vintage mechanical souls back to life with modern precision and retro-futuristic aesthetics.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 rounded-full border border-zinc-300 dark:border-zinc-700 flex items-center justify-center text-zinc-500 dark:text-zinc-400 hover:border-yc-yellow hover:text-yc-yellow transition-all">
                <Instagram size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-zinc-300 dark:border-zinc-700 flex items-center justify-center text-zinc-500 dark:text-zinc-400 hover:border-yc-yellow hover:text-yc-yellow transition-all">
                <Mail size={18} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-zinc-900 dark:text-white font-syne font-bold uppercase mb-6 transition-colors duration-500">Explore</h3>
            <ul className="space-y-4">
              {['Home', 'Restored Bikes', 'Modified Bikes', 'Inventory', 'About Us', 'Contact'].map((item) => (
                <li key={item}>
                  <Link to="/" className="text-zinc-500 hover:text-yc-yellow transition-colors font-rubik text-sm">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-zinc-900 dark:text-white font-syne font-bold uppercase mb-6 transition-colors duration-500">Visit Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3 text-zinc-500 font-rubik text-sm">
                <MapPin size={18} className="text-yc-yellow shrink-0 mt-1" />
                <span>Lower Parel, Mumbai,<br />Maharashtra, India</span>
              </li>
              <li className="flex items-center space-x-3 text-zinc-500 font-rubik text-sm">
                <Phone size={18} className="text-yc-yellow shrink-0" />
                <span>+91 98765 43210</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-zinc-200 dark:border-zinc-800 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-zinc-500 dark:text-zinc-600 font-rubik transition-colors duration-500">
          <p>&copy; {new Date().getFullYear()} YC Design. All rights reserved.</p>
          
          <div className="flex items-center gap-6 mt-4 md:mt-0">
             {/* Theme Toggle */}
             <button 
                onClick={toggleTheme}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-colors"
                aria-label="Toggle Dark Mode"
             >
                {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
                <span className="uppercase font-bold tracking-wider text-[10px]">{theme === 'dark' ? 'Light' : 'Dark'}</span>
             </button>

            <div className="flex space-x-6">
                <a href="#" className="hover:text-zinc-400">Privacy Policy</a>
                <a href="#" className="hover:text-zinc-400">Terms of Service</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('theme');
        if (stored) return stored;
        return 'dark'; // Default to dark
    }
    return 'dark';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-yc-dark text-zinc-900 dark:text-yc-silver flex flex-col font-rubik selection:bg-yc-yellow selection:text-black transition-colors duration-500">
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <Footer theme={theme} toggleTheme={toggleTheme} />
    </div>
  );
};

export default Layout;