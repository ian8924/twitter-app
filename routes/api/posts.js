var express = require("express");
var app = express();
const User = require("../../schemas/UserSchema");
const Post = require("../../schemas/PostSchema");

app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.get("/", (req, res, next) => {
  Post.find()
    .populate("postedBy")
    .sort({ createdAt: -1 })
    .then((results) => res.status(200).send(results))
    .catch((error) => {
      console.log(error);
      res.status(400);
    });
});

app.post("/", async (req, res, next) => {
  if (!req.body.content) {
    return res.sendStatus(400);
  }

  var postData = {
    content: req.body.content,
    postedBy: req.session.user,
  };

  Post.create(postData)
    .then(async (newPost) => {
      newPost = await User.populate(newPost, { path: "postedBy" });
      res.status(201).send(newPost);
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(400);
    });
});

app.put("/:id/likes", async (req, res, next) => {
  var postId = req.params.id;
  var userId = req.session.user._id;
  var isLiked =
    req.session.user.likes && req.session.user.likes.includes(postId);
  var option = isLiked ? "$pull" : "$addToSet";
  // insert user like
  req.session.user = await User.findByIdAndUpdate(
    userId,
    { [option]: { likes: postId } },
    { new: true }
  ).catch((error) => {
    console.log(error);
    res.sendStatus(400);
  });

  // insert post like
  var post = await Post.findByIdAndUpdate(
    postId,
    { [option]: { likes: userId } },
    { new: true }
  );
  res.status(200).send(post);
});

module.exports = app;
