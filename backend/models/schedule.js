const mongoose = require('mongoose');

const daySchema = new mongoose.Schema({
  day: { type:Date, default:Date.now},
  workingHours: { type: Number, default: 0 },
  tasks: { type: [String], default: [] },
  hours: { type: [Number], default: [] },
});

const weekSchema = new mongoose.Schema({
  weekNumber: { type: String, required: true, unique: true },
  days: { type: [daySchema], default: [] },
});

const taskList = new mongoose.Schema({
  taskName: {type: String},
  hours: {type: Number, default: 0  }
});

const Schedule = mongoose.model('Schedule', weekSchema, 'schedule');
const TaskList = mongoose.model('TaskList', taskList, 'tasks');
const mySchemas = {'Schedule':Schedule, 'Tasks':TaskList}
module.exports = mySchemas;