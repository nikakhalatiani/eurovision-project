// Improved Background.tsx with color animation fix
import React, { useEffect, useState, useRef } from "react";
import "./Background.css";

interface HeartBackgroundProps {
  country?: string;
}

// Map of country codes → animation CSS classes
const countryAnimations: Record<string, string> = {
  DE: "color-changing-black-red-yellow",
  FR: "color-changing-blue-white-red",
  ES: "color-changing-red-yellow",
  IT: "color-changing-tri-red-green-white",
  CH: "color-changing-red-white",
  GB: "color-changing-tri-red-blue-white",
  IS: "color-changing-blue-white",
  PL: "color-changing-white-red",
  SI: "color-changing-blue-white-red",
  EE: "color-changing-blue-white",
  UA: "color-changing-blue-yellow",
  SE: "color-changing-blue-yellow",
  PT: "color-changing-blue-white-green-red",
  NO: "color-changing-tri-red-blue-white",
  BE: "color-changing-black-red-yellow",
  AZ: "color-changing-blue-red-white-green",
  SM: "color-changing-white-blue",
  AL: "color-changing-red-black",
  NL: "color-changing-blue-white-red",
  HR: "color-changing-blue-white-red",
  CY: "color-changing-white-blue",
  AU: "color-changing-red-white-blue-au",
  ME: "color-changing-red-yellow",
  IE: "color-changing-orange-white-green",
  LV: "color-changing-red-white",
  AM: "color-changing-blue-red-orangemt",
  AT: "color-changing-red-white",
  GR: "color-changing-white-blue",
  LT: "color-changing-green-yellow-red",
  MT: "color-changing-white-red",
  GE: "color-changing-red-white",
  DK: "color-changing-red-white",
  CZ: "color-changing-blue-white-red",
  LU: "color-changing-blue-white-red-lux",
  IL: "color-changing-blue-white-blue",
  RS: "color-changing-blue-white-red",
  FI: "color-changing-blue-white",
};

const getCountryAnimationClass = (code: string): string =>
  countryAnimations[code] ?? "color-changing-red-white";

// Heart SVG as a constant to avoid recreating it
const HEART_SVG = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="200 0 176.63 132.62">
    <path d="M328.125 0c-13.418 0-29.287 9.91-38.892 26.379-2.592-5.948-11.826-12.429-22.803-12.429-8.845 0-33.673 11.055-33.673 46.735 0 46.048 46.588 55.506 56.006 69.817.647.985 2.732 1.728 3.527-.624 7.515-22.179 65.787-47.236 65.787-92.369C358.077 12.198 341.543 0 328.125 0"/>
  </svg>
