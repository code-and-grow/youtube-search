const YT_SEARCH_URL = 'https://www.googleapis.com/youtube/v3/search';
const API_KEY = 'AIzaSyD7fadOdlYLbtAoWr8EqYzPpKMJS185u_c';

function getDataFromYtube(searchTerm, callback) {
  const settings = {
    url: YT_SEARCH_URL,
    data: {
      part: 'snippet',
      key: API_KEY,
      q: searchTerm,
      order: 'viewCount',
      maxResults: 10
    },
    success: callback
  };

  $.ajax(settings);
}

function renderResult(result) {
  console.log(result);
  return `
    <a href="https://youtu.be/${result.id.videoId}" target="_blank">
      <h3 class="no-underline">${result.snippet.title}</h3>
      <img src="${result.snippet.thumbnails.high.url}" alt="${result.snippet.description}">
      <p>${result.snippet.description}</p>
    </a>
    <p class="channel-link"><a href="https://www.youtube.com/channel/${result.snippet.channelId}" target="_blank">>>> More from ${result.snippet.channelTitle}</a></p>
  `;
}

function displayYtubeSearchData(data) {
  const results = data.items.map((item, index) => renderResult(item));
  $('.results').removeClass('hidden');
  $('.result').html(results);
}

function watchSubmit() {
  $('#js-search-form').submit(event => {
    event.preventDefault();
    const queryTarget = $(event.currentTarget).find('#js-search-input');
    const query = queryTarget.val();
    // clear out the input
    queryTarget.val("");
    getDataFromYtube(query, displayYtubeSearchData);
  });
}

$(watchSubmit);
