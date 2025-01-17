import { THREE } from "./main.js";
// Global variablesobjloadtextureloader
export let scene, camera, renderer, ground;

export function initScene() {
  // Scene setup
  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(
    70,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.rotation.order = "YXZ"; // Set the correct rotation order
  camera.position.set(0, 5, 20); // Initial camera position

  // Get the canvas element and its container
  const canvas = document.getElementById("webgl-canvas");
  // WebGLRenderer setup
  renderer = new THREE.WebGLRenderer({
    canvas: canvas,
  });
  renderer.setPixelRatio(window.devicePixelRatio);
  document.body.appendChild(renderer.domElement);

  // Set initial size based on the container
  setCanvasSize();

  // Lighting setup
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(5, 5, 5).normalize();
  directionalLight.castShadow = true;
  scene.add(directionalLight);

  // Ambient Light
  const ambientLight = new THREE.AmbientLight(0x404040, 1); // Soft light
  scene.add(ambientLight);

  // Add objects to the scene
  addObjects();

  // Setup skybox
  addSkybox();

  // Setup lighting
  addLighting();

  // Setup Ground
  addGround();

  // Resize event listener
  window.addEventListener("resize", onWindowResize, false);
}
function setCanvasSize() {
  const container = document.getElementById("webgl-canvas");

  // Set renderer size to match container size
  const width = container.clientWidth;
  const height = container.clientHeight;

  renderer.setSize(width, height);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
}

function addObjects() {
  // Add random spheres to the scene
  for (let i = 0; i < 50; i++) {
    const geometry = new THREE.SphereGeometry(Math.random() * 2 + 1, 32, 32);
    const material = new THREE.MeshLambertMaterial({
      color: Math.random() * 0xffffff,
    });
    const sphere = new THREE.Mesh(geometry, material);
    sphere.position.set(
      Math.random() * 1000 - 500,
      Math.random() * 10 + 2,
      Math.random() * 1000 - 500
    );
    scene.add(sphere);
  }
  // Add random cubes to the scene
  for (let i = 0; i < 50; i++) {
    const geometry = new THREE.BoxGeometry(
      Math.random() * 2 + 1,
      Math.random() * 2 + 1,
      Math.random() * 2 + 1
    );
    const material = new THREE.MeshLambertMaterial({
      color: Math.random() * 0xffffff,
    });
    const cube = new THREE.Mesh(geometry, material);
    cube.position.set(
      Math.random() * 1000 - 500,
      Math.random() * 10 + 2,
      Math.random() * 1000 - 500
    );
    scene.add(cube);
  }
}

function addGround() {
  // Load the different textures
  const albedoTexture = new THREE.TextureLoader().load(
    "./Assets/GameAssets/imgs/Textures/ground/Ground_1_Albedo.png"
  );
  const normalTexture = new THREE.TextureLoader().load(
    "./Assets/GameAssets/imgs/Textures/ground/Ground_1_Normal.png"
  );
  const metallicTexture = new THREE.TextureLoader().load(
    "./Assets/GameAssets/imgs/Textures/ground/Ground_1_Metallic.png"
  );
  const heightTexture = new THREE.TextureLoader().load(
    "./Assets/GameAssets/imgs/Textures/ground/Ground_1_Height.png"
  );
  const aoTexture = new THREE.TextureLoader().load(
    "./Assets/GameAssets/imgs/Textures/ground/Ground_1_Occlusion.png"
  );

  // Optionally, you can adjust the wrapping for the textures
  albedoTexture.wrapS = THREE.RepeatWrapping;
  albedoTexture.wrapT = THREE.RepeatWrapping;
  normalTexture.wrapS = THREE.RepeatWrapping;
  normalTexture.wrapT = THREE.RepeatWrapping;
  metallicTexture.wrapS = THREE.RepeatWrapping;
  metallicTexture.wrapT = THREE.RepeatWrapping;
  heightTexture.wrapS = THREE.RepeatWrapping;
  heightTexture.wrapT = THREE.RepeatWrapping;
  aoTexture.wrapS = THREE.RepeatWrapping;
  aoTexture.wrapT = THREE.RepeatWrapping;

  // Set texture repeats to control the scaling of textures
  let xRep = 100;
  let yRep = 100;
  albedoTexture.repeat.set(xRep, yRep);
  normalTexture.repeat.set(xRep, yRep);
  metallicTexture.repeat.set(xRep, yRep);
  heightTexture.repeat.set(xRep, yRep);
  aoTexture.repeat.set(xRep, yRep);

  // Create the material using MeshStandardMaterial
  const groundMaterial = new THREE.MeshStandardMaterial({
    map: albedoTexture, // Albedo (Base Color)
    normalMap: normalTexture, // Normal Map
    metalnessMap: metallicTexture, // Metallic Map
    roughnessMap: aoTexture, // Ambient Occlusion as Roughness map (you can adjust this as needed)
    displacementMap: heightTexture, // Height Map (displacement)
    displacementScale: 0.1, // Scale of the displacement (adjust as needed)
    side: THREE.DoubleSide, // Make sure both sides of the plane are rendered
  });

  // Create the geometry for the ground (plane)
  const geometry = new THREE.PlaneGeometry(500, 500);

  // Create the mesh with the geometry and the complex material
  ground = new THREE.Mesh(geometry, groundMaterial);

  // Rotate the ground to be flat
  ground.rotation.x = -Math.PI / 2;

  // Add the ground to the scene
  scene.add(ground);
}

function addLighting() {
  // Directional Light (main sunlight)
  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(5, 5, 5).normalize();
  scene.add(light);

  // Ambient Light (to ensure some minimal lighting)
  const ambientLight = new THREE.AmbientLight(0x404040, 1); // Ambient light with a bit of light everywhere
  scene.add(ambientLight);
}

//6images skybox
// function addSkybox() {
//   // Load skybox texture
//   const loader = new THREE.CubeTextureLoader();
//   const texture = loader.load([
//     "assets/kurt/space_rt.png", // Right
//     "assets/kurt/space_lf.png", // Left
//     "assets/kurt/space_up.png", // Top
//     "assets/kurt/space_dn.png", // Bottom
//     "assets/kurt/space_ft.png", // Front
//     "assets/kurt/space_bk.png", // Back
//   ]);
//   scene.background = texture;
// }

function addSkybox() {
  const loader = new THREE.TextureLoader();

  // Load the equirectangular panoramic image
  const spaceTexture = loader.load(
    "./Assets/GameAssets/imgs/skybox/clay4_edge.bmp"
  );

  // Create a large sphere for the skybox
  const geometry = new THREE.SphereGeometry(500, 60, 40); // Large sphere
  const material = new THREE.MeshBasicMaterial({
    map: spaceTexture,
    side: THREE.BackSide, // Make the texture face inside the sphere
  });

  const skybox = new THREE.Mesh(geometry, material);
  scene.add(skybox); // Add the sphere to the scene
}

function onWindowResize() {
  const container = document.getElementById("fps-game-container");

  // Set renderer size to match container size
  const width = container.clientWidth;
  const height = container.clientHeight;

  renderer.setSize(width, height);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
}
