const express = require("express");
const app = express();
const port = 3003;
const middleware = require("./middleware");
const path = require("path");
const mongoose = require("./database");
const session = require("express-session");

const server = app.listen(port, () => console.log("server listen on port " + port));

app.set("view engine", "pug");
app.set("views", "views");
app.use(express.static(path.join(__dirname, "public")));

app.use(
    session({
        secret: "bbq chips",
        resave: true,
        saveUninitialized: false,
    })
);

// Routes
const loginRoute = require("./routes/loginRoutes");
const registerRoute = require("./routes/registerRoutes");
const logoutRoute = require("./routes/logout");
const postRoute = require("./routes/postRoutes");
const profileRoute = require("./routes/profileRoutes");
const uploadRoutes = require("./routes/uploadRoutes");

// Api routes
const postsApiRoutes = require("./routes/api/posts");
const usersApiRoutes = require("./routes/api/users");

app.use("/login", loginRoute);
app.use("/register", registerRoute);
app.use("/posts", middleware.requireLogin, postRoute);
app.use("/logout", logoutRoute);
app.use("/profile", middleware.requireLogin, profileRoute);
app.use("/uploads", uploadRoutes);

// api
app.use("/api/posts", postsApiRoutes);
app.use("/api/users", usersApiRoutes);

app.get("/", middleware.requireLogin, (req, res, next) => {
    var payload = {
        pageTitle: "Home",
        userLoggedIn: req.session.user,
        userLoggInedJs: JSON.stringify(req.session.user),
    };
    res.status(200).render("Home", payload);
});
