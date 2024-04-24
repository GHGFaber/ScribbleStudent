import avatarPic from "../images/default_pic.png";
import { useState, useEffect, useRef } from "react";
import socket from "../components/Socket.jsx";
import Navbar from "../components/Navbar.jsx";
import DMSidebar from "../components/DMSidebar.jsx";
import DMUserbar from "../components/DMUserbar.jsx";
import axios from "axios";

function DirectMessages({
  classes,
  setClasses,
  chats,
  setChats,
  directChats,
  setDirectChats,
  username,
  setUsername,
  activeUsers,
  setActiveUsers,
  inactiveUsers,
  setInactiveUsers,
  room,
  setRoom,
  friendInfo,
  setFriendInfo,
  profileInfo,
  setProfileInfo,
}) {
  // Message State
  const [message, setMessage] = useState(null);
  const [notePages, setNotes] = useState([]);
  let userData = JSON.parse(sessionStorage.getItem("userData"));

  function get_time(timestamp) {
    const date = new Date(timestamp);
    const returnedDate = date.toLocaleDateString("en-US");
    const returnedTime = date.toLocaleTimeString("en-US");
    const timeString = returnedDate.concat(" ", returnedTime);
    return timeString;
  }

  // Have a method similar to this
  /*
   // Join a room
   const joinRoom = async (dmData) => {
    if (dmData !== null) {
      // Get message data for room
      const dmID = dmData.dmID;
      const response = await axios.post("http://localhost:3000/messages", {
        dmID: dmID,
      });
      const messageData = response.data.userData.map((item) => ({
        // Grab message data
        username: item.username,
        text: item.message,
        timestamp: item.timestamp,
        classID: classID,
      }));
      const room = dmData.dmID;
      console.log("dmID: ", dmID);
      //setRoom(room);
      socket.emit("join_room", room);
      // Clear chat
      setMessage([]);
      setMessage(messageData);
    }
  };
  */

  // Reference for chat container
  const chatContainerRef = useRef(null);

  function set_chats_to_empty() {
    //console.log("DirectMessages: direct chats is " + JSON.stringify(directChats) + " with length " + directChats.length);
    if (!directChats) setDirectChats([]);
  }

  function show_chats() {
    //console.log("DirectMessages: direct chats is " + JSON.stringify(directChats));
    //if (!directChats) setDirectChats([]);
    //console.log("direct chats are: " + JSON.stringify(directChats));
    console.log("The avatar string is: " + JSON.stringify(directChats[0]));
    return (
      <div ref={chatContainerRef} className="chat-container">
        {directChats.map((chat, index) => (
          <div key={index} className="chat-panel">
            <div className="container-fluid the-chat-div rounded-0">
              <div className="flexed-container">
                <div className="avatar-body">
                  <img
                    className="avatar-picture"
                    src={
                      chat.profilePic && chat.profilePic !== ""
                        ? `data:image/jpeg;base64,${chat.profilePic}`
                        : avatarPic
                    }
                    alt="avatar-picture"
                  />
                </div>
                <div className="container-body">
                  <p className="full-datetime">{get_time(chat.timestamp)}</p>
                  <p className="user-text">{chat.username}</p>
                  <p className="text-content">{chat.message}</p>
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

  // Room State
  // var [room, setRoom] = useState(null);

  function handleKeyDown(event) {
    if (event.key === "Enter") {
      sendMessage();
    }
  }

  // Shows the user's own message
  function userMsg() {
    const curMessage = {
      username: "(Me) " + storedData.username,
      message: message,
      timestamp: Date.now(),
      profilePic:
        storedData.avatar !== null
          ? storedData.avatar.toString()
          : storedData.avatar,
    };
    setDirectChats((prevMessages) => [...prevMessages, curMessage]); //update local chat
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
      // setMessage(storedData);
      socket.emit("send_direct_message", {
        username: storedData.username,
        message,
        avatar:
          storedData.avatar !== null
            ? storedData.avatar.toString()
            : storedData.avatar, // Include avatar in the message data
      });
      // Update chatroom for class
      // Need the current classID (got it)
      console.log("Current dmID: ", room.ID);
      //const dmID = room.ID;
      console.log(
        "Your DM ID String: " + JSON.parse(sessionStorage.getItem("dmIDRoom"))
      );
      const dmID = parseInt(sessionStorage.getItem("dmIDRoom"));
      console.log("The dmID for this direct message is " + dmID);
      await axios.post(
        `${import.meta.env.VITE_ENDPOINT}/insert-direct-message`,
        {
          message: message,
          timestamp: new Date(Date.now()).toISOString(),
          dmID: dmID,
          username: storedData.username,
        }
      );
    }
  };

  useEffect(() => {
    console.log("Chatroom: this useEffect has ran");
    set_chats_to_empty();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [chats]);

  /*
  useEffect(() => {

    setDirectChats(message);

  }, [message]);
  */

  useEffect(() => {
    socket.on(
      "receive_direct_message",
      (data) => {
        console.log("my message is: " + data.message);
        const newMsg = {
          username: data.username,
          message: data.message,
          timestamp: Date.now(),
          profilePic: data.avatar,
        };
        // Update chats
        setDirectChats((prevMessages) => [...prevMessages, newMsg]);
      },
      []
    );

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
      socket.off("receive_direct_message");
      socket.off("user joined");
      socket.off("user left");
    };
  }, [socket, message]);

  return (
    <>
      {/* Pass props to Navbar component */}
      <Navbar
        classes={classes}
        setClasses={setClasses}
        chats={chats}
        setChats={setChats}
        directChats={directChats}
        setDirectChats={setDirectChats}
        username={username}
        setUsername={setUsername}
        notePages={notePages}
        friendInfo={friendInfo}
        setFriendInfo={setFriendInfo}
        room={room}
        setRoom={setRoom}
      />
      <div className="container-fluid">
        <div className="row no-gutters">
          <div className="col-2 column1">
            <DMSidebar
              parentCallback={dummyCallback}
              setDirectChats={setDirectChats}
              notePages={notePages}
              friendInfo={friendInfo}
              setFriendInfo={setFriendInfo}
              setRoom={setRoom}
            />
          </div>
          <div className="col-7 column2">
            <div id="chat-window">{show_chats()}</div>
            <form className="the-chat-form">
              <div id="the-dm-textarea" className="container-fluid">
                {/* Added functionality for submitting */}
                <textarea
                  id="txt"
                  onChange={(event) => {
                    setMessage(event.target.value);
                  }}
                  onKeyDown={handleKeyDown}
                  style={{ resize: "none" }}
                  required
                ></textarea>
              </div>
              <div
                id="chat-text-dm-btn"
                className="container-fluid"
                style={{
                  width: "57%",
                  marginLeft: "0px",
                  marginTop: "-20px",
                  position: "fixed",
                }}
              >
                {/* Send the message after entering */}
                <button onClick={sendMessage} id="send-dm-button">
                  Send
                </button>
              </div>
            </form>
          </div>
          <div className="col-3 column3">
            <DMUserbar
              activeUsers={activeUsers}
              setActiveUsers={setActiveUsers}
              inactiveUsers={inactiveUsers}
              setInactiveUsers={setInactiveUsers}
              userData={userData}
              friendInfo={friendInfo}
              setFriendInfo={setFriendInfo}
              profileInfo={profileInfo}
              setProfileInfo={setProfileInfo}
            />
          </div>
        </div>
      </div>
    </>
  );

  // contacts backend to retrieve the user's classes from the database
  async function get_users_classes_from_server() {
    const id = localStorage.getItem("id");
    console.log(id);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_ENDPOINT}/class_data`,
        {
          params: { id: id },
        }
      );
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
  function get_direct_messages_from_server() {}

  // receives timestamp and converts it to mm/dd/yyyy hh:mm:ss format
  function get_time(timestamp) {
    const date = new Date(timestamp);
    const returnedDate = date.toLocaleDateString("en-US");
    const returnedTime = date.toLocaleTimeString("en-US");
    const timeString = returnedDate.concat(" ", returnedTime);
    return timeString;
  }
}
export default DirectMessages;
