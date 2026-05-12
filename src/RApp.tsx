import "./App.css";
import SVGComponent from "./components/SVGComponent";
import { useState, useEffect } from "react";
import {
  DndContext,
  KeyboardSensor,
  useSensor,
  useSensors,
  closestCorners,
} from "@dnd-kit/core";
import type { DragEndEvent } from "@dnd-kit/core";
import { Column } from "./components/Column";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import "/node_modules/flag-icons/css/flag-icons.min.css";
import { SmartPointerSensor } from "./components/SmartPointerSensor";
import { SmartTouchSensor } from "./components/SmartTouchSensor";
import SendButton from "./components/SendButton";
import HeartBackground from "./Background";
import { getContestTime } from "./eurovisionSchedule";
import type { CountryItem } from "./types";
import { readStoredCountryItems } from "./types";
import {
  finalResults2026,
  firstSemiFinal2026,
  firstSemiFinalQualifiers2026,
  grandFinalParticipants2026,
  secondSemiFinal2026,
  secondSemiFinalQualifiers2026,
} from "./contestants2026";

type ContestLists = {
  firstSemiFinal: CountryItem[];
  realFirstSemifinalists: CountryItem[];
  secondSemiFinal: CountryItem[];
  realSecondSemifinalists: CountryItem[];
  finalists: CountryItem[];
  realFinalists: CountryItem[];
};

type StorageWrite = readonly [key: string, value: string];

type InitialContestState = {
  items: CountryItem[];
  submissionDone: boolean;
  content: string;
  storageWrites: StorageWrite[];
  storageRemovals: string[];
  alertMessage?: string;
};

const getStoredRealContent = () =>
  localStorage.getItem("Realsubmitted") === "true"
    ? "Locked in"
    : localStorage.getItem("finalChangeHappened") === "true"
      ? "Lock in the vote"
      : "Lock in top 10";

const readStoredTopTen = (phaseItems: CountryItem[]) =>
  readStoredCountryItems("userTopTen", phaseItems.slice(0, 10), {
    allowedItems: phaseItems,
    allowSubsetOfFallback: true,
    expectedLength: Math.min(10, phaseItems.length),
    validateAgainstFallback: true,
  });

const readStoredFinalVote = (phaseItems: CountryItem[]) =>
  readStoredCountryItems("userFinal", phaseItems, {
    validateAgainstFallback: true,
  });

const readStoredCurrentItems = (
  fallbackItems: CountryItem[],
  submissionDone: boolean
) => {
  if (!submissionDone) {
    return readStoredCountryItems("RealcountryItems", fallbackItems, {
      validateAgainstFallback: true,
    });
  }

  if (localStorage.getItem("finalChangeHappened") === "true") {
    return readStoredFinalVote(fallbackItems);
  }

  return readStoredTopTen(fallbackItems);
};

const getBaseContestState = (
  fallbackItems: CountryItem[]
): InitialContestState => {
  const submissionDone = localStorage.getItem("Realsubmitted") === "true";

  return {
    items: readStoredCurrentItems(fallbackItems, submissionDone),
    submissionDone,
    content: getStoredRealContent(),
    storageWrites: [],
    storageRemovals: [],
  };
};

const markSemifinalResults = (
  userTopTen: CountryItem[],
  realSemifinalists: CountryItem[]
) =>
  userTopTen.map((entry) => ({
    ...entry,
    isCorrect: realSemifinalists.some((finalist) => finalist.id === entry.id),
  }));

const markFinalResults = (
  userFinalGuesses: CountryItem[],
  actualFinalists: CountryItem[]
) =>
  userFinalGuesses.map((guess) => {
    const actualIndex = actualFinalists.findIndex(
      (finalist) => finalist.id === guess.id
    );
    const guessIndex = userFinalGuesses.findIndex(
      (finalist) => finalist.id === guess.id
    );

    return {
      ...guess,
      guess: guessIndex - actualIndex,
    };
  });

const lockedContestState = (
  items: CountryItem[],
  storageWrites: StorageWrite[],
  alertMessage?: string
): InitialContestState => ({
  items,
  submissionDone: true,
  content: "Locked in",
  storageWrites: [["Realsubmitted", "true"], ...storageWrites],
  storageRemovals: [],
  alertMessage,
});

const resetContestState = (
  items: CountryItem[],
  content: string,
  storageWrites: StorageWrite[]
): InitialContestState => ({
  items,
  submissionDone: false,
  content,
  storageWrites,
  storageRemovals: ["RealcountryItems", "Realsubmitted", "userTopTen"],
});

