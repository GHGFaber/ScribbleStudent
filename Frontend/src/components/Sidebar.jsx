import { Link } from "react-router-dom";
import { initValueContext } from "../components/InitValue.jsx";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import moment from 'moment'; // For timestamp
import AddClass from "../components/AddClass.jsx"; 


// renders the bar that appears to the left of the screen
// contains menu selections for the chatroom and individual note pages
function Sidebar({ notePages, setNotes, selectedNote, setSelectedNote, classes}) {

  // const [dropdownVisible, setDropdownVisible] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(
    sessionStorage.getItem("dropdownVisible") === "true"
  );

  // State to control the modal
  const [modalOpen, setModalOpen] = useState(false); 

  // State for storing notes 
  const [storedNotes, setStoredNotes] = useState([]);

  
  // Function to open the modal
  const openModal = () => {
    setModalOpen(true);
  };

  // Function to close the modal
  const closeModal = () => {
    setModalOpen(false);
  };

  // Function to generate a unique filename
  function generateUniqueFilename(baseName, existingFilenames) {
    let newName = baseName;
    let count = 1;
    while (existingFilenames.some(page => page.description === newName)) {
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
      if (notePages.some(page => page.description === description)) {
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
      const uploadDate = moment().format('YYYY-MM-DD HH:mm:ss');

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
  const getUserNotes = async() => {
    try {
      const response = await axios.get("http://localhost:3000/notes");
      console.log("User Notes:", response.data.noteData);
      // Format the notes for displaying
      const formattedNotes = response.data.noteData.map(note => ({
        description: note.description,
        fileName: note.fileName,
        fileID: note.fileID,
        text: note.text,
      }));
      // Insert formatted data into storedNotes state
      // setStoredNotes(formattedNotes);
      setNotes(formattedNotes);
      
    } catch (error) {
      console.error("Error getting notes:", error);
    }
  }

  // Set the note that the user clicks
  const setUserNote = (note) => {
    try {
      console.log("page clicked:", note);
      // Set the note that the user clicked
      setSelectedNote(note);
    } catch(error) {
      console.error("Error setting user note:", error);
    }
  };

  // Save dropdownVisible state to sessionStorage whenever it changes
  useEffect(() => {
    sessionStorage.setItem("dropdownVisible", dropdownVisible);
  }, [dropdownVisible]);

  // When the sidebar loads, grab the note information from database
  // to display on the siebar dropdown
  useEffect(() => {
    getUserNotes();
    // console.log("Get notes:", storedNotes);
    console.log("Get notes:", notePages);
  },[]);

  return (
    <div>
      {/* Render modal component conditionally */}
      {modalOpen && <AddClass 
        onClose={closeModal} classes={classes}
      />}

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
            <Link 
              className="the-link" 
              to="/chatroom"
            >
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
                {/* Use storedNotes state to display list */}
                {/* {storedNotes && storedNotes.length > 0 && storedNotes.map((page) => ( */}
                {notePages && notePages.length > 0 && notePages.map((page) => (
                  <li className="side-list" key={page.fileName}>
                    <Link
                      className="the-link"
                      to={{ pathname: "/notebook" }}
                      onClick={() => setUserNote(page)}
                      style={{ color: "#2d2f31", display: "block", paddingRight: "65px" }}
                    >
                      <div className="side-selection">
                        <h6>{page.description}</h6>
                      </div>
                    </Link>
                  </li>
                ))}
                {/* Add Note button (Limit to 5 notes for now) */}
                {notePages.length < 5 && (
                <li className="side-list">
                  <Link 
                    className="the-link" 
                    onClick={newNote}
                    style={{ color: "#2d2f31", display: "block", paddingRight: "65px" }}
                  >
                    <div className="side-selection">
                      <h6 style={{ fontSize: "14px" }}>Add Note</h6>
                    </div>
                  </Link>
                </li>
                )}
              </ul>
            </li>
          </nav>
        </ul>
      </div>
    </div>
  )
}

export default Sidebar;
