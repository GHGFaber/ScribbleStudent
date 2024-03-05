//connect to socket.io server
import io from "socket.io-client";

// const socket = io.connect("http://localhost:3000", {
//     reconnection: false
// }); 
const socket = io.connect("http://localhost:3000"); 

export default socket;