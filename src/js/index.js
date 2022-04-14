window.addEventListener("load", () => {
  init();
});

function init() {
  // once page is loaded,enable the following event functions:
  handleClickMenu();
  handleClickUnitSystemForm();
  handleSubmitForm();
  handleFormAfterResults();
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

function calculateBEEValue(input) {
  const { unitSystem, height, weight, age, gender } = input;
  let beeValue = 0;

  let wght = weight;
  let hght = height;

  if (unitSystem === "imperial") {
    // convert inches to cm, and lbs to kg
    wght = Math.ceil(wght * 0.45359237);
    hght = Math.ceil(hght * 2.54);
  }

  if (gender === "male") {
    beeValue = 88.362 + 13.397 * wght + 4.799 * hght - 5.677 * age;
  } else {
    beeValue = 447.593 + 9.247 * wght + 3.098 * hght - 4.33 * age;
  }

  return beeValue;
}

function calculateCaloriesResult(input, beeValue) {
  const { activityFactor } = input;
  const caloriesResult = beeValue * activityFactor;

  return caloriesResult;
}

function renderHeaderResults(result) {
  const dataSubtitle = document.querySelector("#data-subtitle");
  dataSubtitle.innerHTML = `${Math.ceil(result)} calories/day *`;
}

function renderUserInput(input) {
  const { unitSystem, height, weight, age, gender, activity } = input;

  const dataRoot = document.querySelector("#data-root");
  let results = `
  <h3>Individual Results</h3>
  <p>Height: ${height} ${unitSystem === "metric" ? "cm" : "inc"}</p>
  <p>Weight: ${weight} ${unitSystem === "metric" ? "kg" : "lbs"}</p>
  <p>Gender: ${gender}</p>
  <p>Age: ${age} years old</p>
  <p>Activity Level: ${activity}</p>
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
  const beeValue = calculateBEEValue(input);
  const caloriesResult = calculateCaloriesResult(input, beeValue);

  renderHeaderResults(caloriesResult);
  renderUserInput(input);
}
