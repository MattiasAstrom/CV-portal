// movement.js
import { moveForward, moveBackward, moveLeft, moveRight } from "./input.js";
import { camera } from "./scene.js";
import { THREE } from "./main.js";
import { scene } from "./scene.js";

let velocity = new THREE.Vector3();
let direction = new THREE.Vector3();
let speed = 1;
let acceleration = 0.05;
let maxSpeed = 3;
let gravity = 0.1;

export function updateMovement(clock) {
  const cameraQuaternion = new THREE.Quaternion().setFromEuler(camera.rotation);
  const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(cameraQuaternion);
  const right = new THREE.Vector3(1, 0, 0).applyQuaternion(cameraQuaternion);

  direction.set(0, 0, 0);

  // Update direction based on user input
  if (moveForward) direction.add(forward);
  if (moveBackward) direction.add(forward.negate());
  if (moveLeft) direction.add(right.negate());
  if (moveRight) direction.add(right);

  direction.normalize();
  direction.multiplyScalar(speed);
  velocity.addScaledVector(direction, acceleration);

  if (velocity.length() > maxSpeed) {
    velocity.setLength(maxSpeed);
  }

  if (!checkCollisions()) {
    camera.position.add(velocity);
  }

  // Gravity effect (if above ground)
  if (camera.position.y > 0 + 5) {
    velocity.y -= gravity * clock.getDelta();
  } else {
    velocity.y = 0;
    camera.position.y = 0 + 5;
  }

  velocity.multiplyScalar(0.9);
}

function checkCollisions() {
  const origin = camera.position.clone();

  const movementDirection = velocity.clone().normalize();
  const maxRayDistance = Math.min(velocity.length() * 2, 20); // Max distance to check

  raycaster.ray.origin.copy(origin);
  raycaster.ray.direction.copy(movementDirection);

  const intersects = raycaster.intersectObjects(scene.children, true);

  if (intersects.length > 0) {
    const hit = intersects[0];
    const hitDistance = hit.distance;

    if (hitDistance < maxRayDistance) {
      velocity.set(0, velocity.y, 0);
      camera.position.addScaledVector(movementDirection, -0.1);
      return true;
    }
  }

  const groundRay = new THREE.Raycaster(
    camera.position.clone(),
    new THREE.Vector3(0, -1, 0)
  );
  const groundIntersects = groundRay.intersectObjects(scene.children, true);

  if (groundIntersects.length > 0) {
    const groundHit = groundIntersects[0];
    const groundY = groundHit.point.y;

    if (camera.position.y > groundY + 0.1) {
      camera.position.y = groundY + 0.1;
    }
    if (velocity.y < 0) {
      velocity.y = 0;
    }
  }
  return false;
}

// Raycaster setup
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

export function initRayVisualizer() {
  const geometry = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(0, 0, -1),
  ]);
  const material = new THREE.LineBasicMaterial({ color: 0xff0000 });
  rayLine = new THREE.Line(geometry, material);
  scene.add(rayLine);
}

// Function to update the ray and the visualization
export function checkRaycast() {
  const cameraDirection = new THREE.Vector3(0, 0, -1);
  camera.getWorldDirection(cameraDirection);

  raycaster.ray.origin.set(
    camera.position.x,
    camera.position.y,
    camera.position.z
  );

  raycaster.ray.direction.copy(cameraDirection);
  const intersects = raycaster.intersectObjects(scene.children);

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
  }
}
