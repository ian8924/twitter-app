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

app.get("/", async (req, res, next) => {
    var searchObj = req.query;

    if (searchObj.isReply !== undefined) {
        var isReply = searchObj.isReply == "true";
        searchObj.replyTo = { $exists: isReply };
        delete searchObj.isReply;
    }

    if (searchObj.followingOnly !== undefined) {
        var followingOnly = searchObj.followingOnly === "true";
        if (followingOnly) {
            var objectIds = [...req.session.user.following];
            objectIds.push(req.session.user._id);
            searchObj.postedBy = { $in: objectIds };
        }
        delete searchObj.followingOnly;
    }
    var results = await getPosts(searchObj);
    res.status(200).send(results);
});

app.get("/:id", async (req, res, next) => {
    var postId = req.params.id;
    var postData = await getPosts({ _id: postId });
    postData = postData[0];

    var results = {
        postData,
    };

    if (postData.replyTo !== undefined) {
        results.replyTo = postData.replyTo;
    }

    results.replies = await getPosts({ replyTo: postId });

    return res.status(200).send(results);
});

app.post("/", async (req, res, next) => {
    if (!req.body.content) {
        return res.sendStatus(400);
    }

    var postData = {
        content: req.body.content,
        postedBy: req.session.user,
    };

    if (req.body.replyTo) {
        postData.replyTo = req.body.replyTo;
    }

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
    var isLiked = req.session.user.likes && req.session.user.likes.includes(postId);
    var option = isLiked ? "$pull" : "$addToSet";
    // insert user like
    req.session.user = await User.findByIdAndUpdate(userId, { [option]: { likes: postId } }, { new: true }).catch((error) => {
        console.log(error);
        res.sendStatus(400);
    });

    // insert post like
    var post = await Post.findByIdAndUpdate(postId, { [option]: { likes: userId } }, { new: true });
    res.status(200).send(post);
});

app.post("/:id/retweet", async (req, res, next) => {
    var postId = req.params.id;
    var userId = req.session.user._id;
    // Try and delete retweet
    var deletePost = await Post.findOneAndDelete({
        postedBy: userId,
        retweetData: postId,
    }).catch((error) => {
        console.log(error);
        res.sendStatus(400);
    });

    var option = deletePost !== null ? "$pull" : "$addToSet";

    var repost = deletePost;

    if (repost == null) {
        repost = await Post.create({ postedBy: userId, retweetData: postId }).catch((error) => {
            res.sendStatus(400);
        });
    }

    // insert user retweets
    req.session.user = await User.findByIdAndUpdate(userId, { [option]: { retweets: repost._id } }, { new: true }).catch((error) => {
        res.sendStatus(400);
    });

    // insert post retweetUsers
    var post = await Post.findByIdAndUpdate(postId, { [option]: { retweetUsers: userId } }, { new: true }).catch((error) => {
        console.log(error);
        res.sendStatus(400);
    });
    res.status(200).send(post);
});

app.delete("/:id", (req, res, next) => {
    Post.findByIdAndDelete(req.params.id)
        .then(() => res.sendStatus(202))
        .catch(() => res.sendStatus(400));
});

async function getPosts(filter) {
    var results = await Post.find(filter)
        .populate("retweetData")
        .populate("postedBy")
        .populate("replyTo")
        .sort({ createdAt: -1 })
        .catch((error) => {
            console.log(error);
        });
    results = await User.populate(results, { path: "replyTo.postedBy" });
    return User.populate(results, { path: "retweetData.postedBy" });
}

module.exports = app;
