$(document).ready(() => {
  loadfollow();
});

function loadfollow() {
  $.get(`/api/users/${profileUserId}/${selectedTab}`, (results) => {
    outputUsers(results[selectedTab], $(".resultsContainer"));
  });
}

function outputUsers(results, container) {
  container.html("");
  results.forEach((result) => {
    console.log(result.firstName);
    var html = createUserHtml(result, true);
    container.append(html);
  });
  if (results.length == 0) {
    container.append("<span class='noResults'>NO RESULTS</span>");
  }
}

function createUserHtml(userData, showFollowButton) {
  let name = `${userData.firstName} ${userData.lastName}`;
  return `<div class='user'>
                <div class='userImageContainer'>
                    <img src='${userData.profilePic}'>
                </div>
                <div class='userDetailsContainer'>
                    <div class='header'>
                        <a href='/profile/${userData.username}'>${name}</a>
                        <span class='username'>@${userData.username}
                    </div>
                </div>
                `;
}
