'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { gsap } from 'gsap';
import { isMobileDevice, prefersReducedMotion } from '@/utils/deviceUtils';
import { scrollToElement as brutalistScrollTo, registerGSAPPlugins } from '@/utils/gsapUtils';

const LOGO_TEXT = "BRUTALIST·PORTFOLIO";
const NAV_ITEMS = [
  { id: 'home', label: 'HOME' },
  { id: 'about', label: 'ABOUT' },
  { id: 'skills', label: 'SKILLS' },
  { id: 'contact', label: 'CONTACT' },
];

/**
 * Navigation component with support for desktop and mobile views.
 * Manages active section highlighting, mobile menu animations, and smooth scrolling.
 */
const Navigation = () => {
  // Component State
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState(NAV_ITEMS[0].id);
  // Initialize isMobile state directly using isMobileDevice utility.
  // isMobileDevice handles window check and caches its result.
  const [isMobile, setIsMobile] = useState(isMobileDevice());
  
  // Refs for DOM elements and scroll position
  const headerRef = useRef<HTMLElement>(null);
  const menuOverlayRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const scrollPosRef = useRef<number>(0); // Stores scroll position when mobile menu opens
  
  // Effect: Register GSAP plugins once on component mount
  useEffect(() => {
    registerGSAPPlugins();
  }, []);

  // Effect: Update isMobile state on window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(isMobileDevice());
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []); // Empty dependency array ensures this runs only on mount and unmount
  
  // Callback: Handle scroll events to determine the active section
  const handleScroll = useCallback(() => {
    const viewportHeight = window.innerHeight;
    let newActiveSection = activeSection; 
    let maxVisibility = 0;
    
    NAV_ITEMS.forEach(({ id }) => {
      const sectionElement = document.getElementById(id);
      if (!sectionElement) return;

      const rect = sectionElement.getBoundingClientRect();
      const visibleTop = Math.max(0, rect.top);
      const visibleBottom = Math.min(viewportHeight, rect.bottom);
      const visibleHeight = Math.max(0, visibleBottom - visibleTop);
      
      const visibilityProportion = visibleHeight / viewportHeight; 
      
      if (visibilityProportion > maxVisibility) {
        maxVisibility = visibilityProportion;
        newActiveSection = id;
      }
    });
    
    if (window.scrollY < 100) {
      newActiveSection = 'home';
    }
    
    if (newActiveSection !== activeSection) {
      setActiveSection(newActiveSection);
    }
  }, [activeSection]); 

  // Effect: Set up and clean up scroll event listener for active section highlighting
  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check on mount
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);
  
  // Effect: Animate mobile menu items when the menu opens
  useEffect(() => {
    if (!isMenuOpen || !isMobile || !menuOverlayRef.current) return;

    const menuItems = menuOverlayRef.current.querySelectorAll<HTMLElement>('.menu-item-brutalist');
    
    if (prefersReducedMotion()) {
      gsap.set(menuItems, { opacity: 1, x: 0 }); 
    } else {
      gsap.set(menuItems, { opacity: 0, x: -20 }); 
      gsap.to(menuItems, { 
        opacity: 1, 
        x: 0,
        stagger: 0.05, 
        duration: 0.2,
        ease: 'power1.out',
      });
    }
  }, [isMenuOpen, isMobile]); 

  // Callback: Close the mobile menu
  const closeMenu = useCallback((preserveScrollPosition = false) => {
    if (!isMenuOpen || !menuOverlayRef.current || !menuButtonRef.current) return;

    document.body.classList.remove('menu-open-brutalist');
    document.body.style.top = '';
    
    if (!preserveScrollPosition) {
        window.scrollTo(0, scrollPosRef.current); 
    }
    
    gsap.to(menuOverlayRef.current, { 
      opacity: 0, 
      duration: 0.1, 
      ease: 'none', 
      onComplete: () => {
        if (menuOverlayRef.current) menuOverlayRef.current.style.display = 'none';
      }
    });
    
    gsap.to(menuButtonRef.current, {
      rotation: 0, 
      duration: 0.2, 
      ease: 'power1.inOut'
    });

    setIsMenuOpen(false);
  }, [isMenuOpen]); 

  // Callback: Toggle the mobile menu (open/close)
  const toggleMenu = useCallback(() => {
    if (isMenuOpen) {
      closeMenu(false); 
    } else {
      if (!menuOverlayRef.current || !menuButtonRef.current) return;

      scrollPosRef.current = window.scrollY; 
      document.body.style.top = `-${scrollPosRef.current}px`;
      document.body.classList.add('menu-open-brutalist');
      
      menuOverlayRef.current.style.display = 'flex';
      gsap.fromTo(menuOverlayRef.current, 
        { opacity: 0 },
        { opacity: 1, duration: 0.1, ease: 'none' } 
      );
      
      gsap.to(menuButtonRef.current, {
        rotation: 90, 
        duration: 0.2, 
        ease: 'power1.inOut'
      });
      setIsMenuOpen(true);
    }
  }, [isMenuOpen, closeMenu]);
  
  // Callback: Handle click on navigation links to scroll to sections
  const scrollToSection = useCallback((event: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    event.preventDefault();
    if (!headerRef.current) return;

    const headerHeight = headerRef.current.offsetHeight;
    const scrollOffset = sectionId === 'home' ? 0 : -headerHeight;

    brutalistScrollTo(sectionId, isMobile ? 0.2 : 0.3, scrollOffset);

    if (isMenuOpen && isMobile) {
      closeMenu(true); 
    }
    setActiveSection(sectionId); 
  }, [isMobile, isMenuOpen, closeMenu]);
  
  return (
    <>
      {/* Fixed Header */}
      <header 
        ref={headerRef}
        className="fixed top-0 left-0 right-0 z-50 bg-background border-b-2 border-foreground transition-all duration-200 ease-out px-4 py-3"
      >
        <div className="container mx-auto flex items-center justify-between">
          {/* Logo */}
          <a 
            href="#home"
            onClick={(e) => scrollToSection(e, 'home')}
            className="text-xl md:text-2xl font-display uppercase tracking-tight hover:text-accent transition-colors duration-100 flex items-center"
          >
            {LOGO_TEXT}
          </a>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {NAV_ITEMS.map(({ id, label }) => (
              <a
                key={id}
                href={`#${id}`}
                onClick={(e) => scrollToSection(e, id)}
                className={`nav-link-brutalist px-3 py-2 uppercase font-mono text-sm hover:bg-foreground hover:text-background ${
                  activeSection === id ? 'bg-foreground text-background' : 'text-foreground'
                } transition-colors duration-100`}
                data-section={id}
              >
                {label}
              </a>
            ))}
          </nav>
          
          {/* Mobile Menu Toggle Button */}
          {isMobile && (
            <button
              ref={menuButtonRef}
              onClick={toggleMenu}
              className="p-2 focus:outline-none"
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu-overlay"
            >
              <div className="space-y-1.5">
                <span className="block w-6 h-0.5 bg-foreground"></span>
                <span className="block w-6 h-0.5 bg-foreground"></span>
                <span className="block w-6 h-0.5 bg-foreground"></span>
              </div>
            </button>
          )}
        </div>
      </header>
      
      {/* Mobile Menu Overlay */}
      {isMobile && (
        <div
          id="mobile-menu-overlay"
          ref={menuOverlayRef}
          className="fixed inset-0 z-40 bg-background flex-col items-center justify-center hidden"
        >
          <nav className="flex flex-col items-center text-center">
            {NAV_ITEMS.map(({ id, label }) => (
              <a
                key={id}
                href={`#${id}`}
                onClick={(e) => scrollToSection(e, id)}
                className="menu-item-brutalist block py-4 text-2xl uppercase font-mono hover:bg-foreground hover:text-background w-screen"
              >
                {label}
              </a>
            ))}
          </nav>
          <button
              onClick={() => closeMenu(false)} 
              className="brutalist-border absolute top-4 right-4 p-2 text-3xl font-mono uppercase hover:bg-foreground hover:text-background transition-colors duration-100"
              aria-label="Close menu"
          >
              X
          </button>
        </div>
      )}
    </>
  );
};

export default Navigation;

// CSS class for body when mobile menu is open.
// Add to your globals.css or a relevant CSS file if not using Tailwind JIT for body classes:
/*
.menu-open-brutalist {
  overflow: hidden !important; 
}
*/