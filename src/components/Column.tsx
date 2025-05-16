
// src/Column.tsx - Optimized version
import React, { memo } from "react";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import "./Column.css";
import { Country } from "./Country";

type Item = {
  id: string;
  content: string;
  music: string;
  isCorrect?: boolean;
  guess?: number;
};

type ColumnProps = {
  items: Item[];
  playMusic: (music: string) => void;
  playingMusicId: string | null;
  showTooltip: boolean;
  setShowTooltip: (showTooltip: boolean) => void;
  initialAnimationsPlayed: boolean;
};

// Use React.memo to prevent unnecessary re-renders
export const Column = memo(({
  items,
  playMusic,
  playingMusicId,
  showTooltip,
  setShowTooltip,
  initialAnimationsPlayed,
}: ColumnProps) => {
  // Create a memoized version of the items array for SortableContext
  // This prevents unnecessary re-rendering when other props change
  const itemIds = React.useMemo(() => items.map(item => item.id), [items]);
  
  return (
    <div className="column">
      <SortableContext items={itemIds} strategy={verticalListSortingStrategy}>
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
            className={
              index < 2 && !initialAnimationsPlayed
                ? "animate-" + (index + 1)
                : ""
            }
            checkmark={item.isCorrect}
            guess={item.guess}
          />
        ))}
      </SortableContext>
    </div>
  );
});

// Add display name for debugging
Column.displayName = 'Column';