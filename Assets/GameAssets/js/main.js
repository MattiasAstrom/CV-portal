import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.128.0/build/three.module.js";
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";
export { THREE };
export { GLTFLoader };

import { initScene, scene, camera, renderer } from "./scene.js";
import { updateMovement } from "./movement.js";
import { setupEventListeners } from "./input.js";
import { setupPointerLock, shoot } from "./mouseControl.js";
import { animate } from "./animate.js";
import { addTextBox } from "./scene.js"; // Import the function to create the box
import { checkRaycast, initRayVisualizer } from "./movement.js"; // Correct import of initRayVisualizer

export const clock = new THREE.Clock();

initScene(); // Initializes the scene, camera, and renderer

// let homeBox = addTextBox(); // Create the box with text
// homeBox.name = "homeBox"; // Name it for identification in raycasting

setupEventListeners(); // Setup input listeners
setupPointerLock(); // Setup mouse pointer lock

// Initialize ray visualizer only after the scene is set up

initRayVisualizer();
function gameLoop() {
  updateMovement(clock); // Update movement
  animate(); // Render the scene
  if (shoot === true) {
    checkRaycast(); // Check raycast and update the ray line
    shoot = false;
  }
  requestAnimationFrame(gameLoop); // Continue the loop
}

gameLoop();
