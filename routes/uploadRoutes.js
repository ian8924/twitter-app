var express = require("express");
var app = express();
const path = require("path");

app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.use(
    express.urlencoded({
        extended: true,
    })
);

app.set("view engine", "pug");
app.set("views", "views");

app.get("/images/:path", async (req, res, next) => {
    res.sendFile(path.join(__dirname, "../uploads/images/" + req.params.path));
});

module.exports = app;
