import { useEffect, useState } from "react";
import socket from '../components/Socket.jsx';
import avatarPic from "../images/default_pic.png";

// renders the bar to the right of the screen
// displays active and inactive users
function Userbar({ activeUsers, setActiveUsers, inactiveUsers, setInactiveUsers }) {
  
  // Grab username object from session storage
  const storedData = JSON.parse(sessionStorage.getItem('userData'));
      
  useEffect(() => {
    socket.connect();
    // Send the username to socket.io ('username')
    socket.emit('login', storedData.username);
    
    // Receive updated list of active users
    socket.on('activeUsers', (users) => {
      setActiveUsers(users);
      // Save active and inactive users to session storage
      sessionStorage.setItem('activeUsers', JSON.stringify(users));
      //console.log("active users are: " + sessionStorage.getItem('activeUsers'));
   
      //const avatar = toString(JSON.parse(sessionStorage.getItem('activeUsers')).avatar);
      //console.log("active avatar is: " + avatar);
    });

    // Receive updated list of inactive users
    socket.on('inactiveUsers', (users) => {
      setInactiveUsers(users);
      // Save inactive users to session storage
      sessionStorage.setItem('inactiveUsers', JSON.stringify(users));
      //console.log("inactive users are: " + sessionStorage.getItem('inactiveUsers'));
      //console.log("inactive avatar is: " + JSON.stringify(JSON.parse(sessionStorage.getItem('inactiveUsers'))[13].avatar));
    });
    
    // Clean up the socket listener
    return () => {
      socket.off("activeUsers");
      socket.off("inactiveUsers");
    };
    
  }, [socket])

  return (
    <>
      <div className="the-user-column">
        <ul className="active-users">
          <h5>Online - {activeUsers.length}</h5>
          {activeUsers.map((aUser, index) => (
            <div className="the-user-container">
              <div className="the-user-avatar">
                <img className="avatar-picture" src={aUser.avatar && aUser.avatar != "" ? `data:image/png;base64,${aUser.avatar}` : avatarPic} alt="user-avatar-picture"/>
               </div>
              <li key={index}>{aUser.username}</li>
            </div>
          ))}
        </ul>
        <ul className="inactive-users">
          <h5>Offline - {inactiveUsers.length}</h5>
          {inactiveUsers.map((iUser, index) => (
            <div className='the-user-container'>
              <div className="the-user-avatar">
                <img className="avatar-picture" src={iUser.avatar && iUser.avatar != "" ? `data:image/png;base64,${iUser.avatar}` : avatarPic} alt="user-avatar-picture"/>
              </div>
              <li key={index}>{iUser.username}</li>
            </div>
          ))}
        </ul>
      </div>
    </>
  );
  }
  
  export default Userbar;
  
