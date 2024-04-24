//connect to socket.io server
import io from "socket.io-client";
import.meta.env.VITE_ENDPOINT;
// const socket = io.connect(`${import.meta.env.VITE_ENDPOINT}{
//     reconnection: false
// });
let pathValue = "";
let VITE_ENDPOINT = import.meta.env.VITE_ENDPOINT;
console.log(VITE_ENDPOINT);
if (VITE_ENDPOINT === "https://scribblestudent.com/api") {
  pathValue = "/api/socket.io";
}

console.log("FOUND PATH", pathValue);
const socket = io.connect(`${import.meta.env.VITE_SOCKET}`, {
  path: pathValue || "",
  transports: ["polling"],
});

export default socket;
