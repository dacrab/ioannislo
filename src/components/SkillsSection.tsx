'use client';

import { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@/utils/gsapUtils';
import { prefersReducedMotion } from '@/utils/deviceUtils';
import dynamic from 'next/dynamic';

const IconsModule = dynamic(() => import('./SkillsIcons'), {
  ssr: false,
  loading: () => <div className="w-6 h-6 bg-foreground/20 animate-pulse rounded-md"></div>
});

type SkillCategory = 'frontend' | 'design' | 'tools' | 'backend';

interface Skill {
  name: string;
  iconName: string;
  category: SkillCategory;
}

const skillsData: Skill[] = [
  { name: 'HTML', iconName: 'FaHtml5', category: 'frontend' },
  { name: 'CSS/SCSS', iconName: 'FaCode', category: 'frontend' },
  { name: 'JavaScript', iconName: 'FaJs', category: 'frontend' },
  { name: 'TypeScript', iconName: 'SiTypescript', category: 'frontend' },
  { name: 'React', iconName: 'FaReact', category: 'frontend' },
  { name: 'Next.js', iconName: 'SiNextdotjs', category: 'frontend' },
  { name: 'GSAP', iconName: 'BsCodeSlash', category: 'frontend' },
  { name: 'Tailwind CSS', iconName: 'SiTailwindcss', category: 'frontend' },

  { name: 'Node.js', iconName: 'FaNodeJs', category: 'backend' },
  { name: 'Express.js', iconName: 'FaCode', category: 'backend' },
  { name: 'MongoDB', iconName: 'FaCode', category: 'backend' },
  { name: 'Firebase', iconName: 'FaCode', category: 'backend' },
  
  { name: 'UI/UX Design', iconName: 'MdDesignServices', category: 'design' },
  { name: 'Figma', iconName: 'FaFigma', category: 'design' },
  { name: 'Prototyping', iconName: 'FaCode', category: 'design' },
  { name: 'Wireframing', iconName: 'FaCode', category: 'design' },
  
  { name: 'Git & GitHub', iconName: 'FaGitAlt', category: 'tools' },
  { name: 'Webpack', iconName: 'SiWebpack', category: 'tools' },
  { name: 'VS Code', iconName: 'VscCode', category: 'tools' },
  { name: 'CLI Tools', iconName: 'FaCode', category: 'tools' },
];

const SkillsSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const titleTextRef = useRef<HTMLSpanElement>(null);
  const titleDotRef = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger);

    const titleText = titleTextRef.current;
    const titleDot = titleDotRef.current;
    const categoryBlocks: Element[] = gsap.utils.toArray(sectionRef.current?.querySelectorAll('.brutalist-reveal-item') || []);
    const allSkillCards: Element[] = gsap.utils.toArray(sectionRef.current?.querySelectorAll('.skill-card-item') || []);

    const reduceMotion = prefersReducedMotion();
    const baseDuration = reduceMotion ? 0.01 : 0.3;
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

    if (categoryBlocks.length > 0) {
      gsap.set(categoryBlocks, { opacity: 0, y: 25, skewY: 5 }); 
      ScrollTrigger.batch(categoryBlocks, {
        start: 'top 90%',
        onEnter: batch => 
          gsap.to(batch, {
            opacity: 1,
            y: 0,
            skewY: 0,
            duration: baseDuration * 1.2,
            ease: brutalEase,
            stagger: 0.15,
            overwrite: true
          }),
        onLeaveBack: batch => 
          gsap.set(batch, { opacity: 0, y: 25, skewY: 5, overwrite: true }), 
      });
    }
    
    if (allSkillCards.length > 0) {
      gsap.set(allSkillCards, { opacity: 0, scale: 0.5, rotation: -5 });
      ScrollTrigger.batch(allSkillCards, {
        start: 'top 95%',
        onEnter: batch => {
          gsap.to(batch, {
            opacity: 1,
            scale: 1,
            rotation: 0,
            duration: baseDuration * 0.8,
            ease: brutalEase,
            stagger: {
              amount: 0.8,
              from: "random"
            },
            overwrite: true
          });
        },
        onLeaveBack: batch => {
          gsap.set(batch, { opacity: 0, scale: 0.5, rotation: -5, overwrite: true });
        },
      });
    }

  }, { scope: sectionRef });

  const skillsByCategory: Record<SkillCategory, Skill[]> = {
    frontend: skillsData.filter(skill => skill.category === 'frontend'),
    backend: skillsData.filter(skill => skill.category === 'backend'),
    design: skillsData.filter(skill => skill.category === 'design'),
    tools: skillsData.filter(skill => skill.category === 'tools'),
  };

  const categoryOrder: SkillCategory[] = ['frontend', 'backend', 'design', 'tools'];

  return (
    <section 
      ref={sectionRef} 
      id="skills" 
      className="py-16 md:py-24 relative overflow-hidden bg-background text-foreground"
    >
      <div className="container mx-auto px-4 relative z-10">
        <h2 
          ref={titleRef} 
          className="font-display text-4xl sm:text-5xl md:text-6xl uppercase mb-10 md:mb-16 tracking-tight text-left"
        >
          <span ref={titleTextRef} className="inline-block">SKILLS</span>
          <span ref={titleDotRef} className="text-accent inline-block">.</span>
        </h2>
        
        <div className="space-y-12 md:space-y-16">
          {categoryOrder.map((categoryKey) => {
            const categorySkills = skillsByCategory[categoryKey];
            if (!categorySkills || categorySkills.length === 0) return null;

            return (
              <div key={categoryKey} className="brutalist-reveal-item">
                <h3 className="font-display text-2xl md:text-3xl uppercase mb-6 md:mb-8 tracking-tight border-b-4 border-foreground pb-2 relative overflow-hidden">
                  <span className="relative z-10">{categoryKey.charAt(0).toUpperCase() + categoryKey.slice(1)}</span>
                  <span className="absolute inset-0 bg-accent transform -skew-x-12 -translate-x-full transition-transform duration-300 group-hover:translate-x-0 z-0"></span>
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
                  {categorySkills.map((skill) => (
                    <div 
                      key={skill.name} 
                      className="brutalist-border bg-[var(--color-subtle-bg)] p-3 md:p-4 text-center hover:bg-foreground hover:text-background transition-colors duration-100 group skill-card-item transform hover:scale-105 hover:-rotate-2 hover:shadow-brutal transition-all"
                    >
                      <IconsModule 
                        name={skill.iconName} 
                        className="text-3xl md:text-4xl mx-auto mb-2 text-accent group-hover:text-background transition-colors duration-100" 
                      />
                      <p className="font-mono text-sm md:text-base uppercase tracking-wider">{skill.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-16 md:mt-24 brutalist-reveal-item">
          <h3 className="font-display text-2xl md:text-3xl uppercase mb-6 md:mb-8 tracking-tight border-b-4 border-foreground pb-2">
            PRIMARY TOOLS
          </h3>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-8 gap-3 md:gap-4">
            {[
              { name: 'React', iconName: 'FaReact' },
              { name: 'Next.js', iconName: 'SiNextdotjs' },
              { name: 'TypeScript', iconName: 'SiTypescript' },
              { name: 'Node.js', iconName: 'FaNodeJs' },
              { name: 'GSAP', iconName: 'BsCodeSlash' },
              { name: 'Tailwind CSS', iconName: 'SiTailwindcss' },
              { name: 'Figma', iconName: 'FaFigma' },
              { name: 'Git', iconName: 'FaGitAlt' },
            ].map((tech) => (
              <div 
                key={tech.name} 
                title={tech.name}
                className="brutalist-border bg-[var(--color-subtle-bg)] aspect-square flex flex-col items-center justify-center p-2 hover:bg-foreground hover:text-background transition-colors duration-100 group skill-card-item transform hover:scale-110 hover:rotate-3 hover:shadow-brutal transition-all"
              >
                <IconsModule 
                  name={tech.iconName} 
                  className="text-4xl md:text-5xl text-accent group-hover:text-background transition-colors duration-100" 
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;