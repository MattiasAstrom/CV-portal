// movement.js
import { moveForward, moveBackward, moveLeft, moveRight } from "./input.js";
import { camera } from "./scene.js";
import { THREE } from "./main.js";
import { ground } from "./scene.js";
import { scene } from "./scene.js";

let velocity = new THREE.Vector3();
let direction = new THREE.Vector3();
let speed = 1; // Speed of movement
let acceleration = 0.05; // Adjusted acceleration for smoother movement
let maxSpeed = 3; // Max speed
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

  if (camera.position.y > ground.position.y + 5) {
    velocity.y -= gravity * delta; // Apply gravity
  } else {
    // Prevent falling through the ground
    velocity.y = 0;
    camera.position.y = ground.position.y + 5; // Correct camera height to ground level
  }

  // Apply the velocity to the camera's position (move the camera)
  camera.position.add(velocity); // Apply velocity to camera position directly
  // Apply deceleration to the velocity (smooth stop)
  velocity.multiplyScalar(0.9); // Gradual slowdown for smooth deceleration
}

// Raycaster setup
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2(); // Mouse position in normalized coordinates (x, y)
let rayLine; // Variable to store the line representing the ray

// Function to initialize the ray visualization
export function initRayVisualizer() {
  // Create a geometry for the ray (a simple line)
  const geometry = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(0, 0, -1),
  ]);
  const material = new THREE.LineBasicMaterial({ color: 0xff0000 }); // Red color for the ray

  // Create the line mesh
  rayLine = new THREE.Line(geometry, material);

  // Add the line to the scene (it will be updated every frame)
  scene.add(rayLine);
}

// Function to update the ray and the visualization
export function checkRaycast() {
  // Calculate the camera's forward direction using its rotation
  const cameraDirection = new THREE.Vector3(0, 0, -1); // Default "forward" vector
  camera.getWorldDirection(cameraDirection); // This updates the direction based on the camera's current rotation

  // Set the ray's origin at the camera's position
  raycaster.ray.origin.set(
    camera.position.x,
    camera.position.y,
    camera.position.z
  );

  // Set the ray's direction (facing forward from the camera)
  raycaster.ray.direction.copy(cameraDirection); // Use the calculated forward direction

  // Perform the raycast and check for intersections
  const intersects = raycaster.intersectObjects(scene.children);

  // If the ray hits an object, update the rayLine to reflect the intersection
  if (intersects.length > 0) {
    const hitObject = intersects[0].object;
    switch (hitObject.name) {
      case "Home":
        window.location.href = "./index.html"; // Redirect to home
        break;
      case "About":
        window.location.href = "./about.html"; // Redirect to about
        break;
      case "Projects":
        window.location.href = "./projects.html"; // Redirect to projects
        break;
      case "CV":
        window.location.href = "./cv.html"; // Redirect to CV
        break;
      case "Contact":
        window.location.href = "./contact.html"; // Redirect to contact
        break;
      default:
        break;
    }

    // Get the distance to the intersection point
    const distance = intersects[0].distance;

    // Update the rayLine to match the intersection point
    const endPoint = raycaster.ray.direction.clone().multiplyScalar(distance);
    rayLine.geometry.setFromPoints([
      raycaster.ray.origin, // Start from the camera position
      endPoint, // End at the intersection point
    ]);
  } else {
    // If no intersection, the ray should be drawn at a fixed length (e.g., 500 units)
    rayLine.geometry.setFromPoints([
      raycaster.ray.origin, // Start from the camera position
      raycaster.ray.direction.clone().multiplyScalar(500), // Extend the ray 500 units
    ]);
  }
}
