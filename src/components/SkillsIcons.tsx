import React from 'react';
import { 
  FaHtml5, FaJs, FaReact, FaGitAlt, FaFigma, FaNodeJs, 
  FaGithub, FaCode
} from 'react-icons/fa';
import { 
  SiTypescript, SiNextdotjs, SiTailwindcss, SiWebpack
} from 'react-icons/si';
import { BsCodeSlash } from 'react-icons/bs';
import { MdDesignServices } from 'react-icons/md';
import { IoColorPaletteOutline } from 'react-icons/io5';
import { TbBrandFramerMotion } from 'react-icons/tb';
import { VscCode } from 'react-icons/vsc';

interface IconProps {
  name: string;
  className?: string;
}

// Map of icon names to their components
const iconMap: Record<string, React.ElementType> = {
  FaHtml5,
  FaJs,
  FaReact,
  FaGitAlt,
  FaFigma,
  FaNodeJs,
  FaGithub,
  FaCode,
  SiTypescript,
  SiNextdotjs,
  SiTailwindcss,
  SiWebpack,
  BsCodeSlash,
  MdDesignServices,
  IoColorPaletteOutline,
  TbBrandFramerMotion,
  VscCode
};

const SkillsIcons: React.FC<IconProps> = ({ name, className = '' }) => {
  const IconComponent = iconMap[name];
  
  if (!IconComponent) {
    // Enhanced brutalist fallback
    return (
      <div className={`relative inline-block ${className}`}>
        <span className="absolute top-0 left-0 transform -translate-x-[2px] -translate-y-[2px] text-accent">•</span>
        <span className="absolute top-0 left-0 transform translate-x-[2px] translate-y-[2px] text-foreground opacity-75">•</span>
        <span className="relative">•</span>
      </div>
    );
  }
  
  return (
    <div className="relative inline-block group">
      <IconComponent className={`${className} relative z-10 transform transition-transform duration-200 group-hover:scale-110 group-hover:rotate-3`} />
      {/* Glitch effect layers */}
      <IconComponent className={`${className} absolute inset-0 text-accent opacity-75 transform translate-x-[2px] translate-y-[2px] group-hover:translate-x-[4px] group-hover:translate-y-[4px] transition-transform duration-200`} />
      <IconComponent className={`${className} absolute inset-0 text-foreground opacity-50 transform -translate-x-[2px] -translate-y-[2px] group-hover:-translate-x-[4px] group-hover:-translate-y-[4px] transition-transform duration-200`} />
    </div>
  );
};

export default SkillsIcons; 