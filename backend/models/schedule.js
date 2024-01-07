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

const Schedule = mongoose.model('Schedule', scheduleSchema, 'schedule');
const mySchemas = {'Schedule':Schedule}
module.exports = mySchemas;