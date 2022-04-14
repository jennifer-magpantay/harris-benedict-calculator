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

function handleClickUnitSystemForm() {
  const unit = document.querySelector("#unit");

  unit.addEventListener("change", () => {
    // get seleted option
    const unitOption = unit.options[unit.selectedIndex].value;

    // get span values to be changed
    const heightUnit = document.querySelector("#height-unit");
    const weightUnity = document.querySelector("#weight-unit");
    unitOption === "imperial"
      ? ((heightUnit.innerHTML = "inch"), (weightUnity.innerHTML = "lbs"))
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
  const unit = document.querySelector("#unit");
  const unitOption = unit.options[unit.selectedIndex].value;

  const height = document.querySelector("#height").value;
  const weight = document.querySelector("#weight").value;
  const age = document.querySelector("#age").value;
  const gender = document.querySelector("#gender");
  const genderOption = gender.options[gender.selectedIndex].text;

  const activity = document.querySelector("#activity");
  const activityOption = activity.options[activity.selectedIndex];
  // change span unit

  // return user Input for calculation
  const userInput = {
    unitSystem: unitOption,
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
  // if gender is male, calculate:
  if (gender === "male") {
    beeValue = 88.362 + 13.397 * weight + 4.799 * height - 5.677 * age;
  }
  // otherwise, then calculate;
  else {
    beeValue = 447.593 + 9.247 * weight + 3.098 * height - 4.33 * age;
  }
  return beeValue.toFixed(0);
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
  const { unitSystem, height, weight, age, gender } = input;

  const dataRoot = document.querySelector("#data-root");
  let results = `
  <h3>Individual Results</h3>
  <p>Height: ${height} ${unitSystem === "metric" ? "cm" : "inch"}</p>
  <p>Weight: ${weight} ${unitSystem === "metric" ? "kg" : "lbs"}</p>
  <p>Gender: ${gender}</p>
  <p>Age: ${age} years old</p>
  <p>Activity Level: ${activity} cm</p>
  <br>
  `;

  dataRoot.innerHTML = results;
}

function clearFormInput() {
  const height = document.querySelector("#height");
  const weight = document.querySelector("#weight");
  const age = document.querySelector("#age");
  const gender = document.querySelector("#gender");
  const activity = document.querySelector("#activity");

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
