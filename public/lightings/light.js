import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160.1/build/three.module.js";  
import {taille_map} from "../constant.js";

export const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 10, 5);
light.target.position.set(0, 0, 0)
light.castShadow = true;

// Optional: fine-tune shadow quality
light.shadow.mapSize.width = 1024;
light.shadow.mapSize.height = 1024;
light.shadow.camera.near = 0.5;
light.shadow.camera.far = 50;
light.shadow.camera.left = -taille_map;
light.shadow.camera.right = taille_map;
light.shadow.camera.top = taille_map;
light.shadow.camera.bottom = -taille_map;

// Ambient light (soft fill light)
export const ambient = new THREE.AmbientLight(0xffffff, 0.3);
