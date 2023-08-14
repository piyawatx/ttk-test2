const express = require("express");
const cors = require("cors");
const app = express();
const users = require("./db");
const bodyParser = require("body-parser");

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hello World");
});
// app.get("/users", (req, res) => {
//   res.json(users);
// });

// app.get("/users/:id", (req, res) => {
//   res.json(users.find((user) => user.id === req.params.id));
// });

// app.post("/users", (req, res) => {
//   console.log('backend ',req.body);
//   users.push(req.body);
//   res.status(201).json(req.body);
// });
// app.put("/users/:id", (req, res) => {
//   const updateIndex = users.findIndex((user) => user.id === req.params.id);
//   res.json(Object.assign(users[updateIndex], req.body));
// });
// app.delete("/users/:id", (req, res) => {
//   const deletedIndex = users.findIndex((user) => user.id === req.params.id);
//   users.splice(deletedIndex, 1);
//   res.status(204).send();
// });

const mysql = require("mysql");
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "test_ttk",
});

con.connect(function (err) {
  if (err) throw err;

  //get all
  app.get("/users", (req, res) => {
    con.query("SELECT * FROM users", function (err, result, fields) {
      if (err) throw err;
      // console.log(result);
      res.json(result);
    });
  });

  // get by id
  app.get("/users/:id", (req, res) => {
    con.query(
      "SELECT * FROM users WHERE id =" + req.params.id,
      function (err, result, fields) {
        if (err) throw err;
        console.log(result);
        res.json(result[0]);
      }
    );
  });

  //create
  app.post("/users", (req, res) => {
    let user = req.body;
    var sql = "INSERT INTO users (name, email) VALUES (?, ?)";
    con.query(sql, [user.name, user.email], function (err, result) {
      if (err) {
        throw err;
      } else {
        console.log("1 record inserted");
        res.status(201).json(req.body);
      }
    });
  });

  //update
  app.put("/users", (req, res) => {
    let user = req.body;
    var sql = "UPDATE users SET name = ?, email = ? WHERE id = ?";
    con.query(sql, [user.name, user.email, user.id], function (err, result) {
      if (err) {
        throw err;
      } else {
        console.log("Updated ", user);
        res.status(200).json(req.body);
      }
    });
  });

  //delete
  app.delete("/users/:id", (req, res) => {
    var sql = "DELETE FROM users WHERE id = ?";
    con.query(sql, [req.params.id], function (err, result) {
      if (err) {
        throw err;
      } else {
        console.log("Deleted : ", req.params.id);
        res.status(204).send();
      }
    });
  });
});

app.listen(3000, () => {
  console.log("Start server at port 3000.");
});
