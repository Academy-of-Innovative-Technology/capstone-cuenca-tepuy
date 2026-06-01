let Offcanvas_Map_Info_DOM = document.querySelector("#offcanvas_map_info");

let OffCanvas_All_Info_DOM = document.querySelector("#OffCanvas_All_Info");

// Helper: return inline SVG for a given key name (normalized)
function getKeyIcon(key) {
  if (!key) return "";
  const k = key.toString().toLowerCase().replace(/\s+/g, "_");
  const icons = {
    location_name: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="currentColor"/></svg>`,
    location_address: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z" fill="currentColor"/></svg>`,
    address: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z" fill="currentColor"/></svg>`,
    contact: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2a1 1 0 01.91-.27c1 .25 2 .39 3 .39a1 1 0 011 1V20a1 1 0 01-1 1C9.39 21 3 14.61 3 6a1 1 0 011-1h3.5a1 1 0 011 1c0 1 .14 2 .39 3 .06.34-.03.7-.27.91l-2.5 2.88z" fill="currentColor"/></svg>`,
    phone_number: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2a1 1 0 01.91-.27c1 .25 2 .39 3 .39a1 1 0 011 1V20a1 1 0 01-1 1C9.39 21 3 14.61 3 6a1 1 0 011-1h3.5a1 1 0 011 1c0 1 .14 2 .39 3 .06.34-.03.7-.27.91l-2.5 2.88z" fill="currentColor"/></svg>`,
    phone: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2a1 1 0 01.91-.27c1 .25 2 .39 3 .39a1 1 0 011 1V20a1 1 0 01-1 1C9.39 21 3 14.61 3 6a1 1 0 011-1h3.5a1 1 0 011 1c0 1 .14 2 .39 3 .06.34-.03.7-.27.91l-2.5 2.88z" fill="currentColor"/></svg>`,
    email: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" fill="currentColor"/></svg>`,
    website: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2a10 10 0 100 20 10 10 0 000-20zm1 17.93V20h-2v-.07A8.001 8.001 0 014.07 13H4v-2h.07A8.001 8.001 0 0111 4.07V4h2v.07A8.001 8.001 0 0119.93 11H20v2h-.07A8.001 8.001 0 0113 19.93z" fill="currentColor"/></svg>`,
    provider: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 3L2 9l10 6 10-6-10-6zm0 7l-7-4v6l7 4 7-4V6l-7 4z" fill="currentColor"/></svg>`,
    place_name: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2a7 7 0 00-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 00-7-7zm0 9.5A2.5 2.5 0 1112 6.5a2.5 2.5 0 010 5z" fill="currentColor"/></svg>`,
    train_lines: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2c-4.97 0-9 1.79-9 4v8c0 2.21 4.03 4 9 4s9-1.79 9-4V6c0-2.21-4.03-4-9-4zm-4 9h8v2H8v-2z" fill="currentColor"/></svg>`,
    comments: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M21 6h-18v11h4v3l3-3h11z" fill="currentColor"/></svg>`,
    borough: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L2 7l10 5 10-5-10-5zm0 7.5L7 8v6l5 2.5L17 14V8l-5 1.5z" fill="currentColor"/></svg>`,
    postcode: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="3" width="18" height="14" rx="2" ry="2" fill="currentColor"/></svg>`,
    latitude: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2a10 10 0 100 20 10 10 0 000-20zM7 13h10v2H7v-2z" fill="currentColor"/></svg>`,
    longitude: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c3.24 0 6.13-1.57 7.95-4H12V2z" fill="currentColor"/></svg>`,
    coordinates: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9a2 2 0 110-4 2 2 0 010 4z" fill="currentColor"/></svg>`,
    community_board: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 13h18v-2H3v2zm0 4h12v-2H3v2zM3 7h18V5H3v2z" fill="currentColor"/></svg>`,
    council_district: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2l7 7-7 7-7-7 7-7zm0 10l5-5-5-5-5 5 5 5z" fill="currentColor"/></svg>`,
    census_tract: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="3" fill="currentColor"/></svg>`,
    bin: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="6" y="7" width="12" height="12" rx="2" fill="currentColor"/></svg>`,
    bbl: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 6h16v2H4V6zm2 4h12v8H6v-8z" fill="currentColor"/></svg>`,
    nta: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L2 7l10 5 10-5-10-5z" fill="currentColor"/></svg>`,
    homebase_office: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 3l9 7-1 11H4L3 10l9-7z" fill="currentColor"/></svg>`,
    service_area_zip_code: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 4h18v2H3V4zm0 4h12v10H3V8z" fill="currentColor"/></svg>`,
    name: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="8" r="3" fill="currentColor"/><path d="M6 20c1-4 11-4 12 0H6z" fill="currentColor"/></svg>`,
    center_name: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="8" r="3" fill="currentColor"/><path d="M6 20c1-4 11-4 12 0H6z" fill="currentColor"/></svg>`,
    default: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10" fill="currentColor"/></svg>`,
  };
  return icons[k] || icons["default"];
}

