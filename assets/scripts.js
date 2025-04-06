let allData = {};
const PER_PAGE = 6;

fetch("data/videos.json")
  .then(res => res.json())
  .then(data => {
    allData = data;
    const catList = document.getElementById("category-list");
    const videoList = document.getElementById("video-list");

    if (catList) {
      data.categories.forEach(cat => {
        const a = document.createElement("a");
        a.href = `category.html?slug=${cat.slug}`;
        a.textContent = cat.name;
        catList.appendChild(a);
      });
    }

    if (videoList && typeof slug !== "undefined") {
      renderVideos(data);
    }
  });

function renderVideos(data) {
  const videoList = document.getElementById("video-list");
  videoList.innerHTML = "";

  const selectedCat = data.categories.find(c => c.slug === slug);
  if (!selectedCat) return;

  const start = (page - 1) * PER_PAGE;
  const end = start + PER_PAGE;
  const videos = selectedCat.videos.slice(start, end);

  videos.forEach(video => {
    const div = document.createElement("div");
    div.className = "video-card";
    div.innerHTML = `
      <img src="${video.cover}" alt="${video.title}" />
      <div class="video-info">
        <h2>${video.title}</h2>
        <p><strong>上映时间:</strong> ${video.release}</p>
        <p><strong>演员:</strong> ${video.actors.join(", ")}</p>
        <p>${video.description}</p>
        <a class="episode-link" href="${video.url}" target="_blank">点击播放</a>
      </div>
    `;
    videoList.appendChild(div);
  });

  renderPagination(selectedCat.videos.length);
}

function renderPagination(total) {
  const pagination = document.getElementById("pagination");
  if (!pagination) return;

  const totalPages = Math.ceil(total / PER_PAGE);
  let html = "";
  for (let i = 1; i <= totalPages; i++) {
    html += `<a href="?slug=${slug}&page=${i}" style="margin-right:10px;">${i}</a>`;
  }
  pagination.innerHTML = html;
}

function searchVideos() {
  const keyword = document.getElementById("search-input").value.toLowerCase();
  const videoList = document.getElementById("video-list");
  if (!keyword || !allData.categories) return;

  videoList.innerHTML = "";

  allData.categories.forEach(cat => {
    cat.videos
      .filter(v => v.title.toLowerCase().includes(keyword))
      .forEach(video => {
        const div = document.createElement("div");
        div.className = "video-card";
        div.innerHTML = `
          <img src="${video.cover}" alt="${video.title}" />
          <div class="video-info">
            <h2>${video.title}</h2>
            <p><strong>上映时间:</strong> ${video.release}</p>
            <p><strong>演员:</strong> ${video.actors.join(", ")}</p>
            <p>${video.description}</p>
            <a class="episode-link" href="${video.url}" target="_blank">点击播放</a>
          </div>
        `;
        videoList.appendChild(div);
      });
  });
}
