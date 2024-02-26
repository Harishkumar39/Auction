import React from 'react'

function Stats(props) {
    const {player} = props
    return (
        <div>
            <div className="player-details">
                <table>
                    <thead>
                        <tr>
                            <th>Category</th>
                            <th>Data</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Country</td>
                            <td>{player.Country}</td>
                        </tr>
                        <tr>
                            <td>State Association</td>
                            <td>{player.State_Association}</td>
                        </tr>
                        <tr>
                            <td>Age</td>
                            <td>{player.Age}</td>
                        </tr>
                        <tr>
                            <td>Batting</td>
                            <td>{player.Batting}</td>
                        </tr>
                        <tr>
                            <td>Bowling</td>
                            <td>{player.Bowling}</td>
                        </tr>
                        <tr>
                            <td>T20 Innings</td>
                            <td>{player.T20_caps}</td>
                        </tr>
                        <tr>
                            <td>IPL Matches</td>
                            <td>{player.IPL}</td>
                        </tr>
                        <tr>
                            <td>Previous Teams</td>
                            <td>{player.Previous_IPL_Teams}</td>
                        </tr>
                        <tr>
                            <td>Last IPL</td>
                            <td>{player.Team_2022}</td>
                        </tr>
                        <tr>
                            <td>Last IPL Matches</td>
                            <td>{player.IPL_2022_Matches}</td>
                        </tr>
                        
                        
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default Stats
