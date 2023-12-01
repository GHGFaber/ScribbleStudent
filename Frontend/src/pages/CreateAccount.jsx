import {Link} from "react-router-dom";
function CreateAccount() {
    return (
        <>
            <div className="main-login">
                <div className="center-2 login-panel">
                    <div className="spacer-0"></div>
                    <h3 id="welcome-create-text">Welcome to Scribble!</h3>
                    <div className="spacer-0"></div>
                    <form id="create-form">
                        <p id="uname-create-text">Create Username</p>
                        <input type="text" className="cr-in" id="uname-create-input"/>
                        <div className="spacer-0"></div>
                        <p id="ps-create-text">Create Password</p>
                        <input type="password" className="cr-in" id="ps-create-input"/>
                        <div className="spacer-0"></div>
                        <p id="ps-confirm-text">Confirm Password</p>
                        <input type="password" className="cr-in" id="ps-confirm-input"/>
                    </form>
                    <div className="spacer-0"></div>
                    <Link to="/chatroom">
                        <button id="create-account-button" onclick="sign_up()">Sign Up</button>
                    </Link>
                    <div className="spacer-0"></div>
                </div>
            </div>
        </>            
    );
  }

export default CreateAccount;