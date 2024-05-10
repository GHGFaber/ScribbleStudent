import { useEffect, useState } from "react";
import socket from "../components/Socket.jsx";
import avatarPic from "../images/default_pic.png";
import axios from "axios";

// renders the bar to the right of the screen
// displays active and inactive users
function DMUserbar({
  activeUsers,
  setActiveUsers,
  inactiveUsers,
  setInactiveUsers,
  friendInfo,
  setFriendInfo,
  profileInfo,
  setProfileInfo,
}) {
  let userData = "";
  let mutualClasses = [];
  const [profileInfo1, setProfileInfo1] = useState([]);
  const [theMutualClasses, setTheMutualClasses] = useState([]);

  let theFriendInfo = "";
  const [doTheyHaveFriends, setDoTheyHaveFriends] = useState(true);
  // Grab username object from session storage
  const storedData = JSON.parse(sessionStorage.getItem("userData"));

  useEffect(() => {
    fetch_the_friend_info();
    console.log("profile info is " + JSON.stringify(profileInfo1));
  }, [])

  useEffect(() => {
    console.log("This had been modified: friendInfo");
    fetch_the_friend_info();
  }, [friendInfo]);

  /*
  useEffect(() => {
    //console.log("profileInfo:" + JSON.stringify(profileInfo1));
  }, [profileInfo1])
*/
  async function fetch_the_friend_info() {
    console.log("fetch_the_friend_info() has commenced.");
    const friendID = friendInfo;
    console.log("In DM Userbar!!! friend ID is " + friendID);
    const response = await axios.post(
      `${import.meta.env.VITE_ENDPOINT}/get-friend-info`,
      {
        friendID: friendID,
      }
    );

    if (response.length === 0) {
      console.log("DMUserbar: There is no response");
      setDoTheyHaveFriends(false);
      return;
    }

    // console.log("response for DMuserbar is... " + JSON.stringify(response.data[0]));

    const formattedInfo = response.data.map((item) => ({
      username: item.username,
      email: item.email,
      avatar: item.avatar,
      classes: item.classes,
    }));
    // console.log("formatted friend info is: " + JSON.stringify(formattedInfo));
    //setProfileInfo(formattedInfo);
    theFriendInfo = formattedInfo[0];
    setProfileInfo1(formattedInfo[0]);

    console.log("friendId for mutual classes is: " + friendID);
    const response2 = await axios.post(`${import.meta.env.VITE_ENDPOINT}/get-mutual-classes`, {
      friendID: friendID
    });

    console.log("response2 is: " + JSON.stringify(Object.values(response2.data)));
    mutualClasses = response2.data;
    console.log(JSON.stringify(mutualClasses));
    setTheMutualClasses(mutualClasses);
    

    console.log(
      "Where have you gone, " + JSON.stringify(profileInfo1.classes) + "?"
    );
    //profileInfo1.classes.map((cls) => {console.log(cls)});
    //console.log("DMUserbar: Profile info is: " + JSON.stringify(theFriendInfo));
    //console.log("DMUserbar: Usestate is: " + JSON.stringify(profileInfo1));
  }

  function showProfileInfo() {
    console.log("displaying the friend info...");
    //console.log("Info is " + JSON.stringify(profileInfo1));
    return (
      <div className="the-dm-userbar">
        <img
          className="profile-info-avatar avatar-picture"
          src={
            profileInfo1.avatar && profileInfo1.avatar != ""
              ? `data:image/png;base64,${profileInfo1.avatar.toString()}`
              : avatarPic
          }
          alt="friend-avatar"
        />
        <br />
        <b>Username</b>
        <h5>{profileInfo1.username}</h5>
        <b>Email</b>
        <h5>{profileInfo1.email}</h5>
        <b>Mutual Classes</b>
        {console.log(mutualClasses)}
        {theMutualClasses ? (
          <ul>
            {theMutualClasses.map((classInSchool, index) => (
              <li key={index}>
                <label>{classInSchool.className}</label>
              </li>
            ))}
          </ul>
        ) : (
          ""
        )}
      </div>
    );
  }

  /*
  return (
    <div>
      {console.log("Info is: " + profileInfo1)};
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
    </div>
  );
  */

  return (
    <div>
      {console.log("Info is " + profileInfo1.username)}
      {profileInfo1 && profileInfo1.username != null ? showProfileInfo() : ''}
    </div>
  );
}
export default DMUserbar;
