import { THREE } from "./main.js"; // Import THREE from main.js
import {
  renderer,
  scene,
  camera,
  secondaryDirectionalLights,
  secondaryScenes,
  renderTargets,
  skyboxes,
  skybox,
  sceneCount,
  targetPlanes,
  directionalLight,
} from "./scene.js"; // Import renderer, scene, and camera from scene.js

import { EffectComposer } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/postprocessing/RenderPass.js";
import { ShaderPass } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/postprocessing/ShaderPass.js";
import { FXAAShader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/shaders/FXAAShader.js"; // For anti-aliasing
import { UnrealBloomPass } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/postprocessing/UnrealBloomPass.js";

let composer;
let renderTarget;

export function animComposerInit() {
  // Initialize the composer

  // Create a smaller render target (half resolution)
  renderTarget = new THREE.WebGLRenderTarget(
    window.innerWidth / 2,
    window.innerHeight / 2
  );
  composer = new EffectComposer(renderer);

  // First pass is the render pass
  const renderPass = new RenderPass(scene, camera);
  composer.addPass(renderPass);

  // Add FXAA (Fast Approximate Anti-Aliasing) pass
  const fxaaPass = new ShaderPass(FXAAShader);
  fxaaPass.uniforms["resolution"].value.set(
    1 / (window.innerWidth / 2), // FXAA applied at half resolution
    1 / (window.innerHeight / 2)
  );
  composer.addPass(fxaaPass);

  // Optionally add Bloom Pass (uncomment if desired)
  const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(window.innerWidth / 2, window.innerHeight / 2), // Half resolution for bloom
    0.15, // Bloom Strength
    0.4, // Bloom Radius
    0.85 // Bloom Threshold
  );
  composer.addPass(bloomPass);
}

export const mixers = []; // Array to store mixers for each animated model

// GAME LOOP
let lastUpdateTime = 0;
const updateInterval = 1;

let lastRenderTargetUpdateTime = 0;
const renderTargetUpdateInterval = 100;

let initialLightOffset = new THREE.Vector3(5, 5, 5);

// Function to check if the target is within the camera's view frustum
function isInViewFrustum(target) {
  const frustum = new THREE.Frustum();
  const cameraViewProjectionMatrix = camera.projectionMatrix
    .clone()
    .multiply(camera.matrixWorldInverse);
  frustum.setFromProjectionMatrix(cameraViewProjectionMatrix);
  return frustum.intersectsObject(target);
}

// Function to check if the render target is facing the camera
function isFacingCamera(target) {
  const targetDirection = new THREE.Vector3();
  target.getWorldDirection(targetDirection);

  const cameraDirection = new THREE.Vector3();
  camera.getWorldDirection(cameraDirection);

  // Use dot product to check if target is facing the camera (cosine of the angle between them)
  let dotProduct = targetDirection.dot(cameraDirection);
  dotProduct = dotProduct * -1;
  // Consider the target to be facing the camera if dot product is greater than a threshold (e.g., 0.5)
  return dotProduct > 0.9;
}

export function animate(clock) {
  const time = new Date().getTime();
  if (time - lastUpdateTime > updateInterval) {
    // Update directional light positions for secondary scenes
    secondaryDirectionalLights.forEach((light, index) => {
      light.position.x = Math.cos(time * 0.0002 + index) * 10;
      light.position.z = Math.sin(time * 0.0002 + index) * 10;
    });
    lastUpdateTime = time;
  }

  // Rotate skyboxes continuously
  const rotationSpeed = 0.0001; // Adjust this value for faster/slower rotation
  skyboxes.forEach((item) => {
    item.rotation.y += rotationSpeed; // Rotate around Y axis continuously
  });
  skybox.rotation.y += rotationSpeed; //

  if (time - lastRenderTargetUpdateTime > renderTargetUpdateInterval) {
    for (let i = 0; i < sceneCount; i++) {
      if (isFacingCamera(targetPlanes[i]) && isInViewFrustum(targetPlanes[i])) {
        targetPlanes[i].scale.set(1, 1, 1);
        renderer.setRenderTarget(renderTargets[i]);
        renderer.render(secondaryScenes[i], camera);

        mixers.forEach((mixer) => {
          mixer.update(clock.getDelta()); // Update each mixer with the delta time
        });
      }
    }
    lastRenderTargetUpdateTime = time;
  }

  const lightOffset = new THREE.Vector3().copy(initialLightOffset);
  lightOffset.applyMatrix4(camera.matrixWorld); // Move the light with the camera
  directionalLight.position.copy(lightOffset);

  renderer.setRenderTarget(null);
  if (composer) {
    renderer.render(scene, camera);
    // composer.render();
  } else {
  }
}
