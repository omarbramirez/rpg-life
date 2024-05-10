const express = require("express");
const stats = express.Router();
// const mySchemas = require("../models/stats");
const mongodbdatabases = require("../server");


stats.get(`/stats`, async(req, res)=>{
    // 
    const UserStats = mongodbdatabases.UserStats; // Obtén el modelo de estadísticas de usuario
    const statsData = await UserStats.find()
    .then(data=>{
        const{currentXP, nextLevelXP} = data[0]
        const result = currentXP - nextLevelXP < 0
        const myData = {
            data: data[0],
            levelup: result
        }
        res.send(myData)
    })
    return res.end()
})

stats.post(`/level-up`, async(req, res)=>{
    const UserStats = mongodbdatabases.UserStats; // Obtén el modelo de estadísticas de usuario
    const statsData = await UserStats.find();
    // const stats = await mySchemas.UserStats.find()
    const {nextLevelXP, currentXP, level} = stats[0]
    const statsId = stats[0].id.valueOf();
    const difference_ = currentXP - nextLevelXP
    if(difference_ > 0){
        const rest = Math.abs(difference_)
        const newLevelValue = Math.round(stats[0].nextLevelXP * 0.20) + stats[0].nextLevelXP
        await mySchemas.UserStats.findOneAndUpdate(
            {_id: statsId},
            {
                $set:{
                    level: level + 1,
                    currentXP: rest,
                    nextLevelXP: newLevelValue
                }
            }
        )
    }
    return res.end()
})



module.exports = stats;