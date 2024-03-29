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
}: {
  id: string;
  content: string;
  index: number;
  playMusic: (music: string) => void;
  music: string;
  isPlaying: boolean;
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });
  const style = {
    transition: transition,
    transform: CSS.Transform.toString(transform),
  };
  const audioId = `audio-${id}`; // ID for the audio element

  const handleClick = () => {
  let audioElement = document.getElementById(audioId) as HTMLAudioElement | null;

  if (!audioElement) {
    audioElement = document.createElement("audio");
    audioElement.id = audioId;
    audioElement.src = music;
    document.body.appendChild(audioElement);

    // Add an event listener for when the song ends
    audioElement.addEventListener('ended', () => {
      playMusic(""); // Reset the playing state
    });
  }

  if (isPlaying) {
    audioElement.pause();
    audioElement.currentTime = 0;
    playMusic(""); // Assuming this stops the music and sets isPlaying to false
  } else {
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
      className="country"
      data-no-dnd="true"
    >
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
