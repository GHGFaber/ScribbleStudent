import Navbar from "../components/Navbar.jsx";
import Sidebar from "../components/Sidebar.jsx";
import Userbar from "../components/Userbar.jsx";
import {useState} from "react";

function Chatroom({chats, classes, activeUsers, inactiveUsers, notePages}) {

    const isChatroom = true;

    let dummyCallback = (data) => {
        return data;
    }

    function get_time(timestamp) {
        const date = new Date(timestamp);
        const returnedDate = date.toLocaleDateString("en-US");
        const returnedTime = date.toLocaleTimeString("en-US");
        const timeString = returnedDate.concat(" ", returnedTime);
        return timeString;
    }

    function show_chats() {
        try {
            return (
                chats.map((chat, index) => (
                    <div key={index} className="chat-panel">
                        <div className="container-fluid the-chat-div rounded-0">
                            <div className="container-body">
                                <p className="full-datetime">{get_time(chat.timestamp)}</p>
                                <p className="user-text">{chat.username}</p>
                                <p className="text-content">{chat.text}</p>
                            </div>
                        </div>     
                    </div>      
                ))
            )
        } catch (error) {
            console.log("Error: chats.map has failed");
        }
        
    }

    return (
        <>
            <Navbar classes={classes}/>
            <div className="container-fluid">
                <div className="row no-gutters">
                    <div className="col-2 column1">
                        <Sidebar parentCallback={dummyCallback} notePages={notePages}/>
                    </div>
                    <div className="col-8 column2">
                        <div id="chat-window">
                            {
                                show_chats()
                            }
                        </div>
                        <form className="the-chat-form">
                            <div id="the-textarea" className="container-fluid">
                                <textarea id="txt"></textarea>
                            </div>
                            <div id="chat-text-btn" className="container-fluid">
                                <button id="send-button">Send</button>
                            </div>       
                        </form>     
                    </div>
                    <div className="col-2 column3">
                        <Userbar activeUsers={activeUsers} inactiveUsers={inactiveUsers}/>
                    </div>
                </div>
            </div>
        </>
    );
  }

export default Chatroom;