var clientId = "3903dc1b09cd47ae8c1bfb4990969b30";
var clientSecret = "1ec45ae9502c46db84bf1df9f682dd3e";
var postBody = { grant_type: "client_credentials" };
var urlencoded = new URLSearchParams();
urlencoded.append("grant_type", "client_credentials");
urlencoded.append("client_id", "3903dc1b09cd47ae8c1bfb4990969b30");
urlencoded.append("client_secret", "1ec45ae9502c46db84bf1df9f682dd3e");
var searchInput = $(".form-input");
var searchButton = $(".search-button");
var jumbotron = $("#display-artist");
var displayCards = $("#display-songs");
var songHeading = $(".song-heading");
var localStorageArray = [];
var searchHistorySection = $('#search-history');
var clearButton = $('#clear-button');


// Adding the option to clear search history
function clearPreviousSearch() {
  localStorage.removeItem('artist');
  searchHistorySection.empty();
}


// This function will bring up a QR code which will link to a google search
// of the artist as per user input
function getQRCode(artistName) {
  var data = artistName;
  var fmt = "png";
  $.ajax({
    method: "GET",
    url: "https://api.api-ninjas.com/v1/qrcode?data=" + data + "&format=" + fmt,
    headers: { "X-Api-Key": "ZdYI+Lj/vMMSzi+ktewh/w==89dSZH02W3eHyFfr" },
    contentType: "application/json",
    success: function (result) {
      // console.log("test", result);

      var qrCode = $(".qr-code");

      qrCode.append(`
            <div class="flex align-items-center">
               <p class="qr-code"><img src="data:image/png;base64,${result}" alt="QR code" /></p>
               <p class="qr-text text-center">Scan for more info about ${artistName}</p>
            </div> 
            `);
    },
    error: function ajaxError(jqXHR) {
      console.error("Error: ", jqXHR.responseText);
    },
  });
}

// This is to get the access token needed to grab the data for the two api's
function getAccessToken() {
  return fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
    },
    body: urlencoded,
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      return data.access_token;
    });
}

// using the artist id to get the top tracks
function getTracks(id, token, artistName) {
  var artistID = id;
  displayCards.html("");
  fetch(`https://api.spotify.com/v1/artists/${artistID}/top-tracks?market=GB`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log("get tracks", data);

      
      // songHeading.prepend(`
     
      // <h3 class="d-flex flex-wrap">Top Tracks</h3>

      // `);
      // For loop starts here:
      var trackArray = data.tracks;
      // console.log('track array', trackArray);

      for (var track = 0; track < trackArray.length; track++) {
        var trackImage = data.tracks[track].album.images[1].url;
        console.log("get image", data.tracks[track].album.images[1]);

        var trackAlbum = data.tracks[track].album.name;
        console.log("album name", data.tracks[track].album.name);

        var trackName = data.tracks[track].name;
        console.log("song name", data.tracks[track].name);

        var previewURL = data.tracks[track].preview_url;
        console.log("song id", data.tracks[track].preview_url);

        var fullSong = data.tracks[track].uri;
        console.log("full song", fullSong);

        displayCards.append(`
        <div class="container-card card shadow=lg p-3 rb-5 rounded col-3"
          <div class="song-card row">
          <img class="song-image card-img-top" src="${trackImage}">
          <div class="card-body">
            <h3>${trackName}</h3>
            <p>Album: ${trackAlbum}</p>
            <a class="btn btn-dark" href="${previewURL}" target="_blank">Preview Song</a>
            <a class="btn btn-dark" href="${fullSong}" target="_blank"> Listen on Spotify</a>
          </div>
        </div> 
        `);
      }

      getQRCode(artistName);
      return data;
    });
}


