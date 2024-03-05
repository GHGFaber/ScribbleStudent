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

  const [initial, setInitial] = useState("");

  let isRendered = false;

  const [isFirstTime, setIsFirstTime] = useState(true);
  const user = localStorage.getItem("id");
  const [chats, setChats] = useState([]);
  const [classes, setClasses] = useState([]);
  const [activeUsers, setActiveUsers] = useState([]);
  const [inactiveUsers, setInactiveUsers] = useState([]);
  const [userNotes, setUserNotes] = useState([]);
  const [renderedChats, setRenderedChats] = useState("");
  //try to push
  const [stringChats, setStringChats] = useState("");
  let count = 0;

  let newChats = "";
  let newClasses = "";
  let newActiveUsers = "";
  let newInactiveUsers = "";
  let newUserNotes = "";

  useEffect(() => {
    // localStorage.setItem("messages", null);
    console.log("useEffect has ran");
    get_chat_from_server();
    // get_users_classes_from_server();
    get_active_users_from_server();
    get_inactive_users_from_server();
    get_users_notes_from_server();
    setIsFirstTime(false);
  }, []);

  useEffect(() => {

  }, [])

  function get_chat_from_server() {
    axios
      .get("http://localhost:3000/chat_data")
      .then((res) => {
        setChats(res.data);

        localStorage.setItem("chats", JSON.stringify(res.data));
      })
      .catch((error) => {
        console.error("Error fetching data from the API:", error);
        console.log("not connected");
      });
  }

  function get_active_users_from_server() {
    axios
      .get("http://localhost:3000/active_data")
      .then((res) => {
        setActiveUsers(res.data);
        localStorage.setItem("active", JSON.stringify(res.data));
      })
      .catch((error) => {
        console.error("Error fetching data from the API:", error);
        console.log("not connected");
      });
  }

  function get_inactive_users_from_server() {
    axios
      .get("http://localhost:3000/inactive_data")
      .then((res) => {
        setInactiveUsers(res.data);
        localStorage.setItem("inactive", JSON.stringify(res.data));
      })
      .catch((error) => {
        console.error("Error fetching data from the API:", error);
        console.log("not connected");
      });
  }

  function get_users_notes_from_server() {
    axios
      .get("http://localhost:3000/notes_data")
      .then((res) => {
        setUserNotes(res.data);

        localStorage.setItem("notes", JSON.stringify(res.data));
      })
      .catch((error) => {
        console.error("Error fetching data from the API:", error);
        console.log("not connected");
      });
  }

  function foo() {
    if (!isRendered) {}
  }

  function count_refresh() {
    console.log("The count is: " + count);
    ++count;
  }

  return (
    <BrowserRouter>
      {foo()}
      <div className="App">
        <Routes>
          <Route index element={<Home />} />
          <Route path="login-page" element={<LoginPage />} />
          <Route path="create-account" element={<CreateAccount />} />
          <Route
            path="notebook"
            element={<Notebook classes={classes} notePages={userNotes} />}
          />

          <Route
            path="chatroom"
            element={
              <Chatroom
                chats={chats}
                //classes={classes}
                activeUsers={activeUsers}
                inactiveUsers={inactiveUsers}
                notePages={userNotes}
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
