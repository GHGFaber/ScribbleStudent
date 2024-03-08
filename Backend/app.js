// Below are some iterations/different types of ways to query with mysql/mysql2
// First is doing a pool query outside of an async function
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

import express from "express";
import session from "express-session"; // create session token
import { pool } from "./database.js"; // imported from our pool made and exportedin database.js
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import bcrypt from "bcrypt";
import cors from "cors";
import { Server } from "socket.io";

//++++++++++++++++++++++++++++++++++++++++++++
import http from "http";
import sharedSession from "express-socket.io-session";
import { time } from "console";
//++++++++++++++++++++++++++++++++++++++++++++

import multer from "multer";

// External modification +++++++++++++++++++++++++++++++++++++++++++++++++++++++
import chat_items from "./scrib_chats.json" assert { type: "json" };
import user_classes from "./user_classes.json" assert { type: "json" };
import active_users from "./active_chat_users.json" assert { type: "json" };
import inactive_users from "./inactive_chat_users.json" assert { type: "json" };
import user_notes from "./user_notes.json" assert { type: "json" };
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express(); // Create application

// Set up session middleware
const upload = multer({ storage: multer.memoryStorage() });
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
app.set("trust proxy", 1); // Trust first proxy
// Set up session middleware
const sessionMiddleware = session({
  secret: "your-secret-key", // Replace with a secret key for session encryption
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false,
    // maxAge: 60000 // 1 min
  },
});
app.use(sessionMiddleware);

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());

const server = app.listen(3000, () => {
  console.log("App listening on port 3000");
});

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

// Session context shared w/ socket.io
io.engine.use(sessionMiddleware);

//retreive static notes
app.get("/notes_data", (req, res) => {
  res.json(user_notes);
});

// Call function inside socket
// Async function to query database and populate inactive users map
async function populateInactiveUsers() {
  try {
    const [results] = await pool.query("SELECT userID, username FROM user");
    results.forEach((row) => {
      const username = row.username;
      inactiveUsers.set(username, { username });
    });
  } catch (error) {
    console.error("Error fetching usernames:", error);
  }
}

// List of active users
const activeUsers = new Map();
// List of inactive users
const inactiveUsers = new Map();
// Call the async function to populate inactive users map
populateInactiveUsers();

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  // Receive username from client
  socket.on("login", (username) => {
    // Remove from inactive users if exists
    if (inactiveUsers.has(username)) {
      inactiveUsers.delete(username);
    }
    if (!activeUsers.has(username)) {
      // Store username and socket ID
      activeUsers.set(socket.id, { username });
      // Broadcast updated list of active users
      io.emit("activeUsers", Array.from(activeUsers.values()));
      // Broadcast updated list of inactive active users
      io.emit("inactiveUsers", Array.from(inactiveUsers.values()));
      // Add user to default class room
    }
  });

  // Receive username from logout
  socket.on("logout", (username) => {
    // Remove user from active users list
    const user = activeUsers.get(socket.id);
    if (user) {
      activeUsers.delete(socket.id);
      // Add to inactive users
      inactiveUsers.set(username, user);
    }
    // Broadcast updated list of active users
    io.emit("activeUsers", Array.from(activeUsers.values()));
    // Broadcast updated list of inactive active users
    io.emit("inactiveUsers", Array.from(inactiveUsers.values()));
  });

  // Remove user from activeUsers on disconnect
  socket.on("disconnect", () => {
    // Remove user from active users list
    const user = activeUsers.get(socket.id);
    if (user) {
      // Retreive username from active users
      const username = activeUsers.get(socket.id)?.username;
      activeUsers.delete(socket.id);
      // Add to inactive users
      inactiveUsers.set(username, user);
    }
    // Broadcast the updated list of active users to all clients
    io.emit("activeUsers", Array.from(activeUsers.values()));
    // Broadcast updated list of inactive active users
    io.emit("inactiveUsers", Array.from(inactiveUsers.values()));
  });

  // Join a room
  socket.on("join_room", (data) => {
    // Leave all rooms
    socket.rooms.forEach((room) => {
      if (room !== socket.id) {
        socket.leave(room);
        socket.to(room).emit("user left", socket.id);
      }
    });
    // Join new room
    socket.room = data;
    socket.join(socket.room);
    socket.to(socket.room).emit("user joined", socket.id);
    // console.log("New room: ", socket.rooms);
  });

  // Which room we are sending the message to
  socket.on("send_message", (data) => {
    // Include username along with message data
    // const messageData = {
    //   username: data.username,
    //   message: data.message,
    //   room: data.room
    // };
    // console.log("To room: ", socket.room);
    const messageData = {
      username: data.username,
      message: data.message,
    };
    socket.to(socket.room).emit("receive_message", messageData);
  });

  // // Broadcast message to users
  // socket.on("send_broadcast", (data) => {
  //   // Include username along with message data
  //   const messageData = {
  //     username: data.username,
  //     message: data.message
  //   };
  //   socket.broadcast.emit("receive_message", messageData);
  // });
});

