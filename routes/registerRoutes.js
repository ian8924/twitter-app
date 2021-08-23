const e = require("express");
const bcrypt = require("bcrypt");

const User = require("../schemas/UserSchema");

var express = require("express");
var app = express();

app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.set("view engine", "pug");
app.set("views", "views");

app.get("/", (req, res, next) => {
  res.status(200).render("register");
});

app.post("/", async (req, res, next) => {
  var firstName = req.body.firstName.trim();
  var lastName = req.body.lastName.trim();
  var username = req.body.username.trim();
  var email = req.body.email.trim();
  var password = req.body.password.trim();
  var payload = req.body;
  console.log(req.body);

  if (firstName && lastName && username && email && password) {
    var user = await User.findOne({
      $or: [{ username: username }, { email: email }],
    }).catch((error) => {
      console.log(error);
      payload.errorMessage = "Something went wrong.";
      res.status(200).render("register", payload);
    });

    console.log(user);

    if (user === null) {
      // no user found
      var data = req.body;

      data.password = await bcrypt.hash(password, 10);
      User.create(data).then((user) => {
        console.log(user);
        req.session.user = user;
        return res.redirect("/");
      });
    } else {
      // user found
      if (email === user.email) {
        payload.errorMessage = "Email already use.";
      } else {
        payload.errorMessage = "username already use.";
      }
      res.status(200).render("register", payload);
    }
  } else {
    payload.errorMessage = "Make sure each field has a valid value.";
    res.status(200).render("register", payload);
  }
});

module.exports = app;
