import {Link} from "react-router-dom";
import {initValueContext} from '../components/InitValue.jsx';
import {useContext} from "react";

function Sidebar({parentCallback, notePages}) {

    let targetFile = '';
    let temp = '';

    function get_that_file(setOfNotes, filename) { 
        return setOfNotes.find((page) => page.filename == filename); 
    }

    function get_that_file_wrapper(setOfNotes, filename) {
            targetFile = get_that_file(setOfNotes, filename);
            console.log("target is " + targetFile.filename);
            console.log("This was clicked");
            temp = parentCallback(targetFile);
            //temp = targetFile;
            //console.log("temp is " + temp.filename);
    }
    
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
                    {
                        notePages.map(page => (
                        <li className="side-list">
                            <Link className="the-link" to="/notebook" state={{data: "temp"}} onClick={() => get_that_file_wrapper(notePages, page.filename)}>
                            <div className="side-selection">
                                <h5>{page.title}</h5>
                            </div>
                            </Link>
                        </li>
                        ))
                    }
                </ul>
            </div>
        </div>
    );
  }

export default Sidebar;