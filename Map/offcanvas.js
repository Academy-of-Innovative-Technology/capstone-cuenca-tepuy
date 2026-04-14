let Offcanvas_Map_Info_DOM = document.querySelector("#offcanvas_map_info");

let OffCanvas_Main_Info_DOM = document.querySelector("#OffCanvas_Main_Info");
let OffCanvas_Extra_Info_DOM = document.querySelector("#OffCanvas_Extra_Info");

let Main_Info_Categories = ["place_name", "place.address"];

function Close_All_Off_Canvas_Accordion_Extra_Information() {
  const secondAccordion = document.querySelector("#collapseTwo");
  const bsCollapse = new bootstrap.Collapse(secondAccordion, {
    toggle: false,
  });
  bsCollapse.hide();
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
  "center name",
  "place address",
  "contact",
  "comments",
  "borough",
  "latitude",
  "longitude",
];

function Load_Data_Into_Container(Data, Destination_DOM, IgnoreList) {
  let List_Data = [];
  Destination_DOM.innerHTML = "";
  for (const [key, value] of Object.entries(Data)) {
    if (value == null || IgnoreList.includes(key)) {
      continue; // Avoid null values and metadata
    }
    let Formatted_Key_Name = Properties_Name[key] || key;
    List_Data.push({ key_name: Formatted_Key_Name, content: value });
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
      console.log(a.key_name + " vs " + b.key_name);
      return indexA - indexB;
    }
    console.log(a.key_name + " alphabetically vs " + b.key_name);
    return nameA.localeCompare(nameB);
  });
  console.log(List_Data);
  List_Data.forEach((Item) => {
    let Content;
    if (typeof Item.content == "object") {
      Content = "";
      for (const [key, value] of Object.entries(Item.content)) {
        if (value == null) {
          continue;
        } // Skips if the section have a null field
        Content += `<p class="text-break">${key}: ${value}</p>`;
      }
    } else {
      Content = `<p class="text-break">${Item.content}</p>`;
    }
    if (Content == "") {
      return;
    }
    let HTML = `<div class="OffCanvas_Informations_Wrappers p-2 rounded">
      <h2 class="text-primary border-bottom border-primary border-3 text-capitalize">${Item.key_name}</h2>
      ${Content}
    </div>`;
    Destination_DOM.insertAdjacentHTML("beforeend", HTML);
  });
}
async function Load_Data_Off_Canvas(Data) {
  console.log(Data.extra_data.Processing_Method);
  Close_All_Off_Canvas_Accordion_Extra_Information();
  const API_DATA_MANAGER = new DataProcessor(
    Data,
    Data.extra_data.Processing_Method,
  );
  const Standarized_Data = await API_DATA_MANAGER.process();

  Load_Data_Into_Container(Standarized_Data, OffCanvas_Main_Info_DOM, [
    "metadata",
  ]);

  if (
    Standarized_Data.metadata &&
    !Is_Only_Extra_Data(Standarized_Data.metadata)
  ) {
    document.querySelector("#headingTwo").classList.remove("visually-hidden");
    Load_Data_Into_Container(
      Standarized_Data.metadata,
      OffCanvas_Extra_Info_DOM,
      ["extra_data"],
    );
  } else {
    document.querySelector("#headingTwo").classList.add("visually-hidden");
    OffCanvas_Extra_Info_DOM.innerHTML =
      "This center does not have extra information";
  }

  const bsOffcanvas = new bootstrap.Offcanvas(Offcanvas_Map_Info_DOM);
  bsOffcanvas.show();
}
