'use client';

import { useEffect, useRef, useState, useCallback, lazy, Suspense } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { isMobileDevice, prefersReducedMotion } from '@/utils/deviceUtils';
import Navigation from '@/components/Navigation';

// Lazy load components for better performance
const HeroSection = lazy(() => import('@/components/HeroSection'));
const AboutSection = lazy(() => import('@/components/AboutSection'));
const SkillsSection = lazy(() => import('@/components/SkillsSection'));
const ContactSection = lazy(() => import('@/components/ContactSection'));

export default function Home() {
  // State
  const [isMobile] = useState(() => isMobileDevice());
  const [hasMounted, setHasMounted] = useState(false);

  // Refs for custom cursor
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const mousePositionRef = useRef({ x: 0, y: 0 });
  const cursorPositionRef = useRef({ x: 0, y: 0 });

  // Handle cursor movement
  const handleMouseMove = useCallback((e: MouseEvent) => {
    mousePositionRef.current = { x: e.clientX, y: e.clientY };
    
    // For dot cursor, update position directly. Opacity handled by mouseenter/leave.
    if (cursorDotRef.current) {
      cursorDotRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    }
  }, []);

  // Animation loop for the main cursor (non-dot)
  const animateCursor = useCallback(() => {
    if (!cursorRef.current) {
      // If cursor element is removed (e.g., during cleanup), stop the animation loop.
      // The requestAnimationFrame should have been cancelled by cleanup, but this is a safeguard.
      return;
    }
    
    const diffX = mousePositionRef.current.x - cursorPositionRef.current.x;
    const diffY = mousePositionRef.current.y - cursorPositionRef.current.y;
    const easingFactor = 0.3;
    
    cursorPositionRef.current.x += diffX * easingFactor;
    cursorPositionRef.current.y += diffY * easingFactor;
    
    cursorRef.current.style.transform = `translate(${cursorPositionRef.current.x}px, ${cursorPositionRef.current.y}px)`;
    
    animationFrameRef.current = requestAnimationFrame(animateCursor);
  }, []);

  // Setup custom cursor
  const setupCustomCursor = useCallback(() => {
    if (isMobile || prefersReducedMotion()) return null;
    
    const cursor = document.createElement('div');
    cursor.classList.add('cursor');
    cursor.style.position = 'fixed';
    cursor.style.pointerEvents = 'none';
    cursor.style.zIndex = '9999';
    cursor.style.opacity = '0'; // Start hidden
    document.body.appendChild(cursor);
    cursorRef.current = cursor;
    
    const cursorDot = document.createElement('div');
    cursorDot.classList.add('cursor-dot');
    cursorDot.style.position = 'fixed';
    cursorDot.style.pointerEvents = 'none';
    cursorDot.style.zIndex = '10000';
    cursorDot.style.opacity = '0'; // Start hidden
    document.body.appendChild(cursorDot);
    cursorDotRef.current = cursorDot;
    
    const onMouseMove = (e: MouseEvent) => handleMouseMove(e);
    const onMouseLeave = () => {
      if (cursorRef.current) cursorRef.current.style.opacity = '0';
      if (cursorDotRef.current) cursorDotRef.current.style.opacity = '0';
    };
    const onMouseEnter = () => {
      if (cursorRef.current) cursorRef.current.style.opacity = '1';
      if (cursorDotRef.current) cursorDotRef.current.style.opacity = '1';
    };

    document.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);
    
    const handleMouseOverInteractive = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!cursorRef.current) return;
      
      const isInteractive = target.closest('a, button, .interactive, .brutalist-button, .brutalist-card');
      
      if (isInteractive) {
        cursorRef.current.classList.add('cursor-active');
        const isBrutalistButton = target.closest('.brutalist-button');
        
        const animProps = {
          duration: 0.05,
          ease: 'none',
        };

        if (isBrutalistButton) {
          gsap.to(cursorRef.current, {
            ...animProps,
            width: '50px',
            height: '50px',
            backgroundColor: 'var(--color-accent)',
            opacity: 0.7,
          });
        } else {
          gsap.to(cursorRef.current, {
            ...animProps,
            width: '30px',
            height: '30px',
            backgroundColor: 'var(--color-foreground)',
            opacity: 0.5,
          });
        }
      } else {
        cursorRef.current.classList.remove('cursor-active');
        gsap.to(cursorRef.current, {
          duration: 0.05,
          ease: 'none',
          width: '10px', // Default cursor size (ensure this matches CSS or is intended override)
          height: '10px',
          backgroundColor: 'var(--color-foreground)', // Default color
          opacity: 1, // Default opacity
        });
      }
    };
    
    document.body.addEventListener('mouseover', handleMouseOverInteractive, { passive: true });
    
    animationFrameRef.current = requestAnimationFrame(animateCursor);
    
    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
      document.body.removeEventListener('mouseover', handleMouseOverInteractive);
      
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      
      if (cursorRef.current?.parentNode) {
        cursorRef.current.parentNode.removeChild(cursorRef.current);
        cursorRef.current = null;
      }
      
      if (cursorDotRef.current?.parentNode) {
        cursorDotRef.current.parentNode.removeChild(cursorDotRef.current);
        cursorDotRef.current = null;
      }
    };
  }, [animateCursor, handleMouseMove, isMobile]);

  // Main effect for page initialization, loading animation, and cursor setup
  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (!hasMounted) return;

    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.config({
      ignoreMobileResize: true,
      autoRefreshEvents: 'visibilitychange,DOMContentLoaded,load,resize',
    });
    
    const reduceMotion = prefersReducedMotion();
    const baseDuration = reduceMotion ? 0.01 : 0.4; // Base duration for brutalist animations
    
    // Initial state for sections - let's make them come from the left slightly
    gsap.set('.section-content', { opacity: 0, x: -50 }); 
    
    const loadingTimeline = gsap.timeline({
      onComplete: () => {
        document.body.style.overflow = ''; // Allow scroll once loading is done
        setTimeout(() => ScrollTrigger.refresh(), 100); // Refresh ScrollTrigger after content is visible
      },
    });
    
    loadingTimeline
      .set('body', { overflow: 'hidden' })
      .to('.loading-overlay', {
        opacity: 0,
        duration: reduceMotion ? 0.01 : 0.3, // Keep loading overlay animation quick
        ease: 'power1.in',
      })
      .set('.loading-overlay', { display: 'none' });
      // Removed the global .section-content animation from here

    // Scroll-triggered animations for each section
    const sections = gsap.utils.toArray('.section-content');
    sections.forEach((section) => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section as gsap.DOMTarget,
          start: 'top 85%', // Trigger when 85% of the section is visible from the top
          end: 'bottom top', // Reset when the bottom of the section leaves the top of the viewport
          toggleActions: 'play none none none', // Play once on enter
          // markers: process.env.NODE_ENV === 'development', // Uncomment for debugging
        }
      });

      tl.to(section as gsap.DOMTarget, {
        opacity: 1,
        x: 0,
        duration: baseDuration,
        ease: 'expo.out', // Sharp ease for entry
      });
    });
    
    const cleanupCursor = setupCustomCursor();
    
    return () => {
      if (cleanupCursor) cleanupCursor();
      loadingTimeline.kill();
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      gsap.killTweensOf('.section-content'); // Kill any remaining tweens on sections
      
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };
  }, [setupCustomCursor, hasMounted]);

  return (
    <>
      <div className="loading-overlay fixed inset-0 bg-background z-[100] flex items-center justify-center">
        <div className="text-4xl font-['Anton'] uppercase tracking-wider">
          <span className="inline-block animate-pulse">LOADING</span>
        </div>
      </div>
      
      <Navigation />
      <main className="relative z-10">
        <Suspense fallback={null}>
          <div id="home" className="section-content"> {/* Assuming HeroSection is the 'home' section */}
            <HeroSection />
          </div>
        </Suspense>
        <div className="section-divider"></div>
        <Suspense fallback={null}>
          <div id="about" className="section-content">
            <AboutSection />
          </div>
        </Suspense>
        <div className="section-divider"></div>
        <Suspense fallback={null}>
          <div id="skills" className="section-content">
            <SkillsSection />
          </div>
        </Suspense>
        <div className="section-divider"></div>
        <Suspense fallback={null}>
          <div id="contact" className="section-content">
            <ContactSection />
          </div>
        </Suspense>
      </main>
    </>
  );
}
