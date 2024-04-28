import "./Country.css";
import { IoMdPause } from "react-icons/io";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export const Country = ({
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
  className?: string; // Add this line
  checkmark?: boolean;
  guess?: number;
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });
  const style = {
    transition: transition,
    transform: CSS.Transform.toString(transform),
  };
  const audioId = `audio-${id}`; // ID for the audio element

  const handleClick = () => {
    let audioElement = document.getElementById(
      audioId
    ) as HTMLAudioElement | null;

    if (!audioElement) {
      audioElement = document.createElement("audio");
      audioElement.id = audioId;
      audioElement.src = music;
      document.body.appendChild(audioElement);

      // Add an event listener for when the song ends
      audioElement.addEventListener("ended", () => {
        playMusic(""); // Reset the playing state
      });
    }

    if (isPlaying) {
      audioElement.pause();
      audioElement.currentTime = 0;
      playMusic(""); // Assuming this stops the music and sets isPlaying to false
    } else {
      setShowTooltip(false);
      console.log("Playing music" + audioId);
      playMusic(audioId); // Assuming this starts the music and sets isPlaying to true
      audioElement.play();
    }
  };

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      style={style}
      {...listeners}
      className={`country ${className} ${
        checkmark == null ? "" : checkmark === true ? "" : "wrong"
      } ${
        guess == null
          ? ""
          : guess === 0
          ? "correct"
          : guess > 0
          ? `lower l${guess}`
          : `higher h${guess}`
      }`}
      data-no-dnd="true"
    >
      {index === 0 && showTooltip && <div className="tooltip">Tap here</div>}
      <button type="button" className="number" onClick={handleClick}>
        {isPlaying ? <IoMdPause /> : index + 1}
      </button>

      <div className="content">
        <span className={`fi fi-${id.toLowerCase()}`}></span>
        <span className="countryName"> {content.toUpperCase()}</span>
      </div>
    </div>
  );
};
