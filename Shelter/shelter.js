const ACCESS_TOKEN = API_KEYS.MAPBOX_API_TOKEN_ACCESS_KEY;
mapboxgl.accessToken = ACCESS_TOKEN;
const map = new mapboxgl.Map({
  container: "map", // container ID
  center: [-74.0038, 40.7533], // starting position [lng, lat]. Note that lat must be set between -90 and 90
  zoom: 10, // starting zoom
});

window.addEventListener("load", () => {
  const geocoder = new MapboxGeocoder();
  geocoder.accessToken = ACCESS_TOKEN;
  geocoder.options = {
    proximity: [-74.0038, 40.7533],
  };
  geocoder.marker = true;
  geocoder.mapboxgl = mapboxgl;
  map.addControl(geocoder);

  const geolocate = new mapboxgl.GeolocateControl({
    positionOptions: { enableHighAccuracy: true },
    trackUserLocation: true,
    showUserHeading: true,
  });
  map.addControl(geolocate);
});

let Google_Maps_Search_Link = (address) => {
  return `https://maps.google.com/?q=${address}`;
};

let Directory_Of_Homeless_Drop_In_Centers_Link_API =
  "https://data.cityofnewyork.us/resource/bmxf-3rd4.json";

let Location_APIs = [
  {
    url: "https://data.cityofnewyork.us/resource/bmxf-3rd4.json",
    extra_data: {
      Name: "Directory Of Homeless Drop- In Centers",
      Layer_Name: "Shelter",
      Found: "NYC Open Data",
      Source: "Department of Homeless Services",
    },
  },
  {
    url: "https://data.cityofnewyork.us/resource/bmxf-3rd4.json",
    extra_data: {
      Name: "Testing",
      Found: "ENV",
      Source: "ME",
    },
  },
];

let Data = [];

function Add_List_Location_To_Map(Data) {
  let Map_Marker_Data = [];
  Data.forEach((place, index) => {
    //console.log(place);
    let Object_Marker_Data = {
      type: "Feature",
      properties: {
        description: `<p>${place.center_name}</p><a target="_blank" href="${Google_Maps_Search_Link(place.address)}">${place.address}</a><p>${place.comments}</p><button class="btn" data-bs-toggle="offcanvas" data-bs-target="#offcanvas_map_info" aria-controls="offcanvas_map_info" onclick="Load_Data_Off_Canvas(${index})">More</button>`,
      },
      geometry: {
        type: "Point",
        coordinates: [place.longitude, place.latitude],
      },
    };
    Map_Marker_Data.push(Object_Marker_Data);
  });

  map.addSource("places", {
    type: "geojson",
    generateId: true,
    data: {
      type: "FeatureCollection",
      features: Map_Marker_Data,
    },
  });

    // Add a circle layer showing the places.
    map.addLayer({
      id: "places",
      type: "circle",
      source: "places",
      paint: {
        "circle-color": "#fc00e4",
        "circle-radius": 6,
        "circle-stroke-width": 2,
        "circle-stroke-color": "#ffffff",
      },
    });

    // When a click event occurs on a feature in the places layer, open a popup at the
    // location of the feature, with description HTML from its properties.
    map.addInteraction("places-click-interaction", {
      type: "click",
      target: { layerId: "places" },
      handler: (e) => {
        // Copy coordinates array.
        const coordinates = e.feature.geometry.coordinates.slice();
        const description = e.feature.properties.description;

        new mapboxgl.Popup()
          .setLngLat(coordinates)
          .setHTML(description)
          .addTo(map);
      },
    });

    // Change the cursor to a pointer when the mouse is over a POI.
    map.addInteraction("places-mouseenter-interaction", {
      type: "mouseenter",
      target: { layerId: "places" },
      handler: () => {
        map.getCanvas().style.cursor = "pointer";
      },
    });

  // Change the cursor back to a pointer when it stops hovering over a POI.
  map.addInteraction("places-mouseleave-interaction", {
    type: "mouseleave",
    target: { layerId: "places" },
    handler: () => {
      map.getCanvas().style.cursor = "";
    },
  });
}

