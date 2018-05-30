const YT_SEARCH_URL = 'https://www.googleapis.com/youtube/v3/search';
const API_KEY = 'AIzaSyD7fadOdlYLbtAoWr8EqYzPpKMJS185u_c';

function getDataFromYtube(searchTerm, callback) {
  const settings = {
    url: YT_SEARCH_URL,
    data: {
      part: 'snippet',
      key: API_KEY,
      q: searchTerm,
      order: 'rating',
      maxResults: 10
    },
    success: callback
  };

  $.ajax(settings);
}

function renderResult(result) {
  return `
    <a href="https://youtu.be/${result.id.videoId}" target="_blank">
      <h3 class="no-underline">${result.snippet.title}</h3>
      <img src="${result.snippet.thumbnails.high.url}" alt="${result.snippet.description}">
      <p>${result.snippet.description}</p>
    </a>
  `;
}

function displayYtubeSearchData(data) {
  const results = data.items.map((item, index) => renderResult(item));
  $('.result').html(results);
  $('.results').removeClass('hidden');
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
