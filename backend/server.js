const express = require('express')
const cors = require('cors')
const bodyParser= require('body-parser')
const router = require('./routes/router')
const mongoose = require('mongoose')
require('dotenv/config')

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

const corsOptions = {
  origin: '*',
  credential: true,
  optionSuccessStatus:200
}

app.use(cors(corsOptions))

app.use('/', router)

mongoose.connect(process.env.DB_URI)
.then(()=>console.log('DB Connected u.u'))
.catch(err=> console.log(err))
module.exports = mongoose

const port = process.env.PORT || 4000
const server = app.listen(port, ()=>{
  console.log('server running :3')
})