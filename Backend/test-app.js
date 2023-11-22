// Below are some iterations/different types of ways to query with mysql/mysql2
// First is doing a pool query outside of an async function
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

//--------------------------------
// TEST APP - by Spencer
//--------------------------------

import express from "express";
//const express = require('express'); //testing something
import { pool } from "./database.js"; // imported from our pool made and exportedin database.js
// Import variables from front end that are holding username and password
import bodyParser from "body-parser";
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


const app = express(); // create application

// Global variable for login username and password



app.use(bodyParser.urlencoded({ extended: true}));


app.get('/login', (req, res) => {
  const htmlPath = path.join(__dirname, 'public/index.html');
  res.sendFile(htmlPath);
});


app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  global.username = username;
  global.password = password;

  console.log('Username:', username);
  console.log('Password:', password);
  console.log('Request Body:', req.body);

  try {
    const [rows, fields] = await pool.query("SELECT * FROM user WHERE username = ? AND password=?", [username, password]);

    if (rows.length > 0) {
      res.send('Login successful');
    }
    else {
      res.send('Invalid username or password');
    }
  } catch (error) {
    res.status(500).send('Error checking username');
    console.error(error);
  }

  // perform actions with username and password
  // (This res was trying to send when the other res had already sent causing
  // a 'ERR_HTTP_HEADERS_SENT' error)
  //res.send('Received Username: ' + username + ' and Password: ' + password);
});



// Grab html from public folder
// Path needs to lead to public directory
// to fetch html
// main html file had to be named index or else would get "cannot GET"
app.use(express.static('public'));


// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(200).send("hi");
//   res.status(500).send("No worky ):");
// });

app.use(express.json());

// Use async/await with the promise-based query
async function queryDatabase() {
  try {
    const [rows, fields] = await pool.query("SELECT * FROM user");
    console.log(rows); // rows contains rows returned by the server
    // console.log(fields); // fields contains extra meta data about results, if available
    // good for wanting to see what the table will ask for (id, name, password, etc.) and their
    // type.

  } catch (error) {
    console.error(error);
  }
}

queryDatabase(); // Call the function to query the database

// Want to type in username and password into html form
// and display what's being input


app.listen(3000, () => {
  console.log("App listening on port 3000");
  //console.log("Server is running on 3000");
});


