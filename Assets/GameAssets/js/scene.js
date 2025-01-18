import { THREE } from "./main.js";
// Global variablesobjloadtextureloader
export let scene, camera, renderer, ground;

let height = 0;
export function initScene() {
  // Scene setup
  scene = new THREE.Scene();
  {
    const color = 0xffffff; // white
    const near = 50;
    const far = 1000;
    scene.fog = new THREE.Fog(color, near, far);
  }
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
  const ambientLight = new THREE.AmbientLight(0x404040, 0.5); // Soft light
  scene.add(ambientLight);

  // Add objects to the scene
  addObjects();

  // Setup skybox
  addSkybox();

  // Setup lighting
  addLighting();

  // Setup Ground
  addGround();

  //add text objects
  const textMaterial = new THREE.MeshBasicMaterial({ color: 0xd5cc0d });
  textMaterial.alphaHash = true;
  textMaterial.colorWhite = true;
  textMaterial.opacity = 0.5;
  createText("Home", "Home", 2, 1, 4, textMaterial);
  createText("About", "About", 2, 1, 8, textMaterial);
  createText("Projects", "Projects", 2, 1, 12, textMaterial);
  createText("CV", "CV", 2, 1, 16, textMaterial);
  createText("Contact", "Contact", 2, 1, 20, textMaterial);

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

// Function to create the box with text on it
export function addTextBox() {
  // Create the geometry for the box
  const geometry = new THREE.BoxGeometry(2, 2, 2);
  const material = new THREE.MeshBasicMaterial({
    color: 0x00ff00,
    wireframe: false,
  });

  const box = new THREE.Mesh(geometry, material);
  box.position.set(0, 1, -5); // Position the box in the scene
  box.name = "homeBox"; // Give the box a name for raycasting
  scene.add(box);

  // Create a text sprite for the label
  const loader = new THREE.FontLoader();
  loader.load(
    "https://threejs.org/examples/fonts/helvetiker_regular.typeface.json",
    (font) => {
      const textGeometry = new THREE.TextGeometry("Go Home", {
        font: font,
        size: 0.5,
        height: 0.1,
      });

      const textMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const textMesh = new THREE.Mesh(textGeometry, textMaterial);

      // Position the text on the box
      textMesh.position.set(0, 0.1, 0); // Adjust the position to the front of the box
      box.add(textMesh);
    }
  );

  return box; // Return the box so we can use it for raycasting
}

function createText(tag, text, size, depth, hover, materials, mirror = false) {
  const loader = new THREE.FontLoader();
  loader.load(
    "https://threejs.org/examples/fonts/helvetiker_regular.typeface.json",
    (font) => {
      const textGeo = new THREE.TextGeometry(text, {
        font: font,
        size: size,
        height: depth,
        curveSegments: 12,
        bevelThickness: 0.1,
        bevelSize: 0.1,
        bevelEnabled: true,
      });

      textGeo.computeBoundingBox();
      const centerOffset =
        -0.5 * (textGeo.boundingBox.max.x - textGeo.boundingBox.min.x);

      const textMesh1 = new THREE.Mesh(textGeo, materials);
      textMesh1.position.x = 25;
      textMesh1.position.y = hover;
      textMesh1.position.z = -25;
      textMesh1.rotation.x = 0;
      textMesh1.rotation.y = Math.PI * 2;
      textMesh1.name = tag;
      scene.add(textMesh1); // Directly add to scene, or group it if necessary

      if (mirror) {
        const textMesh2 = new THREE.Mesh(textGeo, materials);
        textMesh2.position.x = centerOffset;
        textMesh2.position.y = -hover;
        textMesh2.position.z = depth;
        textMesh2.rotation.x = Math.PI;
        textMesh2.rotation.y = Math.PI * 2;
        textMesh2.name = tag;
        scene.add(textMesh2); // Add mirrored text to scene
      }
    }
  );
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
  // Define the texture number as a variable
  const textureNumber = 9;
  //9
  // Construct the file path dynamically using the texture number
  const albedoTexture = new THREE.TextureLoader().load(
    `./Assets/GameAssets/imgs/Textures/Ground/Ground_${textureNumber}_Albedo.png`
  );
  const normalTexture = new THREE.TextureLoader().load(
    `./Assets/GameAssets/imgs/Textures/Ground/Ground_${textureNumber}_Normal.png`
  );
  const metallicTexture = new THREE.TextureLoader().load(
    `./Assets/GameAssets/imgs/Textures/Ground/Ground_${textureNumber}_Metallic.png`
  );
  const heightTexture = new THREE.TextureLoader().load(
    `./Assets/GameAssets/imgs/Textures/Ground/Ground_${textureNumber}_Height.png`
  );
  const aoTexture = new THREE.TextureLoader().load(
    `./Assets/GameAssets/imgs/Textures/Ground/Ground_${textureNumber}_Occlusion.png`
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

  geometry.dispose();
  groundMaterial.dispose();
}

function addLighting() {
  // Directional Light (main sunlight)
  const light = new THREE.DirectionalLight(0xffffff, 0.1);
  light.position.set(5, 5, 5).normalize();
  scene.add(light);
  // Ambient Light (to ensure some minimal lighting)
  const ambientLight = new THREE.AmbientLight(0x404040, 0.1); // Ambient light with a bit of light everywhere
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
    "./Assets/GameAssets/imgs/Skybox/blue_nebulae_1.png"
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
