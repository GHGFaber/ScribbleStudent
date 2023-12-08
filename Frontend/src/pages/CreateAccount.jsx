import { Link } from "react-router-dom";

import { useState, useRef } from "react";

import axios from "axios";
import { useNavigate } from "react-router-dom";

function CreateAccount() {
  const navigate = useNavigate();

  const formData = useRef(null);
  const handleAccount = async (event) => {
    event.preventDefault();
    console.log("hi");
    try {
      const response = await axios.post(
        "http://localhost:3000/create-account",
        {
          username: formData.current[0].value,
          password: formData.current[1].value,
          email: formData.current[2].value,
        }
      );
      console.log(response.data);
      if (response.data.success) {
        // Redirect to the LoggedInComponent
        navigate("/login-page");
      } else {
        alert("error!");
      }
    } catch (error) {
      console.error("Error during login", error);
      //   let errorMSG = document.getElementsByClassName("err-msg-2");
    }
  };
  return (
    <>
      <div className="main-login">
        <div className="center-2 login-panel">
          <div className="spacer-0"></div>
          <h3 id="welcome-create-text">Welcome to Scribble!</h3>
          <div className="spacer-0"></div>
          <form id="create-form" ref={formData} method="POST">
            <p id="uname-create-text">Create Username</p>
            <input
              type="text"
              className="cr-in"
              id="username"
              name="username"
            />
            <div className="spacer-0"></div>
            <p id="ps-create-text">Create Password</p>
            <input
              type="password"
              className="cr-in"
              id="password"
              name="password"
            />
            <div className="spacer-0"></div>
            <p id="ps-create-text">Email</p>
            <input type="text" className="cr-in" id="email" name="email" />
            {/* <div className="spacer-0"></div>
            <p id="ps-confirm-text">Confirm Password</p>
            <input type="password" className="cr-in" id="ps-confirm-input" /> */}
          </form>
          <div className="spacer-0"></div>
          <Link to="/chatroom">
            <button id="create-account-button" onClick={handleAccount}>
              Sign Up
            </button>
          </Link>
          <div className="spacer-0"></div>
        </div>
      </div>
    </>
  );
}

export default CreateAccount;
