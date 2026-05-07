let Discovery_Container_DOM = document.querySelector("#Discovery_Container");

let Discovery_Content_List = [
  {
    header: "Map",
    title: "Food Bank For NYC",
    subtitle: "Subtitle",
    img_link: "gg",
    hyperlink: "https://www.foodbanknyc.org/news-and-stories/",
    description: "Esternocleidomastodeo",
  },
  {
    header: "Data",
    title: "New York City Council",
    subtitle: "Subtitle",
    img_link: "gg",
    hyperlink: "https://council.nyc.gov/data/emergency-food-in-nyc/",
    description: "Esternocleidomastodeo",
  },
  {
    header: "Information",
    title: "Metropolitan Transportation Authority",
    subtitle: "Bathroom locations",
    img_link: "gg",
    hyperlink: "https://www.mta.info/agency/new-york-city-transit/bathrooms",
    description: "Esternocleidomastodeo",
  },
  {
    header: "Map",
    title: "Metropolitan Transportation Authority",
    subtitle: "Subway MTA Maps",
    img_link: "../Images/Subway_Diagram.jpg",
    hyperlink: "https://www.mta.info/maps",
    description: "Esternocleidomastodeo",
  },
];

function Load_All_Discovery_Content() {
  Discovery_Container_DOM.innerHTML = "";

  Discovery_Content_List.forEach((Content) => {
    if (!Content.header || !Content.title || !Content.subtitle) {
      return;
    }

    let HTML = `<div class="col-12 col-sm-5 col-md-4 card-container">
            <a target="_blank" class="text-decoration-none text-reset" href="${Content.hyperlink}">
            <div class="card mb-3">
            <h3 class="card-header">${Content.header}</h3>
            <div class="card-body">
              <h5 class="card-title">${Content.title}</h5>
              <h6 class="card-subtitle text-muted">${Content.subtitle}</h6>
            </div>

              <img class="object-fit-cover" src="${Content.img_link}" width="100%" height="200px" fill="#868e96">
            <div class="card-body">
              <p class="card-text">
                ${Content.description}
              </p>
            </div>
          </div>
          </a>
          </div>`;
    Discovery_Container_DOM.insertAdjacentHTML("beforeend", HTML);
  });
}
Load_All_Discovery_Content();