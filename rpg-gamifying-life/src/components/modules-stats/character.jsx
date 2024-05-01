/* eslint-disable react/prop-types */
import axios from 'axios'
const baseURL =import.meta.env.VITE_REACT_APP_API_URL
import profileImage from './profile.jpg';

const Character =({statsData, updateStats, levelup})=>{

    const levelingUp = async()=>{
        await axios.post(`${baseURL}/level-up`).then(()=>{
            updateStats()
        })
    }

    return(
        <>
        <table>
            <thead>
                <tr>
                    <td>
                        <h3>LVL {statsData.level}</h3>
                        </td>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>
                        <ul>
                            <li style={{margin:'auto', textAlign:'center'}}>
                                <img src={profileImage} alt="" className="profile" style={{width:'200px', height: '200px', objectFit: 'cover'}}/>
                            </li>
                        </ul>
                    </td>
                </tr>
                <tr>
                    <td>
                    <ul>
                            <li className="stats-info">
                                <p>Puntos actuales:</p>
                                <p>{statsData.currentXP} XP</p>
                            </li >
                        </ul>
                        <ul>
                            <li className="stats-info">
                                <p>Próximo nivel:</p>
                                <p>{statsData.nextLevelXP} XP</p>
                            </li>
                        </ul>
                        <ul>
                            <li className="levelup-btn">
                                <button onClick={()=>{levelingUp()}} disabled={levelup}>Level Up</button>
                                {/* <button onClick={()=>{updateStats()}}>Refresh</button> */}
                            </li>
                        </ul>
                    </td>
                </tr>
            </tbody>
        </table>
        </>
    )
}
export default Character