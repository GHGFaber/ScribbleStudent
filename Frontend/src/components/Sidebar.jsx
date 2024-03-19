import { Link } from "react-router-dom";
import { initValueContext } from "../components/InitValue.jsx";
import { useContext, useState, useEffect } from "react";

// renders the bar that appears to the left of the screen
// contains menu selections for the chatroom and individual note pages
function Sidebar({ parentCallback, notePages }) {
  let targetFile = "";
  let temp = "";
  const [userNotes, setUserNotes] = useState(localStorage.getItem("notes"));
  console.log(notePages);
  useEffect(() => {
    setUserNotes(localStorage.getItem("notes"));
    notePages = userNotes;
    localStorage.setItem("notes", JSON.stringify(notePages));
  }, []);

  useEffect(() => {
    setUserNotes(localStorage.getItem("notes"));
    notePages = JSON.parse(userNotes);
    console.log(localStorage.getItem("notes"));
    console.log("the pages are: " + userNotes);
  }, [userNotes]);

  console.log(localStorage.getItem("notes"));

  // takes a filename string and returns the corresponding set of notes
  function get_that_file(setOfNotes, filename) {
    return setOfNotes.find((page) => page.filename == filename);
  }

  // wrapper for retriving the desired file
  function get_that_file_wrapper(setOfNotes, filename) {
    targetFile = get_that_file(setOfNotes, filename);
    console.log("target is " + targetFile.filename);
    console.log("This was clicked");
    console.log("sidebar note pages in fcn are: " + JSON.stringify(notePages));
    temp = parentCallback(targetFile);
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
          {notePages.map((page) => (
            <li className="side-list">
              <Link
                className="the-link"
                to="/notebook"
                state={{ data: "temp" }}
                onClick={() => get_that_file_wrapper(notePages, page.filename)}
              >
                <div className="side-selection">
                  <h5>{page.title}</h5>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Sidebar;
