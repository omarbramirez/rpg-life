export const getSchedule = async() =>{
    const finalArray = []
    try{
        const res = await fetch('/schedule.json')
        const json = await res.json()
        for(let data in json){
            finalArray.push(json[data])
        }
        return finalArray
    }catch(err){
        console.log(`API request failed: ${err}`)
        throw new Error
    }
}
