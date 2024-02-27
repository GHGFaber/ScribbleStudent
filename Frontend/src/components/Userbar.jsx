import { useEffect, useState } from "react";

import socket from '../components/Socket.jsx';

// //++++++++++++++++++++++++++++++++++
// import io from "socket.io-client";
// const socket = io.connect("http://localhost:3000", {
//   reconnection: false
// }); //connect to socket.io server
// //++++++++++++++++++++++++++++++++++


// function Userbar({ activeUsers, inactiveUsers }) {
  //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
function Userbar({ inactiveUsers }) {
  
  // Grab username from session storage (seemed to solve problem with not displaying in private mode)
  const storedData = JSON.parse(sessionStorage.getItem('userData')); // Grab object
  const username = storedData.username; // Grab data from object
  
  
  // //store active users
  // function userActive(username) {
    //   const user = {
      //     username: username
      //   };
      //   setActiveUsers((prevActiveUsers) => [...prevActiveUsers, user]); //update activeUsers
      // }
      
      
  //active users state
  // const [activeUsers, setActiveUsers] = useState([]);
  // Load active users from local storage on component mount
  const [activeUsers, setActiveUsers] = useState(() => {
    const savedUsers = localStorage.getItem('activeUsers');
    return savedUsers ? JSON.parse(savedUsers) : [];
  });
  
  useEffect(() => {
    
    //receive updated list of active users
    socket.on('activeUsers', (users) => {
      setActiveUsers(users);
      // Save active users to local storage
      localStorage.setItem('activeUsers', JSON.stringify(users));
      //alert("activeUsers socket"); //testing
    });
    
    // Clean up the socket listener
    return () => {
      socket.off("notified_users");
    };
    
  }, [socket])
  //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  
  return (
      <>
        <div className="the-user-column">
          <ul className="active-users">
            <h5>Online - {activeUsers.length}</h5>
            {activeUsers.map((aUser, index) => (
              <li key={index}>{aUser.username}</li>
            ))}
          </ul>
          <ul className="inactive-users">
            <h5>Offline - {inactiveUsers.length}</h5>
            {inactiveUsers.map((iUser, index) => (
              <li key={index}>{iUser.username}</li>
            ))}
          </ul>
        </div>
      </>
    );
  }
  
  export default Userbar;
  