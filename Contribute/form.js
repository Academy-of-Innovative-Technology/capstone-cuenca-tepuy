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
  Data_Suggestion.email = document.querySelector("#Email_Address").value;
  Data_Suggestion.place_name = document.querySelector("#Place_Name").value;
  Data_Suggestion.resource_type = document.querySelector("#Resource_Type_Datalist_Input");
  Data_Suggestion.address = document.querySelector("#Address_Input").value;
  Data_Suggestion.coordinate = document.querySelector("#Coordinate_Input").value;
  Data_Suggestion.description =
    document.querySelector("#Description_Input").value;
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

let Email_Send = "recipient@example.com";
let Email_Subject = "Suggest a new Location";


function sendEmail() {

  let Geolocation_Retrieval;
  if (Address_Radio_Input_DOM.checked && Data_Suggestion.address != "") {
    Geolocation_Retrieval = Data_Suggestion.address;
  } else if (Coordinate_Radio_Input_DOM.checked && Data_Suggestion.coordinate) {
    Geolocation_Retrieval = CoordiData_Suggestionnate_Input_DOM.coordinate;
  }

  let Data = {
    Email_From: Data_Suggestion.email,
    Place_Name: Data_Suggestion.place_name,
    Resource_Type: Data_Suggestion.resource_type,
    Geolocation: Geolocation_Retrieval,
    Description: Data_Suggestion.description
  }

  const body = Data;
  window.open (`mailto:${Email_Send}?subject=${Email_Subject}&body=${encodeURIComponent(body)}`, "_blank");
}
let Suggestion_Form_DOM = document.querySelector("#Suggestion_Form_DOM");
document.querySelector("#Submit_BTN").addEventListener("click", () => {
  if (Suggestion_Form_DOM.checkValidity()) {
    sendEmail();
  }
});