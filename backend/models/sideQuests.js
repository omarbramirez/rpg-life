const mongoose = require('mongoose');

const questList = new mongoose.Schema(
    {
      questName:{
        type: String,
        required: true
      },
      type:{
        type: String,
        required: true
      },
      questXP:{
        type: Number,
        required: true
      },
      status:{
        type: String,
        required: true
      },
      description:{
        type: String,
        required: false
      },
      index:{
        type: Number,
        required: false
      }
    }
  )

  const QuestList = mongoose.model('QuestList', questList, 'quests')
  const mySchemas = {'QuestList':QuestList}
  module.exports = mySchemas;