import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160.1/build/three.module.js";  
import RAPIER from 'https://cdn.skypack.dev/@dimforge/rapier3d-compat';

export function createMurs(scene, world , hauteur) {

    const murs = [
      // murs bas 
      { x: -1, y: 0 , z: 4, w:0.5, d: 4},
      { x: 2, y: 0 , z: 3, w:0.5, d: 3},
      { x: 3.25, y: 0 , z: 1.5, w:3, d: 0.5},
      { x: -7, y: 0 , z: 0.5, w:0.5, d: 2},
      { x: -6.5, y: 0 , z: 1.25, w:1, d: 0.5},

      { x: 5.3, y: 0 , z: 7.25, w:3, d: 0.5},
      { x: 7, y: 0 , z: 6, w:0.5, d: 3},
      { x: -5, y: 0 , z: 4.5, w:0.5, d: 1},
      { x: -5.8, y: 0 , z: 4.21, w:2, d: 0.5},

      // murs haut
      { x: 1, y: 0, z: -4, w: 0.5, d: 4 },
      { x: -2, y: 0, z: -3, w: 0.5, d: 3 },
      { x: -3.25, y: 0, z: -1.5, w: 3, d: 0.5 },
      { x: 7, y: 0, z: -0.5, w: 0.5, d: 2 },
      { x: 6.5, y: 0, z: -1.25, w: 1, d: 0.5 },

      { x: -5.3, y: 0, z: -7.25, w: 3, d: 0.5 },
      { x: -7, y: 0, z: -6, w: 0.5, d: 3 },
      { x: 5, y: 0, z: -4.5, w: 0.5, d: 1 },
      { x: 5.8, y: 0, z: -4.21, w: 2, d: 0.5 },

      { x: 9.8, y: 0, z: 11.21, w: 5, d: 0.5 },
      { x: -9.8, y: 0, z: 11.21, w: 5, d: 0.5 },
      { x: 9.8, y: 0, z: -11.21, w: 5, d: 0.5 },
      { x: -9.8, y: 0, z: -11.21, w: 5, d: 0.5 },

      // New walls
      { x: 2, y: 0, z: -11, w: 5, d: 0.5 },
      { x: 4.3, y: 0, z: -10, w: 0.5, d: 2 },
      { x: -4.3, y: 0, z: -13, w: 0.5, d: 2 },
      { x: -11, y: 0, z: -4, w: 2, d: 3 },
      { x: -7.5, y: 0, z: 10, w: 0.5, d: 3 },

      { x: -2, y: 0, z: 11, w: 5, d: 0.5 },
      { x: -4.3, y: 0, z: 10, w: 0.5, d: 2 },
      { x: 4.3, y: 0, z: 13, w: 0.5, d: 2 },
      { x: 11, y: 0, z: 4, w: 2, d: 3 },
      { x: 7.5, y: 0, z: -10, w: 0.5, d: 3 },


      

      { x: -12.3, y: 5, z: -17.25, w: 5, d: 6 },
      { x: 4.5, y: 12, z: -22, w: 7, d: 4 },
      { x: 18, y: 20, z: 10, w: 6, d: 5 },
      { x: -7, y: 27, z: 4.5, w: 4, d: 7 },
      { x: 10.8, y: 32, z: -11, w: 5, d: 6 },
      { x: -20, y: 38, z: 20, w: 8, d: 4 },
      { x: 0, y: 44, z: -5, w: 6, d: 5 },
      { x: -15.5, y: 50, z: -8, w: 7, d: 4 },
      { x: 23, y: 58, z: 7, w: 4, d: 8 },
      { x: -2.2, y: 64, z: 15, w: 5, d: 6 },
      { x: 13.5, y: 70, z: -14, w: 6, d: 5 },
      { x: -9, y: 76, z: 23.5, w: 7, d: 7 },
      { x: 6, y: 82, z: 0, w: 4, d: 8 },
      { x: -22, y: 89, z: -22, w: 6, d: 6 },
      { x: 11.2, y: 96, z: 18, w: 8, d: 4 },
      { x: -14, y: 103, z: -19, w: 5, d: 6 },
      { x: 2, y: 111, z: 8, w: 7, d: 5 },
      { x: 20, y: 118, z: -6, w: 6, d: 7 },
      { x: -6.8, y: 126, z: 21, w: 5, d: 8 },
      { x: 0, y: 134, z: 0, w: 6, d: 6 },
      { x: 5, y: 142, z: -5, w: 8, d: 4 },
      { x: -18.5, y: 150, z: 19.3, w: 7, d: 5 },
      { x: 6.4, y: 158, z: -9.6, w: 6, d: 6 },
      { x: -11.2, y: 165, z: -15, w: 5, d: 7 },
      { x: 9, y: 172, z: 12.3, w: 4, d: 8 },
      { x: -3, y: 180, z: -23.5, w: 6, d: 5 },
      { x: -24, y: 188, z: 11, w: 5, d: 6 },
      { x: 14, y: 196, z: 22, w: 8, d: 4 },
      { x: -19, y: 203, z: -13, w: 7, d: 5 },
      { x: 21, y: 211, z: 3, w: 4, d: 8 },
      { x: 0.5, y: 218, z: -17, w: 6, d: 6 },
      { x: 7.7, y: 225, z: 13, w: 5, d: 7 },
      { x: -5, y: 233, z: -21, w: 6, d: 6 },
      { x: -16, y: 241, z: 5.5, w: 7, d: 4 },
      { x: 25, y: 249, z: -8.4, w: 5, d: 8 },
      { x: 18.9, y: 257, z: 20, w: 4, d: 6 },
      { x: -10, y: 265, z: -2.5, w: 6, d: 6 },
      { x: 3, y: 273, z: 16, w: 5, d: 7 },
      { x: -7, y: 281, z: -9, w: 4, d: 8 },
      { x: 12, y: 289, z: 14, w: 7, d: 5 },
      { x: -25, y: 296, z: -25, w: 6, d: 6 },
      { x: 8, y: 304, z: 6, w: 5, d: 7 },
      { x: 0, y: 311, z: 0, w: 4, d: 8 },
      { x: -13.2, y: 318, z: 19.8, w: 6, d: 6 },
      { x: 22.6, y: 324, z: -13, w: 5, d: 7 },
      { x: -17, y: 330, z: 4, w: 8, d: 4 },
      { x: 15, y: 335, z: 15, w: 6, d: 6 },
      { x: -8, y: 340, z: -10, w: 7, d: 5 },
      { x: 1.2, y: 345, z: 8, w: 5, d: 7 },
      { x: -6.4, y: 350, z: 18, w: 6, d: 6 },
      { x: -0, y: 345, z: 0, w: 3, d: 3 }



      
    ];
  
    murs.forEach(mur => {
      const geometry = new THREE.BoxGeometry(mur.w, hauteur, mur.d);
      const texture = new THREE.TextureLoader().load( "./textures/brick.png" );
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(5, 10 );
      texture.anisotropy = 16; // Améliore la qualité de la texture
      
      const material = new THREE.MeshStandardMaterial({
          map: texture,

       });
      
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(mur.x, mur.y, mur.z);
      scene.add(mesh);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
  
      const bodyDesc = RAPIER.RigidBodyDesc.fixed().setTranslation(mur.x, mur.y, mur.z);
      const body = world.createRigidBody(bodyDesc);
      const collider = RAPIER.ColliderDesc.cuboid(mur.w / 2, hauteur / 2, mur.d / 2);
      world.createCollider(collider, body);
    });
  }

