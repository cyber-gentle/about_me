/* =============================================
   Three.js — 3D Hero Scene (ES Module)
   ============================================= */
   import * as THREE from 'three';

   const container = document.getElementById('hero-canvas');
   if (!container) throw new Error('Hero canvas container not found');
   
   /* ---------- Scene Setup ---------- */
   const scene = new THREE.Scene();
   scene.fog = new THREE.FogExp2(0x050505, 0.06);
   
   const camera = new THREE.PerspectiveCamera(
     60,
     container.clientWidth / container.clientHeight,
     0.1,
     100
   );
   camera.position.set(0, 0, 8);
   
   const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
   renderer.setSize(container.clientWidth, container.clientHeight);
   renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
   renderer.toneMapping = THREE.ACESFilmicToneMapping;
   renderer.toneMappingExposure = 1.2;
   container.appendChild(renderer.domElement);
   
   /* ---------- Lights ---------- */
   const blueLight = new THREE.PointLight(0x4F8BFF, 3, 25);
   blueLight.position.set(4, 3, 4);
   
   const purpleLight = new THREE.PointLight(0x8A5CFF, 3, 25);
   purpleLight.position.set(-4, -2, 3);
   
   const cyanLight = new THREE.PointLight(0x7FE7FF, 1.5, 20);
   cyanLight.position.set(0, 4, -2);
   
   scene.add(blueLight, purpleLight, cyanLight);
   scene.add(new THREE.AmbientLight(0x111122, 0.4));
   
   /* ---------- Materials ---------- */
   const eps = 0.001;
   
   function glassMat(color, opacity = 0.1) {
     return new THREE.MeshPhysicalMaterial({
       color,
       metalness: 0.0,
       roughness: 0.15,
       transparent: true,
       opacity,
       side: THREE.DoubleSide,
       depthWrite: false,
     });
   }
   
   function wireMat(color, opacity = 0.2) {
     return new THREE.LineBasicMaterial({
       color,
       transparent: true,
       opacity,
     });
   }
   
   /* ---------- Shape Factory ---------- */
   const shapes = [];
   
   function addShape(geom, mat, pos, rotSpeed, floatAmp, floatSpeed) {
     const mesh = new THREE.Mesh(geom, mat);
     mesh.position.set(pos[0], pos[1], pos[2]);
   
     /* Edge wireframe overlay */
     const edges = new THREE.EdgesGeometry(geom);
     const color = mat.color ? mat.color.getHex() : 0x4F8BFF;
     const line = new THREE.LineSegments(edges, wireMat(color, 0.2));
     mesh.add(line);
   
     scene.add(mesh);
   
     shapes.push({
       mesh,
       rotSpeed,
       floatAmp,
       floatSpeed,
       baseY: pos[1],
       phase: Math.random() * Math.PI * 2,
     });
   }
   
   /* ---------- Create Geometries ---------- */
   
   /* Large icosahedron — center-right */
   addShape(
     new THREE.IcosahedronGeometry(Math.max(eps, 1.6), 1),
     glassMat(0x4F8BFF, 0.08),
     [2.5, 0.5, -1],
     { x: 0.003, y: 0.005, z: 0.002 },
     0.3, 0.8
   );
   
   /* Octahedron — left */
   addShape(
     new THREE.OctahedronGeometry(Math.max(eps, 1.0), 0),
     glassMat(0x8A5CFF, 0.1),
     [-3, 1.2, -0.5],
     { x: 0.004, y: 0.003, z: 0.005 },
     0.25, 1.0
   );
   
   /* Torus — bottom-left */
   addShape(
     new THREE.TorusGeometry(Math.max(eps, 0.8), Math.max(eps, 0.25), 16, 40),
     glassMat(0x7FE7FF, 0.07),
     [-1.5, -2, 0.5],
     { x: 0.006, y: 0.004, z: 0.002 },
     0.2, 1.2
   );
   
   /* Small scattered cubes */
   for (let i = 0; i < 4; i++) {
     const s = 0.3 + Math.random() * 0.4;
     addShape(
       new THREE.BoxGeometry(Math.max(eps, s), Math.max(eps, s), Math.max(eps, s)),
       glassMat(i % 2 === 0 ? 0x4F8BFF : 0x8A5CFF, 0.12),
       [
         (Math.random() - 0.5) * 8,
         (Math.random() - 0.5) * 5,
         (Math.random() - 0.5) * 4 - 1,
       ],
       {
         x: 0.008 + Math.random() * 0.005,
         y: 0.006 + Math.random() * 0.005,
         z: 0.004,
       },
       0.15 + Math.random() * 0.2,
       0.6 + Math.random() * 0.8
     );
   }
   
   /* Dodecahedron — right */
   addShape(
     new THREE.DodecahedronGeometry(Math.max(eps, 0.7), 0),
     glassMat(0x4F8BFF, 0.09),
     [3.5, -1.5, -2],
     { x: 0.005, y: 0.007, z: 0.003 },
     0.2, 0.9
   );
   
   /* Tetrahedron — far left */
   addShape(
     new THREE.TetrahedronGeometry(Math.max(eps, 0.6), 0),
     glassMat(0x8A5CFF, 0.11),
     [-4, -1, -1.5],
     { x: 0.006, y: 0.004, z: 0.008 },
     0.25, 1.1
   );
   
   /* ---------- Particles ---------- */
   const particleCount = 500;
   const pGeo = new THREE.BufferGeometry();
   const pPos = new Float32Array(particleCount * 3);
   const pColors = new Float32Array(particleCount * 3);
   
   const c1 = new THREE.Color(0x4F8BFF);
   const c2 = new THREE.Color(0x8A5CFF);
   const c3 = new THREE.Color(0x7FE7FF);
   const colorChoices = [c1, c2, c3];
   
   for (let i = 0; i < particleCount; i++) {
     pPos[i * 3]     = (Math.random() - 0.5) * 20;
     pPos[i * 3 + 1] = (Math.random() - 0.5) * 14;
     pPos[i * 3 + 2] = (Math.random() - 0.5) * 12 - 2;
   
     const c = colorChoices[Math.floor(Math.random() * 3)];
     pColors[i * 3]     = c.r;
     pColors[i * 3 + 1] = c.g;
     pColors[i * 3 + 2] = c.b;
   }
   
   pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
   pGeo.setAttribute('color', new THREE.BufferAttribute(pColors, 3));
   
   /* Soft circle particle texture */
   const pCanvas = document.createElement('canvas');
   pCanvas.width = 32;
   pCanvas.height = 32;
   const pCtx = pCanvas.getContext('2d');
   const grad = pCtx.createRadialGradient(16, 16, 0, 16, 16, 16);
   grad.addColorStop(0, 'rgba(255,255,255,1)');
   grad.addColorStop(0.3, 'rgba(255,255,255,0.6)');
   grad.addColorStop(1, 'rgba(255,255,255,0)');
   pCtx.fillStyle = grad;
   pCtx.fillRect(0, 0, 32, 32);
   const pTex = new THREE.CanvasTexture(pCanvas);
   
   const pMat = new THREE.PointsMaterial({
     size: 0.06,
     map: pTex,
     transparent: true,
     opacity: 0.7,
     vertexColors: true,
     blending: THREE.AdditiveBlending,
     depthWrite: false,
     sizeAttenuation: true,
   });
   
   const particles = new THREE.Points(pGeo, pMat);
   scene.add(particles);
   
   /* ---------- Network Lines ---------- */
   const lineGeo = new THREE.BufferGeometry();
   const linePositions = [];
   
   for (let i = 0; i < 40; i++) {
     const idx1 = Math.floor(Math.random() * particleCount);
     const idx2 = Math.floor(Math.random() * particleCount);
     const dx = pPos[idx1 * 3]     - pPos[idx2 * 3];
     const dy = pPos[idx1 * 3 + 1] - pPos[idx2 * 3 + 1];
     const dz = pPos[idx1 * 3 + 2] - pPos[idx2 * 3 + 2];
     if (Math.sqrt(dx * dx + dy * dy + dz * dz) < 4) {
       linePositions.push(
         pPos[idx1 * 3], pPos[idx1 * 3 + 1], pPos[idx1 * 3 + 2],
         pPos[idx2 * 3], pPos[idx2 * 3 + 1], pPos[idx2 * 3 + 2]
       );
     }
   }
   
   lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
   const lineMat = new THREE.LineBasicMaterial({
     color: 0x4F8BFF, transparent: true, opacity: 0.06,
   });
   scene.add(new THREE.LineSegments(lineGeo, lineMat));
   
   /* ---------- Mouse Tracking ---------- */
   let mouseX = 0, mouseY = 0;
   let targetX = 0, targetY = 0;
   
   document.addEventListener('mousemove', (e) => {
     mouseX = (e.clientX / window.innerWidth  - 0.5) * 2;
     mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
   });
   
   /* ---------- Render Loop ---------- */
   const clock = new THREE.Clock();
   
   function animate() {
     requestAnimationFrame(animate);
     const t = clock.getElapsedTime();
   
     /* Smooth camera parallax */
     targetX += (mouseX * 0.6 - targetX) * 0.04;
     targetY += (-mouseY * 0.4 - targetY) * 0.04;
     camera.position.x = targetX;
     camera.position.y = targetY;
     camera.lookAt(0, 0, 0);
   
     /* Rotate & float shapes */
     for (const s of shapes) {
       s.mesh.rotation.x += s.rotSpeed.x;
       s.mesh.rotation.y += s.rotSpeed.y;
       s.mesh.rotation.z += s.rotSpeed.z;
       s.mesh.position.y = s.baseY + Math.sin(t * s.floatSpeed + s.phase) * s.floatAmp;
     }
   
     /* Slowly rotate particle field */
     particles.rotation.y = t * 0.02;
     particles.rotation.x = Math.sin(t * 0.01) * 0.1;
   
     /* Orbit lights */
     blueLight.position.x   =  4 + Math.sin(t * 0.5) * 2;
     blueLight.position.y   =  3 + Math.cos(t * 0.3) * 1.5;
     purpleLight.position.x = -4 + Math.cos(t * 0.4) * 2;
     purpleLight.position.y = -2 + Math.sin(t * 0.6) * 1.5;
   
     renderer.render(scene, camera);
   }
   
   animate();
   
   /* ---------- Resize Handler ---------- */
   window.addEventListener('resize', () => {
     const w = container.clientWidth;
     const h = container.clientHeight;
     camera.aspect = w / h;
     camera.updateProjectionMatrix();
     renderer.setSize(w, h);
   });