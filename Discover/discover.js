let Discovery_Container_DOM = document.querySelector("#Discovery_Container");

let Discovery_Content_List = [
  {
    header: "Header",
    title: "Title",
    subtitle: "Subtitle",
    img_link: "gg",
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
            <div class="card mb-3">
            <h3 class="card-header">${Content.header}</h3>
            <div class="card-body">
              <h5 class="card-title">${Content.title}</h5>
              <h6 class="card-subtitle text-muted">${Content.subtitle}</h6>
            </div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="d-block user-select-none"
              width="100%"
              height="200"
              aria-label="Placeholder: Image cap"
              focusable="false"
              role="img"
              preserveAspectRatio="xMidYMid slice"
              viewBox="0 0 318 180"
              style="font-size: 1.125rem; text-anchor: middle"
            >
              <img src="${Content.img_link}" width="100%" height="100%" fill="#868e96">
              <text x="50%" y="50%" fill="#dee2e6" dy=".3em">Image cap</text>
            </svg>
            <div class="card-body">
              <p class="card-text">
                ${Content.description}
              </p>
            </div>
          </div>
          </div>`;
    Discovery_Container_DOM.insertAdjacentHTML("beforeend", HTML);
  });
}
Load_All_Discovery_Content();