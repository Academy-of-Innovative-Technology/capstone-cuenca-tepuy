let Offcanvas_Map_Info_DOM = document.querySelector("#offcanvas_map_info");

let OffCanvas_Main_Info_DOM = document.querySelector("#OffCanvas_Main_Info");
let OffCanvas_Extra_Info_DOM = document.querySelector("#OffCanvas_Extra_Info");

function Open_All_Off_Canvas_Information() {
  

  if (!document.querySelector("#headingOne").classList.contains("visually-hidden")) {
    const target = document.getElementById("collapseOne");
    const button = document.querySelector('[data-bs-target="#collapseOne"]');
    target.classList.add("show");
    button.classList.remove("collapsed");
    button.setAttribute("aria-expanded", "true");
  }

  if (
    !document.querySelector("#headingTwo").classList.contains("visually-hidden")
  ) {
    const target2 = document.getElementById("collapseTwo");
    const button2 = document.querySelector('[data-bs-target="#collapseTwo"]');
    target2.classList.add("show");
    button2.classList.remove("collapsed");
    button2.setAttribute("aria-expanded", "true");
  }


}

function Close_All_Off_Canvas_Accordion_Main_Information() {
  const target = document.getElementById("collapseOne");
  const button = document.querySelector('[data-bs-target="#collapseOne"]');

  target.classList.remove("show");
  button.classList.add("collapsed");
  button.setAttribute("aria-expanded", "false");
}

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
  })

  Result = `<div class="d-flex flex-fill gap-2">${Station_HTML}</div>`

  return Result;
}

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
      return indexA - indexB;
    }
    return nameA.localeCompare(nameB);
  });

  List_Data.forEach((Item) => {
    let Content = "";
    if (typeof Item.content == "object" && !Array.isArray(Item.content)) {
      for (const [key, value] of Object.entries(Item.content)) {
        if (value == null) {
          continue;
        } // Skips if the section have a null field
        Content += `<p class="text-break">${key}: ${value}</p>`;
      }
    } else if (Array.isArray(Item.content)) {
      if (Item.key_name == "train lines") {
        Content = Process_Train_Lines_As_Icons(Item.content);
      } else {
        Item.content.forEach((element) => {
          Content += `<p class="text-break">${element} </p>`;
        });
      }
      

    } else {
      if (Item.content) {
        console.log(Item);
        if (Item.key_name == "location address") {
          Content = `<a target="_blank" href="${Google_Maps_Search_Link(Item.content)}" class="text-break ">${Item.content}</a>`;
        } else {
          Content = `<p class="text-break">${Item.content}</p>`;
        }
        
      }  
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
  Close_All_Off_Canvas_Accordion_Extra_Information();
  const API_DATA_MANAGER = new DataProcessor(
    Data,
    Data.extra_data.Processing_Method,
  );
  const Standarized_Data = await API_DATA_MANAGER.process();
  Open_All_Off_Canvas_Information();
 
  if (!Is_Only_Meta_Data(Standarized_Data)) {
    document.querySelector("#headingOne").classList.remove("visually-hidden");
     Load_Data_Into_Container(Standarized_Data, OffCanvas_Main_Info_DOM, [
    "metadata",
     ]);
    Close_All_Off_Canvas_Accordion_Extra_Information();
  } else {
    document.querySelector("#headingOne").classList.add("visually-hidden");
    OffCanvas_Main_Info_DOM.innerHTML =
      "This center does not have extra information";
    Close_All_Off_Canvas_Accordion_Main_Information();
    console.log("Test");
  }

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



