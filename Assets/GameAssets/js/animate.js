import { THREE } from "./main.js"; // Import THREE from main.js
import { renderer, scene, camera } from "./scene.js"; // Import renderer, scene, and camera from scene.js

export function animate() {
  renderer.render(scene, camera);
}
