const express = require("express");
const router = express.Router();
const mySchemas = require("../models/schedule");
const gettingWeek = async (from) => {
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
  return await mySchemas.Schedule.create(newDay)

}

router.put("/update-working-hours", async(req,res) =>{
  const {index, week, action} = req.body
  try{
    let testing = {}
    let weekIndex = (week - 1) * 7
    await gettingWeek(weekIndex).then(
      allDays => allDays.scheduleData.map((perDay, DBIndex) =>{
        if(DBIndex === index){
          testing = perDay
        }
      })
    );

    const currentDayId =testing.id.valueOf()

      const newWorkingHours = action === 'ADDING'? testing.workingHours + 1 : testing.workingHours - 1

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
    console.error(error);
    res.status(500).send("Error interno del servidor");
  }
})

router.delete("/delete-task", async (req, res)=>{
  const {index, task, tasksArray, hoursArray, week} = req.body;
  try{
    console.log(index, task, tasksArray, hoursArray)

    let testing = {}
    let weekIndex = (week - 1) * 7
    await gettingWeek(weekIndex).then(
      allDays => allDays.scheduleData.map((perDay, DBIndex) =>{
        if(DBIndex === index){
          testing = perDay
        }
      })
    );

        const currentDayId = testing.id.valueOf();
        const currentName = testing.tasks[task];
        const currentHour =  testing.hours[task];

        console.log(currentDayId, currentName, currentHour)

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

router.post("/new-task", async (req, res) => {
  const { week, myDay, taskName, myHours } = req.body;
  try {
    let testing = {}
    let weekIndex = (week - 1) * 7
    await gettingWeek(weekIndex).then(
      allDays => allDays.scheduleData.map((perDay) =>{
        if(perDay.day === myDay){
          testing = perDay
        }
      })
    );
        const currentDayId =testing.id.valueOf()
        const addingNewTaskToTheList = await mySchemas.Schedule.findOneAndUpdate(
          {_id: currentDayId}
          ,{$push:{
            tasks: taskName,
            hours: myHours,
          }}
          );
          await addingNewTaskToTheList.save() ? res.send('Agregado') : res.send('Opps!')
          res.end() 
      } catch (error) {
    console.error(error);
    res.status(500).send("Error interno del servidor");
  }
});

router.get("/schedule", (req, res) => {
  const {page, action} = req.query
  if(action === 'CREATE_WEEK'){
    const week = ['LUNES', 'MARTES', 'MIÉRCOLES', 'JUEVES', 'VIERNES', 'SÁBADO', 'DOMINGO'];
    let counter = 0;
    while(counter < 7) {
      settingNewDay(week[counter]) ? counter ++ : console.log(week[counter])
    }
  }
  const from = (page-1) *7
  gettingWeek(from)
    .then((data) => {
      res.send(data)
    })
    .catch((err) => console.log(err));
});

module.exports = router;
