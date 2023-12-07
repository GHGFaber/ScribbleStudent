import Navbar from "../components/Navbar.jsx";
import Sidebar from "../components/Sidebar.jsx";

function Notebook() {
    return (
        <>
         <Navbar/>
         <div className="container-fluid">
            <div className="row no-gutters">
                <div className="col-2 column1">
                    <Sidebar/>
                </div>
                <div className="col-10 column2">
                    <div id="edit-bar"></div>
                    <div id="note-window container-fluid">
                        <textarea id="note-text"></textarea>
                    </div>
                </div>  
            </div> 
        </div>
        </>
    );
  }

export default Notebook;