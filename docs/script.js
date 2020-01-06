var camera, controls, scene, renderer;
var seconds, minutes, hours, pivotS, pivotM, pivotH;

var oldSeconds = 0;

init();
animate();

function init() {
	// renderer
	renderer = new THREE.WebGLRenderer({ antialias: true });
	renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild(renderer.domElement);

	// camera
	camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000000);
	camera.position.set(20, 20, 30);
	camera.up.set(0, 1, 0);
	camera.lookAt(new THREE.Vector3(0, 0, 0));

	// scene
	scene = new THREE.Scene();
	scene.background = new THREE.Color( 0xdcdcdc );

	//lights
	var pointLight1 = new THREE.PointLight(0xffffff, 5, 1000, 2);
	pointLight1.position.set(30, 30, 40);
	pointLight1.castShadow = true;
	scene.add(pointLight1);

	var pointLight2 = new THREE.PointLight(0xffffff, 1, 1000, 2);
	pointLight2.position.set(-30, -30, -40);
	pointLight2.castShadow = true;
	scene.add(pointLight2);

	var directionalLight = new THREE.DirectionalLight(0xffffff, 1);
	directionalLight.position.set(0, 20, 40);
	directionalLight.castShadow = true;
	scene.add(directionalLight);

	//controls
	controls = new THREE.TrackballControls(camera, renderer.domElement);
	controls.rotateSpeed = 3.0;
	controls.zoomSpeed = 6.8;
	controls.panSpeed = 9.0;
	controls.noZoom = false;
	controls.noPan = false;
	controls.staticMoving = true;
	controls.dynamicDampingFactor = 0.3;
	controls.keys = [ 65, 83, 68 ];
	controls.addEventListener('change', render);

	// load gltf model and texture
	const loader = new THREE.GLTFLoader();
	loader.load('asset/wanduhr.gltf', (gltf) => {
		gltf.scene.scale.set(0.15, 0.15, 0.15);
		var mesh = gltf.scene;
		mesh.castShadow = true;
		mesh.receiveShadow = true;

		scene.add(mesh);
	});

	//load watchface
	const imgLoader = new THREE.TextureLoader();
	var imgTexture = imgLoader.load( 'asset/watchface.png' );
	var wacthfaceScale = 0.00327;

    var imgGeometry = new THREE.PlaneGeometry( 5954 * wacthfaceScale, 5962 * wacthfaceScale, 32 );;
    var imgMaterial = new THREE.MeshBasicMaterial( { map: imgTexture, opacity: 0.8, transparent: true } );

	var imgMesh = new THREE.Mesh( imgGeometry, imgMaterial );
	imgMesh.position.set(0, 0, 8.11);
    scene.add( imgMesh );

	// seconds hand
	var geometry = new THREE.CylinderGeometry(0.25, 0.25, 0.1, 60);
	var secondsMaterial = new THREE.MeshLambertMaterial( {
		color: 0x00ff00,
		emissive: 0x00ff00,
		emissiveIntensity: 5
	} );
	seconds = new THREE.Mesh(geometry, secondsMaterial);
	seconds.position.set(0, 11.4, 7.74);
	seconds.rotateX(Math.PI / 2);
	scene.add(seconds);

	// minutes hand
	var geometry = new THREE.CylinderGeometry(0.25, 0.25, 0.1, 60);
	var minutesMaterial = new THREE.MeshLambertMaterial( {
		color: 0xff0000,
		emissive: 0xff0000,
		emissiveIntensity: 5
	} );
	minutes = new THREE.Mesh(geometry, minutesMaterial);
	minutes.position.set(0, 11.4, 7.745);
	minutes.rotateX(Math.PI / 2);
	scene.add(minutes);

	// hours hand
	var geometry = new THREE.CylinderGeometry(0.25, 0.25, 0.1, 60);
	var hoursMaterial = new THREE.MeshLambertMaterial( {
		color: 0x0000ff,
		emissive: 0x0000ff,
		emissiveIntensity: 5
	} );
	hours = new THREE.Mesh(geometry, hoursMaterial);
	hours.position.set(0, 11.4, 7.75);
	hours.rotateX(Math.PI / 2);
	scene.add(hours);

	// pivots
	pivotS = new THREE.Group();
    pivotS.position.set( 0.0, 0.0, 0 );
    scene.add(pivotS);
	pivotS.add(seconds);
	
	pivotM = new THREE.Group();
    pivotM.position.set( 0.0, 0.0, 0 );
    scene.add(pivotM);
	pivotM.add(minutes);
	
	pivotH = new THREE.Group();
    pivotH.position.set( 0.0, 0.0, 0 );
    scene.add(pivotH);
    pivotH.add(hours);

	window.addEventListener('resize', onWindowResize, false);
}

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
	controls.handleResize();
	renderer.render(scene, camera);
}

function render() {
	renderer.render(scene, camera);
}

function animate() {
	requestAnimationFrame(animate);
	pivotS.rotation.z = Math.PI/30 * new Date().getSeconds() * (-1);
	pivotM.rotation.z = Math.PI/30 * new Date().getMinutes() * (-1);
	pivotH.rotation.z = Math.PI/6 * hours12(new Date()) * (-1);
	controls.update();
	render();
}

function hours12(date) { 
	return (date.getHours() + 24) % 12 || 12; 
}

/*
var camera, scene, renderer;
var geometry, material, mesh;

init();
animate();

function init() {

    camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 10 );
    camera.position.z = 1;

    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0xffffff );
    
    var loader = new THREE.TextureLoader();
    var texture = loader.load( 'asset/watchface.png' );

    geometry = new THREE.PlaneBufferGeometry();
    material = new THREE.MeshBasicMaterial( { map: texture ,opacity: 0.8, transparent: true } );

    mesh = new THREE.Mesh( geometry, material );
    scene.add( mesh );

    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );

}

function animate() {

    requestAnimationFrame( animate );
    renderer.render( scene, camera );

}*/
