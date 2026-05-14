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
    // Assigned Location
    name: "C.R. Johnson Auditorium",
    description:
      "Campus auditorium used for engineering lectures, presentations, and special events.",
    bounds: {
      north: 34.24154647739453,
      south: 34.24128128431045,
      east: -118.52875671100088,
      west: -118.52911698821222,
    },
  },
  {
    name: "University Library",
    description:
      "CSUN’s main academic library with study spaces and resources.",
    bounds: {
      north: 34.2403940993969,
      south: 34.23952392585426,
      east: -118.52863367815891,
      west: -118.53003456091525,
    },
  },
  {
    name: "Student Recreation Center",
    description:
      "Fitness center with gym, courts, and recreational facilities.",
    bounds: {
      north: 34.24063027326154,
      south: 34.23922543084572,
      east: -118.5246306743233,
      west: -118.52529828041911,
    },
  },
  {
    name: "Sierra Hall",
    description: "Academic building used for lectures and computer labs.",
    bounds: {
      north: 34.23857276519373,
      south: 34.238062764533005,
      east: -118.53000762236316,
      west: -118.5315096594592,
    },
  },
  {
    name: "Jacaranda Hall",
    description: "Engineering and technology classrooms and labs.",
    bounds: {
      north: 34.2412839335393,
      south: 34.24108880655959,
      east: -118.52831885074364,
      west: -118.529180070323,
    },
  },
];

function initMap() {
  infoWindow = new google.maps.InfoWindow();
  map = new google.maps.Map(document.getElementById("map"), {
    center: csunCenter,
    zoom: 17,

    // Disable movement
    draggable: false,
    scrollwheel: false,
    disableDoubleClickZoom: true,
    keyboardShortcuts: false,

    zoomControl: false,
    streetViewControl: false,
    // Tilt and Rotate Presentation
    mapTypeControl: true,
    fullscreenControl: false,
    cameraControl: false,

    // Remove overlays
    styles: [
      {
        featureType: "all",
        elementType: "labels",
        stylers: [{ visibility: "off" }],
      },
      {
        featureType: "poi",
        stylers: [{ visibility: "off" }],
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

    // confetti 
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 },
    });
    // center of rectangle
    const centerLat = (place.bounds.north + place.bounds.south) / 2;

    const centerLng = (place.bounds.east + place.bounds.west) / 2;

    // InfoWindow Presentation
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
