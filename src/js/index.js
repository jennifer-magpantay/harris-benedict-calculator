// global selectors
const navbarMenu = document.querySelector("#navbar-menu");
const navButtonToggle = document.querySelector("#nav-button-toggle");

// events
navButtonToggle.addEventListener("click", handleMenu);

// functions
function handleMenu() {
  // once button is clicked, display the navbar-menu, by setting data visible to true
  const isVisible = navbarMenu.getAttribute("data-visible");
  if (isVisible === "false") {
    navbarMenu.setAttribute("data-visible", true);
    // also make changes to aria-expanded
    navButtonToggle.setAttribute("aria-expanded", true);
  } else {
    navbarMenu.setAttribute("data-visible", false);
    navButtonToggle.setAttribute("aria-expanded", false);
  }
}
