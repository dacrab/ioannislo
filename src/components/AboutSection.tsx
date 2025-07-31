'use client';

import { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@/utils/gsapUtils';
import { prefersReducedMotion } from '@/utils/deviceUtils';

const AboutSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const titleTextRef = useRef<HTMLSpanElement>(null);
  const titleDotRef = useRef<HTMLSpanElement>(null);
  const statsTitleRef = useRef<HTMLHeadingElement>(null);
  const experienceTitleRef = useRef<HTMLHeadingElement>(null);
  const statValueRefs = useRef<(HTMLParagraphElement | null)[]>(new Array(4).fill(null));
  const reduceMotion = prefersReducedMotion();

  const stats = [
    { label: 'Years Experience', value: '5+' },
    { label: 'Projects Completed', value: '42' },
    { label: 'Happy Clients', value: '12' },
    { label: 'Technologies Mastered', value: '15' },
  ];

  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger);

    const titleText = titleTextRef.current;
    const titleDot = titleDotRef.current;
    const revealItems: Element[] = gsap.utils.toArray(sectionRef.current?.querySelectorAll('.brutalist-reveal-item') || []);
    const statsTitle = statsTitleRef.current;
    const experienceTitle = experienceTitleRef.current;

    const baseDuration = reduceMotion ? 0.01 : 0.3;
    const counterDuration = reduceMotion ? 0.01 : 1.5;
    const brutalEase = 'expo.out';

    if (titleText && titleDot) {
      gsap.set(titleText, { opacity: 0, x: -30, skewX: 20 });
      gsap.set(titleDot, { opacity: 0, scale: 0, rotation: 180 });

      gsap.timeline({ 
        scrollTrigger: {
          trigger: titleRef.current,
          start: 'top 85%',
          toggleActions: 'play none none none',
        }
      })
      .to(titleText, { 
        opacity: 1, 
        x: 0, 
        skewX: 0,
        duration: baseDuration * 1.5, 
        ease: brutalEase 
      })
      .to(titleDot, { 
        opacity: 1, 
        scale: 1, 
        rotation: 0,
        duration: baseDuration, 
        ease: brutalEase 
      }, "-=0.1");
    }

    if (statsTitle) {
      gsap.set(statsTitle, { opacity: 0, y: 20, skewX: -10 });
      gsap.to(statsTitle, {
        opacity: 1,
        y: 0,
        skewX: 0,
        duration: baseDuration,
        ease: brutalEase,
        scrollTrigger: {
          trigger: statsTitle,
          start: 'top 90%',
          toggleActions: 'play none none none',
        }
      });
    }

    // Stats Counter Animation with Glitch Effect
    statValueRefs.current.forEach((statEl, index) => {
      if (!statEl) return;

      const statData = stats[index];
      const rawValue = statData.value;
      const numMatch = rawValue.match(/(\d+)/);
      const suffix = rawValue.replace(/\d+/, '') || '';
      
      if (numMatch) {
        const endValue = parseInt(numMatch[1], 10);
        const counter = { val: reduceMotion ? endValue : 0 };

        statEl.textContent = reduceMotion ? rawValue : (`0${suffix}`);

        if (!reduceMotion) {
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: statEl,
              start: 'top 90%',
              toggleActions: 'play none none none',
              once: true,
            }
          });

          // Counter animation
          tl.to(counter, {
            val: endValue,
            duration: counterDuration,
            ease: 'power2.out',
            onUpdate: () => {
              statEl.textContent = Math.ceil(counter.val) + suffix;
            }
          });

          // Add glitch effect at completion
          tl.add(() => {
            gsap.to(statEl, {
              skewX: 20,
              duration: 0.1,
              repeat: 3,
              yoyo: true,
              ease: 'none',
              onComplete: () => {
                statEl.textContent = rawValue;
              }
            });
          });
        }
      } else {
        statEl.textContent = rawValue;
      }
    });

    if (experienceTitle) {
      gsap.set(experienceTitle, { opacity: 0, y: 20, skewX: 10 });
      gsap.to(experienceTitle, {
        opacity: 1,
        y: 0,
        skewX: 0,
        duration: baseDuration,
        ease: brutalEase,
        scrollTrigger: {
          trigger: experienceTitle,
          start: 'top 90%',
          toggleActions: 'play none none none',
        }
      });
    }

    if (revealItems.length > 0) {
      gsap.set(revealItems, { opacity: 0, y: 25, skewY: 5 });
      ScrollTrigger.batch(revealItems, {
        start: 'top 90%',
        onEnter: batch => 
          gsap.to(batch, {
            opacity: 1,
            y: 0,
            skewY: 0,
            duration: baseDuration * 1.2,
            ease: brutalEase,
            stagger: 0.1,
            overwrite: true
          }),
        onLeaveBack: batch => 
          gsap.set(batch, { opacity: 0, y: 25, skewY: 5, overwrite: true }), 
      });
    }

  }, { scope: sectionRef });

  const experienceItems = [
    {
      year: '2023-PRESENT',
      position: 'Senior Frontend Developer',
      company: 'Digital Brutalism Inc.',
      description: 'Leading the frontend development team in creating cutting-edge web applications with modern technologies.'
    },
    {
      year: '2020-2023',
      position: 'UI/UX Developer',
      company: 'Creative Solutions Ltd.',
      description: 'Designed and developed interactive user interfaces for clients across various industries.'
    },
    {
      year: '2018-2020',
      position: 'Web Developer',
      company: 'Tech Innovations',
      description: 'Worked on responsive web applications and e-commerce platforms using React and Next.js.'
    }
  ];

  return (
    <section ref={sectionRef} id="about" className="py-16 md:py-24 relative overflow-hidden bg-background text-foreground">
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-left">
          <h2 
            ref={titleRef}
            className="font-display text-4xl sm:text-5xl md:text-6xl uppercase mb-8 md:mb-12 tracking-tight"
          >
            <span ref={titleTextRef} className="inline-block">ABOUT</span>
            <span ref={titleDotRef} className="text-accent inline-block">.</span>
          </h2>
          
          <div className="space-y-4 md:space-y-6 text-base md:text-lg font-mono mb-12 md:mb-16 brutalist-reveal-item">
            <p className="relative group">
              I&apos;m a creative developer and designer specializing in 
              <strong className="text-accent font-bold relative inline-block group-hover:skew-x-12 transition-transform duration-300"> brutalist web design </strong> 
              and 
              <strong className="text-accent font-bold relative inline-block group-hover:-skew-x-12 transition-transform duration-300"> interactive digital experiences</strong>.
            </p>
            <p className="relative group">
              My work combines 
              <strong className="text-accent font-bold relative inline-block group-hover:translate-x-1 transition-transform duration-300"> raw aesthetics </strong> 
              with 
              <strong className="text-accent font-bold relative inline-block group-hover:-translate-x-1 transition-transform duration-300"> modern technologies </strong> 
              to create bold, functional, and memorable web applications that stand out from the conventional.
            </p>
            <p className="relative group">
              With expertise in 
              <strong className="text-accent font-bold relative inline-block group-hover:scale-110 transition-transform duration-300"> React</strong>, 
              <strong className="text-accent font-bold relative inline-block group-hover:scale-110 transition-transform duration-300"> Next.js</strong>, 
              <strong className="text-accent font-bold relative inline-block group-hover:scale-110 transition-transform duration-300"> TypeScript</strong>, 
              and 
              <strong className="text-accent font-bold relative inline-block group-hover:scale-110 transition-transform duration-300"> GSAP animations</strong>, 
              I build performant and visually striking interfaces that push creative boundaries while maintaining accessibility and usability.
            </p>
          </div>

          <div className="mb-12 md:mb-16 brutalist-reveal-item">
            <h3 
              ref={statsTitleRef}
              className="font-display text-3xl md:text-4xl uppercase mb-6 md:mb-8 tracking-tight relative"
            >
              STATS<span className="text-accent relative inline-block">.</span>
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-2 gap-4 md:gap-6">
              {stats.map((stat, index) => (
                <div 
                  key={index} 
                  className="brutalist-border bg-[var(--color-subtle-bg)] p-4 md:p-6 text-center group relative overflow-hidden hover:shadow-brutal transition-shadow duration-300"
                >
                  <span className="absolute inset-0 bg-accent/10 transform -skew-x-12 translate-x-full transition-transform duration-500 ease-out group-hover:translate-x-0"></span>
                  <p 
                    ref={el => { statValueRefs.current[index] = el; }}
                    className="font-display text-4xl md:text-5xl text-accent mb-1 relative z-10 transform group-hover:scale-110 transition-transform duration-300"
                  >
                    {reduceMotion ? stat.value : `0${stat.value.replace(/\d+/, '') || ''}`}
                  </p>
                  <p className="font-mono text-xs md:text-sm uppercase tracking-wider text-muted relative z-10">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-12 md:mb-16 brutalist-reveal-item">
            <h3 
              ref={experienceTitleRef}
              className="font-display text-3xl md:text-4xl uppercase mb-6 md:mb-8 tracking-tight"
            >
              EXPERIENCE<span className="text-accent">.</span>
            </h3>
            <div className="space-y-6 md:space-y-8">
              {experienceItems.map((item, index) => (
                <div 
                  key={index} 
                  className="brutalist-card p-4 md:p-6 group relative overflow-hidden hover:shadow-brutal transition-shadow duration-300"
                >
                  <span className="absolute inset-0 bg-accent/10 transform skew-x-12 -translate-x-full transition-transform duration-500 ease-out group-hover:translate-x-0"></span>
                  <div className="relative z-10">
                    <p className="font-mono text-xs text-muted uppercase tracking-wider mb-1">{item.year}</p>
                    <h4 className="font-display text-xl md:text-2xl uppercase text-accent mb-1 transform group-hover:translate-x-1 transition-transform duration-300">{item.position}</h4>
                    <p className="font-mono text-sm md:text-base font-bold mb-2">{item.company}</p>
                    <p className="font-mono text-sm">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 brutalist-reveal-item">
            <a 
              href="#skills" 
              className="brutalist-button w-full sm:w-auto text-center group relative overflow-hidden"
            >
              <span className="absolute inset-0 bg-accent/20 transform -skew-x-12 translate-x-full transition-transform duration-300 ease-out group-hover:translate-x-0"></span>
              <span className="relative z-10">MY SKILLS</span>
            </a>
            <a 
              href="#contact" 
              className="brutalist-button brutalist-button--secondary w-full sm:w-auto text-center group relative overflow-hidden"
            >
              <span className="absolute inset-0 bg-accent/20 transform skew-x-12 -translate-x-full transition-transform duration-300 ease-out group-hover:translate-x-0"></span>
              <span className="relative z-10">CONTACT ME</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;