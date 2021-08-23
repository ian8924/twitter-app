const User = require("../schemas/UserSchema");
var express = require("express");
var app = express();
const bcrypt = require("bcrypt");
const { redirect } = require("statuses");

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
  res.status(200).render("login");
});

app.post("/", async (req, res, next) => {
  var user = req.body;
  var payload = {};

  if (req.body.loginUsername && req.body.loginPassword) {
    var user = await User.findOne({
      $or: [
        { username: req.body.loginUsername },
        { email: req.body.loginUsername },
      ],
    }).catch((error) => {
      payload.errorMessage = "Something went wrong.";
      res.status(200).render("login", payload);
    });

    if (user != null) {
      var result = await bcrypt.compare(req.body.loginPassword, user.password);
      if (result) {
        req.session.user = user;
        return res.redirect("/");
      }
    }

    payload.errorMessage = "登入驗證錯誤";
    return res.status(200).render("login", payload);
  }

  payload.errorMessage = "請確認輸入值有效";
  res.status(200).render("login");
});

module.exports = app;
