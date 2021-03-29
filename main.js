// enables country card web components
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

// variables
const countrySection = document.getElementById("countries");
const inputArea = document.getElementById("input-area");
const selectArea = document.getElementById("select-area");

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
  console.log(country.name);
};

const clearScreen = () => {
  inputArea.style.display = "none";
  selectArea.style.display = "none";
  countrySection.style.display = "none";
};

// main logic
const main = async () => {
  const countryData = await getData();

  for (i = 0; i < countryData.length; i++) {
    createCountryCard(countryData[i]);
  }
};

// calling functions
main();
