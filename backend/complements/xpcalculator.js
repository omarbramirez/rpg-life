
const totalxp =(totalStudyHours, totalWorkingHours, lvl)=> { 
    const totalHours = totalStudyHours + totalWorkingHours
    const multiple = Number(totalHours.toString().slice(0,1)) * 15 + lvl
    const totalxp = multiple * totalHours;
    return totalxp
}

module.exports = totalxp