/* eslint-disable react/prop-types */
import axios from 'axios'
import profileImage from './profile.png';

const Character =({statsData, updateStats, levelup})=>{

    const levelingUp = async()=>{
        await axios.post(`http://localhost:4000/level-up`).then(()=>{
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