var express = require("express");
var app = express();
const User = require("../../schemas/UserSchema");
const Post = require("../../schemas/PostSchema");
const session = require("express-session");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const upload = multer({ dest: "uploads/" });

app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.use(
    express.urlencoded({
        extended: true,
    })
);

app.put("/:userId/follow", async (req, res, next) => {
    let userId = req.params.userId;
    let user = await User.findById(userId);
    if (user === null) {
        return res.sendStatus(404);
    }

    var isFollowing = user.followers && user.followers.includes(req.session.user._id);
    var option = isFollowing ? "$pull" : "$addToSet";

    // insert user following
    req.session.user = await User.findByIdAndUpdate(req.session.user._id, { [option]: { following: userId } }, { new: true }).catch((error) => {
        console.log(error);
        res.sendStatus(400);
    });

    await User.findByIdAndUpdate(userId, {
        [option]: { followers: req.session.user._id },
    }).catch((error) => {
        console.log(error);
        res.sendStatus(400);
    });

    res.status(200).send(req.session.user);
});

app.get("/:userId/following", async (req, res, next) => {
    User.findById(req.params.userId)
        .populate("following")
        .then((results) => {
            res.status(200).send(results);
        })
        .catch((err) => {
            console.log(err);
            res.sendStatus(400);
        });
});

app.get("/:userId/followers", async (req, res, next) => {
    User.findById(req.params.userId)
        .populate("followers")
        .then((results) => {
            res.status(200).send(results);
        })
        .catch((err) => {
            console.log(err);
            res.sendStatus(400);
        });
});

app.post("/profilePicture", upload.single("croppedImage"), async (req, res, next) => {
    if (!req.file) {
        console.log("not get file");
        return res.sendStatus(400);
    }

    var filePath = `/uploads/images/${req.file.filename}.jpeg`;
    var tempPath = req.file.path;
    var targetPath = path.join(__dirname, `../../${filePath}`);

    fs.rename(tempPath, targetPath, async (err) => {
        if (err != null) {
            console.log(err);
            return res.sendStatus(400);
        }
        req.session.user = await User.findByIdAndUpdate(req.session.user._id, { profilePic: filePath }, { new: true });
        res.sendStatus(204);
    });
});

app.post("/coverPhoto", upload.single("croppedImage"), async (req, res, next) => {
    if (!req.file) {
        console.log("not get file");
        return res.sendStatus(400);
    }

    var filePath = `/uploads/images/${req.file.filename}.jpeg`;
    var tempPath = req.file.path;
    var targetPath = path.join(__dirname, `../../${filePath}`);

    fs.rename(tempPath, targetPath, async (err) => {
        if (err != null) {
            console.log(err);
            return res.sendStatus(400);
        }
        req.session.user = await User.findByIdAndUpdate(req.session.user._id, { coverPhoto: filePath }, { new: true });
        res.sendStatus(204);
    });
});

module.exports = app;
