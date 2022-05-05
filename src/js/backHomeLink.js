window.addEventListener("load", () => {
  init();
});

function init() {
  loadingBackHomeIcon();
}

function loadingBackHomeIcon() {
  const backHome = document.querySelector("#back-home");

  const link = document.createElement("a");
  const span = document.createElement("span");

  link.textContent = "Back home";
  link.title = "Back home";
  link.href = "/";

  span.classList.add("material-icons");
  span.classList.add("icon");
  span.textContent = "arrow_back";

  backHome.appendChild(span);
  backHome.appendChild(link);
}
