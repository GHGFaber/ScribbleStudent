// Below are some iterations/different types of ways to query with mysql/mysql2
// First is doing a pool query outside of an async function
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// // import mysql from "mysql2";
// import { pool } from "./database.js";

// const app = express();

// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(200).send("hi");
//   res.status(500).send("No worky ):");
// });

// app.use(express.json());

// pool.query("SELECT * FROM `user`", function (err, results, fields) {
//   console.log(results); // results contains rows returned by server
//   console.log(fields); // fields contains extra meta data about results, if available
// });

// app.listen(3000, () => {
//   console.log("hello");
//   console.log("Server is running on 3000");
// });

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// explicit mysql connection
// not recommended as people can access our database. dummy parameters in place.
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// import mysql from "mysql";

// var connection = mysql.createConnection({
//   host: "database.ccgdkherrzsm.us-west-3.rds.amazonaws.com",
//   user: "joe",
//   password: "regular",
//   database: "regularjoe",
//   port: "3306",
// });

// connection.connect(function (err) {
//   if (err) throw err;
//   connection.query("SELECT * FROM user", function (err, result, fields) {
//     if (err) throw err;
//     console.log(result);
//   });
// });

import express from "express";
import { pool } from "./database.js"; // imported from our pool made and exportedin database.js

const app = express(); // create application

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(200).send("hi");
  res.status(500).send("No worky ):");
});

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

app.listen(3000, () => {
  console.log("hello");
  console.log("Server is running on 3000");
});
