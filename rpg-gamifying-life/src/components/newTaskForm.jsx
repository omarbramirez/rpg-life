import { useState } from "react";
import axios from 'axios'


const NewTaskForm = () => {
    const [formData, setFormData] = useState({
        taskName: '',
        hours: 0
    });
    const [newTask, setNewTask] = useState('')

    const handleEventForm = (event)=>{
        const {name, value} = event.target
        setFormData({
            ...formData,
            [name]: value
        })
    }

    const axiosPostData = async() =>{
        const postData = {
            taskName: formData.taskName,
            hours: formData.hours
        }
        await axios.post('http://localhost:4000/contact', postData)
        .then(res=> setNewTask(<p className="success">{res.data}</p>))
    }

    const handleSubmit = (event)=>{
        event.preventDefault()
        // console.log(formData)
        axiosPostData ()
    }


    return (
        <>
            <form onSubmit={handleSubmit}>
                <fieldset style={{display: 'flex', flexDirection: 'row', 
                alignItems: 'center', justifyContent: 'center'}}>
                    <label htmlFor="">
                        Nueva tarea:  
                        <input style={{width: '60%', margin: '5px'}} type="text"
                        name="taskName"
                        value={formData.taskName}
                        onChange={handleEventForm}
                        required
                        />
                    </label>
                    <label htmlFor="">
                        Horas:
                        <input style={{width: '30px', margin: '5px'}} type="number"
                        name="hours"
                        value={formData.hours}
                        onChange={handleEventForm}
                        required
                        />
                    </label>
                    <button type="submit">Agregar</button>
                    {newTask}
                </fieldset>
            </form>
        </>
    );
};

export default NewTaskForm;
