import Navbar from "../components/Navbar.jsx";
import Sidebar from "../components/Sidebar.jsx";
import Userbar from "../components/Userbar.jsx";
import axios from "axios";
import { useEffect, useState } from "react";
import socket from '../components/Socket.jsx';

   
function Chatroom({ classes, setClasses, chats, setChats, username, setUsername, activeUsers, setActiveUsers, inactiveUsers, setInactiveUsers }) {

  // Message State
  const [message, setMessage] = useState(null);
    
    function get_time(timestamp) {
        const date = new Date(timestamp);
        const returnedDate = date.toLocaleDateString("en-US");
        const returnedTime = date.toLocaleTimeString("en-US");
        const timeString = returnedDate.concat(" ", returnedTime);
        return timeString;
    }

    function show_chats() {
        return (
            chats.map((chat, index) => (
                <div key={index} className="chat-panel">
                    <div className="container-fluid the-chat-div rounded-0">
                        <div className="container-body">
                            <p className="full-datetime">{get_time(chat.timestamp)}</p>
                            <p className="user-text">{chat.username}</p>
                            <p className="text-content">{chat.text}</p>
                        </div>
                    </div>     
                </div>      
            ))
        );
      }


    // Grab username from session storage (data disappears when browser is closed)
    const storedData = JSON.parse(sessionStorage.getItem('userData')); // Grab object

      
    // Room State
    // var [room, setRoom] = useState(null);

    function handleKeyDown(event) {
      if (event.key === 'Enter') {
        sendMessage(); 
      }
    }

    // Shows the user's own message
    function userMsg() {
      const curChat = {
        username: "(Me) " + storedData.username,
        text: message,
        timestamp: Date.now()
      };
      setChats((prevChats) => [...prevChats, curChat]); //update local chat
    }
    
    const sendMessage = async() => {
      // If message empty, do nothing (allows for whitespace)
      // if (message.trim() !== '' || message !== '') {
      if (/\S/.test(message)) {
        // Clear the textarea value after submit
        document.getElementById('txt').value = '';
        setMessage('');
        // Stops page from refreshing on submission
        // event.preventDefault(); 
        userMsg();
        // Send username and message 
        socket.emit("send_message", { username: storedData.username, message });
        // Update chatroom for class
        // Need the current classID (got it)
        console.log("Current classID: ", chats[0].classID); 
        const classID = chats[0].classID;
        await axios.post("http://localhost:3000/insert-message", {
          message: message,
          timestamp: new Date(Date.now()).toISOString(),
          classID: classID
        });
      }
    };

    
    useEffect(() => {
      socket.on("receive_message", (data) => {
        const newChat = {
          username: data.username,
          text: data.message,
          timestamp: Date.now()
        };
        // Update chats
        setChats((prevChats) => [...prevChats, newChat]); 
      })
      
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

      // console.log("classID: ", chats[0].classID);
      
      return () => {
        socket.off("receive_message");
        socket.off("user joined");
        socket.off("user left");
      };

    }, [socket, message])
    
    
    return (
      <>
        {/* Pass props to Navbar component */}
        <Navbar 
          classes={classes} setClasses={setClasses} chats={chats} setChats={setChats} 
          username={username} setUsername={setUsername}
        />
          <div className="container-fluid">
              <div className="row no-gutters">
                  <div className="col-2 column1">
                      <Sidebar/>
                  </div>
                  <div className="col-8 column2">
                      <div id="chat-window">
                          {
                            show_chats()
                          }
                      </div>
                      {/* Only display chatbox and submit if user belongs to a class */}
                      {classes && classes.length > 0 && 
                        <form className="the-chat-form">
                            <div id="the-textarea" className="container-fluid">
                              {/* Added functionality for submitting */}
                                <textarea id="txt" onChange={(event) => {
                                  setMessage(event.target.value);
                                }} onKeyDown={handleKeyDown} style={{resize: "none"}} required></textarea>
                            </div>
                            <div id="chat-text-btn" className="container-fluid" style={{ width: "65%", marginLeft: "0px", marginTop: "-20px", position: "fixed" }}>
                                {/* Send the message after entering */}
                                <button onClick={sendMessage} id="send-button">Send</button>
                            </div>       
                        </form> 
                      }               
                          
                  </div>
                  <div className="col-2 column3">
                      <Userbar activeUsers={activeUsers} setActiveUsers={setActiveUsers}
                        inactiveUsers={inactiveUsers} setInactiveUsers={setInactiveUsers}
                      />
                  </div>
              </div>
          </div>
      </>
    );
  }

export default Chatroom;