const express = require("express");
const hoursPerWeeks = express.Router();
const mySchemas = require("../models/schedule");
const mySchemasForStats= require("../models/stats")
const calculateTotalXP = require("../complements/xpcalculator");

hoursPerWeeks.get(`/getttingLastPageInInitialization`, async (req, res) => {
  const totalWeeks = await mySchemas.TotalHoursPerWeek.find()
  res.send(totalWeeks)
  return res.end()
})

hoursPerWeeks.post(`/createNewWeekInfo`, async (req, res) => {
  const { page } = req.body;
  //DEPURAR DESPUES
  console.log(page)
  try {
    // Crear la nueva semana
    let generalXP = null
    await mySchemas.TotalHoursPerWeek.find().then(weeks => {
      weeks.map(week => {
        generalXP += week.totalxp
       })
    }
    )
    const stats = await mySchemasForStats.UserStats.find()
    const {currentXP} = stats[0]
    const statsId = stats[0].id.valueOf();

    await mySchemasForStats.UserStats.findOneAndUpdate(
      {_id: statsId},
      {
          $set:{
              currentXP: currentXP + generalXP,
          }
      }
  )

    const newWeek = {
      week: page,
      studyHours: 0,
      workingHours: 0,
      totalxp: 0
    };
    const newWeekInfoCreated = await mySchemas.TotalHoursPerWeek.create(newWeek);
    newWeekInfoCreated.save();
  } catch (error) {
    console.error(error);
  }
});


hoursPerWeeks.put("/updatingWeekInfo", async (req, res) => {
  const { page, totalStudyHours, totalWorkingHours } = req.body;
  const totalXP = calculateTotalXP(totalStudyHours, totalWorkingHours, 10);
  const infoPerWeek = await mySchemas.TotalHoursPerWeek.find();
  let currentWeekInfo = null;
  infoPerWeek.forEach((dataWeek, index) => {
    if (dataWeek.week === page) {
      currentWeekInfo = dataWeek;
    }
  });
  const currentWeekId = currentWeekInfo.id.valueOf();
  const modifyingWeekInfo = await mySchemas.TotalHoursPerWeek.findOneAndUpdate(
    { _id: currentWeekId },
    {
      $set: {
        studyHours: totalStudyHours,
        workingHours: totalWorkingHours,
        totalxp: totalXP, // Cambiado el nombre aquí
      },
    }
  );
  await modifyingWeekInfo.save();
});

module.exports = hoursPerWeeks;
