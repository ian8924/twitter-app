const User = require("../schemas/UserSchema");
var express = require("express");
const { findOne } = require("../schemas/UserSchema");
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

app.get("/", async (req, res, next) => {
  let payload = await getUser(req.session.user.username, req.session.user);
  res.status(200).render("profilePage", payload);
});

app.get("/:username", async (req, res, next) => {
  let payload = await getUser(req.params.username, req.session.user);
  res.status(200).render("profilePage", payload);
});

app.get("/:username/replies", async (req, res, next) => {
  let payload = await getUser(req.params.username, req.session.user);
  payload.selectedTab = "replies";
  res.status(200).render("profilePage", payload);
});

app.get("/:username/following", async (req, res, next) => {
  let payload = await getUser(req.params.username, req.session.user);
  payload.selectedTab = "following";
  res.status(200).render("followersAndFollowing", payload);
});

app.get("/:username/followers", async (req, res, next) => {
  let payload = await getUser(req.params.username, req.session.user);
  payload.selectedTab = "followers";
  res.status(200).render("followersAndFollowing", payload);
});

async function getUser(username, userLoggedIn) {
  var userFind = await User.findOne({ username: username });

  if (userFind == null) {
    // userFind = await User.findById(username);
    // if (userFind == null) {
    return {
      pageTitle: "User not found!",
      userLoggedIn: userLoggedIn,
      userLoggInedJs: JSON.stringify(userLoggedIn),
    };
    // }
  }
  return {
    pageTitle: userFind.username,
    userLoggedIn: userLoggedIn,
    userLoggInedJs: JSON.stringify(userLoggedIn),
    profileUser: userFind,
  };
}

module.exports = app;
