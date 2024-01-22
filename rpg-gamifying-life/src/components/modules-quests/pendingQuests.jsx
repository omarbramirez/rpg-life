/* eslint-disable react/prop-types */
import axios from 'axios'


const PendingQuests = ({pendingQuests,updateQuestData}) =>{

const updateQuest = async(questIndex, questXP)=>{
    const questData ={
        index: questIndex,
        questXP: questXP
    }
    try{
        await axios.put('http://localhost:4000/update-quest', questData).then(()=>{
                updateQuestData()
        })
    } catch(error){
        console.error("Error fetching quest data: ", error)
    }
}

    return(
        <>
        <table>
                                <thead>
                                    <tr>
                                        <td><h3>Tareas Pendientes</h3></td>
                                    </tr>
                                </thead>
                                <tbody>
                        {pendingQuests.map((data, index) => (
                                    <tr key={`active-quest-${index}`}>
                                        <td >
                                            <ul>
                                                                   <li id={data.index}>
                                                                    <div>

                                                                   {data.questName}
                                                                   <strong>{data.type}</strong>
                                                                   <button
                                                                className='checked'
                                                                onClick={()=>{
                                                                    updateQuest(data.index, data.questXP)
                                                                }}
                                                                >&#10004;</button>
                                                                   </div>
                                                        
                                                                <div>

                                                               <p>
                                                                   {data.description}
                                                               </p>
                                                                </div>
                                                               </li>
                                            </ul>
                                        </td>
                                        <td>
                                            <ul>
                                                <li>{data.questXP} XP</li>
                                            </ul>
                                        </td>
                                    </tr>
                                    ))
                                }
                                </tbody>
                            </table>
        </>
    )
}

export default PendingQuests;