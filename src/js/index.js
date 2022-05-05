import { contentData } from "../data/contentData.js";

window.addEventListener("load", () => {
  init();
});

function init() {
  // once page is loaded,enable components to be renderd and the following event functions:
  loadingHeader();
  loadingIntro();
  loadingContent();

  handleClickMenu();
  handleClickUnitSystemForm();
  handleSubmitForm();
  handleFormAfterResults();
}

// loading components
function loadingHeader() {
  const header = document.querySelector("#header");

  // creating elements
  const linkHome = document.createElement("a");
  const logo = document.createElement("img");

  const navbar = document.createElement("nav");
  const menuButton = document.createElement("button");
  const span = document.createElement("span");
  const list = document.createElement("ul");

  // setting classes or ids
  linkHome.title = "Home";
  linkHome.href = "/";

  logo.classList.add("logo");
  logo.src = "./assets/logo.png";
  logo.alt = "Calculator logo";

  menuButton.classList.add("header__button-toggle");
  menuButton.setAttribute("id", "nav-button-toggle");
  menuButton.setAttribute("aria-controls", "navbar-menu");
  menuButton.ariaLabel = "Menu";
  menuButton.ariaExpanded = "false";

  span.classList.add("material-icons");
  span.classList.add("icon");
  span.classList.add("menu");
  span.setAttribute("id", "menu");
  span.textContent = "menu";

  navbar.classList.add("navbar-menu");
  navbar.setAttribute("id", "navbar-menu");
  navbar.setAttribute("data-visible", false);

  contentData.map((item) => {
    const listItem = document.createElement("li");
    const link = document.createElement("a");

    listItem.setAttribute("key", item.id);
    link.textContent = item.title;
    link.title = item.title;
    link.href = `/content-mobile.html#${String(item.id)}`;

    listItem.appendChild(link);
    list.appendChild(listItem);
  });

  linkHome.appendChild(logo);
  menuButton.appendChild(span);
  navbar.appendChild(list);
  header.appendChild(linkHome);
  header.appendChild(menuButton);
  header.appendChild(navbar);
}

function loadingIntro() {
  const intro = document.querySelector("#intro");
  const title = document.createElement("h1");
  const subtitle = document.createElement("h2");

  title.textContent = "Daily calories calculator";
  subtitle.textContent =
    "An easy way to calculate the energy you need for the day";

  intro.appendChild(title);
  intro.appendChild(subtitle);
}

function loadingContent() {
  // content loaded into sections inside div content
  const content = document.querySelector("#content");

  // mapping data content and create child inside of the method
  contentData.map((item) => {
    // creating elements
    const section = document.createElement("section");
    const title = document.createElement("h3");
    const text = document.createElement("p");

    section.setAttribute("key", item.id);
    title.setAttribute("id", String(item.id));
    title.textContent = item.title;
    text.textContent = item.description;

    // appending elements
    section.appendChild(title);
    section.appendChild(text);
    content.appendChild(section);
  });
}

// event functions
function handleClickMenu() {
  const navButtonToggle = document.querySelector("#nav-button-toggle");
  navButtonToggle.addEventListener("click", () => manageMenu());
}

function getUnitSystemOption() {
  const unit = document.querySelector("#unit");
  const unitOption = unit.options[unit.selectedIndex].value;
  return unitOption;
}

function handleClickUnitSystemForm() {
  const unit = document.querySelector("#unit");

  unit.addEventListener("change", () => {
    // get seleted option
    const unitOption = getUnitSystemOption();

    // get span values to be changed
    const heightUnit = document.querySelector("#height-unit");
    const weightUnity = document.querySelector("#weight-unit");
    unitOption === "imperial"
      ? ((heightUnit.innerHTML = "in"), (weightUnity.innerHTML = "lbs"))
      : ((heightUnit.innerHTML = "cm"), (weightUnity.innerHTML = "kg"));
  });
}

function handleSubmitForm() {
  const form = document.querySelector("#form");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    manageDataContainerContent();
    renderResultsContent();
  });
}

function handleFormAfterResults() {
  const dataButton = document.querySelector("#data-button");
  dataButton.addEventListener("click", (e) => {
    e.preventDefault();
    manageDataContainerContent();
  });
}

function manageMenu() {
  const navbarMenu = document.querySelector("#navbar-menu");
  const navButtonToggle = document.querySelector("#nav-button-toggle");

  // once button is clicked, display the navbar-menu, by setting data visible to true
  const isNavbarVisible = navbarMenu.getAttribute("data-visible");
  if (isNavbarVisible === "false") {
    navbarMenu.setAttribute("data-visible", true);
    // also make changes to aria-expanded, for screen readers
    navButtonToggle.setAttribute("aria-expanded", true);
  } else {
    navbarMenu.setAttribute("data-visible", false);
    navButtonToggle.setAttribute("aria-expanded", false);
  }
}

