const uri = "https://data.cityofnewyork.us/resource/43nn-pn8j.json?dba=";
//fetch api
function fetchRestaurant(restaurantName) {
  fetch(`${uri}${restaurantName}`)
    .then((response) => response.json())
    .then((data) => {
      console.log("Success:", data);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}
//geolocation
navigator.geolocation.getCurrentPosition(
  function (position) {
    let y = position.coords.latitude;
    let x = position.coords.longitude;
    console.log(position);
    console.log(y, x);
    // initMap(position);
    initMap(y, x);
    //use geolocation coords when available
  },
  function () {
    alert("Browser Location denied!");
    initMap(40.70521, -74.013757);
  }
);
// if ("geolocation" in navigator) {
//   navigator.geolocation.getCurrentPosition((position) => {
//     let y = position.coords.latitude;
//     let x = position.coords.longitude;
//     console.log(position);
//     console.log(y, x);
//     // initMap(position);
//     initMap(y, x);
//     //use geolocation coords when available
//   });
// } else {
//   alert("please enable browser location!");
//   //use FLAT IRON SCHOOL coordinates as default if geolocation not available
// }

//google maps initial load
function initMap(y, x) {
  //Map options
  console.log(y, x);
  let options = {
    zoom: 15,
    center: { lat: y, lng: x },
  };
  //new map
  let map = new google.maps.Map(document.getElementById("map"), options);
  //map options
  let marker = new google.maps.Marker({
    position: { lat: y, lng: x },
    draggable: true,
    animation: google.maps.Animation.DROP,
    map: map,
    icon: "https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png",
  });
  function toggleBounce() {
    if (marker.getAnimation() !== null) {
      marker.setAnimation(null);
    } else {
      marker.setAnimation(google.maps.Animation.BOUNCE);
    }
  }
}

let markers = []; //insert search query coords and content
//loop through markers
for (let i = 0; i < markers.length; i++) {
  addMarker(markers[i]);
}

//add markers for selected restaurant
function addMarker(coords) {
  let marker = new google.maps.Marker({
    position: coords,
    map: map,
  });
}
//////////////////////////////////////////////////////////////////////////////////////////////
//search bar -->

function searchRestaurant() {
  console.log(document.querySelector("#search-bar").value.toUpperCase());
  // fetchRestaurant(document.querySelector("#search-bar").value.toUpperCase());
}

document.querySelector("#search-button").addEventListener("click", function () {
  console.log("clicked");
  searchRestaurant();
});

document
  .querySelector("#search-bar")
  .addEventListener("keyup", function (event) {
    console.log(document.querySelector("#search-bar").value.toUpperCase());
    if (event.key == "Enter") {
      searchRestaurant();
    }
  });
// const charactersList = document.getElementById("charactersList");
// const searchBar = document.getElementById("searchBar");
// let hpCharacters = [];

// searchBar.addEventListener("keyup", (e) => {
//   const searchString = e.target.value.toLowerCase();
//   const filterCharacters = hpCharacters.filter((character) => {
//     return (
//       character.name.toLowerCase().includes(searchString) ||
//       character.house.toLowerCase().includes
//     );
//   });
// });
//////////////////////////////////////////////////////////////////////////////////////////////

