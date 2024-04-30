import { useState} from "react";
import axios from 'axios'
const baseURL =import.meta.env.VITE_REACT_APP_API_URL


// eslint-disable-next-line react/prop-types
const NewTaskForm = ({ updateScheduleData, hours, weekIndex,buttonValidator }) => {
    // eslint-disable-next-line react/prop-types
    var indexation = `${hours.length}`
    const initialFormState = {
        taskName: '',
        hours: 1,
        dayOfWeek: ''
    }
    
    const [formData, setFormData] = useState(initialFormState);
    const [newTask, setNewTask] = useState('Agregar')
    const [onSuccess, setOnSuccess] = useState('')

    const handleEventForm = (event)=>{
        const {name, value} = event.target
        if(value !== 0 && value > 0){
            setFormData({
                ...formData,
                hours: value
            })
        }
        if(name !== 'hours'){
            setFormData({
                ...formData,
                [name]: value
            })
        }
    } 

    const axiosPostData = async() =>{
        // const currentDate = new Date().toLocaleDateString('es-ES', { weekday:"long"}).toUpperCase()
        const task = {}
        const hours = {}

        Object.defineProperty(task, indexation, {
            get: function () {
                return formData.taskName;
              },
              set: function (newValue) {
                formData.taskName = newValue;
              },
              enumerable: true,
              configurable: true,
            });

            Object.defineProperty(hours, indexation, {
                get: function () {
                    return formData.hours;
                  },
                  set: function (newValue) {
                    formData.hours = newValue;
                  },
                  enumerable: true,
                  configurable: true,
                });

        const postData = {
            week: weekIndex,
            myDay: formData.dayOfWeek,
            taskName: task,
            myHours: hours
        }
        await axios.post(`${baseURL}/new-task`, postData)
        .then(res=> {
            const message = res.data;
            updateScheduleData('UPDATE_WEEK')
            setNewTask(message)
            setOnSuccess('onAddingSuccess')
            setFormData(initialFormState)
            setTimeout(()=> {setNewTask('Agregar'), setOnSuccess('fade-out') }, 2000)
        })
    }

    const handleSubmit = (event)=>{
        event.preventDefault()
        axiosPostData();
    }


    return (
        <>
            <form onSubmit={handleSubmit}>
                <fieldset style={{display: 'flex', flexDirection: 'row', 
                alignItems: 'center', justifyContent: 'center'}}>
                    <label htmlFor="">  
                        <input style={{margin: '5px'}} type="text"
                        name="taskName"
                        value={formData.taskName}
                        onChange={handleEventForm}
                        required
                        placeholder="Actividad realizada"
                        />
                    </label>
                    <label htmlFor="">
                        Horas:    
                        <input style={{margin: '5px', width: '30px'}} type="number"
                        name="hours"
                        value={formData.hours}
                        onChange={handleEventForm}
                        required
                        placeholder="Horas"
                        />
                    </label>
                    <label htmlFor="">
                        Día:
                        <select
    style={{ width: '60%', margin: '5px' }}
    name="dayOfWeek"
    value={formData.dayOfWeek}
    onChange={handleEventForm}
    required
  >
    
    <option value="" disabled>Selecciona un día</option>
    <option value="LUNES">LUNES</option>
    <option value="MARTES">MARTES</option>
    <option value="MIÉRCOLES">MIÉRCOLES</option>
    <option value="JUEVES">JUEVES</option>
    <option value="VIERNES">VIERNES</option>
    <option value="SÁBADO">SÁBADO</option>
    <option value="DOMINGO">DOMINGO</option>
  </select>
                    </label>
                    <label htmlFor="">
                    <button type="submit" className={onSuccess}  disabled={buttonValidator}>{newTask}</button>
                    </label>
                </fieldset>
            </form>
        </>
    );
};

export default NewTaskForm;
