
const sceneWidth = 852;
const sceneHeight = 480;

const loadingManager = new THREE.LoadingManager();

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, sceneWidth / sceneHeight, 0.1, 10000);
const renderer = new THREE.WebGLRenderer();
const spotLight = new THREE.SpotLight( 0xffffff );
const controls = new THREE.OrbitControls(camera, renderer.domElement);
const cameraDistance = 300;
const eyeLevel = -200;

var clickableObjects = [];

var mouseX = 0;
var mouseY = 0;
var raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

var currentObject = "";
var angle = 0;

var viewLevel = 0;
var level0Objects = ["door", "table", "tv"];
var level1Objects = ["tv", "greenButton", "redButton"];
var levelObjectList = [];
levelObjectList.push(level0Objects);
levelObjectList.push(level1Objects);

$(function() {

	initializeScene();
	addEventHandlers();
	addObjects();
	animate();

});

function initializeScene(){
	renderer.setSize(sceneWidth, sceneHeight);
	renderer.antialias = true;
	renderer.shadowMap.enabled = true;
	document.body.appendChild(renderer.domElement);

	spotLight.position.set( 0, 900, 0);
	spotLight.target.position.set( 0, 0, 0 );
	spotLight.penumbra = 0.9;
	spotLight.intensity = 3;
	spotLight.angle = Math.PI / 4;

	spotLight.shadow.camera.fov = 50;
	spotLight.shadow.camera.near = 0.1;
	spotLight.shadow.camera.far = 10000;

	spotLight.castShadow = true;

	scene.add( spotLight );
	scene.add( spotLight.target );

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
}

function addObjects(){
	var floorTexture = new THREE.TextureLoader(loadingManager).load( "images/Woodfloor.jpg" );
	var wallTexture = new THREE.TextureLoader(loadingManager).load( "images/Wallpaper.jpg" );
	var doorTexture = new THREE.TextureLoader(loadingManager).load( "images/Door.jpg" );
	var tableGLTF = new THREE.GLTFLoader(loadingManager);

	wallTexture.wrapS = THREE.RepeatWrapping;
	wallTexture.wrapT = THREE.RepeatWrapping;
	wallTexture.repeat.set( 3, 3 );
	
	var video = document.getElementById('tv');
	const videoTexture = new THREE.VideoTexture(video);
	videoTexture.needsUpdate;
	videoTexture.minFilter = THREE.LinearFilter;
	videoTexture.magFilter = THREE.LinearFilter;
	videoTexture.format = THREE.RGBFormat;
	videoTexture.crossOrigin = 'anonymous';

	var floorMaterial = new THREE.MeshPhongMaterial( { map: floorTexture, side: THREE.DoubleSide } );
	var wallMaterial = new THREE.MeshPhongMaterial( { map: wallTexture, side: THREE.DoubleSide } );
	var doorMaterial = new THREE.MeshPhongMaterial( { map: doorTexture, side: THREE.DoubleSide });

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

	// Door
	var doorGeometry = new THREE.BoxGeometry( 215, 450, 20 );
	var door = new THREE.Mesh( doorGeometry, doorMaterial );
	door.name = "door";
	door.position.y = eyeLevel + 235;
	door.position.z = -495;
	scene.add(door);
	clickableObjects.push(door);

	// TV
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
	clickableObjects.push(tv);

	// Table
	var tableModel = 'models/table/scene.gltf';
	tableGLTF.load(tableModel, (gltf) => {    
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

	// Button Device
	var boxGeometry = new THREE.BoxGeometry( 50, 30, 80 );
	var boxMaterial = new THREE.MeshPhongMaterial( {color: 0x202020} );
	var box = new THREE.Mesh( boxGeometry, boxMaterial );
	box.position.set(-300, -50, 0);
	box.receiveShadow = true;
	box.castShadow = true;
	scene.add( box );

	var greenButtonGeometry = new THREE.CylinderGeometry( 10, 10, 5, 50 );
	var greenButtonMaterial = new THREE.MeshPhongMaterial( {color: 0x00ff00} );
	var greenButton = new THREE.Mesh( greenButtonGeometry, greenButtonMaterial );
	greenButton.name = "greenButton";
	greenButton.position.set(-300, -33, 17);
	greenButton.receiveShadow = true;
	greenButton.castShadow = true;
	scene.add( greenButton );
	clickableObjects.push(greenButton);

	var redButtonGeometry = new THREE.CylinderGeometry( 10, 10, 5, 50 );
	var redButtonMaterial = new THREE.MeshPhongMaterial( {color: 0xff0000} );
	var redButton = new THREE.Mesh( redButtonGeometry, redButtonMaterial );
	redButton.name = "redButton";
	redButton.position.set(-300, -33, -17);
	redButton.receiveShadow = true;
	redButton.castShadow = true;
	scene.add( redButton );
	clickableObjects.push(redButton);
}

function addEventHandlers(){

	loadingManager.onStart = function ( url, itemsLoaded, itemsTotal ) {
		$("#progressBar").width(0);
	};

	loadingManager.onProgress = function ( url, itemsLoaded, itemsTotal ) {
	 	$("#progressBar").width((itemsLoaded / itemsTotal) * 200);
	};

	loadingManager.onLoad = function ( url, itemsLoaded, itemsTotal ) {
	 	$(".progress-bar").fadeOut(1000);
	 	$("#blackscreen").fadeOut(1000);
	 	$("#blackscreenStart span").fadeIn(1000);
	 	$("#blackscreenStart").click(function(){
	 		$(this).fadeOut(3000);
	 	});
	};

	window.addEventListener( 'mousemove', onMouseMove, false );

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

	$("#back").click(goBack);
}

function onWindowResize(){
	camera.aspect = sceneWidth / sceneHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(sceneWidth, sceneHeight);
}

function onMouseMove( event ) {
	var rect = renderer.domElement.getBoundingClientRect();
	mouse.x = ( ( event.clientX - rect.left ) / ( rect.right - rect.left ) ) * 2 - 1;
	mouse.y = - ( ( event.clientY - rect.top ) / ( rect.bottom - rect.top) ) * 2 + 1;
	highlightObject();
}

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
		else {
			$('html,body').css('cursor','default');
		}
	}
	else {
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
