import { clock } from "./main.js"; // Import clock from main.js
import { camera } from "./scene.js";

export let shoot;
export function Shoot(value) {
  shoot = value;
}

export let mouseX = 0,
  mouseY = 0;
export let isPointerLocked = false;
let sensitivity = 0.02;

export function setupPointerLock() {
  const canvas = document.getElementById("webgl-canvas");

  if (canvas) {
    canvas.addEventListener("click", () => {
      if (document.pointerLockElement === canvas) {
        shoot = true;
      } else {
        canvas.requestPointerLock();
      }
    });
  }

  document.addEventListener("pointerlockchange", () => {
    if (document.pointerLockElement === canvas) {
      isPointerLocked = true;
      document.addEventListener("mousemove", onMouseMove);
    } else {
      isPointerLocked = false;
      document.removeEventListener("mousemove", onMouseMove);
    }
  });
}

export function onClick() {
  const canvas = document.getElementById("webgl-canvas");

  if (canvas) {
    canvas.requestPointerLock();
  }
}

export function onMouseMove(event) {
  if (isPointerLocked) {
    const movementX = event.movementX || event.mozMovementX || 0;
    const movementY = event.movementY || event.mozMovementY || 0;

    const delta = clock.getDelta();
    const adjustedSensitivity = sensitivity * delta;

    mouseX += movementX * adjustedSensitivity * -1; // Horizontal (yaw) rotation (right-left inverted fix)
    mouseY -= movementY * adjustedSensitivity;

    // Apply yaw/pitch rotation
    camera.rotation.y = mouseX;
    camera.rotation.x = mouseY;

    // Clamp pitch rotation to avoid flipping
    camera.rotation.x = Math.max(
      Math.min(camera.rotation.x, Math.PI / 2),
      -Math.PI / 2
    );
  }
}
