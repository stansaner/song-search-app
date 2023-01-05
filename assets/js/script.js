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
          console.log(data);
          return data;
        });
    });
  }
  
  getArtists();