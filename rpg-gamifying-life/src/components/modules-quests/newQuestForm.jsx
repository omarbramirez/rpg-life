import { useState } from "react";
import axios from 'axios'

// eslint-disable-next-line react/prop-types
const NewQuestForm = ({updateQuestData}) => {
    const initialFormState = {
        questName: '',
        questXP: 0,
        type: "",
        description: "",
        index: 0
    }
    
    const [formData, setFormData] = useState(initialFormState);
    const [newQuest, setNewQuest] = useState('Agregar')
    const [onSuccess, setOnSuccess] = useState('')

    const handleEventForm = (event) => {
        const { name, value } = event.target
        if( value > 0){
            setFormData({
                ...formData,
                questXP: value
            })
        }
        if(name !== 'questXP'){
            setFormData({
                ...formData,
                [name]: value
            })
        }
    }
    
    const axiosPostQuest = async() => {
        await axios.post(`http://localhost:4000/new-quest`, formData)
            .then((res) => {
                const message = res.data;
                setFormData(initialFormState)
                updateQuestData()
                setNewQuest(message)
                setOnSuccess('onAddingSuccess')
                setTimeout(()=> {setNewQuest('Agregar'), setOnSuccess('fade-out') }, 2000)
            }
            )
    }

    const handleSubmit=(event)=>{
        event.preventDefault()
        axiosPostQuest()
    }

    return (
        <>
            <form onSubmit={handleSubmit} >
                <fieldset style={{
                    display: 'flex', flexDirection: 'row',
                    alignItems: 'center', justifyContent: 'center'
                }}>
                    <label htmlFor="">

                        <input
                            style={{ margin: '5px' }}
                            type="text"
                            name="questName"
                            value={formData.questName}
                            onChange={handleEventForm}
                            placeholder="Nueva tarea"
                            required
                        />
                    </label>
                    <label htmlFor="">
                        XP:
                        <input
                            style={{ margin: '5px', width: '80px' }}
                            type="number"
                            name="questXP"
                            value={formData.questXP}
                            onChange={handleEventForm}
                            required
                        />
                    </label>
                    <label htmlFor="">
                        Tipo:
                        <select
                            id="type"
                            style={{ margin: '5px', width: '90px' }}
                            name="type"
                            value={formData.type}
                            onChange={handleEventForm}
                            required
                        >
                            <option value="" disabled>Selecciona un tipo</option>
                            <option value="Principal">Principal</option>
                            <option value="Secundaria">Secundaria</option>
                            <option value="Jefe">Jefe</option>
                            <option value="Jefe Opcional">Jefe Opcional</option>
                        </select>
                    </label>
                    <label htmlFor="">
                        <textarea
                            style={{
                                margin: '5px',
                                maxHeight: '30px',
                                minHeight: '30px',
                                maxWidth: '150px',
                                minWidth: '150px',
                                whiteSpace: 'pre-wrap',
                                textAlign: 'left',
                            }}
                            name="description"
                            value={formData.description}
                            onChange={handleEventForm}
                            placeholder="Añade una descripción..."
                        />
                    </label>
                    <label htmlFor="">
                    <button type="submit" className={onSuccess}>{newQuest}</button>
                    </label>
                </fieldset>
            </form>
        </>
    )
}

export default NewQuestForm