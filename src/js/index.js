window.addEventListener("load", () => {
  init();
});

function init() {
  // once page is loaded,enable components and the following event functions:
  loadingHeader();
  loadingIntro();

  handleClickMenu();
  handleClickUnitSystemForm();
  handleSubmitForm();
  handleFormAfterResults();
}

// loading components
function loadingHeader() {
  const header = document.querySelector("#header");

  const content = `
  <a href="/">
    <img class='logo' src="./assets/logo.png" alt="Calculator Logo">
  </a>
  <button class='header__button-toggle' id="nav-button-toggle" aria-controls="navbar-menu"
            aria-expanded="false">Menu&nbsp;
    <span class="material-icons icon menu" id="menu">
                menu
    </span>
  </button>

  <!-- nav bar for small screens -->
  <nav class="navbar-menu" id="navbar-menu" data-visible="false">
    <ul>
      <li>
        <a href="/what-it-is.html">
          <span aria-hidden="true">What is the Daily Calories Calculator?</span>
        </a>
      </li>
     <li>
        <a href="/why-do-you-need.html">
          <span aria-hidden="true">Why do you need that?</span>
        </a>
      </li>
      <li>
        <a href="/how-is-calculated.html">
          <span aria-hidden="true">How daily calories are calculated?</span>
        </a>
      </li>
    </ul>
  </nav>
  `;

  header.innerHTML = content;
}

function loadingIntro() {
  const intro = document.querySelector("#intro");
  const content = `
  <h1>Daily calories calculator</h1>
  <h2>An easy way to calculate the energy you need for the day</h2>
  `;

  intro.innerHTML = content;
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
  dataSubtitle.innerHTML = `${Math.ceil(result)} calories/day *`;
}

function renderUserInput(input) {
  const { unitSystem, height, weight, age, gender, activity, activityFactor } =
    input;
  const bmrValue = calculateBMRValue(input);

  const dataRoot = document.querySelector("#data-root");
  let results = `
  <h3>Individual Results</h3>
  <p>Height: ${height} ${unitSystem === "metric" ? "cm" : "inc"}</p>
  <p>Weight: ${weight} ${unitSystem === "metric" ? "kg" : "lbs"}</p>
  <p>Gender: ${gender}</p>
  <p>Age: ${age} years old</p>
  <p>Physical Activity Level: ${activity}</p>
  <p>Physical Activity Level Factor: ${activityFactor}</p>
  <p>Basal Metabolic Rate (BMR): ${bmrValue}</p>
  <br>
  `;

  dataRoot.innerHTML = results;
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
