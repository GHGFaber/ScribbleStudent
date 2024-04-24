import { useEffect } from "react";
import { useState, useRef } from "react";
import { Modal, Box } from "@mui/material";
import axios from "axios";

// allows the user to view their information in a popup
function AddFriend({ userData, isActive, handleAddFriendActive }) {
  const [profileInfo, setProfileInfo] = useState([]);
  let trueFlag = isActive;
  console.log("YAH BIG INFO THERE", userData);

  const formData = {
    friendCode: useRef(null)
  }

  // retrieve the data from local storage
  // will determine whether or not to display the popup
  const [displayAddFriend, setDisplayAddFriend] = useState(trueFlag);
  const [friendCode, setFriendCode] = useState("");

  useEffect(() => {
    console.log("This is the response to the button click");
    setDisplayAddFriend(trueFlag);
    open_add_friend();
    setProfileInfo(userData);
  }, [isActive, profileInfo]);

  useEffect(() => {
    open_add_friend();
  }, [localStorage.getItem("profile")]);

  // if the user opens the profile, the flag will be set to true
  // and the pop-up will appear
  function open_add_friend() {
    if (trueFlag) setDisplayAddFriend(true);
  }

  async function validate_friend_code() {
    console.log("AddFriend: running function validate_friend_code()...");
    try {
      const response = await axios.post("http://localhost:3000/get-friend-id-from-code", {
        friendCode: formData.current.friendCode.value
      })

      let secondResponse = "";
      let thirdResponse = "";

      if (response) {
        const friendID = response.data.friendID[0];
        console.log("What is the friend ID????? It is " + JSON.stringify(friendID));
        secondResponse = await axios.post("http://localhost:3000/add-friend-dm", {
          friendID: friendID
        })
        if (secondResponse) {
          console.log("Friend successfully added");
          thirdResponse = await axios.post("http://localhost:3000/add-to-friend-list", {
            friendID: friendID
          })
          if (thirdResponse) console.log("Friend successfully appended to friend list");
        }
      }
    } catch (error) {
      console.error("Error retrieving friend through code: " + error);
    }
  }
  
  // if the user closes the profile, the flag will be set to false
  // and the pop-up will no longer be visible
  function close_add_friend() {
    console.log("add friend has been closed");
    trueFlag = false;
    setDisplayAddFriend(false);
    console.log("Initiating parent callback...");
    // will call the navbar's function that sets its flag to false
    handleAddFriendActive();
  }

  return (
    <>
      <div>
        {displayAddFriend && (
          <Modal
            id="the-add-friend"
            open={true}
            onClose={() => close_add_friend()}
          >
            <Box id="add-friend-box">
              <div className="add-friend-content">
                <form ref={formData}>
                    <h5>Friend Code</h5>
                    <input id="add-friend-code" 
                           type="text" 
                           name="friendCode"
                    />
                    <button id="add-friend-button"
                            type="button"
                            onClick={() => validate_friend_code()}>
                      Add Friend
                    </button>
                </form>
                <button
                  type="button"
                  onClick={() => close_add_friend()}
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

export default AddFriend;
