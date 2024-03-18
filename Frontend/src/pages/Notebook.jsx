import Navbar from "../components/Navbar.jsx";
import Sidebar from "../components/Sidebar.jsx";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
// page that contains the pages of the user's virtual notebook
function Notebook(props, targetPage) {
  const [classes, setClasses] = useState([]);
  const [value, setValue] = useState("");
  let notePages = "";
  let temp = "";

  useEffect(() => {
    setClasses(JSON.parse(localStorage.getItem("classes")));
    get_users_notes_from_server();
    console.log("Notebook: useEffect has ran.");
  }, []);
 
  //const {state} = props.location.state;
  //console.log(targetPage.text);
  //const location = useLocation();
  //const data = location.state;
  //console.log("temp is " + data);
  //console.log("location.state: " + props.location.state);
  //let temp = state;

  // const [initData, setInitData] = useState('');


  console.log(classes);

  // contacts backend to fetch the user's notes
  function get_users_notes_from_server() {
    axios
      .get("http://localhost:3000/notes_data")
      .then((res) => {
        setNotes(res.data);
        localStorage.setItem("notes", JSON.stringify(res.data));
        console.log(res.data);
        notePages = JSON.parse(localStorage.getItem("notes"));
        console.log("notepages is: " + JSON.stringify(notePages));
      })
      .catch((error) => {
        console.error("Error fetching data from the API:", error);
        console.log("not connected");
      });
  }

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

  return (
    <>
      {
        // set_init_value()
      }
      <Navbar classes={classes} />
      <div className="container-fluid">
        <div className="row no-gutters">
          <div className="col-2 column1">
            <Sidebar parentCallback={get_that_data} notePages={notePages} />
          </div>
          <div className="col-10 column2 the-note-section">
            <ReactQuill
              id="the-notes"
              modules={module}
              theme="snow"
              value={value}
              onChange={setValue}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default Notebook;