// retrieve username of current user in session
app.get("/username", async (req, res) => {
  try {
    if (req.session && req.session.userid) {
      const userid = req.session.userid;

      // Query the database to retrieve user information based on user ID
      const [userData] = await pool.query(
        "SELECT username FROM user WHERE userID = ?",
        [userid]
      );

      if (userData.length === 1) {
        const username = userData[0].username;

        res.json({ username: username });
      } else {
        res.status(404).send("User not found");
      }
    } else {
      res.status(401).send("Unauthorized. Please log in first.");
      console.log("Unauthorized");
    }
  } catch (error) {
    console.error("Error fetching user information:", error);
    res.status(500).send("Internal server error");
  }
});

// retrieve classes data based userID
app.get("/classes", async (req, res) => {
  try {
    const userID = req.session.userid;
    // Query the database to retrieve class data
    const [classData] = await pool.query(
      "SELECT DISTINCT classes.classID, classes.className FROM classes INNER JOIN classList ON classes.classID = classList.classID INNER JOIN user ON user.userID = classList.userID WHERE user.userID = ?",
      [userID]
    );
    // ("SELECT DISTINCT classes.classID, classes.className FROM classes INNER JOIN chatrooms ON classes.classID = chatrooms.classID INNER JOIN user ON user.userID = chatrooms.userID WHERE user.userID = ?", [userID]);

    // data stored in an array of objects
    // Ex: classData[0].classID grabs the classID from the first object

    //send class data to Frontend as array of objects
    res.json({
      classData: classData,
    });
  } catch (error) {
    console.error("Error fetching class information:", error);
    res.status(500).send("Internal server error");
  }
});

// // retrieve classes data based on class name
// app.post("/classes", async (req, res) => {
//   try {
//     const { className } = req.body;
//     // Query the database to retrieve class data
//     const [classData] = await pool.query("Select * FROM classes WHERE classes.className = ?", [className]);

//     // data stored in an array of objects
//     // Ex: classData[0].classID grabs the classID from the first object

//     //send class data to Frontend as array of objects
//     res.json({
//       classData: classData
//     });
//   } catch (error) {
//     console.error("Error fetching class information:", error);
//     res.status(500).send("Internal server error");
//   }
// });

// retrieve the messages from chatroom table
app.post("/messages", async (req, res) => {
  try {
    //grab classID from frontend
    const { classID } = req.body;
    // fetch chatroom messages
    const [userData] = await pool.query(
      "SELECT chatrooms.message, chatrooms.timestamp, user.username FROM chatrooms INNER JOIN user ON user.userID = chatrooms.userID INNER JOIN classes ON classes.classID = chatrooms.classID WHERE classes.classID = ? ORDER BY chatrooms.timestamp ASC ",
      [classID]
    );
    // // Loads the last 10 messages for the chatroom ordered by timestamp
    // const [userData] = await pool.query(
    //   "SELECT * FROM (SELECT chatrooms.message, chatrooms.timestamp, user.username FROM chatrooms INNER JOIN user ON user.userID = chatrooms.userID INNER JOIN classes ON classes.classID = chatrooms.classID WHERE classes.classID = ? ORDER BY chatrooms.timestamp DESC LIMIT 10) AS last_messages ORDER BY last_messages.timestamp ASC",
    //   [classID]
    // );
  

    // data stored in an array of objects
    // Ex: userData[0].message grabs the message from the first object
    console.log("Message")

    // return data to frontend
    res.json({
      userData: userData,
    });
  } catch (error) {
    console.error("Error fetching chatroom messages:", error);
    res.status(500).send("Internal server error");
  }
});

