/* eslint-disable react/prop-types */
import axios from 'axios'


const ActiveQuests = ({activeQuests,updateQuestData}) =>{
    const removeQuest =async(questIndex)=>{
        const questData = {
            index: questIndex
        }
        try{
            await axios.delete('http://localhost:4000/delete-quest', {data: questData}).then(()=>{
                updateQuestData()
            })
        } catch(error){
            console.error("Error fetching quest data: ", error)
        }
    }

const updateQuest = async(questIndex)=>{
    const questData ={
        index: questIndex
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
                                        <td><h3>Tareas Activas</h3></td>
                                    </tr>
                                </thead>
                                <tbody>
                        {activeQuests.map((data, index) => (
                                    <tr key={`active-quest-${index}`}>
                                        <td >
                                            <ul>
                                                                   <li id={data.index}>
                                                                    <div style={{margin:'20px 0px 20px 0px'}}>

                                                                   {data.questName}
                                                                   <strong>{data.type}</strong>
                                                                   </div>
                                                                   <div>
                                                               <span>
                                                                <button
                                                                className='checked'
                                                                onClick={()=>{
                                                                    updateQuest(data.index)
                                                                }}
                                                                >&#10004;</button>
                                                                   <button onClick={()=>removeQuest(data.index)}>Eliminar</button>
                                                               </span>
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

export default ActiveQuests;