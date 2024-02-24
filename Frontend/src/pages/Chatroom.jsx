import Navbar from "../components/Navbar.jsx";
import Sidebar from "../components/Sidebar.jsx";
import Userbar from "../components/Userbar.jsx";
import { useEffect, useState } from "react";
import axios from "axios";

function Chatroom() {
  const [classes, setClasses] = useState([]);
  const [chats, setChats] = useState([]);
  const [notePages, setNotes] = useState([]);
  const [activeUsers, setActive] = useState([]);
  const [inactiveUsers, setInactive] = useState([]);
  const [loading, setLoading] = useState(true);

  // console.log(localStorage.getItem("classes").length);

  useEffect(() => {
    // localStorage.setItem("messages", null);
    console.log("useEffect has ran");
    get_users_classes_from_server();
    get_chat_from_server();
    get_active_users_from_server();
    get_inactive_users_from_server();
    get_users_notes_from_server();
    /*
    newChats = [...chats];
    console.log(newChats);
    newClasses = [...classes];
    console.log(newClasses);
    newActiveUsers = [...activeUsers];
    newInactiveUsers = [...inactiveUsers];
    newUserNotes = [...userNotes];
    */

    //foo();
  }, []);

  // function get_users_classes_from_server(id) {
  //   axios
  //     .get("http://localhost:3000/class_data/${id}")
  //     .then((res) => {
  //       setChats(res.data);

  //       if (res.data) {
  //         localStorage.setItem(
  //           "classes",
  //           JSON.stringify(response.data.class[0])
  //         );
  //       }
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching data from the API:", error);
  //       console.log("not connected");
  //     });
  // }

  // console.log(storedClasses.length);

  // for (let i = 0; i < storedClasses.length; i++) {
  //   console.log(storedClasses[i].className);
  //   classes.push(storedClasses[i].className);
  // }
  async function get_users_classes_from_server() {
    const id = localStorage.getItem("id");
    console.log(id);
    try {
      const response = await axios.get("http://localhost:3000/class_data", {
        params: { id: id },
      });
      if (response.data) {
        localStorage.setItem("classes", JSON.stringify(response.data.class[0]));
        const parsedClasses = JSON.parse(localStorage.getItem("classes"));
        setClasses(parsedClasses);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching data from the API:", error);
    }
  }

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
        setActive(res.data);
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
        setInactive(res.data);
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
        setNotes(res.data);
        localStorage.setItem("notes", JSON.stringify(res.data));
      })
      .catch((error) => {
        console.error("Error fetching data from the API:", error);
        console.log("not connected");
      });
  }

  console.log(classes);
  const isChatroom = true;

  let dummyCallback = (data) => {
    return data;
  };

  if (localStorage.getItem("id")) {
    history.pushState(null, null, location.href);
    window.onpopstate = function (event) {
      history.go(1);
    };
  }

  // if (loading) {
  //   return <h1>BRB</h1>;
  // }

  function get_time(timestamp) {
    const date = new Date(timestamp);
    const returnedDate = date.toLocaleDateString("en-US");
    const returnedTime = date.toLocaleTimeString("en-US");
    const timeString = returnedDate.concat(" ", returnedTime);
    return timeString;
  }

  function show_chats() {
    try {
      return chats.map((chat, index) => (
        <div key={index} className="chat-panel">
          <div className="container-fluid the-chat-div rounded-0">
            <div className="container-body">
              <p className="full-datetime">{get_time(chat.timestamp)}</p>
              <p className="user-text">{chat.username}</p>
              <p className="text-content">{chat.text}</p>
            </div>
          </div>
        </div>
      ));
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <Navbar classes={classes} />
      <div className="container-fluid">
        <div className="row no-gutters">
          <div className="col-2 column1">
            <Sidebar parentCallback={dummyCallback} notePages={notePages} />
          </div>
          <div className="col-8 column2">
            <div id="chat-window">{show_chats()}</div>
            <form className="the-chat-form">
              <div id="the-textarea" className="container-fluid">
                <textarea id="txt"></textarea>
              </div>
              <div id="chat-text-btn" className="container-fluid">
                <button id="send-button">Send</button>
              </div>
            </form>
          </div>
          <div className="col-2 column3">
            <Userbar activeUsers={activeUsers} inactiveUsers={inactiveUsers} />
          </div>
        </div>
      </div>
    </>
  );
}

export default Chatroom;
