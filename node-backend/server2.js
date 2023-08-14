const express = require("express");
const cors = require("cors");
const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const bcrypt = require("bcryptjs");
const saltRounds = 10;
var jwt = require("jsonwebtoken");
const secret = "zzz"; //รหัสของเราไว้ gen token

app.use(cors());

const mysql = require("mysql2");
const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "test_ttk",
});

//get all
app.get("/users", (req, res) => {
  con.query("SELECT * FROM users", function (err, result, fields) {
    if (err) throw err;
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

app.post("/register", (req, res) => {
  bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
    con.query(
      "INSERT INTO login (username, password) VALUES (?, ?)",
      [req.body.username, hash],
      function (err, results) {
        if (err) {
          res.json({ status: "error", message: err });
        } else {
          res.json({ status: "ok" });
        }
      }
    );
  });
});

app.post("/login", (req, res) => {
    con.query(
    "SELECT * FROM login WHERE username=? ",
    [req.body.username],
    function (err, results) {
      if (err) {
        res.json({ status: "error", message: err });
        return;
      }
      // check ว่าไม่มี user ใน DB
      if (results.length == 0) {
        res.json({ status: "error", message: "no user" });
        return;
      }

      //เปรียบเทียบ password ที่ใส่ตอน login กับ DB
      bcrypt.compare(
        req.body.password,
        results[0].password,
        function (err, isLogin) {
          if (isLogin) {
            let token = jwt.sign({ username: results[0].username }, secret, {
              expiresIn: "1h",
            });
            res.json({ status: "ok", message: "login success", token });
          } else {
            res.json({ status: "error", message: "login failed" });
          }
        }
      );
    }
  );
});

// check token ว่าถูกไหม
app.post("/authen", (req, res) => {
  try {
    const token = req.body.token;
    var decoded = jwt.verify(token, secret);
    res.json({ status: "ok", decoded });
  } catch (error) {
    res.json({ status: "error", message: error.message });
  }
});

app.listen(3000, () => {
  console.log("Start server at port 3000.");
});
