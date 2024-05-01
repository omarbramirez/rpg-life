import {useEffect } from 'react';

import Character from "./modules-stats/character";



// eslint-disable-next-line react/prop-types
export const Stats = ({statsData, levelup, updateStats}) => {
    
    useEffect(() => {
        updateStats()
    }, [])
    
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
