const express = require('express')
const router = express.Router()
const schedule = require('../schedule.json')
const mySchemas = require('../models/schedule')

router.post('/contact', async (req,res)=>{
    const {taskName, hours} = req.body
    const newTaskData = {taskName: taskName, hours: hours}
    const newTaskList= new mySchemas.Tasks(newTaskData)
    const saveTasks = await newTaskList.save()
    saveTasks ? res.send('New task added') : alert('Something went wrong')
    res.end()
})

router.get('/users', (req, res)=>{
    const finalArray = []
    for(let data in schedule){
        finalArray.push(schedule[data])
    }
    res.send(finalArray)
}
)

module.exports = router