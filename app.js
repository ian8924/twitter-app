const express = require("express");
const app = express();
const port = 3003;
const middleware = require("./middleware");

const server = app.listen(port, () =>
  console.log("server listen on port" + port)
);

app.set("view engine", "pug");
app.set("views", "views");

//Routes
const loginRoutes = require("./routes/loginRoutes");
app.use("/login", loginRoutes);

app.get("/", middleware.requireLogin, (req, res, next) => {
  var payload = {
    pageTitle: "home",
  };
  res.status(200).render("home", payload);
});

// app.get("/login", middleware.requireLogin, (req, res, next) => {
//   var payload = {
//     pageTitle: "login",
//   };

//   res.status(200).render("login", payload);
// });
