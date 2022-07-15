import * as THREE from "./build/three.module.js";
import { OrbitControls } from "./controls/OrbitControls.js";
import GUI from "https://cdn.jsdelivr.net/npm/lil-gui@0.15/+esm";

//UIデバッグ
const gui = new GUI();

//サイズ
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

//シーン
const scene = new THREE.Scene();

//カメラ
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.set(1, 1, 2);

//レンダラー
const renderer = new THREE.WebGLRenderer();
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

/**
 * テクスチャ設定
 */

 const textureLoder = new THREE.TextureLoader();
 const particleTextture = textureLoder.load("textures/particles/9.png");



/**
 * パーティクルを作ってみよう
 */

const particleGeometry = new THREE.BufferGeometry();
const count = 10000;
const positionArray = new Float32Array(count * 3);
const colorArray = new Float32Array(count * 3);

for (let i = 0; i < count * 3; i++) {
  positionArray[i] = (Math.random() - 0.5) * 10;
  colorArray[i] = Math.random();
}
particleGeometry.setAttribute("position",new THREE.BufferAttribute(positionArray,3));

particleGeometry.setAttribute("color",new THREE.BufferAttribute(colorArray,3))


const pointMaterial = new THREE.PointsMaterial({
  size:0.15,
  alphaMap:particleTextture,
  // alphaTest:0.001,
  transparent:true,
  // depthTest:false,
  depthWrite:false,
  vertexColors:true,
  blending:THREE.AdditiveBlending,
  // color:"green"
 // sizeAttenation:true
});

const pointicles = new THREE.Points(particleGeometry,pointMaterial);

scene.add(pointicles);



//マウス操作
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

window.addEventListener("resize", onWindowResize);

const clock = new THREE.Clock();

function animate() {
  const elapsedTime = clock.getElapsedTime();

  controls.update();

  // アニメーション
  for (let i = 0; i < count; i++) {
    const i3 = i*3;
   // particleGeometry.attributes.position.array[i3 + 1] = 0;
   const x = particleGeometry.attributes.position.array[i3 + 0];

   particleGeometry.attributes.position.array[i3 + 1] =  Math.sin(elapsedTime + x) ;

  }

  particleGeometry.attributes.position.needsUpdate = true;

  //レンダリング
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

//ブラウザのリサイズに対応
function onWindowResize() {
  renderer.setSize(sizes.width, sizes.height);
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
}

animate();
