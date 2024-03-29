type ColumnProps = {
  items: { id: string; content: string; music: string }[]; // Replace 'any' with the appropriate type for 'items'
};

import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import "./Column.css";
import { Country } from "./Country.tsx";
import { useState } from "react";

export const Column = ({ items }: ColumnProps) => {
  const [playingMusicId, setPlayingMusicId] = useState<string | null>(null);

  const playMusic = (id: string) => {
    if (playingMusicId !== id) {
      if (playingMusicId) {
        const audioElement = document.getElementById(playingMusicId) as HTMLAudioElement;
        if (audioElement) {
          audioElement.pause();
          audioElement.currentTime = 0;
        }
      }
      setPlayingMusicId(id);
    }
  };
  return (
    <div className="column">
      <SortableContext items={items} strategy={verticalListSortingStrategy}>
        {items.map((item, index) => (
          <Country
            key={item.id}
            id={item.id}
            content={item.content}
            index={index}
            music={item.music}
          playMusic={playMusic}
          isPlaying={playingMusicId === `audio-${item.id}`}
          />
        ))}
      </SortableContext>
    </div>
  );
};
