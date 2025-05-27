'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { isMobileDevice, prefersReducedMotion } from '@/utils/deviceUtils';
import { scrollToElement as brutalistScrollTo } from '@/utils/gsapUtils';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollToPlugin);
}

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
  const [isMobile, setIsMobile] = useState(false);
  
  // Refs for DOM elements and scroll position
  const headerRef = useRef<HTMLElement>(null);
  const menuOverlayRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const scrollPosRef = useRef<number>(0); // Stores scroll position when mobile menu opens
  
  // Effect: Detect if the device is mobile on mount and resize
  useEffect(() => {
    const checkIsMobile = () => setIsMobile(isMobileDevice());
    checkIsMobile(); // Initial check
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);
  
  // Callback: Handle scroll events to determine the active section
  const handleScroll = useCallback(() => {
    const viewportHeight = window.innerHeight;
    let newActiveSection = activeSection; // Default to current active section
    let maxVisibility = 0;
    
    // Determine which section is most visible in the viewport
    NAV_ITEMS.forEach(({ id }) => {
      const sectionElement = document.getElementById(id);
      if (!sectionElement) return;

      const rect = sectionElement.getBoundingClientRect();
      const visibleTop = Math.max(0, rect.top);
      const visibleBottom = Math.min(viewportHeight, rect.bottom);
      const visibleHeight = Math.max(0, visibleBottom - visibleTop);
      
      // Using proportion of viewport occupied by the visible part of the section
      const visibilityProportion = visibleHeight / viewportHeight; 
      
      if (visibilityProportion > maxVisibility) {
        maxVisibility = visibilityProportion;
        newActiveSection = id;
      }
    });
    
    // Prioritize 'home' section if scrolled very close to the top
    if (window.scrollY < 100) {
      newActiveSection = 'home';
    }
    
    if (newActiveSection !== activeSection) {
      setActiveSection(newActiveSection);
    }
  }, [activeSection]); // Depends on activeSection to compare and update

  // Effect: Set up and clean up scroll event listener
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
      gsap.set(menuItems, { opacity: 1, x: 0 }); // Set final state directly
    } else {
      gsap.set(menuItems, { opacity: 0, x: -20 }); // Initial state for animation
      gsap.to(menuItems, { 
        opacity: 1, 
        x: 0,
        stagger: 0.05, // Quick stagger for items
        duration: 0.2,
        ease: 'power1.out',
      });
    }
  }, [isMenuOpen, isMobile]); // Runs when menu state or mobile state changes

  // Callback: Close the mobile menu
  const closeMenu = useCallback((preserveScrollPosition = false) => {
    if (!isMenuOpen || !menuOverlayRef.current || !menuButtonRef.current) return;

    // Restore body scrolling
    document.body.classList.remove('menu-open-brutalist');
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';
    
    if (!preserveScrollPosition) {
        window.scrollTo(0, scrollPosRef.current); // Restore original scroll position
    }
    
    // Animate menu overlay out
    gsap.to(menuOverlayRef.current, { 
      opacity: 0, 
      duration: 0.1, 
      ease: 'none', 
      onComplete: () => {
        // Hide after animation to prevent interaction and improve performance
        if (menuOverlayRef.current) menuOverlayRef.current.style.display = 'none';
      }
    });
    
    // Animate menu button back to original state
    gsap.to(menuButtonRef.current, {
      rotation: 0, 
      duration: 0.2, 
      ease: 'power1.inOut'
    });

    setIsMenuOpen(false);
  }, [isMenuOpen]); // Depends on isMenuOpen to allow closing

  // Callback: Toggle the mobile menu (open/close)
  const toggleMenu = useCallback(() => {
    if (isMenuOpen) {
      closeMenu(false); // Close if open, don't preserve scroll (manual toggle)
    } else {
      // Open menu
      if (!menuOverlayRef.current || !menuButtonRef.current) return;

      scrollPosRef.current = window.scrollY; // Store current scroll position
      // Prevent body scrolling
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollPosRef.current}px`;
      document.body.style.width = '100%';
      document.body.classList.add('menu-open-brutalist');
      
      // Animate menu overlay in
      menuOverlayRef.current.style.display = 'flex';
      gsap.fromTo(menuOverlayRef.current, 
        { opacity: 0 },
        { opacity: 1, duration: 0.1, ease: 'none' } // Fast fade-in
      );
      
      // Animate menu button
      gsap.to(menuButtonRef.current, {
        rotation: 90, // Rotate to 'X' or similar
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
    // Scroll to top for 'home', otherwise offset by header height
    const scrollOffset = sectionId === 'home' ? 0 : -headerHeight;

    // Use utility for smooth scrolling
    brutalistScrollTo(sectionId, isMobile ? 0.2 : 0.3, scrollOffset);

    if (isMenuOpen && isMobile) {
      // Close menu and preserve scroll position targeted by the link
      closeMenu(true); 
    }
    setActiveSection(sectionId); // Immediately set active section
  }, [isMobile, isMenuOpen, closeMenu]);
  
  return (
    <>
      {/* Fixed Header */}
      <header 
        ref={headerRef}
        className="fixed top-0 left-0 right-0 z-50 bg-background border-b-2 border-foreground transition-all duration-200 ease-out"
        style={{ padding: '0.75rem 1rem' }} // Example padding, adjust as needed
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
                data-section={id} // Useful for debugging or E2E tests
              >
                {label}
              </a>
            ))}
          </nav>
          
          {/* Mobile Menu Toggle Button */}
          {isMobile && ( // Only render toggle button on mobile
            <button
              ref={menuButtonRef}
              onClick={toggleMenu}
              className="p-2 focus:outline-none" // md:hidden is implicitly handled by isMobile condition
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu-overlay"
            >
              {/* Brutalist Hamburger Icon */}
              <div className="space-y-1.5">
                <span className="block w-6 h-0.5 bg-foreground"></span>
                <span className="block w-6 h-0.5 bg-foreground"></span>
                <span className="block w-6 h-0.5 bg-foreground"></span>
              </div>
            </button>
          )}
        </div>
      </header>
      
      {/* Mobile Menu Overlay - Conditionally rendered for mobile devices */}
      {isMobile && (
        <div
          id="mobile-menu-overlay"
          ref={menuOverlayRef}
          className="fixed inset-0 z-40 bg-background flex-col items-center justify-center hidden"
          // `hidden` class sets display: none; GSAP manages display during animation.
        >
          <nav className="flex flex-col items-center text-center">
            {NAV_ITEMS.map(({ id, label }) => (
              <a
                key={id}
                href={`#${id}`}
                onClick={(e) => scrollToSection(e, id)}
                className="menu-item-brutalist block py-4 text-2xl uppercase font-mono hover:bg-foreground hover:text-background w-screen"
                // Added w-screen to make hover effect full width for touch targets
              >
                {label}
              </a>
            ))}
          </nav>
          {/* Mobile Menu Close Button */}
          <button
              onClick={() => closeMenu(false)} // False: restore scroll position if closed manually
              className="absolute top-4 right-4 p-2 text-3xl font-mono uppercase hover:bg-foreground hover:text-background"
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

// Add to your globals.css or a relevant CSS file if not using Tailwind JIT for body classes:
/*
.menu-open-brutalist {
  overflow: hidden !important; // Prevents scrolling of the body when menu is open
}
*/