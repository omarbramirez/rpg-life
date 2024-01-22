import { useState, useEffect } from "react";
import axios from "axios";
import Character from "./modules-stats/character";

export const Stats = () => {
    const [statsData, setStatsData] = useState(null)
    const [levelup, setLevelup] = useState(true)

    useEffect(() => {
        axiosFetchStats()
    }, [])

    const axiosFetchStats = async () => {
        await axios.get(`http://localhost:4000/stats`).then((res) => {
            const {data, levelup} = res.data
            setStatsData(data)
            setLevelup(levelup)

        }).catch((err)=>console.error(err))
    }

    const updateStats = ()=>{
        axiosFetchStats()
    }

return(
    <>
    <div>

    {statsData?(
        <>
            <div  style={{width: '300px', marginLeft: '20px', position: 'sticky', top: '10px'}}>
        {/* <h2 style={{ textAlign: 'center' }}>STATS</h2> */}
                <Character statsData={statsData} updateStats= {updateStats} levelup={levelup}/>
            </div>
        </>
    ):(
        <p>Cargando stats...</p>
        )
    }
    </div>
    </>
)
}
