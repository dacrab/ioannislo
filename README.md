# Modern Brutalist Portfolio with GSAP Animations

This project is a modern brutalist-style portfolio website built with Next.js, TypeScript, and GSAP animations. It features a clean, raw aesthetic with powerful animations that enhance the user experience without compromising the brutalist design principles.

## Features

- **Responsive Brutalist Design**: Raw, honest design with strong typography and geometric shapes
- **Advanced GSAP Animations**: Smooth scrolling, text animations, SVG animations, and UI interactions
- **Component-Based Architecture**: Modular components for easy maintenance and extension
- **TypeScript Support**: Type-safe code for better development experience
- **Optimized Performance**: Efficient animations and asset loading

## Animation Features

### Global Animations
- **Smooth Scrolling**: Using GSAP's ScrollSmoother for a premium scrolling experience
- **Custom Cursor**: Animated cursor that reacts to interactive elements
- **Magnetic Button Effects**: Buttons that respond to mouse proximity
- **Parallax Effects**: Multi-layered parallax on decorative elements

### Text Animations
- **Character Splitting**: Text animations at the character level using SplitText
- **Staggered Reveals**: Text appears with staggered timing for a dynamic effect
- **Text Masking**: Creative reveals using clip-path animations
- **Hover Effects**: Interactive text elements that respond to user interaction

### SVG Animations
- **Path Drawing**: SVG paths that draw themselves using DrawSVGPlugin
- **SVG Morphing**: Shape transformations using MorphSVGPlugin
- **Rotation & Bounce**: Dynamic SVG animations for visual interest
- **Reusable SVG Component**: A flexible component for various SVG animation types

### UI Interactions
- **Skill Bar Animations**: Animated progress bars with counter effects
- **Form Field Animations**: Interactive form fields with focus/blur animations
- **Card Hover Effects**: 3D tilt effects on cards based on mouse position
- **Social Icon Animations**: Interactive social media icons

### Scroll-Based Animations
- **Scroll-Triggered Reveals**: Elements that animate as they enter the viewport
- **Parallax Scrolling**: Multi-speed scrolling effects for depth
- **Section Transitions**: Smooth transitions between portfolio sections

## Project Structure

```
src/
├── app/                  # Next.js app directory
│   ├── layout.tsx        # Root layout component
│   └── page.tsx          # Main page component
├── components/           # Reusable components
│   ├── AboutSection.tsx  # About section component
│   ├── AnimatedSvg.tsx   # Reusable SVG animation component
│   ├── ContactSection.tsx # Contact form section
│   ├── HeroSection.tsx   # Hero/landing section
│   ├── Navigation.tsx    # Navigation component
│   └── SkillsSection.tsx # Skills display section
├── utils/                # Utility functions
│   ├── gsapUtils.ts      # Centralized GSAP utility functions
│   └── magneticEffect.ts # Magnetic button effect utility
└── styles/               # Global styles
    └── globals.css       # Global CSS styles
```

## GSAP Utilities

The project includes centralized GSAP utilities to avoid redundant code:

- **registerGSAPPlugins()**: Registers all GSAP plugins in one place
- **cleanupGSAPAnimations()**: Handles proper cleanup of GSAP animations

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Customization

### Adding New Animations

1. Import necessary GSAP plugins in your component
2. Use the centralized GSAP utilities for plugin registration and cleanup
3. Create your animation within a useEffect hook
4. Use the cleanupGSAPAnimations utility for proper cleanup

### Creating New Sections

1. Create a new component in the components directory
2. Import and use the GSAP utilities
3. Add your component to the main page.tsx file

## Dependencies

- Next.js
- React
- TypeScript
- GSAP (with plugins: ScrollTrigger, ScrollSmoother, SplitText, DrawSVGPlugin, MorphSVGPlugin)
- Framer Motion (for additional animations)
- Tailwind CSS (for styling)

## Performance Considerations

- Animations are optimized to run efficiently
- GSAP instances are properly cleaned up to prevent memory leaks
- SVG animations are optimized for performance

## License

[LICENCE](LICENCE)
