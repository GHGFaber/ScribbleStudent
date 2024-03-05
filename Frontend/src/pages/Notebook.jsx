import Navbar from "../components/Navbar.jsx";
import Sidebar from "../components/Sidebar.jsx";
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';
import {useState} from "react";
function Notebook({classes, username}) {
    const [value, setValue] = useState('');
    var toolbarOptions = [
        [{ 'font': [] }],
        [{ 'size': ['small', false, 'large', 'huge'] }], 
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{'list': 'ordered'}, {'list': 'bullet'}],
        [{'script': 'sub'}, {'script': 'super'}],
        [{'indent': '-1'}, {'indent': '+1'}],
        ['link', 'image'],
        [{ 'align': [] }]
    ];
    const module = {
        toolbar: toolbarOptions
    };

    return (
        <>
         
         <Navbar username={username}/>
         <div className="container-fluid">
            <div className="row no-gutters">
                <div className="col-2 column1">
                    <Sidebar/>
                </div>
                <div className="col-10 column2 the-note-section">
                    {/*<div id="note-window container-fluid"> */}
                    <ReactQuill
                        id="the-notes" 
                        modules={module}
                        theme="snow" 
                        value={value} 
                        onChange={setValue} />
                    {/*</div>*/}
                </div>  
            </div> 
        </div>
        </>
    );
  }

export default Notebook;