const buildInitialContestState = (lists: ContestLists): InitialContestState => {
  const baseState = getBaseContestState(lists.firstSemiFinal);
  const currentTime = new Date();

  if (
    currentTime > getContestTime("finalResults") &&
    lists.realFinalists.length > 0 &&
    localStorage.getItem("finalResultsCompared") !== "true"
  ) {
    const userFinalGuesses = readStoredCountryItems("userFinal", []);
    return {
      ...baseState,
      items: userFinalGuesses.length
        ? markFinalResults(userFinalGuesses, lists.realFinalists)
        : baseState.items,
      storageWrites: [["finalResultsCompared", "true"]],
      alertMessage: userFinalGuesses.length
        ? undefined
        : "You have not submitted your final guesses!",
    };
  }

  if (
    currentTime > getContestTime("finalPreview") &&
    localStorage.getItem("finalChangeHappened") !== "true"
  ) {
    return resetContestState(lists.finalists, "Lock in the vote", [
      ["finalChangeHappened", "true"],
    ]);
  }

  if (
    currentTime > getContestTime("secondSemiResults") &&
    lists.realSecondSemifinalists.length > 0 &&
    localStorage.getItem("secondChangeHappened") !== "true"
  ) {
    const userTopTen = readStoredTopTen(lists.secondSemiFinal);
    return lockedContestState(
      userTopTen.length
        ? markSemifinalResults(userTopTen, lists.realSecondSemifinalists)
        : baseState.items,
      [["secondChangeHappened", "true"]],
      userTopTen.length ? undefined : "You have not submitted your top 10!"
    );
  }

  if (
    currentTime > getContestTime("secondSemiStart") &&
    localStorage.getItem("semifinalChangeHappened") !== "true"
  ) {
    return resetContestState(lists.secondSemiFinal, "Lock in top 10", [
      ["semifinalChangeHappened", "true"],
    ]);
  }

  if (
    currentTime > getContestTime("firstSemiResults") &&
    lists.realFirstSemifinalists.length > 0 &&
    localStorage.getItem("firstChangeHappened") !== "true"
  ) {
    const userTopTen = readStoredTopTen(lists.firstSemiFinal);
    return lockedContestState(
      userTopTen.length
        ? markSemifinalResults(userTopTen, lists.realFirstSemifinalists)
        : baseState.items,
      [["firstChangeHappened", "true"]],
      userTopTen.length ? undefined : "You have not submitted your top 10!"
    );
  }

  return baseState;
};

const contestLists2026: ContestLists = {
  firstSemiFinal: firstSemiFinal2026,
  realFirstSemifinalists: firstSemiFinalQualifiers2026,
  secondSemiFinal: secondSemiFinal2026,
  realSecondSemifinalists: secondSemiFinalQualifiers2026,
  finalists: grandFinalParticipants2026,
  realFinalists: finalResults2026,
};

const getCurrentDefaultItems = () => {
  const currentTime = new Date();

  if (currentTime > getContestTime("finalPreview")) {
    return contestLists2026.finalists;
  }

  if (currentTime > getContestTime("secondSemiStart")) {
    return contestLists2026.secondSemiFinal;
  }

  return contestLists2026.firstSemiFinal;
};

