// main.js
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.128.0/build/three.module.js";

import { initScene, scene, camera, renderer } from "./scene.js";
import { updateMovement } from "./movement.js";
import { setupEventListeners } from "./input.js";
import { setupPointerLock } from "./mouseControl.js";
import { animate } from "./animate.js";

export const clock = new THREE.Clock();
export { THREE };

initScene(); // Initializes the scene, camera, and renderer
setupEventListeners(); // Setup input listeners
setupPointerLock(); // Setup mouse pointer lock
function gameLoop() {
  updateMovement(clock); // Update movement
  animate(); // Render the scene
  requestAnimationFrame(gameLoop); // Continue the loop
}

gameLoop();
