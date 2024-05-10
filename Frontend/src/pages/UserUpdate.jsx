import { Link } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";

function UserUpdate() {
  const navigate = useNavigate();
  const formData = useRef(null);

  const [cropperState, setCropperState] = useState("none");
  const [name, setName] = useState(null);
  const [userType, setUserType] = useState(null);
  const [email, setUserEmail] = useState(null);
  const [username, setUsername] = useState(null);
  const [image, setImage] = useState();
  const [imgData, setImgData] = useState();
  const [cropped, setCropped] = useState(false);
  const [profileData, setProfileData] = useState();

  function emptyImg() {
    setCropped(false);
    setImgData(null);
    setImage(null);
  }

  const onChange = (e) => {
    let files;
    if (e.dataTransfer) {
      files = e.dataTransfer.files;
    } else if (e.target) {
      files = e.target.files;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result);
    };
    reader.readAsDataURL(files[0]);
  };

  // User update page nav
  const resetPassword = async (e) => {
    e.preventDefault();
    try {
      window.location.href = "/reset-password";
    } catch (error) {
      console.error("Error", error);
    }
  };

  const getCropData = (event) => {
    event.preventDefault();
    const cropper = formData.current.elements.cropper.cropper;
    setImgData(cropper.getCroppedCanvas().toDataURL("image/jpeg", 0.4));
    console.log(imgData);
    setCropped(true);
    setProfileData(imgData.split(",")[1]);
  };

  // Grabs the user info to display for user
  const userInfo = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_ENDPOINT}/user-info`
      );

      const { username, email, avatar, password, user_id, userType, name } =
        response.data[0];

      // Hold user info
      if (name === null) {
        setName("(Enter Name)");
      } else {
        setName(name);
      }
      if (email === "") {
        setUserEmail("Anonymous");
      } else {
        setUserEmail(email);
      }
      if (username === "") {
        setUsername("Anonymous");
      } else {
        setUsername(username);
      }
      setUserType(userType);

      // Display user info to console
      // to make sure info is correct
      // (PRESS UPDATE BUTTON TO TEST)
      console.log(`
        Name: ${name},
        Username: ${username},
        Email: ${email},
        Type: ${userType}
        `);
    } catch (error) {
      console.log("Error fetching user info:", error);
    }
  };

  // Update user profile from user profile page
  const updateUser = async () => {
    try {
      // Get the updated user input from the form
      const name = formData.current.elements.name.value;
      const username = formData.current.elements.username.value;
      const email = formData.current.elements.email.value;
      const croppedImg = formData.current.elements.croppedimg.value;

      console.log("updating user...");
      // Send a POST request to update the user information
      await axios.post(`${import.meta.env.VITE_ENDPOINT}/update-user-info`, {
        name,
        username,
        email,
        croppedImg
      });

      // Optionally, you can handle success or update UI accordingly
      console.log("User information updated successfully!");
      alert("Profile Updated!");
      // Clear form data after successful input
      userInfo();
    } catch (error) {
      // Display alert with error message
      console.error("Error updating user: " + error);
    }
    // Clear form data after submit
    formData.current.reset();
  };

  const extractBase = async (img) => {
    let data = img.split(",")[1];
    setProfileData(data);
  };

  useEffect(() => {
    userInfo();
  }, []);

  useEffect(() => {
    console.log(imgData);
    extractBase(imgData);
  }, [imgData]);

  return (
    <>
      <div className="main-login">
        <div className="center-2 login-panel">
          <div className="spacer-0"></div>
          <h3 id="welcome-create-text">User Profile</h3>
          <div className="spacer-0"></div>

          <form id="create-form" ref={formData} method="POST">
            
            {/* Update Avatar */}
            {!image && !imgData && (
              <label
                htmlFor="file"
                id="create-account-button"
                className="buttonPress"
              >
                {imgData ? "Change Profile Picture" : "Upload Profile Picture"}
              </label>
            )}
            {!image && !imgData && (
              <input
                id="file"
                onClick={emptyImg}
                onChange={onChange}
                type="file"
                className="cr-in"
              />
            )}

            {/* CHANGE PROFILE */}
            {imgData && (
              <label
                htmlFor="file"
                onClick={emptyImg}
                id="create-account-button"
                className="buttonPress"
              >
                {imgData ? "Change Profile Picture" : "Upload Profile Picture"}
              </label>
            )}
            {image && !imgData && (
              <button id="create-account-button" onClick={getCropData}>
                Crop
              </button>
            )}
            <br />
            <br />
            <div
              className="cropper"
              style={{ display: image ? "flex" : "none" }}
            >
              {" "}
              {!imgData && (
                <Cropper
                  key={image}
                  src={image}
                  style={{
                    height: 200,
                    width: "100%",
                    visibility: { cropperState },
                    justifySelf: "center",
                  }}
                  // Cropper.js options
                  aspectRatio={1}
                  guides={false}
                  background={false}
                  name="cropper"
                />
              )}
              {imgData && (
                <div style={{ width: "100%" }}>
                  <img
                    style={{
                      height: 200,
                      visibility: { cropperState },
                    }}
                    src={imgData}
                  />
                </div>
              )}
            </div>
            <input
              type="hidden"
              value={profileData}
              name="croppedimg"
            />
            <br />
            {/* Update Name */}
            <p id="uname-create-text">Name</p>
            <input
              type="text"
              className="cr-in"
              id="name"
              name="name"
              placeholder={name}
            />

            <div className="spacer-0"></div>
            {/* Update Username */}
            <p id="ps-create-text">Username</p>
            <input
              type="text"
              className="cr-in"
              id="username"
              name="username"
              placeholder={username}
            />

            <div className="spacer-0"></div>
            {/* Update Email */}
            <p id="ps-create-text">Email</p>
            <input
              type="text"
              className="cr-in"
              id="email"
              name="email"
              placeholder={email}
            />

            {/* <div className="spacer-0"></div>
            <p id="ps-confirm-text">Confirm Password</p>
            <input type="password" className="cr-in" id="ps-confirm-input" /> */}
          </form>
          <div className="spacer-0"></div>

          <button className="reset-password" onClick={resetPassword}>
            Reset Password
          </button>

          <div className="spacer-0"></div>

          <button id="create-account-button" onClick={updateUser}>
            Update Profile
          </button>

          <div className="spacer-0"></div>
          <Link to="/chatroom">Home</Link>
          <div className="spacer-0"></div>
        </div>
      </div>
    </>
  );
}

export default UserUpdate;
