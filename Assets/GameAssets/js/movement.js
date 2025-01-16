import { moveForward, moveBackward, moveLeft, moveRight } from "./input.js";
import { camera } from "./scene.js";
import { THREE } from "./main.js";

let velocity = new THREE.Vector3();
let direction = new THREE.Vector3();
let speed = 1; // Speed of movement
let acceleration = 1; // Adjusted acceleration for smoother movement
let maxSpeed = 20; // Max speed
let gravity = 0.1;
export function updateMovement(clock) {
  const delta = clock.getDelta(); // Get the delta time (time elapsed between frames)

  // Create a quaternion from the camera's Euler rotation
  const cameraQuaternion = new THREE.Quaternion().setFromEuler(camera.rotation);

  // Calculate the forward and right directions relative to the camera's rotation
  const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(cameraQuaternion);
  const right = new THREE.Vector3(1, 0, 0).applyQuaternion(cameraQuaternion);

  // Reset the direction
  direction.set(0, 0, 0);

  // Update direction based on user input
  if (moveForward) direction.add(forward);
  if (moveBackward) direction.add(forward.negate());
  if (moveLeft) direction.add(right.negate());
  if (moveRight) direction.add(right);

  // Normalize the direction
  direction.normalize();

  // Apply speed to the direction
  direction.multiplyScalar(speed);

  // Apply acceleration to velocity (smooth acceleration)
  velocity.addScaledVector(direction, acceleration); // Multiply by delta

  // Clamp the velocity to the max speed
  if (velocity.length() > maxSpeed) {
    velocity.setLength(maxSpeed);
  }
  velocity.y -= gravity * delta;
  // Apply the velocity to the camera's position (move the camera)
  camera.position.add(velocity); // Apply velocity to camera position directly
  // Apply deceleration to the velocity (smooth stop)
  velocity.multiplyScalar(0.9); // Gradual slowdown for smooth deceleration
}