`;

// Create a single heart element
const createHeartElement = (
  x: number, 
  y: number, 
  delay: number, 
  animationClass: string, 
  duration: number
): HTMLDivElement => {
  const heart = document.createElement("div");
  heart.className = `heart ${animationClass}`;
  heart.style.left = `${x}px`;
  heart.style.top = `${y}px`;
  heart.style.animationDuration = `${duration}s`;
  heart.style.animationDelay = `${delay}s`;
  heart.innerHTML = HEART_SVG;
  return heart;
};

const HeartBackground: React.FC<HeartBackgroundProps> = ({ country = "CH" }) => {
  const [countryCode, setCountryCode] = useState<string>(country);
  const containerRef = useRef<HTMLDivElement>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);
  const heartGridRef = useRef<{ rows: number; cols: number }>({ rows: 0, cols: 0 });
  
  // Track if we need to rebuild the hearts
  const needsRebuild = useRef<boolean>(true);
  const prevCountryCodeRef = useRef<string>(country);
  const prevAnimationClassRef = useRef<string>(getCountryAnimationClass(country));

  // Sync state if prop changes
  useEffect(() => {
    if (country !== countryCode) {
      setCountryCode(country);
      
      // Only mark for rebuild if animation class changes
      const newAnimationClass = getCountryAnimationClass(country);
      const prevAnimationClass = getCountryAnimationClass(countryCode);
      
      if (newAnimationClass !== prevAnimationClass) {
        needsRebuild.current = true;
        console.log("Animation class changed, rebuilding hearts");
      } else {
        console.log("Same animation class detected, skipping rebuild");
      }
    }
  }, [country, countryCode]);

  // Get the current country animation class
  const animationClass = getCountryAnimationClass(countryCode);

  // Rebuild hearts when needed
  useEffect(() => {
    // Check if animation class changed
    const currentAnimationClass = getCountryAnimationClass(countryCode);
    
    if (prevAnimationClassRef.current !== currentAnimationClass) {
      needsRebuild.current = true;
      prevAnimationClassRef.current = currentAnimationClass;
      console.log("Animation class changed to:", currentAnimationClass);
    }
    
    // Update the previous country code reference
    prevCountryCodeRef.current = countryCode;
    
    // Skip if we don't need to rebuild
    if (!needsRebuild.current) {
      return;
    }
    
    const buildHearts = () => {
      if (!containerRef.current) return;
      
      // Clear existing hearts
      containerRef.current.innerHTML = "";
      
      // Calculate grid
      const w = window.innerWidth;
      const h = window.innerHeight;
      const heartSize = 21;
      
      // Increase spacing on mobile for better performance
      const isMobile = window.innerWidth < 768;
      const spacing = isMobile ? 20 : 30; // px - bigger spacing on mobile
      
      // Reduce the number of hearts on mobile
      const cols = Math.ceil(w / spacing);
      const rows = Math.ceil(h / spacing);
      
      // Record the current grid size
      heartGridRef.current = { rows, cols };
      
      // Animation parameters - slow down on mobile
      const DURATION = isMobile ? 5 : 5; // sec
      const MAX_DELAY = isMobile ? 3.5 : 3.5; // sec
      
      const originX = w / 2;
      const originY = 120;
      
      // Use document fragment for better performance
      const fragment = document.createDocumentFragment();
      
      // Reduce DOM elements by rendering fewer hearts on mobile
      const skipFactor = isMobile ? 2 : 1; // Draw every 2nd heart on mobile
      
      for (let row = 0; row < rows; row += skipFactor) {
        for (let col = 0; col < cols; col += skipFactor) {
          const x = col * spacing + spacing / 2 - heartSize / 2;
          const y = row * spacing + spacing / 2 - heartSize / 2;
          
          const dx = x - originX;
          const dy = y - originY;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const maxDistance = Math.sqrt((w / 2) * (w / 2) + h * h);
          const delay = (distance / maxDistance) * MAX_DELAY;
          
          const heart = createHeartElement(
            x, y, delay, animationClass, DURATION
          );
          
          fragment.appendChild(heart);
        }
      }
      
      containerRef.current.appendChild(fragment);
      needsRebuild.current = false;
    };
    
    // Build initial hearts
    buildHearts();
    
    // Set up resize observer for responsive rebuilding
    if (!resizeObserverRef.current && containerRef.current) {
      resizeObserverRef.current = new ResizeObserver((entries) => {
        // Check if container size changed significantly
        const entry = entries[0];
        if (!entry) return;
        
        const newWidth = entry.contentRect.width;
        const newHeight = entry.contentRect.height;
        
        // Calculate new grid dimensions
        const spacing = window.innerWidth < 768 ? 42 : 28;
        const newCols = Math.ceil(newWidth / spacing);
        const newRows = Math.ceil(newHeight / spacing);
        
        // Only rebuild if grid dimensions changed significantly (>10%)
        const colDiff = Math.abs(newCols - heartGridRef.current.cols);
        const rowDiff = Math.abs(newRows - heartGridRef.current.rows);
        
        if (colDiff > heartGridRef.current.cols * 0.1 || 
            rowDiff > heartGridRef.current.rows * 0.1) {
          needsRebuild.current = true;
          buildHearts();
        }
      });
      
      resizeObserverRef.current.observe(containerRef.current);
    }
    
    return () => {
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
      }
    };
  }, [countryCode, animationClass]);

  // Log for debugging
  console.log("Rendering background with country:", countryCode, "animation class:", animationClass);

  return <div ref={containerRef} id="heartContainer" className="heart-container" />;
};

export default HeartBackground;