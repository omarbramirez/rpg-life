const express = require("express");
const schedule = express.Router();
const mySchemas = require("../models/schedule");
const gettingWeek = async (from,page,totalStudyHours, totalWorkingHours) => {
  const scheduleData = await mySchemas.Schedule.find().skip(from).limit(7)
  const totalDocuments = await mySchemas.Schedule.find().countDocuments()
  return {scheduleData, totalDocuments}
};

const settingNewDay = async(day)=>{
  let newDay = {
    day: day,
    tasks: [],
    hours: [],
    workingHours: 0
  }
  await mySchemas.Schedule.create(newDay)
}

schedule.put("/update-working-hours", async(req,res) =>{
  const {index, week, action} = req.body
  try{
    let currentDay = {}
    if(!currentDay.id){

      let weekIndex = (week - 1) * 7
      await gettingWeek(weekIndex).then(
        allDays => allDays.scheduleData.map((perDay, DBIndex) =>{
          if(DBIndex === index){
            currentDay = perDay
          }
        })
        );
        
      }
    const currentDayId =currentDay.id.valueOf()

      const newWorkingHours = action === 'ADDING'? currentDay.workingHours + 1 : currentDay.workingHours - 1

      if(newWorkingHours >= 0){
        const updatingWorkingHours = await mySchemas.Schedule.findOneAndUpdate(
          {_id: currentDayId}
          ,{$set:{
            workingHours: newWorkingHours
          }}
          );
          await updatingWorkingHours.save()
        }
        res.end()
  }catch (error) {
    console.log(error);
    res.status(500).send("Error interno del servidor");
  }
})

schedule.delete("/delete-task", async (req, res)=>{
  const {index, task, tasksArray, hoursArray, week} = req.body;
  try{
    let currentDay = {}
    let weekIndex = (week - 1) * 7
    await gettingWeek(weekIndex).then(
      allDays => allDays.scheduleData.map((perDay, DBIndex) =>{
        if(DBIndex === index){
          currentDay = perDay
        }
      })
    );

        const currentDayId = currentDay.id.valueOf();
        const currentName = currentDay.tasks[task];
        const currentHour =  currentDay.hours[task];

      const bulkOperations = [
        {
          updateOne: {
            filter: { _id: currentDayId },
            update: {
              $pull: { tasks: { $eq: currentName }, hours: { $eq: currentHour } }
            }
          }
        },
        {
          updateOne: {
            filter: { _id: currentDayId },
            update: { $unset: { tasks: 1 } }
          }
        },
        {
          updateOne: {
            filter: { _id: currentDayId },
            update: { $unset: { hours: 1 } }
          }
        },
        {
          updateOne: {
            filter: { _id: currentDayId },
            update: { $set: { tasks: tasksArray } }
          }
        },
        {
          updateOne: {
            filter: { _id: currentDayId },
            update: { $set: { hours: hoursArray } }
          }
        }
      ];

      const bulkWriteResult = await mySchemas.Schedule.bulkWrite(bulkOperations);

      if (bulkWriteResult.modifiedCount > 0) {
        res.send('Tarea eliminada');
      } else {
        res.send('La tarea no pudo eliminarse');
      }
        res.end()
    }catch (error) {
      console.error(error);
      res.status(500).send("Error interno del servidor");
    }
});

schedule.post("/new-task", async (req, res) => {
  const { week, myDay, taskName, myHours} = req.body;
  try {
    let currentDay = {};
    week !== 0 ? weekIndex = (week - 1) * 7 : weekIndex = 0
    await gettingWeek(weekIndex).then(
      (allDays) => {
        allDays.scheduleData.map((perDay) =>{
          if(perDay.day === myDay){
            currentDay = perDay
          }
      })
     });
        const currentDayId =currentDay.id.valueOf()
        
        const addingNewTaskToTheList = await mySchemas.Schedule.findOneAndUpdate(
          {_id: currentDayId}
          ,{$push:{
            tasks: taskName,
            hours: myHours,
          }}
          );
          await addingNewTaskToTheList.save() ? res.send('Agregado') : res.send('Opps!') 
      } catch (error) {
    console.error(error);
    res.status(500).send("Error interno del servidor");
  }
});

schedule.get("/schedule", async (req, res) => {
  const {page, action, totalStudyHours, totalWorkingHours} = req.query
  if(action === 'CREATE_WEEK'){
    const week = ['LUNES', 'MARTES', 'MIÉRCOLES', 'JUEVES', 'VIERNES', 'SÁBADO', 'DOMINGO'];
    // let counter = 0;
    // while(counter < 7) {
    //   settingNewDay(week[counter]) ? counter ++ : console.log('Something went wrong :(')
    // }
    for (let i = 0; i < 7; i++) {
      await settingNewDay(week[i])
      //DEPURAR DESPUES 
      console.log(`Día ${i} creado.`);
    }
  }
  const from = (page-1) *7
  gettingWeek(from, page, totalStudyHours, totalWorkingHours)
    .then((data) => {
      res.send(data)
    })
    .catch((err) => console.log(err));
});

module.exports = schedule;
