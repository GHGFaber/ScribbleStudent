import { Link } from "react-router-dom";
import { initValueContext } from "../components/InitValue.jsx";
import { useContext, useEffect, useState } from "react";
import axios from "axios";


// renders the bar that appears to the left of the screen
// contains menu selections for the chatroom and individual note pages
function Sidebar({ notePages, setNotes, username, selectedNote, setSelectedNote, parentCallback}) {

  const [dropdownVisible, setDropdownVisible] = useState(false);

  async function get_users_notes_from_server() {
    console.log("Grabbing note data...");
    console.log("selected note:", selectedNote);
    try {
      const res = await axios.get("http://localhost:3000/notes_data");
      setNotes(res.data);
      localStorage.setItem("notes", JSON.stringify(res.data));
    } catch (error) {
      console.error("Error fetching data from the API:", error);
      console.log("not connected");
    }
  }

  // takes a filename string and returns the corresponding set of notes
  function get_that_file(setOfNotes, filename) {
    return setOfNotes.find((page) => page.filename == filename);
  }

  // wrapper for retriving the desired file
  function get_that_file_wrapper(page) {
    const targetFile = get_that_file(notePages, page.filename);
    // Set and save the selected note
    setSelectedNote(targetFile);
    sessionStorage.setItem('selectedNote', JSON.stringify(targetFile));
    console.log("note set:", selectedNote);
    parentCallback(targetFile);
    // setDropdownVisible(false);
  }

  useEffect(() => {
    get_users_notes_from_server();
    // grab selectedNote from sessionStorage
    // (Was trying to allow selectedNote state to persist
    // after refresh)
    // const noteData = sessionStorage.getItem('selected');
    // Loads the selectedNote initially
    if (selectedNote !== undefined) {
      get_that_file_wrapper(selectedNote);
    }
  },[]);

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
          <nav>
            <li className="side-list">
              <div className="side-selection">
                <label htmlFor="touch" className="the-link" onClick={() => setDropdownVisible(!dropdownVisible)}>
                  <h5>Notebook</h5>
                </label>
              </div>
              <ul className="slide" style={{ display: dropdownVisible ? "block" : "none" }}>
                {notePages.map((page) => (
                  <li className="side-list" key={page.filename}>
                    <Link
                      className="the-link"
                      to={{ pathname: "/notebook", state: { targetFile: page } }}
                      onClick={() => get_that_file_wrapper(page)}
                      style={{ color: "#2d2f31", display: "block", paddingRight: "65px" }}
                    >
                      <div className="side-selection">
                        <h6>{page.title}</h6>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
          </nav>
        </ul>
      </div>
    </div>
  );
}

//   return (
//     <div>
//       <div className="the-column">
//         <ul className="sidebar-content">
//           <li className="side-list">
//             <Link className="the-link" to="/chatroom">
//               <div className="side-selection">
//                 <h5>Chatroom</h5>
//               </div>
//             </Link>
//           </li>
//           <nav>
//             <li className="side-list">
//               <label htmlFor="touch" onClick={() => setDropdownVisible(!dropdownVisible)}>
//                 <span className="the-link">
//                   <div className="side-selection">
//                     <h5>Notebook</h5>
//                   </div>
//                 </span>
//               </label>
//             </li>
//               <ul className="slide" style={{ display: dropdownVisible ? "block" : "none" }}>
//                 {notePages.map((page) => (
//                   <li className="side-list" key={page.filename}>
//                     <Link
//                       className="the-link"
//                       to={{ pathname: "/notebook", state: { targetFile: page } }}
//                       onClick={() => get_that_file_wrapper(page)}
//                       style={{ textDecoration: "none", color: "#2d2f31", display: "block", padding: "10px" }}
//                     >
//                       <div className="side-selection">
//                         <h5>{page.title}</h5>
//                       </div>
//                     </Link>
//                   </li>
//                 ))}
//               </ul>
//           </nav>
//         </ul>
//       </div>
//     </div>
//   );
// }

//   return (
//     <div>
//       <div className="the-column">
//         <ul className="sidebar-content">
//           <li className="side-list">
//             <Link className="the-link" to="/chatroom">
//               <div className="side-selection">
//                 <h5>Chatroom</h5>
//               </div>
//             </Link>
//           </li>
//           {notePages && notePages.map((page) => (
//             <li className="side-list" key={page.filename}>
//               <Link
//                 className="the-link"
//                 to={{ 
//                   pathname: "/notebook",
//                   state: { targetFile: page }
//                  }}
//                 onClick={() => get_that_file_wrapper(page)}
//               >
//                 <div className="side-selection">
//                   <h5>{page.title}</h5>
//                 </div>
//               </Link>
//             </li>
//           ))}
//         </ul>
//       </div>
//     </div>
//   );
// }

export default Sidebar;
