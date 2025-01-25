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

let headbobAmplitude = 0.1; // Amplitude of the headbob (how far up/down)
let headbobFrequency = 10; // Frequency of the headbob (how fast it oscillates)
let headbobTime = 0; // Track the elapsed time for headbob oscillation

export function updateMovement() {
  // Create a quaternion from the camera's Euler rotation
  const cameraQuaternion = new THREE.Quaternion().setFromEuler(camera.rotation);

  // Calculate the forward and right directions relative to the camera's rotation
  const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(cameraQuaternion);
  const right = new THREE.Vector3(1, 0, 0).applyQuaternion(cameraQuaternion);

  // Reset the direction vector
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
  velocity.addScaledVector(direction, acceleration);

  // Clamp the velocity to the max speed
  if (velocity.length() > maxSpeed) {
    velocity.setLength(maxSpeed);
  }

  // Perform collision check before moving
  if (!checkCollisions()) {
    // Apply velocity to the camera's position if no collision detected
    camera.position.add(velocity);
  }

  // Gravity effect (if above ground)
  if (camera.position.y > ground.position.y + 5) {
    velocity.y -= gravity * delta;
  } else {
    velocity.y = 0;
    camera.position.y = ground.position.y + 5;
  }

  // Apply deceleration to the velocity (smooth stop)
  velocity.multiplyScalar(0.9);
}

function checkCollisions() {
  const origin = camera.position.clone();

  // Get the camera's velocity as the movement direction
  const movementDirection = velocity.clone().normalize();

  // Use a shorter ray distance for better collision detection, depending on speed
  const maxRayDistance = Math.min(velocity.length() * 2, 20); // Max distance to check

  // Perform the raycast in the direction of movement (forward)
  raycaster.ray.origin.copy(origin);
  raycaster.ray.direction.copy(movementDirection);

  // Perform the intersection test against all objects in the scene
  const intersects = raycaster.intersectObjects(scene.children, true);

  // If the ray intersects with an object, handle the collision
  if (intersects.length > 0) {
    const hit = intersects[0]; // The first object hit
    const hitDistance = hit.distance;

    // console.log(`Collision detected at distance: ${hitDistance}`);

    // Handle collisions with the walls or enemies
    if (hitDistance < maxRayDistance) {
      // Stop movement on X and Z axes if collision is detected
      velocity.set(0, velocity.y, 0); // Preserve Y velocity (gravity, falling, etc.)

      // Optionally, adjust the camera position to avoid clipping into the object
      camera.position.addScaledVector(movementDirection, -0.1);

      // console.log("Camera blocked from passing through object");
      return true; // Collision detected, block movement
    }
  }

  // Check for ground to avoid floating (raycast downward)
  const groundRay = new THREE.Raycaster(
    camera.position.clone(),
    new THREE.Vector3(0, -1, 0)
  );
  const groundIntersects = groundRay.intersectObjects(scene.children, true);

  // Handle ground detection (prevents floating)
  if (groundIntersects.length > 0) {
    const groundHit = groundIntersects[0];
    const groundY = groundHit.point.y;

    // Adjust the Y position to be on the ground
    if (camera.position.y > groundY + 0.1) {
      camera.position.y = groundY + 0.1; // Prevent camera from floating above ground
    }

    // Stop downward velocity if near ground
    if (velocity.y < 0) {
      velocity.y = 0;
    }
  }

  // No collision detected, movement allowed
  return false;
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
    switch (hitObject.tag) {
      case "Home":
        window.location.href = "./index.html"; // Redirect to home
        console.log("Home hit");
        break;
      case "About":
        window.location.href = "./about.html"; // Redirect to about
        console.log("About hit");

        break;
      case "Projects":
        window.location.href = "./projects.html"; // Redirect to projects
        console.log("Projects hit");

        break;
      case "CV":
        window.location.href = "./cv.html"; // Redirect to CV
        console.log("CV hit");

        break;
      case "Contact":
        window.location.href = "./contact.html"; // Redirect to contact
        console.log("Contact hit");
        break;
      default:
        console.log("No clue what you hit mate");
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
