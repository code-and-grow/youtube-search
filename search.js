const YT_SEARCH_URL = 'https://www.googleapis.com/youtube/v3/search';
const API_KEY = 'AIzaSyD7fadOdlYLbtAoWr8EqYzPpKMJS185u_c';
let nextPage;
let prevPage;
let queryTerm;

function getDataFromYtube(searchTerm, pageToken, callback) {
  const settings = {
    url: YT_SEARCH_URL,
    data: {
      part: 'snippet',
      key: API_KEY,
      q: searchTerm,
      type: 'video',
      order: 'viewCount',
      pageToken: pageToken
    },
    success: callback
  };
  queryTerm = searchTerm;
  $.ajax(settings);
}

function renderResult(result) {
  return `<a href="https://youtu.be/${result.id.videoId}" data-lity><h3 class="no-underline">${result.snippet.title}</h3><img src="${result.snippet.thumbnails.high.url}" alt="${result.snippet.description}"><p>${result.snippet.description}</p></a><p class="channel-link"><a href="https://www.youtube.com/channel/${result.snippet.channelId}" target="_blank">More from ${result.snippet.channelTitle}</a></p>`;
}

function displayYtubeSearchData(data) {

  $('#results').prop('hidden', false);

  const results = data.items.map((item, index) => renderResult(item));
  const totalResults = data.pageInfo.totalResults;

  function showResultsCount() {
    if (totalResults === 0) {
      return `No videos found. Try searching for something else.`;
    } else if (totalResults < 1000000 && totalResults >= 1) {
      return `Your search yielded ${totalResults} videos. Grab some popcorn!`;
    } else {
      return `Your search yielded over million videos. Got enough popcorn?`;
    }
  }
  
  $('.results').removeClass('hidden');
  $('.showResultsCount').html(showResultsCount);
  $('.result').html(results);
  if (totalResults > 0) {
    $('#h2-span').css('display', 'block').prop('hidden', false);
    pageNav(data);
  } else {
    $('#h2-span').css('display', 'none').prop('hidden', true);
    $('#navigation').css('display', 'none').prop('hidden', true);
  }
}

function watchSubmit() {
  $('#js-search-form').submit(event => {
    event.preventDefault();
    const queryTarget = $(event.currentTarget).find('#js-search-input');
    const query = queryTarget.val();
    // clear out the input
    queryTarget.val("");
    getDataFromYtube(query, undefined, displayYtubeSearchData);
  });
}

function watchPageToken() {
  $('.pagination').on('click', '#js-nextPage', (event) => {
    getDataFromYtube(queryTerm, nextPage, displayYtubeSearchData);
  });
  $('.pagination').on('click', '#js-prevPage', (event) => {
    getDataFromYtube(queryTerm, prevPage, displayYtubeSearchData);
  });
}

function pageNav(data) {
  nextPage = data.nextPageToken;
  prevPage = data.prevPageToken;
  if (prevPage) {
    $('div#prevPage').replaceWith(`<a href="#results" id='js-prevPage' value='Previous'>Previous page</a>`);
  }
  if (nextPage) {
    $('div#nextPage').replaceWith(`<a href="#results" id='js-nextPage' value='Next'>Next page</a>`);
  }
  $('#navigation').css('display', 'block').prop('hidden', false);
}


$(watchSubmit);
$(watchPageToken);
