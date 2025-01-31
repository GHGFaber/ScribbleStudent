import logo from "../react_images/scrib_emblem.png";
import Popup from "reactjs-popup";
import { Link } from "react-router-dom";
import axios from "axios";
import "reactjs-popup/dist/index.css";
import UserProfile from "./UserProfile";
import { useEffect, useState, useRef } from "react";
import socket from "../components/Socket.jsx";
import { connect } from "socket.io-client";
import moment from "moment";
import avatarPic from "../images/default_pic.png";

//+++++++++++++++++++++++++++++++++
// 2 SEPARATE INSTANCES OF NAVBAR:
// NAVBAR IN CHATROOM
// NAVBAR IN NOTEBOOK
//+++++++++++++++++++++++++++++++++

// Maintains current user sessionID
// Need to use 'withCredentials: true' so cookies are
// sent with request so session cookie is present
// else backend creates new session for every request.
axios.defaults.withCredentials = true;

function Navbar({
  room,
  setRoom,
  chats,
  setChats,
  classes,
  setClasses,
  username,
  setUsername,
  directChats,
  setDirectChats,
  friendInfo,
  setFriendInfo,
  inDirect,
}) {
  // Create a ref for Popup
  const popupRef = useRef(null);
  // Function to handle "View Profile" click
  const onViewProfileClick = () => {
    turn_on_user_profile(); // Call your function
    if (popupRef.current) {
      popupRef.current.close(); // Close the popup using the ref
    }
  };

  // Grab user data for avatar
  var storedData = sessionStorage.getItem("userData");
  // Parse the JSON string to convert it back to an object
  var userAvatar = JSON.parse(storedData);

  // Inside the Navbar component
  const [addClassModalOpen, setAddClassModalOpen] = useState(false);

  // Function to handle opening the modal for adding a class
  const openAddClassModal = () => {
    setAddClassModalOpen(true);
  };

  // Function to handle closing the modal for adding a class
  const closeAddClassModal = () => {
    setAddClassModalOpen(false);
  };

  /*
  // Function to get base64 encoded avatar for user
  const getAvatarForUser = (userID) => {
    // Find user in the avatar state by userID
    const userAvatar = avatarData.find((user) => user.userID === userID);
    // If user found in avatar state, return the avatar base64 string
    return userAvatar
      ? `data:image/png;base64,${userAvatar.avatar}`
      : avatarPic;
  };
  */

  const center_offset = {
    left: window.innerWidth / 2,
    top: window.innerHeight / 2,
  };

  const [userProfileIsOn, setUserProfileIsOn] = useState(false);
  const [listOfFriends, setListOfFriends] = useState([]);
  const [userData, setUserData] = useState([]);
  const testClosureString = "This originates from Navbar.jsx";
  const formData = useRef(null);

  // Destroy sessionID, clear sessionStorage and return to login page
  const logout = async (e) => {
    // e.preventDefault();
    try {
      await axios.post(`${import.meta.env.VITE_ENDPOINT}/logout`); // Destroy session ID
      // Grab username from session storage (seemed to solve problem with not displaying in private mode)
      const storedData = JSON.parse(sessionStorage.getItem("userData")); // Grab object
      const username = storedData.username; // Grab data from object
      //remove user from active users list
      socket.emit("logout", username);
      // Clear session storage
      sessionStorage.clear();
      // Clear local storage
      localStorage.clear();
      window.location.href = "/login-page"; // Navigate to login page
    } catch (error) {
      console.error("Error during logout", error);
    }
  };

  // User update page nav
  const userUpdate = async (e) => {
    e.preventDefault();
    try {
      window.location.href = "/user-update";
    } catch (error) {
      console.error("Error during logout", error);
    }
  };

  // Fetch and set username
  const fetchUsername = async () => {
    try {
      const storedData = JSON.parse(sessionStorage.getItem("userData"));
      const username = storedData.username;

      console.log(`Username: ${username}`);

      // If empty username, set username "Anonymous"
      if (username === "") {
        setUsername("Anonymous");
      } else {
        // Store username
        setUsername(username);
      }
    } catch (error) {
      // console.log("Error fetching user info:", error);
    }
  };

  const fetchUserInfo = async () => {
    console.log("Initiating user info...");
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_ENDPOINT}/user-info`
      );

      // if empty username, set username "Anonymous"
      // console.log("userdata:", response.data);
      setUserData(response.data);
      console.log("User data for fetch info is: " + JSON.stringify(userData));
    } catch (error) {
      console.log("Error fetching user info:", error);
    }
  };

  // Fetch and set classes
  const fetchClasses = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_ENDPOINT}/classes`
      );
      // Assuming the response.data contains the array of class data
      const formattedData = response.data.classData.map((item) => ({
        className: item.className,
        classID: item.classID,
        ownerID: item.ownerID,
      }));
      setClasses(formattedData);
      // Set deafult room
      if (formattedData.length > 0) {
        // Get message data for default room
        let classID = "";
        // let classID = room.ID;
        console.log("room id:", room.ID);
        console.log("default id:", formattedData[0].classID);
        if (room.ID) {
          classID = room.ID;
        } else {
          classID = formattedData[0].classID;
        }
        const response = await axios.post(
          `${import.meta.env.VITE_ENDPOINT}/messages`,
          {
            classID: classID,
          }
        );
        const messageData = response.data.userData.map((item) => ({
          // Grab message data
          username: item.username,
          text: item.message,
          gif: item.gif,
          timestamp: item.timestamp,
          userID: item.userID,
          // profilePic: item.avatar,
          classID: classID,
        }));

        setChats(messageData);
        let defaultRoom = "";
        if (room.Name) {
          defaultRoom = room.Name;
        } else {
          defaultRoom = formattedData[0].className;
        }
        console.log(
          "🚀 ~ fetchClasses ~ formattedData[0].className:",
          formattedData[0].className
        );
        //set current room info
        // setRoom({ Name: defaultRoom, ID: classID });
        setRoom({ Name: defaultRoom, ID: classID });
        socket.emit("join_room", defaultRoom);
        console.log("Deafult room: ", defaultRoom);
        console.log("Default classID: ", formattedData[0].classID);
      } else {
        console.log("No classes available");
      }
    } catch (error) {
      // console.log("Error fetching class info:", error);
    }
  };

  async function get_default_dm_room() {
    try {
      let formattedListOfFriends = [];
      const list = await axios.post(
        `${import.meta.env.VITE_ENDPOINT}/grab-friends`
      );
      // console.log("Navbar: the dm list is: " + JSON.stringify(list));
      if (list && list.length !== 0) {
        formattedListOfFriends = list.data.friends.map((item) => ({
          username: item.username,
          avatar: item.avatar,
          userID: item.userID,
        }));
        setListOfFriends(formattedListOfFriends);
      } else console.log("Nothing in direct messages!!!!!");

      if (formattedListOfFriends.length !== 0) {
        const firstFriendID = formattedListOfFriends[0].userID;
        console.log("the firstFriendID is " + JSON.stringify(firstFriendID));
        setFriendInfo(firstFriendID);
        //console.log("session Storage is " + sessionStorage.getItem("friendID"));
        const theResponse = await axios.post(
          `${import.meta.env.VITE_ENDPOINT}/match-dm-ids`,
          {
            friendID: firstFriendID,
          }
        );

        console.log("Return to old " + JSON.stringify(theResponse));

        const dmessageID = theResponse.data.dmID;
        console.log("Navbar: the dmID is " + JSON.stringify(dmessageID));

        const response = await axios.post(
          `${import.meta.env.VITE_ENDPOINT}/direct_messages`,
          {
            dmID: dmessageID,
          }
        );

        const directMessageData = response.data.userData.map((item) => ({
          username: item.username,
          timestamp: item.timestamp,
          message: item.messages,
          profilePic: item.avatar,
        }));
        setDirectChats(directMessageData);
        const defaultDMRoom = dmessageID;

        setRoom(defaultDMRoom);
        sessionStorage.setItem("dmIDRoom", JSON.stringify(defaultDMRoom));
        console.log(
          "the set ID room is: " + sessionStorage.getItem("dmIDRoom")
        );
        socket.emit("join_room", defaultDMRoom);
      } else {
        console.log("User has no friends");
        setDirectChats([]);
      }
    } catch (error) {
      console.error("Error retrieving friend list: " + error);
    }
  }

  function turn_on_user_profile() {
    console.log("User profile was originally " + userProfileIsOn);
    console.log("You just pressed turn on user profile");
    // bool on the navbar's side is sent to the UserProfile component as a prop
    // will determine how the UserProfile behaves
    setUserProfileIsOn(true);
    console.log("User profile is now " + userProfileIsOn);
  }

  function turn_off_user_profile() {
    console.log(testClosureString);
    console.log("User profile was originally " + userProfileIsOn);
    console.log("You just exited the user profile");
    setUserProfileIsOn(false);
    console.log("User profile is now " + userProfileIsOn);
  }

  // When room is joined, send classID to retrieve messages for room
  // Store retrieved messages in 'chats'

  // Join a room
  const joinRoom = async (classData) => {
    if (classData !== null) {
      // Get message data for room
      const classID = classData.classID;
      const response = await axios.post(
        `${import.meta.env.VITE_ENDPOINT}/messages`,
        {
          classID: classID,
        }
      );
      const messageData = response.data.userData.map((item) => ({
        // Grab message data
        username: item.username,
        text: item.message,
        gif: item.gif,
        timestamp: item.timestamp,
        classID: classID,
        userID: item.userID,
        // profilePic: item.avatar,
      }));
      const room = classData.className;
      console.log("🚀 ~ joinRoom ~ room:", classData.className);

      setRoom({ Name: room, ID: classID }); //set current room info
      console.log("class: ", room);
      console.log("ClassID: ", classID);
      // socket.emit("login", username, userAvatar, room);
      if (chats) {
        // only join room if in chatroom
        socket.emit("join_room", room);
        // Clear chat
        setChats([]);
        setChats(messageData);
      }
    }
  };

  // useEffect to save changes to session storage
  useEffect(() => {
    sessionStorage.setItem("room", JSON.stringify(room));
  }, [room]);

  useEffect(() => {
    fetchUserInfo();
    fetchUsername();
    fetchClasses();
   
  }, []);

  return (
    <nav>
      {/*console.log("User data is: " + JSON.stringify(userData))*/}
      <div className="the-nav">
        <img className="scrib-emblem" src={logo} alt="Scribble-emblem" />
        <div className="class-buttons">
          {/* Added function to display class name of tab clicked */}
          {/* If classes is null, and chats DNE, then do not display tabs */}
          <ul className="nav-items my-auto">
            {classes && chats && classes.length > 0 && (
              <>
                {!inDirect &&
                  classes.map((classInSchool, index) => (
                    <li onClick={() => joinRoom(classInSchool)} key={index}>
                      <Link className="the-link">
                        <label
                          style={{ cursor: "pointer", userSelect: "none" }}
                        >
                          {classInSchool.className}
                        </label>
                      </Link>
                    </li>
                  ))}
                {/* Add a tab for "Add Class" */}
                {/* <li>
                <label className="add-class-button" style={{ cursor: "pointer", userSelect: "none" }}>
                  <h5>+</h5>
                </label>
              </li> */}
                {/* End of "Add Class" tab */}
              </>
            )}
            {!inDirect ? (
              <li onClick={() => get_default_dm_room()}>
                <Link className="the-link" to="/direct-messages">
                  <label style={{ cursor: "pointer" }}>Direct Messages</label>
                </Link>
              </li>
            ) : (
              <li>
                <Link className="the-link" to="/chatroom">
                  <label style={{ cursor: "pointer" }}>Chatroom</label>
                </Link>
              </li>
            )}
          </ul>
        </div>
        {/*console.log("user data again is " + JSON.stringify(userData))*/}
        <Popup
          ref={popupRef} // assign ref to popup
          className="signout-button-popup"
          trigger={
            <button className="profile-button my-auto">
              <img src={userData.length !== 0 && userData[0].avatar ? `data:image/png;base64,${userData[0].avatar}` : avatarPic} className="the-avatar-pic-link" alt="user-avatar-picture"/>
            </button>
          }
          position="bottom right"
        >
          <div className="whats-inside-the-popup" style={{ padding: "5px" }}>
            <h4>Hi, {username}!</h4>
            <div className="dropdown-container">
              <button
                type="button"
                className="view-profile-button"
                onClick={() => {
                  // Open modal for profile
                  turn_on_user_profile();
                  // Close popup on click
                  popupRef.current.close();
                }}
              >
                View Profile
              </button>
              {/* Add a class from available classes */}
              {/* Open modal for adding a class */}
              {/* <button
                  type="button"
                  className="view-profile-button"
                  onClick={openAddClassModal}
                >
                  Add Class
                </button> */}
              {/* End of "Add Class" button */}
              {/* <button
                type="button"
                className="view-profile-button"
                onClick={() => {
                  // Open modal for profile
                  turn_on_user_profile();
                  // Close popup on click
                  popupRef.current.close();
                }}
              >
                Add Class
              </button> */}
              <Link className="the-sign-out-link" to="/">
                <button
                  type="button"
                  className="sign-out-button"
                  onClick={logout}
                >
                  Sign Out
                </button>
              </Link>
            </div>
          </div>
        </Popup>
        <UserProfile
          userData={userData}
          isActive={userProfileIsOn}
          callback={turn_off_user_profile}
        />

        {/* <Link to="#" > */}
        {/* <button className="sign-out-button my-auto"
            onClick={logout}
              style={{
                border: "1px solid gray",
                boxShadow: "2px 2px 4px rgba(0, 0, 0, 0.2)",
                outline: "none",
              }}>Sign Out</button> */}
        {/* </Link> */}

        {/* Get username from backend session and display
          <button className="sign-out-button my-auto"
              style={{
                right: "220px",
                borderRadius: "5%",
                backgroundColor: 'gray',
                color: "black",
                border: "1px solid black",
                boxShadow: "2px 2px 4px rgba(0, 0, 0, 0.2)",
                outline: "none",
                cursor: "initial",// removes cursor change when hovering
              }}>Hello, {username}</button>

          {/* Add a black border around button */}
        {/* <button className='sign-out-button my-auto'
          onClick={userUpdate} 
          style={{
            right: "125px",
            backgroundColor: "orange",
            border: "1px solid gray",
            boxShadow: "2px 2px 4px rgba(0, 0, 0, 0.2)",
            outline: "none",
          }}>☰</button> */}
      </div>
    </nav>
  );
}

export default Navbar;
