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

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express(); // create application

// Set up session middleware
app.set('trust proxy', 1) // trust first proxy
app.use(
  session({
    secret: "your-secret-key", // Replace with a secret key for session encryption
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: false,
      // maxAge: 60000 // 1 min
    }
  })
);

//app.use(cors({ origin: "http://localhost:5173" }));
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());


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
      const [userData] = await pool.query("SELECT * FROM user WHERE user_id = ?", [userid]);
      if (userData.length === 1) {
        // User data found, send user information to the frontend
        res.json(userData);
      } else {
        // User not found in the database
        res.status(404).send("User not found");
      }
      // res.json(userid);
      //
      console.log('Current Session ID:', req.sessionID);
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

// retrieve username of current user in session
app.get("/username", async (req, res) => {
  try {
    // Check if user is authenticated by checking if user ID is stored in session
    // req.session.userid
    if (req.session && req.session.userid) {
      //console.log(req.session.userid);
      // User is authenticated, retrieve user ID from session
      const userid = req.session.userid;

      // Query the database to retrieve user information based on user ID
      const [userData] = await pool.query("SELECT username FROM user WHERE user_id = ?", [userid]);
      
      if (userData.length === 1) {
        const username = userData[0].username;
        // console.log("Username: ", username);
        // User data found, send user information to the frontend
        res.json({username: username});
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
    // Error occurred while fetching user information
    console.error("Error fetching user information:", error);
    res.status(500).send("Internal server error");
  }
});

// Updates user accounts from the user update page
app.post("/update-user-info", async (req, res) => {
  const { name, username, email } = req.body;
  
  try {
    // Check if user is authenticated by 
    //checking if user ID is stored in session
    if (req.session) {
      // User is authenticated, retrieve user ID from session
      const userId = req.session.userid;

      // Query the database to retrieve essential user information based on user ID
      const [userData] = await pool.query("SELECT name, username, email FROM user WHERE user_id = ?", [userId]);

      if (userData.length === 1) {
        // User data found, update user information based on input
        
        // Check if any new information is provided and not blank
        const updates = {};
        if (name) updates.name = name;
        if (username) updates.username = username;
        if (email) updates.email = email;

        // Check if provided email is valid
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (updates.email && !emailRegex.test(updates.email)) {
          return res.status(400).send("Invalid email format");
        }

        // Check if username or email already exists in the database
        const [existingUser] = await pool.query(
          "SELECT user_id FROM user WHERE (username = ? OR email = ?) AND user_id != ?",
          [updates.username, updates.email, userId]
        );
        // Check if the provided email or username matches 
        //the existing email or username of the user
        const [currentUser] = await pool.query(
          "SELECT user_id FROM user WHERE user_id = ? AND (username = ? OR email = ?)",
          [userId, username, email]
        );
        if (existingUser.length > 0) {
          return res.status(400).send("Username or email already exists. Please choose a different one.");
        }
        // Check if currentUser has any data, 
        //indicating that the provided email or username 
        //matches the existing email or username of the user
        if (currentUser.length > 0) {
          // Send a specific error message indicating that the user is attempting to update to an existing email or username
          return res.status(400).send("You cannot update to your own existing email or username.");
        }   

        // Update the user information in the database
        await pool.query("UPDATE user SET ? WHERE user_id = ?", [updates, userId]);

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
      const [userData] = await pool.query("SELECT password FROM user WHERE user_id = ?", [userId]);

      if (userData.length === 1) {
        // User data found, proceed with password update logic
        
        // Check if the old password matches the stored password hash
        const passwordMatch = await bcrypt.compare(oldPassword, userData[0].password);
        if (!passwordMatch) {
          return res.status(401).send("Old password is incorrect");
        }

        // console.log("New Password:", newPassword); //testing
        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10); // 10 is the number of salt rounds

        // Update the user's password hash in the database
        await pool.query("UPDATE user SET password = ? WHERE user_id = ?", [hashedPassword, userId]); 

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
  console.log(req.body.username);

  try {
    // Fetch user data (including hashed password) from the database based on username
    const [userData] = await pool.query(
      "SELECT * FROM user WHERE username = ?",
      [username]
    );

    if (userData.length === 0) {
      // Username not found
      res.send("Invalid username or password");
    } else {
      // Grabbing user info from User table
      const hashedPassword = userData[0].password; // grab hashed password
      const userid = userData[0].user_id; // grab userid
      const username = userData[0].username; // grab username
      const email = userData[0].email; // grab email

      // Compare the entered password with the hashed password from the database
      const passwordMatch = await bcrypt.compare(password, hashedPassword);

      if (passwordMatch) {
        //store userid in the session
        req.session.userid = userid; // this stores the userid in session
        req.session.username = username;
        // req.session.save();

        console.log('Session ID:', req.sessionID);

        // sends user info to the Frontend on submit
        res.send({ 
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
app.post("/create-account", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Check if the username or email already exists in the database
    const [existingUser] = await pool.query(
      "SELECT * FROM user WHERE username = ? OR email = ?",
      [username, email]
    );

    if (existingUser.length > 0) {
      // Username or email already exists, respond accordingly
      res.send(
        "Username or email already exists. Please choose a different one."
      );
    } else {
      // Check if the password meets the minimum length requirement
      if (password.length < 8) {
        res.send('Password must be at least 8 characters long.');
      } else {
        // Hash the password before storing it
        const hashedPassword = await bcrypt.hash(password, 10); // 10 is the number of salt rounds

        // Insert new user data (including the hashed password) into the database
        await pool.query(
          "INSERT INTO user (username, email, password) VALUES (?, ?, ?)",
          [username, email, hashedPassword]
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
    const [rows, fields] = await pool.query("SELECT * FROM user");
    console.log(rows); // rows contains rows returned by the server
    //console.log(fields); // fields contains extra meta data about results, if available
    // good for wanting to see what the table will ask for (id, name, password, etc.) and their
    // type.
  } catch (error) {
    console.error(error);
  }
}

queryDatabase(); // Call the function to query the database

app.listen(3000, () => {
  console.log("App listening on port 3000");
  //console.log("Server is running on 3000");
});