// // update chatroom messages
// app.post("/update-messages", async (req, res) => {
//   try {
//     const { message, timestamp, classID } = req.body;
//     const userID = req.session.userID;

//     // Update the message in the chatrooms table for the specified chatroom ID
//     await pool.query("UPDATE chatrooms SET message = ?, timestamp = ? WHERE userID = ? AND classID = ?", [message, timestamp, userID, classID]);

//     res.json({ message: "Message updated successfully" });
//   } catch (error) {
//     console.error("Error updating message:", error);
//     res.status(500).send("Internal server error");
//   }
// });

// Insert message into chatroom
app.post("/insert-message", async (req, res) => {
  try {
    // grab chatroom data from frontend (send in same order from frontend)
    const { message, timestamp, classID } = req.body;
    // userID (session)
    const userID = req.session.userid;
    // insert chatroom data
    await pool.query(
      "INSERT INTO chatrooms (classID, timestamp, message, userID) VALUES (?, ?, ?, ?)",
      [classID, timestamp, message, userID]
    );
  } catch (error) {
    console.error("Error inserting message:", error);
    res.status(500).send("Internal server error");
  }
});

// // generate secret key
// const crypto = require('crypto');

// const generateSecretKey = () => {
//   return crypto.randomBytes(64).toString('hex');
// };

// const folderPath = path.join(__dirname, "..\\Frontend");

// // Login
// app.get("/login", (req, res) => {
//   const htmlPath = path.join(__dirname, "http://localhost:5173/src/pages/LoginPage.jsx");
//   //res.sendFile(htmlPath);
//   res.sendFile(htmlPath);
// });

// // Account creation
// app.get("/create-account", (req, res) => {
//   const htmlPath = path.join(__dirname, "public/create-account.html");
//   res.sendFile(htmlPath);
// });

// app.get('/logout', function(req, res){
//   req.session.destroy(function(){
//      res.send({})
//   });
//   res.redirect('src/LoginPage.jsx');
// });

//------------------------------------------------------------------------------------------------------
// Route to retrieve user information based on session data
app.get("/user-info", async (req, res) => {
  try {
    // Check if user is authenticated by checking if user ID is stored in session
    // req.session.userid
    if (req.session) {
      //console.log(req.session.userid);
      // User is authenticated, retrieve user ID from session
      const userid = req.session.userid;

      // Query the database to retrieve user information based on user ID
      const [userData] = await pool.query(
        `select user.username, 
                user.email, 
                JSON_ARRAYAGG(classes.className) as classes
                 from user 
                 LEFT JOIN classList ON user.userID = classList.userID
                LEFT JOIN classes ON classList.classID = classes.classID 
                where user.userID = ?;`,
        [userid]
      );
      if (userData.length === 1) {
        // User data found, send user information to the frontend
        res.json(userData);
      } else {
        // User not found in the database
        res.status(404).send("User not found");
      }
      // res.json(userid);
      //
      console.log("Current Session ID:", req.sessionID);
      //
    } else {
      // User is not authenticated, return unauthorized status
      res.status(401).send("Unauthorized. Please log in first.");
      console.log("Unauthorized");
    }
  } catch (error) {
    // Error occurred while fetching user information
    console.error("Error fetching user information:", error);
    res.status(500).send("Internal server error");
  }
});

// End of external modification ++++++++++++++++++++++++++++++++++++++++++++++++

