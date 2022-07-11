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
const africa = document.getElementById("africa");
const asia = document.getElementById("asia");
const americas = document.getElementById("americas");
const europe = document.getElementById("europe");
const oceania = document.getElementById("oceania");
const none = document.getElementById("none");
const body = document.querySelector("body");
const button = document.getElementById("dark-mode");
let isDark = false;

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
  let response = await fetch("https://restcountries.com/v3.1/all");
  let data = response.json();
  return data;
};

const createCountryCard = (country) => {
  // create card component
  const card = document.createElement("country-card");
  card.setAttribute("id", country.name.common);
  card.addEventListener("click", () => createDetailPage(country));
  // create info Components
  const flag = document.createElement("img");
  const name = document.createElement("h3");
  const population = document.createElement("span");
  const region = document.createElement("span");
  const capital = document.createElement("span");
  // add info to components
  flag.src = country.flags.svg;
  name.innerHTML = country.name.common;
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
  detailFlag.src = country.flags.svg;
  detailCountry.innerHTML = country.name.common;

  const nameKeys = Object.keys(country.name.nativeName);
  const nativeAbb = nameKeys[0];
  nativeName.innerHTML = country.name.nativeName[nativeAbb].official;
  population.innerHTML = country.population;
  region.innerHTML = country.region;
  subRegion.innerHTML = country.subregion;
  capital.innerHTML = country.capital;
  domain.innerHTML = country.tld;
  getCurrencies(country);
  getLanguages(country);
  createBorderButtons(country);
};

const createSpecificDetailPageWithAbbreviation = (abbreviation) => {
  fetch(`https://restcountries.com/v3.1/alpha/${abbreviation}`)
    .then((resp) => resp.json())
    .then((data) => {
      // this endpoint returns an array
      createDetailPage(data[0]);
    });
};

const createSpecificDetailPageWithName = (name) => {
  fetch(`https://restcountries.com/v3.1/name/${name}`)
    .then((resp) => resp.json())
    .then((data) => {
      createDetailPage(data[0]);
    });
};

const getCurrencies = (country) => {
  currencyList = [];
  const currencies = Object.keys(country.currencies);
  currencies.forEach((currency) => {
    const currencyName = `${country.currencies[currency].name} (${country.currencies[currency].symbol})`;
    currencyList.push(currencyName);
  });
  currency.innerHTML = currencyList.join(", ");
};

const getLanguages = (country) => {
  languageList = [];
  const languages = Object.keys(country.languages);
  languages.forEach((language) => {
    languageList.push(country.languages[language]);
  });

  language.innerHTML = languageList.join(", ");
};

const createBorderButtons = (country) => {
  if (!country.borders) {
    const p = document.createElement("p");
    const message = "There are no bordering countries.";
    p.innerText = message;
    buttonDiv.appendChild(p);
  } else {
    country.borders.forEach((border) => {
      const button = document.createElement("BUTTON");
      button.innerHTML = border;
      button.addEventListener("click", () => {
        createSpecificDetailPageWithAbbreviation(button.innerHTML);
      });
      buttonDiv.appendChild(button);
    });
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
  rotateIcon();
};

const toggleDarkMode = () => {
  isDark ? body.classList.remove("darkmode") : body.classList.add("darkmode");
  isDark = !isDark;
};

const filterCountries = (e) => {
  const filterName = e.target.innerHTML;
  main(filterName);
};

const clearScreen = () => {
  input.value = "";
  suggestionPanel.innerHTML = "";
  inputArea.style.visibility = "hidden";
  inputArea.style.height = "0";
  countrySection.style.display = "none";
  detailScreen.style.display = "block";
};

const backToHome = () => {
  removeButtons();
  inputArea.style.visibility = "visible";
  inputArea.style.height = "auto";
  countrySection.style.display = "flex";
  detailScreen.style.display = "none";
};

const rotateIcon = () => {
  icon.style.transform = `rotate(${deg}deg)`;
  deg += deg;
  if (deg > 360) {
    deg = 180;
  }
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
const main = async (filter) => {
  const countryData = await getData();

  if (filter === "None") {
    countrySection.innerHTML = "";
    // create a card for every country
    countryData.forEach((country) => {
      createCountryCard(country);
      countryNameArray.push(country.name.common);
    });
  } else {
    countrySection.innerHTML = "";
    const filteredCountries = countryData.filter(
      (country) => country.region === filter
    );
    filteredCountries.forEach((country) => {
      createCountryCard(country);
    });
  }
};

//event listeners
backButton.addEventListener("click", backToHome);
africa.addEventListener("click", filterCountries);
asia.addEventListener("click", filterCountries);
americas.addEventListener("click", filterCountries);
europe.addEventListener("click", filterCountries);
oceania.addEventListener("click", filterCountries);
none.addEventListener("click", filterCountries);
button.addEventListener("click", toggleDarkMode);

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
main("None");
