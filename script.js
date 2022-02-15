const uri = "https://data.cityofnewyork.us/resource/43nn-pn8j.json";
//fetch api
fetch(uri, {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
  },
})
  .then((response) => response.json())
  .then((data) => {
    console.log("Success:", data);
  })
  .catch((error) => {
    console.error("Error:", error);
  });

//google maps
function initMap() {
  //Map options
  let options = {
    zoom: 15,
    center: { lat: 40.7053, lng: -74.0139 },
  };
  //new map
  let map = new google.maps.Map(document.getElementById("map"), options);
  //map options
  let marker = new google.maps.Marker({
    position: { lat: 40.7053, lng: -74.0139 },
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
