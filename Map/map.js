const ACCESS_TOKEN = API_KEYS.MAPBOX_API_TOKEN_ACCESS_KEY;
mapboxgl.accessToken = ACCESS_TOKEN;

let Zoom_Save_Session_Storage_Name = "Zoom_Save_Session_Storage"
let Zoom_Save_Cache = sessionStorage.getItem(Zoom_Save_Session_Storage_Name) || 12;



const map = new mapboxgl.Map({
  container: "map", // container ID
  center: [-73.913125, 40.742861], // starting position [lng, lat]. Note that lat must be set between -90 and 90

  zoom: Zoom_Save_Cache, // starting zoom
  dragRotate: false,
  touchZoomRotate: false,
});

window.addEventListener("visibilitychange", (event) => {
  //event.preventDefault(); // Standard
  //event.returnValue = ""; // Required for some older browsers
  if (document.visibilityState === 'hidden') { 
    let Current_Zoom = map.getZoom();
    Zoom_Save_Cache = sessionStorage.getItem(Zoom_Save_Session_Storage_Name);
    if (Current_Zoom) {
      sessionStorage.setItem(Zoom_Save_Session_Storage_Name, Current_Zoom);
    }
  }
});


let Map_Layer_Controls_DOM = document.querySelector("#Map_Layer_Controls");

