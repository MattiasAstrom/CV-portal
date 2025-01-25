// import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.129.0/build/three.module.js";
import * as THREE from "https://cdn.skypack.dev/three@00.129.0";
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";
// import { OrbitControls } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls";
import Stats from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/libs/stats.module";
export { THREE };
export { GLTFLoader };
// export { OrbitControls };

import { initScene, scene, camera, renderer } from "./scene.js";
import { updateMovement } from "./movement.js";
import { setupEventListeners } from "./input.js";
import { setupPointerLock, Shoot, shoot } from "./mouseControl.js";
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

// initRayVisualizer();

const stats = Stats();
stats.showPanel(0, 1, 2, 3, 4, 5); // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild(stats.dom);

function gameLoop() {
  stats.begin();
  updateMovement(clock); // Update movement
  animate(clock); // Render the scene
  if (shoot === true) {
    checkRaycast(); // Check raycast and update the ray line
    Shoot(false);
  }

  // console.log("Scene polycount:", renderer.info.render.triangles);
  // console.log("Active Drawcalls:", renderer.info.render.calls);
  // console.log("Textures in Memory", renderer.info.memory.textures);
  // console.log("Geometries in Memory", renderer.info.memory.geometries);
  stats.end();
  requestAnimationFrame(gameLoop); // Continue the loop
}

gameLoop();
