// api endpoint
const uri = "https://data.cityofnewyork.us/resource/43nn-pn8j.json?dba=";
let coords, map, mapMarker, score, markerColor;
//add markers for selected restaurant
function addMarker(obj) {
  coords = {
    lat: parseFloat(obj.latitude),
    lng: parseFloat(obj.longitude),
  };
  markerColor = obj.grade;

  // setScore(obj.score);
  let marker = new google.maps.Marker({
    position: coords,
    map: map,
    draggable: true,
    animation: google.maps.Animation.DROP,
    title: obj.grade,
    icon: `./mapIcons/grade-icon-${obj.grade}.png`,
  });
  marker.setDraggable(false);
  function toggleBounce() {
    if (marker.getAnimation() !== null) {
      marker.setAnimation(null);
    } else {
      marker.setAnimation(google.maps.Animation.BOUNCE);
    }
  }
  // const contentString = `
  // <h2>${obj.dba}</h2>
  // <h3>Grade: ${obj.grade}</h3>
  // <h3>Score: ${obj.score}</h3>
  // <p>An inspection score of 0 to 13 is an A, 14 to 27 points is a B, and 28 or more points is a C.<p>`;
  // const infowindow = new google.maps.InfoWindow({
  //   content: contentString,
  // });

  marker.addListener("click", () => {
    // create div on selected marker
    createDiv(obj["grade"]);
    //set poster
    setGradePoster(obj["grade"]);
    generateCardInfo(obj);

    // infowindow.open({
    //   anchor: marker,
    //   map,
    //   shouldFocus: false,
    // });
  });
}

//fetch api
function fetchRestaurant(restaurantName) {
  fetch(`${uri}${restaurantName}`)
    .then((response) => response.json())
    .then((data) => {
      console.log("Success:");
      data.forEach((obj) => {
        // console.log(obj);
        addMarker(obj);
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
  // console.log(y, x);
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
    icon: "./mapIcons/current-location-icon.png",
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

document.querySelector("#remove-markers-btn").addEventListener("click", () => {
  console.log("clicked");
});

//Escape key event listener to close google maps street view
document.addEventListener("keydown", function (event) {
  if (event.key === "Escape") {
    map.getStreetView().setVisible(false);
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
function generateCardInfo(obj) {
  let phoneNumber = formatPhoneNumber(obj.phone); // convert json Phone number string to phone number format

  let gradeStats = document.getElementById("grade-stats-here"); // Last violation description
  let gradeStats2 = document.getElementById("grade-stats-here-2"); // last date
  let gradeStats3 = document.getElementById("grade-stats-here-3"); // score (An inspection score of 0 to 13 is an A, 14 to 27 points is a B, and 28 or more points is a C.)
  let restaurantName = document.getElementById("restaurant-name"); // restaurant name
  let restaurantInfo = document.getElementById("restaurant-info"); // address & telephone
  restaurantName.textContent = `${obj.dba} ${phoneNumber}`;
  restaurantInfo.textContent = `ADDRESS: ${obj.building} ${obj.street} ${obj.boro} ${obj.zipcode}             
   `;
}

//changes right side background based on grade of restaurant clicked
function createDiv(grade) {
  switch (grade) {
    case "A":
      document.getElementById("right-side").style.backgroundColor = "#0275d8";
      break;

    case "B":
      document.getElementById("right-side").style.backgroundColor = "#5cb85c";
      break;
    case "c":
      document.getElementById("right-side").style.backgroundColor = "#f0ad4e";
      break;
    case undefined:
      document.getElementById("right-side").style.backgroundColor = "#cbc3e3"; //grade pending
  }
}
//set posters based on grade and restaurant
function setGradePoster(grade) {
  let gradePoster = document.getElementById("grade-poster");
  // gradePoster.src = `./grades/grade-poster-${grade}.jpg`;
  switch (grade) {
    case "A":
      gradePoster.src = "./grades/grade-poster-A.jpg";
      gradePoster.alt = "Grade A Poster";
      break;

    case "B":
      gradePoster.src = "./grades/grade-poster-B.jpg";
      gradePoster.alt = "Grade B Poster";
      break;
    case "c":
      gradePoster.src = "./grades/grade-poster-C.jpg";
      gradePoster.alt = "Grade C Poster";
      break;
    case undefined:
      gradePoster.src = "./grades/grade-poster-undefined.jpg";
      gradePoster.alt = "Grade Pending Poster";
  }
}
/////////////////////////////////////////////////////////////////
function formatPhoneNumber(phoneNumberString) {
  var cleaned = ("" + phoneNumberString).replace(/\D/g, "");
  var match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return "(" + match[1] + ") " + match[2] + "-" + match[3];
  }
  return null;
}
