import { Link } from "react-router-dom";
import { useState, useRef } from "react";

import axios from "axios";
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const navigate = useNavigate();

  const formData = useRef(null);
  const handleLogin = async (event) => {
    event.preventDefault();
    console.log("hi");
    try {
      const response = await axios.post("http://localhost:3000/login", {
        username: formData.current[0].value,
        password: formData.current[1].value,
      });
      console.log(response.data);
      if (response.data.success) {
        // Redirect to the LoggedInComponent
        navigate("/chatroom");
      } else {
        alert("wrong user!");
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
          <h3 id="welcome-text">Welcome back!</h3>
          <div className="spacer-0"></div>
          <form id="login-form" ref={formData} method="POST">
            <label id="uname-text">Username</label>
            <br />
            <input name="username" type="text" id="name" />
            <div className="spacer-0"></div>
            <label id="ps-text">Password</label>
            <br />
            <input name="password" type="password" id="password" />
          </form>
          <div className="spacer-0"></div>
          <button id="log-page-button" onClick={handleLogin}>
            Log In
          </button>
          <div className="spacer-0"></div>
          <Link to="/create-account">No account? Create one!</Link>
          <div className="spacer-0"></div>
          <p className="err-msg-1">The account doesn't exist!</p>
          <p className="err-msg-2show">Incorrect password!</p>
          <div className="spacer-0"></div>
        </div>
      </div>
    </>
  );
}

export default LoginPage;