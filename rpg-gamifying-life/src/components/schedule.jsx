/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import NewTaskForm from "./modules-schedule/newTaskForm";
import axios from "axios";
const baseURL =import.meta.env.VITE_REACT_APP_API_URL || `http://localhost:4000`

export const Schedule = ({updateStats}) => {

  const initialPage = localStorage.getItem('currentPage') || false;
  const [currentPage, setCurrentPage] = useState(parseInt(initialPage));

  const [scheduleData, setScheduleData] = useState(null);
  const [taskDeleted, setTaskDeleted] = useState(null);
  const [styles, setStyles] = useState(null);
  const [buttonValidator, setButtonValidator] = useState(true)
  const [previousButtonValidator, setPreviousButtonValidator] = useState(false)

  useEffect(() => {
    localStorage.setItem('currentPage', currentPage.toString());
  }, [currentPage]);

  useEffect(() => {
    axiosFetchSchedule(currentPage, 'SHOW_WEEK');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateScheduleData = (action) => {
    axiosFetchSchedule(currentPage, action)
    updateStats()
  };

  const axiosFetchSchedule = async (page, action) => {
    let lastPageAvaiable = page;
    if(!initialPage){
      await axios.get(`${baseURL}/getttingLastPageInInitialization`).then(res=>{
        lastPageAvaiable = res.data.length;
      })
    }

    let newPage = action === 'CREATE_WEEK' ?  lastPageAvaiable + 1 : lastPageAvaiable
    let totalHours = 0;
    let totalworkingHours = 0;
    if(action === 'ADDING'){ 
      newPage ++;
    }
    if(action === 'RESTING'){ 
      newPage --;
    }
    await axios.get(`${baseURL}/schedule?page=${newPage}&action=${action}`).then(async(res) => {
      const {scheduleData, totalDocuments} =  res.data
      let gettingButtonActivation = totalDocuments / (newPage*7) !== 1;
        scheduleData.map(array => {
          totalHours += array.hours.reduce((total, hourObject) => {
            const hourValue = Object.values(hourObject)[0];
            return parseInt(total) + parseInt(hourValue);
          }, 0);
          totalworkingHours += parseInt(array.workingHours)
        })
        const data = { dayData: scheduleData, totalHours: totalHours, totalworkingHours: totalworkingHours }
        if(scheduleData.length === 7){
        setScheduleData(data)
        setCurrentPage(newPage)
        setButtonValidator(gettingButtonActivation)
        if(action === 'CREATE_WEEK'){
          await axios.post(`${baseURL}/createNewWeekInfo`, {page:newPage})
        }
        if(action === 'UPDATE_WEEK' && !buttonValidator){
          const weekData ={
            page: newPage,
            totalStudyHours:totalHours,
            totalWorkingHours:totalworkingHours 
          }
          await axios.put(`${baseURL}/updatingWeekInfo`, weekData);
        }
      }
      }).catch((err) => console.log(err));
  };
  
  const updatingWorkingHours = async (index, action) => {
    const taskData = {
      index: index,
      action: action,
      week: currentPage
    }
    await axios.put(`${baseURL}/update-working-hours`, taskData)
      updateScheduleData()
  }

  const removeTask = async (dayIndex, taskIndex) => {
    let tasksArray = [];
    const hoursArray = [];
    let tasksIndex = 0;
    await scheduleData.dayData[dayIndex].tasks.map((task, index) => {
      if (index !== taskIndex) {
        const newObject = {}
        newObject[`${tasksIndex}`] = Object.values(task)[0];
        tasksArray.push(newObject)
        tasksIndex += 1
      }
    })

    let hoursIndex = 0;
    await scheduleData.dayData[dayIndex].hours.map((hour, index) => {
      if (index !== taskIndex) {
        const newObject = {}
        newObject[`${hoursIndex}`] = Object.values(hour)[0];
        hoursArray.push(newObject)
        hoursIndex += 1
      }
    })

    const taskData = {
      index: dayIndex,
      task: taskIndex,
      tasksArray: tasksArray,
      hoursArray: hoursArray,
      week: currentPage

    }
    await axios.delete( `${baseURL}/delete-task`, { data: taskData })
      .then(res => {
        const message = res.data
        updateScheduleData('UPDATE_WEEK')
        setTaskDeleted(message)
        setStyles('onDeletingSuccess')
        setTimeout(() => { setStyles('onDeletingSuccess fade-out-delete') }, 2000)
      }).catch(err => console.log(err))
  }

  return (
    <>
    <div>
    <h2 style={{textAlign: 'center'}}>REGISTRO</h2>
      {scheduleData ? (
        <>
          <div>
            <NewTaskForm updateScheduleData={updateScheduleData} hours={scheduleData.dayData[scheduleData.dayData.length - 1].hours} weekIndex={currentPage} buttonValidator={buttonValidator}/>
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly' }}>
              <button onClick={() => {
                if(!previousButtonValidator){
                  updateScheduleData('RESTING')}
                  setPreviousButtonValidator(currentPage <= 2)
                }}
                disabled = {previousButtonValidator}
                >Anterior</button>
              <button onClick={() => {
                updateScheduleData('CREATE_WEEK')
              }} 
              disabled= {buttonValidator}
              >Guardar</button>
              <button
                onClick={() => {
                  updateScheduleData('ADDING')
                  setPreviousButtonValidator(!currentPage === 1)
                }}
                disabled= {!buttonValidator}
              >Siguiente</button>
            </div>
            <h4 className={styles}>
              {taskDeleted}
            </h4>
            <table>
              <thead className="header">
                <tr className="header">
                  <th scope="col">
                    SEMANA {currentPage}
                  </th>
                  <th scope="col">Puntos Especiales</th>
                  <th scope="col">Horas de Trabajo</th>
                </tr>
              </thead>
              {scheduleData.dayData.map((array, index) => (
                <tbody key={`day-${index}`}>
                  <tr>
                    <td>{array.day}</td>
                  </tr>
                  <tr>
                    <td>
                      <ul>
                        {array.tasks.map((task, i) => (
                          <li key={`task-${i}`}>{Object.values(task)}
                            <span>
                              <button className="listButton" onClick={() => removeTask(index, i)} hidden={buttonValidator}>Remove</button>
                            </span>
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td>
                      <ul className="hoursContainer">
                        {array.hours.map((hours, i) => (
                          <li key={i} className="hours">{Object.values(hours)}</li>
                        ))}
                      </ul>
                    </td>
                    <td style={{ margin: 'auto' }}>
                      <span className="workingHoursContainer">
                        {array.workingHours}
                      </span>
                      <span style={{ display: 'block' }}>
                        <button onClick={() => updatingWorkingHours(index, 'RESTING')} hidden={buttonValidator}>-</button>
                        <button onClick={() => updatingWorkingHours(index, 'ADDING')} hidden={buttonValidator}>+</button>
                      </span>
                    </td>
                  </tr>
                </tbody>
              ))}
              <tfoot>
                <tr>
                  <td>TOTAL</td>
                  <td>{scheduleData.totalHours}</td>
                  <td>{scheduleData.totalworkingHours}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </>
      ) : (
        <p>Cargando semanas...</p>
      )}
          </div>
    </>
  );
};
