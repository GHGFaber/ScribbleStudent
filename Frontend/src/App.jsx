import "./App.css";
import Home from "./pages/Home.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import CreateAccount from "./pages/CreateAccount.jsx";
import Chatroom from "./pages/Chatroom.jsx";
import Notebook from "./pages/Notebook.jsx";
import DirectMessages from "./pages/DirectMessages.jsx";
import { createRef, useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import axios from "axios";
import "./App.css";
import UserUpdate from "./pages/UserUpdate.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";

function App() {
  // console.log("Initiating app...");
  // Classes State
  const [classes, setClasses] = useState([]);
  // Chats State
  const [chats, setChats] = useState([]);

  const [directChats, setDirectChats] = useState([]);

  // Username State
  const [username, setUsername] = useState(null);
  // Room State
  const [room, setRoom] = useState(() => {
    const savedRoom = sessionStorage.getItem("room");
    return savedRoom ? JSON.parse(savedRoom) : [];
  });

  // DM Room State
  const [directRoom, setDirectRoom] = useState([]);
  // Note Pages State
  const [notePages, setNotes] = useState([]);
  // Class Note Pages State
  const [classNotes, setClassNotes] = useState([]);
  // State to store selected note
  // const [selectedNote, setSelectedNote] = useState(null);

  const [selectedNote, setSelectedNote] = useState(() => {
    const savedNote = sessionStorage.getItem("selectedNote");
    return savedNote ? JSON.parse(savedNote) : null;
  });

  const [friendInfo, setFriendInfo] = useState();
  const [profileInfo, setProfileInfo] = useState();

  /*
  const [listOfFriends, setListOfFriends] = useState([
    {
      username: "Ringo334"
    }
  ]);
  */

  useEffect(() => {
    // call get_friends API
  }, []);

  // Load active users from session storage on component mount
  // const [activeUsers, setActiveUsers] = useState(() => {
  //   const savedUsers = sessionStorage.getItem("activeUsers");
  //   return savedUsers ? JSON.parse(savedUsers) : [];
  // });

  const [activeUsers, setActiveUsers] = useState([]);

  // Load inactive users session storage on component mount
  const [inactiveUsers, setInactiveUsers] = useState(() => {
    const savedUsers = sessionStorage.getItem("inactiveUsers");
    return savedUsers ? JSON.parse(savedUsers) : [];
  });

  // Load user's note pages from session storage on component mount
  const [userNotePages, setUserNotePages] = useState(() => {
    const savedNotes = localStorage.getItem("notes");
    return savedNotes ? JSON.parse(savedNotes) : [];
  });

  // Load user's note pages from session storage on component mount
  /*
   const [directMessages, setDirectMessages] = useState(() => {
    /*
    const directMessages = localStorage.getItem("direct_messages");
    return directMessages ? JSON.parse(directMessages) : [];
  });
  */

  useEffect(() => {
    console.log("app.jsx: notes are: " + JSON.stringify(userNotePages));
  }, [userNotePages]);

  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route index element={<Home />} />
          <Route path="login-page" element={<LoginPage />} />
          <Route path="create-account" element={<CreateAccount />} />
          <Route
            path="notebook"
            element={
              <Notebook
                classes={classes}
                setClasses={setClasses}
                username={username}
                setUsername={setUsername}
                notePages={notePages}
                setNotes={setNotes}
                selectedNote={selectedNote}
                setSelectedNote={setSelectedNote}
                room={room}
                setRoom={setRoom}
                friendInfo={friendInfo}
                setFriendInfo={setFriendInfo}
                setClassNotes={setClassNotes}
                classNotes={classNotes}
              />
            }
          />
          <Route
            path="chatroom"
            element={
              <Chatroom
                room={room}
                setRoom={setRoom}
                classes={classes}
                setClasses={setClasses}
                chats={chats}
                setChats={setChats}
                directChats={directChats}
                setDirectChats={setDirectChats}
                username={username}
                setUsername={setUsername}
                activeUsers={activeUsers}
                setActiveUsers={setActiveUsers}
                inactiveUsers={inactiveUsers}
                setInactiveUsers={setInactiveUsers}
                notePages={notePages}
                setNotes={setNotes}
                selectedNote={selectedNote}
                setSelectedNote={setSelectedNote}
                classNotes={classNotes}
                setClassNotes={setClassNotes}
                friendInfo={friendInfo}
                setFriendInfo={setFriendInfo}
              />
            }
          />
          <Route
            path="direct-messages"
            element={
              <DirectMessages
                classes={classes}
                setClasses={setClasses}
                chats={chats}
                setChats={setChats}
                directChats={directChats}
                setDirectChats={setDirectChats}
                username={username}
                setUsername={setUsername}
                activeUsers={activeUsers}
                setActiveUsers={setActiveUsers}
                inactiveUsers={inactiveUsers}
                setInactiveUsers={setInactiveUsers}
                room={room}
                setRoom={setRoom}
                friendInfo={friendInfo}
                setFriendInfo={setFriendInfo}
                profileInfo={profileInfo}
                setProfileInfo={setProfileInfo}
              />
            }
          />
          <Route path="user-update" element={<UserUpdate />} />
          <Route path="reset-password" element={<ResetPassword />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
