//connect to socket.io server
import io from "socket.io-client";

// const socket = io.connect("http://localhost:3000", {
//     reconnection: false
// });
const socket = io("http://64.23.164.87", {
  path: "/api/socket.io",
  transports: ["websocket"],
  secure: true,
});

export default socket;
