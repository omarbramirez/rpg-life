const express = require("express");
const sidequests = express.Router();
const mySchemas = require("../models/sideQuests");
const mySchemasForStats= require("../models/stats")

const gettingTotalQuests = async () => {
    const total = await mySchemas.QuestList.countDocuments()
    return total
}
const gettingSideQuests = async () => {
    const activeQuests = await mySchemas.QuestList.find({ status: 'Active' }).sort({ index: -1 }).limit(5);
    const pendingQuests = await mySchemas.QuestList.find({ status: 'Active' }).sort({ index: -1 }).skip(5).limit(5)
    const completedQuests = await mySchemas.QuestList.find({ status: 'Completed' }).limit(5)
    return { activeQuests, pendingQuests, completedQuests }
}


sidequests.get("/questList", (req, res) => {
    gettingSideQuests().then((data) => {
        res.send(data)
    })
        .catch((err) => console.log(err));
})

sidequests.post("/new-quest", async (req, res) => {
    const { questName, questXP, type, description } = req.body
    try {
        gettingTotalQuests().then(async (total) => {
            let newQuest = {
                questName: questName.toUpperCase(),
                type: type,
                questXP: questXP,
                description: description,
                status: "Active",
                index: total + 1
            }
            await mySchemas.QuestList.create(newQuest) ? res.send('Agregado') : res.send('Opps!')
        }).catch((err) => console.error(error))
    } catch (error) {
        console.error(error)
    }
})

sidequests.delete("/delete-quest", async (req, res) => {
    const { index } = req.body
    await mySchemas.QuestList.deleteOne({ index: index })
    gettingTotalQuests().then(async(total)=>{
        let newIndex = index
        while(newIndex <= total){
            await mySchemas.QuestList.findOneAndUpdate(
                {index:newIndex+1},
                {index:newIndex}
            )
            newIndex += 1
        }
    })
    res.end()
})

sidequests.put("/update-quest", async(req, res)=>{
    const { index, questXP } = req.body

    const stats = await mySchemasForStats.UserStats.find()
    const {currentXP} = stats[0]
    const statsId = stats[0].id.valueOf();

    await mySchemasForStats.UserStats.findOneAndUpdate(
      {_id: statsId},
      {
          $set:{
              currentXP: currentXP + questXP,
          }
      }
  )



    await mySchemas.QuestList.findOneAndUpdate(
        {index:index},
        {status: "Completed"}
    )
    res.end()
})

module.exports = sidequests