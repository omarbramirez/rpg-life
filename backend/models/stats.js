const mongoose = require('mongoose');

const userStats = new mongoose.Schema(
    {
        level:{
            type: Number,
            required: true
        },
        currentXP:{
            type: Number,
            required: true
        },
        nextLevelXP:{
            type: Number,
            required:true
        }
    }
)

const UserStats = mongoose.model('UserStats', userStats, 'stats')
const mySchemas = {'UserStats':UserStats}
module.exports = mySchemas;