function Open_All_Off_Canvas_Information() {
  const h1 = document.querySelector("#headingOne");
  if (h1 && !h1.classList.contains("visually-hidden")) {
    const target = document.getElementById("collapseOne");
    const button = document.querySelector('[data-bs-target="#collapseOne"]');
    if (target) target.classList.add("show");
    if (button) {
      button.classList.remove("collapsed");
      button.setAttribute("aria-expanded", "true");
    }
  }

  const h2 = document.querySelector("#headingTwo");
  if (h2 && !h2.classList.contains("visually-hidden")) {
    const target2 = document.getElementById("collapseTwo");
    const button2 = document.querySelector('[data-bs-target="#collapseTwo"]');
    if (target2) target2.classList.add("show");
    if (button2) {
      button2.classList.remove("collapsed");
      button2.setAttribute("aria-expanded", "true");
    }
  }
}

function Close_All_Off_Canvas_Accordion_Main_Information() {
  const target = document.getElementById("collapseOne");
  const button = document.querySelector('[data-bs-target="#collapseOne"]');
  if (target) target.classList.remove("show");
  if (button) {
    button.classList.add("collapsed");
    button.setAttribute("aria-expanded", "false");
  }
}

function Close_All_Off_Canvas_Accordion_Extra_Information() {
  const secondAccordion = document.querySelector("#collapseTwo");
  if (secondAccordion) {
    const bsCollapse = new bootstrap.Collapse(secondAccordion, {
      toggle: false,
    });
    bsCollapse.hide();
  }
}
function Is_Only_Extra_Data(object) {
  let result = true;
  for (const [key, value] of Object.entries(object)) {
    if (key != "extra_data") {
      result = false;
    }
  }
  return result;
}

let Off_Canvas_Information_Order_Priority = [
  "location name",
  "location address",
  "contact",
  "train lines",
  "comments",
  "borough",
  "latitude",
  "longitude",
];

let Train_Line_Colors = {
  A: { text_color: "white", background_color: "#0039A6" }, // blue
  B: { text_color: "white", background_color: "#FF6319" }, // orange
  C: { text_color: "white", background_color: "#0039A6" }, // blue
  D: { text_color: "white", background_color: "#FF6319" }, // orange
  E: { text_color: "white", background_color: "#0039A6" }, // blue
  F: { text_color: "white", background_color: "#FF6319" }, // orange
  M: { text_color: "white", background_color: "#FF6319" }, // orange
  G: { text_color: "white", background_color: "#6CBE45" }, // green

  1: { text_color: "white", background_color: "#EE352E" }, // red
  2: { text_color: "white", background_color: "#EE352E" },
  3: { text_color: "white", background_color: "#EE352E" },

  4: { text_color: "white", background_color: "#00933C" }, // green
  5: { text_color: "white", background_color: "#00933C" },
  6: { text_color: "white", background_color: "#00933C" },

  7: { text_color: "white", background_color: "#B933AD" }, // purple

  N: { text_color: "black", background_color: "#FCCC0A" }, // yellow
  Q: { text_color: "black", background_color: "#FCCC0A" },
  R: { text_color: "black", background_color: "#FCCC0A" },
  W: { text_color: "black", background_color: "#FCCC0A" },

  J: { text_color: "white", background_color: "#996633" }, // brown
  Z: { text_color: "white", background_color: "#996633" },

  L: { text_color: "black", background_color: "#A7A9AC" }, // gray
  S: { text_color: "black", background_color: "#A7A9AC" }, // shuttle
};

