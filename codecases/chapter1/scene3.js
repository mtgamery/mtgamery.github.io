
$("#blackscreenStart").click(function(){
	//var rain = rainSound.play();
	//rainSound.fade(0.9, 1, 57000, rain);
	$(this).fadeOut(3000, function(){
		window.addEventListener( 'mousemove', onMouseMove, false );
	});
});

const sceneWidth = 852;
const sceneHeight = 480;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(50, sceneWidth / sceneHeight, 0.1, 10000);

const renderer = new THREE.WebGLRenderer();
//renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setSize(sceneWidth, sceneHeight);
renderer.antialias = true;
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

const spotLight = new THREE.SpotLight( 0xffffff );
spotLight.position.set( 0, 900, 0);
spotLight.target.position.set( 0, 0, 0 );
spotLight.penumbra = 0.9;
spotLight.intensity = 2.5;
spotLight.angle = Math.PI / 4;

spotLight.shadow.camera.fov = 50;
spotLight.shadow.camera.near = 0.1;
spotLight.shadow.camera.far = 10000;

spotLight.castShadow = true;

scene.add( spotLight );
scene.add( spotLight.target );

//const helper = new THREE.CameraHelper( camera );
//scene.add( helper );

//const shadowHelper = new THREE.CameraHelper( spotLight.shadow.camera );
//scene.add( shadowHelper );

const controls = new THREE.OrbitControls(camera, renderer.domElement);
const cameraDistance = 300;

controls.enableKeys = true;
controls.enableZoom = false;
controls.enablePan = false;
controls.minPolarAngle = Math.PI/2;
controls.maxPolarAngle = Math.PI/2;
controls.rotateSpeed = 0.5;
controls.enableDamping = true;
camera.position.set(0, 0, cameraDistance);
camera.lookAt(0, 0, 0);
camera.updateProjectionMatrix();
controls.update();

//window.addEventListener("resize", onWindowResize, false);
//onWindowResize();

/* Textures */
const floorTexture = new THREE.TextureLoader().load( "images/Woodfloor.jpg" );
const floorMaterial = new THREE.MeshPhongMaterial( { map: floorTexture, side: THREE.DoubleSide } );

const wallTexture = new THREE.TextureLoader().load( "images/Wallpaper.jpg" );
wallTexture.wrapS = THREE.RepeatWrapping;
wallTexture.wrapT = THREE.RepeatWrapping;
wallTexture.repeat.set( 3, 3 );
const wallMaterial = new THREE.MeshPhongMaterial( { map: wallTexture, side: THREE.DoubleSide } );

const doorTexture = new THREE.TextureLoader().load( "images/Door.jpg" );
const doorMaterial = new THREE.MeshPhongMaterial( { map: doorTexture, side: THREE.DoubleSide });

/* Geometry */
const eyeLevel = -200;

var floorGeometry = new THREE.BoxGeometry( 1020, 1020, 20 );
var floor = new THREE.Mesh( floorGeometry, floorMaterial );
floor.rotation.x = -(Math.PI / 2);
floor.position.y = eyeLevel;
floor.receiveShadow = true;
scene.add(floor);


var backwallGeometry = new THREE.BoxGeometry( 1000, 1000, 20 );
var backwall = new THREE.Mesh( backwallGeometry, wallMaterial );
backwall.position.y = 500 - (-1 * eyeLevel);
backwall.position.z = -500;
scene.add(backwall);

var leftwallGeometry = new THREE.BoxGeometry( 1000, 1000, 20 );
var leftwall = new THREE.Mesh( leftwallGeometry, wallMaterial );
leftwall.rotation.y = -(Math.PI / 2);
leftwall.position.y = 500 - (-1 * eyeLevel);
leftwall.position.x = -500;
scene.add(leftwall);

var rightwallGeometry = new THREE.BoxGeometry( 1000, 1000, 20 );
var rightwall = new THREE.Mesh( rightwallGeometry, wallMaterial );
rightwall.rotation.y = (Math.PI / 2);
rightwall.position.y = 500 - (-1 * eyeLevel);
rightwall.position.x = 500;
scene.add(rightwall);

