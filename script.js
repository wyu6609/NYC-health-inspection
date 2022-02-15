// api endpoint
const uri = "https://data.cityofnewyork.us/resource/43nn-pn8j.json?dba=";
let map;

//add markers for selected restaurant
function addMarker(coords, obj) {
  let marker = new google.maps.Marker({
    position: coords,
    map: map,
    draggable: true,
    animation: google.maps.Animation.DROP,
    title: obj.grade,
  });
  function toggleBounce() {
    if (marker.getAnimation() !== null) {
      marker.setAnimation(null);
    } else {
      marker.setAnimation(google.maps.Animation.BOUNCE);
    }
  }
  const contentString = `
  <h2>${obj.dba}</h2>
  <h3>Grade: ${obj.grade}</h3>
  <h3>Score: ${obj.score}</h3>
  <p>An inspection score of 0 to 13 is an A, 14 to 27 points is a B, and 28 or more points is a C.<p>`;
  const infowindow = new google.maps.InfoWindow({
    content: contentString,
  });

  marker.addListener("click", () => {
    console.log(obj);
    createDiv(obj);
    // create div on selected marker
    infowindow.open({
      anchor: marker,
      map,
      shouldFocus: false,
    });
  });
}

//fetch api
function fetchRestaurant(restaurantName) {
  fetch(`${uri}${restaurantName}`)
    .then((response) => response.json())
    .then((data) => {
      console.log("Success:");
      data.forEach((obj) => {
        let coords = {
          lat: parseFloat(obj.latitude),
          lng: parseFloat(obj.longitude),
        };

        console.log(obj);
        addMarker(coords, obj);
      });
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

    // console.log(position);
    // console.log(y, x);
    // initMap(position);
    initMap(y, x);
    //use geolocation coords when available
  },
  function () {
    alert("Browser Location denied!");
    initMap(40.70521, -74.013757);
  }
);
//google maps initial load
function initMap(y, x) {
  //Map options
  console.log(y, x);
  let options = {
    zoom: 14,
    center: { lat: y, lng: x },
  };
  //new map
  map = new google.maps.Map(document.getElementById("map"), options);
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

//////////////////////////////////////////////////////////////////////////////////////////////
//search bar -->

function searchRestaurant() {
  console.log(document.querySelector("#search-bar").value.toUpperCase());
  fetchRestaurant(document.querySelector("#search-bar").value.toUpperCase());
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

function delMarkers(map) {
  map.clearOverlays();
}
document.querySelector("#remove-markers-btn").addEventListener("click", () => {
  console.log("clicked");
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

function createDiv(obj) {
  switch (obj.grade) {
    case "A":
      document.getElementById("right-side").style.backgroundColor = "#0275d8";
      break;

    case "B":
      document.getElementById("right-side").style.backgroundColor = "#5cb85c";
      break;
    case "c":
      document.getElementById("right-side").style.backgroundColor = "#f0ad4e";
      break;
    case "undefined":
      document.getElementById("right-side").style.backgroundColor = "#cbc3e3";
  }
}
