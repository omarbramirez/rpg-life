// import { getSchedule } from '../store/getSchedule';
import { useEffect, useState } from 'react';
import NewTaskForm  from './newTaskForm';
import axios from 'axios'

export const Schedule = () => {

  const [scheduleData, setScheduleData] = useState(null)

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const data = await axios.get('http://localhost:4000/users')
  //       setScheduleData(data)
  //     } catch (err) {
  //       console.log(err)
  //     }
  //   }
  //   fetchData()
  // }, [])

  useEffect(()=>{
    let processing = true
    axiosFetchData(processing)
    return ()=>{
      processing = true
    }
  }, [])

  const axiosFetchData = async(processing)=>{
    await axios.get('http://localhost:4000/users')
    .then(res =>{
      if(processing){
        setScheduleData(res.data)
      }
    })
    .catch(err => console.log(err))
  }


  const calculateTotalHours = (week) => {
    let totalEstudio = 0;
    week.map(dayOfWeek=>{
      let hoursPerDay = dayOfWeek.hours.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
      totalEstudio += hoursPerDay
    })
    const totalTrabajo = week.reduce((accumulator, currentValue) => accumulator + currentValue.workingHours, 0);
    return { totalEstudio, totalTrabajo };
  };

  return (
    <>
      <h1>BOSQUE INVERNAL DEL DESASOSIEGO</h1>
      {scheduleData ? (
        <>
          {scheduleData.map((week, index) => (
            <div key={`semana-${index}`}>
               <NewTaskForm/>
            <table>
              <thead>
                <tr>
                  <th style={{ width: '75%' }} >SEMANA {index+1}</th>
                  <th>Horas de Estudio</th>
                  <th>Horas de Trabajo</th>
                </tr>
              </thead>
              {week.map((dayOfWeek, i) => (
                <tbody key={`day-${i}`}>
                  <tr>
                    <th>{dayOfWeek.day}</th>
                    <th></th>
                    <th></th>
                  </tr>
                  <tr>
                    <td key={`task-${index}`}>
                      {dayOfWeek.tasks.map((task, listIndex) => (
                        <ul key={`tasksList${listIndex}`}>
                          <li >{task}</li>
                        </ul>
                      ))}
                    </td>
                    <td key={`hours-${index}`}>
                      {dayOfWeek.hours.map((hour, listIndex) => (
                        <ul key={`hoursList${listIndex}`}>
                          <li >{hour}</li>
                        </ul>
                      ))}
                    </td>
                    <td key={`workingHours-${index}`}>
                      <ul key={`workingHoursList${index}`}>
                        <li >{dayOfWeek.workingHours}</li>
                      </ul>
                    </td>
                  </tr>
                </tbody>
              ))}
                <tfoot key={`footer-${index}`}>
                  <tr>
                    <td></td>
                    <td>
                    {calculateTotalHours(week).totalEstudio}
                    </td>
                    <td>
                    {calculateTotalHours(week).totalTrabajo}
                      </td> 
                  </tr>
                </tfoot>
            </table>
            </div>
          ))}
        </>
      ) : (
        <p>Loading schedule data...</p>
      )}
    </>
  )
}