function manageDataContainerContent() {
  const formContainer = document.querySelector("#form-container");
  const dataContainer = document.querySelector("#data-container");
  const isFormVisible = formContainer.getAttribute("data-visible");
  if (isFormVisible === "true") {
    formContainer.setAttribute("data-visible", false);
    dataContainer.setAttribute("data-visible", true);
  } else {
    // clear form inputs before display again
    clearFormInput();
    formContainer.setAttribute("data-visible", true);
    dataContainer.setAttribute("data-visible", false);
  }
}

function getFormValues() {
  // get values
  const height = document.querySelector("#height").value;
  const weight = document.querySelector("#weight").value;
  const age = document.querySelector("#age").value;
  const gender = document.querySelector("#gender");
  const genderOption = gender.options[gender.selectedIndex].value;

  const activity = document.querySelector("#activity");
  const activityOption = activity.options[activity.selectedIndex];
  // change span unit

  // return user Input for calculation
  const userInput = {
    unitSystem: getUnitSystemOption(),
    height,
    weight,
    age,
    gender: genderOption,
    activity: activityOption.text,
    activityFactor: Number(activityOption.value),
  };

  return userInput;
}

function calculateBMRValue(input) {
  const { unitSystem, height, weight, age, gender } = input;
  let bmrValue = 0;

  let wght = weight;
  let hght = height;

  if (unitSystem === "imperial") {
    // convert inches to cm, and lbs to kg
    wght = Math.ceil(wght * 0.45359237);
    hght = Math.ceil(hght * 2.54);
  }

  if (gender === "male") {
    bmrValue = 88.362 + 13.397 * wght + 4.799 * hght - 5.677 * age;
  } else {
    bmrValue = 447.593 + 9.247 * wght + 3.098 * hght - 4.33 * age;
  }

  return bmrValue;
}

function calculateCaloriesResult(input, bmrValue) {
  const { activityFactor } = input;
  const caloriesResult = bmrValue * activityFactor;

  return caloriesResult;
}

function renderHeaderResults(result) {
  const dataSubtitle = document.querySelector("#data-subtitle");
  dataSubtitle.textContent = `${Math.ceil(result)} calories/day *`;
}

function renderUserInput(input) {
  const { unitSystem, height, weight, age, gender, activity, activityFactor } =
    input;
  const bmrValue = calculateBMRValue(input);

  const dataRoot = document.querySelector("#data-root");

  const title = document.createElement("h3");
  const hght = document.createElement("p");
  const wght = document.createElement("p");
  const gndr = document.createElement("p");
  const yrs = document.createElement("p");
  const pal = document.createElement("p");
  const palFactor = document.createElement("p");
  const brm = document.createElement("p");

  title.textContent = "Individual Results";
  hght.textContent = `Height: ${height} ${
    unitSystem === "metric" ? "cm" : "inc"
  }`;
  wght.textContent = `Weight: ${weight} ${
    unitSystem === "metric" ? "kg" : "lbs"
  }`;
  gndr.textContent = `Gender: ${gender}`;
  yrs.textContent = `Age: ${age} years old`;
  pal.textContent = `Physical Activity Level: ${activity}`;
  palFactor.textContent = `Physical Activity Level Factor: ${activityFactor}`;
  brm.textContent = `Basal Metabolic Rate (BMR): ${bmrValue.toFixed(0)}`;

  dataRoot.appendChild(title);
  dataRoot.appendChild(hght);
  dataRoot.appendChild(wght);
  dataRoot.appendChild(gndr);
  dataRoot.appendChild(yrs);
  dataRoot.appendChild(pal);
  dataRoot.appendChild(palFactor);
  dataRoot.appendChild(brm);
}

function clearFormInput() {
  const unit = document.querySelector("#unit");
  const height = document.querySelector("#height");
  const weight = document.querySelector("#weight");
  const age = document.querySelector("#age");
  const gender = document.querySelector("#gender");
  const activity = document.querySelector("#activity");

  unit.selectedIndex = 0;
  height.value = 0;
  weight.value = 0;
  age.value = 0;
  gender.selectedIndex = 0;
  activity.selectedIndex = 0;
}

function renderResultsContent() {
  const input = getFormValues();
  const bmrValue = calculateBMRValue(input);
  const caloriesResult = calculateCaloriesResult(input, bmrValue);

  renderHeaderResults(caloriesResult);
  renderUserInput(input);
}
