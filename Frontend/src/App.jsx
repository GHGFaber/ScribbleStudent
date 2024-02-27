import './App.css';
import Home from './pages/Home.jsx';
import LoginPage from './pages/LoginPage.jsx';
import CreateAccount from './pages/CreateAccount.jsx';
import Chatroom from './pages/Chatroom.jsx';
import Notebook from './pages/Notebook.jsx';
import UserUpdate from './pages/UserUpdate.jsx';
import ResetPassword from './pages/ResetPassword.jsx';
import {useEffect, useState} from 'react';
import {BrowserRouter, Routes, Route} from "react-router-dom";

import socket from './components/Socket.jsx';

// //++++++++++++++++++++++++++++++++++
// import io from "socket.io-client";
// const socket = io.connect("http://localhost:3000", {
//   reconnection: false
// }); //connect to socket.io server
// //++++++++++++++++++++++++++++++++++

function App() {
  
  // const [activeUsers, setActiveUsers] = useState([]);
      
  // const [chats, setChats] = useState([
  //   {
  //     username: "tianapowell225",
  //     text: "It's gonna take a lotta love...",
  //     timestamp: 1704479956000
  //   },
  //   {
  //     username: "JLennon",
  //     text: "$a0!!!!!!!!!!",
  //     timestamp: 1704480316000
  //   },
  //   {
  //     username: "Chubli_Deepnargle",
  //     text: "Dernoy! Dernoy bluse!",
  //     timestamp: 1704480445000
  //   },
  //   {
  //     username: "Fleeko1999",
  //     text: "Zombo!",
  //     timestamp: 1704482118000
  //   }
  // ]);

  const [classes, setClasses] = useState([
    {
      classInSchoolName: "CHEM-225"
    },
    {
      classInSchoolName: "COMP-300"
    },
    {
      classInSchoolName: "COMP-345"
    },
    {
      classInSchoolName: "ENGL-101"
    }
  ]);
  const [activeUsers, setActiveUsers] = useState([
    {
      username: "tianapowell225"
    },
    {
      username: "JLennon"
    },
    {
      username: "Chubli_Deepnargle"
    },
    {
      username: "Fleeko1999"
    }
  ]);
  const [inactiveUsers, setInactiveUsers] = useState([
    {
      username: "Cecil [TA]"
    },
    {
      username: "SitarKid"
    },
    {
      username: "Ringo334"
    },
    {
      username: "rolling_stone_1962"
    },
    {
      username: "n46_iwantyou"
    }
  ]);

  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
            <Route index element={<Home/>}/>
            <Route path="login-page" element={<LoginPage/>}/>
            <Route path="create-account" element={<CreateAccount/>}/>
            <Route path="notebook" element={<Notebook classes={classes}/>}/>
            {/* <Route path="chatroom" element={<Chatroom chats={chats} classes={classes} activeUsers={activeUsers} inactiveUsers={inactiveUsers}/>}/>   */}
            <Route path="chatroom" element={<Chatroom classes={classes} activeUsers={activeUsers} inactiveUsers={inactiveUsers}/>}/>  
            <Route path="user-update" element={<UserUpdate/>}/>
            <Route path="reset-password" element={<ResetPassword/>}/>

        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
