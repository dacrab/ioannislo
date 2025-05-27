import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { useGSAP } from '@gsap/react';
import { prefersReducedMotion } from './deviceUtils';

let pluginsRegistered = false;

export const registerGSAPPlugins = () => {
  if (typeof window === 'undefined' || pluginsRegistered) return;

  gsap.registerPlugin(
    ScrollTrigger,
    ScrollToPlugin,
    useGSAP
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
  targetId: string,
  duration: number = 0.15,
  offset: number = 0
) => {
  if (typeof window === 'undefined') return;
  
  const targetElement = document.getElementById(targetId.replace('#', ''));
  if (!targetElement) {
    console.warn(`scrollToElement: Target '${targetId}' not found.`);
    return;
  }

  let finalDuration = duration;
  let finalEase = 'expo.out';

  if (prefersReducedMotion()) {
    finalDuration = 0.01;
    finalEase = 'none';
  }

  gsap.to(window, {
    duration: finalDuration,
    scrollTo: {
      y: targetElement,
      offsetY: offset,
      autoKill: true
    },
    ease: finalEase
  });
};