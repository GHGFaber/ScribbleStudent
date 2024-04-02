import { Link } from "react-router-dom";
import { initValueContext } from "../components/InitValue.jsx";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import AddClass from "../components/AddClass.jsx";

// renders the bar that appears to the left of the screen
// contains menu selections for the chatroom and individual note pages
function Sidebar({
  notePages,
  setNotes,
  username,
  selectedNote,
  setSelectedNote,
  classes,
  refresh,
  setRefresh,
  parentCallback,
}) {
  // const [dropdownVisible, setDropdownVisible] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(
    sessionStorage.getItem("dropdownVisible") === "true"
  );

  const [modalOpen, setModalOpen] = useState(false); // State to control the modal

  // Function to open the modal
  const openModal = () => {
    setModalOpen(true);
  };

  // Function to close the modal
  const closeModal = () => {
    setModalOpen(false);
  };

  async function get_users_notes_from_server() {
    console.log("Grabbing note data...");
    console.log("selected note:", selectedNote);
    try {
      const res = await axios.get("http://64.23.164.87/api/notes_data");
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
    // sessionStorage.setItem('selectedNote', JSON.stringify(targetFile));
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
    // availableClasses();
  }, []);

  // Save dropdownVisible state to sessionStorage whenever it changes
  useEffect(() => {
    sessionStorage.setItem("dropdownVisible", dropdownVisible);
  }, [dropdownVisible]);

  useEffect(() => {
    sessionStorage.setItem("selectedNote", JSON.stringify(selectedNote));
  }, [selectedNote]);

  return (
    <div>
      {/* Render modal component conditionally */}
      {modalOpen && (
        <AddClass
          onClose={closeModal}
          classes={classes}
          refresh={refresh}
          setRefresh={setRefresh}
        />
      )}

      <div className="the-column">
        <ul className="sidebar-content">
          <li className="side-list">
            {/* Call openModal function when the link is clicked */}
            <Link className="the-link" to="/chatroom" onClick={openModal}>
              <div className="side-selection">
                <h5>Classes</h5>
              </div>
            </Link>
          </li>
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
                <label
                  htmlFor="touch"
                  className="the-link"
                  onClick={() => setDropdownVisible(!dropdownVisible)}
                >
                  <h5>Notebook</h5>
                </label>
              </div>
              <ul
                className="slide"
                style={{ display: dropdownVisible ? "block" : "none" }}
              >
                {notePages.map((page) => (
                  <li className="side-list" key={page.filename}>
                    <Link
                      className="the-link"
                      to={{
                        pathname: "/notebook",
                        state: { targetFile: page },
                      }}
                      onClick={() => get_that_file_wrapper(page)}
                      style={{
                        color: "#2d2f31",
                        display: "block",
                        paddingRight: "65px",
                      }}
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

export default Sidebar;
