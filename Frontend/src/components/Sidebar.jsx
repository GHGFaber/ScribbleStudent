import {Link} from "react-router-dom";
function Sidebar() {
    return (
        <sidebar>
            <div className="the-column">
                <ul className="sidebar-content">
                    <li>
                        <Link to="/chatroom">Chatroom</Link>
                    </li>
                    <li>
                        <Link to="/notebook">Notebook</Link>
                    </li>
                </ul>
            </div>
        </sidebar>
    );
  }

export default Sidebar;