import './App.css';
import Home from './pages/Home.jsx';
import LoginPage from './pages/LoginPage.jsx';
import CreateAccount from './pages/CreateAccount.jsx';
import Chatroom from './pages/Chatroom.jsx';
import Notebook from './pages/Notebook.jsx';
import {createRef, useState} from 'react';
import {BrowserRouter, Routes, Route} from "react-router-dom";

function App() {

  const [initial, setInitial] = useState('');

  const [chats, setChats] = useState([
    {
      username: "tianapowell225",
      text: "It's gonna take a lotta love...",
      timestamp: 1704479956000
    },
    {
      username: "JLennon",
      text: "$a0!!!!!!!!!!",
      timestamp: 1704480316000
    },
    {
      username: "Chubli_Deepnargle",
      text: "Dernoy! Dernoy bluse!",
      timestamp: 1704480445000
    },
    {
      username: "Fleeko1999",
      text: "Zombo!",
      timestamp: 1704482118000
    }
  ]);

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

  const [userNotes, setUserNotes] = useState([
    {
      title: "Notes 1",
      filename: "notes1.txt",
      fileID: 1234567890,
      text: "I'm just playing games"
    },
    {
      title: "Notes 2",
      filename: "notes2.txt",
      fileID: 9876543210,
      text: "I know that's plastic love"
    },
    {
      title: "Notes 3",
      filename: "notes3.txt",
      fileID: 2252252250,
      text: "Dance to the plastic beat"
    },
    {
      title: "Notes 4",
      filename: "notes4.txt",
      fileID: 7777777777,
      text: "Another morning comes"
    }
  ]);

  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
            <Route index element={<Home/>}/>
            <Route path="login-page" element={<LoginPage/>}/>
            <Route path="create-account" element={<CreateAccount/>}/>
            <Route path="notebook" element={<Notebook classes={classes} notePages={userNotes} initData={initial}/>}/>
            <Route path="chatroom" element={<Chatroom chats={chats} classes={classes} activeUsers={activeUsers} inactiveUsers={inactiveUsers} notePages={userNotes}/>}/>   
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
