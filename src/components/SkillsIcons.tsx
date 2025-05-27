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
    // Fallback for missing icons
    return <span className={className}>•</span>;
  }
  
  return <IconComponent className={className} />;
};

export default SkillsIcons; 