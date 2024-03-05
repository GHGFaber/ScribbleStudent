import logo from '../react_images/scrib_emblem.png';
import Popup from 'reactjs-popup';
import {Link} from 'react-router-dom';
import axios from "axios";
import 'reactjs-popup/dist/index.css';
import UserProfile from './UserProfile';
import { useEffect, useState, useRef } from 'react';

// Maintains current user sessionID
// Need to use 'withCredentials: true' so cookies are
// sent with request so session cookie is present
// else backend creates new session for every request.
axios.defaults.withCredentials = true;

// component that renders the top element on the screen
function Navbar({classes, userData, handleClassChange}) {

  const center_offset = {
    left: window.innerWidth / 2,
    top: window.innerHeight / 2
  };

  const [userProfileIsOn, setUserProfileIsOn] = useState(false);
  const [username, setUsername] = useState(null);
  const testClosureString = "This originates from Navbar.jsx";
  const formData = useRef(null);

  // Destroy sessionID and return to login page
  const logout = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3000/logout");
      window.location.href = "/login-page";
    } catch (error) {
      console.error("Error during logout", error);
    }
  };

  // Strictly for grabbing the username
  const fetchUsername = async () => {
    try {
      const response = await axios.get("http://localhost:3000/username");
      const username = response.data.username;

      console.log(`Username: ${username}`);

      // if empty username, set username "Anonymous"
      if (username === "") {
        setUsername("Anonymous");
      } else {
        setUsername(username); //stores username
      }
    } catch (error) {
      console.log("Error fetching user info:", error);
    }
  };

  useEffect(() => {
    fetchUsername();
  }, []);

  // toggles the user profile popup when the user clicks on the
  // button on the top-right of the screen
  function turn_on_user_profile() { 
    console.log("User profile was originally " + userProfileIsOn);
    console.log("You just pressed turn on user profile");
    // bool on the navbar's side is sent to the UserProfile component as a prop
    // will determine how the UserProfile behaves
    setUserProfileIsOn(true); 
    console.log("User profile is now " + userProfileIsOn);
  }

  // deactivates the user profile when the user exits the pop-up
  function turn_off_user_profile() { 
    console.log(testClosureString);
    console.log("User profile was originally " + userProfileIsOn);
    console.log("You just exited the user profile");
    setUserProfileIsOn(false); 
    console.log("User profile is now " + userProfileIsOn);
  }

  // sets a new class as the current class
  const switch_class = async (classInSchool, className) => {
    // get that class whenever the tab is clicked
    const theClassID = classInSchool;
    console.log("navbar: class ID is " + theClassID);
    try {
      const response = await axios.post("http://localhost:3000/messages", {
        classID: theClassID,
      } 
      );
      const response2 = await axios.post("http://localhost:3000/classes", {
        className: className,
      })
      sessionStorage.setItem("currentClassData", JSON.stringify(response.data.userData));
      sessionStorage.setItem("currentClass", JSON.stringify(response2.data.classData));
      console.log("navbar: the current class from the response is " + JSON.stringify(response2.data.classData));
      console.log("navbar: the current class in session is " + sessionStorage.getItem("currentClass"));
      handleClassChange();
    } catch {
        console.log("there has been an error sending the message.")
    };

      
  }

    return (
        <nav>
          <div className="the-nav">
            <img className="scrib-emblem" src={logo} alt="Scribble-emblem"/>
            <ul className="nav-items my-auto">
            {
              classes.map((classInSchool, index) => (
                <li key={index} 
                    onClick={() => switch_class(classInSchool.classID, classInSchool.className)}>
                      <label>
                        {/*
                        <button value={classInSchool.classID}>
                          {classInSchool.className}
                        </button>
                        */}  
                          {classInSchool.className}
                      </label>
                </li>
              ))
            }
            </ul>
            <Popup className="signout-button-popup" trigger={
              <button className="profile-button my-auto">Profile</button>}
              position="bottom right">
                <div className="whats-inside-the-popup">
                  <h4>Hi, {username}!</h4>
                  <div className="dropdown-container">
                    <button type="button" className="view-profile-button" onClick={() => turn_on_user_profile()}>View Profile</button>
                    <Link className="the-sign-out-link" to="/">
                      <button type="button" className="sign-out-button" onClick={logout()}>Sign Out</button>
                    </Link>
                  </div> 
                </div>
            </Popup>
            <UserProfile isActive={userProfileIsOn} callback={turn_off_user_profile}/>

          </div>
        </nav>
    );
  }
export default Navbar;