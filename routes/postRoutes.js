// const User = require("../schemas/UserSchema");
var express = require("express");
var app = express();
// const bcrypt = require("bcrypt");
// const { redirect } = require("statuses");

app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.set("view engine", "pug");
app.set("views", "views");

app.get("/:id", (req, res, next) => {
  var payload = {
    pageTitle: "View post",
    userLoggedIn: req.session.user,
    userLoggInedJs: JSON.stringify(req.session.user),
    postId: req.params.id,
  };
  res.status(200).render("postPage", payload);
});

module.exports = app;
