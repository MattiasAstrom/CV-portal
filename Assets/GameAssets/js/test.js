// // import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.128.0/build/three.module.js";

// let camera, scene, renderer;
// let moveForward = false,
//   moveBackward = false,
//   moveLeft = false,
//   moveRight = false;
// let velocity = new THREE.Vector3();
// let direction = new THREE.Vector3();
// let speed = 5; // Speed of movement
// let acceleration = 0.1; // Acceleration factor
// let maxSpeed = 20; // Max speed
// let mouseX = 0,
//   mouseY = 0; // Mouse position variables
// let isPointerLocked = false; // Pointer lock state
// let rotationSpeed = 0.1; // Sensitivity factor for rotation
// let sensitivity = 0.002; // Mouse sensitivity variable (adjustable)

// let clock = new THREE.Clock();
// let lastTime = 0; // Track time for smooth delta updates

// init();
// animate();

// function init() {
//   // Scene setup
//   scene = new THREE.Scene();

//   camera = new THREE.PerspectiveCamera(
//     70,
//     window.innerWidth / window.innerHeight,
//     0.1,
//     1000
//   );
//   camera.rotation.order = "YXZ"; // Set the correct rotation order
//   camera.position.set(0, 5, 20); // Position the camera

//   // WebGLRenderer setup
//   renderer = new THREE.WebGLRenderer({
//     canvas: document.getElementById("webgl-canvas"),
//   });
//   renderer.setPixelRatio(window.devicePixelRatio);
//   renderer.setSize(window.innerWidth, window.innerHeight);
//   renderer.shadowMap.enabled = true;
//   renderer.shadowMap.type = THREE.VSMShadowMap;
//   renderer.toneMapping = THREE.ACESFilmicToneMapping;

//   document.body.appendChild(renderer.domElement);

//   // Lighting setup
//   const light = new THREE.DirectionalLight(0xffffff, 1);
//   light.position.set(5, 5, 5).normalize();
//   scene.add(light);

//   //   const directionalLight = new THREE.DirectionalLight(0xffffff, 2.5);
//   //   directionalLight.position.set(-5, 25, -1);
//   //   directionalLight.castShadow = true;
//   //   directionalLight.shadow.camera.near = 0.01;
//   //   directionalLight.shadow.camera.far = 500;
//   //   directionalLight.shadow.camera.right = 30;
//   //   directionalLight.shadow.camera.left = -30;
//   //   directionalLight.shadow.camera.top = 30;
//   //   directionalLight.shadow.camera.bottom = -30;
//   //   directionalLight.shadow.mapSize.width = 1024;
//   //   directionalLight.shadow.mapSize.height = 1024;
//   //   directionalLight.shadow.radius = 4;
//   //   directionalLight.shadow.bias = -0.00006;
//   //   scene.add(directionalLight);

//   // Add simple floor
//   const floorGeometry = new THREE.PlaneGeometry(1000, 1000);
//   const floorMaterial = new THREE.MeshLambertMaterial({
//     color: 0x888888,
//     side: THREE.DoubleSide,
//   });
//   const floor = new THREE.Mesh(floorGeometry, floorMaterial);
//   floor.rotation.x = -Math.PI / 2;
//   scene.add(floor);

//   // Add random objects to the scene
//   addObjects();

//   // Event listeners for mouse and keyboard input
//   document.addEventListener("click", onClick, false);
//   window.addEventListener("resize", onWindowResize, false);
//   document.addEventListener("keydown", onKeyDown, false);
//   document.addEventListener("keyup", onKeyUp, false);
//   document.addEventListener("mousemove", onMouseMove, false);
// }

// function addObjects() {
//   // Adding some spheres to the scene
//   for (let i = 0; i < 50; i++) {
//     const geometry = new THREE.SphereGeometry(Math.random() * 2 + 1, 32, 32);
//     const material = new THREE.MeshLambertMaterial({
//       color: Math.random() * 0xffffff,
//     });
//     const sphere = new THREE.Mesh(geometry, material);
//     sphere.position.set(
//       Math.random() * 1000 - 500,
//       Math.random() * 10 + 2,
//       Math.random() * 1000 - 500
//     );
//     scene.add(sphere);
//   }
// }