var frontwallGeometry = new THREE.BoxGeometry( 1000, 1000, 20 );
var frontwall = new THREE.Mesh( frontwallGeometry, wallMaterial );
frontwall.position.y = 500 - (-1 * eyeLevel);
frontwall.position.z = 500;
scene.add(frontwall);

var doorGeometry = new THREE.BoxGeometry( 215, 450, 20 );
var door = new THREE.Mesh( doorGeometry, doorMaterial );
door.name = "door";
door.position.y = eyeLevel + 235;
door.position.z = -495;
scene.add(door);

var video = document.getElementById('tv');
//video.src = "static.mp4";
video.load();
video.loop = true;
var videoTexture = new THREE.VideoTexture(video);
videoTexture.needsUpdate;
videoTexture.minFilter = THREE.LinearFilter;
videoTexture.magFilter = THREE.LinearFilter;
videoTexture.format = THREE.RGBFormat;
videoTexture.crossOrigin = 'anonymous';

var tvCase = new THREE.Mesh(
	new THREE.BoxGeometry(325, 185, 10),
	new THREE.MeshBasicMaterial({ color: 0x000000 }),);
tvCase.rotation.y = (Math.PI / 2);
tvCase.position.set(-490,150,0);
scene.add(tvCase);
var tv = new THREE.Mesh(
    new THREE.PlaneGeometry(320, 180),
    new THREE.MeshBasicMaterial({ map: videoTexture }),);
tv.rotation.y = (Math.PI / 2);
tv.position.set(-484,150,0);
tv.name = "tv";

scene.add(tv);


var clickableObjects = [];
clickableObjects.push(door);

const gltfLoader = new THREE.GLTFLoader();
const tableModel = 'models/table/scene.gltf';

gltfLoader.load(tableModel, (gltf) => {    
	const table = gltf.scene;    
    table.scale.set(225, 225, 225);
    table.position.set(-350, -125, 0);
    
    table.traverse(function(child){ 
	    if (child.isMesh) {
	    	child.name = "table";
	        child.castShadow = true;
	        clickableObjects.push(child)
	    }
	});

    scene.add(table);
});

clickableObjects.push(tv);

var mouseX = 0;
var mouseY = 0;
var raycaster = new THREE.Raycaster();

var currentObject = "";
var angle = 0;

function onWindowResize(){
	camera.aspect = sceneWidth / sceneHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(sceneWidth, sceneHeight);
}

const mouse = new THREE.Vector2();

function onMouseMove( event ) {
	var rect = renderer.domElement.getBoundingClientRect();
	mouse.x = ( ( event.clientX - rect.left ) / ( rect.right - rect.left ) ) * 2 - 1;
	mouse.y = - ( ( event.clientY - rect.top ) / ( rect.bottom - rect.top) ) * 2 + 1;
	highlightObject();
}

renderer.domElement.addEventListener('pointerdown', function (event) {
    $('html,body').css('cursor','default');
    mouseX = event.clientX;
    mouseY = event.clientY;
}, false);
    
renderer.domElement.addEventListener('pointerup', function (event) {
    if (Math.round(mouseX) === Math.round(event.clientX) && 
    	Math.round(mouseY) === Math.round(event.clientY) ) {
    	onSceneClick();
    }
}, false);

var viewLevel = 0;
var level0Objects = ["door", "table", "tv"];
var level1Objects = ["tv"];
var levelObjectList = [];
levelObjectList.push(level0Objects);
levelObjectList.push(level1Objects);

function highlightObject() {
	raycaster.setFromCamera(mouse, camera);
	var intersects = raycaster.intersectObjects(clickableObjects); //array
	if (intersects.length > 0) {
		intersect = intersects[0];
		var objectName = intersect.object.name;
		var list = levelObjectList[viewLevel];
		if (list.indexOf(objectName) !== -1) {
			$('html,body').css('cursor','pointer');
		}
	}
	else {
		intersect.object.material.color.set(0xffffff);
		$('html,body').css('cursor','default');
	}
}

function onSceneClick(event) {

	raycaster.setFromCamera(mouse, camera);
	var intersects = raycaster.intersectObjects(clickableObjects); //array
	if (intersects.length > 0) {
		intersect = intersects[0];
		var objectName = intersect.object.name;
		clickObject(objectName);
	}
}

