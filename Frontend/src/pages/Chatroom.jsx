import Navbar from "../components/Navbar.jsx";
import Sidebar from "../components/Sidebar.jsx";
import Userbar from "../components/Userbar.jsx";
import { useEffect, useState } from "react";
import axios from "axios";
import emptyPic from "../images/huh_what.png";

// page that contains the chatroom and its corresponding messages
function Chatroom() {
  const [classes, setClasses] = useState([]);
  const [chats, setChats] = useState([]);
  const [notePages, setNotes] = useState([]);
  const [activeUsers, setActive] = useState([]);
  const [inactiveUsers, setInactive] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentClass, setCurrentClass] = useState([]);
  const [curClass, setCurClass] = useState([]);
  let isItEmpty = false;

  useEffect(() => {
    console.log("useEffect has ran");
    get_users_classes_from_server();
    //set_first_class(classes);
    //get_chat_from_server();
    get_active_users_from_server();
    get_inactive_users_from_server();
    get_users_notes_from_server();
    console.log(
      "Chatroom: current class data is " +
        sessionStorage.getItem("currentClassData")
    );
  }, []);

  // if curClass changes then the data for the current class the user is viewing is reset
  useEffect(() => {
    console.log("Chatroom: the second useEffect has ran.");
    setCurrentClass(sessionStorage.getItem("currentClass"));
    console.log("Chatroom: the current class is now " + curClass);
    console.log(
      "The current chats now are " + sessionStorage.getItem("currentClassData")
    );

    if (JSON.parse(sessionStorage.getItem("currentClassData"))) {
      console.log(
        "useEffect: The new class data is " +
          sessionStorage.getItem("currentClassData")
      );
      const curClassData = JSON.parse(
        sessionStorage.getItem("currentClassData")
      );
      setChats(curClassData);
    }
  }, [curClass]);

  // this will trigger when the user clicks on another class;
  // will get the new current class from session storage and set the
  // current class appropriately
  function change_that_class() {
    console.log("Chatroom: class has changed");
    setCurClass(sessionStorage.getItem("currentClass"));
    console.log("change_that_class: new class is " + curClass);
  }

  const set_first_class = async (theClasses) => {
    console.log("Setting the first class..." + JSON.stringify(theClasses[0]));
    const className = theClasses[0].className;
    console.log("Chatroom: first class is " + className);
    try {
      const response = await axios.post("http://localhost:3000/classes", {
        className: className,
      });
      sessionStorage.setItem(
        "currentClass",
        JSON.stringify(response.data.classData)
      );
      console.log(
        "set_first_class: class is " + sessionStorage.getItem("currentClass")
      );
      get_chat_from_server();
      //setChats(JSON.parse(localStorage.getItem("chats")));

      //console.log("set_first_class: chats are now set to " + JSON.parse(localStorage.getItem("chats")));
      //handleClassChange();
    } catch (error) {
      console.error(
        "set_first_class: error fetching class from the API:",
        error
      );
    }
  };

  // contacts backend to retrieve the user's classes from the database
  async function get_users_classes_from_server() {
    const id = localStorage.getItem("id");
    console.log(id);
    try {
      const response = await axios.get("http://localhost:3000/class_data", {
        params: { id: id },
      });
      console.log(response.data);
      if (response.data) {
        localStorage.setItem("classes", JSON.stringify(response.data.class[0]));
        sessionStorage.setItem(
          "currentClass",
          JSON.stringify(response.data.class[0][0])
        );
        console.log(response.data.class[0][0]);
        const parsedClasses = JSON.parse(localStorage.getItem("classes"));
        console.log(JSON.stringify(parsedClasses));
        setClasses(parsedClasses);
        set_first_class(parsedClasses);
        setLoading(false);
        console.log("User classes successfully loaded");
      }
    } catch (error) {
      console.error("Error fetching data from the API:", error);
    }
  }

  // contacts backend to retrieve the chatroom messages for a particular class
  function get_chat_from_server() {
    console.log("Start loading chat messages");
    console.log(
      "Chatroom/get_chat_from_server: class data is " +
        sessionStorage.getItem("currentClass")
    );
    const theClass = JSON.parse(sessionStorage.getItem("currentClass"));
    console.log(
      "get_chat_from_server: theClass is " + JSON.stringify(theClass[0])
    );
    const theID = theClass[0].classID;
    console.log("get_chat_from_server: class id is " + theID);
    axios
      .post("http://localhost:3000/messages", {
        classID: theID,
      })
      .then((res) => {
        if (res.data.length === 0) {
          isItEmpty = true;
          console.log("the chat is empty...");
        } else {
          setChats(res.data);
          console.log(res.data);
        }
        localStorage.setItem("chats", JSON.stringify(res.data));
        sessionStorage.setItem("currentClassData", JSON.stringify(res.data));
        console.log(
          "get_chat_from_server: session storage is " +
            sessionStorage.getItem("currentClassData")
        );
        setChats(
          JSON.parse(sessionStorage.getItem("currentClassData"))["userData"]
        );
      })
      .catch((error) => {
        console.error("Error fetching data from the API:", error);
        console.log("not connected");
      });
  }

  // contacts backend to show who is currently in the chatroom
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

  // contacts backend to show who is currently not in the chatroom
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

  // contacts backend to fetch the user's notes
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

  // receives timestamp and converts it to mm/dd/yyyy hh:mm:ss format
  function get_time(timestamp) {
    const date = new Date(timestamp);
    const returnedDate = date.toLocaleDateString("en-US");
    const returnedTime = date.toLocaleTimeString("en-US");
    const timeString = returnedDate.concat(" ", returnedTime);
    return timeString;
  }

  console.log("Chatroom: isItEmpty is " + isItEmpty);

  // displays all messages in the chatroom space
  function show_chats() {
    try {
      return chats.map((chat, index) => (
        <div key={index} className="chat-panel">
          <div className="container-fluid the-chat-div rounded-0">
            <div className="container-body">
              <p className="full-datetime">{get_time(chat.timestamp)}</p>
              <p className="user-text">{chat.username}</p>
              <p className="text-content">{chat.message}</p>
            </div>
          </div>
        </div>
      ));
    } catch (error) {
      console.log(error);
    }
  }

  // will render the full chatroom if there are messages
  // will render an empty page with a graphic if not
  if (chats && chats != "") {
    console.log("Chatroom: messages for a class have been rendered.");
    console.log("chats are " + JSON.stringify(chats.userData));
    return (
      <>
        <Navbar classes={classes} handleClassChange={change_that_class} />
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
              <Userbar
                activeUsers={activeUsers}
                inactiveUsers={inactiveUsers}
              />
            </div>
          </div>
        </div>
      </>
    );
  } else if (chats && chats == "") {
    console.log("Chatroom: no messages for a class.");
    return (
      <>
        <Navbar classes={classes} handleClassChange={change_that_class} />
        <div className="container-fluid">
          <div className="row no-gutters">
            <div className="col-2 column1">
              <Sidebar parentCallback={dummyCallback} notePages={notePages} />
            </div>
            <div className="col-8 column2">
              <div id="chat-window-empty">
                <div className="empty-text-wrapper">
                  <img
                    className="the-empty-picture"
                    src={emptyPic}
                    alt="empty-text-graphic"
                  />
                  <h2>Seems like there is no one here...</h2>
                  <p>Start the conversation - post something now!</p>
                </div>
              </div>
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
              <Userbar
                activeUsers={activeUsers}
                inactiveUsers={inactiveUsers}
              />
            </div>
          </div>
        </div>
      </>
    );
  } else if (classes == 0) {
    console.log("Classes: no classes found");
    return (
      <>
        <Navbar classes={classes} handleClassChange={change_that_class} />
        <div className="container-fluid">
          <div className="row no-gutters">
            <div className="col-2 column1">
              <Sidebar parentCallback={dummyCallback} notePages={notePages} />
            </div>
            <div className="col-8 column2">
              <div id="chat-window-empty">
                <div className="empty-text-wrapper">
                  <img
                    className="the-empty-picture"
                    src={emptyPic}
                    alt="empty-text-graphic"
                  />
                  <h2>Seems like there is no one here...</h2>
                  <p>Start the conversation - post something now!</p>
                </div>
              </div>
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
              <Userbar
                activeUsers={activeUsers}
                inactiveUsers={inactiveUsers}
              />
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default Chatroom;
