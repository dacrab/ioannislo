/**
 * Device detection utilities
 */

// Mobile device detection regex pattern
const MOBILE_DEVICE_PATTERN = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
const MOBILE_WIDTH_THRESHOLD = 768;

// Cache detection results to avoid recalculating
let isMobileCache: boolean | null = null;

/**
 * Checks if the current environment has a window object
 */
const hasWindow = (): boolean => typeof window !== 'undefined';

/**
 * Checks if the current device is a mobile device based on user agent or screen width.
 * @returns {boolean} True if the device is considered mobile.
 */
export const isMobileDevice = (): boolean => {
  if (isMobileCache !== null) return isMobileCache;
  
  if (!hasWindow()) {
    isMobileCache = false;
    return false;
  }
  
  // Check user agent first
  const isUserAgentMobile = MOBILE_DEVICE_PATTERN.test(navigator.userAgent);
  
  // Fallback to width check if user agent isn't definitively mobile, or to catch desktop browsers resized small
  const isSmallScreen = window.innerWidth < MOBILE_WIDTH_THRESHOLD;

  // Consider mobile if either user agent matches or screen is small.
  // For brutalist design, we primarily care about screen size for layout, 
  // but UA can be a hint for touch capabilities if needed elsewhere.
  isMobileCache = isUserAgentMobile || isSmallScreen;
  
  return isMobileCache;
};

/**
 * Checks if the user has a preference for reduced motion.
 * @returns {boolean} True if reduced motion is preferred.
 */
export const prefersReducedMotion = (): boolean => {
  if (!hasWindow()) return false;
  return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

/**
 * Reset cached device detection values
 * Useful for testing or when device capabilities might change
 */
export const resetDeviceDetectionCache = (): void => {
  isMobileCache = null;
  // No other caches to reset in this simplified version
};

// Removed isLowPerformanceDevice, getDeviceTier, getOptimizedDuration, 
// getOptimizedStagger, shouldEnableComplexAnimations and related constants 
// as they are not central to the simplified brutalist animation approach.