// // import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.128.0/build/three.module.js";
// // import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";
// // import { OrbitControls } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls";

// // RENDERER
// const renderer = new THREE.WebGLRenderer({ antialias: true });
// renderer.setSize(window.innerWidth, window.innerHeight);
// renderer.setPixelRatio(window.devicePixelRatio);
// renderer.shadowMap.enabled = true;
// document.body.appendChild(renderer.domElement);

// const primaryScene = new THREE.Scene();

// // CAMERA
// const cameraSettings = { fov: 45, near: 0.1, far: 500 };
// const cameraPos = new THREE.Vector3(-16, 8, 16);
// const primaryCamera = new THREE.PerspectiveCamera(
//   cameraSettings.fov,
//   window.innerWidth / window.innerHeight,
//   cameraSettings.near,
//   cameraSettings.far
// );
// primaryCamera.position.set(cameraPos.x, cameraPos.y, cameraPos.z);

// // ORBIT CAMERA CONTROLS
// const orbitControls = new OrbitControls(primaryCamera, renderer.domElement);
// orbitControls.enableDamping = true;
// orbitControls.enablePan = false;
// orbitControls.enableZoom = false;
// orbitControls.minDistance = 5;
// orbitControls.maxDistance = 60;
// orbitControls.maxPolarAngle = Math.PI / 2 - 0.05;
// orbitControls.minPolarAngle = Math.PI / 4;
// orbitControls.update();

// // RENDER TARGETS (5 separate render targets)
// const renderTargets = [];
// const renderTargetWidth = 256;
// const renderTargetHeight = 256;

// for (let i = 0; i < 5; i++) {
//   renderTargets[i] = new THREE.WebGLRenderTarget(
//     renderTargetWidth,
//     renderTargetHeight,
//     {
//       minFilter: THREE.LinearFilter,
//       magFilter: THREE.LinearFilter,
//       format: THREE.RGBAFormat,
//     }
//   );
// }

// // MATERIALS FOR RENDER TARGETS
// const materials = [];
// for (let i = 0; i < 5; i++) {
//   materials[i] = new THREE.MeshPhongMaterial({
//     map: renderTargets[i].texture,
//   });
// }

// // SECONDARY SCENES (Forest Scenes)
// const secondaryScenes = [];
// const secondaryDirectionalLights = [];

// // Define a radius for the half circle
// const radius = 20;
// const sceneCount = 5;
// const angleStep = Math.PI / (sceneCount - 1); // Spread the scenes evenly

// // Create the secondary scenes
// for (let i = 0; i < sceneCount; i++) {
//   secondaryScenes[i] = new THREE.Scene();
//   secondaryScenes[i].background = new THREE.Color(0xa8def0); // Light blue background

//   // Directional light for each scene
//   const secondaryDirectionalLight = new THREE.DirectionalLight(0xffffff, 1);
//   secondaryDirectionalLight.position.set(-10, 10, 10);
//   secondaryDirectionalLight.castShadow = true;
//   secondaryDirectionalLight.shadow.mapSize.width = 4096;
//   secondaryDirectionalLight.shadow.mapSize.height = 4096;
//   const d = 35;
//   secondaryDirectionalLight.shadow.camera.left = -d;
//   secondaryDirectionalLight.shadow.camera.right = d;
//   secondaryDirectionalLight.shadow.camera.top = d;
//   secondaryDirectionalLight.shadow.camera.bottom = -d;
//   secondaryScenes[i].add(secondaryDirectionalLight);
//   secondaryDirectionalLights.push(secondaryDirectionalLight);

//   // Load forest assets (trees, rocks, etc.)
//   new GLTFLoader().load(
//     "Assets/GameAssets/glb/dark-ground.glb",
//     function (gltf) {
//       gltf.scene.traverse(function (object) {
//         object.receiveShadow = true;
//       });
//       gltf.scene.position.set(i * 10, 0, 0); // Offset the ground for each scene
//       secondaryScenes[i].add(gltf.scene);
//     }
//   );

//   // Add other objects like trees, rocks, etc...
//   // Example:
//   new GLTFLoader().load(
//     "Assets/GameAssets/glTF/DeadTree_1.gltf",
//     function (gltf) {
//       gltf.scene.traverse(function (object) {
//         object.position.set(i * 5, 0, 5); // Unique position for each scene
//         object.castShadow = true;
//       });
//       secondaryScenes[i].add(gltf.scene);
//     }
//   );
// }

// // POSITION THE SECONDARY SCENES IN A HALF CIRCLE AROUND THE CAMERA
// for (let i = 0; i < sceneCount; i++) {
//   // Calculate the angle for each scene
//   const angle = -Math.PI / 2 + i * angleStep; // Start from -PI/2 and go to PI/2
//   const x = radius * Math.cos(angle); // Calculate the x position on the arc
//   const z = radius * Math.sin(angle); // Calculate the z position on the arc
//   const y = 0; // Keep the y position constant

//   // Apply the calculated positions
//   secondaryScenes[i].position.set(x, y, z);
// }

// // POSITION THE RENDER TARGET PLANES
// const targetPlanes = [];
// const borderPlanes = [];