// Function to add search input to local storage
function addToSearchHistory(artist) {
  var searchHistory = searchInput.val().toLowerCase().trim(); // Getting the searched artist from the search input

  if (searchHistory == '') {
    return;
  }

  //If search input is already in the array, don't add again
  //Without this we get duplicate results
  if (localStorageArray.indexOf(searchHistory) > -1) {
    return;
  }
  console.log('check if adding artist', searchHistory);
  // Checking to see if the searched artist is already stored in localStorage
  // Object {Key: artist, Value: search input string}
  if (localStorage.getItem('artist') == null) {
    localStorageArray.push(searchHistory); //pushing searched term into the array

  } else {
    localStorageArray = JSON.parse(localStorage.getItem('artist'));

    //Checking if keyword doesn't already exist in array, if not then pushing it through
    if(localStorageArray.indexOf(searchHistory) === -1) {
      localStorageArray.push(searchHistory);
    }
  }

  //Adding the searched term as a button in search history
  searchHistorySection.append(`
  <button data-artist="${artist}" type="button" class="artist-history btn btn-dark btn-block">${artist}</button>
  `);

  //Stringifying searched terms array into a string
  localStorage.setItem('artist', JSON.stringify(localStorageArray));
}

function getPreviouslySearchedTermsFromLocalStorage() {
  //If statement to check whether array already exists in localStorage, if it does, then parse it back into an array
  if (localStorage.getItem('artist') != null) {
      localStorageArray = JSON.parse(localStorage.getItem('artist'));

      //Using a for loop to add all previous searched terms as buttons
      for (var i = 0; i < localStorageArray.length; i++) {
          var singer = localStorageArray[i];

          searchHistorySection.append(`
              <button data-artist="${singer}" type="button" class="artist-history btn btn-dark btn-block">${singer}</button>
          `)
      }
  }
  recallArtist();
};

//Creating click event for all search history buttons inside #history div
function recallArtist() {
  $('.artist-history').on('click', function () {
      searchInput.val($(this).data('artist')); //repopulating searchInput using data-location attribute

      //Removing and adding classes to change the highlighted button colours when selected
      $('.artist-history').removeClass('btn-info').addClass('btn-dark');
      $(this).removeClass('btn-dark').addClass('btn-info');
      getArtists();
  });
}



// 2 step process
// Step 1: obtain artist id
// Step 2: use artist id to get top tracks for the searched artist
// this will allow us to grab the artist id
function getArtists(event) {
  var artist = "";


  // var keyCode = event.keyCode;
  console.log("event", event);
  var artist = searchInput.val().trim();
  console.log("search input", artist);
  jumbotron.html("");

  if (artist) {
    getAccessToken().then((token) => {
      fetch(`https://api.spotify.com/v1/search?q=${artist}&type=artist`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
        .then(function (response) {
          return response.json();
        })
        .then(function (data) {
          console.log("get artists", data);

          console.log("id", data.artists.items[0].id);
          var artistNameID = data.artists.items[0].id;

          console.log("name", data.artists.items[0].name);

          var artistImage = data.artists.items[0].images[1].url;
          console.log("artist image", artistImage);

          var genre = data.artists.items[0].genres[0];
          console.log("genre", genre);

          //Add artist name, genre and image in jumbotron
          jumbotron.append(`
          <div class="mt-3 jumbotron jumbotron-fluid p-4 col-12 flex row">
            <div class="col-6">
              <h1 class="display-4 row">${artist}</h1>
              <p><img class="row artist-image" src=${artistImage}></p>
              <p class="row artist-genre">${genre}</p>
            </div>
            <div class="qr-code col-6">
            </div>
          </div>
          <div>
            <h3 class="d-flex flex-wrap">Top Tracks</h3>
          </div>
          `);

          addToSearchHistory(artist);
          getTracks(artistNameID, token, artist);
        });
    });
  }
}

function init() {
  // searchInput.keydown(getArtists);
  searchButton.click(getArtists);
  clearButton.click(clearPreviousSearch);
  searchHistorySection.click(recallArtist);
  console.log("start point");

  
}

init();

