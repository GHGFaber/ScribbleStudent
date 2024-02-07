// import {Link} from "react-router-dom";
// function Sidebar() {
//     return (
//         <sidebar>
//             <div className="the-column">
//                 <ul className="sidebar-content">
//                     <li className="side-list">
//                         <Link className="the-link" to="/chatroom">
//                             <div className="side-selection">
//                                 <h5>Chatroom</h5>
//                             </div>
//                         </Link>
//                     </li>
//                     <li className="side-list">
//                         <Link className="the-link" to="/notebook">
//                             <div className="side-selection">
//                                 <h5>Notebook</h5>
//                             </div>
//                         </Link>
//                     </li>
//                 </ul>
//             </div>
//         </sidebar>
//     );
//   }

// export default Sidebar;

import { Link } from "react-router-dom";

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
                </ul>
            </div>
        </div>
    );
}

export default Sidebar;
