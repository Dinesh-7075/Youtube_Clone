const BASE_URL_1 = "https://www.googleapis.com/youtube/v3";
const API_KEY_1 = "AIzaSyAzgqiEZ3qRGv5GuJ2KwWFEqdoRwv__KS0";
const video_container = document.getElementById("yt-video");
const videoId = localStorage.getItem("videoId");
const commentsContainer = document.getElementById("comments");

video_container.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;

async function getComments() {
  const url = `${BASE_URL_1}/commentThreads?key=${API_KEY_1}&videoId=${videoId}&maxResults=80&order=time&part=snippet`;
  const response = await fetch(url, {
    method: "get",
  });
  const data = await response.json();
  console.log(data);
  const comments = data.items;
  renderComments(comments);
}

function renderComments(comments) {
  commentsContainer.innerHTML = "";
  comments.forEach((comment) => {
    commentsContainer.innerHTML += `
       <div id="comments-container" style="display:flex;">
        <div><img src="${comment.snippet.topLevelComment.snippet.authorProfileImageUrl}"></img></div>
        <div style="flex-direction:column">
        <b>${comment.snippet.topLevelComment.snippet.authorDisplayName}</b>
        <div><p>${comment.snippet.topLevelComment.snippet.textDisplay}</p></div>
        </div>
      </div>
    `;
  });
}

getComments();
