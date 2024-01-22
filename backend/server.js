const express = require('express')
const cors = require('cors')
const bodyParser= require('body-parser')
const schedule = require('./routes/schedule')
const hoursPerWeeks = require('./routes/hoursPerWeeks')
const sidequests = require('./routes/sideQuests')
const stats = require('./routes/stats')
const mongoose = require('mongoose')
require('dotenv/config')

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

const corsOptions = {
  origin: '*',
  credentials: true, // corrección aquí
  optionSuccessStatus: 200, // corrección aquí
}

app.use(cors(corsOptions))

app.use('/', schedule)
app.use('/', hoursPerWeeks)
app.use('/', sidequests)
app.use('/', stats)

mongoose.connect(process.env.DB_URI)
.then(()=>console.log('DB Connected u.u'))
.catch(err=> console.log(err))
module.exports = mongoose

const port = process.env.PORT || 4000
const server = app.listen(port, ()=>{
  console.log('server running :3')
})