import "./index.css";

import * as BABYLON from "babylonjs";
import { room } from "./game/network";

window.addEventListener('DOMContentLoaded', function(){
    // Listen to patches comming
room.onStateChange.add(function(patches) {
    console.log("Server state changed: ", patches);
});

const canvas = document.getElementById('game') as HTMLCanvasElement;
const engine = new BABYLON.Engine(canvas, true);

// This creates a basic Babylon Scene object (non-mesh)
var scene = new BABYLON.Scene(engine);
var gravityVector = new BABYLON.Vector3(0,-9.81, 0);
var physicsPlugin = new BABYLON.CannonJSPlugin();
scene.enablePhysics(gravityVector, physicsPlugin);

// This creates a light, aiming 0,1,0 - to the sky (non-mesh)
var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);

// Default intensity is 1. Let's dim the light a small amount
light.intensity = 0.7;

// Our built-in 'sphere' shape. Params: name, subdivs, size, scene
var sphere = BABYLON.Mesh.CreateSphere("sphere1", 16, 2, scene);

// Move the sphere upward 1/2 its height
sphere.position.y = 1;

// Our built-in 'ground' shape. Params: name, width, depth, subdivs, scene
var ground = BABYLON.Mesh.CreateGround("ground1", 6, 6, 2, scene);

// This creates and positions a free camera (non-mesh)
// var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 5, -10), scene);

// This camera always faces the player but does not move with them
var camera = new BABYLON.ArcRotateCamera("camera1", BABYLON.Tools.ToRadians(45), BABYLON.Tools.ToRadians(45), 10.0, sphere.position, scene);

// This camera faces and follows the player
//var camera = new BABYLON.FollowCamera("camera1", BABYLON.Vector3.Zero(), scene);


// This targets the camera to scene origin
camera.setTarget(sphere);

// This attaches the camera to the canvas
camera.attachControl(canvas, true);

// Keyboard controls to the camera
camera.keysUp.push(87)  //w
camera.keysDown.push(83)  //s
camera.keysLeft.push(65)  //a
camera.keysRight.push(68)  //d

// Attach default camera mouse navigation
camera.attachControl(canvas);

BABYLON.SceneLoader.ImportMesh("","","models/baseBody.babylon",
scene,function(newMeshes) {
    newMeshes.forEach(function(mesh){});
});

// Scene render loop
engine.runRenderLoop(function() {
    scene.getMeshByName("sphere1").position.z -= 0.01;
    scene.render();
});

// Resize the engine on window resize
window.addEventListener('resize', function() {
    engine.resize();
});

});
