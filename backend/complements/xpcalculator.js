
const totalxp =(totalStudyHours, totalWorkingHours)=> { 
    const totalHours = totalStudyHours + totalWorkingHours
    const multiple = Number(totalHours.toString().slice(0,1)) * 10
    const totalxp = multiple * totalHours;
    return totalxp
}

module.exports = totalxp