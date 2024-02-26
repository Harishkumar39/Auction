
import {io} from 'socket.io-client';
import './App.css';

import {useEffect, useState} from 'react'
import {BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import LoginPage from './LoginPage';
import User from './User';
import Admin from './Admin';
import Content from './Content';
import UserContent from './UserContent';

const socket = io.connect("http://localhost:3001")



function App() {
  

  useEffect(()=>{
  //     socket.on("receive_message",(data)=>{
  //         setReceiveMsg(data.message)
  //     })
  }, [socket])

  return (
    <div className="App">

      <Router>
        <Routes>
          <Route exact path='/' Component={LoginPage} />
          <Route path='/User' Component={User} />
          <Route path='/Admin' Component={Admin} />
          <Route path='/Admin/Content' Component={Content} />
          <Route path='/User/UserContent' Component={UserContent} />
        </Routes>
      </Router>

    </div>
  );
}

export default App;