// for (let i = 0; i < 5; i++) {
//   // Create a render target plane
//   const targetPlane = new THREE.Mesh(
//     new THREE.PlaneGeometry(6, 7, 32),
//     materials[i]
//   );
//   targetPlane.rotation.y = -Math.PI / 4;
//   targetPlane.position.set(-5 + i * 10, 3.5, 5); // Offset positions for each plane
//   targetPlane.castShadow = true;
//   primaryScene.add(targetPlane);
//   targetPlanes.push(targetPlane);

//   // Create a border for the render target plane, with a slight z offset to avoid flickering
//   const borderPlane = new THREE.Mesh(
//     new THREE.PlaneGeometry(6.2, 7.2), // Slightly larger than the target plane
//     new THREE.MeshBasicMaterial({ color: 0x000000 }) // Black border
//   );
//   borderPlane.rotation.y = -Math.PI / 4;
//   borderPlane.position.set(-4.5 + i * 10, 3.55, 5); // Slightly offset on the y-axis to avoid overlap with target
//   primaryScene.add(borderPlane);
//   borderPlanes.push(borderPlane);
// }

// // PRIMARY SCENE
// primaryScene.background = new THREE.Color(0x0e0e0e); // Dark background
// {
//   const color = 0xffffff;
//   const intensity = 1;
//   const directionalLight = new THREE.DirectionalLight(color, intensity);
//   directionalLight.position.set(3, 10, -4);
//   directionalLight.castShadow = true;
//   directionalLight.shadow.mapSize.width = 4096;
//   directionalLight.shadow.mapSize.height = 4096;
//   const d = 35;
//   directionalLight.shadow.camera.left = -d;
//   directionalLight.shadow.camera.right = d;
//   directionalLight.shadow.camera.top = d;
//   directionalLight.shadow.camera.bottom = -d;
//   primaryScene.add(directionalLight);

//   const ambientLight = new THREE.AmbientLight(color, 1);
//   primaryScene.add(ambientLight);
// }
// // TEXT CREATION (Restoring the text logic)
// const textMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 }); // Yellow text color

// function createText(
//   tag,
//   text,
//   size,
//   depth,
//   hover,
//   materials,
//   scene,
//   mirror = false
// ) {
//   const loader = new THREE.FontLoader();
//   loader.load(
//     "https://threejs.org/examples/fonts/helvetiker_regular.typeface.json",
//     (font) => {
//       const textGeo = new THREE.TextGeometry(text, {
//         font: font,
//         size: size,
//         height: depth,
//         curveSegments: 12,
//         bevelThickness: 0.1,
//         bevelSize: 0.1,
//         bevelEnabled: true,
//       });

//       textGeo.computeBoundingBox();
//       const centerOffset =
//         -0.5 * (textGeo.boundingBox.max.x - textGeo.boundingBox.min.x);

//       const textMesh1 = new THREE.Mesh(textGeo, materials);
//       textMesh1.position.x = 0;
//       textMesh1.position.y = hover;
//       textMesh1.position.z = -5; // Position the text in front of everything
//       textMesh1.rotation.x = 0;
//       textMesh1.rotation.y = Math.PI * 2;
//       textMesh1.name = tag;

//       scene.add(textMesh1);

//       if (mirror) {
//         const textMesh2 = new THREE.Mesh(textGeo, materials);
//         textMesh2.position.x = centerOffset;
//         textMesh2.position.y = -hover;
//         textMesh2.position.z = depth;
//         textMesh2.rotation.x = Math.PI;
//         textMesh2.rotation.y = Math.PI * 2;
//         textMesh2.name = tag;
//         scene.add(textMesh2);
//       }

//       // Store references to text objects for future updates
//       textMesh1.lookAt(primaryCamera.position);
//       if (mirror) {
//         textMesh2.lookAt(primaryCamera.position);
//       }
//     }
//   );
// }
// // Add the "About" text to each secondary scene
// for (let i = 0; i < 5; i++) {
//   createText("centerText", "About", 2, 1, 5, textMaterial, secondaryScenes[i]);
// }

// // GAME LOOP
// let lastUpdateTime = 0;
// const updateInterval = 20;

// function gameLoop() {
//   const time = new Date().getTime();

//   if (time - lastUpdateTime > updateInterval) {
//     // Update directional light positions for secondary scenes
//     secondaryDirectionalLights.forEach((light, index) => {
//       light.position.x = Math.cos(time * 0.002 + index) * 10;
//       light.position.z = Math.sin(time * 0.002 + index) * 10;
//     });
//     lastUpdateTime = time;
//   }

//   orbitControls.update();

//   // Render all secondary scenes into their corresponding render targets
//   for (let i = 0; i < 5; i++) {
//     renderer.setRenderTarget(renderTargets[i]);
//     renderer.render(secondaryScenes[i], primaryCamera);
//   }

//   // Render the primary scene
//   renderer.setRenderTarget(null);
//   renderer.render(primaryScene, primaryCamera);

//   requestAnimationFrame(gameLoop);
// }

// requestAnimationFrame(gameLoop);
