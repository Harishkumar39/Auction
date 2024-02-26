import React, { useState, useEffect } from 'react'
import './App.css'
import { io } from 'socket.io-client'
import { useLocation } from 'react-router-dom'
import Stats from './Stats'
import Slots from './Slots'
import {ToastContainer, toast} from 'react-toastify'

const socket = io.connect("http://localhost:3001")


function UserContent() {

    const location = useLocation()
    const [player, setPlayer] = useState("")
    const [team, setTeam] = useState("")
    const [c_team, setCTeam] = useState("")
    const [c_amount, setCAmount] = useState(0)
    const [basePrice, setBasePrice] = useState(0)
    const [timer, setTimer] = useState(15);
    const [timerRunning, setTimerRunning] = useState(false)
    const [isDisabled, setIsDisabled] = useState(false);
    const [teamData, setTeamData] = useState(null)
    const [purse, setPurse] =useState(0)
    const [remSlots, setRemSlots] = useState(0)

    const handleBid = () => {
        setBasePrice(basePrice)
        if(c_amount < purse  && purse > basePrice){
            setCAmount(c_amount)
            setCTeam(team)
            socket.emit("handle_bid", { team, amount: c_amount, basePrice , purse, id: socket.id})
        }
        else{
            alert("You are exceeding your purse limit")
            toast.error("Watch out your purse before making a bid!!!")
        }
    }

    useEffect(()=>{
        if(team){
            setTeamData(location.state[1])
            setPurse(location.state[2])
            setRemSlots(location.state[3])
        }


    },[team])

    useEffect(() => {
    
        socket.emit("req_player", () => {
            setTimer(30);
            setTimerRunning(true);
        })

        socket.on("requested_player", (data) => {
            setPlayer(data.player)
            setTeam(location.state[0])
            setCAmount(0)
            setBasePrice(Number(data.player["Base_Price_Lakhs"]))

        })

        socket.on("sold_success", (data) => {
            toast.info(`Player sold to ${data.data.cur_team}`)
            setCTeam("-")
            if(team){
                if(remSlots<25){
                    setIsDisabled(false) 
                }  
            }
            setIsDisabled(false)
            setTimer(15)
            setTimerRunning(0)
            
        })

        socket.on("reply_handle_bid", (data) => {
            setCTeam(data.team)
            setCAmount(data.amount)
            setTimer(15);
            setTimerRunning(true);
        })

        socket.on("update_team_data", (data) => {
            setTeamData(data.slots);
            setPurse(data.purse);
            if(data.teamSize<25){
                setRemSlots(data.teamSize)
            }
            else{
                setRemSlots(data.teamSize)
                alert("You have reached your team capacity of 25. No more Bids")
                setIsDisabled(true)
            }
        });

        return () =>{
            socket.off("update_team_data")
        }


    }, [socket])

    useEffect(() => {
        let intervalId;

        if (timerRunning) {
            intervalId = setInterval(() => {
                setTimer((prevTimer) => {
                    if (prevTimer > 0) {
                        socket.emit("timer_update", prevTimer-1)
                        return prevTimer - 1;
                    } else {
                        clearInterval(intervalId);
                        setTimerRunning(false);
                        toast.error("Time over. Wait for the Auctioneer")
                        setIsDisabled(true)
                        return 0;
                    }
                });
            }, 1000);
        }

        // if(team){
        //     console.log();
        // }

        return () => clearInterval(intervalId);
    }, [timerRunning]);

    return (
        <div className='background'>
            <div className='container'>
                <ToastContainer />
                <div className='top-left'>
                    <h1>{team}</h1>
                    <h4>Remaining Purse : <p><em>{purse}</em> L</p></h4>
                    <h4>Total Slots : <p><em>{remSlots}</em></p></h4>
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
                        <Stats player={player} />
                    </div>
                    <div className='auction-details'>
                        <h2>Auction Details</h2>
                        <label><b>Base Price: </b><input type="text" value={player["Base_Price_Lakhs"]} id="bid-team" readOnly />Lakhs</label>
                        <p><b>Current Bid </b></p><br /><label><b>Team </b></label><input type="text" value={c_team} id="bid-team" readOnly /> <br /><br />
                        <label><b>Amount</b></label> <input type="text" value={c_amount} id="bid-amount" readOnly />
                    </div>
                </div>
                <div className='bottom-table'>
                    {teamData && <div className="table">
                        <Slots slots = {teamData} />
                    </div>}
                </div>
                <div className="bottom-right">
                    <button id="bid-btn" onClick={handleBid} disabled={isDisabled} >Make Bid</button>
                </div>
            </div>
        </div>
    )
}

export default UserContent
