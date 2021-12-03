$(document).ready(() => {
  let postId2 = postId;
  $.get("/api/posts/" + postId2, (results) => {
    outputPostsWithReplies(results, $(".postsContainer"));
  });
});