function RApp() {
  const [initialContestState] = useState(() =>
    buildInitialContestState(contestLists2026)
  );
  const [items, setItems] = useState<CountryItem[]>(initialContestState.items);
  const [playingMusicId, setPlayingMusicId] = useState<string | null>(null);
  const [hasPlayedMusic, setHasPlayedMusic] = useState(
    localStorage.getItem("RealhasPlayedMusic") === "true" || false
  );
  const [showTooltip, setShowTooltip] = useState(false);

  const [initialAnimationsPlayed, setInitialAnimationsPlayed] = useState(
    () => localStorage.getItem("RealinitialAnimationsPlayed") !== "true"
  );
  const [submissionDone, setSubmissionDone] = useState(
    initialContestState.submissionDone
  );
  const [content, setContent] = useState(initialContestState.content);

  useEffect(() => {
    initialContestState.storageRemovals.forEach((key) => {
      localStorage.removeItem(key);
    });
    initialContestState.storageWrites.forEach(([key, value]) => {
      localStorage.setItem(key, value);
    });
    if (initialContestState.alertMessage) {
      alert(initialContestState.alertMessage);
    }
  }, [initialContestState]);

  useEffect(() => {
    if (localStorage.getItem("RealinitialAnimationsPlayed") !== "true") {
      // If the animations haven't been played, set the flag and let the animations play
      localStorage.setItem("RealinitialAnimationsPlayed", "true");
      // timeout
      setTimeout(() => {
        setInitialAnimationsPlayed(false);
      }, 2000);
    }
  }, []);

  useEffect(() => {
    // Save the items to localStorage whenever they change
    localStorage.setItem("RealcountryItems", JSON.stringify(items));
  }, [items]);

  const resetItemsOrder = () => {
    setItems(getCurrentDefaultItems());
    localStorage.removeItem("RealcountryItems");
    localStorage.removeItem("Realsubmitted");
    localStorage.removeItem("userTopTen");
    setSubmissionDone(false);
    setContent("Lock in top 10");
  };

  const handleLock = () => {
    setSubmissionDone(true);
    localStorage.setItem("Realsubmitted", "true");
    setContent("Locked in");
  };

  const handleFinalSubmission = () => {
    setSubmissionDone(true);
    localStorage.setItem("Realsubmitted", "true");
    setContent("Locked in");
    localStorage.setItem("userFinal", JSON.stringify(items));
  };

  const getCountryPos = (tasks: CountryItem[], id: string) =>
    tasks.findIndex((item) => item.id === id);

  const handleDragEnd = (event: DragEndEvent) => {
    setInitialAnimationsPlayed(true);
    localStorage.setItem("RealinitialAnimationsPlayed", "true");
    const { active, over } = event;

    if (!over) return; // prevent errors when dropping outside a valid area
    setItems((tasks) => {
      const originalPos = getCountryPos(tasks, String(active.id));
      const newPos = getCountryPos(tasks, String(over.id));
      return arrayMove(tasks, originalPos, newPos);
    });
  };


  const handleSubmission = () => {
    if (!hasPlayedMusic) {
      alert(
        "Find hidden music player before submitting your vote!"
      );
      setShowTooltip(true);
      return;
    }

    const currentTime = new Date();
    const submissionStart =
      content === "Lock in the vote"
        ? getContestTime("finalStart")
        : currentTime > getContestTime("secondSemiStart")
          ? getContestTime("secondSemiStart")
          : getContestTime("firstSemiStart");

    if (currentTime < submissionStart) {
      alert(
        "You can only submit your vote after the show begins!"
      );
      return;
    }
    if (content === "Locked in") return;
    if (content === "Lock in the vote") {
      handleFinalSubmission();
      return;
    }

    const topTenItems = items.slice(0, 10);
    localStorage.setItem("userTopTen", JSON.stringify(topTenItems));
    handleLock();

    const elementsToAnimate = document.querySelectorAll(
      ".country:not(:nth-child(-n+10))" // Select all countries except the first 10
    );
    if (elementsToAnimate.length === 0) {
      setItems(topTenItems);
      return;
    }

    const country = playingMusicId?.slice(6);
    let isCountryInTop10 = false;
    for (let i = 0; i < 10; i++) {
      if (items[i].id === country) {
        isCountryInTop10 = true;
        break;
      }
    }
    if (!isCountryInTop10) {
      playMusic("");
    }

    const totalHeight = Array.from(elementsToAnimate).reduce(
      (acc, el) => acc + (el as HTMLElement).offsetHeight,
      0
    );
    elementsToAnimate.forEach((el) => el.classList.add("fallAndFade"));

    const sendButton = document.querySelector(".s-button") as HTMLElement;
    if (sendButton) {
      sendButton.style.transform = `translateY(${totalHeight}px)`;
    }

    setTimeout(() => {
      setItems(topTenItems);
      if (sendButton) {
        sendButton.style.transform = ``;
      }
    }, 1000);
  };

  const playMusic = (id: string) => {
    setHasPlayedMusic(true);
    localStorage.setItem("RealhasPlayedMusic", "true");
    if (playingMusicId !== id) {
      if (playingMusicId) {
        const audioElement = document.getElementById(
          playingMusicId
        ) as HTMLAudioElement;
        if (audioElement) {
          audioElement.pause();
          audioElement.currentTime = 0;
        }
      }
      setPlayingMusicId(id);
    }
  };
  const topCountryCode = items[0]?.id ?? "MD";

  const sensors = useSensors(
    useSensor(SmartPointerSensor),
    useSensor(SmartTouchSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );
  return (
    <>
      <HeartBackground country={topCountryCode} />
      <div className="App">
        <SVGComponent onClick={resetItemsOrder}></SVGComponent>
        {submissionDone ? (
          // If the submission is done, render the column without the DndContext
          <Column
            items={items}
            playMusic={playMusic}
            playingMusicId={playingMusicId}
            showTooltip={showTooltip}
            setShowTooltip={setShowTooltip}
            initialAnimationsPlayed={initialAnimationsPlayed}
          />
        ) : (
          <DndContext
            collisionDetection={closestCorners}
            onDragEnd={handleDragEnd}
            sensors={sensors}
          >
            <Column
              items={items}
              playMusic={playMusic}
              playingMusicId={playingMusicId}
              showTooltip={showTooltip}
              setShowTooltip={setShowTooltip}
              initialAnimationsPlayed={initialAnimationsPlayed}
            />
          </DndContext>
        )}
        <SendButton
          handleSubmission={handleSubmission}
          content={content}
        ></SendButton>
      </div>
    </>
  );
}

export default RApp;
