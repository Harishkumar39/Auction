import React, { useEffect, useState } from 'react'

import {io} from "socket.io-client"
import Content from './Content'

import { useNavigate } from 'react-router-dom'

const socket = io.connect("http://localhost:3001")


function Admin() {
    const navigate = useNavigate()
    const [createRoom, setCreateRoom] = useState("")
    const [message, setReceiveMsg] = useState("")

    const handleClick = () =>{
        socket.emit("create_room",createRoom)
    }

    useEffect(()=>{
        socket.on("room_created_successfully",(data)=>{
            console.log("Room No : "+data.data);
            navigate('/Admin/Content')
            
        })
        socket.on("receive_message",(data)=>{
            setReceiveMsg(data.message)
          })


    },[socket])

  return (
    <div>
      <h1><em>Enter the desired room in which you want to host your AUCTION</em></h1>
      <input type="text" placeholder='Create Room....' onChange={(e)=>{setCreateRoom(e.target.value)}} />
      <button onClick={handleClick}>Create</button>
      <br />
    </div>
  )
}

export default Admin
