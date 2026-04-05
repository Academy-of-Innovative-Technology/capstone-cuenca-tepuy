const ACCESS_TOKEN = API_KEYS.MAPBOX_API_TOKEN_ACCESS_KEY;
mapboxgl.accessToken = ACCESS_TOKEN;

const map = new mapboxgl.Map({
  container: "map", // container ID
  center: [-74.0038, 40.7533], // starting position [lng, lat]. Note that lat must be set between -90 and 90
  zoom: 10, // starting zoom
});

let Map_Layer_Controls_DOM = document.querySelector("#Map_Layer_Controls");


let Data = [];
let Location_APIs = [
  {
    url: "https://data.cityofnewyork.us/resource/bmxf-3rd4.json",
    extra_data: {
      Name: "Directory Of Homeless Drop- In Centers",
      Layer_Name: "Shelter",
      Found: "NYC Open Data",
      Source: "Department of Homeless Services",
      Pin_Color: "#ff9100",
    },
  },
  {
    url: "https://data.cityofnewyork.us/resource/ntcm-2w4k.json",
    extra_data: {
      Name: "Testing",
      Layer_Name: "Testing",
      Found: "ENV",
      Source: "ME",
      Pin_Color: "#fc0303",
    },
  },
];


let Google_Maps_Search_Link = (address) => {
  return `https://maps.google.com/?q=${address}`;
};

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
        "circle-color": Layer_Group.locations[0].extra_data.Pin_Color,
        "circle-radius": 6,
        "circle-stroke-width": 2,
        "circle-stroke-color": "#ffffff",
      },
    });

    // When a click event occurs on a feature in the places layer, open a popup at the
    // location of the feature, with description HTML from its properties.
    map.addInteraction(`${Layer_Group.Layer_Name}-click-interaction`, {
      type: "click",
      target: { layerId: Layer_Group.Layer_Name },
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
    map.addInteraction(`${Layer_Group.Layer_Name}-mouseenter-interaction`, {
      type: "mouseenter",
      target: { layerId: Layer_Group.Layer_Name },
      handler: () => {
        map.getCanvas().style.cursor = "pointer";
      },
    });

    // Change the cursor back to a pointer when it stops hovering over a POI.
    map.addInteraction(`${Layer_Group.Layer_Name}-mouseleave-interaction`, {
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

function Initialize_Map_Extras() {
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
}





function Initialize_Layer_Control() {
  let all_Layers = map.getStyle().layers;
  all_Layers.forEach((Layer) => {
    let id = Layer.id;

    let New_BTN_ID = `Layer_Toggler_${id}`;

    if (document.getElementById(New_BTN_ID)) {
      console.log("exit");
      return;
    }

    let HTML = `
     <input type="checkbox" class="btn-check active" id="${New_BTN_ID}" autocomplete="off" checked>
    <label class="btn btn-primary" style="background-color: ${Layer.paint["circle-color"]}" for="Layer_Toggler_${id}">${id}</label>`;

    Map_Layer_Controls_DOM.insertAdjacentHTML("beforeend", HTML);

    let Trigger = document.querySelector(`#${New_BTN_ID}`);
    Trigger.addEventListener("change", (event) => {
      if (event.target.checked) {
        console.log("Turning on");
        map.setLayoutProperty(id, "visibility", "visible");
        Trigger.classList.add("active");
      } else {
        console.log("Turning off");
        map.setLayoutProperty(id, "visibility", "none");
        Trigger.classList.remove("active");
      }
    });
  });
}

map.on("load", () => {
  Initialize_Map_Extras();
  loadAllGeolocation();
});

map.on("idle", () => {
  Initialize_Layer_Control();
});
