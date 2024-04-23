//connect to socket.io server
import io from "socket.io-client";
import.meta.env.VITE_ENDPOINT;
// const socket = io.connect(`${import.meta.env.VITE_ENDPOINT}{
//     reconnection: false
// });
var pathValue = null;
if (import.meta.env.VITE_ENDPOINT === "https://scribblestudent/api") {
  pathValue = "/api/socket.io";
}
const socket = io.connect(`${import.meta.env.VITE_SOCKET}`, {
  path: pathValue || "",
  transports: ["polling"],
});

export default socket;
