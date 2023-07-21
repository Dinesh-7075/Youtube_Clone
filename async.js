const videoCardContainer = document.querySelector(".video-container");
const searchInput = document.querySelector(".search-bar");
const searchBtn = document.querySelector(".search-btn");
let searchLink = "https://www.youtube.com/results?search_query=";
const apiKey = "AIzaSyAzgqiEZ3qRGv5GuJ2KwWFEqdoRwv__KS0";
const base_URL = "https://www.googleapis.com/youtube/v3";
let video_http = `${base_URL}/videos?key=${apiKey}&part=snippet,statistics&chart=mostPopular&maxResults=50&regionCode=IN`;
let channel_http = `${base_URL}/channels?`;
const logo = document.querySelector(".logo");
const toggleLink = document.getElementById("toggle-link");
const sideBar = document.querySelector(".side-bar");
const toggleSideBar = document.querySelector(".toggle-side-barHidden");
toggleSideBar.style.visibility = "hidden";
const filters = document.querySelector(".filters");

// Hamburger Function
toggleLink.addEventListener("click", function () {
  if (toggleSideBar.style.visibility == "hidden") {
    filters.classList.remove("filters");
    filters.classList.add("toggled-filters");
    sideBar.style.visibility = "hidden";
    toggleSideBar.style.visibility = "visible";
    toggleSideBar.classList.add("toggle-side-bar");
    videoCardContainer.classList.remove("videoCardContainer");
    videoCardContainer.classList.add("toggled-video-container");
    console.log("inside if");
  } else {
    filters.classList.add("filters");
    filters.classList.remove("toggled-filters");
    sideBar.style.visibility = "visible";
    toggleSideBar.style.visibility = "hidden";
    toggleSideBar.classList.remove("toggle-side-bar");
    videoCardContainer.classList.add("videoCardContainer");
    videoCardContainer.classList.remove("toggled-video-container");
    console.log("inside else");
  }
});

//onClick Search function
searchBtn.addEventListener("click", (event) => {
  event.preventDefault();
  searchBtn.style.backgroundColor = "#afad98";
  let searchInput = document.getElementById("searchBoxValue");
  let searchString = searchInput.value;
  if (searchInput.value.length) {
    const searchEndpoint = `${base_URL}/search?key=${apiKey}&q=${searchString}&part=snippet&chart=mostPopular&type=video&maxResults=50&regionCode=IN`;
    console.log(searchString);
    console.log(searchEndpoint);
    videoCardContainer.innerHTML = "";
    async function fetchSearchedVideos() {
      try {
        const response = await fetch(searchEndpoint);
        const result = await response.json();
        console.log(result);
        result.items.forEach((item) => {
          getChannelIconForSearchedVideos(item);
        });
      } catch (error) {
        console.log(error.stack);
      }
    }
    // const endpoint = `${base_URL}/videos?key=${apiKey}&part=snippet,statistics&id=${videoId}`;

    const getChannelIconForSearchedVideos = (video_data) => {
      fetch(
        channel_http +
          new URLSearchParams({
            key: apiKey,
            part: "snippet,statistics",
            id: video_data.snippet.channelId,
          })
      )
        .then((res) => res.json())
        .then((data) => {
          video_data.channelThumbnail =
            data.items[0].snippet.thumbnails.default.url;
          makeVideoCardForSearchedString(video_data);
        });
    };
    fetchSearchedVideos();
  }

  const makeVideoCardForSearchedString = (data) => {
    let timeStamp = data.snippet.publishedAt;
    const publishedTime = convertTime(timeStamp);
    videoCardContainer.innerHTML += `
        <div class="video" onclick="openVideoDetails('${data.id}')">
            <img src="${data.snippet.thumbnails.high.url}" class="thumbnail" alt="">
            <div class="content">
                <img src="${data.channelThumbnail}" class="channel-icon" alt="">
                <div class="info">
                    <span class="title">${data.snippet.title}</span>
                    <p class="channel-name">${data.snippet.channelTitle}</p>
                    <p class="views">• ${publishedTime}</p>
                </div>
            </div>
        </div>
        `;
    console.log("Inside Make");
  };
});

// Home Page function for Youtube Logo
logo.addEventListener("click", () => {
  videoCardContainer.innerHTML = "";
  fetchVideos();
});

//Fetching Videos on Home page
async function fetchVideos() {
  try {
    const response = await fetch(video_http);
    const result = await response.json();
    console.log(result);
    result.items.forEach((item) => {
      getChannelIcon(item);
    });
  } catch (error) {
    console.log(error.stack);
  }
}
const getChannelIcon = (video_data) => {
  fetch(
    channel_http +
      new URLSearchParams({
        key: apiKey,
        part: "snippet",
        id: video_data.snippet.channelId,
      })
  )
    .then((res) => res.json())
    .then((data) => {
      video_data.channelThumbnail =
        data.items[0].snippet.thumbnails.default.url;
      makeVideoCard(video_data);
    });
};
fetchVideos();
const makeVideoCard = (data) => {
  let currViewCount = data.statistics.viewCount;
  let timeStamp = data.snippet.publishedAt;
  const publishedTime = convertTime(timeStamp);
  const formattedViewCount = formatNumber(currViewCount);
  videoCardContainer.innerHTML += `
    <div class="video" onclick="openVideoDetails('${data.id}')">
        <img src="${data.snippet.thumbnails.high.url}" class="thumbnail" alt="">
        <div class="content">
            <img src="${data.channelThumbnail}" class="channel-icon" alt="">
            <div class="info">
                <span class="title">${data.snippet.title}</span>
                <p class="channel-name">${data.snippet.channelTitle}</p>
                <p class="views">${formattedViewCount} views • ${publishedTime}</p>
            </div>
        </div>
    </div>
    `;
};

//Open YouTube Video function
function openVideoDetails(videoId) {
  localStorage.setItem("videoId", videoId);
  window.open("/videoDetails.html");
}

//Formatting the ViewsCount Number
function formatNumber(num, precision = 1) {
  const map = [
    { suffix: "T", threshold: 1e12 },
    { suffix: "B", threshold: 1e9 },
    { suffix: "M", threshold: 1e6 },
    { suffix: "K", threshold: 1e3 },
    { suffix: "", threshold: 1 },
  ];

  const found = map.find((x) => Math.abs(num) >= x.threshold);
  if (found) {
    const formatted = (num / found.threshold).toFixed(precision) + found.suffix;
    return formatted;
  } else {
    return num;
  }
}

//Converting Coordinated Universal Time(UTC) time
function convertTime(publishedDate) {
  let ytPublishedDate = new Date(publishedDate);
  let currDate = new Date();
  let difference = Math.floor(
    (currDate.getTime() - ytPublishedDate.getTime()) / (1000 * 3600 * 24)
  );
  if (difference == 1) {
    return difference + " day ago";
  } else if (difference > 0 && difference < 30) {
    return difference + " days ago";
  } else if (difference == 30 || difference == 31) {
    return "1 month ago";
  } else if (difference > 31 && difference < 365) {
    let difference = Math.abs(currDate.getMonth() - ytPublishedDate.getMonth());
    return difference + " months ago";
  } else if (difference == 365 || difference == 366) {
    return "1 year ago";
  } else if (difference > 366) {
    let difference = Math.floor(currDate.getYear() - ytPublishedDate.getYear());
    return difference + " years ago";
  } else {
    let difference = Math.abs(currDate.getHours() - ytPublishedDate.getHours());
    if (difference == 1) {
      return "1 hour ago";
    } else {
      return difference + " hours ago";
    }
  }
}
