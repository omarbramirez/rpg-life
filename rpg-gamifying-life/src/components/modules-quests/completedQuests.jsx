const completedQuests = ({completedQuests}) =>{
    return(
        <>
        <table>
                                <thead>
                                    <tr>
                                        <td><h3>Tareas Completadas</h3></td>
                                    </tr>
                                </thead>
                                <tbody>
                        {completedQuests.map((data, index) => (
                                    <tr key={`active-quest-${index}`}>
                                        <td >
                                        <ul>

<li style={{padding: '10px'}}>
<div>
{data.questName}
<strong>{data.type}</strong>
</div>
<div>

<p>
{data.description}
</p>
</div>
</li>
</ul>
                                        </td>
                                        <td>
                                            <ul>
                                                <li>{data.questXP} XP</li>
                                            </ul>
                                        </td>
                                    </tr>
                                    ))
                                }
                                </tbody>
                            </table>
        </>
    )
}

export default completedQuests;