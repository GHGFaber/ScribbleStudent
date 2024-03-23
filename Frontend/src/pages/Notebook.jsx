import Navbar from "../components/Navbar.jsx";
import Sidebar from "../components/Sidebar.jsx";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import axios from "axios";
import moment from 'moment'; // For timestamp
import socket from "../components/Socket.jsx";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
// page that contains the pages of the user's virtual notebook
// function Notebook(props, targetPage, username) {
function Notebook(props) {
  const { notePages, setNotes, classes, setClasses, username, setUsername, selectedNote, setSelectedNote, room, setRoom } = props;

  // uses react-quill to render a textarea where the user can input text on
  // a page of notes
  var toolbarOptions = [
    [{ font: [] }],
    [{ size: ["small", false, "large", "huge"] }],
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ script: "sub" }, { script: "super" }],
    [{ indent: "-1" }, { indent: "+1" }],
    ["link", "image"],
    [{ align: [] }],
  ];
  const module = {
    toolbar: toolbarOptions,
  };

  function get_that_data_wrapper(childData) {
    return get_that_data(childData);
  }

  function dummy() {
    return 0;
  }


  // Function to handle callback from Sidebar component
  const handleNoteSelection = (noteData) => {
    // console.log("Here");
    // // setSelectedNote(noteData); // Update selected note in state
    // console.log("callback:", noteData);
    // if (noteData) {
    //   // setSelectedNote(noteData); //ADDED
    //   // setValue(noteData.text); // Update value of ReactQuill
    //   setValuePromise(
    //     new Promise((resolve, reject) => {
    //       setValue(noteData.text);
    //       resolve();
    //     })
    //   );
    //   setSelectedNotePromise(
    //     new Promise((resolve, reject) => {
    //       setSelectedNote(noteData);
    //       resolve();
    //     })
    //   );
    // }
  };




  // Get the notes from the database
  // *** Pass as prop for callback so not having to duplicate code in sidebar ***
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

  // Update notes after change is made to selectedNote
  const updateNotes = async(req, res) => {
    try {
      // Update notes in database
      await axios.post("http://localhost:3000/update-note", {
        fileID: selectedNote.fileID,
        newFileName: selectedNote.fileName,
        newUploadDate: moment().format('YYYY-MM-DD HH:mm:ss'),
        newDescription: selectedNote.description,
        newText: selectedNote.text,
      });
      console.log("Note updated in database");
      // Update note list
      getUserNotes();
    } catch(error) {
      console.error("Error updating notes:", error);
    }
  };

  // Delete user note
  const deleteNote = async(noteID) => {
    try {
      // Display confirmation dialog
      const isConfirmed = window.confirm("Are you sure you want to delete this note?");
      
      if (isConfirmed) {
        // Delete note after user clicks button
        await axios.post("http://localhost:3000/delete-note", {
          fileID: noteID,
        });
        // Update note list
        getUserNotes();
        // Reset selectedNote to null
        setSelectedNote(null);
      }
    } catch(error) {
      console.error("Error deleting note:", error);
    }
  };


  // When the selecteNote.text changes
  // update the database
  useEffect(() => {
    if (selectedNote !== null && selectedNote !== undefined) {
      updateNotes();
      console.log("selectedNote updated:", selectedNote);
    } else {
      console.log("selectedNote not updated");
    }
  },[selectedNote]);

  return (
    <>
      <Navbar 
        classes={classes} setClasses={setClasses} 
        username={username} setUsername={setUsername}
        room={room} setRoom={setRoom} 
      />
      <div className="container-fluid">
        <div className="row no-gutters">
          <div className="col-2 column1">
            <Sidebar 
              notePages={notePages} setNotes={setNotes} 
              selectedNote={selectedNote} setSelectedNote={setSelectedNote}
              room={room} setRoom={setRoom}
            />
          </div>
          <div className="col-10 column2 the-note-section">
            {selectedNote && (
              <>
                <h3 style={{ 
                  marginLeft: "10px", 
                  marginTop: "5px", 
                  fontFamily: "Comic Sans MS, cursive", 
                  fontWeight: "bold",
                  userSelect: "none"
                }}
                  onDoubleClick={() => {
                    const newTitle = prompt("Enter new title:", selectedNote.description);
                    if (newTitle !== null && newTitle !== "" && newTitle !== selectedNote.description) {
                      setSelectedNote({...selectedNote, description: newTitle, fileName: newTitle + ".txt"});
                    }
                }}
                > 
                {selectedNote.description}
                </h3> {/* Display document title */}
                <ReactQuill
                  id="the-notes"
                  modules={module}
                  theme="snow"
                  value={selectedNote.text}
                  onChange={(newText) => {
                    setSelectedNote(prevSelectedNote => ({
                      ...prevSelectedNote,
                      text: newText
                    }));
                  }}
                />
                {/* Delete note button */}
                <button 
                  style={{
                    position: "absolute",
                    top: "10px",
                    right: "10px",
                  }}
                  onClick={() => {
                    // Call a function to handle note deletion
                    deleteNote(selectedNote.fileID);
                  }}
                >
                  Delete Note
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Notebook;
