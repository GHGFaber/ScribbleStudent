import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import socket from "../components/Socket.jsx";
import avatarPic from "../images/default_pic.png";
import AddFriend from "./AddFriend.jsx";
// DMSidebar.jsx
// Sidebar within Direct Message page containing add friend function
// and all user's friends
function DMSidebar({
  handleFriendChange,
  setChats,
  setRoom,
  directChats,
  setDirectChats,
  friendInfo,
  setFriendInfo,
  userData,
}) {
  
  const [listOfFriends, setListOfFriends] = useState([]);
  // Boolean that is used to toggle rendering of Add Friend component
  const [addFriendIsOn, setAddFriendIsOn] = useState(false);

  useEffect(() => {
    //setListOfFriends(sessionStorage.getItem("listOfFriends"));
    retrieve_friend_list();
  }, [socket]);

  function set_friend_chat() {
    handleFriendChange();
  }

  function turn_on_add_friend() {
    setAddFriendIsOn(true);
  }

  function turn_off_add_friend() {
    setAddFriendIsOn(false);
  }

  // join_dm_room()
  // Uses friend's ID to access the DM room's ID
  // Uses DM ID to load the messages associated with that DM ID
  async function join_dm_room(userData) {
    if (userData !== null) {
      // Get message data for room
      const friendID = userData;
      setFriendInfo(friendID);
      // matches DM ID with the provided friend ID
      const response1 = await axios.post(
        `${import.meta.env.VITE_ENDPOINT}/match-dm-ids`,
        {
          friendID: friendID,
        }
      );

      console.log("DMSidebar: the response is: " + JSON.stringify(response1));
      const theDM = response1.data.dmID;

      // loads direct messages between user and friend
      const response2 = await axios.post(
        `${import.meta.env.VITE_ENDPOINT}/direct_messages`,
        {
          dmID: theDM,
        }
      );

      if (response2) console.log("DMSidebar: Finished loading messages");

      const messageData = response2.data.userData.map((item) => ({
        // Grab message data
        username: item.username,
        message: item.messages,
        timestamp: item.timestamp,
        profilePic: item.avatar,
      }));
      const room = theDM;

      setRoom(room);
      sessionStorage.setItem("dmIDRoom", JSON.stringify(room));
      socket.emit("join_room", room);
      // Clear chat
      setDirectChats([]);
      setDirectChats(messageData);
    }
  }

  // grab all friends of user
  async function retrieve_friend_list() {
    try {
      console.log("retrieving friends...");
      const list = await axios.post(
        `${import.meta.env.VITE_ENDPOINT}/grab-friends`
      );
      const formattedListOfFriends = list.data.friends.map((item) => ({
        username: item.username,
        avatar: item.avatar,
        userID: item.userID,
      }));
      setListOfFriends(formattedListOfFriends);

      // set default friend (first one on the list)
      // match their ID with DM ID and load all messages
      // with them
      if (formattedListOfFriends.length > 0) {
        const firstFriendID = formattedListOfFriends[0].userID;
        setFriendInfo(firstFriendID);
        const theResponse = await axios.post(
          `${import.meta.env.VITE_ENDPOINT}/match-dm-ids`,
          {
            friendID: firstFriendID,
          }
        );
        console.log("res is: " + JSON.stringify(theResponse.data));
        const dmessageID = theResponse.data.dmID;

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
        socket.emit("join_room", defaultDMRoom);
      } else {
        console.log("User has no friends");
      }
    } catch (error) {
      console.error("Error retrieving friend list: " + error);
    }
  }

  return (
    <div>
      <div className="the-column">
        <ul className="sidebar-content">
          <li className="side-list">
            <div className="side-selection">
              <Link
                className="the-link"
                to="/direct-messages"
                state={{ data: "temp" }}
                onClick={() => turn_on_add_friend()}
              >
                <h5 className="the-link">Add a Friend...</h5>
              </Link>
            </div>
          </li>
          {listOfFriends.map((friend, index) => (
            <li className="side-list">
              <div className="side-selection">
                <Link
                  className="the-link"
                  to="/direct-messages"
                  state={{ data: "temp" }}
                  onClick={() => join_dm_room(friend.userID)}
                >
                  <div className="the-user-container">
                    <div className="the-user-avatar">
                      <img
                        className="avatar-picture"
                        src={
                          friend.avatar && friend.avatar != ""
                            ? `data:image/jpeg;base64,${friend.avatar}`
                            : avatarPic
                        }
                        alt="user-avatar-picture"
                      />
                    </div>
                    <li key={index} className="the-link">
                      <h5>{friend.username}</h5>
                    </li>
                  </div>
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <AddFriend
        userData={userData}
        isActive={addFriendIsOn}
        handleAddFriendActive={turn_off_add_friend}
      />
    </div>
  );
}

export default DMSidebar;
