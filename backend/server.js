const express = require('express')
const cors = require('cors')
const bodyParser= require('body-parser')
const schedule = require('./routes/schedule')
const hoursPerWeeks = require('./routes/hoursPerWeeks')
const sidequests = require('./routes/sideQuests')
const stats = require('./routes/stats')
const mongoose = require('mongoose')
const fs = require('fs');
const path = require('path');
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

// mongoose.connect(process.env.DB_CLOUD_URL)
// .then(()=>console.log('DB Connected u.u'))
// .catch(err=> console.log(err))
// module.exports = mongoose

// Función para leer archivos JSON de la carpeta 'databases'
function readJSONFiles(dir) {
  const files = fs.readdirSync(dir);
  const jsonFiles = files.filter(file => file.endsWith('.json'));
  const data = {};

  jsonFiles.forEach(file => {
    const filePath = path.join(dir, file);
    const fileData = fs.readFileSync(filePath, 'utf-8');
    const jsonData = JSON.parse(fileData);
    const collectionName = path.basename(file, '.json');
    data[collectionName] = jsonData;
  });

  return data;
}


// Conectar a las bases de datos locales
const databasesPath = path.join(__dirname, 'mongodbdatabases');
const mongodbdatabases = readJSONFiles(databasesPath);
module.exports = mongodbdatabases;



const port = process.env.PORT || 4000
const server = app.listen(port, ()=>{
  console.log('server running :3')
})