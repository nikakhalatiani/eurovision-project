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
import { Column } from "./components/Column";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import "/node_modules/flag-icons/css/flag-icons.min.css";
import { SmartPointerSensor } from "./components/SmartPointerSensor";
import { SmartTouchSensor } from "./components/SmartTouchSensor";
import SendButton from "./components/SendButton";

type Item = {
  id: string;
  content: string;
  music: string;
  isCorrect?: boolean;
  guess?: number;
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
    { id: "IL", content: "Israel", music: "./music2/Israel.mp3" },        // Israel (Yuval)
    { id: "AT", content: "Austria", music: "./music2/Austria.mp3" },      // Austria (JJ - W)
    { id: "FI", content: "Finland", music: "./music2/Finland.mp3" },      // Finland (Erika V)
    { id: "MT", content: "Malta", music: "./music2/Malta.mp3" },          // Malta (Miriana)
    { id: "AU", content: "Australia", music: "./music2/Australia.mp3" },  // Australia (Go-J)
    { id: "CZ", content: "Czechia", music: "./music2/CzechRepublic.mp3" },      // Czechia (Adon)
    { id: "LT", content: "Lithuania", music: "./music2/Lithuania.mp3" },  // Lithuania (Kata)
    { id: "GR", content: "Greece", music: "./music2/Greece.mp3" },        // Greece (Klavdia)
    { id: "LU", content: "Luxembourg", music: "./music2/Luxembourg.mp3" },// Luxembourg
    { id: "RS", content: "Serbia", music: "./music2/Serbia.mp3" },        // Serbia (Princ - M)
  ];

  const finalists = [
    { id: "DE", content: "Germany", music: "./music2/Germany.mp3" },
    { id: "FR", content: "France", music: "./music2/France.mp3" },
    { id: "ES", content: "Spain", music: "./music2/Spain.mp3" },
    { id: "IT", content: "Italy", music: "./music2/Italy.mp3" },
    { id: "CH", content: "Switzerland", music: "./music2/Switzerland.mp3" },
    { id: "GB", content: "United Kingdom", music: "./music2/UnitedKingdom.mp3" },
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

    const realFinalists = [
      { id: "DE", content: "Germany", music: "./music2/Germany.mp3" },
      { id: "FR", content: "France", music: "./music2/France.mp3" },
      { id: "ES", content: "Spain", music: "./music2/Spain.mp3" },
      { id: "IT", content: "Italy", music: "./music2/Italy.mp3" },
      { id: "CH", content: "Switzerland", music: "./music2/Switzerland.mp3" },
      { id: "GB", content: "United Kingdom", music: "./music2/UnitedKingdom.mp3" },
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

  const [items, setItems] = useState(() => {
    // Get the saved items from localStorage if available, otherwise set a default list
    const savedItems = localStorage.getItem("RealcountryItems");
    return savedItems ? JSON.parse(savedItems) : firstSemiFinal;
  });
  const [playingMusicId, setPlayingMusicId] = useState<string | null>(null);
  const [hasPlayedMusic, setHasPlayedMusic] = useState(
    localStorage.getItem("RealhasPlayedMusic") === "true" || false
  );
  const [showTooltip, setShowTooltip] = useState(false);

  const [initialAnimationsPlayed, setInitialAnimationsPlayed] = useState(
    () => localStorage.getItem("RealinitialAnimationsPlayed") !== "true"
  );
  const [submissionDone, setSubmissionDone] = useState(
    localStorage.getItem("Realsubmitted") === "true" || false
  );
  const [content, setContent] = useState(
    localStorage.getItem("Realsubmitted") === "true"
      ? "Locked in"
      : localStorage.getItem("finalChangeHappened") === "true"? "Lock in the vote"
      : "Lock in top 10"
  );

  useEffect(() => {
    if (localStorage.getItem("RealinitialAnimationsPlayed") !== "true") {
      // If the animations haven't been played, set the flag and let the animations play
      localStorage.setItem("RealinitialAnimationsPlayed", "true");
      // timeout
      setTimeout(() => {
        setInitialAnimationsPlayed(false);
      }, 2000);
    } else {
      setInitialAnimationsPlayed(true); // this prevents the animation from playing on subsequent renders
    }
  }, []);

  useEffect(() => {
    // Save the items to localStorage whenever they change
    localStorage.setItem("RealcountryItems", JSON.stringify(items));
  }, [items]);

  // Function to compare the user's guessed finalists with the actual finalists
  const compareFinalResults = (actualFinalists: Item[]) => {
    const userFinalGuesses = JSON.parse(
      localStorage.getItem("userFinal") || "[]"
    );
    if (!userFinalGuesses.length) {
      alert("You have not submitted your final guesses!");
      return;
    }

    const results = userFinalGuesses.map((guess: Item) => {
      const actualIndex = actualFinalists.findIndex(
        (finalist: Item) => finalist.id === guess.id
      );
      const guessIndex = userFinalGuesses.findIndex(
        (finalist: Item) => finalist.id === guess.id
      );
      const positionDifference = guessIndex - actualIndex;

      return {
        ...guess,
        guess: positionDifference, // This directly shows how many positions off the guess was
      };
    });

    setItems(results);
  };

  useEffect(() => {
    const currentTime = new Date();
    const firstChange = new Date("2025-05-14T04:00:00Z");
    const semifinalChange = new Date("2025-05-15T19:00:00Z");
    const secondChange = new Date("2025-05-16T04:00:00Z");
    const finalChange = new Date("2025-05-17T19:00:00Z");
    const finalResultTime = new Date("2025-05-18T06:00:00Z");

    if (currentTime > finalResultTime) {
      if (localStorage.getItem("finalResultsCompared") !== "true") {
        compareFinalResults(realFinalists); 
        localStorage.setItem("finalResultsCompared", "true");
      }
    } else if (currentTime > finalChange) {
      if (localStorage.getItem("finalChangeHappened") !== "true") {
        setItems(finalists);
        resetItemsOrder();
        localStorage.setItem("finalChangeHappened", "true");
        setContent("Lock in the vote");
      }
    } else if (currentTime > secondChange) {
      if (localStorage.getItem("secondChangeHappened") !== "true") {
        compareResults(realsecondSemifinalists);
        handleLock();
        localStorage.setItem("secondChangeHappened", "true");
      }
    } else if (currentTime > semifinalChange) {
      if (localStorage.getItem("semifinalChangeHappened") !== "true") {
        setItems(secondSemiFinal);
        resetItemsOrder();
        localStorage.setItem("semifinalChangeHappened", "true");
      }
    } else if (currentTime > firstChange) {
      if (localStorage.getItem("firstChangeHappened") !== "true") {
        compareResults(realfirstSemifinalists);
        handleLock();
        localStorage.setItem("firstChangeHappened", "true");
      }
    }
    // else {
    //   setItems(firstSemiFinal);
    //   resetItemsOrder();
    //   localStorage.clear();
    // }
  }, []);

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

  const getCountryPos = (id: string) =>
    items.findIndex((item: Item) => item.id === id);

  const handleDragEnd = (event: any) => {
    setInitialAnimationsPlayed(true);
    localStorage.setItem("RealinitialAnimationsPlayed", "true");
    const { active, over } = event;

    if (!over) return; // prevent errors when dropping outside a valid area
    setItems((tasks: Item[]) => {
      const originalPos = getCountryPos(active.id);
      const newPos = getCountryPos(over.id);
      return arrayMove(tasks, originalPos, newPos);
    });
  };


  const handleSubmission = () => {
    if (!hasPlayedMusic) {
      alert(
        "Find hidden music player before submitting your vote. There is no going back!"
      );
      setShowTooltip(true);
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
    let country = playingMusicId?.slice(6);
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

  const compareResults = (realSemifinalists: Item[]) => {
    const userTopTen = JSON.parse(localStorage.getItem("userTopTen") || "[]");
    if (!userTopTen.length) {
      alert("You have not submitted your top 10!");
      return;
    }
    const matches = userTopTen.map((entry: Item) => ({
      ...entry,
      isCorrect: realSemifinalists.some(
        (finalist: Item) => finalist.id === entry.id
      ),
    }));
    setItems(matches);
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

  const sensors = useSensors(
    useSensor(SmartPointerSensor),
    useSensor(SmartTouchSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );
  return (
    <div className="App">
      <SVGComponent></SVGComponent>
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
  );
}

export default RApp;
