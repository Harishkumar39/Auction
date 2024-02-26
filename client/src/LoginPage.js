import {React, useEffect, useState} from 'react'
import io from 'socket.io-client'
import {useNavigate} from 'react-router-dom'

const socket = io.connect("http://localhost:3001")

window.addEventListener('beforeunload', function (e) {
  // Cancel the event
  e.preventDefault();
  // Chrome requires returnValue to be set
});

function LoginPage() {
  var val = false
  const navigate = useNavigate()
  const [userName, setUserName] = useState("")
  const [password, setPassword] = useState("")
  const [IsLogged, setIslogged] = useState(false)
  // localStorage.clear()
  // const handleInput = () => {
  //   socket.emit("login",{userName, password})
  // }
  window.addEventListener('beforeunload', () => {
    localStorage.clear();
  });

  useEffect(()=>{
    // socket.on("login_success",(data)=>{
    //     console.log(data);
    //     console.log(socket.id);
    //     // navigate("/Home")
    // })
  
    const storedLoginStatus = localStorage.getItem('IsLogged');
    console.log("Status : "+storedLoginStatus);
    if (storedLoginStatus) {
      setIslogged(true);
    }
    
    socket.on("admin", ()=>{
      navigate("/Admin")
    })
    socket.on("user", ()=>{
      navigate("/User")
    })


  },[socket])

  


  const handleUser = () =>{
    socket.emit("user")
  }

  const handleAdmin = () =>{
    
    localStorage.setItem('IsLogged','true')
    setIslogged(true)
    socket.emit("admin")
  }


  return (
    <div>
        <h1>Auction Mania</h1>
        <button onClick={handleUser}>Teams</button>
        <button onClick={handleAdmin} disabled={IsLogged}>Auctioneer</button>
    </div>
  )
}

export default LoginPage
