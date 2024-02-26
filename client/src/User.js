import React, { useEffect,useState } from 'react'
import {io} from "socket.io-client"

import { useNavigate } from 'react-router-dom'

import {ToastContainer, toast} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';

const socket = io.connect("http://localhost:3001")

function User() {

  const navigate = useNavigate()

  const [Room, setRoom] = useState("")
  const [Message, setMessage] = useState("")
  const [team, setTeam] = useState("")

  const joinRoom = ()=>{
    if(Room !== "")
      socket.emit("join_room", Room)
  }

  const sendMessage = () =>{ 
      socket.emit("send_message",{message : Message ,room: Room})
  }

  const createTeam = () =>{
    socket.emit("create_team",team)
  }

  useEffect(()=>{
    socket.on("receive_message",(data)=>{
      toast.dark(`Room created with Room no. ${data.id}`)
    })

    socket.on("room_joined", (data)=>{
      toast.success("Joined in Room "+data)
      
    })

    socket.on("invalid_room", ()=>{
      toast.error("Invalid Room")
    })

    socket.on("create_team_reply",(data)=>{
      alert(data.Message)
      if( data.nav_message === 'success'){
        navigate('/User/UserContent',{state: [data.teamName, data.slots, data.purse, data.teamSize]})
      }
    })



  },[socket])

  return (
    <div>
      <h1>Welcome User</h1>
      <ToastContainer />
      <input type='text' placeholder='Enter Room No.' onChange={(event)=>{
          setRoom(event.target.value)
      }} />
      <button onClick={joinRoom}>Join</button>
      {/* <input type='text' placeholder='Enter your team name' onChange={(event)=>{
          setMessage(event.target.value)
      }} />
      <button onClick={sendMessage}>Send</button> */}
      <input type='text' placeholder='Enter your team name. Ex. CSK' onChange={(event)=>{
          setTeam(event.target.value)
      }} />
      <button onClick={createTeam}>Send</button>
      {/* <h1>Message : </h1>
      <p>{ReceiveMsg}</p> */}
    </div>
  )
}

export default User
