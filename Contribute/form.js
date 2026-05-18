let Geolocation_Container = document.querySelector("#Geolocation_Container");
let Address_Radio_Input_DOM = document.querySelector("#Address_Radio_Input");
let Address_Input_DOM = document.querySelector("#Address_Input");
let Coordinate_Radio_Input_DOM = document.querySelector(
  "#Coordinate_Radio_Input",
);
let Coordinate_Input_DOM = document.querySelector("#Coordinate_Input");
let Copy_Coordinate = document.querySelector("#Copy_Coordinate");
let Data_Suggestion = {
  email: "",
  place_name: "",
  resource_type: "",
  address: "",
  coordinate: [],
  description: "",
};

function Update_Fields() {
  if (Address_Radio_Input_DOM.checked) {
    Address_Input_DOM.disabled = false;
    Coordinate_Input_DOM.disabled = true;
  } else {
    Address_Input_DOM.disabled = true;
    Coordinate_Input_DOM.disabled = false;
  }
}

Geolocation_Container.addEventListener("change", () => {
  Update_Fields();
});
Copy_Coordinate.addEventListener("click", () => {
    let Marker_Coordinate = marker.getLngLat();
    if (Marker_Coordinate) {
        Coordinate_Input_DOM.value = JSON.stringify([
          Marker_Coordinate.lat,
          Marker_Coordinate.lng,
        ]);
        Address_Input_DOM.disabled = true;
        Coordinate_Input_DOM.disabled = false;

        Address_Radio_Input_DOM.checked = false;
        Coordinate_Radio_Input_DOM.checked = true;

    } else {
        alert("Click a location in the map first.");
    }
    
});

Update_Fields();

