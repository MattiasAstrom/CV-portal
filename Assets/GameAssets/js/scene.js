import { THREE } from "./main.js";
import { GLTFLoader } from "./main.js";
import { mixers } from "./animate.js";
import { animComposerInit } from "./animate.js";
// Global variablesobjloadtextureloader
export let scene,
  camera,
  renderer,
  ground,
  skybox,
  skyboxes = [];
// POSITION THE RENDER TARGET PLANES
export let targetPlanes = [];
export let borderPlanes = [];
// export let skybox;
// Define a radius for the half circle
export const sceneCount = 4;
// Get the canvas element and its container
const canvas = document.getElementById("webgl-canvas");
let pixelRatio = window.devicePixelRatio;

// RENDER TARGETS (5 separate render targets)
export const renderTargets = [];
const renderTargetWidth = 512;
const renderTargetHeight = 512;
// SECONDARY SCENES (Forest Scenes)
export const secondaryScenes = [];
export const secondaryDirectionalLights = [];
export let directionalLight;
export function initScene() {
  // Scene setup
  scene = new THREE.Scene();
  {
    const color = 0xffffff; // white
    const near = 5;
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

  // RENDERER MAIN
  renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    // minFilter: THREE.LinearFilter,
    // magFilter: THREE.LinearFilter,
    // format: THREE.RGBAFormat,
    powerPreference: "high-performance",
  });

  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.shadowMap.enabled = false;
  document.body.appendChild(renderer.domElement);

  // Set initial size based on the container
  setCanvasSize();

  // Lighting setup
  directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(5, 5, 5).normalize();
  directionalLight.castShadow = true;
  scene.add(directionalLight);

  // Ambient Light
  const ambientLight = new THREE.AmbientLight(0x404040, 1.0); // Soft light
  scene.add(ambientLight);

  // Add objects to the scene
  // addObjects();

  // Setup skybox
  addSkybox();

  // Setup lighting
  addLighting();

  // Setup Ground
  addGround();

  addRenderTargets();
  //add text objects
  // const textMaterial = new THREE.MeshBasicMaterial({ color: 0xd5cc0d });
  // textMaterial.alphaHash = true;
  // textMaterial.colorWhite = true;
  // textMaterial.opacity = 0.5;
  // createText("Home", "Home", 2, 1, 4, textMaterial);
  // createText("About", "About", 2, 1, 8, textMaterial);
  // createText("Projects", "Projects", 2, 1, 12, textMaterial);
  // createText("CV", "CV", 2, 1, 16, textMaterial);
  // createText("Contact", "Contact", 2, 1, 20, textMaterial);
  animComposerInit();
  // Resize event listener
  new GLTFLoader().load(
    "Assets/GameAssets/models/animals/glTF/Wolf.gltf",
    function (gltf) {
      // Traverse through the loaded model to adjust properties if needed
      gltf.scene.traverse(function (object) {
        object.position.set(1, 0, -1); // Unique position for each scene
      });

      // Add the model to the scene
      scene.add(gltf.scene);

      // Handle animations (if they exist in the model)
      if (gltf.animations && gltf.animations.length) {
        const mixer = new THREE.AnimationMixer(gltf.scene);
        const idleClip = gltf.animations.find((clip) => clip.name === "Eating");

        if (idleClip) {
          const action = mixer.clipAction(idleClip);
          action.setLoop(THREE.LoopRepeat, Infinity);
          action.play();
        }

        // Store the mixer so it can be updated in the render loop
        mixers.push(mixer); // Add to the mixers array
      }
    }
  );
  new GLTFLoader().load(
    "Assets/GameAssets/glb/firstiteration.glb",
    function (gltf) {
      gltf.scene.traverse(function (object) {
        object.receiveShadow = true;
      });
      gltf.scene.position.set(0, 1, 0); // Offset the ground for each scene
      scene.add(gltf.scene);
    }
  );
  window.addEventListener("resize", onWindowResize, false);
}
function addRenderTargets() {
  for (let i = 0; i < 5; i++) {
    renderTargets[i] = new THREE.WebGLRenderTarget(
      renderTargetWidth,
      renderTargetHeight,
      {
        antialias: true,
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        format: THREE.RGBAFormat,
        powerPreference: "high-performance",
      }
    );
    renderer.setPixelRatio(window.devicePixelRatio * 0.6);
    renderer.shadowMap.enabled = true;
  }

  // MATERIALS FOR RENDER TARGETS
  const materials = [];
  for (let i = 0; i < 5; i++) {
    materials[i] = new THREE.MeshPhongMaterial({
      map: renderTargets[i].texture,
    });
  }

  let tags = ["Home", "About", "Projects", "Contact"];

  // Create the secondary scenes
  for (let i = 0; i < sceneCount; i++) {
    secondaryScenes[i] = new THREE.Scene();
    secondaryScenes[i].background = new THREE.Color(0xa8def0); // Light blue background

    // Create larger planes for the render targets
    const newWidth = 12; // Adjust width of the planes
    const newHeight = 14; // Adjust height of the planes
    const divSize = 2;
    // const targetPlane = new THREE.Mesh(
    //   new THREE.PlaneGeometry(newWidth, newHeight, 32),
    //   materials[i]
    // );
    let targetPlane;
    if (i === 0) {
      // Front plane (faces outward)
      targetPlane = new THREE.Mesh(
        new THREE.PlaneGeometry(newWidth, newHeight, 32),
        materials[i]
      );
      targetPlane.rotation.y = 0; // Front plane, no rotation
      targetPlane.position.set(0, 3.5, newHeight / divSize); // Position the front plane
    } else if (i === 1) {
      // Back plane (faces outward)
      targetPlane = new THREE.Mesh(
        new THREE.PlaneGeometry(newWidth, newHeight, 32),
        materials[i]
      );
      targetPlane.rotation.y = -Math.PI; // Rotate 180 degrees for the back plane
      targetPlane.position.set(0, 3.5, -newHeight / divSize); // Position the back plane
    } else if (i === 2) {
      // Left plane (faces outward)
      targetPlane = new THREE.Mesh(
        new THREE.PlaneGeometry(newWidth, newHeight, 32),
        materials[i]
      );
      targetPlane.rotation.y = Math.PI / 2; // Rotate 90 degrees for the left plane
      targetPlane.position.set(newWidth / divSize, 3.5, 0); // Position the right plane
    } else if (i === 3) {
      // Right plane (faces outward)
      targetPlane = new THREE.Mesh(
        new THREE.PlaneGeometry(newWidth, newHeight, 32),
        materials[i]
      );
      targetPlane.rotation.y = -Math.PI / 2; // Rotate -90 degrees for the right plane
      targetPlane.position.set(-newWidth / divSize, 3.5, 0); // Position the left plane
    }

    // // targetPlane.castShadow = true;
    // scene.add(targetPlane);
    // targetPlanes.push(targetPlane);

    // Directional light for each scene
    const secondaryDirectionalLight = new THREE.DirectionalLight(0xffffff, 5);
    secondaryDirectionalLight.position.set(-10, 10, 10);
    secondaryDirectionalLight.castShadow = true;
    secondaryDirectionalLight.shadow.mapSize.width = 512;
    secondaryDirectionalLight.shadow.mapSize.height = 512;
    const d = 35;
    secondaryDirectionalLight.shadow.camera.left = -d;
    secondaryDirectionalLight.shadow.camera.right = d;
    secondaryDirectionalLight.shadow.camera.top = d;
    secondaryDirectionalLight.shadow.camera.bottom = -d;
    secondaryScenes[i].add(secondaryDirectionalLight);
    secondaryDirectionalLights.push(secondaryDirectionalLight);

    // const ambientLight = new THREE.AmbientLight(0x404040, 1.0); // Soft light
    // secondaryScenes[i].add(ambientLight);

    // Load forest assets (trees, rocks, etc.)
    new GLTFLoader().load(
      "Assets/GameAssets/glb/testround.glb",
      function (gltf) {
        gltf.scene.traverse(function (object) {
          object.receiveShadow = true;
        });
        secondaryScenes[i].add(gltf.scene);
      }
    );
    // Add other objects like trees, rocks, etc...
    // Example:
    new GLTFLoader().load(
      "Assets/GameAssets/glTF/DeadTree_1.gltf",
      function (gltf) {
        gltf.scene.traverse(function (object) {
          object.position.set(i * 5, 0, 5); // Unique position for each scene
          object.castShadow = true;
        });
        secondaryScenes[i].add(gltf.scene);
      }
    );

    targetPlane.tag = tags[i];
    scene.add(targetPlane); // Add the plane to the scene
    targetPlanes.push(targetPlane);
  }

  addSkyboxes(); // Call to add skybox to all secondary scenes
  addObject();

  function addSkyboxes() {
    const paths = [
      "./Assets/GameAssets/imgs/Skybox/sky_02_2k.png",
      "./Assets/GameAssets/imgs/Skybox/sky_34_2k.png",
      "./Assets/GameAssets/imgs/Skybox/sky_35_2k.png",
      "./Assets/GameAssets/imgs/Skybox/sky_36_2k.png",
    ];
    const loader = new THREE.TextureLoader();

    for (let i = 0; i < sceneCount; i++) {
      // Create a large sphere for the skybox
      const spaceTexture = loader.load(paths[i]);

      // Make sure the texture is loaded before creating the sphere
      spaceTexture.minFilter = THREE.LinearFilter; // Important for non-cube textures
      spaceTexture.magFilter = THREE.LinearFilter;
      spaceTexture.anisotropy = 16;

      const geometry = new THREE.SphereGeometry(500, 60, 40); // Large sphere
      const material = new THREE.MeshBasicMaterial({
        map: spaceTexture,
        side: THREE.BackSide, // Make the texture face inside the sphere
      });

      const skybox = new THREE.Mesh(geometry, material);

      // Add the skybox to the respective scene
      secondaryScenes[i].add(skybox);

      // Store the skybox in the global skyboxes array
      skyboxes.push(skybox);
    }
  }

  function addObject() {
    let modelpath = ["Cow", "Bull", "Donkey", "Fox"];

    for (let i = 0; i < sceneCount; i++) {
      new GLTFLoader().load(
        `Assets/GameAssets/models/animals/glTF/${modelpath[i]}.gltf`,
        function (gltf) {
          secondaryScenes[i].add(gltf.scene);
          if (gltf.animations && gltf.animations.length) {
            const mixer = new THREE.AnimationMixer(gltf.scene); // Create an AnimationMixer for the model

            const idleClip = gltf.animations.find(
              (clip) => clip.name === "Eating"
            );

            if (idleClip) {
              const action = mixer.clipAction(idleClip);
              action.setLoop(THREE.LoopRepeat, Infinity);
              action.play();
            }
            // Store the mixer so it can be updated in the render loop
            mixers.push(mixer); // Add to the mixers array
          }
        },
        undefined, // Optionally, provide a progress callback
        function (error) {
          console.error(
            "An error occurred while loading the GLTF model:",
            error
          );
        }
      );
    }
  }
  // const loader = new THREE.TextureLoader();

  // // Load the skybox texture for each scene
  // for (let i = 0; i < sceneCount; i++) {
  //   loader.load(paths[i], function (texture) {
  //     // Apply the equirectangular texture to the scene's background
  //     texture.mapping = THREE.EquirectangularReflectionMapping;
  //     secondaryScenes[i].background = texture;
  //   });
  // }

  // // POSITION THE SECONDARY SCENES IN A HALF CIRCLE AROUND THE CAMERA
  // for (let i = 0; i < sceneCount; i++) {
  //   // Calculate the angle for each scene

  //   // Create a render target plane
  //   const targetPlane = new THREE.Mesh(
  //     new THREE.PlaneGeometry(6, 7, 32),
  //     materials[i]
  //   );
  //   targetPlane.rotation.y = -Math.PI / 4;
  //   const offset = i * 10;
  //   targetPlane.position.set(-5 + offset, 3.5, -5 + offset); // Offset positions for each plane
  //   targetPlane.castShadow = true;
  //   if (scene && typeof scene.add === "function") {
  //     scene.add(targetPlane);
  //   } else {
  //     console.error("Scene is undefined or not initialized properly.");
  //   }
  //   targetPlanes.push(targetPlane);
  // // }
  // scene.add(targetPlane); // Add the plane to the scene
  // targetPlanes.push(targetPlane);

  // TEXT CREATION (Restoring the text logic)
  const textMaterial = new THREE.MeshBasicMaterial({ color: 0x0f0f00 }); // Yellow text color

  function createText(
    tag,
    text,
    size,
    depth,
    hover,
    materials,
    scene,
    mirror = false
  ) {
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
          -2.5 * (textGeo.boundingBox.max.x - textGeo.boundingBox.min.x);

        const textMesh1 = new THREE.Mesh(textGeo, materials);
        textMesh1.position.x = 0;
        textMesh1.position.y = hover;
        textMesh1.position.z = -10; // Position the text in front of everything
        textMesh1.rotation.x = 0;
        textMesh1.name = tag;

        scene.add(textMesh1);

        if (mirror) {
          const textMesh2 = new THREE.Mesh(textGeo, materials);
          textMesh2.position.x = centerOffset;
          textMesh2.position.y = -hover;
          textMesh2.position.z = depth;
          textMesh2.rotation.x = Math.PI;
          textMesh2.rotation.y = Math.PI * 2;
          textMesh2.name = tag;
          scene.add(textMesh2);
        }

        switch (tag) {
          case "Home":
            textMesh1.rotation.y = 0; // Front plane, no rotation
            break;
          case "About":
            textMesh1.rotation.y = -Math.PI; // this text need to flip 180degrees currently
            break;
          case "Projects":
            textMesh1.rotation.y = Math.PI / 2; // Rotate 90 degrees for the left plane
            break;
          case "Contact":
            textMesh1.rotation.y = -Math.PI / 2; // Rotate -90 degrees for the right plane
            break;
        }
      }
    );
  }

  if (sceneCount === 4) {
    createText("Home", "Home", 2, 1, 5, textMaterial, secondaryScenes[0]);
    createText("About", "About", 2, 1, 5, textMaterial, secondaryScenes[1]);
    createText(
      "Projects",
      "Projects",
      2,
      1,
      5,
      textMaterial,
      secondaryScenes[2]
    );
    createText("Contact", "Contact", 2, 1, 5, textMaterial, secondaryScenes[3]);
  }
}
// let objToRender = "eye";
// const loader = new GLTFLoader();

