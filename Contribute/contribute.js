const ACCESS_TOKEN = API_KEYS.MAPBOX_API_TOKEN_ACCESS_KEY;
mapboxgl.accessToken = ACCESS_TOKEN;

let Zoom_Save_Session_Storage_Name = "Zoom_Save_Session_Storage";
let Zoom_Save_Cache =
  sessionStorage.getItem(Zoom_Save_Session_Storage_Name) || 12;
let mapbox_circle_stroke_color_light_mode = "rgba(0, 0, 0, 1)";
let mapbox_circle_stroke_color_dark_mode = "rgba(186, 186, 186, 1)";
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
  if (document.visibilityState === "hidden") {
    let Current_Zoom = map.getZoom();
    Zoom_Save_Cache = sessionStorage.getItem(Zoom_Save_Session_Storage_Name);
    if (Current_Zoom) {
      sessionStorage.setItem(Zoom_Save_Session_Storage_Name, Current_Zoom);
    }
  }
});

let Map_Layer_Controls_DOM = document.querySelector("#Map_Layer_Controls");

let mapbox_circle_stroke_color_light_mode = "rgba(0, 0, 0, 1)";
let mapbox_circle_stroke_color_dark_mode = "rgba(186, 186, 186, 1)";




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



let Map_Lighting_Mode_LocalStorage_Name = "map-theme";
function Map_Lighting_Change(Mode) {
  if (Mode == "day") {
    map.setConfigProperty("basemap", "lightPreset", "day");

    const layers = map.getStyle().layers;
    layers.forEach((layer) => {
      if (layer.type === "circle") {
        console.log(layer);
        map.setPaintProperty(
          layer.id,
          "circle-stroke-color",
          mapbox_circle_stroke_color_light_mode,
        );
        //map.setPaintProperty(layer.id, "circle-stroke-width", 2);
      }
    });

    localStorage.setItem(Map_Lighting_Mode_LocalStorage_Name, "day");
  } else if (Mode == "night") {
    map.setConfigProperty("basemap", "lightPreset", "night");

    const layers = map.getStyle().layers;
    layers.forEach((layer) => {
      if (layer.type === "circle") {

        map.setPaintProperty(
          layer.id,
          "circle-stroke-color",
          mapbox_circle_stroke_color_dark_mode,
        );
        //map.setPaintProperty(layer.id, "circle-stroke-width", 2);
      }
    });

    localStorage.setItem(Map_Lighting_Mode_LocalStorage_Name, "night");
  } else {
    console.log(
      "Error: Trying to change the map lighting without correct mode",
    );
  }
}

function Update_Map_Lighting() {
  let Saved_Map_Lighting_Mode = localStorage.getItem(
    Map_Lighting_Mode_LocalStorage_Name,
  );
  if (Saved_Map_Lighting_Mode) {
    Map_Lighting_Change(Saved_Map_Lighting_Mode);
  } else {
    // First Time Loading, better send them a message so they know xd.
  }
}

function Initialize_Map_Lighting() {
  let Saved_Map_Lighting_Mode = localStorage.getItem(
    Map_Lighting_Mode_LocalStorage_Name,
  );
  if (Saved_Map_Lighting_Mode) {
    Update_Map_Lighting();
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
}

map.on("load", () => {
  Initialize_Map_Extras();
});


map.on("style.load", () => {
  Initialize_Map_Lighting();
});

document
  .querySelector("#Dark_Theme_BTN")
  .addEventListener("click", () => Map_Lighting_Change("night"));
document
  .querySelector("#Light_Theme_BTN")
  .addEventListener("click", () => Map_Lighting_Change("day"));

