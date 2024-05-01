// import 'dotenv/config';
import { useState, useEffect } from 'react';
import './App.css';
import { Schedule } from './components/schedule';
import { Quests } from './components/quests';
import {Stats} from './components/stats'

function App() {

  const initialSection = localStorage.getItem('currentModuleIndex') || 0;
  const [currentModuleIndex, setCurrentModuleIndex] = useState(parseInt(initialSection));

  useEffect(() => {
    localStorage.setItem('currentModuleIndex', currentModuleIndex.toString());
  }, [currentModuleIndex]);


  const modules = [<Schedule key={`Schedule`}/>, <Quests key={`Quests`}/>];

  const handleScheduleModule = () => {
    setCurrentModuleIndex(0);
  };
  const handleQuestModule = () => {
    setCurrentModuleIndex(1);
  };

  return (
    <>
<h2 style={{textAlign: 'center'}}>CAPITULO V: CENOTES MARGARET HAMILTON</h2>
      <div id='mainScreen'>
<div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
  <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', width: '400px', margin:'auto' }}>
  <button onClick={handleScheduleModule}>Schedule</button>
  <button onClick={handleQuestModule}>Quests</button>
  </div>
      {modules[currentModuleIndex]}
</div>
        <Stats/>
      </div>
    </>
  );
}

export default App;
