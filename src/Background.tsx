import React, { useEffect } from "react";
import "./Background.css";

const Background: React.FC = () => {
  useEffect(() => {
    const container = document.getElementById("heartContainer");
    if (!container) return;

    const w = window.innerWidth;
    const h = window.innerHeight;
    const heartSize = 21;
    const spacing = 28; // Distance between hearts (adjust for density)
    const cols = Math.ceil(w / spacing);
    const rows = Math.ceil(h / spacing);

    const DURATION = 4; // Seconds each pulse lasts
    const MAX_DELAY = 3.5; // Max delay for stagger

    const heartSVG = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="200 0 176.63 132.62">
        <path fill="black" d="M342.457 37.357c-1.222 35.678-47.186 64.154-53.236 82.135-5.387-10.891-44.121-26.633-43.741-60.942.318-28.51 15.155-37.433 23.235-37.433 11.284 0 15.944 8.614 16.706 12.428.761 3.812 5.032 6.86 6.404.609 1.373-6.251 14.649-25.312 30.963-25.312 14.942 0 20.117 15.408 19.669 28.515"/>
        <path fill="black" d="M328.125 0c-13.418 0-29.287 9.91-38.892 26.379-2.592-5.948-11.826-12.429-22.803-12.429-8.845 0-33.673 11.055-33.673 46.735 0 46.048 46.588 55.506 56.006 69.817.647.985 2.732 1.728 3.527-.624 7.515-22.179 65.787-47.236 65.787-92.369C358.077 12.198 341.543 0 328.125 0"/>
      </svg>
    `;

    const fragment = document.createDocumentFragment();

    // Center top point (camera position)
    const originX = w / 2;
    const originY = 120;

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const heart = document.createElement("div");
        heart.className = "heart";

        // Calculate final position (grid-like or random)
        const x = col * spacing + (spacing / 2) - heartSize / 2;
        const y = row * spacing + (spacing / 2) - heartSize / 2;

        // Set final position
        heart.style.left = `${x}px`;
        heart.style.top = `${y}px`;

        // Color of heart
        {
          const colors = ["red", "blue"];
          const choice = colors[Math.floor(Math.random() * colors.length)];
          heart.classList.add(choice);
        }

        // Calculate distance from top center for delay
        const dx = x - originX;
        const dy = y - originY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const maxDistance = Math.sqrt((w / 2) ** 2 + h ** 2); // Max possible distance
        const delay = (distance / maxDistance) * MAX_DELAY; // Scale delay by distance

        heart.style.animationDuration = `${DURATION}s`;
        heart.style.animationDelay = `${delay}s`;

        heart.innerHTML = heartSVG;
        fragment.appendChild(heart);
      }
    }

    container.appendChild(fragment);
    return () => {
      container.innerHTML = "";
    };
  }, []);

  return <div id="heartContainer" className="heart-container" />;
};

export default Background;