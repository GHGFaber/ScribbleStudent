import Navbar from "../components/Navbar.jsx";
import Sidebar from "../components/Sidebar.jsx";

function Chatroom({chats}) {

    function show_chats() {
        return (
            chats.map(chat => (
                <div className="chat-panel">
                    <div className="container-fluid the-chat-div rounded-0">
                        <div className="container-body">
                            <p className="user-text">{chat.username}</p>
                            <p className="text-content">{chat.text}</p>
                        </div>
                    </div>     
                </div>      
            ))
        )
    }
    return (
        <>
            <Navbar/>
            <div className="container-fluid">
                <div className="row no-gutters">
                    <div className="col-2 column1">
                        <Sidebar/>
                    </div>
                    <div className="col-8 column2">
                        <div id="chat-window">
                            {
                                show_chats()
                            }
                        </div>
                        <form>
                            <div id="the-textarea" className="container-fluid">
                                <textarea id="txt"></textarea>
                            </div>
                            <div id="chat-text-btn" className="container-fluid">
                                <button id="send-button">Send</button>
                            </div>       
                        </form>     
                    </div>
                    <div className="col-2 column3"></div>
                </div>
            </div>
        </>
    );
  }

export default Chatroom;