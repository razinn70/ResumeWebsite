'use client';

import { useState, useEffect } from 'react';

interface ResponsiveBreakpoints {
  mobile: number;
  tablet: number;
  desktop: number;
  widescreen: number;
}

interface ResponsiveState {
  width: number;
  height: number;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isWidescreen: boolean;
  orientation: 'portrait' | 'landscape';
  isTouch: boolean;
}

const defaultBreakpoints: ResponsiveBreakpoints = {
  mobile: 768,
  tablet: 1024,
  desktop: 1440,
  widescreen: 1920
};

export const useResponsive = (
  breakpoints: ResponsiveBreakpoints = defaultBreakpoints
): ResponsiveState => {
  const [state, setState] = useState<ResponsiveState>(() => {
    // Default state for SSR
    return {
      width: 1024,
      height: 768,
      isMobile: false,
      isTablet: true,
      isDesktop: false,
      isWidescreen: false,
      orientation: 'landscape',
      isTouch: false
    };
  });

  useEffect(() => {
    const updateState = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const isMobile = width < breakpoints.mobile;
      const isTablet = width >= breakpoints.mobile && width < breakpoints.tablet;
      const isDesktop = width >= breakpoints.tablet && width < breakpoints.desktop;
      const isWidescreen = width >= breakpoints.desktop;
      const orientation = width > height ? 'landscape' : 'portrait';
      const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

      setState({
        width,
        height,
        isMobile,
        isTablet,
        isDesktop,
        isWidescreen,
        orientation,
        isTouch
      });
    };

    // Initial update
    updateState();

    // Listen for resize events
    window.addEventListener('resize', updateState);
    window.addEventListener('orientationchange', updateState);

    return () => {
      window.removeEventListener('resize', updateState);
      window.removeEventListener('orientationchange', updateState);
    };
  }, [breakpoints]);

  return state;
};

export const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia(query);
    const updateMatches = () => setMatches(mediaQuery.matches);
    
    // Initial check
    updateMatches();
    
    // Listen for changes
    mediaQuery.addEventListener('change', updateMatches);
    
    return () => mediaQuery.removeEventListener('change', updateMatches);
  }, [query]);

  return matches;
};

export const useViewport = () => {
  const [viewport, setViewport] = useState({
    width: 1024,
    height: 768
  });

  useEffect(() => {
    const updateViewport = () => {
      setViewport({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    updateViewport();
    window.addEventListener('resize', updateViewport);
    
    return () => window.removeEventListener('resize', updateViewport);
  }, []);

  return viewport;
};

// Utility hook for detecting specific device types
export const useDeviceDetection = () => {
  const [device, setDevice] = useState({
    isIOS: false,
    isAndroid: false,
    isMacOS: false,
    isWindows: false,
    isLinux: false,
    browser: 'unknown'
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const userAgent = navigator.userAgent.toLowerCase();
    const platform = navigator.platform.toLowerCase();

    const isIOS = /iphone|ipad|ipod/.test(userAgent);
    const isAndroid = /android/.test(userAgent);
    const isMacOS = /mac/.test(platform);
    const isWindows = /win/.test(platform);
    const isLinux = /linux/.test(platform);

    let browser = 'unknown';
    if (userAgent.includes('chrome')) browser = 'chrome';
    else if (userAgent.includes('firefox')) browser = 'firefox';
    else if (userAgent.includes('safari')) browser = 'safari';
    else if (userAgent.includes('edge')) browser = 'edge';

    setDevice({
      isIOS,
      isAndroid,
      isMacOS,
      isWindows,
      isLinux,
      browser
    });
  }, []);

  return device;
};

// Hook for managing responsive classes
export const useResponsiveClasses = () => {
  const { isMobile, isTablet, isDesktop, isWidescreen } = useResponsive();

  const getResponsiveClass = (baseClass: string) => {
    const classes = [baseClass];
    
    if (isMobile) classes.push(`${baseClass}--mobile`);
    if (isTablet) classes.push(`${baseClass}--tablet`);
    if (isDesktop) classes.push(`${baseClass}--desktop`);
    if (isWidescreen) classes.push(`${baseClass}--widescreen`);
    
    return classes.join(' ');
  };

  const responsiveValue = <T>(values: {
    mobile?: T;
    tablet?: T;
    desktop?: T;
    widescreen?: T;
    default: T;
  }): T => {
    if (isMobile && values.mobile !== undefined) return values.mobile;
    if (isTablet && values.tablet !== undefined) return values.tablet;
    if (isDesktop && values.desktop !== undefined) return values.desktop;
    if (isWidescreen && values.widescreen !== undefined) return values.widescreen;
    return values.default;
  };

  return {
    getResponsiveClass,
    responsiveValue,
    isMobile,
    isTablet,
    isDesktop,
    isWidescreen
  };
};
