import {Link} from "react-router-dom";
function LoginPage() {
    return (
        <>
            <div className="main-login">
                <div className="center-2 login-panel">
                    <div className="spacer-0"></div>
                    <h3 id="welcome-text">Welcome back!</h3>
                    <div className="spacer-0"></div>
                    <form id="login-form">
                        <label id="uname-text">Username</label><br/>
                        <input name="username" type="text" id="uname-input"/>
                        <div className="spacer-0"></div>
                        <label id="ps-text">Password</label><br/>
                        <input name="password" type="password" id="ps-input"/>
                    </form>
                    <div className="spacer-0"></div>
                    <Link to="/chatroom">
                        <button id="log-page-button" onclick="sign_in()">Log In</button>
                    </Link>
                    <div className="spacer-0"></div>
                    <Link to="/create-account">No account? Create one!</Link>
                    <div className="spacer-0"></div>
                    <p className="err-msg-1">The account doesn't exist!</p>
                    <p className="err-msg-2">Incorrect password!</p>
                    <div className="spacer-0"></div>
                </div>
            </div>
        </>
    );
  }

export default LoginPage;