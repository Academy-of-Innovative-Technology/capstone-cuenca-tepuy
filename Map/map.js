const ACCESS_TOKEN = API_KEYS.MAPBOX_API_TOKEN_ACCESS_KEY;
mapboxgl.accessToken = ACCESS_TOKEN;

let Zoom_Save_Session_Storage_Name = "Zoom_Save_Session_Storage";
let Zoom_Save_Cache =
  sessionStorage.getItem(Zoom_Save_Session_Storage_Name) || 12;

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

let Layer_Control_Filter_LocalStorage_Name = "map-layer-filter";
let savedLayerFilterState = loadLayerFilterState();

function loadLayerFilterState() {
  const rawState = localStorage.getItem(Layer_Control_Filter_LocalStorage_Name);
  if (!rawState) return {};

  try {
    const parsed = JSON.parse(rawState);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch (error) {
    console.warn("Invalid saved layer filter state", error);
    return {};
  }
}

function saveLayerFilterState(state) {
  localStorage.setItem(
    Layer_Control_Filter_LocalStorage_Name,
    JSON.stringify(state),
  );
}

function getLayerSavedChecked(layerName, defaultValue = true) {
  return savedLayerFilterState.hasOwnProperty(layerName)
    ? savedLayerFilterState[layerName]
    : defaultValue;
}

function updateLayerSavedChecked(layerName, checked) {
  savedLayerFilterState[layerName] = checked;
  saveLayerFilterState(savedLayerFilterState);
}

let Data = [];
let Location_APIs = [
  {
    url: "https://data.cityofnewyork.us/resource/bmxf-3rd4.json",
    extra_data: {
      Name: "Homeless Shelters",
      Layer_Name: "Shelter",
      Found: "NYC Open Data",
      Source: "Department of Homeless Services",
      Pin_Color: "rgb(245, 158, 11)",
      Processing_Method: "Directory Of Homeless Drop- In Centers",
      Icon_Link: "Icons/Shelter.png",
    },
  },
  {
    url: "../Data/Food_Pantries_DYCD.json",
    extra_data: {
      Name: "Food Pantries by DYCD",
      Layer_Name: "Food_Pastries",
      Found: "ENV",
      Source: "ME",
      Pin_Color: "rgb(16, 185, 129)",
      Processing_Method: "Food_Pantries_DYCD",
      Icon_Link: "Icons/Food_Pastries.png",
    },
  },
  {
    url: "../Data/NY_MTA_Transit_Train_Station_Bathrooms.json",
    extra_data: {
      Name: "MTA Station w/ Bathroom",
      Layer_Name: "MTA_Station_Bathrooms",
      Found: "MTA",
      Source: "MTA",
      Pin_Color: "rgba(0, 0, 0, 0)",
      Processing_Method: "NY_MTA_Transit_Train_Station_Bathrooms",
      Icon_Link: "Icons/MTA_Logo.png",
    },
  },
  {
    url: "../Data/Overcompass_NY_Bathroom.json",
    extra_data: {
      Name: "NY City Bathrooms",
      Layer_Name: "NY_Bathrooms",
      Found: "Overcompass",
      Source: "Overcompass",
      Pin_Color: "rgb(37, 99, 235)",
      Processing_Method: "NY_Bathrooms",
      Icon_Link: "Icons/Toilet.png",
    },
  },
  {
    url: "https://data.cityofnewyork.us/resource/feuq-due4.json",
    extra_data: {
      Name: "New York Public Libraries",
      Layer_Name: "NYPL",
      Found: "NYC Open Data",
      Source: "New York Public Library",
      Pin_Color: "rgb(255, 166, 0)",
      Processing_Method: "NYPL",
      Icon_Link: "Icons/Library.png",
    },
  },
  {
    url: "https://data.cityofnewyork.us/resource/v57i-gtxb.json",
    extra_data: {
      Name: "In-Service Alarm Box Locations",
      Layer_Name: "In-Service_Alarm_Box_Locations",
      Found: "NYC Open Data",
      Source: "New York City Fire Department",
      Pin_Color: "rgb(255, 0, 0)",
      Processing_Method: "In_Service_Alarm_Box_Locations",
      Icon_Link: "Icons/Alarm_Box.png",
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

let mapbox_circle_stroke_color_light_mode = "rgba(0, 0, 0, 1)";
let mapbox_circle_stroke_color_dark_mode = "rgba(186, 186, 186, 1)";

// Icon sizing: modify these to change icon diameter and outline thickness
const ICON_PIXEL_DIAMETER = 22; // desired icon photo diameter in screen pixels
const ICON_OUTLINE_WIDTH = 2; // outline thickness in pixels
const ICON_BG_RADIUS = ICON_PIXEL_DIAMETER / 2 + ICON_OUTLINE_WIDTH; // circle background radius (px)

// Return true if the provided CSS color string represents a fully transparent color.
// Supports: 'transparent', 'rgba(r,g,b,0)', and 8-digit hex '#RRGGBBAA' where AA == '00'.
function isTransparentColor(color) {
  if (!color || typeof color !== "string") return false;
  const s = color.replace(/\s+/g, "");
  if (s.toLowerCase() === "transparent") return true;
  const rgbaZero = /^rgba\(\d+,\d+,\d+,0(?:\.0+)?\)$/i;
  if (rgbaZero.test(s)) return true;
  const hex8 = /^#([0-9a-f]{8})$/i;
  const m = s.match(hex8);
  if (m) {
    const alphaHex = m[1].substr(6, 2).toLowerCase();
    if (alphaHex === "00") return true;
  }
  return false;
}

let Zoom_Level_Before_OffCanvas;
async function Add_List_Location_To_Map(Data) {
  let Categorized_Data = groupByLayer(Data);

  await Promise.all(
    Categorized_Data.map(async (Layer_Group) => {
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
      // Try to use an icon image (if provided) and fall back to circle.
      // Prefer an explicit `Icon_Link` in extra_data. Support remote URLs or
      // filenames stored locally in the `Icons/` folder.
      const extra = Layer_Group.locations[0].extra_data || {};
      let iconUrl = null;
      // explicit keys first
      const explicit = extra.Icon_Link || extra.Icon || extra.icon;
      if (explicit && typeof explicit === "string") {
        if (explicit.startsWith("http")) {
          iconUrl = explicit;
        } else {
          // treat as a local filename or relative path — try the Icons folder
          if (explicit.startsWith("/") || explicit.startsWith("..")) {
            iconUrl = explicit;
          } else if (explicit.includes("Icons/")) {
            // normalize so Map/map.html (current file) can reach ../Icons/...
            if (explicit.startsWith("Icons/")) iconUrl = `../${explicit}`;
            else iconUrl = explicit;
          } else {
            iconUrl = `../Icons/${explicit}`;
          }
        }
      }

      // fallback: search any http url or common image filename in extra values
      if (!iconUrl) {
        const found = Object.values(extra).find((v) => {
          return (
            typeof v === "string" &&
            (v.startsWith("http") || /\.(png|jpg|jpeg|svg|gif)$/.test(v))
          );
        });
        if (found) {
          if (found.startsWith("http")) iconUrl = found;
          else if (found.includes("Icons/") || found.startsWith("/"))
            iconUrl = found;
          else iconUrl = `../Icons/${found}`;
        }
      }

      let usedImageName = null;
      let usedImageScale = null;
      if (iconUrl) {
        try {
          // loadImage uses a callback style; wrap in a promise
          const imageName = `${Layer_Group.Layer_Name}_icon`;
          const loaded = await new Promise((resolve) => {
            map.loadImage(iconUrl, (error, image) => {
              if (error) {
                console.warn(`Failed to load icon ${iconUrl}:`, error);
                return resolve(false);
              }
              try {
                // create a circular-cropped canvas at desired pixel size (respect device pixel ratio)
                // create canvas at the desired CSS pixel size (do not double-scale by DPR)
                const canvasSize = ICON_PIXEL_DIAMETER;
                const canvas = document.createElement("canvas");
                canvas.width = canvasSize;
                canvas.height = canvasSize;
                const ctx = canvas.getContext("2d");
                ctx.clearRect(0, 0, canvasSize, canvasSize);
                // circular clip
                ctx.save();
                ctx.beginPath();
                ctx.arc(
                  canvasSize / 2,
                  canvasSize / 2,
                  canvasSize / 2,
                  0,
                  Math.PI * 2,
                );
                ctx.closePath();
                ctx.clip();

                // draw image with cover behavior
                const imgW =
                  image.width ||
                  image.naturalWidth ||
                  (image.bitmap && image.bitmap.width) ||
                  canvasSize;
                const imgH =
                  image.height ||
                  image.naturalHeight ||
                  (image.bitmap && image.bitmap.height) ||
                  canvasSize;
                const scale = Math.max(canvasSize / imgW, canvasSize / imgH);
                const dx = (canvasSize - imgW * scale) / 2;
                const dy = (canvasSize - imgH * scale) / 2;
                ctx.drawImage(image, dx, dy, imgW * scale, imgH * scale);
                ctx.restore();

                // add the processed canvas image to the map (use pixelRatio=1 to match CSS pixels)
                if (!map.hasImage(imageName)) {
                  map.addImage(imageName, canvas, { pixelRatio: 1 });
                }
                resolve({ name: imageName, scale: 1 });
              } catch (err) {
                console.warn("Error processing icon image:", err);
                // fallback to raw image but compute a scale so it's not huge
                const imgW =
                  image &&
                  (image.width ||
                    image.naturalWidth ||
                    (image.bitmap && image.bitmap.width));
                const fallbackScale = imgW
                  ? Math.max(0.01, ICON_PIXEL_DIAMETER / imgW)
                  : 0.08;
                if (!map.hasImage(imageName)) {
                  map.addImage(imageName, image);
                }
                console.warn(
                  `Using fallback image for ${imageName}, imgW=${imgW}, scale=${fallbackScale}`,
                );
                resolve({ name: imageName, scale: fallbackScale });
              }
            });
          });
          if (loaded) {
            usedImageName = loaded.name;
            usedImageScale = loaded.scale;
          }
        } catch (e) {
          // ignore and fallback to circle
          usedImageName = null;
        }
      }

      if (usedImageName) {
        // Add a circular background layer (rounded icon background + outline)
        const bgLayerId = `${Layer_Group.Layer_Name}_bg`;
        const pinColor =
          (Layer_Group.locations[0].extra_data &&
            Layer_Group.locations[0].extra_data.Pin_Color) ||
          "#6c757d";
        // add background circle first so it's beneath the symbol
        map.addLayer({
          id: bgLayerId,
          type: "circle",
          source: Layer_Group.Layer_Name,
          paint: {
            "circle-color": pinColor,
            "circle-radius": ICON_BG_RADIUS,
            // if the background color is fully transparent, hide the outline
            "circle-stroke-width": isTransparentColor(pinColor)
              ? 0
              : ICON_OUTLINE_WIDTH,
            "circle-stroke-color": isTransparentColor(pinColor)
              ? "rgba(0,0,0,0)"
              : mapbox_circle_stroke_color_light_mode,
          },
        });

        // Add the symbol layer using the processed circular image on top of the background
        map.addLayer({
          id: Layer_Group.Layer_Name,
          type: "symbol",
          source: Layer_Group.Layer_Name,
          layout: {
            "icon-image": usedImageName,
            // scale the icon: processed canvas uses 1, fallback images use computed scale
            "icon-size": usedImageScale || 1,
            "icon-allow-overlap": true,
            "icon-ignore-placement": true,
          },
        });
      } else {
        // Add a circle layer showing the places.
        map.addLayer({
          id: Layer_Group.Layer_Name,
          type: "circle",
          source: Layer_Group.Layer_Name,

          paint: {
            "circle-color": Layer_Group.locations[0].extra_data.Pin_Color,
            "circle-radius": ICON_BG_RADIUS,
            // hide outline if the pin/background color is fully transparent
            "circle-stroke-width": isTransparentColor(
              Layer_Group.locations[0].extra_data.Pin_Color,
            )
              ? 0
              : ICON_OUTLINE_WIDTH,
            "circle-stroke-color": isTransparentColor(
              Layer_Group.locations[0].extra_data.Pin_Color,
            )
              ? "rgba(0,0,0,0)"
              : mapbox_circle_stroke_color_light_mode,
            "circle-emissive-strength": 1.05,
          },
        });
      }

      const layerVisible = getLayerSavedChecked(Layer_Group.Layer_Name, true);
      if (!layerVisible) {
        if (map.getLayer(Layer_Group.Layer_Name)) {
          map.setLayoutProperty(Layer_Group.Layer_Name, "visibility", "none");
        }
        const bgLayerId = `${Layer_Group.Layer_Name}_bg`;
        if (map.getLayer(bgLayerId)) {
          map.setLayoutProperty(bgLayerId, "visibility", "none");
        }
      }

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
      Update_Map_Lighting();
    }),
  );
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
    await Add_List_Location_To_Map(Data);
    Initialize_Layer_Control();
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
  const layerListContainer = document.getElementById("layer-list-container");
  let all_Layers = map.getStyle().layers;

  all_Layers.forEach((Layer) => {
    let id = Layer.id;
    let New_BTN_ID = `Layer_Toggler_${id}`;

    if (document.getElementById(New_BTN_ID) || id.endsWith("_bg")) {
      return;
    }
    let Button_Name =
      (map.getSource(id) &&
        map.getSource(id)._data &&
        map.getSource(id)._data.button_name) ||
      id;

    // Determine a background color: prefer circle paint, fall back to source Pin_Color, otherwise default
    let bgColor = "#6c757d";
    try {
      if (Layer.paint && Layer.paint["circle-color"]) {
        bgColor = Layer.paint["circle-color"];
      } else {
        const src = map.getSource(id) && map.getSource(id)._data;
        if (src && src.features && src.features.length > 0) {
          const pdata =
            src.features[0].properties && src.features[0].properties.data;
          if (pdata && pdata.extra_data && pdata.extra_data.Pin_Color) {
            bgColor = pdata.extra_data.Pin_Color;
          }
        }
      }
    } catch (e) {
      // ignore and use default
    }

    const layerEnabled = getLayerSavedChecked(id, true);

    let HTML = `
      <div class="layer-item d-flex align-items-center" data-layer-name="${Button_Name}">
        <input type="checkbox" class="form-check-input layer-checkbox" id="${New_BTN_ID}" ${
          layerEnabled ? "checked" : ""
        }>
        <div class="layer-color-dot ms-2" style="background-color: ${bgColor}; width: 16px; height: 16px; border-radius: 50%;"></div>
        <label class="form-check-label ms-2 mb-0 flex-grow-1 cursor-pointer text-dark" for="${New_BTN_ID}">${Button_Name}</label>
      </div>
    `;

    layerListContainer.insertAdjacentHTML("beforeend", HTML);
    let Trigger = document.querySelector(`#${New_BTN_ID}`);
    Trigger.addEventListener("change", (event) => {
      const checked = event.target.checked;
      if (map.getLayer(id)) {
        map.setLayoutProperty(id, "visibility", checked ? "visible" : "none");
      }
      if (map.getLayer(id + "_bg")) {
        map.setLayoutProperty(
          id + "_bg",
          "visibility",
          checked ? "visible" : "none",
        );
      }
      updateLayerSavedChecked(id, checked);
    });
  });
}

let Layer_Control_Filter_DOM = document.querySelector("#layer-search-input");
function Update_Filter_Layers() {
  let all_Layers = document.querySelectorAll(".layer-item");
  if (Layer_Control_Filter_DOM.value == "") {
    all_Layers.forEach((Layer) => {
      Layer.classList.remove("visually-hidden");
    });
  } else {
    all_Layers.forEach((Layer) => {
      if (
        Layer.dataset.layerName
          .toLowerCase()
          .includes(Layer_Control_Filter_DOM.value.toLowerCase())
      ) {
        Layer.classList.remove("visually-hidden");
      } else {
        Layer.classList.add("visually-hidden");
      }
    });
  }
}
Layer_Control_Filter_DOM.addEventListener("input", Update_Filter_Layers);

let Map_Lighting_Mode_LocalStorage_Name = "map-theme";
function Map_Lighting_Change(Mode) {
  if (Mode == "day") {
    map.setConfigProperty("basemap", "lightPreset", "day");

    const layers = map.getStyle().layers;
    layers.forEach((layer) => {
      if (layer.type === "circle") {
        // attempt to detect a per-source Pin_Color; if it's transparent, hide the outline
        let pinColor = null;
        try {
          const src =
            map.getSource(layer.source) && map.getSource(layer.source)._data;
          if (src && src.features && src.features.length > 0) {
            const pdata =
              src.features[0].properties && src.features[0].properties.data;
            if (pdata && pdata.extra_data && pdata.extra_data.Pin_Color) {
              pinColor = pdata.extra_data.Pin_Color;
            }
          }
        } catch (e) {
          // ignore and fall back to default
        }

        if (isTransparentColor(pinColor)) {
          map.setPaintProperty(layer.id, "circle-stroke-width", 0);
          map.setPaintProperty(
            layer.id,
            "circle-stroke-color",
            "rgba(0,0,0,0)",
          );
        } else {
          map.setPaintProperty(
            layer.id,
            "circle-stroke-color",
            mapbox_circle_stroke_color_light_mode,
          );
          map.setPaintProperty(
            layer.id,
            "circle-stroke-width",
            ICON_OUTLINE_WIDTH,
          );
        }
      }
    });

    localStorage.setItem(Map_Lighting_Mode_LocalStorage_Name, "day");
  } else if (Mode == "night") {
    map.setConfigProperty("basemap", "lightPreset", "night");

    const layers = map.getStyle().layers;
    layers.forEach((layer) => {
      if (layer.type === "circle") {
        let pinColor = null;
        try {
          const src =
            map.getSource(layer.source) && map.getSource(layer.source)._data;
          if (src && src.features && src.features.length > 0) {
            const pdata =
              src.features[0].properties && src.features[0].properties.data;
            if (pdata && pdata.extra_data && pdata.extra_data.Pin_Color) {
              pinColor = pdata.extra_data.Pin_Color;
            }
          }
        } catch (e) {
          // ignore and fall back to default
        }

        if (isTransparentColor(pinColor)) {
          map.setPaintProperty(layer.id, "circle-stroke-width", 0);
          map.setPaintProperty(
            layer.id,
            "circle-stroke-color",
            "rgba(0,0,0,0)",
          );
        } else {
          map.setPaintProperty(
            layer.id,
            "circle-stroke-color",
            mapbox_circle_stroke_color_dark_mode,
          );
          map.setPaintProperty(
            layer.id,
            "circle-stroke-width",
            ICON_OUTLINE_WIDTH,
          );
        }
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
  loadAllGeolocation();
  Initialize_Map_Extras();
});

map.on("idle", () => {
  Initialize_Layer_Control();
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

Offcanvas_Map_Info_DOM.addEventListener("hide.bs.offcanvas", () => {
  map.flyTo({
    zoom: Zoom_Level_Before_OffCanvas,
    essential: true,
  });
});
