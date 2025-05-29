'use client';

import { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@/utils/gsapUtils';
import { prefersReducedMotion } from '@/utils/deviceUtils';

const HeroSection = () => {
  const heroRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const buttonContainerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const title = titleRef.current;
    const subtitle = subtitleRef.current;
    const allButtonsNodeList = buttonContainerRef.current?.querySelectorAll('.brutalist-button');
    const decoElements = heroRef.current?.querySelectorAll('.hero-deco-element');

    if (!title || !subtitle || !allButtonsNodeList || allButtonsNodeList.length === 0) return;

    const tl = gsap.timeline({
      defaults: { 
        duration: prefersReducedMotion() ? 0.01 : 0.25,
        ease: 'expo.inOut',
      }
    });

    gsap.set(title, { opacity: 0, y: 50, rotationX: -30, scale: 0.9, transformOrigin: 'bottom center' });
    gsap.set(subtitle, { opacity: 0, x: -30 });
    gsap.set(allButtonsNodeList, { opacity: 0, scale: 0.5 });
    if (decoElements && decoElements.length > 0) {
      gsap.set(decoElements, { 
        opacity: 0, 
        scale: 0.3, 
        y: (i) => (i % 3 === 0 ? -60 : (i % 3 === 1 ? 60 : -40)), 
        x: (i) => (i % 3 === 0 ? -40 : (i % 3 === 1 ? 40 : 50)), 
        rotation: (i) => (i * 20 + (i % 2 === 0 ? -5 : 5))
      });
    }

    tl.to(title, { opacity: 1, y: 0, rotationX: 0, scale: 1 }, "+=0.1")
      .to(subtitle, { opacity: 1, x: 0 }, "-=0.15")
      .to(allButtonsNodeList, { opacity: 1, scale: 1, stagger: 0.08 }, "-=0.15");
    
    if (decoElements && decoElements.length > 0) {
      tl.to(decoElements, { 
        opacity: (i) => [0.75, 0.65, 0.3, 0.55, 0.45, 0.6][i],
        scale: 1, 
        y: 0,
        x: 0,
        rotation: (i) => [-12, 8, 5, -15, 10, -5][i],
        stagger: 0.07,
        duration: prefersReducedMotion() ? 0.01 : 0.4,
      }, "-=0.2");

      // Subtle Idle Animations for Decorative Elements
      if (!prefersReducedMotion()) {
        decoElements.forEach((el, i) => {
          gsap.to(el, {
            x: `+=${gsap.utils.random(-5, 5, 1)}px`,
            y: `+=${gsap.utils.random(-5, 5, 1)}px`,
            rotation: `+=${gsap.utils.random(-3, 3, 0.5)}`,
            duration: gsap.utils.random(10, 15),
            delay: tl.duration() + i * 0.5,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
          });
        });
      }
    }

  }, { scope: heroRef });

  return (
    <section 
      id="home" 
      ref={heroRef} 
      className="min-h-screen flex flex-col items-center justify-center text-center p-4 md:p-8 relative overflow-hidden noise-bg"
    >
      {/* Decorative Elements */}
      <div 
        aria-hidden="true"
        className="hero-deco-element absolute top-[15%] left-[8%] w-12 h-12 md:w-16 md:h-16 bg-accent" 
      />
      <div 
        aria-hidden="true"
        className="hero-deco-element absolute bottom-[10%] right-[10%] w-10 h-10 md:w-14 md:h-14 border-2 border-foreground"
      />
      <div
        aria-hidden="true"
        className="hero-deco-element absolute top-[50%] left-[15%] w-8 h-16 md:w-10 md:h-20 bg-foreground opacity-30"
      />
      {/* Additional Decorative Elements */}
      <div 
        aria-hidden="true"
        className="hero-deco-element absolute top-[20%] right-[15%] w-8 h-8 md:w-10 md:h-10 rounded-full bg-accent opacity-70"
      />
      <div 
        aria-hidden="true"
        className="hero-deco-element absolute bottom-[25%] left-[5%] w-20 h-1 md:w-28 md:h-1.5 bg-foreground"
      />
      <div 
        aria-hidden="true"
        className="hero-deco-element absolute top-[65%] right-[20%] w-8 h-8 md:w-10 md:h-10 border border-accent"
      />

      <div className="max-w-3xl z-10">
        <h1 
          ref={titleRef} 
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-display uppercase mb-4 md:mb-6 leading-none tracking-tighter"
        >
          RAW TALENT.
          <br />
          <span className="text-outline">BOLD VISION.</span>
        </h1>
        <p 
          ref={subtitleRef} 
          className="text-lg md:text-xl lg:text-2xl font-mono uppercase text-foreground mb-8 md:mb-12 tracking-wide"
        >
          Web Developer & UI/UX Designer Crafting Unconventional Experiences.
        </p>
        <div ref={buttonContainerRef} className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <a 
            href="/IOANNIS_LOUGIAKIS_CV.pdf" 
            className="brutalist-button text-base md:text-lg flex items-center justify-center leading-none"
            download
          >
            Download CV
          </a>
          <a 
            href="#contact" 
            className="brutalist-button brutalist-button--secondary text-base md:text-lg flex items-center justify-center leading-none"
          >
            Get In Touch
          </a>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;