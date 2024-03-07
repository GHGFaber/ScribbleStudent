import "./App.css";
import Home from "./pages/Home.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import CreateAccount from "./pages/CreateAccount.jsx";
import Chatroom from "./pages/Chatroom.jsx";
import Notebook from "./pages/Notebook.jsx";
import { createRef, useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import axios from "axios";
import "./App.css";
import UserUpdate from "./pages/UserUpdate.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";

function App() {
  console.log("Initiating app...");

  const [classes, setClasses] = useState([]);
  // Chats State
  const [chats, setChats] = useState([]);
  // Username State
  const [username, setUsername] = useState(null);

  // Load active users from session storage on component mount
  const [activeUsers, setActiveUsers] = useState(() => {
    const savedUsers = sessionStorage.getItem("activeUsers");
    return savedUsers ? JSON.parse(savedUsers) : [];
  });

  // Load inactive users session storage on component mount
  const [inactiveUsers, setInactiveUsers] = useState(() => {
    const savedUsers = sessionStorage.getItem("inactiveUsers");
    return savedUsers ? JSON.parse(savedUsers) : [];
  });

  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route index element={<Home />} />
          <Route path="login-page" element={<LoginPage />} />
          <Route path="create-account" element={<CreateAccount />} />
          <Route path="notebook" element={<Notebook username={username} />} />
          {/* <Route path="chatroom" element={<Chatroom chats={chats} classes={classes} activeUsers={activeUsers} inactiveUsers={inactiveUsers}/>}/>   */}
          <Route
            path="chatroom"
            element={
              <Chatroom
                classes={classes}
                setClasses={setClasses}
                chats={chats}
                setChats={setChats}
                username={username}
                setUsername={setUsername}
                activeUsers={activeUsers}
                setActiveUsers={setActiveUsers}
                inactiveUsers={inactiveUsers}
                setInactiveUsers={setInactiveUsers}
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
