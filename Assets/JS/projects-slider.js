document.addEventListener("DOMContentLoaded", function () {
  // Get elements
  const projectsWrapper = document.querySelector(".projects-wrapper");
  const projectCards = document.querySelectorAll(".project-card");
  const totalProjects = projectCards.length;

  let currentIndex = 0; // Start at the first project

  // Function to update the position of the projects
  function updateProjectPosition() {
    const offset = -currentIndex * (projectCards[0].offsetWidth + 20); // 20 is the margin between cards
    projectsWrapper.style.transform = `translateX(${offset}px)`;
  }

  // Event listener for right arrow (to navigate to next project)
  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") {
      if (currentIndex < totalProjects - 1) {
        currentIndex++;
      } else {
        currentIndex = 0; // Loop back to the first project
      }
      updateProjectPosition();
      updateArrowVisibility();
    }

    // Event listener for left arrow (to navigate to previous project)
    if (e.key === "ArrowLeft") {
      if (currentIndex > 0) {
        currentIndex--;
      } else {
        currentIndex = totalProjects - 1; // Loop back to the last project
      }
      updateProjectPosition();
      updateArrowVisibility();
    }
  });

  // Function to update the display of arrows based on current index
  function updateArrowVisibility() {
    const leftArrow = document.querySelector(".arrow-left");
    const rightArrow = document.querySelector(".arrow-right");

    if (currentIndex === 0) {
      leftArrow.classList.add("disabled");
    } else {
      leftArrow.classList.remove("disabled");
    }

    if (currentIndex === totalProjects - 1) {
      rightArrow.classList.add("disabled");
    } else {
      rightArrow.classList.remove("disabled");
    }
  }

  // Create and append arrow buttons
  const leftArrow = document.createElement("div");
  leftArrow.classList.add("arrow-left");
  leftArrow.innerHTML = "&larr;";
  document.body.appendChild(leftArrow);

  const rightArrow = document.createElement("div");
  rightArrow.classList.add("arrow-right");
  rightArrow.innerHTML = "&rarr;";
  document.body.appendChild(rightArrow);

  // Attach click event to arrows
  leftArrow.addEventListener("click", () => {
    if (currentIndex > 0) {
      currentIndex--;
    } else {
      currentIndex = totalProjects - 1; // Loop back to the last project
    }
    updateProjectPosition();
    updateArrowVisibility();
  });

  rightArrow.addEventListener("click", () => {
    if (currentIndex < totalProjects - 1) {
      currentIndex++;
    } else {
      currentIndex = 0; // Loop back to the first project
    }
    updateProjectPosition();
    updateArrowVisibility();
  });

  // Initial setup
  updateProjectPosition();
  updateArrowVisibility();
});
