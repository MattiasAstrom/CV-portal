document.addEventListener("DOMContentLoaded", () => {
  let currentIndex = 0;
  let speed = 200;
  let isPlaying = false;
  let animationFrameId;
  let keySequence = "";
  const secretCode = "hej";

  const changeButton = document.querySelector(".changeButton");
  changeButton.addEventListener("click", changeBackground);

  const rainbowColors = [
    "rgba(0, 0, 0, 0.6)",
    "rgba(255, 0, 0, 0.6)",
    "rgba(255, 127, 0, 0.6)",
    "rgba(255, 255, 0, 0.6)",
    "rgba(0, 255, 0, 0.6)",
    "rgba(0, 0, 255, 0.6)",
    "rgba(75, 0, 130, 0.6)",
    "rgba(238, 130, 238, 0.6)",
    "rgba(255, 255, 255, 0.6)",
  ];

  function changeBackground() {
    if (!isPlaying) {
      isPlaying = true;
      cycleColors();
    } else {
      isPlaying = false;
      cancelAnimationFrame(animationFrameId);
      resetAnimation();
    }
  }

  function cycleColors() {
    const body = document.querySelector("main");
    let nextIndex = (currentIndex + 1) % rainbowColors.length; // Get the next color index
    let currentColor = rainbowColors[currentIndex];
    let nextColor = rainbowColors[nextIndex];

    // Lerp over time (smooth transition from currentColor to nextColor)
    let startTime = null;

    function animateColorTransition(timestamp) {
      if (!startTime) startTime = timestamp;

      if (speed >= 1000) {
        speed -= 10;
      }

      const progress = (timestamp - startTime) / speed;

      const lerpedColor = lerpColor(
        currentColor,
        nextColor,
        Math.min(progress, 1)
      );

      body.style.setProperty("--overlay-color", lerpedColor);

      if (progress < 1) {
        if (isPlaying) {
          animationFrameId = requestAnimationFrame(animateColorTransition);
        }
      } else {
        currentIndex = nextIndex;
        setTimeout(cycleColors, 1);
      }
    }

    animationFrameId = requestAnimationFrame(animateColorTransition);
  }

  function resetAnimation() {
    const body = document.querySelector(".background-homepage");
    body.style.backgroundColor = "rgba(0, 0, 0, 0.6)";

    currentIndex = 0;
    speed = 5000;
  }

  // Helper function to interpolate between two colors
  function lerpColor(color1, color2, t) {
    const rgba1 = color1.match(/[\d\.]+/g).map(Number);
    const rgba2 = color2.match(/[\d\.]+/g).map(Number);

    const r = Math.round(rgba1[0] + (rgba2[0] - rgba1[0]) * t);
    const g = Math.round(rgba1[1] + (rgba2[1] - rgba1[1]) * t);
    const b = Math.round(rgba1[2] + (rgba2[2] - rgba1[2]) * t);
    const a = (rgba1[3] + (rgba2[3] - rgba1[3]) * t).toFixed(1);

    return `rgba(${r}, ${g}, ${b}, ${a})`;
  }

  // Listen for key presses to detect the secret code
  document.addEventListener("keydown", (event) => {
    keySequence += event.key;

    if (keySequence.length > secretCode.length) {
      keySequence = keySequence.slice(1);
    }

    if (keySequence === secretCode) {
      showEasterEggModal();
    }
  });

  function showEasterEggModal() {
    const modal = document.createElement("div");
    modal.classList.add("modal");
    modal.style.position = "fixed";
    modal.style.top = "50%";
    modal.style.left = "50%";
    modal.style.transform = "translate(-50%, -50%)";
    modal.style.backgroundColor = "#fff";
    modal.style.border = "2px solid #000";
    modal.style.zIndex = "1000";
    modal.style.display = "block";
    modal.innerHTML =
      "<h2>Congratulations, you found the Easter egg!</h2><p>Press anywhere to close</p>";
    document.body.appendChild(modal);

    modal.addEventListener("click", () => {
      document.body.removeChild(modal);
    });
  }
});
