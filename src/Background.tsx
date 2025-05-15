// src/Background.tsx
import React, { useEffect, useState, useRef } from "react";
import "./Background.css";

interface HeartBackgroundProps {
  country?: string;
}

// map of country codes → animation CSS classes
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
  SM: "color-changing-red-blue",
  AL: "color-changing-red-white-green",
  NL: "color-changing-blue-white-orange",
  HR: "color-changing-blue-white-red",
  CY: "color-changing-white-blue",
  AU: "color-changing-red-white-blue-au",
  ME: "color-changing-red-yellow",
  IE: "color-changing-orange-white-green",
  LV: "color-changing-red-white",
  AM: "color-changing-blue-white-yellow",
  AT: "color-changing-red-white",
  GR: "color-changing-white-blue",
  LT: "color-changing-green-yellow-red",
  MT: "color-changing-red-yellow-blue-white",
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

const HeartBackground: React.FC<HeartBackgroundProps> = ({ country = "CH" }) => {
  const [countryCode, setCountryCode] = useState<string>(country);

  // ref to hold previous animation class
  const prevAnimationRef = useRef<string>();
  // ref to detect first render
  const isFirstRun = useRef(true);

  // sync state if prop changes
  useEffect(() => {
    if (country !== countryCode) {
      setCountryCode(country);
    }
  }, [country, countryCode]);

  const animationClass = isFirstRun.current ? "color-changing-unique" : getCountryAnimationClass(countryCode);


  // build/update hearts only on first render or when animationClass changes
  useEffect(() => {
    // skip rebuild if not first run _and_ class didn't change
    if (!isFirstRun.current && prevAnimationRef.current === animationClass) {
      return;
    }

    // mark we've run at least once, and store current class
    isFirstRun.current = false;
    prevAnimationRef.current = animationClass;

    const container = document.getElementById("heartContainer");
    if (!container) return;

    const w = window.innerWidth;
    const h = window.innerHeight;
    const heartSize = 21;
    const spacing = 28; // px
    const cols = Math.ceil(w / spacing);
    const rows = Math.ceil(h / spacing);
    const DURATION = 5; // sec
    const MAX_DELAY = 3.5; // sec

    const heartSVG = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="200 0 176.63 132.62">
        <path d="M328.125 0c-13.418 0-29.287 9.91-38.892 26.379-2.592-5.948-11.826-12.429-22.803-12.429-8.845 0-33.673 11.055-33.673 46.735 0 46.048 46.588 55.506 56.006 69.817.647.985 2.732 1.728 3.527-.624 7.515-22.179 65.787-47.236 65.787-92.369C358.077 12.198 341.543 0 328.125 0"/>
      </svg>
    `;

    const originX = w / 2;
    const originY = 120;
    const fragment = document.createDocumentFragment();

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const heart = document.createElement("div");
        heart.className = "heart";

        const x = col * spacing + spacing / 2 - heartSize / 2;
        const y = row * spacing + spacing / 2 - heartSize / 2;
        heart.style.left = `${x}px`;
        heart.style.top = `${y}px`;

        const dx = x - originX;
        const dy = y - originY;
        const distance = Math.hypot(dx, dy);
        const maxDistance = Math.hypot(w / 2, h);
        const delay = (distance / maxDistance) * MAX_DELAY;

        heart.style.animationDuration = `${DURATION}s`;
        heart.style.animationDelay = `${delay}s`;
        heart.innerHTML = heartSVG;
        heart.classList.add(animationClass);

        fragment.appendChild(heart);
      }
    }

    container.appendChild(fragment);
    if (isFirstRun.current) {
      isFirstRun.current = false;
    }


    return () => {
      container.innerHTML = "";
    };
  }, [animationClass]);

  return <div id="heartContainer" className="heart-container" />;
};

export default HeartBackground;
