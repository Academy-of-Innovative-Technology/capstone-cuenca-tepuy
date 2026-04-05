let Offcanvas_Map_Info_DOM = document.querySelector("#offcanvas_map_info");
let Offcanvas_Map_Info_Body_DOM =
    Offcanvas_Map_Info_DOM.querySelector(".offcanvas-body");
  
function Load_Data_Off_Canvas(Data) {
  let Info = Data;
  console.log("Load Canvas Info");
  console.log(Info);
  Offcanvas_Map_Info_Body_DOM.innerHTML = "";
  for (const [key, value] of Object.entries(Info)) {
    //console.log(`${key}: ${value}`);

    if (value == null) {
      continue;
    }
    let Formatted_Key_Name = key;
    if (Properties_Name[key]) {
      Formatted_Key_Name = Properties_Name[key];
    }
      
    let HTML = `<div>
      <h2>${Formatted_Key_Name}</h2>
      <p>${JSON.stringify(value)}</p>
    </div>`;
      
    // if (key == "address") {
    //   HTML = `<div>
    //   <h2>${key}</h2>
    //   <a target="_blank" href="${Google_Maps_Search_Link(value)}"><p>${value}</p></a>
    // </div>`;
    // }

    Offcanvas_Map_Info_Body_DOM.insertAdjacentHTML("beforeend", HTML);
  }

  const bsOffcanvas = new bootstrap.Offcanvas(Offcanvas_Map_Info_DOM);
  bsOffcanvas.show();
}
