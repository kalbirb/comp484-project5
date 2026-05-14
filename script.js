let map;
let currentQuestion = 0;
let score = 0;
let rectangle;
let infoWindow;

// CSUN center
const csunCenter = {
  lat: 34.24,
  lng: -118.529,
};

// Quiz locations
const locations = [
  {
    name: "University Library",
    description:
      "CSUN’s main academic library with study spaces and resources.",
    bounds: {
      north: 34.2409,
      south: 34.2397,
      east: -118.528,
      west: -118.5294,
    },
  },
  {
    name: "Student Recreation Center",
    description:
      "Fitness center with gym, courts, and recreational facilities.",
    bounds: {
      north: 34.2412,
      south: 34.2402,
      east: -118.5257,
      west: -118.527,
    },
  },
  {
    name: "CSUN Bookstore",
    description:
      "Official campus bookstore for textbooks, supplies, and merch.",
    bounds: {
      north: 34.2378,
      south: 34.2368,
      east: -118.5292,
      west: -118.5304,
    },
  },
  {
    name: "Sierra Hall",
    description: "Academic building used for lectures and computer labs.",
    bounds: {
      north: 34.2389,
      south: 34.2379,
      east: -118.5283,
      west: -118.5295,
    },
  },
  {
    name: "Jacaranda Hall",
    description: "Engineering and technology classrooms and labs.",
    bounds: {
      north: 34.2411,
      south: 34.2401,
      east: -118.5312,
      west: -118.5325,
    },
  },
];

function initMap() {
  infoWindow = new google.maps.InfoWindow();
  map = new google.maps.Map(document.getElementById("map"), {
    center: csunCenter,
    zoom: 18,

    // Disable movement
    draggable: false,
    scrollwheel: false,
    disableDoubleClickZoom: true,
    keyboardShortcuts: false,

    zoomControl: false,
    streetViewControl: false,
    mapTypeControl: true,
    fullscreenControl: false,
    cameraControl: false,

    // Remove overlays (IMPORTANT)
    styles: [
      {
        featureType: "all",
        elementType: "labels",
        stylers: [{ visibility: "off" }],
      },
      {
        featureType: "poi",
        stylers: [{ visibility: "on" }],
      },
      {
        featureType: "transit",
        stylers: [{ visibility: "off" }],
      },
      {
        featureType: "road",
        elementType: "labels",
        stylers: [{ visibility: "off" }],
      },
    ],
  });

  loadQuestion();

  map.addListener("dblclick", (event) => {
    checkAnswer(event.latLng);
  });

  document.getElementById("nextBtn").addEventListener("click", nextQuestion);
}

function loadQuestion() {
  document.getElementById("result").innerText = "";

  document.getElementById("nextBtn").style.display = "none";

  const place = locations[currentQuestion];

  document.getElementById("question").innerText =
    `Double click where "${place.name}" is located.`;

  // Remove old rectangle
  if (rectangle) {
    rectangle.setMap(null);
  }
}

function checkAnswer(clickedLatLng) {
  const place = locations[currentQuestion];
  const b = place.bounds;

  const lat = clickedLatLng.lat();
  const lng = clickedLatLng.lng();

  const correct =
    lat <= b.north && lat >= b.south && lng <= b.east && lng >= b.west;

  // clear previous box
  if (rectangle) {
    rectangle.setMap(null);
  }

  // draw correct area
  rectangle = new google.maps.Rectangle({
    strokeColor: correct ? "#00AA00" : "#FF0000",
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: correct ? "#00FF00" : "#FF0000",
    fillOpacity: 0.35,
    map,
    bounds: b,
    clickable: false,
  });

  if (correct) {
    score++;

    document.getElementById("result").innerText = "Correct!";

    document.getElementById("result").style.color = "green";

    // center of rectangle
    const centerLat = (place.bounds.north + place.bounds.south) / 2;

    const centerLng = (place.bounds.east + place.bounds.west) / 2;

    infoWindow.setContent(`
    <div style="font-size:14px; max-width:200px;">
      <strong>${place.name}</strong><br/>
      ${place.description}
    </div>
  `);

    infoWindow.setPosition({
      lat: centerLat,
      lng: centerLng,
    });

    infoWindow.open(map);

    document.getElementById("nextBtn").style.display = "inline-block";
  }
  // ALWAYS show next button
  document.getElementById("nextBtn").style.display = "inline-block";
}

function nextQuestion() {
  currentQuestion++;

  if (currentQuestion >= locations.length) {
    alert(
      `Quiz Finished!\nYou got ${score} out of ${locations.length} correct.`,
    );

    document.getElementById("question").innerText = "Quiz Complete!";
    document.getElementById("result").innerText = "";
    document.getElementById("nextBtn").style.display = "none";

    return;
  }

  // reset UI
  document.getElementById("result").innerText = "";
  document.getElementById("nextBtn").style.display = "none";

  loadQuestion();
}
