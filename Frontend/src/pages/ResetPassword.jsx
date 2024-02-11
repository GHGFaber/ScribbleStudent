import { Link } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function ResetPassword() {

    const navigate = useNavigate();
    const formData = useRef(null);
    
    const resetPassword = async () => {
        try {
          // Get the updated user input from the form
          const name = formData.current.elements.name.value;
          const username = formData.current.elements.username.value;
          const email = formData.current.elements.email.value;
    
          // Send a POST request to update the user profile
          await axios.post("http://localhost:3000/reset-password", {
            name,
            username,
            email
          });
    
          // Display success message
          alert("Profile Updated!");
    
          // Clear form data after successful input
          formData.current.reset();
        } catch (error) {
          // Display alert with error message
          alert("Failed to update profile. Please try again later.");
          console.error("Error updating user profile:", error);
        }
      };

  return (
    <>
      <div className="main-login">
        <div className="center-2 login-panel">
          <div className="spacer-0"></div>
          <h3 id="welcome-create-text">Reset Password</h3>
          <div className="spacer-0"></div>
          
          <form id="create-form" ref={formData} method="POST">
            {/* Old Password */}
            <p id="uname-create-text">Old Password</p>
            <input
              type="password"
              className="cr-in"
              id="old_password"
              name="old_password"
              />

            <div className="spacer-0"></div>
            {/* New Password */}
            <p id="ps-create-text">New Password</p>
            <input
              type="password"
              className="cr-in"
              id="new_pass1"
              name="new_pass1"
              />

            <div className="spacer-0"></div>
              {/* Confirm */}
            <p id="ps-create-text">Confirm New Password</p>
            <input 
              type="password" 
              className="cr-in" 
              id="new_pass2" 
              name="new_pass2" 
            />

            {/* <div className="spacer-0"></div>
            <p id="ps-confirm-text">Confirm Password</p>
            <input type="password" className="cr-in" id="ps-confirm-input" /> */}
          </form>


          <div className="spacer-0"></div>

            <button id="create-account-button" onClick={resetPassword}>
              Reset
            </button>

          <div className="spacer-0"></div>
          <pre>
          <Link to="/user-update">Back</Link>        <Link to="/chatroom">Home</Link>
          </pre>
          <div className="spacer-0"></div>
        </div>
      </div>
    </>
  );
}

export default ResetPassword;
