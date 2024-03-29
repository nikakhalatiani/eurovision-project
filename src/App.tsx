import './App.css'
import  SVGComponent  from './components/SVGComponent'
import { useState, useEffect } from 'react'
import {   DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
  TouchSensor
 } from '@dnd-kit/core'
import { Column } from './components/Column';
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import "/node_modules/flag-icons/css/flag-icons.min.css";
import { SmartPointerSensor } from './components/SmartPointerSensor';
import { SmartTouchSensor } from './components/SmartTouchSensor';
function App() {


  const firstSemiFinal= [
    {id: 'CY', content: 'Cyprus', music: './src/music/Cyprus.mp3'},
    {id: 'RS', content: 'Serbia', music: './src/music/Serbia.mp3'},
    {id: 'LT', content: 'Lithuania', music: './src/music/Lithuania.mp3'},
    {id: 'IE', content: 'Ireland', music: './src/music/Ireland.mp3'},
    {id: 'UA', content: 'Ukraine', music: './src/music/Ukraine.mp3'},
    {id: 'PL', content: 'Poland', music: './src/music/Poland.mp3'},
    {id: 'HR', content: 'Croatia', music: './src/music/Croatia.mp3'},
    {id: 'IS', content: 'Iceland', music: './src/music/Iceland.mp3'},
    {id: 'SI', content: 'Slovenia', music: './src/music/Slovenia.mp3'},
    {id: 'FI', content: 'Finland', music: './src/music/Finland.mp3'},
    {id: 'MD', content: 'Moldova', music: './src/music/Moldova.mp3'},
    {id: 'AZ', content: 'Azerbaijan', music: './src/music/Azerbaijan.mp3'},
    {id: 'AU', content: 'Australia', music: './src/music/Australia.mp3'},
    {id: 'PT', content: 'Portugal', music: './src/music/Portugal.mp3'},
    {id: 'LU', content: 'Luxembourg', music: './src/music/Luxembourg.mp3'},
  ];

  const secondSemiFinal = [
    {id: 'MT', content: 'Malta', flag: '🇲🇹'},
    {id: 'Al', content: 'Albania', flag: '🇦🇱'},
    {id: 'GR', content: 'Greece', flag: '🇬🇷'},
    {id: 'CH', content: 'Switzerland ', flag: '🇨🇭'},
    {id: 'CZ', content: 'Czech Republic', flag: '🇨🇿'},
    {id: 'AT', content: 'Austria', flag: '🇦🇹'},
    {id: 'DK', content: 'Denmark', flag: '🇩🇰'},
    {id: 'AM', content: 'Armenia', flag: '🇦🇲'},
    {id: 'LV', content: 'Latvia', flag: '🇱🇻'},
    {id: 'SM', content: 'San Marino', flag: '🇸🇲'},
    {id: 'GE', content: 'Georgia', flag: '🇬🇪'},
    {id: 'BE', content: 'Belgium', flag: '🇧🇪'},
    {id: 'EE', content: 'Estonia', flag: '🇪🇪'},
    {id: 'IL', content: 'Israel', flag: '🇮🇱'},
    {id: 'NO', content: 'Norway', flag: '🇳🇴'},
    {id: 'NL', content: 'Netherlands', flag: '🇳🇱'},
  ];      

  const finalists = [
    {id: 'SE', content: 'Sweden', flag: '🇸🇪'},
    {id: 'FR', content: 'France', flag: '🇫🇷'},
    {id: 'IT', content: 'Italy', flag: '🇮🇹'},
    {id: 'GB', content: 'United Kingdom', flag: '🇬🇧'},
    {id: 'DE', content: 'Germany', flag: '🇩🇪'},
    {id: 'ES', content: 'Spain', flag: '🇪🇸'},
  ];
  
  const [items, setItems] = useState(firstSemiFinal);


    useEffect(() => {
      console.log('useEffect');
      const semifinalChange = new Date("2024-05-08T22:00:00Z");
      const currentTime = new Date();
      if (currentTime > semifinalChange) {
        // setItems(secondSemiFinal);
      }
    },[]);

    const getCountryPos = (id: string) =>  items.findIndex(item => item.id === id);


    const handleDragStart = (event: any) => {
      const { active } = event;
      console.log('active', active);
      const audio = new Audio(active.music);
  
      // Initialize the audio file path and volume
      audio.volume = 1.0; // Start with full volume
  
      // Play the audio
      audio.play().catch(error => console.error("Error playing the audio file:", error));
    };
    
    const handleDragEnd = (event:any) => {
      const {active, over} = event;

      if (!over) return; // Add this line to prevent errors when dropping outside a valid area
      setItems(tasks => {
        const originalPos = getCountryPos(active.id);
        const newPos = getCountryPos(over.id);
        return arrayMove(tasks, originalPos, newPos);
      })
    };

    const sensors = useSensors(
      useSensor(SmartPointerSensor),
      useSensor(SmartTouchSensor),
      useSensor(KeyboardSensor, {coordinateGetter: sortableKeyboardCoordinates}),
    );
  return (
    <div className='App'>
      <SVGComponent></SVGComponent>
      <DndContext collisionDetection={closestCorners} onDragEnd={handleDragEnd} 
      sensors={sensors}>
        <Column items={items} />
      </DndContext>
    </div>
  )
}

export default App
