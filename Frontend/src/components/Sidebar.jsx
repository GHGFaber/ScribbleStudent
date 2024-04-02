import { Link } from "react-router-dom";
import { initValueContext } from "../components/InitValue.jsx";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import AddClass from "../components/AddClass.jsx";
import moment from "moment"; // For timestamp
import CreateClass from "../components/CreateClass.jsx";
import LeaveClass from "../components/LeaveClass.jsx";

// renders the bar that appears to the left of the screen
// contains menu selections for the chatroom and individual note pages
function Sidebar({
  notePages,
  setNotes,
  selectedNote,
  setSelectedNote,
  classes,
  chats,
  // refresh,
  // setRefresh,
  // parentCallback,
}) {
  // const [dropdownVisible, setDropdownVisible] = useState(false);
  // const [dropdownVisible, setDropdownVisible] = useState(
  //   sessionStorage.getItem("dropdownVisible") === "true"
  // );

  const [classesDropdownVisible, setClassesDropdownVisible] = useState();

  const [notebookDropdownVisible, setNotebookDropdownVisible] = useState(
    sessionStorage.getItem("notebookDropdownVisible") === "true"
  );

  // State to control the create modal
  const [createModalOpen, setCreateModalOpen] = useState(false);
  // State to control the join modal
  const [joinModalOpen, setJoinModalOpen] = useState(false);
  // State for control the Leave modal
  const [leaveModalOpen, setLeaveModalOpen] = useState(false);

  // Function to open the create modal
  const openCreateModal = () => {
    setCreateModalOpen(true);
  };

  // Function to close the create modal
  const closeCreateModal = () => {
    setCreateModalOpen(false);
  };

  // Function to open the join modal
  const openJoinModal = () => {
    setJoinModalOpen(true);
  };

  // Function to close the join modal
  const closeJoinModal = () => {
    setJoinModalOpen(false);
  };

  // Function to open the leave modal
  const openLeaveModal = () => {
    setLeaveModalOpen(true);
  };

  // Function to close the leave modal
  const closeLeaveModal = () => {
    setLeaveModalOpen(false);
  };

  // Function to generate a unique filename
  function generateUniqueFilename(baseName, existingFilenames) {
    let newName = baseName;
    let count = 1;
    while (existingFilenames.some((page) => page.description === newName)) {
      newName = `${baseName}(${count})`;
      count++;
    }
    return newName;
  }

  // Create a new note file
  const newNote = async (req, res) => {
    try {
      // file description (Title)
      var description = "NewNote";
      if (notePages.some((page) => page.description === description)) {
        const uniqueFilename = generateUniqueFilename(description, notePages);
        description = uniqueFilename;
        console.log("Unique Filename:", uniqueFilename);
      } else {
        console.log("NewNote is unique");
      }
      // FileName
      const fileName = description + ".txt";
      console.log(fileName);
      // // File
      // const file = "";
      // Text
      const text = "";
      // local timestamp
      const uploadDate = moment().format("YYYY-MM-DD HH:mm:ss");

      await axios.post("http://localhost:3000/add-note", {
        fileName: fileName,
        uploadDate: uploadDate,
        description: description,
        text: text,
      });
      // Update notes list
      getUserNotes();
    } catch (error) {
      console.error("Error adding new note:", error);
    }
  };

  // Get the notes from the database
  const getUserNotes = async () => {
    try {
      const response = await axios.get("http://localhost:3000/notes");
      console.log("User Notes:", response.data.noteData);
      // Format the notes for displaying
      const formattedNotes = response.data.noteData.map((note) => ({
        description: note.description,
        fileName: note.fileName,
        fileID: note.fileID,
        text: note.text,
      }));
      // Insert formatted data into notePages state
      setNotes(formattedNotes);
    } catch (error) {
      console.error("Error getting notes:", error);
    }
  };

  // Set the note that the user clicks
  const setUserNote = (note) => {
    try {
      console.log("page clicked:", note);
      // Set the note that the user clicked
      setSelectedNote(note);
    } catch (error) {
      console.error("Error setting user note:", error);
    }
  };

  /// Save notebook dropdown to sessionStorage when it changes
  useEffect(() => {
    sessionStorage.setItem("notebookDropdownVisible", notebookDropdownVisible);
  }, [notebookDropdownVisible]);

  useEffect(() => {
    getUserNotes();
    console.log("Get notes:", notePages);
  }, []);

  return (
    <div>
      {/* Render create modal component conditionally */}
      {createModalOpen && (
        <CreateClass onClose={closeCreateModal} classes={classes} />
      )}
      {/* Render join modal component conditionally */}
      {joinModalOpen && <AddClass onClose={closeJoinModal} classes={classes} />}
      {/* Render leave modal component conditionally */}
      {leaveModalOpen && (
        <LeaveClass onClose={closeLeaveModal} classes={classes} />
      )}

      <div className="the-column">
        <ul className="sidebar-content">
          <nav>
            <li className="side-list">
              <div className="side-selection">
                <label
                  htmlFor="touch"
                  className="the-link"
                  onClick={() =>
                    setClassesDropdownVisible(!classesDropdownVisible)
                  }
                >
                  <h5>Classes</h5>
                </label>
              </div>
              <ul
                className="slide"
                style={{ display: classesDropdownVisible ? "block" : "none" }}
              >
                <Link
                  className="the-link"
                  // to="/chatroom"
                  onClick={openCreateModal}
                  style={{
                    color: "#2d2f31",
                    display: "block",
                    paddingRight: "65px",
                  }}
                >
                  <div className="side-selection">
                    <h6>Create</h6>
                  </div>
                </Link>
                <Link
                  className="the-link"
                  // to="/chatroom"
                  onClick={openJoinModal}
                  style={{
                    color: "#2d2f31",
                    display: "block",
                    paddingRight: "65px",
                  }}
                >
                  <div className="side-selection">
                    <h6>Join</h6>
                  </div>
                </Link>
                <Link
                  className="the-link"
                  // to="/chatroom"
                  onClick={openLeaveModal}
                  style={{
                    color: "#2d2f31",
                    display: "block",
                    paddingRight: "65px",
                  }}
                >
                  <div className="side-selection">
                    <h6>Leave</h6>
                  </div>
                </Link>
              </ul>
            </li>
          </nav>

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
                  onClick={() =>
                    setNotebookDropdownVisible(!notebookDropdownVisible)
                  }
                >
                  <h5>
                    Personal<br></br>Notebook
                  </h5>
                </label>
                {notebookDropdownVisible && notePages.length < 5 && (
                  <button
                    className="plus-button plus-button--small"
                    onClick={newNote}
                    title="add note"
                  ></button>
                )}
              </div>
              <ul
                className="slide"
                style={{ display: notebookDropdownVisible ? "block" : "none" }}
              >
                {/* Use storedNotes state to display list */}
                {notePages &&
                  notePages.length > 0 &&
                  notePages.map((page) => (
                    <li className="side-list" key={page.fileName}>
                      <Link
                        className="the-link"
                        to={{ pathname: "/notebook" }}
                        onClick={() => setUserNote(page)}
                        style={{
                          color: "#2d2f31",
                          display: "block",
                          paddingRight: "65px",
                        }}
                      >
                        <div className="side-selection">
                          <h6>{page.description}</h6>
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
