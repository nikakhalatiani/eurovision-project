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
function App() {
  const firstSemiFinal = [
    { id: "CY", content: "Cyprus", music: "./src/music/Cyprus.mp3" },
    { id: "RS", content: "Serbia", music: "./src/music/Serbia.mp3" },
    { id: "LT", content: "Lithuania", music: "./src/music/Lithuania.mp3" },
    { id: "IE", content: "Ireland", music: "./src/music/Ireland.mp3" },
    { id: "UA", content: "Ukraine", music: "./src/music/Ukraine.mp3" },
    { id: "PL", content: "Poland", music: "./src/music/Poland.mp3" },
    { id: "HR", content: "Croatia", music: "./src/music/Croatia.mp3" },
    { id: "IS", content: "Iceland", music: "./src/music/Iceland.mp3" },
    { id: "SI", content: "Slovenia", music: "./src/music/Slovenia.mp3" },
    { id: "FI", content: "Finland", music: "./src/music/Finland.mp3" },
    { id: "MD", content: "Moldova", music: "./src/music/Moldova.mp3" },
    { id: "AZ", content: "Azerbaijan", music: "./src/music/Azerbaijan.mp3" },
    { id: "AU", content: "Australia", music: "./src/music/Australia.mp3" },
    { id: "PT", content: "Portugal", music: "./src/music/Portugal.mp3" },
    { id: "LU", content: "Luxembourg", music: "./src/music/Luxembourg.mp3" },
  ];

  const secondSemiFinal = [
    { id: "MT", content: "Malta", music: "./src/music/Malta.mp3" },
    { id: "Al", content: "Albania", music: "./src/music/Albania.mp3" },
    { id: "GR", content: "Greece", music: "./src/music/Greece.mp3" },
    { id: "CH", content: "Switzerland ", music: "./src/music/Switzerland.mp3" },
    {
      id: "CZ",
      content: "Czech Republic",
      music: "./src/music/CzechRepublic.mp3",
    },
    { id: "AT", content: "Austria", music: "./src/music/Austria.mp3" },
    { id: "DK", content: "Denmark", music: "./src/music/Denmark.mp3" },
    { id: "AM", content: "Armenia", music: "./src/music/Armenia.mp3" },
    { id: "LV", content: "Latvia", music: "./src/music/Latvia.mp3" },
    { id: "SM", content: "San Marino", music: "./src/music/SanMarino.mp3" },
    { id: "GE", content: "Georgia", music: "./src/music/Georgia.mp3" },
    { id: "BE", content: "Belgium", music: "./src/music/Belgium.mp3" },
    { id: "EE", content: "Estonia", music: "./src/music/Estonia.mp3" },
    { id: "IL", content: "Israel", music: "./src/music/Israel.mp3" },
    { id: "NO", content: "Norway", music: "./src/music/Norway.mp3" },
    { id: "NL", content: "Netherlands", music: "./src/music/Netherlands.mp3" },
  ];

  const finalists = [
    { id: "SE", content: "Sweden", music: "./src/music/Sweden.mp3" },
    { id: "FR", content: "France", music: "./src/music/France.mp3" },
    { id: "IT", content: "Italy", music: "./src/music/Italy.mp3" },
    {
      id: "GB",
      content: "United Kingdom",
      music: "./src/music/UnitedKingdom.mp3",
    },
    { id: "DE", content: "Germany", music: "./src/music/Germany.mp3" },
    { id: "ES", content: "Spain", music: "./src/music/Spain.mp3" },
  ];

  const [items, setItems] = useState(firstSemiFinal);

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
        <Column items={items} />
      </DndContext>
    </div>
  );
}

export default App;