let Data = [];
let Location_APIs = [
  {
    url: "https://data.cityofnewyork.us/resource/bmxf-3rd4.json",
    extra_data: {
      Name: "Homeless Shelters",
      Layer_Name: "Shelter",
      Found: "NYC Open Data",
      Source: "Department of Homeless Services",
      Pin_Color: "#ff9100",
      Processing_Method: "Directory Of Homeless Drop- In Centers",
    },
  },
  {
    url: "../Data/Food_Pantries_DYCD.json",
    extra_data: {
      Name: "Food Pantries by DYCD",
      Layer_Name: "Food_Pastries",
      Found: "ENV",
      Source: "ME",
      Pin_Color: "#fc0303",
      Processing_Method: "Food_Pantries_DYCD",
    },
  },
  {
    url: "../Data/NY_MTA_Transit_Train_Station_Bathrooms.json",
    extra_data: {
      Name: "MTA Station w/ Bathroom",
      Layer_Name: "MTA_Station_Bathrooms",
      Found: "MTA",
      Source: "MTA",
      Pin_Color: "#00ff15",
      Processing_Method: "NY_MTA_Transit_Train_Station_Bathrooms",
    },
  },
  {
    url: "../Data/Overcompass_NY_Bathroom.json",
    extra_data: {
      Name: "NY_Bathroom",
      Layer_Name: "NY_Bathrooms",
      Found: "Overcompass",
      Source: "Overcompass",
      Pin_Color: "blue",
      Processing_Method: "NY_Bathrooms",
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
let Zoom_Level_Before_OffCanvas;
function Add_List_Location_To_Map(Data) {
  let Categorized_Data = groupByLayer(Data);

  Categorized_Data.forEach(async (Layer_Group, index) => {
    let Map_Marker_Data = [];
    await Promise.all(
      Layer_Group.locations.map(async (location) => {
        const API_DATA_MANAGER = new DataProcessor(
          location,
          location.extra_data.Processing_Method,
        );
        const Standarized_Data = await API_DATA_MANAGER.process();

        let Object_Marker_Data = {
          type: "Feature",
          properties: {
            // description: `<p>${location.center_name}</p><a target="_blank" href="${Google_Maps_Search_Link(location.address)}">${location}</a><p>${location.comments}</p><button class="btn" data-bs-toggle="offcanvas" data-bs-target="#offcanvas_map_info" aria-controls="offcanvas_map_info">More</button>`,
            data: location,
          },
          geometry: {
            type: "Point",
            coordinates: [
              Standarized_Data.metadata.longitude,
              Standarized_Data.metadata.latitude,
            ],
          },
        };

        Map_Marker_Data.push(Object_Marker_Data);
      }),
    );
    map.addSource(Layer_Group.Layer_Name, {
      type: "geojson",
      generateId: true,
      data: {
        type: "FeatureCollection",
        features: Map_Marker_Data,
        button_name: Layer_Group.locations[0].extra_data.Name,
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
        "circle-emissive-strength": 1.0,
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
       

        let Zoom_level = map.getZoom();
        Zoom_Level_Before_OffCanvas = Zoom_level;
        // console.log("Zoom level is " + Zoom_level);
        // if (map.getZoom() <= 11) {
        //   Zoom_level = 11;
        // }
        map.flyTo({
          center: e.lngLat,
          zoom: 15,
          essential: true, // this animation is considered essential with respect to prefers-reduced-motion
        });

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
      return;
    }
    let Button_Name = map.getSource(id)._data.button_name || id;
    let HTML = `
     <input type="checkbox" class="btn-check active" id="${New_BTN_ID}" autocomplete="off" checked>
    <label class="btn btn-primary" id="${New_BTN_ID}_Label" style="background-color: ${Layer.paint["circle-color"]}" for="Layer_Toggler_${id}">${Button_Name}</label>`;

    Map_Layer_Controls_DOM.insertAdjacentHTML("beforeend", HTML);
    let Trigger = document.querySelector(`#${New_BTN_ID}`);
    let Label = document.querySelector(`#${New_BTN_ID}_Label`);
    Trigger.addEventListener("change", (event) => {
      if (event.target.checked) {
        //console.log("Turning on");
        map.setLayoutProperty(id, "visibility", "visible");
        Trigger.classList.add("active");
        if (Label) {
          Label.classList.remove("Darker");
        }
      } else {
        map.setLayoutProperty(id, "visibility", "none");
        Trigger.classList.remove("active");
        if (Label) {
          
          Label.classList.add("Darker");
        }
      }

    });
  });
}
let Map_Lighting_Mode_LocalStorage_Name = "map-theme";
function Map_Lighting_Change(Mode) {
  if (Mode == "day") {
    map.setConfigProperty("basemap", "lightPreset", "day");
    localStorage.setItem(Map_Lighting_Mode_LocalStorage_Name, "day");
  } else if (Mode == "night") {
    map.setConfigProperty("basemap", "lightPreset", "night");
    localStorage.setItem(Map_Lighting_Mode_LocalStorage_Name, "night");
  } else {
    console.log(
      "Error: Trying to change the map lighting without correct mode",
    );
  }
}

map.on("load", () => {
  Initialize_Map_Extras();
  loadAllGeolocation();
});

map.on("idle", () => {
  Initialize_Layer_Control();
});

map.on("style.load", () => {
  let Saved_Map_Lighting_Mode = localStorage.getItem(
    Map_Lighting_Mode_LocalStorage_Name,
  );
  if (Saved_Map_Lighting_Mode) {
    Map_Lighting_Change(Saved_Map_Lighting_Mode);
  } else {

    // First Time Loading, better send them a message so they know xd.
    let Map_Lighting_Mode_Reminder_Toast_DOM = document.getElementById(
      "Map_Lighting_Mode_Reminder_Toast",
    );
    let toastBootstrap = bootstrap.Toast.getOrCreateInstance(
      Map_Lighting_Mode_Reminder_Toast_DOM,
    );
    toastBootstrap.show();
  }
});

document
  .querySelector("#Dark_Theme_BTN")
  .addEventListener("click", () => Map_Lighting_Change("night"));
document
  .querySelector("#Light_Theme_BTN")
  .addEventListener("click", () => Map_Lighting_Change("day"));

Offcanvas_Map_Info_DOM.addEventListener("hide.bs.offcanvas", () => {
  map.flyTo({
    zoom: Zoom_Level_Before_OffCanvas,
    essential: true,
  });
});