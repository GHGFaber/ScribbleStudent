//connect to socket.io server
import io from "socket.io-client";
import.meta.env.VITE_ENDPOINT;
// const socket = io.connect(`${import.meta.env.VITE_ENDPOINT}{
//     reconnection: false
// });
if (import.meta.env.VITE_ENDPOINT === "https://64.23.164.87/api") {
  var pathValue = "/api/socket.io";
}
const socket = io.connect(`${import.meta.env.VITE_SOCKET}`, {
  path: pathValue || "",
  transports: ["polling"],
});

export default socket;
