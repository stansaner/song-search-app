var clientId = '3903dc1b09cd47ae8c1bfb4990969b30';
var clientSecret = '1ec45ae9502c46db84bf1df9f682dd3e';
var postBody = {'grant_type': 'client_credentials'};
var urlencoded = new URLSearchParams();
urlencoded.append("grant_type", "client_credentials");
urlencoded.append("client_id", "3903dc1b09cd47ae8c1bfb4990969b30");
urlencoded.append("client_secret", "1ec45ae9502c46db84bf1df9f682dd3e");




// fetch('https://accounts.spotify.com/api/token', {
//     method: 'POST',
//     headers: {
//         'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
//       },
//     body: urlencoded
// }).then((response) => {
//     return response.json()
// }).then((data) => {
//     console.log(data);
// })


function getQRCode(){
  var data = "https://api-ninjas.com";
  var fmt = "png";
  $.ajax({
    method: "GET",
    url: "https://api.api-ninjas.com/v1/qrcode?data=" + data + "&format=" + fmt,
    headers: {
      "X-Api-Key": "ZdYI+Lj/vMMSzi+ktewh/w==89dSZH02W3eHyFfr",
      Accept: "image/png",
    },
    contentType: "application/json",
    success: function (result) {
      console.log('QR result', result);
    },
    error: function ajaxError(jqXHR) {
      console.error("Error: ", jqXHR.responseText);
    },
  });
}


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

  
function getTracks(id, token) {
    var artistID = id;
    fetch(`https://api.spotify.com/v1/artists/${artistID}/top-tracks?market=GB`, {
      method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
    }).then(function(response) {
      return response.json();
    }).then(function(data) {
      console.log('get tracks', data);

      console.log('get image', data.tracks[0].album.images[1]);

      // For loop starts here:

      return data;
    })
}
  

function getArtists() {
    var artist = "drake";
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
          console.log('get artists', data);

          console.log('id', data.artists.items[0].id);
          var artistNameID = data.artists.items[0].id;


          console.log('name', data.artists.items[0].name);


          // return data;

          getTracks(artistNameID, token);
        });
    });
}
  
getArtists();

getQRCode();




// Get info:
// data.tracks[0].album.images[1] OR data.tracks.0.album.images[1]
// 



/////qr-code  //
//https://api-ninjas.com/api/qrcode////
// var data = "https://api-ninjas.com";
// var fmt = "jpg";
// $.ajax({
//   method: "GET",
//   url: "https://api.api-ninjas.com/v1/qrcode?data=" + data + "&format=" + fmt,
//   headers: {
//     "X-Api-Key": "ZdYI+Lj/vMMSzi+ktewh/w==89dSZH02W3eHyFfr",
//     Accept: "image/png",
//   },
//   contentType: "application/json",
//   success: function (result) {
//     console.log(result);
//   },
//   error: function ajaxError(jqXHR) {
//     console.error("Error: ", jqXHR.responseText);
//   },
// });