$(document).ready(() => {
  loadPosts();
});

function loadPosts() {
  $.get(
    "/api/posts",
    { postedBy: profileUserId, isReply: selectedTab == "replies" },
    (results) => {
      outputPosts(results, $(".postsContainer"));
    }
  );
}