// function onWindowResize() {
//   camera.aspect = window.innerWidth / window.innerHeight;
//   camera.updateProjectionMatrix();
//   renderer.setSize(window.innerWidth, window.innerHeight);
// }

// function onKeyDown(event) {
//   switch (event.code) {
//     case "ArrowUp":
//     case "KeyW":
//       moveForward = true;
//       break;
//     case "ArrowDown":
//     case "KeyS":
//       moveBackward = true;
//       break;
//     case "ArrowLeft":
//     case "KeyA":
//       moveLeft = true;
//       break;
//     case "ArrowRight":
//     case "KeyD":
//       moveRight = true;
//       break;
//   }
// }

// function onKeyUp(event) {
//   switch (event.code) {
//     case "ArrowUp":
//     case "KeyW":
//       moveForward = false;
//       break;
//     case "ArrowDown":
//     case "KeyS":
//       moveBackward = false;
//       break;
//     case "ArrowLeft":
//     case "KeyA":
//       moveLeft = false;
//       break;
//     case "ArrowRight":
//     case "KeyD":
//       moveRight = false;
//       break;
//   }
// }

// function onClick() {
//   // Lock the pointer on click
//   renderer.domElement.requestPointerLock();
//   console.log("Mouse clicked, attempting to lock pointer");
// }

// document.addEventListener("pointerlockchange", () => {
//   if (document.pointerLockElement) {
//     isPointerLocked = true;
//     console.log("Pointer is locked");
//   } else {
//     isPointerLocked = false;
//     console.log("Pointer is no longer locked");
//   }
// });

// function onMouseMove(event) {
//   if (isPointerLocked) {
//     // Get mouse movement for x and y
//     const movementX = event.movementX || event.mozMovementX || 0;
//     const movementY = event.movementY || event.mozMovementY || 0;

//     // Adjust sensitivity based on mouse movement
//     mouseX += movementX * sensitivity * -1; // Horizontal (yaw) rotation (right-left inverted fix)
//     mouseY -= movementY * sensitivity; // Vertical (pitch) rotation

//     // Apply yaw rotation to camera (left-right movement)
//     camera.rotation.y = mouseX;

//     // Apply pitch rotation to camera (up-down movement)
//     camera.rotation.x = mouseY;

//     // Clamp pitch rotation to avoid flipping
//     camera.rotation.x = Math.max(
//       Math.min(camera.rotation.x, Math.PI / 2),
//       -Math.PI / 2
//     );
//   }
// }

// function animate() {
//   requestAnimationFrame(animate);

//   const delta = clock.getDelta(); // Time in seconds between frames

//   // Create a quaternion from the camera's Euler rotation
//   const cameraQuaternion = new THREE.Quaternion().setFromEuler(camera.rotation);

//   // Calculate the forward and right directions relative to the camera's rotation
//   const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(cameraQuaternion);
//   const right = new THREE.Vector3(1, 0, 0).applyQuaternion(cameraQuaternion);

//   // Set the direction based on user input
//   direction.set(0, 0, 0); // Reset direction

//   if (moveForward) direction.add(forward); // Move forward
//   if (moveBackward) direction.add(forward.negate()); // Move backward
//   if (moveLeft) direction.add(right.negate()); // Move left
//   if (moveRight) direction.add(right); // Move right

//   // Normalize the direction to ensure consistent movement
//   direction.normalize();

//   // Apply speed to the direction
//   direction.multiplyScalar(speed);

//   // Apply acceleration to velocity (smooth acceleration)
//   velocity.addScaledVector(direction, acceleration);

//   // Clamp the velocity to the max speed
//   if (velocity.length() > maxSpeed) {
//     velocity.setLength(maxSpeed);
//   }

//   // Apply velocity to the camera's position (move the camera)
//   camera.position.add(velocity);

//   // Apply deceleration to the velocity (smooth stop)
//   velocity.multiplyScalar(0.98); // Gradual slowdown for smooth deceleration

//   // Render the scene
//   renderer.render(scene, camera);
// }
