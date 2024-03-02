import logo from '../react_images/scrib_emblem.png';
import { Link } from "react-router-dom";
import axios from "axios";
import { useEffect, useState, useRef } from "react";
import socket from '../components/Socket.jsx';

// Maintains current user sessionID
// Need to use 'withCredentials: true' so cookies are 
// sent with request so session cookie is present
// else backend creates new session for every request.
axios.defaults.withCredentials = true


function Navbar({ classes }) {

  const formData = useRef(null);
  const [username, setUsername] = useState(null);
  const [room, setRoom] = useState(null);

  // Destroy sessionID, clear sessionStorage and return to login page
  const logout = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3000/logout");// Destroy session ID
      // Grab username from session storage (seemed to solve problem with not displaying in private mode)
      const storedData = JSON.parse(sessionStorage.getItem('userData')); // Grab object
      const username = storedData.username; // Grab data from object
      //remove user from active users list
      socket.emit('logout', username);
      // Clear session storage
      //sessionStorage.clear();
      window.location.href = "/login-page"; // Navigate to login page
      } catch (error) {
        console.error("Error during logout", error);
      }
  }
  
  // User update page nav
  const userUpdate = async (e) => {
    e.preventDefault();
    try {
      window.location.href = "/user-update";
    } catch (error) {
      console.error("Error during logout", error);
    }
  }

  
  // Fetch and set username
  const fetchUsername = async() => {
    try {
      const storedData = JSON.parse(sessionStorage.getItem('userData'));
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
      console.log("Error fetching user info:", error);
    }
  };

  // Display 1st class tab name
  // Will be used to set the default room for user
  const defaultTab = () => {
    // If there is a default class then set to room
    const defaultClass = document.querySelector(".nav-items li:first-child");
    if (defaultClass.textContent !== null) {
      const room = defaultClass.textContent;
      //setRoom(defaultClass.textContent);
      console.log("1st class: ", room);
      socket.emit("join_room", room);
    }
    console.log("Deafult Room: ", defaultClass.textContent);
  };

  // *** Not joining the new room ***
  // Join a room
  const joinRoom = (className) => {
    if (className !== null) {
      const room = className;
      console.log("class: ", room);
      //setRoom(room);
      socket.emit("join_room", room);
    }
  };

  useEffect(() => {    

    fetchUsername();
    defaultTab();

  }, []);

  return (
      <nav style={{ height: "100px" }}>
        <div className="the-nav">
          <img className="scrib-emblem" src={logo} alt="Scribble-emblem"/>
          <div className="class-buttons" 
          style={{ 
            position: "absolute",
            marginTop: "35px",
            marginLeft: "10%",
            }}>
          {/* Added function to display class name of tab clicked */}
            <ul className="nav-items my-auto">
              {
                classes.map((classInSchool, index) => (
                  <li onClick={() => joinRoom(classInSchool.classInSchoolName)} key={index}>
                    <label style={{ cursor: "pointer" }}>{classInSchool.classInSchoolName}</label>
                  </li>
                ))
              }
            </ul>            
          </div>
 
          {/* <Link to="#" > */}
            <button className="sign-out-button my-auto"
            onClick={logout}
              style={{
                border: "1px solid gray",
                boxShadow: "2px 2px 4px rgba(0, 0, 0, 0.2)",
                outline: "none",
              }}>Sign Out</button>
          {/* </Link> */}

          {/* Get username from backend session and display */}
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
          <button className='sign-out-button my-auto'
          onClick={userUpdate} 
          style={{
            right: "125px",
            backgroundColor: "orange",
            border: "1px solid gray",
            boxShadow: "2px 2px 4px rgba(0, 0, 0, 0.2)",
            outline: "none",
          }}>☰</button>

        </div>
      </nav>
  );
}

export default Navbar;

