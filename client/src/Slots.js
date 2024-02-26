import React from 'react'

function Slots(props) {
    const { slots } = props
    return (
        <div>
            <table>
                <thead>
                    <tr>
                        <th>Slots</th>
                        <th>Indians</th>
                        <th>Overseas</th>
                    </tr>
                </thead>
                <tbody>
                    {Object.keys(slots).map((specialist) => (
                        <tr key={specialist}>
                            <td>{specialist}</td>
                            <td>{slots[specialist].in}</td>
                            <td>{slots[specialist].Over}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default Slots
