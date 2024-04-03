import Navbar from "../components/Navbar.jsx";
import Sidebar from "../components/Sidebar.jsx";
import Userbar from "../components/Userbar.jsx";
import axios from "axios";
import moment from "moment"; // For timestamp
import { useEffect, useState, useRef } from "react";
import socket from "../components/Socket.jsx";
import emptyPic from "../images/huh_what.png";
import avatarPic from "../images/default_pic.png";
function Chatroom({
  room,
  setRoom,
  classes,
  setClasses,
  chats,
  setChats,
  username,
  setUsername,
  activeUsers,
  setActiveUsers,
  inactiveUsers,
  setInactiveUsers,
  notePages,
  setNotes,
  selectedNote,
  setSelectedNote,
}) {
  console.log("YOOOO", room);
  // Message State
  const [message, setMessage] = useState(null);
  // Typing State
  const [typing, setTyping] = useState([]);
  // Current chatroom
  const [currChatroom, setCurrChatroom] = useState("");

  function get_time(timestamp) {
    const date = new Date(timestamp);
    const returnedDate = date.toLocaleDateString("en-US");
    const returnedTime = date.toLocaleTimeString("en-US");
    const timeString = returnedDate.concat(" ", returnedTime);
    return timeString;
  }

  // Reference for chat container
  const chatContainerRef = useRef(null);

  function show_chats() {
    console.log(chats.length);

    return (
      <div ref={chatContainerRef} className="chat-container">
        {chats.map((chat, index) => (
          <div key={index} className="chat-panel">
            <div className="container-fluid the-chat-div rounded-0">
              <div className="flexed-container">
                <div className="avatar-body">
                  <img
                    className="avatar-picture"
                    src={
                      chat.profilePic && chat.profilePic !== ""
                        ? `data:image/png;base64,${chat.profilePic}`
                        : avatarPic
                    }
                    alt="avatar-picture"
                  />
                </div>
                <div className="container-body">
                  <p className="full-datetime">{get_time(chat.timestamp)}</p>
                  <p className="user-text">{chat.username}</p>
                  <p className="text-content">{chat.text}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Function to scroll to the bottom of the chat container
  function scrollToBottom() {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }

  let dummyCallback = (data) => {
    return data;
  };

  // Grab username from session storage (data disappears when browser is closed)
  const storedData = JSON.parse(sessionStorage.getItem("userData")); // Grab object

  function handleKeyDown(event) {
    if (event.key === "Enter") {
      sendMessage();
    }
  }

  // Shows the user's own message
  function userMsg() {
    const curChat = {
      username: "(Me) " + storedData.username,
      text: message,
      timestamp: Date.now(),
      profilePic:
        storedData.avatar !== null
          ? storedData.avatar.toString()
          : storedData.avatar,
    };
    setChats((prevChats) => [...prevChats, curChat]); //update local chat
  }

  const sendMessage = async () => {
    // If message empty, do nothing (allows for whitespace)
    // if (message.trim() !== '' || message !== '') {
    if (/\S/.test(message)) {
      // Clear the textarea value after submit
      document.getElementById("txt").value = "";
      setMessage("");
      // Stops page from refreshing on submission
      // event.preventDefault();
      userMsg();
      // Send username and message
      socket.emit("send_message", {
        username: storedData.username,
        message,
        avatar:
          storedData.avatar !== null
            ? storedData.avatar.toString()
            : storedData.avatar, // Include avatar in the message data
      });
      // Update chatroom for class
      // Need the current classID (got it)
      console.log("Current classID: ", room.ID);
      const classID = room.ID;
      await axios.post(`${import.meta.env.VITE_ENDPOINT}/insert-message`, {
        message: message,
        timestamp: moment().format("YYYY-MM-DD HH:mm:ss"),
        classID: classID,
      });
    }
  };

  // Typing
  function userTyping() {
    // emit username
    socket.emit("typing", username);
  }

  // Clear textarea when switching tabs
  function clearText() {
    const textarea = document.getElementById("txt");
    if (textarea) {
      textarea.value = ""; // Clear value of textarea
    }
  }

  useEffect(() => {
    scrollToBottom();
    clearText();
  }, [chats]);

  useEffect(() => {
    socket.on(
      "receive_message",
      (data) => {
        console.log("LETSGOOO", data);
        const newChat = {
          username: data.username,
          text: data.message,
          timestamp: Date.now(),
          profilePic: data.avatar,
        };
        // Update chats
        setChats((prevChats) => [...prevChats, newChat]);
      },
      []
    );

    // Users typing in chatroom
    socket.on("is_typing", (data) => {
      // Update typing users array based on previous state
      setTyping(data);
    });

    socket.on("clear_typing", (data) => {
      setTyping([]);
    });

    // User joined
    // *** Display message + username when user joins a room ***
    socket.once("user joined", (data) => {
      // const joined = {
      //   username: null,
      //   text: "User Joined",
      //   timestamp: Date.now()
      // };
      // setChats((prevChats) => [...prevChats, joined]);
    });

    // User left
    // *** Display message + username when user leaves a room ***
    socket.once("user left", (data) => {
      // const left = {
      //   username: null,
      //   text: "User Left",
      //   timestamp: Date.now()
      // };
      // setChats((prevChats) => [...prevChats, left]);
    });

    return () => {
      socket.off("receive_message");
      socket.off("user joined");
      socket.off("user left");
      socket.off("is_typing");
    };
  }, [socket, message]);

  return (
    <>
      {/* Pass props to Navbar component */}
      <Navbar
        room={room}
        setRoom={setRoom}
        classes={classes}
        setClasses={setClasses}
        chats={chats}
        setChats={setChats}
        username={username}
        setUsername={setUsername}
      />
      <div className="container-fluid">
        <div className="row no-gutters">
          <div className="col-2 column1">
            <Sidebar
              parentCallback={dummyCallback}
              notePages={notePages}
              setNotes={setNotes}
              selectedNote={selectedNote}
              setSelectedNote={setSelectedNote}
              classes={classes}
              chats={chats}
            />
          </div>
          <div className="col-8 column2">
            <div id="chat-window">{show_chats()}</div>
            {/* Only display chatbox and submit if user belongs to a class */}
            {classes && classes.length > 0 && (
              <form className="the-chat-form">
                <div id="the-textarea" className="container-fluid">
                  {/* Added functionality for submitting */}
                  <textarea
                    id="txt"
                    onChange={(event) => {
                      setMessage(event.target.value);
                      userTyping();
                    }}
                    onKeyDown={handleKeyDown}
                    style={{
                      resize: "none",
                      height: "45px",
                      borderRadius: "8px",
                      outline: "none",
                      boxShadow: "0 0 0 transparent",
                      padding: "8px",
                      overflow: "hidden",
                    }}
                    // Colored outline and shadow when textarea clicked
                    onFocus={(event) => {
                      event.target.style.outline = "2px purple";
                      event.target.style.boxShadow = "0 0 5px rgb(65, 65, 102)";
                    }}
                    onBlur={(event) => {
                      event.target.style.outline = "none";
                      event.target.style.boxShadow = "0 0 0 transparent";
                    }}
                    placeholder={"Message in " + room.Name}
                    required
                  ></textarea>
                </div>
                <div
                  id="chat-text-btn"
                  className="container-fluid"
                  style={{
                    width: "65%",
                    marginLeft: "0px",
                    marginTop: "-55px",
                    position: "fixed",
                  }}
                >
                  {/* Send the message after entering */}
                  <button onClick={sendMessage} id="send-button">
                    Send
                  </button>
                  {typing && typing.length > 0 && (
                    <div
                      className="typing-container"
                      style={{ marginTop: "-12px" }}
                    >
                      <div className="typing">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                      <p style={{ marginTop: "20px" }}>
                        <b>{typing}</b> is typing...
                      </p>
                    </div>
                  )}
                </div>
              </form>
            )}
          </div>
          <div className="col-2 column3">
            <Userbar
              activeUsers={activeUsers}
              setActiveUsers={setActiveUsers}
              inactiveUsers={inactiveUsers}
              setInactiveUsers={setInactiveUsers}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default Chatroom;

// if curClass changes then the data for the current class the user is viewing is reset
// useEffect(() => {
//   get_users_notes_from_server();
//   console.log("Chatroom: the second useEffect has ran.");
//   setCurrentClass(sessionStorage.getItem("currentClass"));
//   console.log("Chatroom: the current class is now " + curClass);
//   console.log(
//     "The current chats now are " + sessionStorage.getItem("currentClassData")
//   );

//   if (JSON.parse(sessionStorage.getItem("currentClassData"))) {
//     console.log(
//       "useEffect: The new class data is " +
//         sessionStorage.getItem("currentClassData")
//     );
//     const curClassData = JSON.parse(
//       sessionStorage.getItem("currentClassData")
//     );
//     setChats(curClassData);
//   }
// }, [curClass]);

// this will trigger when the user clicks on another class;
// will get the new current class from session storage and set the
// current class appropriately
// function change_that_class() {
//   console.log("Chatroom: class has changed");
//   setCurClass(sessionStorage.getItem("currentClass"));
//   console.log("change_that_class: new class is " + curClass);
// }

// const set_first_class = async (theClasses) => {
//   console.log("Setting the first class..." + JSON.stringify(theClasses[0]));
//   const className = theClasses[0].className;
//   console.log("Chatroom: first class is " + className);
//   try {
//     const response = await axios.post("http://localhost:3000/classes", {
//       className: className,
//     });
//     sessionStorage.setItem(
//       "currentClass",
//       JSON.stringify(response.data.classData)
//     );
//     console.log(
//       "set_first_class: class is " + sessionStorage.getItem("currentClass")
//     );
//     get_chat_from_server();
//     //setChats(JSON.parse(localStorage.getItem("chats")));

//     //console.log("set_first_class: chats are now set to " + JSON.parse(localStorage.getItem("chats")));
//     //handleClassChange();
//   } catch (error) {
//     console.error(
//       "set_first_class: error fetching class from the API:",
//       error
//     );
//   }
// };

// // contacts backend to retrieve the user's classes from the database
// async function get_users_classes_from_server() {
//   const id = localStorage.getItem("id");
//   console.log(id);
//   try {
//     const response = await axios.get("http://localhost:3000/class_data", {
//       params: { id: id },
//     });
//     console.log(response.data);
//     if (response.data) {
//       localStorage.setItem("classes", JSON.stringify(response.data.class[0]));
//       sessionStorage.setItem(
//         "currentClass",
//         JSON.stringify(response.data.class[0][0])
//       );
//       console.log(response.data.class[0][0]);
//       const parsedClasses = JSON.parse(localStorage.getItem("classes"));
//       console.log(JSON.stringify(parsedClasses));
//       setClasses(parsedClasses);
//       set_first_class(parsedClasses);
//       setLoading(false);
//       console.log("User classes successfully loaded");
//     }
//   } catch (error) {
//     console.error("Error fetching data from the API:", error);
//   }
// }

// // contacts backend to retrieve the chatroom messages for a particular class
// function get_chat_from_server() {
//   console.log("Start loading chat messages");
//   console.log(
//     "Chatroom/get_chat_from_server: class data is " +
//       sessionStorage.getItem("currentClass")
//   );
//   const theClass = JSON.parse(sessionStorage.getItem("currentClass"));
//   console.log(
//     "get_chat_from_server: theClass is " + JSON.stringify(theClass[0])
//   );
//   const theID = theClass[0].classID;
//   console.log("get_chat_from_server: class id is " + theID);
//   axios
//     .post("http://localhost:3000/messages", {
//       classID: theID,
//     })
//     .then((res) => {
//       if (res.data.length === 0) {
//         isItEmpty = true;
//         console.log("the chat is empty...");
//       } else {
//         setChats(res.data);
//         console.log(res.data);
//       }
//       localStorage.setItem("chats", JSON.stringify(res.data));
//       sessionStorage.setItem("currentClassData", JSON.stringify(res.data));
//       console.log(
//         "get_chat_from_server: session storage is " +
//           sessionStorage.getItem("currentClassData")
//       );
//       setChats(
//         JSON.parse(sessionStorage.getItem("currentClassData"))["userData"]
//       );
//     })
//     .catch((error) => {
//       console.error("Error fetching data from the API:", error);
//       console.log("not connected");
//     });
//

//   console.log(classes);
//   const isChatroom = true;

//   let dummyCallback = (data) => {
//     return data;
//   };

//   if (localStorage.getItem("id")) {
//     history.pushState(null, null, location.href);
//     window.onpopstate = function (event) {
//       history.go(1);
//     };
//   }

//   // if (loading) {
//   //   return <h1>BRB</h1>;
//   // }

//   // receives timestamp and converts it to mm/dd/yyyy hh:mm:ss format
//   function get_time(timestamp) {
//     const date = new Date(timestamp);
//     const returnedDate = date.toLocaleDateString("en-US");
//     const returnedTime = date.toLocaleTimeString("en-US");
//     const timeString = returnedDate.concat(" ", returnedTime);
//     return timeString;
//   }

//   console.log("Chatroom: isItEmpty is " + isItEmpty);

//   // displays all messages in the chatroom space
//   function show_chats() {
//     try {
//       return chats.map((chat, index) => (
//         <div key={index} className="chat-panel">
//           <div className="container-fluid the-chat-div rounded-0">
//             <div className="container-body">
//               <p className="full-datetime">{get_time(chat.timestamp)}</p>
//               <p className="user-text">{chat.username}</p>
//               <p className="text-content">{chat.message}</p>
//             </div>
//           </div>
//         </div>
//       ));
//     } catch (error) {
//       console.log(error);
//     }
//   }

//   // will render the full chatroom if there are messages
//   // will render an empty page with a graphic if not
//   if (chats && chats != "") {
//     console.log("Chatroom: messages for a class have been rendered.");
//     console.log("chats are " + JSON.stringify(chats.userData));
//     return (
//       <>
//         <Navbar classes={classes} handleClassChange={change_that_class} />
//         <div className="container-fluid">
//           <div className="row no-gutters">
//             <div className="col-2 column1">
//               <Sidebar parentCallback={dummyCallback} notePages={notePages} />
//             </div>
//             <div className="col-8 column2">
//               <div id="chat-window">{show_chats()}</div>
//               <form className="the-chat-form">
//                 <div id="the-textarea" className="container-fluid">
//                   <textarea id="txt"></textarea>
//                 </div>
//                 <div id="chat-text-btn" className="container-fluid">
//                   <button id="send-button">Send</button>
//                 </div>
//               </form>
//             </div>
//             <div className="col-2 column3">
//               <Userbar
//                 activeUsers={activeUsers}
//                 inactiveUsers={inactiveUsers}
//               />
//             </div>
//           </div>
//         </div>
//       </>
//     );
//   } else if (chats && chats == "") {
//     console.log("Chatroom: no messages for a class.");
//     return (
//       <>
//         <Navbar classes={classes} handleClassChange={change_that_class} />
//         <div className="container-fluid">
//           <div className="row no-gutters">
//             <div className="col-2 column1">
//               <Sidebar parentCallback={dummyCallback} notePages={notePages} />
//             </div>
//             <div className="col-8 column2">
//               <div id="chat-window-empty">
//                 <div className="empty-text-wrapper">
//                   <img
//                     className="the-empty-picture"
//                     src={emptyPic}
//                     alt="empty-text-graphic"
//                   />
//                   <h2>Seems like there is no one here...</h2>
//                   <p>Start the conversation - post something now!</p>
//                 </div>
//               </div>
//               <form className="the-chat-form">
//                 <div id="the-textarea" className="container-fluid">
//                   <textarea id="txt"></textarea>
//                 </div>
//                 <div id="chat-text-btn" className="container-fluid">
//                   <button id="send-button">Send</button>
//                 </div>
//               </form>
//             </div>
//             <div className="col-2 column3">
//               <Userbar
//                 activeUsers={activeUsers}
//                 inactiveUsers={inactiveUsers}
//               />
//             </div>
//           </div>
//         </div>
//       </>
//     );
//   } else if (classes == 0) {
//     console.log("Classes: no classes found");
//     return (
//       <>
//         <Navbar classes={classes} handleClassChange={change_that_class} />
//         <div className="container-fluid">
//           <div className="row no-gutters">
//             <div className="col-2 column1">
//               <Sidebar parentCallback={dummyCallback} notePages={notePages} />
//             </div>
//             <div className="col-8 column2">
//               <div id="chat-window-empty">
//                 <div className="empty-text-wrapper">
//                   <img
//                     className="the-empty-picture"
//                     src={emptyPic}
//                     alt="empty-text-graphic"
//                   />
//                   <h2>Seems like there is no one here...</h2>
//                   <p>Start the conversation - post something now!</p>
//                 </div>
//               </div>
//               <form className="the-chat-form">
//                 <div id="the-textarea" className="container-fluid">
//                   <textarea id="txt"></textarea>
//                 </div>
//                 <div id="chat-text-btn" className="container-fluid">
//                   <button id="send-button">Send</button>
//                 </div>
//               </form>
//             </div>
//             <div className="col-2 column3">
//               <Userbar
//                 activeUsers={activeUsers}
//                 inactiveUsers={inactiveUsers}
//               />
//             </div>
//           </div>
//         </div>
//       </>
//     );
//   }
// }
