function openPrintPage() {
  window.print();
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function toggleMenu() {
  const navbarLinks = document.getElementById("navbar-links");
  navbarLinks.classList.toggle("active");
}

// Show/Hide the "Scroll to Top" button based on scroll position
window.onscroll = function () {
  const button = document.querySelector(".scroll-to-top");
  if (
    document.body.scrollTop > 200 ||
    document.documentElement.scrollTop > 100
  ) {
    button.style.display = "block"; // Show button when scrolled down
  } else {
    button.style.display = "none"; // Hide button when at the top
  }
};
// Load the navigation bar dynamically
document.addEventListener("DOMContentLoaded", () => {
  // Highlight the active page
  const currentPage = window.location.pathname.split("/").pop(); // Get the current page name (e.g., index.html)
  const links = document.querySelectorAll(".nav a");

  links.forEach((link) => {
    // Check if the link's href matches the current page
    if (link.href.includes(currentPage)) {
      link.classList.add("active"); // Add 'active' class to the current page's link
    }
  });
});

/* Open */
function openNav() {
  document.getElementById("myNav").style.height = "100%";
}

/* Close */
function closeNav() {
  document.getElementById("myNav").style.height = "0%";
}
