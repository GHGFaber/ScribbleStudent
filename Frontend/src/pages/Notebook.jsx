import Navbar from "../components/Navbar.jsx";
import Sidebar from "../components/Sidebar.jsx";
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';
import {useState} from "react";
function Notebook({classes, notePages, initData}) {

    // const [initData, setInitData] = useState('');
    const [value, setValue] = useState('');
    const temp = location.state;
    console.log(location.state);

    let currentFile = "";
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

    {/* currentFile.text */}

    function get_that_data(childData, initData) {
       if (initData != '') {
            setValue(initData.text);
            initData = '';
       } else {
            setValue(temp.text);
            console.log("get_that_data()");
       }
    }

    return (
        <>
         
         <Navbar classes={classes}/>
         <div className="container-fluid">
            <div className="row no-gutters">
                <div className="col-2 column1">
                    <Sidebar parentCallback={get_that_data} notePages={notePages} initData={initData}/>
                </div>
                <div className="col-10 column2 the-note-section">         
                    <ReactQuill
                        id="the-notes" 
                        modules={module}
                        theme="snow" 
                        value={value} 
                        onChange={setValue} />
                </div>  
            </div> 
        </div>
        </>
    );
  }

export default Notebook;