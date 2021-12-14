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
        var html = createUserHtml(result, true);
        container.append(html);
    });
    if (results.length == 0) {
        container.append("<span class='noResults'>NO RESULTS</span>");
    }
}

function createUserHtml(userData, showFollowButton) {
    let name = `${userData.firstName} ${userData.lastName}`;
    var followButton = "";
    var isFollowing = userLoggedIn.following && userLoggedIn.following.includes(userData._id);
    var text = isFollowing ? "Following" : "Follow";
    var buttonClass = isFollowing ? "followButton following" : "followButton";

    if (showFollowButton && userLoggedIn._id != userData._id) {
        followButton = `<div class="followButtonContainer">
                          <button class="${buttonClass}" data-user="${userData._id}" >${text}</button>
                        </div>
        
        `;
    }

    return `<div class='user'>
                <div class='userImageContainer'>
                    <img src='${userData.profilePic}'>
                </div>
                <div class='userDetailsContainer'>
                    <div class='header'>
                        <a href='/profile/${userData.username}'>${name}</a>
                        <span class='username'>@${userData.username}
                    </div>
                    ${followButton}
                </div>
                `;
}
