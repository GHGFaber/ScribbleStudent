import Navbar from "../components/Navbar.jsx";
import Sidebar from "../components/Sidebar.jsx";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import socket from "../components/Socket.jsx";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
// page that contains the pages of the user's virtual notebook
// function Notebook(props, targetPage, username) {
function Notebook(props) {
  const { notePages, setNotes, classes, setClasses, username, setUsername, selectedNote, setSelectedNote, room, setRoom } = props;

  const [value, setValue] = useState("");

  // let notePages = notepages;
  let temp = "";

  // console.log("NB: username: ", username);
  // console.log("props: ", props);


  // useEffect(() => {
  //   setClasses(JSON.parse(localStorage.getItem("classes")));
  // }, []);
 
  //const {state} = props.location.state;
  //console.log(targetPage.text);
  //const location = useLocation();
  //const data = location.state;
  //console.log("temp is " + data);
  //console.log("location.state: " + props.location.state);
  //let temp = state;

  // const [initData, setInitData] = useState('');


  console.log("classes:", classes);

  function set_init_value() {
    setValue(targetPage.text);
  }

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

  function get_that_data(childData) {
    setValue(childData.text);
    return "";
  }

  function get_that_data_wrapper(childData) {
    return get_that_data(childData);
  }

  function dummy() {
    return 0;
  }


  // Function to handle callback from Sidebar component
  const handleNoteSelection = (noteData) => {
    // setSelectedNote(noteData); // Update selected note in state
    if (noteData) {
      setValue(noteData.text); // Update value of ReactQuill
    }
  };

  useEffect(() => {
    console.log("Note set:", selectedNote);
    // populate area with notes
    // value = selectedNote.text;

  }, [selectedNote]);

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
              parentCallback={handleNoteSelection} notePages={notePages} setNotes={setNotes} 
              selectedNote={selectedNote} setSelectedNote={setSelectedNote}
              room={room} setRoom={setRoom} 
            />
          </div>
          <div className="col-10 column2 the-note-section">
            {selectedNote && (
              <ReactQuill
                id="the-notes"
                modules={module}
                theme="snow"
                value={value}
                onChange={setValue}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Notebook;
