import "./Country.css";

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
  playMusic: (music:string) => void;
  music: string;
  isPlaying: boolean;
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });
  const style = {
    transition: transition,
    transform: CSS.Transform.toString(transform),
  };

  const handleClick = () => {
    const audioId = `audio-${id}`;
    let audioElement = document.getElementById(audioId) as HTMLAudioElement | null;

    if (!audioElement) {
      audioElement = document.createElement('audio');
      audioElement.id = audioId;
      audioElement.src = music;
      document.body.appendChild(audioElement);
    }

    playMusic(audioId);
    if (!isPlaying) {
      audioElement.play();
    } else {
      audioElement.pause();
      audioElement.currentTime = 0;
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
      <button type="button"
      className="number" onClick={handleClick}>{index + 1}</button>
      <div className="content">
          <span className={`fi fi-${id.toLowerCase()}`}></span>
          <span className="countryName"> {content.toUpperCase()}</span>
      </div>
    </div>
  );
};
