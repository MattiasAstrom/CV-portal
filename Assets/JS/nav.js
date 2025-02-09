function openPrintPage() {
  window.print();
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function toggleMenu() {
  const navbarLinks = document.querySelector("navbar-links");
  navbarLinks.classList.toggle("active");
}

window.onscroll = function () {
  const button = document.querySelector(".scroll-to-top");
  if (
    document.body.scrollTop > 200 ||
    document.documentElement.scrollTop > 100
  ) {
    button.style.display = "block";
  } else {
    button.style.display = "none";
  }
};
// Load the navigation bar dynamically
document.addEventListener("DOMContentLoaded", () => {
  const currentPage = window.location.pathname.split("/").pop();
  const links = document.querySelectorAll(".nav a");

  for (const link of links) {
    if (link.href.includes(currentPage)) {
      link.classList.add("active");
      break; //adding break since i noticed while hosting on githubpages first time it loads every item in nav gets "active" added
    }
  }
});

function openNav() {
  document.getElementById("myNav").style.height = "100%";
}

function closeNav() {
  document.getElementById("myNav").style.height = "0%";
}
