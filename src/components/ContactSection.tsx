'use client';

import { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@/utils/gsapUtils';
import { prefersReducedMotion } from '@/utils/deviceUtils';

// Define SVG icon components directly for simplicity and brutalist styling control
const EmailIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
  </svg>
);

const PhoneIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
  </svg>
);

const LocationIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
  </svg>
);

const DownloadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
  </svg>
);

const ContactSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const titleTextRef = useRef<HTMLSpanElement>(null);
  const titleDotRef = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger);

    const titleText = titleTextRef.current;
    const titleDot = titleDotRef.current;
    const revealItems: Element[] = gsap.utils.toArray(sectionRef.current?.querySelectorAll('.brutalist-reveal-item') || []);
    const innerRevealItems: Element[] = gsap.utils.toArray(sectionRef.current?.querySelectorAll('.contact-inner-reveal') || []);

    const reduceMotion = prefersReducedMotion();
    const baseDuration = reduceMotion ? 0.01 : 0.3;
    const brutalEase = 'expo.out';

    // Animate main title "CONTACT."
    if (titleText && titleDot) {
      gsap.set(titleText, { opacity: 0, x: -30 });
      gsap.set(titleDot, { opacity: 0, scale: 0 });

      // Ensure this trigger is distinct if title is inside a .brutalist-reveal-item
      gsap.timeline({ 
        scrollTrigger: {
          trigger: titleRef.current, 
          start: 'top 85%', 
          toggleActions: 'play none none none',
        }
      })
      .to(titleText, { opacity: 1, x: 0, duration: baseDuration * 1.5, ease: brutalEase })
      .to(titleDot, { opacity: 1, scale: 1, duration: baseDuration, ease: brutalEase }, "-=0.1");
    }

    // Stagger animation for main .brutalist-reveal-item blocks (e.g., main content area, footer)
    if (revealItems.length > 0) {
      gsap.set(revealItems, { opacity: 0, y: 25 });
      ScrollTrigger.batch(revealItems, {
        start: 'top 90%',
        onEnter: batch => 
          gsap.to(batch, {
            opacity: 1,
            y: 0,
            duration: baseDuration * 1.2,
            ease: brutalEase,
            stagger: 0.1,
            overwrite: true
          }),
        onLeaveBack: batch => 
          gsap.set(batch, { opacity: 0, y: 25, overwrite: true }), 
      });
    }

    // Stagger animation for inner elements within the main contact content block
    if (innerRevealItems.length > 0) {
        gsap.set(innerRevealItems, { opacity: 0, scale: 0.9 });
        ScrollTrigger.batch(innerRevealItems, {
            start: 'top 90%', // Start when the top of an inner item is 90% from top of viewport
            onEnter: batch => {
                gsap.to(batch, {
                    opacity: 1,
                    scale: 1,
                    duration: baseDuration,
                    ease: brutalEase,
                    stagger: 0.1,
                    overwrite: true
                });
            },
            onLeaveBack: batch => {
                gsap.set(batch, { opacity: 0, scale: 0.9, overwrite: true });
            },
        });
    }

  }, { scope: sectionRef });

  const socialLinks = [
    { name: 'Twitter', url: 'https://x.com/yourprofile', iconPath: 'M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84' },
    { name: 'GitHub', url: 'https://github.com/yourprofile', iconPath: 'M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z' },
    { name: 'LinkedIn', url: 'https://linkedin.com/in/yourprofile', iconPath: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z' },
  ];

  const contactItems = [
    { type: 'Email', value: 'hello@example.com', href: 'mailto:hello@example.com', Icon: EmailIcon },
    { type: 'Phone', value: '+1 (234) 567-890', href: 'tel:+1234567890', Icon: PhoneIcon },
    { type: 'Location', value: 'New York, NY', Icon: LocationIcon }, // No href for location
  ];
  
  return (
    <section ref={sectionRef} id="contact" className="py-16 md:py-24 relative overflow-hidden bg-background text-foreground">
      <div className="container mx-auto px-4 relative z-10">
        <h2 
          ref={titleRef}
          className="font-display text-4xl sm:text-5xl md:text-6xl uppercase mb-10 md:mb-16 tracking-tight text-center"
        >
          <span ref={titleTextRef}>CONTACT</span><span ref={titleDotRef} className="text-accent">.</span>
        </h2>
        
        <div className="max-w-3xl mx-auto brutalist-reveal-item">
          <div className="brutalist-card p-6 md:p-8 mb-10 md:mb-12 contact-inner-reveal">
            <h3 className="font-display text-2xl md:text-3xl uppercase text-accent mb-6 text-center sm:text-left">
              Get In Touch
            </h3>
            <div className="space-y-6">
              {contactItems.map(({ type, value, href, Icon }) => (
                <div key={type} className="flex flex-col sm:flex-row items-start sm:items-center">
                  <div className="flex items-center mb-2 sm:mb-0 sm:mr-4">
                    <Icon />
                    <p className="font-mono text-sm uppercase ml-3 text-muted">{type}</p>
                  </div>
                  {href ? (
                    <a href={href} className="font-mono text-base md:text-lg break-all">{value}</a>
                  ) : (
                    <p className="font-mono text-base md:text-lg break-all">{value}</p>
                  )}
                </div>
              ))}
              <div className="pt-4">
                <a 
                  href="/IOANNIS_LOUGIAKIS_CV.pdf" // Replace with your actual CV path
                  download="IOANNIS_LOUGIAKIS_CV.pdf"      // Replace with your CV filename
                  className="brutalist-button w-full flex items-center justify-center gap-2 group"
                >
                  <DownloadIcon />
                  DOWNLOAD CV
                </a>
              </div>
            </div>
          </div>

          <div className="brutalist-card p-6 md:p-8 mb-10 md:mb-12 text-center contact-inner-reveal">
            <h3 className="font-display text-2xl md:text-3xl uppercase text-accent mb-6">
              Let&apos;s Work Together
            </h3>
            <p className="font-mono text-base md:text-lg mb-6 max-w-xl mx-auto">
              I&apos;m currently available for freelance work and collaborations. 
              If you have a project that needs creative solutions, let&apos;s talk!
            </p>
            <a href="mailto:hello@example.com" className="brutalist-button inline-flex items-center gap-2 group">
              <EmailIcon />
              SAY HELLO
            </a>
          </div>
          
          <div className="text-center contact-inner-reveal">
            <h3 className="font-display text-2xl md:text-3xl uppercase text-accent mb-6">
              Connect
            </h3>
            <div className="flex flex-wrap justify-center items-center gap-4">
              {socialLinks.map((social) => (
                <a 
                  key={social.name}
                  href={social.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  title={social.name}
                  className="brutalist-border bg-[var(--color-subtle-bg)] p-3 hover:bg-foreground hover:text-background transition-colors duration-100 group"
                >
                  <svg className="w-6 h-6 text-foreground group-hover:text-background transition-colors duration-100" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d={social.iconPath}></path>
                  </svg>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <footer className="mt-16 md:mt-24 pt-8 md:pt-12 border-t-2 border-foreground brutalist-reveal-item">
        <div className="container mx-auto px-4 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="font-mono text-lg font-bold uppercase">
              BRUTALIST<span className="text-accent">·</span>PORTFOLIO
            </p>
            <p className="font-mono text-xs text-muted">&copy; {new Date().getFullYear()} ALL RIGHTS RESERVED.</p>
          </div>
        </div>
      </footer>
    </section>
  );
};

export default ContactSection;