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
  const test = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get("http://localhost:3000/user-info");
      const { username, email, password, user_id, userType, name } 
          = response.data[0];
      console.log(`username: ${username} \nuserid: ${user_id}`);
    } catch (error) {
      console.error("Error during fetch", error);
      //   let errorMSG = document.getElementsByClassName("err-msg-2");
    }
  }
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

  

  const [name, setName] = useState(null);
  const [userType, setUserType] = useState(null);
  const [email, setUserEmail] = useState(null);
  const [username, setUsername] = useState(null);
  useEffect(() => {
      const fetchUserInfo = async () => {
        try {
          const response = await axios.get("http://localhost:3000/user-info");

          const { username, email, password, user_id, userType, name } 
          = response.data[0];
          console.log("Data: ", response.data[0]);

          console.log(`
            Username: ${username}
            email: ${email}
            password: ${password}
            userid: ${user_id}
          `);
          
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

      fetchUserInfo();
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
          <Link to="#" >
            <button className="sign-out-button my-auto"
            onClick={logout}
              style={{
                border: "1px solid gray",
                boxShadow: "2px 2px 4px rgba(0, 0, 0, 0.2)",
                outline: "none",
              }}>Sign Out</button>
          </Link>

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
          onClick={test} 
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

