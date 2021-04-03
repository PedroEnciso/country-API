// create web components
customElements.define(
  "country-card",
  class extends HTMLElement {
    constructor() {
      super();
      let warning = document.getElementById("card-template");
      let mywarning = warning.content;
      const shadowRoot = this.attachShadow({ mode: "open" }).appendChild(
        mywarning.cloneNode(true)
      );
    }
  }
);

customElements.define(
  "detail-page",
  class extends HTMLElement {
    constructor() {
      super();
      let warning = document.getElementById("detail-template");
      let mywarning = warning.content;
      const shadowRoot = this.attachShadow({ mode: "open" }).appendChild(
        mywarning.cloneNode(true)
      );
    }
  }
);

// variables
const countrySection = document.getElementById("countries");
const inputArea = document.getElementById("input-area");
const selectArea = document.getElementById("select-area");
const AUTOCOMPLETE_OPTIONS = 4;
const input = document.getElementById("input");
const suggestionPanel = document.getElementById("suggestion-panel");
let countryNameArray = [];
let toggle = false;
const selectOptions = document.getElementById("select-options");
const icon = document.getElementById("icon");
let deg = 180;

// detail page variables
const backButton = document.getElementById("back-button");
const detailScreen = document.getElementById("detail-screen");
const detailFlag = document.getElementById("detail-flag");
const detailCountry = document.getElementById("detail-country");
const nativeName = document.getElementById("native-name");
const population = document.getElementById("population");
const region = document.getElementById("region");
const subRegion = document.getElementById("sub-region");
const capital = document.getElementById("capital");
const domain = document.getElementById("domain");
const language = document.getElementById("language");
const currency = document.getElementById("currency");
const buttonDiv = document.getElementById("buttons");

// functions

// get data from api
const getData = async () => {
  let response = await fetch("https://restcountries.eu/rest/v2/all");
  let data = response.json();
  return data;
};

const createCountryCard = (country) => {
  // create card component
  const card = document.createElement("country-card");
  card.setAttribute("id", country.name);
  card.addEventListener("click", () => createDetailPage(country));
  // create info Components
  const flag = document.createElement("img");
  const name = document.createElement("h3");
  const population = document.createElement("span");
  const region = document.createElement("span");
  const capital = document.createElement("span");
  // add info to components
  flag.src = country.flag;
  name.innerHTML = country.name;
  population.innerHTML = country.population;
  region.innerHTML = country.region;
  capital.innerHTML = country.capital;
  // add slot attribute to Components
  flag.setAttribute("slot", "flag");
  name.setAttribute("slot", "country");
  population.setAttribute("slot", "population");
  region.setAttribute("slot", "region");
  capital.setAttribute("slot", "capital");
  // add components to the country card component
  card.appendChild(flag);
  card.appendChild(name);
  card.appendChild(population);
  card.appendChild(region);
  card.appendChild(capital);
  // add country card to the country section
  countrySection.appendChild(card);
};

const createDetailPage = (country) => {
  clearScreen();
  removeButtons();
  detailFlag.src = country.flag;
  detailCountry.innerHTML = country.name;
  nativeName.innerHTML = country.nativeName;
  population.innerHTML = country.population;
  region.innerHTML = country.region;
  subRegion.innerHTML = country.subregion;
  capital.innerHTML = country.capital;
  domain.innerHTML = country.topLevelDomain;
  getCurrencies(country);
  getLanguages(country);
  createBorderButtons(country);
};

const createSpecificDetailPageWithAbbreviation = (abbreviation) => {
  fetch(`https://restcountries.eu/rest/v2/alpha/${abbreviation}`)
    .then((resp) => resp.json())
    .then((data) => {
      createDetailPage(data);
    });
};

const createSpecificDetailPageWithName = (name) => {
  fetch(`https://restcountries.eu/rest/v2/name/${name}`)
    .then((resp) => resp.json())
    .then((data) => {
      createDetailPage(data[0]);
    });
};

const getCurrencies = (country) => {
  currencyList = "";
  for (let i = 0; i < country.currencies.length; i++) {
    currencyList += country.currencies[i].name;
    if (i < country.currencies.length - 1) {
      currencyList += ", ";
    }
  }
  currency.innerHTML = currencyList;
};

const getLanguages = (country) => {
  languageList = "";
  for (let i = 0; i < country.languages.length; i++) {
    languageList += country.languages[i].name;
    if (i < country.languages.length - 1) {
      languageList += ", ";
    }
  }
  language.innerHTML = languageList;
};

const createBorderButtons = (country) => {
  for (let i = 0; i < country.borders.length; i++) {
    const button = document.createElement("BUTTON");
    button.innerHTML = country.borders[i];
    button.addEventListener("click", () => {
      createSpecificDetailPageWithAbbreviation(button.innerHTML);
    });
    buttonDiv.appendChild(button);
  }
};

const createSuggestion = (country, index, arrayLength) => {
  const button = document.createElement("button");
  button.innerHTML = country;
  button.addEventListener("click", () => {
    createSpecificDetailPageWithName(button.innerHTML);
  });
  suggestionPanel.appendChild(button);

  if (index < arrayLength - 1) {
    const hr = document.createElement("hr");
    suggestionPanel.appendChild(hr);
  }
  if (input.value === "") {
    suggestionPanel.innerHTML = "";
  }
};

const toggleFilter = () => {
  toggle
    ? (selectOptions.style.display = "none")
    : (selectOptions.style.display = "block");
  toggle = !toggle;
  icon.style.transform = `rotate(${deg}deg)`;
  deg += deg;
  if (deg > 360) {
    deg = 180;
  }
};

const clearScreen = () => {
  input.value = "";
  suggestionPanel.innerHTML = "";
  inputArea.style.display = "none";
  countrySection.style.display = "none";
  detailScreen.style.display = "block";
};

/////// CHANGE WHEN WORKING ON SELECT AREA ///////
const backToHome = () => {
  removeButtons();
  inputArea.style.display = "block";
  countrySection.style.display = "flex";
  detailScreen.style.display = "none";
};

const removeButtons = () => {
  buttonDiv.innerHTML = "";
};

// copied from google
const capitalize = (s) => {
  if (typeof s !== "string") return "";
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
};

// main logic
const main = async () => {
  const countryData = await getData();

  for (i = 0; i < countryData.length; i++) {
    createCountryCard(countryData[i]);
    countryNameArray.push(countryData[i].name);
  }
};

//event listeners
backButton.addEventListener("click", backToHome);

// autocomplete functionality
input.addEventListener("keyup", () => {
  const search = capitalize(input.value);
  suggestionPanel.innerHTML = "";
  const suggestions = countryNameArray.filter((country) => {
    return country.startsWith(search);
  });
  if (suggestions.length < AUTOCOMPLETE_OPTIONS) {
    for (let i = 0; i < suggestions.length; i++) {
      createSuggestion(suggestions[i], i, suggestions.length);
    }
  } else {
    for (let i = 0; i < AUTOCOMPLETE_OPTIONS; i++) {
      createSuggestion(suggestions[i], i, AUTOCOMPLETE_OPTIONS);
    }
  }
});

// calling functions
main();
