import { useEffect, useState } from "react";
import socket from '../components/Socket.jsx';
import avatarPic from "../images/default_pic.png";
import axios from "axios";

// renders the bar to the right of the screen
// displays active and inactive users
function DMUserbar({ activeUsers, setActiveUsers, inactiveUsers, setInactiveUsers, friendInfo, setFriendInfo,
                     profileInfo, setProfileInfo}) {

  let userData = "";
  const [profileInfo1, setProfileInfo1] = useState([]);
  let theFriendInfo = "";
  const [doTheyHaveFriends, setDoTheyHaveFriends] = useState(true);
  // Grab username object from session storage
  const storedData = JSON.parse(sessionStorage.getItem('userData'));
      
  useEffect(() => {
    console.log("This had been modified: friendInfo");
    fetch_the_friend_info();
  }, [friendInfo])

  useEffect(() => {
    console.log("profileInfo:" + JSON.stringify(profileInfo1));
  }, [profileInfo1])

  async function fetch_the_friend_info() {
   console.log("fetch_the_friend_info() has commenced.");
   const friendID = friendInfo;
   console.log("In DM Userbar!!! friend ID is " + friendID);
   const response = await axios.post("http://localhost:3000/get-friend-info", 
   {
      friendID: friendID
   });

   if (response.length === 0) {
    console.log("DMUserbar: There is no response");
    setDoTheyHaveFriends(false);
    return;
   }

   console.log("response for DMuserbar is... " + JSON.stringify(response.data[0]));

   const formattedInfo = response.data.map((item) => ({
    username: item.username,
    email: item.email,
    avatar: item.avatar,
    classes: item.classes
   }))
   console.log("formatted friend info is: " + JSON.stringify(formattedInfo));
   //setProfileInfo(formattedInfo);
   theFriendInfo = formattedInfo[0];
   setProfileInfo1(formattedInfo[0]);
   console.log("DMUserbar: Profile info is: " + JSON.stringify(theFriendInfo));
   console.log("DMUserbar: Usestate is: " + JSON.stringify(profileInfo1));
  }

  function showProfileInfo() {
    console.log("displaying the friend info...");
    return (
      <>
        <img className="profile-info-avatar"
             src={profileInfo1.avatar && profileInfo1.avatar != "" ? `data:image/png;base64,${profileInfo1.avatar.toString()}` : avatarPic}
             alt="friend-avatar"
        />
        <h5>{profileInfo1.username}</h5>
        <h5>{profileInfo1.email}</h5>
        <h5>Mutual Classes</h5>
        {profileInfo1.classes != "" && (
            <ul>
            {profileInfo1.classes.map((classInSchool, index) => (
                <li key={index}>
                <label>{classInSchool}</label>
                </li>
            ))}
            </ul>
        )}
      </>
    )
  }

  return (
    <div>
      {console.log("Info is " + JSON.stringify(profileInfo1))}
      {profileInfo1 ? () => showProfileInfo() : ""}
    </div>
  );
}
export default DMUserbar;
  
