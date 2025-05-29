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
  // State for client-side determined properties and mount status
  const [isMobile, setIsMobile] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);

  // Refs for custom cursor elements and animation
  const cursorRef = useRef<HTMLDivElement | null>(null);
  const cursorDotRef = useRef<HTMLDivElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const mousePositionRef = useRef({ x: 0, y: 0 });
  const cursorPositionRef = useRef({ x: 0, y: 0 });

  // Effect to determine client-side properties once component has mounted
  useEffect(() => {
    setIsMobile(isMobileDevice());
    setReduceMotion(prefersReducedMotion());
    setHasMounted(true);
  }, []);

  // --- Custom Cursor Logic ---

  // Callback to handle mouse movement for cursor positioning
  const handleMouseMove = useCallback((e: MouseEvent) => {
    mousePositionRef.current = { x: e.clientX, y: e.clientY };
    if (cursorDotRef.current) {
      // Dot cursor follows mouse directly
      cursorDotRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    }
  }, []);

  // Callback for the cursor's easing animation loop
  const animateCursor = useCallback(() => {
    if (!cursorRef.current) {
      // Stop animation loop if main cursor element is not present
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      return;
    }
    
    const diffX = mousePositionRef.current.x - cursorPositionRef.current.x;
    const diffY = mousePositionRef.current.y - cursorPositionRef.current.y;
    const easingFactor = 0.3; // Adjust for desired smoothness
    
    cursorPositionRef.current.x += diffX * easingFactor;
    cursorPositionRef.current.y += diffY * easingFactor;
    
    cursorRef.current.style.transform = `translate(${cursorPositionRef.current.x}px, ${cursorPositionRef.current.y}px)`;
    
    animationFrameRef.current = requestAnimationFrame(animateCursor);
  }, []);

  // Effect to setup and manage the custom cursor
  useEffect(() => {
    // Conditions to disable custom cursor: not mounted, mobile device, or prefers reduced motion
    if (!hasMounted || isMobile || reduceMotion) {
      // Cleanup function (from previous effect run if any) will handle removal of elements/listeners.
      // No setup needed if conditions aren't met.
      return;
    }

    // Create main cursor element
    const cursorElement = document.createElement('div');
    cursorElement.classList.add('cursor');
    // Basic styles (consider moving to CSS for easier maintenance)
    Object.assign(cursorElement.style, {
      position: 'fixed',
      pointerEvents: 'none',
      zIndex: '9999',
      opacity: '0', // Start hidden, fade in on mouseenter
    });
    document.body.appendChild(cursorElement);
    cursorRef.current = cursorElement;

    // Create cursor dot element
    const dotElement = document.createElement('div');
    dotElement.classList.add('cursor-dot');
    Object.assign(dotElement.style, {
      position: 'fixed',
      pointerEvents: 'none',
      zIndex: '10000',
      opacity: '0',
    });
    document.body.appendChild(dotElement);
    cursorDotRef.current = dotElement;
    
    // Event listener callbacks
    const onMouseMoveListener = (e: MouseEvent) => handleMouseMove(e);
    const onMouseLeaveListener = () => {
      if (cursorRef.current) cursorRef.current.style.opacity = '0';
      if (cursorDotRef.current) cursorDotRef.current.style.opacity = '0';
    };
    const onMouseEnterListener = () => {
      if (cursorRef.current) cursorRef.current.style.opacity = '1';
      if (cursorDotRef.current) cursorDotRef.current.style.opacity = '1';
    };

    const handleMouseOverInteractiveListener = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!cursorRef.current) return;

      const isInteractive = target.closest('a, button, .interactive, .brutalist-button, .brutalist-card');
      const animProps = { duration: 0.05, ease: 'none' }; // Fast, sharp animation

      if (isInteractive) {
        cursorRef.current.classList.add('cursor-active');
        const isBrutalistButton = target.closest('.brutalist-button');
        if (isBrutalistButton) {
          gsap.to(cursorRef.current, { ...animProps, width: '50px', height: '50px', backgroundColor: 'var(--color-accent)', opacity: 0.7 });
        } else {
          gsap.to(cursorRef.current, { ...animProps, width: '30px', height: '30px', backgroundColor: 'var(--color-foreground)', opacity: 0.5 });
        }
      } else {
        cursorRef.current.classList.remove('cursor-active');
        gsap.to(cursorRef.current, { ...animProps, width: '10px', height: '10px', backgroundColor: 'var(--color-foreground)', opacity: 1 });
      }
    };

    // Add event listeners
    document.addEventListener('mousemove', onMouseMoveListener, { passive: true });
    document.addEventListener('mouseleave', onMouseLeaveListener);
    document.addEventListener('mouseenter', onMouseEnterListener);
    document.body.addEventListener('mouseover', handleMouseOverInteractiveListener, { passive: true });

    // Start cursor animation loop
    animationFrameRef.current = requestAnimationFrame(animateCursor);

    // Cleanup function for this effect
    return () => {
      document.removeEventListener('mousemove', onMouseMoveListener);
      document.removeEventListener('mouseleave', onMouseLeaveListener);
      document.removeEventListener('mouseenter', onMouseEnterListener);
      document.body.removeEventListener('mouseover', handleMouseOverInteractiveListener);

      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }

      // Kill GSAP tweens before removing elements
      if (cursorRef.current) {
        gsap.killTweensOf(cursorRef.current);
      }
      // No GSAP tweens on cursorDotRef.current directly, so no kill needed for it.

      if (cursorRef.current?.parentNode) {
        cursorRef.current.parentNode.removeChild(cursorRef.current);
      }
      cursorRef.current = null;
      
      if (cursorDotRef.current?.parentNode) {
        cursorDotRef.current.parentNode.removeChild(cursorDotRef.current);
      }
      cursorDotRef.current = null;
    };
  }, [hasMounted, isMobile, reduceMotion, handleMouseMove, animateCursor]);


  // --- Page Load and Scroll Animations Logic ---
  useEffect(() => {
    if (!hasMounted) return; // Wait for mount and client-side flags

    ScrollTrigger.config({
      ignoreMobileResize: true, // Performance optimization for mobile
      autoRefreshEvents: 'visibilitychange,DOMContentLoaded,load,resize', // Events that trigger ScrollTrigger refresh
    });
    
    const baseAnimationDuration = reduceMotion ? 0.01 : 0.4; // Adjust base duration for animations
    
    // Initial state for sections (before animation)
    gsap.set('.section-content', { opacity: 0, x: -50 }); 
    
    // Loading overlay animation
    const loadingTimeline = gsap.timeline({
      onComplete: () => {
        document.body.style.overflow = ''; // Restore scrolling
        // Refresh ScrollTrigger after a short delay to ensure layout is stable
        setTimeout(() => ScrollTrigger.refresh(), 100); 
      },
    });
    
    loadingTimeline
      .set('body', { overflow: 'hidden' }) // Prevent scroll during loading
      .to('.loading-overlay', {
        opacity: 0,
        duration: reduceMotion ? 0.01 : 0.3,
        ease: 'power1.in',
      })
      .set('.loading-overlay', { display: 'none' }); // Hide overlay after animation

    // Scroll-triggered animations for each content section
    const sections = gsap.utils.toArray<HTMLElement>('.section-content');
    sections.forEach((section) => {
      const sectionTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top 85%', // Trigger when section is 85% from top of viewport
          end: 'bottom top',
          toggleActions: 'play none none none', // Play animation once on enter
          // markers: process.env.NODE_ENV === 'development', // Uncomment for debugging
        }
      });

      sectionTimeline.to(section, {
        opacity: 1,
        x: 0,
        duration: baseAnimationDuration,
        ease: 'expo.out',
      });
    });
    
    // Cleanup function for page animations
    return () => {
      loadingTimeline.kill(); // Kill loading animation timeline
      ScrollTrigger.getAll().forEach(trigger => trigger.kill()); // Kill all ScrollTriggers
      gsap.killTweensOf('.section-content'); // Kill any ongoing tweens on sections
    };
  }, [hasMounted, reduceMotion]); // Dependencies for page animations

  // Component Rendering
  return (
    <>
      {/* Loading Overlay */}
      <div className="loading-overlay fixed inset-0 bg-background z-[100] flex items-center justify-center">
        <div className="text-4xl font-['Anton'] uppercase tracking-wider">
          <span className="inline-block animate-pulse">LOADING</span>
        </div>
      </div>
      
      <Navigation />
      
      <main className="relative z-10">
        {/* Sections with Lazy Loading and Suspense */}
        <Suspense fallback={null}>
          <div id="home" className="section-content">
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
