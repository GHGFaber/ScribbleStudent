import Navbar from "../components/Navbar.jsx";
import Sidebar from "../components/Sidebar.jsx";
import Userbar from "../components/Userbar.jsx";
import { useEffect, useState } from "react";

import socket from '../components/Socket.jsx';

// //++++++++++++++++++++++++++++++++++

// import io from "socket.io-client";
// const socket = io.connect("http://localhost:3000", {
//   reconnection: false
// }); //connect to socket.io server
// //++++++++++++++++++++++++++++++++++



// function Chatroom({chats, classes, activeUsers, inactiveUsers}) {    
  function Chatroom({classes, activeUsers, inactiveUsers}) { 
    //++++++++++++++++++++++++
    //chat State
    const [chats, setChats] = useState([]);
    //++++++++++++++++++++++++
    
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
    //++++++++++++++++++++++++++++++++++++++++++++++++++++
    // //grab username from localStorage (preserves data across multiple sessions)
    // const storedData = JSON.parse(localStorage.getItem('userData'));//grab object
    // const username = storedData.username;//grab data from object

    // Grab username from session storage (data disappears when browser is closed)
    const storedData = JSON.parse(sessionStorage.getItem('userData')); // Grab object
    //const username = storedData.username; // Grab data from object

      
    //Room State
    var [room, setRoom] = useState("");
    // Message States
    const [message, setMessage] = useState("");

    const joinRoom = () => {
      if (room !== "") {
        socket.emit("join_room", room);
      }
    };

    function handleKeyDown(event) {
      if (event.key === 'Enter') {
        sendMessage(); // Call your sendMessage function to submit the message
      }
    }

    //Shows the user's own message
    function userMsg() {
      const curChat = {
        username: "(Me) " + storedData.username,
        text: message,
        timestamp: Date.now()
      };
      setChats((prevChats) => [...prevChats, curChat]); //update chat
    }
    
    const sendMessage = () => {
      // Check if the message is empty (works)
      //If message empty, do nothing (allows for whitespace)
      if (message.trim() !== '' || message !== '') {
        // Clear the textarea value after submit
        document.getElementById('txt').value = '';
        setMessage('');

        event.preventDefault(); //stops page from refreshing on submission
        userMsg();
        if (room !== "") {
          socket.emit("send_message", { username: storedData.username, message, room }); //sending username, message and room
        } else {
          socket.emit("send_broadcast", { username: storedData.username, message }); //if a room number isn't entered then send broadcast
        }
      }
    };
    
    useEffect(() => {
      socket.on("receive_message", (data) => {
        //creates new chats to insert in chats State
        const newChat = {
          username: data.username,
          text: data.message,
          timestamp: Date.now()
        };
        setChats((prevChats) => [...prevChats, newChat]); //update chats
      })
    
      return () => {
        socket.off("receive_message");
      };

    // }, []);
    }, [socket])
    //++++++++++++++++++++++++++++++++++++++++++++++++++++
    
    return (
      <>
      {/* Testing separate chatrooms */}
      <button onClick={joinRoom}>class</button>
      <input placeholder="Enter a class" onChange={(event) => {
        setRoom(event.target.value);
      }}></input>
            <Navbar classes={classes}/>
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
                            {/* Displays message being sent */}
                            {/* <br></br><h2>Message:</h2>
                            {messageReceived} */}
                        </div>
                        <form className="the-chat-form">
                            <div id="the-textarea" className="container-fluid">
                              {/* Added functionality for submitting */}
                                <textarea id="txt" onChange={(event) => {
                                  setMessage(event.target.value);
                                }} onKeyDown={handleKeyDown} required></textarea>
                            </div>
                            <div id="chat-text-btn" className="container-fluid">
                                {/* Send the message after entering */}
                                <button onClick={sendMessage} id="send-button">Send</button>
                            </div>       
                        </form>     
                    </div>
                    <div className="col-2 column3">
                        <Userbar activeUsers={activeUsers} inactiveUsers={inactiveUsers}/>
                    </div>
                </div>
            </div>
        </>
    );
  }

export default Chatroom;