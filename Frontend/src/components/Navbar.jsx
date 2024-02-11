import logo from '../react_images/scrib_emblem.png';
import { Link } from "react-router-dom";
import axios from "axios";
import { useEffect, useState, useRef } from "react";

// Maintains current user sessionID
// Need to use 'withCredentials: true' so cookies are 
// sent with request so session cookie is present
// else backend creates new session for every request.
axios.defaults.withCredentials = true

function Navbar({ classes }) {
//-----------------------------------------------

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
  
  // Strictly for grabbing the username
  const fetchUsername = async() => {
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

  const [username, setUsername] = useState(null);
  useEffect(() => {    

    fetchUsername();

  }, []);

//------------------------------------------------
  return (
      <nav>
        <div className="the-nav">
          <img className="scrib-emblem" src={logo} alt="Scribble-emblem"/>
          <ul className="nav-items my-auto">
            {
              classes.map((classInSchool, index) => (
                <li key={index}><label>{classInSchool.classInSchoolName}</label></li>
              ))
            }
          </ul>
          {/* <Link to="#" > */}
            <button className="sign-out-button my-auto"
            onClick={logout}
              style={{
                border: "1px solid gray",
                boxShadow: "2px 2px 4px rgba(0, 0, 0, 0.2)",
                outline: "none",
              }}>Sign Out</button>
          {/* </Link> */}

          {/* Get username from backend session and display (DONE)*/}
          {/* Hello, {username} */}
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

          {/* Add a black border around button (DONE)*/}
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

