//connect to socket.io server
import io from "socket.io-client";

// const socket = io.connect("http://64.23.164.87/api", {
//     reconnection: false
// });
const socket = io.connect("http://64.23.164.87", {
  path: "/api/socket.io",
  transports: ["polling"],
});

export default socket;
