'use client';

import { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@/utils/gsapUtils';
import { prefersReducedMotion } from '@/utils/deviceUtils';
import { SplitText } from 'gsap/SplitText';

const HeroSection = () => {
  const heroRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const buttonContainerRef = useRef<HTMLDivElement>(null);
  const glitchLayersRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const title = titleRef.current;
    const subtitle = subtitleRef.current;
    const allButtonsNodeList = buttonContainerRef.current?.querySelectorAll('.brutalist-button');
    const decoElements = heroRef.current?.querySelectorAll('.hero-deco-element');
    const glitchLayers = glitchLayersRef.current?.querySelectorAll('.glitch-layer');

    if (!title || !subtitle || !allButtonsNodeList || allButtonsNodeList.length === 0) return;

    gsap.registerPlugin(SplitText);

    // Split text for animation
    const splitTitle = new SplitText(title, { type: "chars,words" });
    const splitSubtitle = new SplitText(subtitle, { type: "chars,words" });

    const tl = gsap.timeline({
      defaults: { 
        duration: prefersReducedMotion() ? 0.01 : 0.25,
        ease: "power4.out",
      }
    });

    // Initial states
    gsap.set(splitTitle.chars, { opacity: 0, y: 100, rotationX: -90 });
    gsap.set(splitSubtitle.chars, { opacity: 0, y: 50 });
    gsap.set(allButtonsNodeList, { opacity: 0, scale: 0.5 });
    if (decoElements) {
      gsap.set(decoElements, { 
        opacity: 0, 
        scale: 0,
        rotation: (i) => i * 45
      });
    }

    // Glitch effect setup
    if (glitchLayers) {
      gsap.set(glitchLayers, { opacity: 0, x: 0 });
    }

    // Main animation sequence
    tl.to(splitTitle.chars, {
      opacity: 1,
      y: 0,
      rotationX: 0,
      duration: 0.8,
      stagger: 0.02,
      ease: "back.out(1.2)",
    })
    .to(splitSubtitle.chars, {
      opacity: 1,
      y: 0,
      duration: 0.4,
      stagger: 0.01,
      ease: "power2.out",
    }, "-=0.4")
    .to(allButtonsNodeList, {
      opacity: 1,
      scale: 1,
      duration: 0.6,
      stagger: 0.1,
      ease: "back.out(1.5)",
    }, "-=0.2");

    if (decoElements) {
      tl.to(decoElements, {
        opacity: 1,
        scale: 1,
        rotation: 0,
        duration: 0.8,
        stagger: 0.05,
        ease: "elastic.out(1, 0.3)",
      }, "-=0.4");
    }

    // Glitch animation
    if (glitchLayers) {
      const glitchTL = gsap.timeline({
        repeat: -1,
        repeatDelay: 5,
      });

      glitchLayers.forEach((layer, i) => {
        glitchTL.to(layer, {
          opacity: 0.1,
          x: gsap.utils.random(-10, 10),
          duration: 0.1,
          ease: "none",
        }, i * 0.02)
        .to(layer, {
          opacity: 0,
          x: 0,
          duration: 0.1,
          ease: "none",
        });
      });
    }

    // Decorative elements hover animation
    if (decoElements && !prefersReducedMotion()) {
      decoElements.forEach((el) => {
        el.addEventListener('mouseenter', () => {
          gsap.to(el, {
            scale: 1.2,
            rotation: gsap.utils.random(-45, 45),
            duration: 0.3,
            ease: "power2.out",
          });
        });

        el.addEventListener('mouseleave', () => {
          gsap.to(el, {
            scale: 1,
            rotation: 0,
            duration: 0.6,
            ease: "elastic.out(1, 0.3)",
          });
        });
      });
    }

  }, { scope: heroRef });

  return (
    <section 
      id="home" 
      ref={heroRef} 
      className="min-h-screen flex flex-col items-center justify-center text-center p-4 md:p-8 relative overflow-hidden noise-bg"
    >
      {/* Glitch Layers */}
      <div ref={glitchLayersRef} className="absolute inset-0 pointer-events-none">
        <div className="glitch-layer absolute inset-0 bg-accent opacity-0" style={{ mixBlendMode: 'multiply' }} />
        <div className="glitch-layer absolute inset-0 bg-foreground opacity-0" style={{ mixBlendMode: 'overlay' }} />
        <div className="glitch-layer absolute inset-0 bg-background opacity-0" style={{ mixBlendMode: 'screen' }} />
      </div>

      {/* Decorative Elements with enhanced positioning */}
      <div 
        aria-hidden="true"
        className="hero-deco-element absolute top-[15%] left-[8%] w-16 h-16 md:w-24 md:h-24 bg-accent mix-blend-multiply" 
      />
      <div 
        aria-hidden="true"
        className="hero-deco-element absolute bottom-[10%] right-[10%] w-12 h-12 md:w-20 md:h-20 border-4 border-foreground"
      />
      <div
        aria-hidden="true"
        className="hero-deco-element absolute top-[50%] left-[15%] w-8 h-32 md:w-12 md:h-48 bg-foreground opacity-30 skew-x-12"
      />
      <div 
        aria-hidden="true"
        className="hero-deco-element absolute top-[20%] right-[15%] w-12 h-12 md:w-16 md:h-16 rounded-full bg-accent opacity-70"
      />
      <div 
        aria-hidden="true"
        className="hero-deco-element absolute bottom-[25%] left-[5%] w-32 h-2 md:w-48 md:h-3 bg-foreground transform -rotate-12"
      />
      <div 
        aria-hidden="true"
        className="hero-deco-element absolute top-[65%] right-[20%] w-12 h-12 md:w-16 md:h-16 border-2 border-accent transform rotate-45"
      />

      <div className="max-w-4xl z-10">
        <h1 
          ref={titleRef} 
          className="brutalist-heading mb-4 md:mb-6"
          data-text="RAW TALENT. BOLD VISION."
        >
          RAW TALENT.
          <br />
          <span className="text-outline text-glitch" data-text="BOLD VISION.">BOLD VISION.</span>
        </h1>
        <p 
          ref={subtitleRef} 
          className="text-lg md:text-2xl font-mono uppercase text-foreground mb-8 md:mb-12 tracking-wide"
        >
          Web Developer & UI/UX Designer Crafting Unconventional Experiences.
        </p>
        <div ref={buttonContainerRef} className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6">
          <a 
            href="/IOANNIS_LOUGIAKIS_CV.pdf" 
            className="brutalist-button text-base md:text-lg flex items-center justify-center leading-none w-64 sm:w-auto"
            download
          >
            Download CV
          </a>
          <a 
            href="#contact" 
            className="brutalist-button text-base md:text-lg flex items-center justify-center leading-none w-64 sm:w-auto bg-transparent hover:bg-accent text-foreground hover:text-background border-foreground hover:border-accent"
          >
            Get In Touch
          </a>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center">
        <span className="font-mono text-sm uppercase tracking-widest mb-2">Scroll</span>
        <div className="w-0.5 h-16 bg-foreground relative">
          <div className="absolute w-full h-1/3 bg-accent animate-[scrollDown_2s_ease-in-out_infinite]" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;