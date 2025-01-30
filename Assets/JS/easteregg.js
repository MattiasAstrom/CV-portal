document.addEventListener("DOMContentLoaded", () => {
  let currentIndex = 0; // Track the current color in the array
  let speed = 5000;
  let isPlaying = false;
  let animationFrameId; // Variable to store the requestAnimationFrame ID
  let keySequence = ""; // To track the key sequence input by the user
  const secretCode = "1337"; // The secret code to trigger the Easter egg

  // Add event listener to the button
  const changeButton = document.querySelector(".changeButton");
  changeButton.addEventListener("click", changeBackground);

  const rainbowColors = [
    "rgba(0, 0, 0, 0.6)",
    "rgba(255, 0, 0, 0.6)", // Red
    "rgba(255, 127, 0, 0.6)", // Orange
    "rgba(255, 255, 0, 0.6)", // Yellow
    "rgba(0, 255, 0, 0.6)", // Green
    "rgba(0, 0, 255, 0.6)", // Blue
    "rgba(75, 0, 130, 0.6)", // Indigo
    "rgba(238, 130, 238, 0.6)", // Violet
    "rgba(255, 255, 255, 0.6)",
  ];

  function changeBackground() {
    // Toggle play/pause
    if (!isPlaying) {
      isPlaying = true;
      cycleColors(); // Start the animation
    } else {
      isPlaying = false;
      cancelAnimationFrame(animationFrameId); // Stop the animation
      resetAnimation(); // Reset everything to initial state when stopped
    }
  }

  function cycleColors() {
    const body = document.querySelector(".background-homepage");

    let nextIndex = (currentIndex + 1) % rainbowColors.length; // Get the next color index
    let currentColor = rainbowColors[currentIndex];
    let nextColor = rainbowColors[nextIndex];

    // Lerp over time (smooth transition from currentColor to nextColor)
    let startTime = null;

    function animateColorTransition(timestamp) {
      if (!startTime) startTime = timestamp;

      if (speed >= 1000) {
        speed -= 10; // Gradually slow down the transition speed
      }

      const progress = (timestamp - startTime) / speed; // Calculate progress

      // Lerp function to interpolate the colors
      const lerpedColor = lerpColor(
        currentColor,
        nextColor,
        Math.min(progress, 1)
      );

      // Apply the lerped color
      body.style.setProperty("--overlay-color", lerpedColor);

      if (progress < 1) {
        // Continue animating if the animation is still playing
        if (isPlaying) {
          animationFrameId = requestAnimationFrame(animateColorTransition);
        }
      } else {
        currentIndex = nextIndex; // Move to the next color in the array
        setTimeout(cycleColors, 1); // Delay before next transition (1 second)
      }
    }

    animationFrameId = requestAnimationFrame(animateColorTransition);
  }

  function resetAnimation() {
    // Reset the background color and rotation when stopped
    const body = document.querySelector(".background-homepage");
    body.style.backgroundColor = "rgba(0, 0, 0, 0.6)"; // Initial background color
    body.style.transform = "rotate(0deg)"; // Reset rotation to 0

    currentIndex = 0;
    speed = 5000; // Reset the speed to the initial value
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

    // If the sequence length exceeds the secret code length, trim it
    if (keySequence.length > secretCode.length) {
      keySequence = keySequence.slice(1);
    }

    // Check if the key sequence matches the secret code
    if (keySequence === secretCode) {
      console.log("should be showing popup");
      showEasterEggModal();
    }
    console.log(keySequence);
  });

  // Function to show the modal with the fun message
  function showEasterEggModal() {
    const modal = document.createElement("div");
    modal.classList.add("modal");
    modal.style.position = "absolute";
    modal.style.top = "50%";
    modal.style.left = "50%";
    modal.style.transform = "translate(-50%, -50%)";
    modal.style.padding = "20px";
    modal.style.backgroundColor = "#fff";
    modal.style.border = "2px solid #000";
    modal.style.zIndex = "1000";
    modal.style.display = "block";
    modal.innerHTML =
      "<h2>Congratulations, you found the Easter egg!</h2><p>1337 is the secret code!</p>";

    document.body.appendChild(modal);

    // Close modal when clicked
    modal.addEventListener("click", () => {
      document.body.removeChild(modal);
    });
  }
});
