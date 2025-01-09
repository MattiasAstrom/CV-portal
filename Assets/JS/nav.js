function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
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
  // Correctly formatted HTML string for navbar
  document.getElementById("navbar-container").innerHTML = `
    <nav>
      <ol>
        <li>
          <a href="./index.html">Home</a>
        </li>
        <li>
          <a href="./about.html">About</a>
        </li>
        <li>
          <a href="./projects.html">Projects</a>
        </li>
        <li>
          <a href="./cv.html">CV</a>
        </li>
        <li>
          <a href="./contact.html">Contact</a>
        </li>
      </ol>
    </nav>
  `;

  // Highlight the active page
  const currentPage = window.location.pathname.split("/").pop(); // Get the current page name (e.g., index.html)
  const links = document.querySelectorAll("nav a");

  links.forEach((link) => {
    // Check if the link's href matches the current page
    if (link.href.includes(currentPage)) {
      link.classList.add("active"); // Add 'active' class to the current page's link
    }
  });
});
