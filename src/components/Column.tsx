type ColumnProps = {
  items: { id: string; content: string; music: string }[];
  playMusic: (music: string) => void;
  playingMusicId: string | null;
  showTooltip : boolean;
  setShowTooltip: (showTooltip: boolean) => void;
};

import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import "./Column.css";
import { Country } from "./Country.tsx";

export const Column = ({ items, playMusic, playingMusicId, showTooltip, setShowTooltip}: ColumnProps) => {

 
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
          showTooltip={index === 0 && showTooltip}
          setShowTooltip={setShowTooltip}
          />
        ))}
      </SortableContext>
    </div>
  );
};
