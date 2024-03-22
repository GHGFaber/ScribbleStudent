import { Link } from "react-router-dom";
import { initValueContext } from "../components/InitValue.jsx";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import moment from 'moment'; // For timestamp
import AddClass from "../components/AddClass.jsx"; 


// renders the bar that appears to the left of the screen
// contains menu selections for the chatroom and individual note pages
function Sidebar({ notePages, setNotes, selectedNote, setSelectedNote, classes, refresh, parentCallback}) {

  // const [dropdownVisible, setDropdownVisible] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(
    sessionStorage.getItem("dropdownVisible") === "true"
  );

  // State to control the modal
  const [modalOpen, setModalOpen] = useState(false); 

  let notes = notePages;
  
  // Function to open the modal
  const openModal = () => {
    setModalOpen(true);
  };

  // Function to close the modal
  const closeModal = () => {
    setModalOpen(false);
  };

  async function get_users_notes_from_server() {
    try {
      const res = await axios.get("http://localhost:3000/notes");
      if (res && res.data && Array.isArray(res.data.noteData)) {
        const formattedNotes = await Promise.all(res.data.noteData.map(async note => {
          return {
            title: note.description,
            filename: note.fileName,
            fileID: note.fileID,
            text: note.text,
          };
        }));
        console.log("formattedNotes:", formattedNotes);
        return new Promise((resolve, reject) => {
          setNotes(formattedNotes);
          notes = formattedNotes;
          console.log("formattedNotes:", formattedNotes);
          resolve(); // Resolve the promise once setNotes completes
        });
      }
    } catch (error) {
      console.error("Error fetching note data:", error);
      // Reject the promise if an error occurs
      return Promise.reject(error);
    }
  }
  
  

  // Function to generate a unique filename
  function generateUniqueFilename(baseName, existingFilenames) {
    let newName = baseName;
    let count = 1;
    while (existingFilenames.some(page => page.title === newName)) {
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
      // if (notePages.some(page => page.title === description)) {
      if (notes.some(page => page.title === description)) {
        const uniqueFilename = generateUniqueFilename(description, notes);
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
      // Fetch new notes
      get_users_notes_from_server();

    } catch (error) {
      console.error("Error adding new note:", error);
    }
  };

  // wrapper for retrieving the desired file
  async function get_that_file_wrapper(page) {
    await get_users_notes_from_server();
    if (page !== undefined && page !== null) {
      console.log("note:", notes);
      console.log("note.filename:", notes.filename);
      console.log("page.filename:", page.filename);
      // const targetFile = notePages.find((note) => note.filename === page.filename);
      const targetFile = notes.find((note) => note.filename === page.filename); //note.filename coming back undefined
      console.log("targetFile:", targetFile);//wrong data when grabbing first time after changing in notebook
      // Set and save the selected note
      setSelectedNote(targetFile);
      // Create a promise for the parentCallback function
      const callbackPromise = new Promise((resolve, reject) => {
        parentCallback(targetFile);
        resolve(); // Resolve the promise after the parent callback is executed
      });

      // Set and save the selected note once the parent callback is completed
      callbackPromise.then(() => {
        setSelectedNote(targetFile);
      });
    }
  }

  // Save dropdownVisible state to sessionStorage whenever it changes
  useEffect(() => {
    sessionStorage.setItem("dropdownVisible", dropdownVisible);
  }, [dropdownVisible]);

  // useEffect(() => {
  //   sessionStorage.setItem("selectedNote", JSON.stringify(selectedNote));
  // }, [selectedNote]);

  useEffect(() => {
    // Loads the selectedNote initially
    if (selectedNote === null) {
    }
    const storedSelectedNote = sessionStorage.getItem("selectedNote");
    const note = JSON.parse(storedSelectedNote);
    get_that_file_wrapper(selectedNote);
    setSelectedNote(note);
  },[]);

  function test(page) {
    // get_users_notes_from_server();
    // Loads the selectedNote initially
    if (selectedNote === null) {
      const storedSelectedNote = sessionStorage.getItem("selectedNote");
      const note = JSON.parse(storedSelectedNote);
      setSelectedNote(note);
    }
    get_that_file_wrapper(selectedNote);

  }

  useEffect(() => {
    console.log("NotePages Changed sidebar", notePages);
  },[notePages]);


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
                {/* {notePages && notePages.map((page) => ( */}
                {notes.length > 0 && notes.map((page) => (
                  <li className="side-list" key={page.filename}>
                    <Link
                      className="the-link"
                      to={{ pathname: "/notebook" }}
                      onClick={() => get_that_file_wrapper(page)}
                      style={{ color: "#2d2f31", display: "block", paddingRight: "65px" }}
                    >
                      <div className="side-selection">
                        <h6>{page.title}</h6>
                      </div>
                    </Link>
                  </li>
                ))}
                {/* Add Note button */}
                <li className="side-list">
                  <Link 
                    className="the-link" 
                    // to="/notebook"
                    // onClick={newNote}
                    onClick={newNote}
                    style={{ color: "#2d2f31", display: "block", paddingRight: "65px" }}
                  >
                    <div className="side-selection">
                      <h6 style={{ fontSize: "14px" }}>Add Note</h6>
                    </div>
                  </Link>
                </li>
              </ul>
            </li>
          </nav>
        </ul>
      </div>
    </div>
  )
}

export default Sidebar;
