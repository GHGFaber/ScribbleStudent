import logo from "../react_images/scrib_emblem.png";
import Popup from "reactjs-popup";
import { Link } from "react-router-dom";
import axios from "axios";
import "reactjs-popup/dist/index.css";
import UserProfile from "./UserProfile";
import { useEffect, useState, useRef } from "react";
import socket from "../components/Socket.jsx";
import { connect } from "socket.io-client";

// Maintains current user sessionID
// Need to use 'withCredentials: true' so cookies are
// sent with request so session cookie is present
// else backend creates new session for every request.
axios.defaults.withCredentials = true;

function Navbar({
  chats,
  setChats,
  classes,
  setClasses,
  username,
  setUsername,
}) {
  const [room, setRoom] = useState(null);
  const center_offset = {
    left: window.innerWidth / 2,
    top: window.innerHeight / 2,
  };

  const [userProfileIsOn, setUserProfileIsOn] = useState(false);
  const [userData, setUserData] = useState([]);
  const testClosureString = "This originates from Navbar.jsx";
  const formData = useRef(null);

  // Destroy sessionID, clear sessionStorage and return to login page
  const logout = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://64.23.164.87/api/logout"); // Destroy session ID
      // Grab username from session storage (seemed to solve problem with not displaying in private mode)
      const storedData = JSON.parse(sessionStorage.getItem("userData")); // Grab object
      const username = storedData.username; // Grab data from object
      //remove user from active users list
      socket.emit("logout", username);
      // Clear session storage
      //sessionStorage.clear();
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
    try {
      const response = await axios.get("http://64.23.164.87/api/user-info");

      // if empty username, set username "Anonymous"
      console.log(response.data);
      setUserData(response.data);
    } catch (error) {
      console.log("Error fetching user info:", error);
    }
  };

  // Fetch and set classes
  const fetchClasses = async () => {
    try {
      const response = await axios.get("http://64.23.164.87/api/classes");
      // Assuming the response.data contains the array of class data
      const formattedData = response.data.classData.map((item) => ({
        classInSchoolName: item.className,
        classID: item.classID,
      }));
      setClasses(formattedData);
      // Set deafult room
      if (formattedData.length > 0) {
        // Get message data for default room
        const classID = formattedData[0].classID;
        const response = await axios.post("http://64.23.164.87/api/messages", {
          classID: classID,
        });
        const messageData = response.data.userData.map((item) => ({
          // Grab message data
          username: item.username,
          text: item.message,
          timestamp: item.timestamp,
          classID: classID,
        }));

        console.log(
          "fetchClasses: message data avatar is " + messageData.profilePic
        );
        setChats(messageData);
        const defaultRoom = formattedData[0].classInSchoolName;
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
      const response = await axios.post("http://64.23.164.87/api/messages", {
        classID: classID,
      });
      const messageData = response.data.userData.map((item) => ({
        // Grab message data
        username: item.username,
        text: item.message,
        timestamp: item.timestamp,
        classID: classID,
        profilePic: item.avatar,
      }));
      const room = classData.classInSchoolName;
      console.log("class: ", room);
      console.log("ClassID: ", classID);
      //setRoom(room);
      socket.emit("join_room", room);
      // Clear chat
      setChats([]);
      setChats(messageData);
    }
  };

  useEffect(() => {
    fetchUserInfo();
    fetchUsername();
    fetchClasses();
  }, [socket]);

  /* JARL'S CODE FOR SETTING CURRENT CLASS */
  // sets a new class as the current class
  // const switch_class = async (classInSchool, className) => {
  //   // get that class whenever the tab is clicked
  //   const theClassID = classInSchool;
  //   console.log("navbar: class ID is " + theClassID);
  //   try {
  //     const response = await axios.post("http://localhost:3000/messages", {
  //       classID: theClassID,
  //     });
  //     const response2 = await axios.post("http://localhost:3000/classes", {
  //       className: className,
  //     });
  //     sessionStorage.setItem(
  //       "currentClassData",
  //       JSON.stringify(response.data.userData)
  //     );
  //     sessionStorage.setItem(
  //       "currentClass",
  //       JSON.stringify(response2.data.classData)
  //     );
  //     console.log(
  //       "navbar: the current class from the response is " +
  //         JSON.stringify(response2.data.classData)
  //     );
  //     console.log(
  //       "navbar: the current class in session is " +
  //         sessionStorage.getItem("currentClass")
  //     );
  //     handleClassChange();
  //   } catch {
  //     console.log("there has been an error sending the message.");
  //   }
  // };

  return (
    <nav>
      <div className="the-nav">
        <img className="scrib-emblem" src={logo} alt="Scribble-emblem" />
        <div className="class-buttons">
          {/* Added function to display class name of tab clicked */}
          {/* If classes is null, then do not display tabs */}
          {classes && classes.length > 0 && (
            <ul className="nav-items my-auto">
              {classes.map((classInSchool, index) => (
                <li onClick={() => joinRoom(classInSchool)} key={index}>
                  <label style={{ cursor: "pointer" }}>
                    {classInSchool.classInSchoolName}
                  </label>
                </li>
              ))}
            </ul>
          )}
        </div>

        <Popup
          className="signout-button-popup"
          trigger={
            <button className="profile-button my-auto">{username}</button>
          }
          position="bottom right"
        >
          <div className="whats-inside-the-popup">
            <h4>Hi, {username}!</h4>
            <div className="dropdown-container">
              <button
                type="button"
                className="view-profile-button"
                onClick={() => turn_on_user_profile()}
              >
                View Profile
              </button>
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