async function loadAllGeolocation() {
  try {
    const requests = Location_APIs.map(async (API) => {
      const response = await fetch(API.url);

      if (!response.ok) {
        throw new Error(`Failed to fetch ${API.url}`);
      }

      const data = await response.json();
      return data.map((item) => ({
        ...item,
        extra_data: { ...API.extra_data, url: API.url },
      }));
    });
    const results = (await Promise.all(requests)).flat();
    Data = results;
    Add_List_Location_To_Map(Data);
    console.log(Data);
  } catch (error) {
    console.log(error.message);
  }
}

// async function loadAllGeolocation() {
//   try {
//     const response = await fetch(
//       Directory_Of_Homeless_Drop_In_Centers_Link_API,
//       { method: "GET" },
//     );
//     if (!response.ok) {
//       throw new Error(`Reponse status: ${response.status}`);
//     }

//     const result = await response.json();
//     console.log(result);
//     Data = [];

//     let Map_Marker_Data = [];

//     result.forEach((place, index) => {
//       Data.push(place);
//       //console.log(place);
//       let Object_Marker_Data = {
//           type: "Feature",
//           properties: {
//             description:
//               `<p>${place.center_name}</p><a target="_blank" href="${Google_Maps_Search_Link(place.address)}">${place.address}</a><p>${place.comments}</p><button class="btn" data-bs-toggle="offcanvas" data-bs-target="#offcanvas_map_info" aria-controls="offcanvas_map_info" onclick="Load_Data_Off_Canvas(${index})">More</button>`,
//           },
//           geometry: {
//             type: "Point",
//             coordinates: [place.longitude, place.latitude],
//           },
//         }
//         Map_Marker_Data.push(Object_Marker_Data);
//     });

//     map.addSource("places", {
//     type: "geojson",
//     generateId: true,
//     data: {
//       type: "FeatureCollection",
//       features: Map_Marker_Data,
//     },
//   });

//   // Add a circle layer showing the places.
//   map.addLayer({
//     id: "places",
//     type: "circle",
//     source: "places",
//     paint: {
//       "circle-color": "#fc00e4",
//       "circle-radius": 6,
//       "circle-stroke-width": 2,
//       "circle-stroke-color": "#ffffff",
//     },
//   });

//   // When a click event occurs on a feature in the places layer, open a popup at the
//   // location of the feature, with description HTML from its properties.
//   map.addInteraction("places-click-interaction", {
//     type: "click",
//     target: { layerId: "places" },
//     handler: (e) => {
//       // Copy coordinates array.
//       const coordinates = e.feature.geometry.coordinates.slice();
//       const description = e.feature.properties.description;

//       new mapboxgl.Popup()
//         .setLngLat(coordinates)
//         .setHTML(description)
//         .addTo(map);
//     },
//   });

//   // Change the cursor to a pointer when the mouse is over a POI.
//   map.addInteraction("places-mouseenter-interaction", {
//     type: "mouseenter",
//     target: { layerId: "places" },
//     handler: () => {
//       map.getCanvas().style.cursor = "pointer";
//     },
//   });

//   // Change the cursor back to a pointer when it stops hovering over a POI.
//   map.addInteraction("places-mouseleave-interaction", {
//     type: "mouseleave",
//     target: { layerId: "places" },
//     handler: () => {
//       map.getCanvas().style.cursor = "";
//     },
//   });

//   } catch (error) {
//     console.log(error.message);
//   }
// }

map.on("load", loadAllGeolocation);

let Offcanvas_Map_Info_DOM = document.querySelector("#offcanvas_map_info");
let Offcanvas_Map_Info_Body_DOM =
  Offcanvas_Map_Info_DOM.querySelector(".offcanvas-body");
function Load_Data_Off_Canvas(index) {
  let Info = Data[index];
  Offcanvas_Map_Info_Body_DOM.innerHTML = "";

  for (const [key, value] of Object.entries(Info)) {
    console.log(`${key}: ${value}`);

    let HTML = `<div>
      <h2>${key}</h2>
      <p>${value}</p>
    </div>`;

    if (key == "address") {
      HTML = `<div>
      <h2>${key}</h2>
      <a target="_blank" href="${Google_Maps_Search_Link(value)}"><p>${value}</p></a>
    </div>`;
    }

    Offcanvas_Map_Info_Body_DOM.insertAdjacentHTML("beforeend", HTML);
  }
}

