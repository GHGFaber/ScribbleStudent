import { useEffect, useState } from "react";

import socket from '../components/Socket.jsx';

function Userbar() {
  
  // Grab username object from session storage
  const storedData = JSON.parse(sessionStorage.getItem('userData'));
      
      
  // Load active users from session storage on component mount
  const [activeUsers, setActiveUsers] = useState(() => {
    const savedUsers = sessionStorage.getItem('activeUsers');
    return savedUsers ? JSON.parse(savedUsers) : [];
  });
  // Load inactive users session storage on component mount
  const [inactiveUsers, setInactiveUsers] = useState(() => {
    const savedUsers = sessionStorage.getItem('inactiveUsers');
    return savedUsers ? JSON.parse(savedUsers) : [];
  });
  
  useEffect(() => {
    socket.connect();
    // Send the username to socket.io ('username')
    socket.emit('login', storedData.username);
    
    // Receive updated list of active users
    socket.on('activeUsers', (users) => {
      setActiveUsers(users);
      // Save active and inactive users to session storage
      sessionStorage.setItem('activeUsers', JSON.stringify(users));
    });

    // Receive updated list of inactive users
    socket.on('inactiveUsers', (users) => {
      setInactiveUsers(users);
      // Save inactive users to session storage
      sessionStorage.setItem('inactiveUsers', JSON.stringify(users));
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
  