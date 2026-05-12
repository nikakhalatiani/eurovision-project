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

const getBaseContestState = (fallbackItems: CountryItem[]): InitialContestState => ({
  items: readStoredCountryItems("RealcountryItems", fallbackItems),
  submissionDone: localStorage.getItem("Realsubmitted") === "true",
  content: getStoredRealContent(),
  storageWrites: [],
  storageRemovals: [],
});

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
    localStorage.getItem("secondChangeHappened") !== "true"
  ) {
    const userTopTen = readStoredCountryItems("userTopTen", []);
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
    localStorage.getItem("firstChangeHappened") !== "true"
  ) {
    const userTopTen = readStoredCountryItems("userTopTen", []);
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

function RApp() {
  const firstSemiFinal = [
    { id: "IS", content: "Iceland", music: "./music2/Iceland.mp3" },      // 1st
    { id: "PL", content: "Poland", music: "./music2/Poland.mp3" },        // 2nd
    { id: "SI", content: "Slovenia", music: "./music2/Slovenia.mp3" },    // 3rd
    { id: "EE", content: "Estonia", music: "./music2/Estonia.mp3" },      // 4th (not in original list, music path assumed)
    { id: "UA", content: "Ukraine", music: "./music2/Ukraine.mp3" },      // 5th
    { id: "SE", content: "Sweden", music: "./music2/Sweden.mp3" },        // 6th (not in original list, music path assumed)
    { id: "PT", content: "Portugal", music: "./music2/Portugal.mp3" },    // 7th
    { id: "NO", content: "Norway", music: "./music2/Norway.mp3" },        // 8th (not in original list, music path assumed)
    { id: "BE", content: "Belgium", music: "./music2/Belgium.mp3" },      // 9th (not in original list, music path assumed)
    { id: "AZ", content: "Azerbaijan", music: "./music2/Azerbaijan.mp3" },// 10th
    { id: "SM", content: "San Marino", music: "./music2/SanMarino.mp3" }, // 11th (not in original list, music path assumed)
    { id: "AL", content: "Albania", music: "./music2/Albania.mp3" },      // 12th (not in original list, music path assumed)
    { id: "NL", content: "Netherlands", music: "./music2/Netherlands.mp3" }, // 13th (not in original list, music path assumed)
    { id: "HR", content: "Croatia", music: "./music2/Croatia.mp3" },      // 14th
    { id: "CY", content: "Cyprus", music: "./music2/Cyprus1.mp3" },       // 15th
  ];

  const realfirstSemifinalists = [
    { id: "NO", content: "Norway", music: "./music2/Norway.mp3" },        // 1st
    { id: "AL", content: "Albania", music: "./music2/Albania.mp3" },      // 2nd
    { id: "SE", content: "Sweden", music: "./music2/Sweden.mp3" },        // 3rd
    { id: "IS", content: "Iceland", music: "./music2/Iceland.mp3" },      // 4th
    { id: "NL", content: "Netherlands", music: "./music2/Netherlands.mp3" }, // 5th
    { id: "PL", content: "Poland", music: "./music2/Poland.mp3" },        // 6th
    { id: "SM", content: "San Marino", music: "./music2/SanMarino.mp3" }, // 7th
    { id: "EE", content: "Estonia", music: "./music2/Estonia.mp3" },      // 8th
    { id: "PT", content: "Portugal", music: "./music2/Portugal.mp3" },    // 9th
    { id: "UA", content: "Ukraine", music: "./music2/Ukraine.mp3" },      // 10th
  ];

  const secondSemiFinal = [
    { id: "AU", content: "Australia", music: "./music2/Australia.mp3" },    // 1st
    { id: "ME", content: "Montenegro", music: "./music2/Montenegro.mp3" },  // 2nd (not in original list, music path assumed)
    { id: "IE", content: "Ireland", music: "./music2/Ireland.mp3" },        // 3rd
    { id: "LV", content: "Latvia", music: "./music2/Latvia.mp3" },          // 4th (not in original list, music path assumed)
    { id: "AM", content: "Armenia", music: "./music2/Armenia.mp3" },        // 5th
    { id: "AT", content: "Austria", music: "./music2/Austria.mp3" },        // 6th (not in original list, music path assumed)
    { id: "GR", content: "Greece", music: "./music2/Greece.mp3" },          // 7th (not in original list, music path assumed)
    { id: "LT", content: "Lithuania", music: "./music2/Lithuania.mp3" },    // 8th
    { id: "MT", content: "Malta", music: "./music2/Malta.mp3" },            // 9th (not in original list, music path assumed)
    { id: "GE", content: "Georgia", music: "./music2/Georgia.mp3" },        // 10th (not in original list, music path assumed)
    { id: "DK", content: "Denmark", music: "./music2/Denmark.mp3" },        // 11th (not in original list, music path assumed)
    { id: "CZ", content: "Czechia", music: "./music2/CzechRepublic.mp3" },        // 12th (not in original list, music path assumed)
    { id: "LU", content: "Luxembourg", music: "./music2/Luxembourg.mp3" },  // 13th
    { id: "IL", content: "Israel", music: "./music2/Israel.mp3" },          // 14th (not in original list, music path assumed)
    { id: "RS", content: "Serbia", music: "./music2/Serbia.mp3" },          // 15th
    { id: "FI", content: "Finland", music: "./music2/Finland.mp3" },        // 16th
  ];

  const realsecondSemifinalists = [
    { id: "LV", content: "Latvia", music: "./music2/Latvia.mp3" },          // 4th (not in original list, music path assumed)
    { id: "AM", content: "Armenia", music: "./music2/Armenia.mp3" },        // 5th
    { id: "AT", content: "Austria", music: "./music2/Austria.mp3" },        // 6th (not in original list, music path assumed)
    { id: "GR", content: "Greece", music: "./music2/Greece.mp3" },          // 7th (not in original list, music path assumed)
    { id: "LT", content: "Lithuania", music: "./music2/Lithuania.mp3" },    // 8th
    { id: "MT", content: "Malta", music: "./music2/Malta.mp3" },            // 9th (not in original list, music path assumed)
    { id: "DK", content: "Denmark", music: "./music2/Denmark.mp3" },        // 11th (not in original list, music path assumed)
    { id: "LU", content: "Luxembourg", music: "./music2/Luxembourg.mp3" },  // 13th
    { id: "IL", content: "Israel", music: "./music2/Israel.mp3" },          // 14th (not in original list, music path assumed)
    { id: "FI", content: "Finland", music: "./music2/Finland.mp3" },
  ];

  const finalists = [
    { id: "NO", content: "Norway", music: "./music2/Norway.mp3" },        // 1st
    { id: "LU", content: "Luxembourg", music: "./music2/Luxembourg.mp3" }, // 2nd
    { id: "EE", content: "Estonia", music: "./music2/Estonia.mp3" },      // 3rd
    { id: "IL", content: "Israel", music: "./music2/Israel.mp3" },        // Israel (Yuval)
    { id: "LT", content: "Lithuania", music: "./music2/Lithuania.mp3" },    // 8th
    { id: "ES", content: "Spain", music: "./music2/Spain.mp3" },        // 4th`
    { id: "UA", content: "Ukraine", music: "./music2/Ukraine.mp3" },      // 5th
    { id: "GB", content: "United Kingdom", music: "./music2/UnitedKingdom.mp3" }, // 6th
    { id: "AT", content: "Austria", music: "./music2/Austria.mp3" },      // 7th
    { id: "IS", content: "Iceland", music: "./music2/Iceland.mp3" },      // 8th
    { id: "LV", content: "Latvia", music: "./music2/Latvia.mp3" },        // 9th
    { id: "NL", content: "Netherlands", music: "./music2/Netherlands.mp3" }, // 10th
    { id: "FI", content: "Finland", music: "./music2/Finland.mp3" },      // 11th
    { id: "IT", content: "Italy", music: "./music2/Italy.mp3" },        // 12th
    { id: "PL", content: "Poland", music: "./music2/Poland.mp3" },        // 13th
    { id: "DE", content: "Germany", music: "./music2/Germany.mp3" },      // 14th
    { id: "GR", content: "Greece", music: "./music2/Greece.mp3" },        // 15th
    { id: "AM", content: "Armenia", music: "./music2/Armenia.mp3" },        // 16th
    { id: "CH", content: "Switzerland", music: "./music2/Switzerland.mp3" }, // 17th
    { id: "MT", content: "Malta", music: "./music2/Malta.mp3" },          // 18th
    { id: "PT", content: "Portugal", music: "./music2/Portugal.mp3" },    // 19th
    { id: "DK", content: "Denmark", music: "./music2/Denmark.mp3" },        // 20th
    { id: "SE", content: "Sweden", music: "./music2/Sweden.mp3" },        // 21st
    { id: "FR", content: "France", music: "./music2/France.mp3" },        // 22nd
    { id: "SM", content: "San Marino", music: "./music2/SanMarino.mp3" }, // 23rd
    { id: "AL", content: "Albania", music: "./music2/Albania.mp3" },      // 24th

  ];

  const realFinalists = [
    { id: "AT", content: "Austria", music: "./music2/Austria.mp3" }, // 1st
    { id: "IL", content: "Israel", music: "./music2/Israel.mp3" },        // Israel (Yuval)
    { id: "EE", content: "Estonia", music: "./music2/Estonia.mp3" },      // 3rd
    { id: "SE", content: "Sweden", music: "./music2/Sweden.mp3" },        // 21st
    { id: "IT", content: "Italy", music: "./music2/Italy.mp3" },        // 12th
    { id: "GR", content: "Greece", music: "./music2/Greece.mp3" },        // 15th
    { id: "FR", content: "France", music: "./music2/France.mp3" },        // 22nd
    { id: "AL", content: "Albania", music: "./music2/Albania.mp3" },      // 24th
    { id: "UA", content: "Ukraine", music: "./music2/Ukraine.mp3" },      // 5th
    { id: "CH", content: "Switzerland", music: "./music2/Switzerland.mp3" }, // 17th
    { id: "FI", content: "Finland", music: "./music2/Finland.mp3" },      // 11th
    { id: "NL", content: "Netherlands", music: "./music2/Netherlands.mp3" }, // 10th
    { id: "LV", content: "Latvia", music: "./music2/Latvia.mp3" },        // 9th
    { id: "PL", content: "Poland", music: "./music2/Poland.mp3" },        // 13th
    { id: "DE", content: "Germany", music: "./music2/Germany.mp3" },      // 14th
    { id: "LT", content: "Lithuania", music: "./music2/Lithuania.mp3" },    // 8th
    { id: "MT", content: "Malta", music: "./music2/Malta.mp3" },          // 18th
    { id: "NO", content: "Norway", music: "./music2/Norway.mp3" },        // 1st
    { id: "GB", content: "United Kingdom", music: "./music2/UnitedKingdom.mp3" }, // 6th
    { id: "AM", content: "Armenia", music: "./music2/Armenia.mp3" },        // 16th
    { id: "PT", content: "Portugal", music: "./music2/Portugal.mp3" },    // 19th
    { id: "LU", content: "Luxembourg", music: "./music2/Luxembourg.mp3" }, // 2nd
    { id: "DK", content: "Denmark", music: "./music2/Denmark.mp3" },        // 20th
    { id: "ES", content: "Spain", music: "./music2/Spain.mp3" },        // 4th`
    { id: "IS", content: "Iceland", music: "./music2/Iceland.mp3" },      // 8th
    { id: "SM", content: "San Marino", music: "./music2/SanMarino.mp3" }, // 23rd
  ];

  const [initialContestState] = useState(() =>
    buildInitialContestState({
      firstSemiFinal,
      realFirstSemifinalists: realfirstSemifinalists,
      secondSemiFinal,
      realSecondSemifinalists: realsecondSemifinalists,
      finalists,
      realFinalists,
    })
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

    if (new Date() < getContestTime("finalStart")) {
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

    handleLock();

    const elementsToAnimate = document.querySelectorAll(
      ".country:not(:nth-child(-n+10))" // Select all countries except the first 10
    );
    if (elementsToAnimate.length === 0) {
      return;
    }

    localStorage.setItem("userTopTen", JSON.stringify(items.slice(0, 10)));
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
      setItems(items.slice(0, 10));
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
  const topCountryCode = items[0]?.id ?? "CH";

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