//Load the file
//src="Assets/GameAssets/js/main.js"
// loader.load(
//   `./Assets/GameAssets/${objToRender}/scene.gltf`,
//   function (gltf) {
//     //If the file is loaded, add it to the scene
//     let object = gltf.scene;
//     // Set the position to (0, 1, -5)
//     object.position.set(0, 1, -5);

//     // Reduce the size by 90% (scale to 10% of original size)
//     object.scale.set(0.1, 0.1, 0.1);
//     scene.add(object);
//   },
//   function (xhr) {
//     //While it is loading, log the progress
//     console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
//   },
//   function (error) {
//     //If there is an error, log it
//     console.error(error);
//   }
// );

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

// function createText(tag, text, size, depth, hover, materials, mirror = false) {
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
//       textMesh1.position.x = 25;
//       textMesh1.position.y = hover;
//       textMesh1.position.z = -25;
//       textMesh1.rotation.x = 0;
//       textMesh1.rotation.y = Math.PI * 2;
//       textMesh1.name = tag;
//       scene.add(textMesh1); // Directly add to scene, or group it if necessary

//       if (mirror) {
//         const textMesh2 = new THREE.Mesh(textGeo, materials);
//         textMesh2.position.x = centerOffset;
//         textMesh2.position.y = -hover;
//         textMesh2.position.z = depth;
//         textMesh2.rotation.x = Math.PI;
//         textMesh2.rotation.y = Math.PI * 2;
//         textMesh2.name = tag;
//         scene.add(textMesh2); // Add mirrored text to scene
//       }
//     }
//   );
// }