// Check login credentials
// Updates user accounts from the user update page
app.post("/update-user-info", async (req, res) => {
  const { name, username, email, croppedImg } = req.body;
  try {
    if (req.session) {
      const userId = req.session.userid;

      // Query the database to retrieve essential user information based on user ID
      const [userData] = await pool.query(
        "SELECT name, username, email, avatar FROM user WHERE userID = ?",
        [userId]
      );

      if (userData.length === 1) {
        // Check if any new information is provided and not blank
        const updates = {};
        if (name) updates.name = name;
        if (username) updates.username = username;
        if (email) updates.email = email;
        if (croppedImg) updates.avatar = croppedImg;

        // Check if provided email is valid
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (updates.email && !emailRegex.test(updates.email)) {
          return res.status(400).send("Invalid email format");
        }

        // Check if username or email already exists in the database
        const [existingUser] = await pool.query(
          "SELECT userID FROM user WHERE (username = ? OR email = ?) AND userID != ?",
          [updates.username, updates.email, userId]
        );
        // Check if the provided email or username matches
        //the existing email or username of the user
        const [currentUser] = await pool.query(
          "SELECT userID FROM user WHERE userID = ? AND (username = ? OR email = ?)",
          [userId, username, email]
        );
        if (existingUser.length > 0) {
          return res
            .status(400)
            .send(
              "Username or email already exists. Please choose a different one."
            );
        }
        // Check if currentUser has any data,
        //indicating that the provided email or username
        //matches the existing email or username of the user
        if (currentUser.length > 0) {
          // Send a specific error message indicating that the user is attempting to update to an existing email or username
          return res
            .status(400)
            .send("You cannot update to your own existing email or username.");
        }

        // Update the user information in the database
        await pool.query("UPDATE user SET ? WHERE userID = ?", [
          updates,
          userId,
        ]);

        res.json({ success: true });
      } else {
        // User not found in the database
        res.status(404).send("User not found");
      }
    } else {
      // User is not authenticated, return unauthorized status
      res.status(401).send("Unauthorized. Please log in first.");
      console.log("Unauthorized");
    }
  } catch (error) {
    // Error occurred while updating user information
    console.error("Error updating user information:", error);
    res.status(500).send("No Updates Made");
  }
});

// Updates user password
app.post("/reset-password", async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  try {
    // Check if user is authenticated by checking if user ID is stored in session
    if (req.session) {
      // User is authenticated, retrieve user ID from session
      const userId = req.session.userid;

      // Query the database to retrieve the user's password based on user ID
      const [userData] = await pool.query(
        "SELECT password FROM user WHERE userID = ?",
        [userId]
      );

      if (userData.length === 1) {
        // User data found, proceed with password update logic

        // Check if the old password matches the stored password hash
        const passwordMatch = await bcrypt.compare(
          oldPassword,
          userData[0].password
        );
        if (!passwordMatch) {
          return res.status(401).send("Old password is incorrect");
        }

        // console.log("New Password:", newPassword); //testing
        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10); // 10 is the number of salt rounds

        // Update the user's password hash in the database
        await pool.query("UPDATE user SET password = ? WHERE userID = ?", [
          hashedPassword,
          userId,
        ]);

        res.json({ success: true });
      } else {
        // User not found in the database
        return res.status(404).send("User not found");
      }
    } else {
      // User is not authenticated, return unauthorized status
      res.status(401).send("Unauthorized. Please log in first.");
      console.log("Unauthorized");
    }
  } catch (error) {
    // Error occurred while updating user information
    console.error("Error updating user information:", error);
    res.status(500).send("Internal server error");
  }
});

//------------------------------------------------------------------------------------------------------

// Check login credentials (create user session)
app.post("/login", async (req, res) => {
  let username = req.body.username;
  let password = req.body.password;
  console.log("Username:", req.body.username);

  try {
    // Fetch user data (including hashed password) from the database based on username
    const [userData] = await pool.query(
      "SELECT * FROM user WHERE username = ?",
      [username]
    );

    if (userData.length === 0) {
      res.send("Invalid username or password");
    } else {
      // Grabbing user info from User table
      const hashedPassword = userData[0].password; // grab hashed password
      const userid = userData[0].userID; // grab userid
      const username = userData[0].username; // grab username
      const email = userData[0].email; // grab email
      const img = userData[0].avatar;

      // Compare the entered password with the hashed password from the database
      const passwordMatch = await bcrypt.compare(password, hashedPassword);

      if (passwordMatch) {
        //store userid in the session
        req.session.userid = userid; // this stores the userid in session
        req.session.username = username;
        // req.session.save();

        console.log("Session ID:", req.sessionID);

        // sends user info to the Frontend on submit
        res.send({
          user: userData[0].userID,
          success: true,
          username,
          email,
          Userid: req.session.userid,
          hashedPassword,
        });

        // Print userid to stdout (Backend)
        console.log("Userid:", userid);

        // const sessionId = uuidv4();
        // session[sessionId] = { username, userid };
        // // res.set('Set-Cookie', `session=${sessionId}`);
        // // res.send('success');
      } else {
        res.send("Invalid username or password");
      }
    }
  } catch (error) {
    res.status(500).send("Error checking username");
    console.error(error);
  }
});

