import * as THREE from "https://esm.sh/three@0.160";
import RAPIER from 'https://cdn.skypack.dev/@dimforge/rapier3d-compat';
import { createMurs , createFlag ,zoneSpawn1 , zoneSpawn2} from './map/map.js';
import { speed , taille_map , local , server, pesanteur } from "./constant.js";
import { updateCamera , myCamera } from "./camera/camera.js"
import { light , ambient } from "./lightings/light.js";

const socket = io(local); // à changer en server pour héberger le jeu

let myPlayer = null;
let myCube = null;
let myBody = null;

let jumpStatus = {
  isJumping: false,
  startTime: 0,
  duration: 650, 
  maxHeight: 2,
  baseY: 0,
};

let world;
await RAPIER.init();
const gravity = { x: 0, y: pesanteur, z: 0 };
world = new RAPIER.World(gravity);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb); // bleu ciel

// Rendu
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

// Corps des joueurs
const playerBodies = {
  player1: null,
  player2: null,
};

const player1Desc = RAPIER.RigidBodyDesc.dynamic().setTranslation(0, 5, 0);
playerBodies.player1 = world.createRigidBody(player1Desc);
world.createCollider(RAPIER.ColliderDesc.cuboid(0.25, 0.5, 0.25), playerBodies.player1);

const player2Desc = RAPIER.RigidBodyDesc.dynamic().setTranslation(1, 5, 0);  
playerBodies.player2 = world.createRigidBody(player2Desc);  
world.createCollider(RAPIER.ColliderDesc.cuboid(0.25, 0.5, 0.25), playerBodies.player2)

world.step();

// Cubes joueurs
const geometry = new THREE.BoxGeometry(0.5 , 1, 0.5);

const materialGreen = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
const materialRed = new THREE.MeshStandardMaterial({ color: 0xff0000 });

const greenCube = new THREE.Mesh(geometry, materialGreen);
const redCube = new THREE.Mesh(geometry, materialRed);

// Sol visuel
const groundGeometry = new THREE.BoxGeometry(taille_map*2, 0.2, taille_map*2); 
const groundMaterial = new THREE.MeshStandardMaterial({ color: 0x222222 });
const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
groundMesh.position.set(0, -0.1, 0); 

// Création des murs et zones
createMurs(scene, world);
createFlag(scene, world);
zoneSpawn1(scene, world);
zoneSpawn2(scene, world);

// Sol physique
const groundDesc = RAPIER.RigidBodyDesc.fixed().setTranslation(0, 0, 0);
const groundBody = world.createRigidBody(groundDesc);
const groundCollider = RAPIER.ColliderDesc.cuboid(taille_map, 0.1, taille_map);
world.createCollider(groundCollider, groundBody);

// Ajout à la scène
scene.add(greenCube, redCube, groundMesh, light, ambient, light.target);

// Ombres
greenCube.castShadow = true;
redCube.castShadow = true;
groundMesh.receiveShadow = true;

// Attribution joueur
socket.on("player-assigned", (player) => {
  myPlayer = player;
  myCube = myPlayer === "player1" ? greenCube : redCube;
  myBody = playerBodies[myPlayer];
});

greenCube.position.set(0, 0.44, 0);
redCube.position.set(1, 0.44, 0);

// MàJ des positions
socket.on("update-positions", (positions) => {
  const otherPlayer = myPlayer === 'player1' ? 'player2' : 'player1';

  if (positions.Player1Position && playerBodies.player1 && myPlayer !== 'player1') {
    playerBodies.player1.setTranslation(positions.Player1Position, true);
  }
  if (positions.Player2Position && playerBodies.player2 && myPlayer !== 'player2') {
    playerBodies.player2.setTranslation(positions.Player2Position, true);
  }

  greenCube.position.set(
    playerBodies.player1.translation().x,
    playerBodies.player1.translation().y,
    playerBodies.player1.translation().z
  );
  redCube.position.set(
    playerBodies.player2.translation().x,
    playerBodies.player2.translation().y,
    playerBodies.player2.translation().z
  );
});

// Envoi de ma position au serveur
function sendMyPosition() {
  if (!myPlayer || !myBody) return;
  const pos = myBody.translation();
  socket.emit("move-cube", {
    x: pos.x,
    y: pos.y,
    z: pos.z,
  });
}

// Clavier
const keys = {
  KeyW: false,
  KeyS: false,
  KeyA: false,
  KeyD: false,
  Space: false,
  ShiftLeft: false,
};

document.addEventListener("keydown", (e) => {
  if (e.code in keys) keys[e.code] = true;
});

document.addEventListener("keyup", (e) => {
  if (e.code in keys) keys[e.code] = false;
});

// Gestion du saut fluide
function startJump() {
  if (!jumpStatus.isJumping && myBody) {
    const vel = myBody.linvel();
    if (Math.abs(vel.y) < 0.01) {
      jumpStatus.isJumping = true;
      jumpStatus.startTime = performance.now();
      jumpStatus.baseY = myBody.translation().y;
    }
  }
}

function updateJump(currentTime) {
  if (!jumpStatus.isJumping || !myBody) return;

  const elapsed = currentTime - jumpStatus.startTime;
  const t = elapsed / jumpStatus.duration;

  if (t >= 1) {
    jumpStatus.isJumping = false;
    return;
  }

  const x = 2 * t - 1;
  const y = -x * x + 1;

  const targetY = jumpStatus.baseY + jumpStatus.maxHeight * y;
  const currentY = myBody.translation().y;
  const deltaY = targetY - currentY;

  myBody.setLinvel({ x: myBody.linvel().x, y: deltaY * 20, z: myBody.linvel().z }, true);
}

// Boucle principale
function animate(currentTime) {
  requestAnimationFrame(animate);

  const movement = { x: 0, y: 0, z: 0 };
  if (keys.KeyW) movement.z -= speed;
  if (keys.KeyS) movement.z += speed;
  if (keys.KeyA) movement.x -= speed;
  if (keys.KeyD) movement.x += speed;

  if (myBody) myBody.setLinvel({ x: movement.x, y: myBody.linvel().y, z: movement.z }, true);

  if (keys.Space) startJump();

  updateJump(currentTime);
  world.step();

  greenCube.position.copy(playerBodies.player1.translation());
  redCube.position.copy(playerBodies.player2.translation());

  sendMyPosition();
  updateCamera(myCube);
  renderer.render(scene, myCamera);
}

animate();
