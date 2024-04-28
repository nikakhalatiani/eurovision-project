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
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./LandingPage";
import RApp from "./RApp";

function App() {
  // Existing App code remains here
  return (
    <Router basename="/eurovision-project">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/app" element={<MainApp />} />
        <Route path="/rapp" element={<RApp />} />
      </Routes>
    </Router>
  );
}

function MainApp() {
  const secondSemiFinal = [
    {
      id: "GB",
      content: "United Kingdom",
      music: "./music2/UnitedKingdom.mp3",
    },
    { id: "FI", content: "Finland", music: "./music2/Finland.mp3" },

    { id: "RS", content: "Serbia", music: "./music2/Serbia.mp3" },

    { id: "GR", content: "Greece", music: "./music2/Greece.mp3" },
  ];

  const firstSemiFinal = [
    { id: "NL", content: "Netherlands", music: "./music2/Netherlands.mp3" },
    { id: "CH", content: "Switzerland ", music: "./music2/Switzerland.mp3" },
    { id: "LU", content: "Luxembourg", music: "./music2/Luxembourg.mp3" },
    { id: "IT", content: "Italy", music: "./music2/Italy.mp3" },
    { id: "UA", content: "Ukraine", music: "./music2/Ukraine.mp3" },
    { id: "AZ", content: "Azerbaijan", music: "./music2/Azerbaijan.mp3" },
    { id: "BE", content: "Belgium", music: "./music2/Belgium.mp3" },
    { id: "FR", content: "France", music: "./music2/France.mp3" },
    { id: "LV", content: "Latvia", music: "./music2/Latvia.mp3" },
    { id: "GE", content: "Georgia", music: "./music2/Georgia.mp3" },
    { id: "IL", content: "Israel", music: "./music2/Israel.mp3" },
  ];

  const [items, setItems] = useState(() => {
    // Get the saved items from localStorage if available, otherwise set a default list
    const savedItems = localStorage.getItem("countryItems");
    return savedItems
      ? JSON.parse(savedItems)
      : firstSemiFinal.concat(secondSemiFinal);
  });
  const [playingMusicId, setPlayingMusicId] = useState<string | null>(null);
  const [hasPlayedMusic, setHasPlayedMusic] = useState(
    localStorage.getItem("hasPlayedMusic") === "true" || false
  );
  const [showTooltip, setShowTooltip] = useState(false);
  const [submissionDone, setSubmissionDone] = useState(
    localStorage.getItem("submitted") === "true" || false
  );

  const [content, setContent] = useState(
    localStorage.getItem("submitted") === "true"
      ? "Locked in"
      : "Lock in top 10"
  );

  const resetItemsOrder = () => {
    // if (localStorage.getItem("testFinalChangeHappened") === "true") {
    //   setItems(finalists); // Reset items to default
    // }else if (localStorage.getItem("testSemifinalChangeHappened") === "true") {
    //   setItems(secondSemiFinal); // Reset items to default
    // }else{
    setItems(firstSemiFinal.concat(secondSemiFinal)); // Reset items to default
    // }
    localStorage.removeItem("countryItems"); // Clear the saved order from localStorage
    localStorage.removeItem("submitted"); // Clear the submission flag
    setSubmissionDone(false); // Reset the submission state
    setContent("Lock in top 10"); // Reset the button text
  };

  const [initialAnimationsPlayed, setInitialAnimationsPlayed] = useState(
    () => localStorage.getItem("initialAnimationsPlayed") !== "true"
  );

  useEffect(() => {
    if (localStorage.getItem("initialAnimationsPlayed") !== "true") {
      // If the animations haven't been played, set the flag and let the animations play
      localStorage.setItem("initialAnimationsPlayed", "true");
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
    localStorage.setItem("countryItems", JSON.stringify(items));
  }, [items]);

  // useEffect(() => {
  //   const semifinalChange = new Date("2024-05-08T04:00:00Z");
  //   const finalChange = new Date("2024-05-10T04:00:00Z");
  //   const currentTime = new Date();
  //   if (currentTime > finalChange) {
  //     console.log("final change");
  //     // If after finalChange, load the finalists and reset order
  //     if (localStorage.getItem("testFinalChangeHappened") !== "true") {
  //       console.log("final change happened");
  //       resetItemsOrder();
  //       setItems(finalists);
  //       localStorage.setItem("testFinalChangeHappened", "true");
  //     }
  //   } else if (currentTime > semifinalChange) {
  //     console.log("semi change");
  //     // If after semifinalChange, load the second semifinal and reset order
  //     if (localStorage.getItem("testSemifinalChangeHappened") !== "true") {
  //       console.log("semi change happened");
  //       resetItemsOrder();
  //       setItems(secondSemiFinal);
  //       localStorage.setItem("testSemifinalChangeHappened", "true");
  //     }
  //   }
  // }, []);

  const getCountryPos = (id: string) =>
    items.findIndex((item: any) => item.id === id);

  const handleDragEnd = (event: any) => {
    setInitialAnimationsPlayed(true);
    localStorage.setItem("initialAnimationsPlayed", "true");
    const { active, over } = event;

    if (!over) return; // Add this line to prevent errors when dropping outside a valid area

    setItems((tasks: any) => {
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
      return; // Exit the function to prevent further execution until music is played
    }

    const elementsToAnimate = document.querySelectorAll(
      ".country:not(:nth-child(-n+10))"
    );
    setSubmissionDone(true);
    localStorage.setItem("submitted", "true");
    setSubmissionDone(true);
    setContent("Locked in");
    if (elementsToAnimate.length === 0) {
      return;
    }
    let country = playingMusicId?.slice(6);
    console.log(country);
    // check if the country is in the top 10
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

    // Assuming each country has equal height or you calculate this dynamically
    const totalHeight = Array.from(elementsToAnimate).reduce(
      (acc, el) => acc + (el as HTMLElement).offsetHeight,
      0
    );

    // Apply the animation class to these elements
    elementsToAnimate.forEach((el) => el.classList.add("fallAndFade"));

    // Move the SendButton up by adjusting its style
    // This example assumes you've wrapped your SendButton in a div with a class for easy targeting
    const sendButton = document.querySelector(".s-button") as HTMLElement;
    if (sendButton) {
      sendButton.style.transform = `translateY(${totalHeight}px)`;
    }

    // Wait for the animation to complete before updating the state
    setTimeout(() => {
      setItems(items.slice(0, 10)); // Only keep the first 10 items
      // Optionally reset the SendButton's position after the state update if needed
      if (sendButton) {
        sendButton.style.transform = ``;
      }
    }, 1000); // This duration should match the duration of the CSS animation
  };

  const playMusic = (id: string) => {
    setHasPlayedMusic(true);
    localStorage.setItem("hasPlayedMusic", "true");
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
        // Otherwise, render it with the DndContext to allow dragging
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

export default App;
