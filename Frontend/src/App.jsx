import './App.css';
import Home from './pages/Home.jsx';
import LoginPage from './pages/LoginPage.jsx';
import CreateAccount from './pages/CreateAccount.jsx';
import Chatroom from './pages/Chatroom.jsx';
import Notebook from './pages/Notebook.jsx';
import Sidebar from './components/Sidebar.jsx';
import Navbar from './components/Navbar.jsx';
import {useState} from 'react';
import {BrowserRouter, Routes, Route} from "react-router-dom";

function App() {

  const [chats, setChats] = useState([
    {
      username: "tianapowell225",
      text: "It's gonna take a lotta love..."
    },
    {
      username: "JLennon",
      text: "$a0!!!!!!!!!!"
    },
    {
      username: "Chubli_Deepnargle",
      text: "Dernoy! Dernoy bluse!"
    },
    {
      username: "Fleeko1999",
      text: "Zombo!"
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

  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
            <Route index element={<Home/>}/>
            <Route path="login-page" element={<LoginPage/>}/>
            <Route path="create-account" element={<CreateAccount/>}/>
            <Route path="notebook" element={<Notebook classes={classes}/>}/>
            <Route path="chatroom" element={<Chatroom chats={chats} classes={classes}/>}/>   
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
