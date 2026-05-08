let Discovery_Container_DOM = document.querySelector("#Discovery_Container");

let Discovery_Content_List = [
  {
    header: "Map",
    title: "Food Bank For NYC",
    subtitle: "Food Pastries Locations",
    img_link: "../Images/Food_Bank_For_NYC_SS.png",
    hyperlink: "https://www.foodbanknyc.org/news-and-stories/",
    description:
      "introduces one of the largest anti-hunger organizations in New York City. <br> Its mission is to help ensure that all New Yorkers have stable access to food and basic resources.",
  },
  {
    header: "Data",
    title: "New York City Council",
    subtitle: "Food Insecurity in NYC Map",
    img_link:
      "https://council.nyc.gov/wp-content/uploads/2025/05/livestream-overlay2.png",
    hyperlink: "https://council.nyc.gov/data/emergency-food-in-nyc/",
    description:
      "NYC offers emergency food assistance through hundreds of food pantries and community kitchens across the five boroughs. <br> The program helps connect residents to free meals and groceries, especially in neighborhoods facing high food insecurity.",
  },
  {
    header: "Information",
    title: "Metropolitan Transportation Authority",
    subtitle: "Bathroom Locations",
    img_link: "../Images/Subway_Bathroom_SS.png",
    hyperlink: "https://www.mta.info/agency/new-york-city-transit/bathrooms",
    description:
      "The NYC MTA provides public bathrooms at many subway stations across the city. <br> These facilities are regularly maintained and upgraded to improve cleanliness and accessibility.",
  },
  {
    header: "Map",
    title: "Metropolitan Transportation Authority",
    subtitle: "Subway MTA Maps",
    img_link: "../Images/Subway_Diagram.jpg",
    hyperlink: "https://www.mta.info/maps",
    description:
      "The NYC MTA provides subway, bus, and railroad maps to help riders navigate the transit system across all five boroughs. <br> These maps include subway routes, bus lines, accessibility information, and real-time service updates.",
  },
];

function Load_All_Discovery_Content() {
  Discovery_Container_DOM.innerHTML = "";

  Discovery_Content_List.forEach((Content) => {
    if (!Content.header || !Content.title || !Content.subtitle) {
      return;
    }

    let HTML = `<div class="col-12 col-md-5 card-container">
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