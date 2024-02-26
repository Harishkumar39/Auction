import React, { useEffect, useState } from 'react'
import './App.css'
import {ToastContainer, toast} from 'react-toastify'
import { io } from 'socket.io-client'
import Stats from './Stats'

const socket = io.connect("http://localhost:3001")


function Content(props) {

    const [player, setPlayer] = useState("")
    const [c_team, setCTeam] = useState("")
    const [c_bid, setCBid] = useState("0")
    const [isDisabled, setIsDisabled] = useState(false)
    const [timer, setTimer] = useState(15);
    const [unsold, setUnsold] = useState(false)

    //Start or Next
    const handleEvent = () => {
        document.getElementById("next-btn").innerHTML = "Next"
        setCBid("0")
        setCTeam("-")
        setIsDisabled(true)
        socket.emit("req_player")
    }

    //Sold
    const handleSold = () => {
        const cur_team = document.getElementById("bid-team").value
        const cur_amount = document.getElementById("bid-amount").value
        socket.emit("req_player")
        socket.emit("handle_sold", { cur_team, cur_amount, player })
    }

    const handleUnSold = () => {
        if(c_bid === "0"){
            toast.error("Player Unsold.")
            socket.emit("handle_unsold")
        }
        else{
            setUnsold(true)
        }
    }
    useEffect(() => {

        socket.emit("update_bid")


        socket.on("requested_player", (data) => {
            setPlayer(data.player)
        })

        socket.on("sold_success", (data) => {
            toast.success("Player sold.")
            setCBid("0")
            setCTeam("")
            setTimer(15)
            setUnsold(false)
        })

        socket.on("reply_handle_bid", (data) => {
            setCTeam(data.team)
            setCBid(data.amount)
        })

        socket.on("updated_time", (time)=>{
            setTimer(time)
        })


        return () => {
            socket.off("requested_player");
            socket.off("sold_success");
            socket.off("update_timer")
        };
    }, [socket])


    return (
        
        <div className='container'>
            
            <ToastContainer />
            <div className="top-left">
                <h1><em>Auctioneer Table</em></h1>
                <p><b>Set No: <span id="set-no">{player["Set_No"]}</span></b></p>
                <p><b>Set Name: <span id="set-name">{player["Set_Name"]}</span></b></p>
            </div>
            <div className="top-right">
                <div className="timer-section">
                    <p><b>Timer: </b><span id="timer">{timer}</span></p>
                </div>

            </div>

            <div className="center">
                <div className="bottom-left">
                    <p><b>Player Name: </b><span id="player-name">{player["First_Name"] + " " + player["Surname"]}</span></p>
                    <h2>Player Stats</h2>
                    {/* <p>Stats: <span id="player-stats">Stats Here</span></p> */}
                    <Stats player = {player} />
                </div>
                <div className='auction-details'>
                    <h2>Auction Details</h2>
                    <p><b>Base Price: </b><span id="base-price">{player["Base_Price_Lakhs"]}</span> Lakhs</p>
                    <p><b>Current Bid </b></p><br /><label><b>Team </b></label><input type="text" value={c_team} id="bid-team" readOnly /><br /><br />
                    <label><b>Amount</b></label> <input type="text" value={c_bid} id="bid-amount" readOnly />
                </div>
            </div>

            <div className="bottom-right">
                <button id="unsold-btn" onClick={handleUnSold} disabled={unsold}>Unsold</button>
                <button id="sold-btn" onClick={handleSold}>Sold</button>
                <button id="next-btn" onClick={handleEvent} disabled={isDisabled}>Start</button>
            </div>
        </div>
    )
}

export default Content
