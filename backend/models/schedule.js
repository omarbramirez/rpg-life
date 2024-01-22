const mongoose = require('mongoose');

const scheduleSchema =new mongoose.Schema({
  day: {
    type: String,
    required: true,
  },
  tasks: [
    {
      type: Map,
      of: String,
    },
  ],
  hours: [
    {
      type: Map,
      of: Number,
    },
  ],
  workingHours: {
    type: Number,
    required: true,
  },
}, { versionKey: false });

const totalHoursPerWeek = new mongoose.Schema(
  {
    week: {
      type: Number,
      required: true
    },
    studyHours: {
      type: Number,
      required: true
    },
    workingHours: {
      type: Number,
      required: true
    },
    totalxp:{
      type: Number,
      required: false
    }  
  }, { versionKey: false }
)


const Schedule = mongoose.model('Schedule', scheduleSchema, 'schedule');
const TotalHoursPerWeek = mongoose.model('TotalHoursPerWeek', totalHoursPerWeek, 'totalhours')
const mySchemas = {'Schedule':Schedule, 'TotalHoursPerWeek':TotalHoursPerWeek}
module.exports = mySchemas;