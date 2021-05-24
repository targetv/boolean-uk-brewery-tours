// State object that contains array brewries

let state = {
  brewries: [],
  filters: {
    type: "",
    cities: [],
  },
};

// Create Element function shortcut
function createElm(tag, attobj) {
  const elm = document.createElement(tag);
  for (const key of Object.keys(attobj)) {
    elm[key] = attobj[key];
  }
  return elm;
}

// const mainSection = document.querySelector("main");
//Main

function headerSection() {
  const headerEl = createElm("header", { className: "search-bar" });
  const formEl = createElm("form", {
    id: "search-breweries-form",
    autocomplete: "off",
  });
  const labelEl = createElm("label", { for: "search-breweries" });
  const h2El = createElm("h2", { innerText: "Search breweries:" });
  const inputEl = createElm("input", {
    id: "search-breweries",
    name: "search-breweries",
    type: "text",
  });
  labelEl.append(h2El);
  formEl.append(labelEl, inputEl);
  headerEl.append(formEl);
  mainSection.append(headerEl);
}

function brewriesListSection() {
  const main = document.querySelector("main");
  const h1El = createElm("h1", { innerText: "List of Breweries" });
  const articleEl = document.createElement("article");
  const ulEl = createElm("ul", { className: "breweries-list" });
  main.append(ulEl);
  let renderBreweries = state.brewries;
  if (state.filters.type !== "") {
    renderBreweries = renderBreweries.filter(function (brewery) {
      return brewery.brewery_type === state.filters.type;
    });
  }

  if (state.filters.cities.length > 0) {
    renderBreweries = renderBreweries.filter(function (brewery) {
      console.log(
        "return of cities",
        state.filters.cities.includes(brewery.city)
      );
      return state.filters.cities.includes(brewery.city);
    });
  }
  console.log("renderBreweries", renderBreweries);
  const renderedBreweries = renderBreweries.slice(0, 10);
  console.log("renderedBreweriesArray", renderedBreweries);

  for (let i = 0; i < renderedBreweries.length; i++) {
    const brewerie = renderedBreweries[i];
    const brewerieCard = createBrewerieCard(brewerie);
    ulEl.append(brewerieCard);
  }
  articleEl.append(ulEl);
  main.append(h1El, articleEl);
}

function createBrewerieCard(data) {
  const liEl = document.createElement("li");
  const brewerieNameEl = createElm("h2", { innerText: data.name });
  const divEl = createElm("div", {
    className: "type",
    innerText: data.brewery_type,
  });
  const addressSection = createElm("section", { className: "address" });
  const addressTitle = createElm("h3", { innerText: "Address:" });
  const addressStreet = createElm("p", { innerText: data.street });

  const addressCity = document.createElement("p");
  const addressCityStrong = createElm("strong", {
    innerText: `${data.city} ${data.postal_code}`,
  });
  addressCity.append(addressCityStrong);
  addressSection.append(addressTitle, addressStreet, addressCity);
  const phoneSection = createElm("section", { className: "phone" });
  const phoneTitle = createElm("h3", { innerText: "Phone:" });
  const phoneNumber = createElm("p", { innerText: data.phone });
  const linkSection = createElm("section", { className: "link" });
  const linkToWebsite = createElm("a", {
    href: "null",
    target: "_blank",
    innerText: "Visit Website",
  });
  linkSection.append(linkToWebsite);
  phoneSection.append(phoneTitle, phoneNumber);
  liEl.append(brewerieNameEl, divEl, addressSection, phoneSection, linkSection);
  return liEl;
}

function unique(array) {
  return [...new Set(array)];
}

function asideSectionLayout() {
  const main = document.querySelector("main");
  const asideSection = createElm("aside", { className: "filters-section" });
  const h2El = createElm("h2", { innerText: "Filter By:" });
  const formELBrewType = createElm("form", {
    id: "filter-by-type-form",
    autocompete: "off",
  });
  const labelEl = createElm("label", { for: "filter-by-type" });
  const breweryTypeTitle = createElm("h3", { innerText: "Type of Brewery" });
  const selectEl = createElm("select", {
    name: "filter-by-type",
    id: "filter-by-type",
  });

  selectEl.addEventListener("change", function () {
    state.filters.type = selectEl.value;
    console.log(state.filters.type);
    render();
  });

  const selectType = createElm("option", {
    value: "",
    innerText: "Select a type...",
  });
  const microType = createElm("option", { innerText: "Micro", value: "micro" });
  const regionalType = createElm("option", {
    innerText: "Regional",
    value: "regional",
  });
  const brewpubType = createElm("option", {
    innerText: "Brewpub",
    value: "brewpub",
  });
  const filterCityEl = createElm("div", {
    className: "filter-by-city-heading",
  });
  const citiesTitle = createElm("h3", { innerText: "Cities" });
  const buttonEl = createElm("button", {
    className: "clear-all-btn",
    innerText: "clear all",
  });
  const filterCityFormEl = createElm("form", { id: "filter-by-city-form" });

  const brewies = state.brewries.map(function (brewerie) {
    return brewerie.city;
  });

  const uniqueCities = unique(brewies);
  const sortedCities = uniqueCities.slice().sort();
  state.filters.cities = sortedCities;

  for (const city of state.filters.cities) {
    const inputElChardon = createElm("input", {
      type: "checkbox",
      name: city,
      value: city,
    });
    const chardonLabel = createElm("label", {
      for: city,
      innerText: city,
    });
    filterCityFormEl.append(inputElChardon, chardonLabel);
  }

  filterCityEl.append(citiesTitle, buttonEl);
  selectEl.append(selectType, microType, regionalType, brewpubType);
  labelEl.append(breweryTypeTitle);
  formELBrewType.append(labelEl, selectEl);
  asideSection.append(h2El, formELBrewType, filterCityEl, filterCityFormEl);
  main.append(asideSection);
}

/// Fetch and Render Requests
function getBrewers(state) {
  return fetch(
    `https://api.openbrewerydb.org/breweries?by_state=${state}&per_page=50`
  ).then(function (response) {
    return response.json();
  });
}

function listenToStateForm() {
  const formEl = document.querySelector("#select-state-form");

  formEl.addEventListener("submit", function (event) {
    event.preventDefault();
    const stateInput = formEl["select-state"].value;
    getBrewers(stateInput).then(function (dataFromServer) {
      const filteredBreweryData = dataFromServer.filter(
        (brewery) =>
          brewery.brewery_type === "brewpub" ||
          brewery.brewery_type === "micro" ||
          brewery.brewery_type === "regional"
      );
      state.brewries = filteredBreweryData;
      formEl.reset();
      render();
    });
  });
}

function render() {
  const main = document.querySelector("main");
  console.log("before clear main", main);
  main.innerHTML = " ";
  console.log("after clear main", main);
  brewriesListSection();
  asideSectionLayout();
}

function init() {
  listenToStateForm();
}
init();
