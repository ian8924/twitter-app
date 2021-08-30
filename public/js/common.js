$("#postTextarea").keyup((event) => {
  var textbox = $(event.target);
  var value = textbox.val().trim();
  var submitButton = $("#submitPostButton");
  if (submitButton.length === 0) return alert("no submit button found");
  if (value === "") {
    submitButton.prop("disabled", true);
    return;
  }
  submitButton.prop("disabled", false);
});

$("#submitPostButton").click(() => {
  var textbox = $("#postTextarea");
  var button = $(event.target);

  var data = {
    content: textbox.val(),
  };

  $.post("/api/posts", data, (postData) => {
    console.log(postData);
    var html = createPostHtml(postData);
    $(".postsContainer").prepend(html);
    textbox.val("");
    button.prop("disabled", true);
  });
});

function createPostHtml(postData) {
  console.log(postData);
  var postedBy = postData.postedBy;
  var displayNmae = `${postedBy.firstName} ${postedBy.lastName}`;
  var datetamp = postedBy.createdAt;
  return `<div class='post'>
                <div class='mainContentContainer'>
                    <div class='userImageContainer'>
                        <img src='${postedBy.profilePic}' >
                    </div>
                    <div class='postContentContainer'>
                        <div class='header'>
                            <a href='/profile/${postedBy.username}'>${displayNmae}</a>
                            <span class="username">@${postedBy.username}</span>
                            <span class="date">${datetamp}</span>
                        </div>
                        <div class='postBody'>
                            <span>${postData.content}</span>
                        </div>
                        <div class='postFooter'>
                            <div class='postButtonContainer'>
                                <button>
                                    <i class="far fa-comment"></i>
                                </button>
                            </div>
                            <div class='postButtonContainer'>
                                <button>
                                    <i class="fas fa-retweet"></i>
                                </button>
                            </div>
                            <div class='postButtonContainer'>
                                <button>
                                    <i class="far fa-heart"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`;
}
