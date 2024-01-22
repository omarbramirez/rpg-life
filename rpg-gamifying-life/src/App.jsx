// import 'dotenv/config';
import { useState } from 'react';
import './App.css';
import { Schedule } from './components/schedule';
import { Quests } from './components/quests';
import {Stats} from './components/stats'

function App() {
  const [currentModuleIndex, setCurrentModuleIndex] = useState(2);

  const modules = [<Schedule key={`Schedule`}/>, <Quests key={`Quests`}/>, <Stats key={`Stats`}/>];

  const handleScheduleModule = () => {
    setCurrentModuleIndex(0);
  };
  const handleQuestModule = () => {
    setCurrentModuleIndex(1);
  };
  const handleStatsModule =()=>{
    setCurrentModuleIndex(2);
  }


  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly' }}>
        <button onClick={handleScheduleModule}>Schedule</button>
        <button onClick={handleQuestModule}>Quests</button>
        <button onClick={handleStatsModule}>Stats</button>
      </div>
      {modules[currentModuleIndex]}
    </>
  );
}

export default App;
