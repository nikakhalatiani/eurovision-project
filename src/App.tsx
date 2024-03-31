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
function App() {
  const firstSemiFinal = [
    { id: "CY", content: "Cyprus", music: "./src/music2/Cyprus1.mp3" },
    { id: "RS", content: "Serbia", music: "./src/music2/Serbia.mp3" },
    { id: "LT", content: "Lithuania", music: "./src/music2/Lithuania.mp3" },
    { id: "IE", content: "Ireland", music: "./src/music2/Ireland.mp3" },
    { id: "UA", content: "Ukraine", music: "./src/music2/Ukraine.mp3" },
    { id: "PL", content: "Poland", music: "./src/music2/Poland.mp3" },
    { id: "HR", content: "Croatia", music: "./src/music2/Croatia.mp3" },
    { id: "IS", content: "Iceland", music: "./src/music2/Iceland.mp3" },
    { id: "SI", content: "Slovenia", music: "./src/music2/Slovenia.mp3" },
    { id: "FI", content: "Finland", music: "./src/music2/Finland.mp3" },
    { id: "MD", content: "Moldova", music: "./src/music2/Moldova.mp3" },
    { id: "AZ", content: "Azerbaijan", music: "./src/music2/Azerbaijan.mp3" },
    { id: "AU", content: "Australia", music: "./src/music2/Australia.mp3" },
    { id: "PT", content: "Portugal", music: "./src/music2/Portugal.mp3" },
    { id: "LU", content: "Luxembourg", music: "./src/music2/Luxembourg.mp3" },
  ];

  const secondSemiFinal = [
    { id: "MT", content: "Malta", music: "./src/music2/Malta.mp3" },
    { id: "AL", content: "Albania", music: "./src/music2/Albania.mp3" },
    { id: "GR", content: "Greece", music: "./src/music2/Greece.mp3" },
    { id: "CH", content: "Switzerland ", music: "./src/music2/Switzerland.mp3" },
    {
      id: "CZ",
      content: "Czech Republic",
      music: "./src/music2/CzechRepublic.mp3",
    },
    { id: "AT", content: "Austria", music: "./src/music2/Austria.mp3" },
    { id: "DK", content: "Denmark", music: "./src/music2/Denmark.mp3" },
    { id: "AM", content: "Armenia", music: "./src/music2/Armenia.mp3" },
    { id: "LV", content: "Latvia", music: "./src/music2/Latvia.mp3" },
    { id: "SM", content: "San Marino", music: "./src/music2/SanMarino.mp3" },
    { id: "GE", content: "Georgia", music: "./src/music2/Georgia.mp3" },
    { id: "BE", content: "Belgium", music: "./src/music2/Belgium.mp3" },
    { id: "EE", content: "Estonia", music: "./src/music2/Estonia.mp3" },
    { id: "IL", content: "Israel", music: "./src/music2/Israel.mp3" },
    { id: "NO", content: "Norway", music: "./src/music2/Norway.mp3" },
    { id: "NL", content: "Netherlands", music: "./src/music2/Netherlands.mp3" },
  ];

  const finalists = [
    { id: "SE", content: "Sweden", music: "./src/music2/Sweden.mp3" },
    { id: "FR", content: "France", music: "./src/music2/France.mp3" },
    { id: "IT", content: "Italy", music: "./src/music2/Italy.mp3" },
    {
      id: "GB",
      content: "United Kingdom",
      music: "./src/music2/UnitedKingdom.mp3",
    },
    { id: "DE", content: "Germany", music: "./src/music2/Germany.mp3" },
    { id: "ES", content: "Spain", music: "./src/music2/Spain.mp3" },
  ];

  const [items, setItems] = useState(finalists.concat(firstSemiFinal).concat(secondSemiFinal));
  const [playingMusicId, setPlayingMusicId] = useState<string | null>(null);


  // useEffect(() => {
  //   const semifinalChange = new Date("2024-05-08T22:00:00Z");
  //   const finalChange = new Date("2024-05-10T22:00:00Z");
  //   const currentTime = new Date();
  //   if (currentTime > semifinalChange) {
  //     if (currentTime > finalChange) {
  //       setItems(finalists);
  //     } else {
  //       setItems(secondSemiFinal);
  //     }
  //   }
  // }, []);

  const getCountryPos = (id: string) =>
    items.findIndex((item) => item.id === id);

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (!over) return; // Add this line to prevent errors when dropping outside a valid area
    setItems((tasks) => {
      const originalPos = getCountryPos(active.id);
      const newPos = getCountryPos(over.id);
      return arrayMove(tasks, originalPos, newPos);
    });
  };

  const handleSubmission = () => {
 
    const elementsToAnimate = document.querySelectorAll('.country:not(:nth-child(-n+10))');

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
    const totalHeight = Array.from(elementsToAnimate).reduce((acc, el) => acc + (el as HTMLElement).offsetHeight, 0);
  
    // Apply the animation class to these elements
    elementsToAnimate.forEach(el => el.classList.add('fallAndFade'));
  
    // Move the SendButton up by adjusting its style
    // This example assumes you've wrapped your SendButton in a div with a class for easy targeting
    const sendButton = document.querySelector('.s-button') as HTMLElement;
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
  }
  
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

  const sensors = useSensors(
    useSensor(SmartPointerSensor),
    useSensor(SmartTouchSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );
  return (
    <div className="App">
      <SVGComponent></SVGComponent>
      <DndContext
        collisionDetection={closestCorners}
        onDragEnd={handleDragEnd}
        sensors={sensors}
      >
        <Column items={items} playMusic={playMusic} playingMusicId={playingMusicId} />
      </DndContext>
      <SendButton handleSubmission={handleSubmission}></SendButton>
    </div>
  );
}

export default App;
