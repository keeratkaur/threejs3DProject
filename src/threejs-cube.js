import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// Initializing the Renderer and setting to correct size
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

// Initialize Scene Creation
const scene = new THREE.Scene();

// Add pointer position handling
const pointer = new THREE.Vector2(-1, -1); // Set initial normalized position to (-1, -1)

// Function to update pointer position
function onPointerMove(event) {
    // Calculate pointer position in normalized device coordinates
    pointer.x = -1;
    pointer.y = -1;
}

// Add event listener for pointer movement
window.addEventListener('pointermove', onPointerMove);

// Load skybox texture with error handling
const textureLoader = new THREE.TextureLoader();
textureLoader.load(
  '/skybox/stars_skybox.jpg',
  (texture) => {
    scene.background = texture;
    console.log('Skybox texture loaded successfully');
  },
  undefined,
  (error) => {
    console.error('Error loading skybox texture:', error);
  }
);

// Load sun texture
const sunTexture = textureLoader.load('/textures/sun_diffuse.jpg');

// Load mercury texture
const mercuryTexture = textureLoader.load('/textures/mercury_diffuse.jpg');

// Load earth texture
const earthTexture = textureLoader.load('/textures/earth_diffuse.jpg');

// Initialize Camera and set position
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
// Position camera further back to see the whole scene
camera.position.set(0, 100, 150);
camera.lookAt(0, 0, 0);

// Add OrbitControls with enhanced settings
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.minDistance = 50; // Minimum zoom distance
controls.maxDistance = 300; // Maximum zoom distance
controls.maxPolarAngle = Math.PI; // Allow viewing from below
controls.enablePan = true; // Enable panning
controls.screenSpacePanning = true; // Pan parallel to screen
controls.rotateSpeed = 0.5; // Adjust rotation speed
controls.zoomSpeed = 1.2; // Adjust zoom speed

// Update camera aspect ratio and renderer on resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Create first sphere (larger)
const sphere1Geo = new THREE.SphereGeometry(15, 32, 32);
const sphere1Mat = new THREE.MeshBasicMaterial({ 
  map: sunTexture,
  color: 0xffffff 
});
const sphere1 = new THREE.Mesh(sphere1Geo, sphere1Mat);
sphere1.castShadow = true;
sphere1.receiveShadow = true;
scene.add(sphere1);

// Add point light to the sun with shadow
const sunLight = new THREE.PointLight(0xffffff, 1, 100);
sunLight.position.copy(sphere1.position);
sunLight.castShadow = true;
sunLight.shadow.mapSize.width = 1024;
sunLight.shadow.mapSize.height = 1024;
sunLight.shadow.camera.near = 0.5;
sunLight.shadow.camera.far = 500;
scene.add(sunLight);

// Create orbital paths
function createOrbitPath(radius) {
  const orbitGeometry = new THREE.BufferGeometry();
  const orbitMaterial = new THREE.LineBasicMaterial({ color: 0x444444 });
  const points = [];
  const segments = 64;
  
  for (let i = 0; i <= segments; i++) {
    const theta = (i / segments) * Math.PI * 2;
    points.push(new THREE.Vector3(
      Math.cos(theta) * radius,
      0,
      Math.sin(theta) * radius
    ));
  }
  
  orbitGeometry.setFromPoints(points);
  return new THREE.Line(orbitGeometry, orbitMaterial);
}

// Create and add orbit paths
const orbitPath1 = createOrbitPath(50);
const orbitPath2 = createOrbitPath(30);
const orbitPath3 = createOrbitPath(10); // New orbit path for moon
scene.add(orbitPath1);
scene.add(orbitPath2);
scene.add(orbitPath3);

// Create second sphere (medium)
const sphere2Geo = new THREE.SphereGeometry(8, 32, 32);
const sphere2Mat = new THREE.MeshBasicMaterial({ 
  map: earthTexture,
  color: 0xffffff 
});
const sphere2 = new THREE.Mesh(sphere2Geo, sphere2Mat);
sphere2.castShadow = true;
sphere2.receiveShadow = true;
scene.add(sphere2);

// Create orbit path around sphere2
const sphere2LocalOrbit = createOrbitPath(15); // Orbit path that follows sphere2
sphere2.add(sphere2LocalOrbit); // Add to sphere2 so it follows its movement

// Create third sphere (smallest)
const sphere3Geo = new THREE.SphereGeometry(5, 32, 32);
const sphere3Mat = new THREE.MeshBasicMaterial({ 
  map: mercuryTexture,
  color: 0xffffff 
});
const sphere3 = new THREE.Mesh(sphere3Geo, sphere3Mat);
sphere3.castShadow = true;
sphere3.receiveShadow = true;
scene.add(sphere3);

// Create orbit path for sphere3
const sphere3OrbitPath = createOrbitPath(30);
scene.add(sphere3OrbitPath);

// Create fourth sphere (moon)
const sphere4Geo = new THREE.SphereGeometry(2, 32, 32);
const sphere4Mat = new THREE.MeshBasicMaterial({ 
  color: 0xaaaaaa 
});
const sphere4 = new THREE.Mesh(sphere4Geo, sphere4Mat);
sphere4.castShadow = true;
sphere4.receiveShadow = true;
scene.add(sphere4);

// Variables for orbital motion
let angle = 0;
let angle2 = 0;
let angle3 = 0;
let localAngle = 0; // New angle for local orbit
const orbitRadius = 50;
const orbitRadius2 = 30;
const orbitRadius3 = 10;
const localOrbitRadius = 15; // Radius for orbit around sphere2
const orbitSpeed = 0.02;
const orbitSpeed2 = 0.03;
const orbitSpeed3 = 0.05;
const localOrbitSpeed = 0.04; // Speed for local orbit

// Code For the Animation Loop
function animate() {
  renderer.render(scene, camera);
  controls.update();
  
  // Rotate the large sphere
  sphere1.rotation.x += 0.01;
  sphere1.rotation.y += 0.01;
  
  // Update point light position to match sun
  sunLight.position.copy(sphere1.position);
  
  // Calculate orbital position for sphere2
  angle += orbitSpeed;
  sphere2.position.x = Math.cos(angle) * orbitRadius;
  sphere2.position.z = Math.sin(angle) * orbitRadius;
  
  // Rotate the orbit path around sphere2
  localAngle += localOrbitSpeed;
  sphere2LocalOrbit.rotation.y = localAngle;
  
  // Rotate the small sphere
  sphere2.rotation.x += 0.02;
  sphere2.rotation.y += 0.02;

  // Calculate orbital position for sphere3
  angle2 += orbitSpeed2;
  sphere3.position.x = Math.cos(angle2) * orbitRadius2;
  sphere3.position.z = Math.sin(angle2) * orbitRadius2;
  
  // Rotate the third sphere
  sphere3.rotation.x += 0.03;
  sphere3.rotation.y += 0.03;

  // Calculate orbital position for moon (sphere4) around sphere3
  angle3 += orbitSpeed3;
  sphere4.position.x = sphere3.position.x + Math.cos(angle3) * orbitRadius3;
  sphere4.position.y = sphere3.position.y;
  sphere4.position.z = sphere3.position.z + Math.sin(angle3) * orbitRadius3;
  
  // Rotate the moon
  sphere4.rotation.x += 0.04;
  sphere4.rotation.y += 0.04;
}
renderer.setAnimationLoop(animate); 