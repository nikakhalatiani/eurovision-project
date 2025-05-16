// src/Country.tsx - Optimized version
import "./Country.css";
import { IoMdPause } from "react-icons/io";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import React, { useRef, useCallback, memo } from "react";

// Audio cache to prevent recreating audio elements
const audioCache = new Map();

export const Country = memo(({
  id,
  content,
  index,
  music,
  playMusic,
  isPlaying,
  showTooltip,
  setShowTooltip,
  className,
  checkmark,
  guess,
}: {
  id: string;
  content: string;
  index: number;
  playMusic: (music: string) => void;
  music: string;
  isPlaying: boolean;
  showTooltip: boolean;
  setShowTooltip: (showTooltip: boolean) => void;
  className?: string;
  checkmark?: boolean;
  guess?: number;
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });
    
  // Memoize the style object to prevent unnecessary re-renders
  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
    // Add will-change for hardware acceleration when dragging
    willChange: transform ? 'transform' : 'auto',
  };
  
  const audioId = `audio-${id}`;
  
  // Use a ref to track if audio element is created
  const audioCreatedRef = useRef(false);
  
  // Memoize click handler to prevent recreating on every render
  const handleClick = useCallback(() => {
    let audioElement = audioCache.get(audioId) as HTMLAudioElement | null;
    
    if (!audioElement) {
      // Check if it already exists in the DOM
      audioElement = document.getElementById(audioId) as HTMLAudioElement | null;
      
      if (!audioElement) {
        audioElement = document.createElement("audio");
        audioElement.id = audioId;
        audioElement.src = music;
        audioElement.preload = "none"; // Don't preload until user clicks
        
        // Add an event listener for when the song ends
        audioElement.addEventListener("ended", () => {
          playMusic(""); // Reset the playing state
        });
        
        document.body.appendChild(audioElement);
        audioCreatedRef.current = true;
        audioCache.set(audioId, audioElement);
      }
    }
    
    if (isPlaying) {
      audioElement.pause();
      audioElement.currentTime = 0;
      playMusic(""); // Assuming this stops the music and sets isPlaying to false
    } else {
      setShowTooltip(false);
      // Load audio if not loaded yet
      if (audioElement.readyState === 0) {
        audioElement.load();
      }
      playMusic(audioId);
      
      // Play with catch for mobile devices that might block autoplay
      const playPromise = audioElement.play();
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.warn("Audio playback was prevented:", error);
          // Reset playing state if blocked
          playMusic("");
        });
      }
    }
  }, [audioId, isPlaying, music, playMusic, setShowTooltip]);

  // Clean up audio elements when component unmounts
  React.useEffect(() => {
    return () => {
      if (audioCreatedRef.current) {
        const audioElement = audioCache.get(audioId);
        if (audioElement) {
          audioElement.pause();
          document.body.removeChild(audioElement);
          audioCache.delete(audioId);
        }
      }
    };
  }, [audioId]);

  // Compute class names only once per render
  const countryClassNames = `country ${className || ""} ${
    checkmark == null ? "" : checkmark === true ? "" : "wrong"
  } ${
    guess == null
      ? ""
      : guess === 0
      ? "correct"
      : guess > 0
      ? `lower l${guess}`
      : `higher h${guess}`
  }`;

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      style={style}
      {...listeners}
      className={countryClassNames}
      data-no-dnd="true"
    >
      {index === 0 && showTooltip && <div className="tooltip">Tap here</div>}
      <button type="button" className="number" onClick={handleClick}>
        {isPlaying ? <IoMdPause /> : index + 1}
      </button>
      <div className="content">
        <span className={`fi fi-${id.toLowerCase()}`}></span>
        <span className="countryName">{content.toUpperCase()}</span>
      </div>
    </div>
  );
});

// Add display name for debugging
Country.displayName = 'Country';