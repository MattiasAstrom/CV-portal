import { clock } from "./main.js"; // Import clock from main.js
import { camera } from "./scene.js";

export let shoot;
export function Shoot(value) {
  shoot = value;
}

export let mouseX = 0,
  mouseY = 0;
export let isPointerLocked = false;
let sensitivity = 0.02; // Mouse sensitivity, this value can be adjusted
export function setupPointerLock() {
  const canvas = document.getElementById("webgl-canvas");

  // Ensure that mouse events are added when pointer lock is active
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
  const canvas = document.getElementById("webgl-canvas"); // Get the canvas element

  if (canvas) {
    // Attempt to lock the pointer on the canvas
    canvas.requestPointerLock();
  }
}

export function onMouseMove(event) {
  if (isPointerLocked) {
    const movementX = event.movementX || event.mozMovementX || 0;
    const movementY = event.movementY || event.mozMovementY || 0;

    // Apply delta time scaling to the mouse movement (to make it frame-rate independent)
    const delta = clock.getDelta(); // Delta time from the clock
    const adjustedSensitivity = sensitivity * delta; // Adjust sensitivity with delta

    // Apply sensitivity to mouse movement
    mouseX += movementX * adjustedSensitivity * -1; // Horizontal (yaw) rotation (right-left inverted fix)
    mouseY -= movementY * adjustedSensitivity; // Vertical (pitch) rotation

    // Apply yaw rotation to camera (left-right movement)
    camera.rotation.y = mouseX;

    // Apply pitch rotation to camera (up-down movement)
    camera.rotation.x = mouseY;

    // Clamp pitch rotation to avoid flipping
    camera.rotation.x = Math.max(
      Math.min(camera.rotation.x, Math.PI / 2),
      -Math.PI / 2
    );
  }
}
// export function onMouseMove(event) {
//   if (isPointerLocked) {
//     const movementX = event.movementX || event.mozMovementX || 0;
//     const movementY = event.movementY || event.mozMovementY || 0;

//     // Adjust mouse sensitivity
//     mouseX += movementX * sensitivity;
//     mouseY -= movementY * sensitivity;

//     // Apply yaw (left-right) and pitch (up-down) rotation
//     camera.rotation.y = mouseX;
//     camera.rotation.x = mouseY;

//     // Clamp the pitch rotation to avoid flipping
//     camera.rotation.x = Math.max(
//       Math.min(camera.rotation.x, Math.PI / 2),
//       -Math.PI / 2
//     );
//   }
// }