function Process_Train_Lines_As_Icons(list) {
  if (!list) {
    return;
  }
  let Result;
  let Station_HTML = ``;
  list.forEach((line) => {
    let Line_Color_BG = Train_Line_Colors[line].background_color || "white";
    let Line_Color_Text = Train_Line_Colors[line].text_color || "white";
    let HTML = `<div class="rounded-circle ratio ratio-1x1 overflow-hidden" style="background-color: ${Line_Color_BG}; width: 40px; height: 40px;"><span class="d-flex justify-content-center align-items-center h4" style="color:${Line_Color_Text};">${line}</span></div>`;
    Station_HTML += HTML;
  });

  Result = `<div class="d-flex flex-fill gap-2">${Station_HTML}</div>`;

  return Result;
}

function Load_Data_Into_Container(Data, Destination_DOM, IgnoreList) {
  let List_Data = [];
  Destination_DOM.innerHTML = "";
  // Build entries array and intelligently detect coordinates.
  const entries = Object.entries(Data || {});

  // normalize ignore list to lowercase for case-insensitive comparisons
  const ignoreLower = (IgnoreList || []).map((k) => k.toString().toLowerCase());

  function findLatLon(obj) {
    if (!obj || typeof obj !== "object") return null;
    const keys = Object.keys(obj);
    const lower = keys.reduce((acc, k) => {
      acc[k.toLowerCase()] = k;
      return acc;
    }, {});
    const latKey = lower["latitude"] || lower["lat"];
    const lonKey =
      lower["longitude"] || lower["lon"] || lower["lng"] || lower["long"];
    if (latKey && lonKey) {
      return { lat: obj[latKey], lon: obj[lonKey], source: "object" };
    }
    // GeoJSON check: geometry.coordinates [lon, lat]
    if (obj.geometry && Array.isArray(obj.geometry.coordinates)) {
      const coords = obj.geometry.coordinates;
      if (coords.length >= 2)
        return { lat: coords[1], lon: coords[0], source: "geometry" };
    }
    return null;
  }

  // 1) Try top-level
  let found = findLatLon(Data);
  // 2) Fallback: check Data.metadata
  if (!found && Data && typeof Data.metadata === "object") {
    found = findLatLon(Data.metadata);
  }
  // 3) Fallback: if Data has coordinates as array
  if (
    !found &&
    Array.isArray(Data.coordinates) &&
    Data.coordinates.length >= 2
  ) {
    found = {
      lat: Data.coordinates[0],
      lon: Data.coordinates[1],
      source: "coords_array",
    };
  }

  if (
    found &&
    !ignoreLower.includes("latitude") &&
    !ignoreLower.includes("longitude")
  ) {
    const coordsDisplay = `${found.lat}, ${found.lon}`;
    List_Data.push({
      key_name: "coordinates",
      content: coordsDisplay,
      originalKey: "coordinates",
    });
    // remove raw lat/lon from data and metadata so they don't render separately
    try {
      if (Object.prototype.hasOwnProperty.call(Data, "latitude"))
        delete Data.latitude;
      if (Object.prototype.hasOwnProperty.call(Data, "longitude"))
        delete Data.longitude;
      if (Data && typeof Data.metadata === "object") {
        if (Object.prototype.hasOwnProperty.call(Data.metadata, "latitude"))
          delete Data.metadata.latitude;
        if (Object.prototype.hasOwnProperty.call(Data.metadata, "longitude"))
          delete Data.metadata.longitude;
        if (Object.prototype.hasOwnProperty.call(Data.metadata, "lat"))
          delete Data.metadata.lat;
        if (Object.prototype.hasOwnProperty.call(Data.metadata, "lon"))
          delete Data.metadata.lon;
      }
    } catch (e) {
      // ignore
    }
  }
  // helper: consider strings with only whitespace, empty arrays, and objects with no meaningful fields as "empty"
  function isEmptyContent(v) {
    if (v === null || v === undefined) return true;
    if (typeof v === "string") return v.toString().trim() === "";
    if (Array.isArray(v))
      return v.length === 0 || v.every((el) => isEmptyContent(el));
    if (typeof v === "object") {
      const ks = Object.keys(v);
      if (ks.length === 0) return true;
      // if all nested values are empty, treat as empty
      for (const val of Object.values(v)) {
        if (!isEmptyContent(val)) return false;
      }
      return true;
    }
    // numbers, booleans, and other primitives are considered non-empty
    return false;
  }

  for (const [key, value] of entries) {
    // if lat/lon were detected in this object, skip the raw fields when present
    if (
      found &&
      (key.toLowerCase() === "latitude" ||
        key.toLowerCase() === "longitude" ||
        key.toLowerCase() === "lat" ||
        key.toLowerCase() === "lon" ||
        key.toLowerCase() === "lng" ||
        key.toLowerCase() === "long")
    )
      continue;
    if (value == null || ignoreLower.includes(key.toString().toLowerCase())) {
      continue; // Avoid null values and metadata
    }
    // skip empty strings, empty arrays, or objects with no meaningful fields
    if (isEmptyContent(value)) continue;
    let Formatted_Key_Name = Properties_Name[key] || key;
    List_Data.push({
      key_name: Formatted_Key_Name,
      content: value,
      originalKey: key,
    });
  }
  List_Data.sort((a, b) => {
    let nameA = a.key_name.toLowerCase();
    let nameB = b.key_name.toLowerCase();
    let indexA = Off_Canvas_Information_Order_Priority.indexOf(nameA);
    let indexB = Off_Canvas_Information_Order_Priority.indexOf(nameB);

    if (indexA == -1) {
      indexA = Infinity;
    }
    if (indexB == -1) {
      indexB = Infinity;
    }
    if (indexA !== indexB) {
      return indexA - indexB;
    }
    return nameA.localeCompare(nameB);
  });

  List_Data.forEach((Item) => {
    let Content = "";
    // special handling: if this item is coordinates (we'll check originalKey later)
    // If we created a combined coordinates entry, render it as a kv row with a copy button
    if (
      (Item.key_name &&
        Item.key_name.toString().toLowerCase() === "coordinates") ||
      Item.originalKey === "coordinates"
    ) {
      Content = `<div class="offcanvas-kv d-flex justify-content-start gap-2 align-items-center"><div class="kv-key text-muted small d-flex">${getKeyIcon("coordinates")} <span class="kv-key-text text-capitalize">coordinates:</span></div><div class="kv-value text-break">${Item.content}</div><button class="btn btn-sm btn-outline-light copy-coords-btn" data-coords="${Item.content}" title="Copy coordinates">Copy</button></div>`;
    } else if (
      typeof Item.content == "object" &&
      !Array.isArray(Item.content)
    ) {
      Content += `<div class="offcanvas-keyvalue-list">`;
      for (const [key, value] of Object.entries(Item.content)) {
        if (value == null) {
          continue;
        } // Skips if the section have a null field
        // skip nested extra/internal fields
        const kn = key.toString().toLowerCase();
        if (kn === "extra_data" || ignoreLower.includes(kn)) continue;
        Content += `<div class="offcanvas-kv d-flex justify-content-start gap-2"><div class="kv-key text-muted small text-capitalize">${getKeyIcon(key)} <span class="kv-key-text text-capitalize">${key}:</span></div><div class="kv-value text-break">${value}</div></div>`;
      }
      Content += `</div>`;
    } else if (Array.isArray(Item.content)) {
      if (Item.key_name == "train lines") {
        Content = Process_Train_Lines_As_Icons(Item.content);
      } else {
        Item.content.forEach((element) => {
          Content += `<p class="text-break">${element} </p>`;
        });
      }
    } else {
      // scalar values (string/number) -> render as a key/value row so
      // data-key attributes are applied and latitude/longitude can be
      // combined into a single coordinates entry
      if (Item.content || Item.content === 0) {
        // prepare the inner value HTML (links for addresses)
        let valueHtml = "";
        if (Item.key_name == "location address") {
          valueHtml = `<a target="_blank" href="${Google_Maps_Search_Link(Item.content)}" class="text-break">${Item.content}</a>`;
        } else {
          valueHtml = `<span class="text-break">${Item.content}</span>`;
        }

        Content = `<div class="offcanvas-kv d-flex justify-content-start gap-2 align-items-center"><div class="kv-key text-muted small text-capitalize d-flex align-items-center">${getKeyIcon(Item.key_name)} <span class="kv-key-text text-capitalize">${Item.key_name}:</span></div><div class="kv-value text-break">${valueHtml}</div></div>`;
      }
    }
    if (Content == "") {
      return;
    }
    // If this item represents separate latitude and longitude, render them together
    let keyNormalized = (Item.originalKey || Item.key_name || "")
      .toString()
      .toLowerCase();
    // create coordinates combined view if both present in parent data
    let HTML = `
      <div class="OffCanvas_Informations_Wrappers card mb-3">
        <div class="card-body p-3">
          <h3 class="h6 mb-2 text-capitalize">${getKeyIcon(Item.key_name)} ${Item.key_name}</h3>
          <div class="offcanvas-content">${Content}</div>
        </div>
      </div>
    `;
    Destination_DOM.insertAdjacentHTML("beforeend", HTML);
  });
  // After inserting content, the data-key attributes will be set below;
  // coordinate combination and copy handlers are applied after that.

  // add data-key attributes to kv-value elements so we can find them easily
  Destination_DOM.querySelectorAll(".offcanvas-kv").forEach((kv) => {
    const keyText = kv.querySelector(".kv-key-text");
    const val = kv.querySelector(".kv-value");
    if (keyText && val) {
      const k = keyText.textContent
        .replace(":", "")
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "_");
      val.setAttribute("data-key", k);
    }
  });

  // Combine latitude+longitude into a single coordinates row if both exist
  const latElFinal = Destination_DOM.querySelector(
    '.kv-value[data-key="latitude"]',
  );
  const lonElFinal = Destination_DOM.querySelector(
    '.kv-value[data-key="longitude"]',
  );
  if (latElFinal && lonElFinal) {
    try {
      const lat = latElFinal.textContent.trim();
      const lon = lonElFinal.textContent.trim();
      const coordRow = document.createElement("div");
      coordRow.className =
        "offcanvas-kv d-flex justify-content-start gap-2 align-items-center";
      coordRow.innerHTML = `
        <div class="kv-key text-muted small"><span class="kv-icon">${getKeyIcon("coordinates")}</span> <span class="kv-key-text">coordinates:</span></div>
        <div class="kv-value text-break">${lat}, ${lon}</div>
        <button class="btn btn-sm btn-outline-light copy-coords-btn" data-coords="${lat},${lon}" title="Copy coordinates">Copy</button>
      `;
      const parentCard = latElFinal.closest(".card-body");
      if (parentCard)
        parentCard
          .querySelector(".offcanvas-content")
          .insertAdjacentElement("afterbegin", coordRow);
      latElFinal.closest(".offcanvas-kv")?.remove();
      lonElFinal.closest(".offcanvas-kv")?.remove();
    } catch (e) {
      // ignore
    }
  }

  // attach copy-to-clipboard handlers
  Destination_DOM.querySelectorAll(".copy-coords-btn").forEach((btn) => {
    btn.addEventListener("click", (ev) => {
      const coords = btn.getAttribute("data-coords");
      if (navigator.clipboard && coords) {
        navigator.clipboard
          .writeText(coords)
          .then(() => {
            btn.textContent = "Copied";
            setTimeout(() => (btn.textContent = "Copy"), 1500);
          })
          .catch(() => {
            // fallback
            const ta = document.createElement("textarea");
            ta.value = coords;
            document.body.appendChild(ta);
            ta.select();
            try {
              document.execCommand("copy");
              btn.textContent = "Copied";
            } catch (e) {}
            ta.remove();
            setTimeout(() => (btn.textContent = "Copy"), 1500);
          });
      }
    });
  });
}
function Is_Only_Meta_Data(object) {
  let result = true;
  console.log(object);
  for (const [key, value] of Object.entries(object)) {
    if (key != "metadata" && value != null) {
      result = false;
    }
  }
  return result;
}

async function Load_Data_Off_Canvas(Data) {
  //Close_All_Off_Canvas_Accordion_Extra_Information();
  const API_DATA_MANAGER = new DataProcessor(
    Data,
    Data.extra_data.Processing_Method,
  );
  const Standarized_Data = await API_DATA_MANAGER.process();

  // Merge main standardized data and metadata into a single object for rendering
  const merged = Object.assign({}, Standarized_Data);
  if (
    Standarized_Data.metadata &&
    typeof Standarized_Data.metadata === "object"
  ) {
    // copy metadata fields into merged, but avoid overwriting top-level keys
    for (const [k, v] of Object.entries(Standarized_Data.metadata)) {
      if (merged[k] === undefined) merged[k] = v;
    }
  }

  // Render everything together into the single offcanvas container
  OffCanvas_All_Info_DOM.innerHTML = "";
  // hide metadata and extra_data (we don't want internal processing fields shown)
  Load_Data_Into_Container(merged, OffCanvas_All_Info_DOM, [
    "metadata",
    "extra_data",
  ]);

  const bsOffcanvas = new bootstrap.Offcanvas(Offcanvas_Map_Info_DOM);
  bsOffcanvas.show();
}
