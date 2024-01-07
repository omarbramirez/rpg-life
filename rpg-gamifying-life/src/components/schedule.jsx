import { useEffect, useState } from "react";
import NewTaskForm from "./newTaskForm";
import axios from "axios";

export const Schedule = () => {


  const initialPage = localStorage.getItem('currentPage') || 1;
  const [currentPage, setCurrentPage] = useState(parseInt(initialPage));

  const [scheduleData, setScheduleData] = useState(null);
  const [taskDeleted, setTaskDeleted] = useState(null);
  const [styles, setStyles] = useState(null);
  // const [currentPage, setCurrentPage] = useState(1);
  const [buttonValidator, setButtonValidator] = useState(true)
  const [previousButtonValidator, setPreviousButtonValidator] = useState(true)

  // Actualizar el valor de currentPage en localStorage cuando cambia
  useEffect(() => {
    localStorage.setItem('currentPage', currentPage.toString());
  }, [currentPage]);

  useEffect(() => {
    axiosFetchData(currentPage, 'SHOW_WEEK');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateScheduleData = async (action) => {
    axiosFetchData(currentPage, action)
  };

  const axiosFetchData = async (page, action) => {
    let totalHours = 0;
    let totalworkingHours = 0;
    let newPage = action === 'CREATE_WEEK' ? page + 1 : page
    console.log()
    if(action === 'ADDING'){ 
      newPage ++;
    }
    if(action === 'RESTING'){ 
      newPage --;
    }
    await axios.get(`http://localhost:4000/schedule?page=${newPage}&action=${action}`).then((res) => {
      const {scheduleData, totalDocuments} =  res.data
      let gettingButtonActivation = totalDocuments / (newPage*7) !== 1;
      // setCreatingNewWeekValidator(false)
        scheduleData.map(array => {
          totalHours += array.hours.reduce((total, hourObject) => {
            const hourValue = Object.values(hourObject)[0];
            return parseInt(total) + parseInt(hourValue);
          }, 0);
          totalworkingHours += parseInt(array.workingHours)
        })
        const data = { dayData: scheduleData, totalHours: totalHours, totalworkingHours: totalworkingHours }
        setScheduleData(data)
        setCurrentPage(newPage)
        setButtonValidator(gettingButtonActivation)
    })
      .catch((err) => console.log(err));
  };

  const updatingWorkingHours = async (index, action) => {
    const taskData = {
      index: index,
      action: action,
      week: currentPage
    }
    await axios.put('http://localhost:4000/update-working-hours', taskData).then(() => {
      updateScheduleData('SHOW_WEEK')
    })
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
    await axios.delete('http://localhost:4000/delete-task', { data: taskData })
      .then(res => {
        const message = res.data
        updateScheduleData('SHOW_WEEK')
        setTaskDeleted(message)
        setStyles('onDeletingSuccess')
        setTimeout(() => { setStyles('onDeletingSuccess fade-out-delete') }, 2000)
      }).catch(err => console.log(err))
  }


  return (
    <>
      <h1>BOSQUE INVERNAL DEL DESASOSIEGO</h1>
      {scheduleData ? (
        <>
          <div>
            <NewTaskForm updateScheduleData={updateScheduleData} hours={scheduleData.dayData[scheduleData.dayData.length - 1].hours} weekIndex={currentPage} />
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly' }}>
              <button onClick={() => {
                console.log(previousButtonValidator, currentPage)
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
                  <th scope="col">Horas de Estudio</th>
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
                              <button className="listButton" onClick={() => removeTask(index, i)}>Remove</button>
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
                        <button onClick={() => updatingWorkingHours(index, 'RESTING')}>-</button>
                        <button onClick={() => updatingWorkingHours(index, 'ADDING')}>+</button>
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
        <p>Loading schedule data...</p>
      )}
    </>
  );
};