export let flagMesh = null;

export function createFlag(scene) {


  // Création du drapeau
    const flagGeometry = new THREE.BoxGeometry(0.1, 1, 0.1);
    const flagMaterial = new THREE.MeshStandardMaterial({ color: 0xFF0000 });
    flagMesh = new THREE.Mesh(flagGeometry, flagMaterial);
    flagMesh.position.set(0, 350, 0); // Position initiale du drapeau
    flagMesh.geometry.computeBoundingBox();
    scene.add(flagMesh);
    // Création du sol rouge


    const groundGeometry = new THREE.PlaneGeometry(3, 3); // Taille du sol
    const groundMaterial = new THREE.MeshStandardMaterial({ color: 0xFF0000 });
    const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
    groundMesh.rotation.x = - Math.PI / 2; // Incliner le sol pour qu'il soit horizontal
    groundMesh.position.set(0, 350, 0); // Position du sol
    scene.add(groundMesh);
  }
   
  export function zoneSpawn1(scene) {
    const spawnGeometry = new THREE.PlaneGeometry(2.5,2.5);    
    const spawnMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00 }); //zone verte
    const spawnMeshvert = new THREE.Mesh(spawnGeometry, spawnMaterial);    
    spawnMeshvert.position.set(-12.75, 0.01, -12.75); // Position de la zone de spawn
    spawnMeshvert.rotation.x = - Math.PI / 2; // Incliner la zone de spawn pour qu'elle soit horizontale
    scene.add(spawnMeshvert);

    const box = new THREE.Box3().setFromCenterAndSize(
      spawnMeshvert.position,
      new THREE.Vector3(2.5, 1, 2.5) // width, height (thin), depth
    );

    return box;
  }

  export function zoneSpawn2(scene) {
    const spawnGeometry = new THREE.PlaneGeometry(2.5,2.5);  
    const spawnMaterial = new THREE.MeshStandardMaterial({ color: 0x0000ff }); //zone bleue
    const spawnMeshrouge = new THREE.Mesh(spawnGeometry, spawnMaterial);    
    spawnMeshrouge.position.set(12.75, 0.01, 12.75); // Position de la zone de spawn
    spawnMeshrouge.rotation.x = - Math.PI / 2; // Incliner la zone de spawn pour qu'elle soit horizontale
    scene.add(spawnMeshrouge);

    const box = new THREE.Box3().setFromCenterAndSize(
      spawnMeshrouge.position,
      new THREE.Vector3(2.5, 1, 2.5) // width, height (thin), depth
    );

    return box;
  }
  