function toggleVideo() {
	if (!video.paused){
		video.pause();
		tv.visible = false;
	}
	else{
		tv.visible = true;
		video.play();
	}
}

function clickObject(objectName) {
	
	if (viewLevel === 0){
		if (objectName === "door") {
			viewLevel = 1;
			clickDoor();
		}
		else if (objectName === "table") {
			viewLevel = 1;
			clickTable();
		}
		else if (objectName === "tv") {
			viewLevel = 1;
			clickTable();
		}

		if (currentObject !== objectName) {
			currentObject = objectName;
		}
	}
	else if (viewLevel === 1) {
		if (objectName === "tv") {
			toggleVideo();
		}
	}
}

function clickDoor() {
	
	var delay = 0.5;

	if (Math.round(camera.position.x) === 0 && 
		Math.round(camera.position.y) === 0 &&
		Math.round(camera.position.z) === cameraDistance){
		delay = 0.1;
	}
	gsap.to( camera.position, {
		duration: delay,
		x: 0,
		y: 0,
		z: cameraDistance,
		onUpdate: function () {	
			camera.updateProjectionMatrix();
		}
	});
	gsap.to( controls.target, {
		delay: delay,
		duration: 0.5,
		x: 0,
		y: 34,
		z: -500,
		onUpdate: function () {	
			controls.update();
		}
	});
	gsap.to( camera.position, {
		delay: delay,
		duration: 0.5,
		x: 0,
		y: 34,
		z: 0,
		onUpdate: function () {	
			camera.updateProjectionMatrix();
		}
	});
	controls.enabled = false;

	setTimeout(function(){
		toggleBackButton(true);
	}, delay * 1000 + 500);
}

function clickTable() {
	
	var delay = 0.5;

	if (Math.round(camera.position.x) === cameraDistance && 
		Math.round(camera.position.y) === 0 &&
		Math.round(camera.position.z) === 0){
		delay = 0.1;
	}
	gsap.to( camera.position, {
		duration: delay,
		x: cameraDistance,
		y: 0,
		z: 0,
		onUpdate: function () {	
			camera.updateProjectionMatrix();
		}
	});
	gsap.to( controls.target, {
		delay: delay,
		duration: 0.5,
		x: -500,
		y: 45,
		z: 0,
		onUpdate: function () {	
			controls.update();
		}
	});
	gsap.to( camera.position, {
		delay: delay,
		duration: 0.5,
		x: 0,
		y: 0,
		z: 0,
		onUpdate: function () {	
			camera.updateProjectionMatrix();
		}
	});
	controls.enabled = false;

	setTimeout(function(){
		toggleBackButton(true);
	}, delay * 1000 + 500);
}

$("#back").click(goBack);

function toggleBackButton(isShow) {
	if (isShow === true) {
		$("#back").show();
	} 
	else {
		$("#back").hide();
	}
}

function goBack(){
	toggleBackButton(false);

	if (currentObject === "door") {		
		gsap.to( controls.target, {
			delay: 0.1,
			duration: 0.5,
			x: 0,
			y: 0,
			z: 0,
			onUpdate: function () {	
				controls.update();
			}
		});
		gsap.to( camera.position, {
			delay: 0.1,
			duration: 0.5,
			x: 0,
			y: 0,
			z: cameraDistance,
			onUpdate: function () {	
				camera.updateProjectionMatrix();
			}
		});
	}

	if (currentObject === "table" || currentObject === "tv") {		
		gsap.to( controls.target, {
			delay: 0.1,
			duration: 0.5,
			x: 0,
			y: 0,
			z: 0,
			onUpdate: function () {	
				controls.update();
			}
		});
		gsap.to( camera.position, {
			delay: 0.1,
			duration: 0.5,
			x: cameraDistance,
			y: 0,
			z: 0,
			onUpdate: function () {	
				camera.updateProjectionMatrix();
			}
		});
	}

	viewLevel = 0;
	currentObject = "";
	controls.enabled = true;
}

function animate() {
	requestAnimationFrame(animate);

	render();
	update();
};

function render() {	
	renderer.render( scene, camera );
}

function update() {
	controls.update();
}

animate();