# 🎨 Modern Brutalist Portfolio with GSAP Animations

A striking and modern brutalist-style portfolio website built with **Next.js**, **TypeScript**, and brought to life with **GSAP animations**. This project embraces a clean, raw aesthetic, enhanced by powerful animations that create a memorable user experience without compromising brutalist design principles.
---

## ✨ Features

-   **Responsive Brutalist Design**: A raw, honest design language that emphasizes strong typography and bold geometric shapes.
-   **Advanced GSAP Animations**: Fluid scrolling, intricate text effects, dynamic SVG animations, and engaging UI interactions.
-   **Component-Based Architecture**: A modular and organized structure that makes maintenance and future extensions a breeze.
-   **TypeScript Support**: Enjoy a type-safe development environment for more robust and predictable code.
-   **Optimized for Performance**: Carefully crafted animations and efficient asset loading for a smooth user experience.

---

## 🚀 Animation Showcase

This portfolio is packed with a wide array of animations to create a dynamic and interactive experience.

### 🌍 Global Animations

-   **Smooth Scrolling**: Powered by GSAP's `ScrollSmoother` for a premium, seamless scrolling journey.
-   **Custom Cursor**: An animated cursor that playfully reacts to interactive elements.
-   **Magnetic Buttons**: Interactive buttons that attract the cursor, adding a satisfying touch.
-   **Parallax Effects**: Multi-layered parallax on decorative elements to create a sense of depth.

### 📝 Text Animations

-   **Character Splitting**: Texts animate at the character level with `SplitText` for sophisticated reveals.
-   **Staggered Reveals**: Dynamic and engaging text appearances with staggered timing.
-   **Text Masking**: Creative text reveals using elegant `clip-path` animations.
-   **Hover Effects**: Interactive text elements that come to life on user interaction.

### ✒️ SVG Animations

-   **Path Drawing**: SVG paths that appear to draw themselves with `DrawSVGPlugin`.
-   **SVG Morphing**: Seamless shape transformations using `MorphSVGPlugin`.
-   **Dynamic Motion**: Engaging rotation and bounce animations for visual flair.
-   **Reusable SVG Component**: A flexible component designed to handle various SVG animation types.

### 🎨 UI Interactions

-   **Skill Bar Animations**: Animated progress bars complete with counter effects.
-   **Interactive Forms**: Form fields that animate on focus and blur for a modern feel.
-   **3D Card Hover Effects**: Eye-catching 3D tilt effects on cards based on mouse position.
-   **Engaging Social Icons**: Interactive social media icons that animate on hover.

### 📜 Scroll-Based Animations

-   **Triggered Reveals**: Elements that gracefully animate into view as you scroll.
-   **Parallax Scrolling**: Multi-speed scrolling effects that add a layer of depth and immersion.
-   **Seamless Section Transitions**: Smooth and elegant transitions between different portfolio sections.

---

## 📁 Project Structure

The project is organized into a clean and intuitive directory structure:

```
src/
├── app/                  # Next.js App Directory
│   ├── layout.tsx        # Root Layout Component
│   └── page.tsx          # Main Page Component
├── components/           # Reusable React Components
│   ├── AboutSection.tsx
│   ├── AnimatedSvg.tsx
│   ├── ContactSection.tsx
│   ├── HeroSection.tsx
│   ├── Navigation.tsx
│   └── SkillsSection.tsx
├── utils/                # Utility Functions
│   ├── gsapUtils.ts      # Centralized GSAP Utilities
│   └── magneticEffect.ts # Magnetic Button Effect Logic
└── styles/               # Global Styles
    └── globals.css       # Global CSS Stylesheet
```

---

## 🛠️ GSAP Utilities

To maintain clean and reusable code, this project centralizes GSAP functionalities:

-   **`registerGSAPPlugins()`**: A single function to register all necessary GSAP plugins.
-   **`cleanupGSAPAnimations()`**: A utility to properly handle the cleanup of GSAP animations and prevent memory leaks.

---

## 🚀 Getting Started

Follow these simple steps to get the project up and running on your local machine.

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/dacrab/friends-portfolio.git
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Run the development server:**
    ```bash
    npm run dev
    ```

4.  **Open your browser:**
    Navigate to [http://localhost:3000](http://localhost:3000) to see the magic happen!

---

## 🎨 Customization

### Adding New Animations

1.  **Import Plugins**: Import the required GSAP plugins in your component.
2.  **Use Utilities**: Leverage the centralized `gsapUtils` for plugin registration and cleanup.
3.  **Create Animation**: Implement your animation logic within a `useEffect` hook.
4.  **Cleanup**: Ensure you use the `cleanupGSAPAnimations` utility for proper cleanup on component unmount.

### Creating New Sections

1.  **Create Component**: Build your new section as a component in the `components` directory.
2.  **Integrate GSAP**: Import and use the GSAP utilities to bring your section to life.
3.  **Add to Page**: Import and place your new component within the main `page.tsx` file.

---

## 📦 Dependencies

This project is built with a modern tech stack:

-   [Next.js](https://nextjs.org/)
-   [React](https://reactjs.org/)
-   [TypeScript](https://www.typescriptlang.org/)
-   [GSAP](https://greensock.com/gsap/) (with plugins: `ScrollTrigger`, `ScrollSmoother`, `SplitText`, `DrawSVGPlugin`, `MorphSVGPlugin`)
-   [Framer Motion](https://www.framer.com/motion/)
-   [Tailwind CSS](https://tailwindcss.com/)

---

## ⚡ Performance Considerations

-   Animations are fine-tuned for optimal performance.
-   GSAP instances are meticulously managed and cleaned up to prevent memory leaks.
-   SVGs are optimized to ensure smooth and efficient animations.

---

## 📜 License

This project is licensed under the [LICENCE](LICENCE).
