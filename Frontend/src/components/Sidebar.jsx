import {Link} from "react-router-dom";
function Sidebar({parentCallback, notePages, initData, temp}) {

    let targetFile = '';

    function get_that_file(setOfNotes, filename) { 
        return setOfNotes.find((page) => page.filename == filename); 
    }

    function get_that_file_wrapper(setOfNotes, filename, data) {
        if (targetFile == '') {
            targetFile = get_that_file(setOfNotes, filename);
        } else {
            targetFile = initData;
            console.log("target is " + targetFile.name);
        }
        console.log(filename);
        console.log("This was clicked");
        parentCallback(targetFile, data);
        temp = data;
        console.log("The temp is " + temp.filename);
        if (data != '') {
            targetFile = data;
            console.log("The target is " + targetFile.filename);
        }
    }
    
    return (
        <sidebar>
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
                            <Link className="the-link" to={{pathname: "/notebook", state: "hello"}} targetPage={targetFile} onClick={() => get_that_file_wrapper(notePages, page.filename, page)}>
                            <div className="side-selection">
                                <h5>{page.title}</h5>
                            </div>
                            </Link>
                        </li>
                        ))
                    }
                </ul>
            </div>
        </sidebar>
    );
  }

export default Sidebar;