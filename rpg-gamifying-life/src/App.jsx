/* eslint-disable react/no-unknown-property */
// import 'dotenv/config';
import { useState, useEffect } from 'react';
import './App.css';
import { Schedule } from './components/schedule';
import { Quests } from './components/quests';
import {Stats} from './components/stats';
import axios from "axios";

function App() {
  const baseURL =import.meta.env.VITE_REACT_APP_API_URL
  const [statsData, setStatsData] = useState(null)
    const [levelup, setLevelup] = useState(true)
    

    const axiosFetchStats = async () => {
        await axios.get(`${baseURL}/stats`).then((res) => {
            const {data, levelup} = res.data
            setStatsData(data)
            setLevelup(levelup)

        }).catch((err)=>console.error(err))
    }

    const updateStats = ()=>{
        axiosFetchStats()
    }

  const initialSection = localStorage.getItem('currentModuleIndex') || 0;
  const [currentModuleIndex, setCurrentModuleIndex] = useState(parseInt(initialSection));

  useEffect(() => {
    localStorage.setItem('currentModuleIndex', currentModuleIndex.toString());
  }, [currentModuleIndex]);


  const modules = [<Schedule key={`Schedule`} updateStats={updateStats}/>, <Quests key={`Quests`} updateStats={updateStats}/>];

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
  <button onClick={handleScheduleModule} >Schedule</button>
  <button onClick={handleQuestModule} >Quests</button>
  </div>
      {modules[currentModuleIndex]}
</div>
        <Stats statsData={statsData} levelup={levelup} updateStats={updateStats}/>
      </div>
    </>
  );
}

export default App;
