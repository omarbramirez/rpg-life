/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
const baseURL =import.meta.env.VITE_REACT_APP_API_URL
import axios from "axios";
import ActiveQuests from "./modules-quests/activeQuests"
import CompletedQuests from "./modules-quests/completedQuests"
import PendingQuests from "./modules-quests/pendingQuests"
import NewQuestForm from "./modules-quests/newQuestForm";




export const Quests = ({updateStats}) => {

    const [sideQuestListData, setSideQuestListData] = useState(null)

    useEffect(() => {
        axiosFetchQuests()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
      
    const updateQuestData= ()=>{
        axiosFetchQuests() 

    }

    const axiosFetchQuests = async () => {
        // console.log('It\'s working');
        try {
            const res = await axios.get(`${baseURL}/questList`);
            const questList = res.data;
            setSideQuestListData(questList);
            updateStats();
            // console.log(sideQuestListData);
        } catch (error) {
            console.error("Error fetching quest data: ", error);
        }
    }

    return (
        <>
            {sideQuestListData ? (
                <>
                    <div>
                <h2 style={{textAlign: 'center'}}>TAREAS</h2>
                          <NewQuestForm updateQuestData={updateQuestData}/>
                          <ActiveQuests activeQuests={sideQuestListData.activeQuests} updateQuestData={updateQuestData}/>  
                          <PendingQuests pendingQuests={sideQuestListData.pendingQuests} updateQuestData={updateQuestData}/>
                          <CompletedQuests completedQuests={sideQuestListData.completedQuests}/>
                    </div>
                </>
            ) : (
                <p>Cargando misiones...</p>
            )}
        </>
    )
}
