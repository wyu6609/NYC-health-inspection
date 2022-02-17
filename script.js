//globals
const uri = "https://data.cityofnewyork.us/resource/43nn-pn8j.json?dba=";
let markersArr = [];
let restaurantJSONStorage, jsonObject, noDuplicateJSON;
let map, marker, infoWindow;

////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Start Google maps && geolocation Api
function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 40.73061, lng: -73.935242 },
    zoom: 10.5,
  });
  infoWindow = new google.maps.InfoWindow();
  marker = new google.maps.Marker({
    draggable: false,
    animation: google.maps.Animation.DROP,
    map: map,
    icon: "./mapIcons/current-location-icon.png",
  });

  window.addEventListener("load", () => {
    // Try HTML5 geolocation.
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          marker.setPosition(pos);

          infoWindow.open(map);
          map.setCenter(pos);
          map.setZoom(14);
        },
        () => {
          handleLocationError(true, infoWindow, map.getCenter());
        }
      );
    } else {
      // Browser doesn't support Geolocation
      handleLocationError(false, infoWindow, map.getCenter());
    }
  });
}

/////////////////////////////////////////////

//add markers
function addMarkers(globalData) {
  marker = new google.maps.Marker({
    position: coords,
    map: map,
    draggable: false,
    animation: google.maps.Animation.DROP,
    title: obj.grade,
    icon: `./mapIcons/grade-icon-${obj.grade}.png`,
  });
}
////////////////////////////////////////////////////////////////////////////////////

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(
    browserHasGeolocation
      ? "ERROR: THE GEOLOCATION SERVICE HAS FAILED"
      : "ERROR: YOUR BROWSER DOESN'T SUPPORT GEOLOCATION SERVICE."
  );
  infoWindow.open(map);
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// exit street View with Escape
document.addEventListener("keydown", function (event) {
  if (event.key === "Escape") {
    map.getStreetView().setVisible(false);
  }
});
/////////////////////////////////////////////////////////////////////////////
// create Markers

////////////////////////////////////////////////////////////////////////////

//search bar -->

function searchRestaurant() {
  let text = document.querySelector("#search-bar").value;
  let result = text.replace(" ", "%20").toUpperCase();
  console.log(result);
  console.log(document.querySelector("#search-bar").value.toUpperCase());
  fetchRestaurantAPI(result);
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

////////////////////////////////////////////////////////////////////////////
//GET request - NYC Health Inspection API

function fetchRestaurantAPI(restaurantName) {
  fetch(`${uri}${restaurantName}`)
    .then((response) => response.json())
    .then((restaurantData) => {
      restaurantJSONStorage = restaurantData;
      // restaurantData.forEach((restaurantObj) => {
      //   addMarker(restaurantObj);
      // });
      removeDuplicates();
      markAllRestaurants();
    })

    .catch((error) => {
      console.error("Error:", error);
    });
}
// iterate through array of Restaurant objects

function markAllRestaurants() {
  noDuplicateJSON.forEach((restaurant) => {
    let coords = {
      lat: parseFloat(restaurant.latitude),
      lng: parseFloat(restaurant.longitude),
    };
    addMarker(restaurant, coords);
  });
}

//adds Markers to google maps function
function addMarker(restaurant, coords) {
  marker = new google.maps.Marker({
    position: coords,
    map: map,
    draggable: false,
    animation: google.maps.Animation.DROP,

    icon: `./mapIcons/grade-icon-${restaurant.grade}.png`,
  });
  //   const contentString = `<div class="card card-block">
  //   <h4 class="card-title">Card title</h4>
  //   <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
  //   <a href="#" class="card-link">Card link</a>
  //   <a href="#" class="card-link">Another link</a>
  // </div>`;
  //   // <h2>${obj.dba}</h2>
  //   // <h3>Score: ${obj.score}</h3>
  //   // <p>An inspection score of 0 to 13 is an A, 14 to 27 points is a B, and 28 or more points is a C.<p>;
  //   infowindow = new google.maps.InfoWindow({
  //     content: contentString,
  //   });
  marker.addListener("click", () => {
    // create div on selected marker
    // infowindow.open({
    //   anchor: marker,
    //   map,
    //   shouldFocus: false,
    // });
    createDiv(restaurant["grade"]);
    //set poster
    setGradePoster(restaurant["grade"]);
    generateCardInfo(restaurant);
  });
}

////////////////////////////////////////////////////////////////////////////
// removes Duplicate entries in JSON DATA (health inspection api poorly managed -a lot of duplicate entries)
function removeDuplicates() {
  // Create an array of objects

  jsonObject = restaurantJSONStorage.map(JSON.stringify);

  uniqueSet = new Set(jsonObject);
  uniqueArray = Array.from(uniqueSet).map(JSON.parse);

  // console.log(uniqueArray);
  noDuplicateJSON = uniqueArray;
}
///////////////////////////////////////////////////////////////////////////////
function generateCardInfo(obj) {
  let phoneNumber = formatPhoneNumber(obj.phone); // convert json Phone number string to phone number format
  let mostRecentGrade = document.getElementById("current-grade");
  let gradeStats = document.getElementById("grade-stats-here"); // Last violation description
  let gradeStats2 = document.getElementById("grade-stats-here-2"); // last date
  let gradeStats3 = document.getElementById("grade-stats-here-3"); // score (An inspection score of 0 to 13 is an A, 14 to 27 points is a B, and 28 or more points is a C.)
  let restaurantName = document.getElementById("restaurant-name"); // restaurant name
  let restaurantInfo = document.getElementById("restaurant-info"); // address & telephone
  mostRecentGrade.textContent = `${obj.dba}`;
  restaurantName.textContent = `PHONE: ${phoneNumber}`;
  restaurantInfo.textContent = `ADDRESS: ${obj.building} ${
    obj.street
  } ${obj.boro.toUpperCase()}, NY ${obj.zipcode}             
   `;
  gradeStats.textContent = `LAST INSPECTION DATE: ${obj.inspection_date.slice(
    0,
    10
  )}`;
  gradeStats2.textContent = `PREVIOUS VIOLATION: (${obj.violation_code}) ${obj.violation_description}`;

  gradeStats3.innerHTML = `<a href = "https://www1.nyc.gov/assets/doh/downloads/pdf/rii/ri-violation-penalty.pdf" target = "_blank">OFFICIAL CODE VIOLATION DETAILS</a>`;
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
    case "C":
      document.getElementById("right-side").style.backgroundColor = "#f0ad4e";
      break;
    case undefined:
      document.getElementById("right-side").style.backgroundColor = "#b0b0b0"; //grade pending
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
    case "C":
      gradePoster.src = "./grades/grade-poster-C.jpg";
      gradePoster.alt = "Grade C Poster";
      break;
    case undefined:
      gradePoster.src = "./grades/grade-poster-undefined.jpg";
      gradePoster.alt = "Grade Pending Poster";
  }
}
///////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////
function formatPhoneNumber(phoneNumberString) {
  var cleaned = ("" + phoneNumberString).replace(/\D/g, "");
  var match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return "(" + match[1] + ") " + match[2] + "-" + match[3];
  }
  return null;
}

/////////////////////
document.getElementById("remove-markers-btn").addEventListener("click", () => {
  location.reload();
});
