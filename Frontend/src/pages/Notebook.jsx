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

  // const [value, setValue] = useState("");
  const [value, setValue] = useState(selectedNote ? selectedNote.text : "");
  // Used to refresh sidebar with new page data
  const [refresh, setRefresh] = useState("");

  const [selectedNotePromise, setSelectedNotePromise] = useState(null);
  const [valuePromise, setValuePromise] = useState(null);


  // let notePages = notepages;
  let temp = "";

  // Function to handle changes in the document content
  const saveChanges = async () => {
    try {
      // Check if there's a selected note and the content has changed
      if (selectedNote && selectedNote.text !== value) {
        // Update the selected note with the new content
        const updatedNote = { ...selectedNote, text: value };
        // setSelectedNote(updatedNote);
        setSelectedNotePromise(
          new Promise((resolve, reject) => {
            setSelectedNote(updatedNote);
            resolve();
          })
        );

        // Update the note in the database
        await updateNoteInDatabase(updatedNote);
      }
    } catch (error) {
      console.error('Error saving changes', error);
    }
  };
  useEffect(() => {

    saveChanges(); // Call the saveChanges function whenever the content changes
  }, [value]);

  // Function to update the note in the database
  const updateNoteInDatabase = async (note) => {
    try {
      console.log("new title:", note);
      if (note.title !== selectedNote.title) {
        // Perform database update operation here
        await axios.post("http://localhost:3000/update-note", {
          fileID: selectedNote.fileID,
          newFileName: note.title + ".txt",
          newUploadDate: moment().format('YYYY-MM-DD HH:mm:ss'),
          newDescription: note.title,
          newText: value,
          // newFile: value,
        });
      } else {
        // Perform database update operation here
        await axios.post("http://localhost:3000/update-note", {
          fileID: selectedNote.fileID,
          newFileName: selectedNote.title + ".txt",
          newUploadDate: moment().format('YYYY-MM-DD HH:mm:ss'),
          newDescription: selectedNote.title,
          newText: value,
          // newFile: value,
        });
      }
      console.log("Updated note in the database:", note);
    } catch (error) {
      console.error('Error updating note in the database', error);
    }
  };
  

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

  // function get_that_data(childData) {
  //   setValue(childData.text);
  //   console.log("text:",childData.text);
  //   return "";
  // }

  function get_that_data_wrapper(childData) {
    return get_that_data(childData);
  }

  function dummy() {
    return 0;
  }


  // Function to handle callback from Sidebar component
  const handleNoteSelection = (noteData) => {
    // setSelectedNote(noteData); // Update selected note in state
    console.log("callback:", noteData);
    if (noteData) {
      // setSelectedNote(noteData); //ADDED
      // setValue(noteData.text); // Update value of ReactQuill
      setValuePromise(
        new Promise((resolve, reject) => {
          setValue(noteData.text);
          resolve();
        })
      );
      setSelectedNotePromise(
        new Promise((resolve, reject) => {
          setSelectedNote(noteData);
          resolve();
        })
      );
    }
  };

  useEffect(() => {
    if (selectedNotePromise) {
      selectedNotePromise.then(() => {
        // Perform additional operations after selectedNote is updated
        console.log("Selected note updated:", selectedNote);
      });
    }
    if (valuePromise) {
      valuePromise.then(() => {
        // Perform additional operations after value is updated
        console.log("Value updated:", value);
      });
    }
  }, [selectedNotePromise, valuePromise]);

  // useEffect(() => {
  //   if (selectedNote) {
  //     setValue(selectedNote.text);
  //   }
  // }, [selectedNote]);

  useEffect(() => {
    console.log("notePages changed notebook", notePages);

  }, [notePages]);

  // Function to handle updating the title
  const handleTitleChange = async (newTitle) => {
    try {
      // Update the selected note with the new content
      const updatedNote = { ...selectedNote, title: newTitle };
      // const updatedNote = prevSelectedNote => ({ ...prevSelectedNote, title: newTitle });
      // setSelectedNote(updatedNote);
      setSelectedNotePromise(
        new Promise((resolve, reject) => {
          setSelectedNote(updatedNote);
          resolve();
        })
      );

      // Update the note in the database
      await updateNoteInDatabase(updatedNote);
    } catch (error) {
      console.error('Error saving changes', error);
    }
  };

  return (
    <>
      {
        // set_init_value()
      }
      <Navbar 
        classes={classes} setClasses={setClasses} 
        username={username} setUsername={setUsername}
        room={room} setRoom={setRoom} 
      />
      <div className="container-fluid">
        <div className="row no-gutters">
          <div className="col-2 column1">
            {/* <Sidebar parentCallback={get_that_data} notePages={notePages} /> */}
            <Sidebar 
              parentCallback={handleNoteSelection} 
              notePages={notePages} setNotes={setNotes} 
              selectedNote={selectedNote} setSelectedNote={setSelectedNote}
              room={room} setRoom={setRoom}
              refresh={refresh}
            />
          </div>
          <div className="col-10 column2 the-note-section">
            {selectedNote && (
              <>
                <h3
                  onDoubleClick={() => {
                    const newTitle = prompt("Enter new title:", selectedNote.title);
                    if (newTitle !== null && newTitle !== "") {
                      // setSelectedNote(prevSelectedNote => ({ ...prevSelectedNote, title: newTitle }));
                      handleTitleChange(newTitle); // Call handleTitleChange when double-clicked
                    }
                }}
                > 
                {selectedNote.title}
                </h3> {/* Display document title */}
                <ReactQuill
                  id="the-notes"
                  modules={module}
                  theme="snow"
                  value={value}
                  onChange={setValue} // Saves text changes to database
                />
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Notebook;
