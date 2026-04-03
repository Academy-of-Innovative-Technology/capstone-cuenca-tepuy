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
      Layer_Name: "Shelter",
      Found: "ENV",
      Source: "ME",
    },
  },
];

let Data = [];

function groupByLayer(data) {
  const grouped = {};

  data.forEach((item) => {
    const Layer_Name = item.Layer_Name;

    if (!grouped[Layer_Name]) {
      grouped[Layer_Name] = {
        Layer_Name,
        locations: [],
      };
    }

    grouped[Layer_Name].locations.push(...item.locations);
  });

  return Object.values(grouped);
}

function Add_List_Location_To_Map(Data) {
  let Categorized_Data = groupByLayer(Data);

  Categorized_Data.forEach((Layer_Group, index) => {
    let Map_Marker_Data = [];
    Layer_Group.locations.forEach((location) => {

      let Object_Marker_Data = {
        type: "Feature",
        properties: {
          description: `<p>${location.center_name}</p><a target="_blank" href="${Google_Maps_Search_Link(location.address)}">${location}</a><p>${location.comments}</p><button class="btn" data-bs-toggle="offcanvas" data-bs-target="#offcanvas_map_info" aria-controls="offcanvas_map_info" onclick="">More</button>`,
          data: location,
        },
        geometry: {
          type: "Point",
          coordinates: [location.longitude, location.latitude],
        },
      };
      Map_Marker_Data.push(Object_Marker_Data);
    });
    //console.log(Map_Marker_Data);


    map.addSource(Layer_Group.Layer_Name, {
    type: "geojson",
    generateId: true,
    data: {
      type: "FeatureCollection",
      features: Map_Marker_Data,
    },
  });

  // Add a circle layer showing the places.
  map.addLayer({
    id: Layer_Group.Layer_Name,
    type: "circle",
    source: Layer_Group.Layer_Name,
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
    target: { layerId: Layer_Group.Layer_Name},
    handler: (e) => {
      // Copy coordinates array.
      const coordinates = e.feature.geometry.coordinates.slice();
      const description = e.feature.properties.description;
      //console.log(e.feature.properties.data);
      Load_Data_Off_Canvas(JSON.parse(e.feature.properties.data));
      // new mapboxgl.Popup()
      //   .setLngLat(coordinates)
      //   .setHTML(description)
      //   .addTo(map);
    },
  });

  // Change the cursor to a pointer when the mouse is over a POI.
  map.addInteraction("places-mouseenter-interaction", {
    type: "mouseenter",
    target: { layerId: Layer_Group.Layer_Name },
    handler: () => {
      map.getCanvas().style.cursor = "pointer";
    },
  });

  // Change the cursor back to a pointer when it stops hovering over a POI.
  map.addInteraction("places-mouseleave-interaction", {
    type: "mouseleave",
    target: { layerId: Layer_Group.Layer_Name },
    handler: () => {
      map.getCanvas().style.cursor = "";
    },
  });

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
      return {
        ...API.extra_data,
        locations: data.map((item) => ({
          ...item,
          extra_data: { ...API.extra_data, url: API.url },
        })),
      };
    });
    const results = await Promise.all(requests);
    Data = results;
    Add_List_Location_To_Map(Data);
    //console.log(Data);
  } catch (error) {
    console.log(error.message);
  }
}

map.on("load", loadAllGeolocation);

map.on("idle", () => {
  let all_Layers = map.getStyle().layers;

  all_Layers.forEach((Layer) => {
    let id = Layer.id;
    //console.log(id);
    if (document.getElementById(id)) {
      return;
    }
    //console.log("check");
    // Create a link.
    const link = document.createElement("a");
    link.id = id;
    link.href = "#";
    link.textContent = id;
    link.className = "active";

    // Show or hide layer when the toggle is clicked.
    link.onclick = function (e) {
      const clickedLayer = this.textContent;
      e.preventDefault();
      e.stopPropagation();

      const visibility = map.getLayoutProperty(clickedLayer, "visibility");

      // Toggle layer visibility by changing the layout object's visibility property.
      if (visibility === "visible") {
        map.setLayoutProperty(clickedLayer, "visibility", "none");
        this.className = "";
      } else {
        this.className = "active";
        map.setLayoutProperty(clickedLayer, "visibility", "visible");
      }
    };

    const layers = document.getElementById("menu");
    layers.appendChild(link);
  });
});

let Offcanvas_Map_Info_DOM = document.querySelector("#offcanvas_map_info");
let Offcanvas_Map_Info_Body_DOM =
  Offcanvas_Map_Info_DOM.querySelector(".offcanvas-body");
function Load_Data_Off_Canvas(Data) {
  let Info = Data;
  console.log("Load Canvas Info");
  Offcanvas_Map_Info_Body_DOM.innerHTML = "";
  for (const [key, value] of Object.entries(Info)) {
    //console.log(`${key}: ${value}`);

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

  const bsOffcanvas = new bootstrap.Offcanvas(Offcanvas_Map_Info_DOM)
  bsOffcanvas.show()

}
