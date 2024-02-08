import { Link } from "react-router-dom";
import axios from "axios";

function Sidebar() {
    return (
        <div>
            <div className="the-column">
                <ul className="sidebar-content">
                    <li className="side-list">
                        <Link className="the-link" to="/chatroom">
                            <div className="side-selection">
                                <h5>Chatroom</h5>
                            </div>
                        </Link>
                    </li>
                    <li className="side-list">
                        <Link className="the-link" to="/notebook">
                            <div className="side-selection">
                                <h5>Notebook</h5>
                            </div>
                        </Link>
                    </li>

                    {/* display logged in users' info in console */}
                    {/* <li className="side-list">
                        <Link className="the-link" onClick={handleUserInfoClick}>
                            <div className="side-selection">
                                <h5>User Info</h5>
                            </div>
                        </Link>
                    </li> */}

                </ul>
            </div>
        </div>
    );
}

export default Sidebar;