// Logout (destroy session)
app.post("/logout", (req, res) => {
  // destroy session w/ error handling
  console.log("Destroy Session: ", req.sessionID);
  req.session.destroy((err) => {
    if (err) {
      console.error("Error destroying session:", err);
      res.status(500).send("Error destroying session");
    } else {
      res.status(200).send("Session destroyed successfully");
    }
  });
});

// Account creation post
app.post("/create-account", upload.single("Image"), async (req, res) => {
  const { username, email, password, croppedimg } = req.body;
  try {
    const [existingUser] = await pool.query(
      "SELECT * FROM user WHERE username = ? OR email = ?",
      [username, email]
    );

    if (existingUser.length > 0) {
      res.send(
        "Username or email already exists. Please choose a different one."
      );
    } else {
      // Check if the password meets the minimum length requirement
      if (password.length < 8) {
        res.send("Password must be at least 8 characters long.");
      } else {
        // Hash the password before storing it
        const hashedPassword = await bcrypt.hash(password, 10); // 10 is the number of salt rounds

        // Insert new user data (including the hashed password) into the database
        await pool.query(
          "INSERT INTO user (username, email, password, avatar) VALUES (?, ?, ?, ?)",
          [username, email, hashedPassword, croppedimg]
        );

        // Check if the account was successfully created by querying the database again
        const [newUser] = await pool.query(
          "SELECT * FROM user WHERE username = ?",
          [username]
        );

        if (newUser.length > 0) {
          // res.send("Account created successfully!");
          res.send({ success: true });
        } else {
          res.send("Failed to create an account. Please try again.");
        }
      }
    }
  } catch (error) {
    res.status(500).send("Error creating the account");
    console.error(error);
  }
});

// retrieve the messages from chatroom table
app.post("/messages", async (req, res) => {
  try {
    //grab classID from frontend
    const { classID } = req.body;
    console.log("messages: id is " + req.body.classID);
    //fetch chatroom messages
    const [userData] = await pool.query(
      "SELECT chatrooms.message, chatrooms.timestamp, user.username FROM chatrooms INNER JOIN user ON user.userID = chatrooms.userID INNER JOIN classes ON classes.classID = chatrooms.classID WHERE classes.classID = ?",
      [classID]
    );

    // data stored in an array of objects
    // Ex: userData[0].message grabs the message from the first object

    //return data to frontend
    //returns message, timestamp, and username
    res.json({
      userData: userData,
    });
  } catch (error) {
    console.error("Error fetching chatroom messages:", error);
    res.status(500).send("Internal server error");
  }
});

// Insert message into chatroom
app.post("/insert-message", async (req, res) => {
  try {
    // grab chatroom data from frontend (send in same order from frontend)
    const { classID, timestamp, message } = req.body;
    //userID (session)
    const userID = req.session.userID;
    //insert chatroom data
    await pool.query(
      "INSERT INTO chatrooms (classID, timestamp, message, userID) VALUES (?, ?, ?, ?)",
      [classID, timestamp, message, userID]
    );
  } catch (error) {
    console.error("Error inserting message:", error);
    res.status(500).send("Internal server error");
  }
});

// update chatroom messages
app.post("/update-messages", async (req, res) => {
  try {
    const userID = req.session.userID;
    const chatID = req.session.chatID;
    const { newMessage } = req.body; // Extract the new message content from the request body

    // Update the message in the chatrooms table for the specified chatroom ID
    await pool.query(
      "UPDATE chatrooms SET message = ? WHERE userID = ? AND chatID = ?",
      [newMessage, userID, chatID]
    );

    res.json({ message: "Message updated successfully" });
  } catch (error) {
    console.error("Error updating message:", error);
    res.status(500).send("Internal server error");
  }
});

