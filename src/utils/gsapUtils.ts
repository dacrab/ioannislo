import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { useGSAP } from '@gsap/react';
import { prefersReducedMotion } from './deviceUtils';

let pluginsRegistered = false;

export const registerGSAPPlugins = () => {
  if (typeof window === 'undefined' || pluginsRegistered) return;

  gsap.registerPlugin(
    ScrollTrigger,
    ScrollToPlugin,
    useGSAP,
    SplitText
  );
  
  if (prefersReducedMotion()) {
    gsap.defaults({ duration: 0.01, ease: 'none' });
  }
  
  pluginsRegistered = true;
};

export { useGSAP };

export const cleanupGSAPAnimations = (
  context?: gsap.Context | null,
  element?: Element | null
) => {
  if (context) {
    context.revert();
    return;
  }

  if (element) {
    ScrollTrigger.getAll()
      .filter(trigger => trigger.vars.trigger === element || element.contains(trigger.vars.trigger as Node))
      .forEach(trigger => trigger.kill());
    gsap.killTweensOf([element, element.querySelectorAll('*')]);
  }
};

export const scrollToElement = (
  elementId: string, 
  duration: number = 1, 
  offset: number = 0
) => {
  const element = document.getElementById(elementId);
  if (!element) return;

  const reduceMotion = prefersReducedMotion();
  
  gsap.to(window, {
    duration: reduceMotion ? 0 : duration,
    scrollTo: {
      y: element,
      offsetY: offset,
      autoKill: false
    },
    ease: 'power3.inOut'
  });
};

// Enhanced reveal animation for sections
export const revealSection = (element: Element, delay: number = 0) => {
  const reduceMotion = prefersReducedMotion();
  
  if (reduceMotion) {
    gsap.set(element, { opacity: 1, y: 0 });
    return;
  }

  gsap.fromTo(element,
    { 
      opacity: 0, 
      y: 50,
      skewY: 2
    },
    {
      opacity: 1,
      y: 0,
      skewY: 0,
      duration: 1,
      delay,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: element,
        start: 'top 85%',
        end: 'bottom 15%',
        toggleActions: 'play none none reverse'
      }
    }
  );
};

// Text reveal animation with SplitText
export const revealText = (element: Element, delay: number = 0) => {
  const reduceMotion = prefersReducedMotion();
  
  if (reduceMotion) {
    gsap.set(element, { opacity: 1 });
    return;
  }

  const split = new SplitText(element, { type: 'chars,words,lines' });
  
  gsap.from(split.chars, {
    opacity: 0,
    y: 50,
    rotationX: -90,
    stagger: 0.02,
    duration: 0.8,
    delay,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: element,
      start: 'top 85%',
      end: 'bottom 15%',
      toggleActions: 'play none none reverse'
    }
  });
};

// Glitch effect animation
export const glitchEffect = (element: Element, intensity: number = 1) => {
  const reduceMotion = prefersReducedMotion();
  
  if (reduceMotion) return;

  const tl = gsap.timeline({
    repeat: -1,
    repeatDelay: 5
  });

  for (let i = 0; i < 3; i++) {
    tl.to(element, {
      skewX: gsap.utils.random(-10, 10) * intensity,
      skewY: gsap.utils.random(-5, 5) * intensity,
      x: gsap.utils.random(-5, 5) * intensity,
      y: gsap.utils.random(-5, 5) * intensity,
      opacity: gsap.utils.random(0.8, 1),
      duration: 0.1,
      ease: 'none'
    })
    .to(element, {
      skewX: 0,
      skewY: 0,
      x: 0,
      y: 0,
      opacity: 1,
      duration: 0.1,
      ease: 'none'
    });
  }
};

// Brutalist hover effect
export const brutalistHover = (element: Element) => {
  const reduceMotion = prefersReducedMotion();
  
  if (reduceMotion) return;

  element.addEventListener('mouseenter', () => {
    gsap.to(element, {
      scale: 1.05,
      rotation: gsap.utils.random(-2, 2),
      duration: 0.2,
      ease: 'power2.out'
    });
  });

  element.addEventListener('mouseleave', () => {
    gsap.to(element, {
      scale: 1,
      rotation: 0,
      duration: 0.3,
      ease: 'elastic.out(1, 0.3)'
    });
  });
};