function addObjects() {
  // Add random spheres to the scene
  for (let i = 0; i < 1; i++) {
    const geometry = new THREE.SphereGeometry(Math.random() * 2 + 1, 32, 32);
    const material = new THREE.MeshLambertMaterial({
      color: Math.random() * 0xffffff,
    });
    const sphere = new THREE.Mesh(geometry, material);
    sphere.position.set(0, 4, -5); // Position in front of the camera
    scene.add(sphere);
  }

  // Add a floor
  const floorGeometry = new THREE.PlaneGeometry(1000, 1000); // Large plane
  const floorMaterial = new THREE.MeshLambertMaterial({
    color: 0x888888,
    side: THREE.DoubleSide,
  });
  const floor = new THREE.Mesh(floorGeometry, floorMaterial);
  floor.rotation.x = -Math.PI / 2; // Rotate the floor to be horizontal
  floor.position.set(0, 0, 0); // Position the floor at y = 0 (ground level)
  scene.add(floor);

  // Add a ramp
  const rampGeometry = new THREE.BoxGeometry(10, 1, 20); // A wide and shallow ramp
  const rampMaterial = new THREE.MeshLambertMaterial({ color: 0x00ff00 });
  const ramp = new THREE.Mesh(rampGeometry, rampMaterial);

  // Rotate the ramp to give it a slope
  ramp.rotation.x = Math.PI / 6; // Adjust the angle of the ramp (slope)
  ramp.position.set(0, 1, -15); // Position the ramp to be in front of the camera

  scene.add(ramp);
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
  let xRep = 1;
  let yRep = 1;
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
    // side: THREE.DoubleSide, // Make sure both sides of the plane are rendered
  });

  // Create the geometry for the ground (plane)
  const geometry = new THREE.PlaneGeometry(100, 100);
  // Create the mesh with the geometry and the complex material
  ground = new THREE.Mesh(geometry);

  // Rotate the ground to be flat
  ground.rotation.x = -Math.PI / 2;
  ground.tag = "ground";

  // Add the ground to the scene
  scene.add(ground);
}

function addLighting() {
  // Directional Light (main sunlight)
  const light = new THREE.DirectionalLight(0xffffff, 0.1);
  light.position.set(5, 5, 5).normalize();
  scene.add(light);
  // Ambient Light (to ensure some minimal lighting)
  // const ambientLight = new THREE.AmbientLight(0x404040, 0.1); // Ambient light with a bit of light everywhere
  // scene.add(ambientLight);
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
    "./Assets/GameAssets/imgs/Skybox/sky_17_2k.png"
  );

  // Create a large sphere for the skybox
  const geometry = new THREE.SphereGeometry(500, 60, 40); // Large sphere
  const material = new THREE.MeshBasicMaterial({
    map: spaceTexture,
    side: THREE.BackSide, // Make the texture face inside the sphere
  });

  skybox = new THREE.Mesh(geometry, material);
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