// retrieve classes data based on class name
app.post("/classes", async (req, res) => {
  try {
    const { className } = req.body;
    // Query the database to retrieve class data
    const [classData] = await pool.query(
      "Select * FROM classes WHERE classes.className = ?",
      [className]
    );

    // data stored in an array of objects
    // Ex: classData[0].classID grabs the classID from the first object

    //send class data to Frontend as array of objects
    res.json({
      classData: classData,
    });
  } catch (error) {
    console.error("Error fetching class information:", error);
    res.status(500).send("Internal server error");
  }
});

// Grab html from public folder
// Path needs to lead to public directory
// to fetch html
// main html file had to be named index or else would get "cannot GET"
app.use(express.static("public"));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(200).send("hi");
  res.status(500).send("No worky ):");
});

// Use async/await with the promise-based query
async function queryDatabase() {
  try {
    // TESTING DATA
    // const [rows, fields] = await pool.query("SELECT * FROM user");
    // const classID = 1;
    // //const [rows, fields] = await pool.query
    // const [userData] = await pool.query
    // ("SELECT chatrooms.* FROM chatrooms INNER JOIN user ON user.userID = chatrooms.userID INNER JOIN classes ON classes.classID = chatrooms.classID WHERE classes.classID = ?", [classID]);
    //const className = 'Biology';
    // const [userData] = await pool.query("Select * FROM classes");
    // console.log(userData);
    // const classID = 1;
    // const [userData] = await pool.query
    // ("SELECT chatrooms.message, chatrooms.timestamp, user.username FROM chatrooms INNER JOIN user ON user.userID = chatrooms.userID INNER JOIN classes ON classes.classID = chatrooms.classID WHERE classes.classID = ? ORDER BY chatrooms.timestamp DESC", [classID]);
    // const [userData] = await pool.query
    // ("SELECT * FROM classes INNER JOIN chatrooms WHERE classes.classID = chatrooms.classID");
    // const classID = 3;
    // const userID = 11;
    // const message = "What page are we on?";
    // const timestamp = '2024-03-03T11:46:00.000Z';
    // await pool.query("INSERT INTO chatrooms (classID, userID, message, timestamp) VALUES (?, ?, ?, ?)", [classID, userID, message, timestamp]);
    // await pool.query("DELETE chatrooms.userID FROM chatrooms WHERE userID = 2");
    // const [userData] = await pool.query("Select DISTINCT classes.classID, classes.className FROM classes INNER JOIN chatrooms ON classes.classID = chatrooms.classID INNER JOIN user ON user.userID = chatrooms.userID WHERE user.userID = ?", [2]);
    // console.log(userData);
    // const [userData] = await pool.query
    // ("SELECT * FROM user WHERE user.userID = 25");
    // console.log(userData[0].avatar);
    //console.log(rows); // rows contains rows returned by the server
    // console.log(fields); // fields contains extra meta data about results, if available
    // good for wanting to see what the table will ask for (id, name, password, etc.) and their
    // type.
    // const userID = 1;
    // const chatID = 3;
    // const newMessage = "Hello everyone, How's it going?";
    // await pool.query("UPDATE chatrooms SET message = ? WHERE userID = ? AND chatID = ?", [newMessage, userID, chatID]);
    // const classID = 1;
    // const userID = 11;
    // const timestamp = '2024-02-21T12:56:00.000Z';
    // const message = "Does anyone have the notes from today's class?";
    // await pool.query("INSERT INTO chatrooms (classID, timestamp, message, userID) VALUES (?, ?, ?, ?)", [classID, timestamp, message, userID]);
    // const userID = 11;
    // const [classData] = await pool.query
    // ("Select classes.classID, classes.className FROM classes INNER JOIN chatrooms ON classes.classID = chatrooms.classID INNER JOIN user ON user.userID = chatrooms.userID WHERE user.userID = ?", [userID]);
    // console.log(classData);
    // const userID = 11;
    // const [classData] = await pool.query
    // ("SELECT DISTINCT classes.classID, classes.className FROM classes INNER JOIN classList ON classes.classID = classList.classID INNER JOIN user ON user.userID = classList.userID WHERE user.userID = ?", [userID]);
    // console.log(classData);
  } catch (error) {
    console.error(error);
  }
}

queryDatabase(); // Call the function to query the database

// app.listen(3000, () => {
//   console.log("App listening on port 3000");
//   //console.log("Server is running on 3000");
// });
