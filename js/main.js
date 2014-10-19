/**
 * Constants
 */
var STARS_PER_FRAME = 5;
var FIELD_OF_VIEW = 1500;
var ZOOM_SPEED = 7;

/**
 * Setting variables
 */
var maxVolume = 0.5;
var oldMaxVolume;
var paused = false;

/**
 * Scene variables
 */
var sound = new Sound();
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, FIELD_OF_VIEW);

var stars = [];
var planets = [];

var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

var geometry = new THREE.SphereGeometry(2, 12, 12);
camera.position.z = 5;

function render() {
	stats.begin();

	requestAnimationFrame(render);
	renderer.render(scene, camera);

	// zoom out camera
	if (!paused)
		camera.position.z -= ZOOM_SPEED;

	// remove far away objects from scene
	// http://stackoverflow.com/a/16613141/1222411
	var frustum = new THREE.Frustum();
	frustum.setFromMatrix(new THREE.Matrix4().multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse));
	scene.children.forEach(function(object) {
		var visible = frustum.intersectsObject(object);
		if (!visible){
			scene.remove(object);
			var index = stars.indexOf(object);
			if(index > -1)
				stars.splice(index, 1);
				
			index = planets.indexOf(object);
			if(index > -1)
				planets.splice(index, 1);
		}
	});

	// add stars to scene
	if (!paused) {
		
		for (var i = 0; i < STARS_PER_FRAME; i++) {
			var material = new THREE.MeshBasicMaterial({
				color: 0xffffff
			});
			var circle = new THREE.Mesh(geometry, material);
			circle.position.set(Math.floor(3 * Math.random() * window.innerWidth) - window.innerWidth * 1.5, Math.floor(3 * Math.random() * window.innerHeight) - window.innerHeight * 1.5, camera.position.z - FIELD_OF_VIEW);
			circle.material.color.setRGB(1, 1, 1);
			scene.add(circle);
			stars.push(circle);
		}
		console.log(stars.length);
		console.log(planets.length);
	}

	stats.end();
}

/**
 * Stats
 */
var stats = new Stats();
stats.setMode(0);
stats.domElement.style.position = 'absolute';
stats.domElement.style.left = '0px';
stats.domElement.style.top = '0px';
stats.domElement.style.display = 'none';
document.body.appendChild(stats.domElement);

document.onkeypress = function onKeyPress(e) {
	e = e || window.event;
	console.log(e.keyCode);
	if (e.keyCode == 100) { // d
		if (stats.domElement.style.display === 'none') {
			stats.domElement.style.display = 'block';
		} else {
			stats.domElement.style.display = 'none';
		}
	} else if (e.keyCode == 109) { // m
		if (maxVolume == 0)
			maxVolume = oldMaxVolume;
		else {
			oldMaxVolume = maxVolume;
			maxVolume = 0;
		}
	} else if (e.keyCode == 112) { // p
		paused = !paused;
	}
}

document.onclick = function onClick(e) {
	e = e || window.event;
	console.log(e);
	var material = new THREE.MeshBasicMaterial({
		color: 0xffffff
	});
	var geometry = new THREE.SphereGeometry(24, 12, 12);
	var circle = new THREE.Mesh(geometry, material);
	circle.position.set(e.x - (window.innerWidth / 2), (window.innerHeight / 2) - e.y, camera.position.z - FIELD_OF_VIEW);
	sound.playNote(maxVolume / 5);
	circle.material.color.setRGB(Math.random(), Math.random(), Math.random());
	scene.add(circle);
	planets.push(circle);
}

render();
