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

const countrySection = document.getElementById("countries");

/* to create a country-card component
  - create card component
  - create info Components
  - add info to components
  - add slot attribute to Components
  - add components to the country card component
  - add country card to the country section

  THIS IS THE STRUCTURE:
        <country-card>
          <img slot="flag" src="" alt="" />
          <h3 slot="country">Germany</h3>
          <span slot="population">81,770,900</span>
          <span slot="region">Europe</span>
          <span slot="capital">Berlin</span>
      </country-card>
*/
