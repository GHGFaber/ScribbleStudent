import Navbar from "../components/Navbar.jsx";
import Sidebar from "../components/Sidebar.jsx";
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';
import {useState} from "react";
import { useLocation } from "react-router-dom";
function Notebook(props, targetPage) {

    let classes = props.classes;
    let notePages = props.notePages;
    let temp = "";
    //const {state} = props.location.state;
    //console.log(targetPage.text);


    /**
     * Potential strategy: send the current page info as prop
     * set the prop outside the parent callback function
     */
    
    //const location = useLocation();
    //const data = location.state;
    //console.log("temp is " + data);
    //console.log("location.state: " + props.location.state);
    //let temp = state;

    // const [initData, setInitData] = useState('');
    const [value, setValue] = useState('');
    
    function set_init_value() {setValue(targetPage.text)};

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

    
    function get_that_data(childData) {
        setValue(childData.text);
        return '';
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
         <Navbar classes={classes}/>
         <div className="container-fluid">
            <div className="row no-gutters">
                <div className="col-2 column1">
                    <Sidebar parentCallback={get_that_data} notePages={notePages}/>
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
