import { useEffect } from "react";
import { useState } from "react";
import { Modal, Box } from "@mui/material";
import axios from "axios";
import avatarPic from "../images/default_pic.png";

// allows the user to view their information in a popup
function UserProfile({ userData, isActive, callback }) {
  const [profileInfo, setProfileInfo] = useState([]);
  let trueFlag = isActive;
  // console.log("YAH BIG INFO HERE", userData[0]);

  // retrieve the data from local storage
  // will determine whether or not to display the popup
  const [displayProfile, setDisplayProfile] = useState(trueFlag);

  const [friendCode, setFriendCode] = useState("");

  useEffect(() => {
    // console.log("This is the response to the button click");
    setDisplayProfile(trueFlag);
    open_user_profile();
    setProfileInfo(userData[0]);
  }, [isActive, profileInfo]);

  useEffect(() => {
    open_user_profile();
  }, [localStorage.getItem("profile")]);

  useEffect(() => {
    get_friend_code();
  }, []);

  // if the user opens the profile, the flag will be set to true
  // and the pop-up will appear
  function open_user_profile() {
    if (trueFlag) setDisplayProfile(true);
  }

  async function get_friend_code() {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_ENDPOINT}/retrieve-friend-code`,
        {
          dummy: "",
        }
      );

      if (response) {
        setFriendCode(response.data);
        console.log(
          "friend code has been retrieved: " + JSON.stringify(response.data)
        );
      } else {
        console.log("friend code has not been received");
      }
    } catch (error) {
      console.error("Error fetching friend code:", error);
    }
  }

  // if the user closes the profile, the flag will be set to false
  // and the pop-up will no longer be visible
  function close_user_profile() {
    console.log("user profile has been closed");
    trueFlag = false;
    setDisplayProfile(false);
    console.log("Initiating parent callback...");
    // will call the navbar's function that sets its flag to false
    callback();
  }

  // get the day the user joined
  function get_member_since(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleDateString("en-US");
  }

  // allows the user to update their user information
  const userUpdate = async (e) => {
    e.preventDefault();
    console.log("UserProfile: update button was pressed");
    try {
      window.location.href = "/user-update";
    } catch (error) {
      console.error("Error during logout", error);
    }
  };

  return (
    <>
      <div>
        {displayProfile && (
          <Modal
            id="the-user-profile"
            open={true}
            onClose={() => close_user_profile()}
          >
            <Box id="user-profile-box">
              <div className="user-profile-content">
                <img className="the-current-avatar" src={userData[0].avatar ? `data:image/png;base64,${userData[0].avatar}` : avatarPic} alt="user-avatar"/>
                {/* <h4>
                  {userData[0].firstName} {userData[0].lastName}
                </h4> */}
                <b>Username</b>
                <h5>{userData[0].username}</h5>
                <b>Email</b>
                <h5>{userData[0].email}</h5>
                <b>Friend Code</b>
                <h5>{friendCode}</h5>
                {/* <p>Member since {get_member_since(userData[0].memberSince)}</p>
                <p>
                  {userData[0].userType} at {userData[0].schoolName}
                </p> */}
                <b>My Classes</b>
                {userData[0].classes != "" && (
                  <ul>
                    {userData[0].classes.map((classInSchool, index) => (
                      <li key={index}>
                        <label>{classInSchool}</label>
                      </li>
                    ))}
                  </ul>
                )}
                {userData[0].classes == "" && <p>No classes in session!</p>}
                <br />
                <button
                  type="button"
                  className="edit-profile-button"
                  onClick={userUpdate}
                >
                  Edit Profile
                </button>
                <button
                  type="button"
                  onClick={() => close_user_profile()}
                  className="back-button"
                >
                  Back
                </button>
              </div>
            </Box>
          </Modal>
        )}
      </div>
    </>
  );
}

export default UserProfile;
