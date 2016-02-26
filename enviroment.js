/*
	Three.js "tutorials by example"
	Author: Lee Stemkoski
	Date: July 2013 (three.js v59dev)
 */


//////////
// MAIN //
//////////
function MAIN()
{
// standard global variables
var container, scene, camera, renderer, controls, stats;
var keyboard = new THREEx.KeyboardState();
var clock = new THREE.Clock();

// custom global variables
var light;
    
// initialization
init();

// animation loop / game loop
animate();

///////////////
// FUNCTIONS //
///////////////

function init()
{
	///////////
	// SCENE //
	///////////
	scene = new THREE.Scene();

	////////////
	// CAMERA //
	////////////

	// set the view size in pixels (custom or according to window size)
	// var SCREEN_WIDTH = 400, SCREEN_HEIGHT = 300;
	var SCREEN_WIDTH = window.innerWidth, SCREEN_HEIGHT = window.innerHeight;
	// camera attributes
	var VIEW_ANGLE = 45, ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT, NEAR = 0.1, FAR = 20000;
	// set up camera
	camera = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR);
	// add the camera to the scene
	scene.add(camera);
	// the camera defaults to position (0,0,0)
	// 	so pull it back (z = 400) and up (y = 100) and set the angle towards the scene origin
	camera.position.set(0,150,400);
	camera.lookAt(scene.position);

	//////////////
	// RENDERER //
	//////////////

	// create and start the renderer; choose antialias setting.
	if ( Detector.webgl )
		renderer = new THREE.WebGLRenderer( {antialias:true} );
	else
		renderer = new THREE.CanvasRenderer();

	renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);

	// attach div element to variable to contain the renderer
	container = document.getElementById( 'ThreeJS' );
	// alternatively: to create the div at runtime, use:
	//   container = document.createElement( 'div' );
	//    document.body.appendChild( container );

	// attach renderer to the container div
	container.appendChild( renderer.domElement );

	////////////
	// EVENTS //
	////////////

	// automatically resize renderer
	THREEx.WindowResize(renderer, camera);
	// toggle full-screen on given key press
	THREEx.FullScreen.bindKey({ charCode : 'm'.charCodeAt(0) });

	//////////////
	// CONTROLS //
	//////////////

	// move mouse and: left   click to rotate,
	//                 middle click to zoom,
	//                 right  click to pan

	// this was removed in example for movement
	// controls = new THREE.OrbitControls( camera, renderer.domElement );

	///////////
	// STATS //
	///////////

	// displays current and past frames per second attained by scene
	stats = new Stats();
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.bottom = '0px';
	stats.domElement.style.zIndex = 100;
	container.appendChild( stats.domElement );

	///////////
	// LIGHT //
	///////////

	// create a light
	light = new THREE.PointLight(0xffffff, 3.0, 300);
	light.position.set(50,50,50);
	scene.add(light);
	//var ambientLight = new THREE.AmbientLight(0x444444);
    //scene.add(ambientLight);

    var PI2 = Math.PI * 2;
    var program = function ( context ) {
        context.beginPath();
        context.arc( 0, 0, 0.5, 0, PI2, true );
        context.fill();
    };
    
    var sphereLightMaterial = new THREE.MeshBasicMaterial( { color: 0xffffff } );
    var sphereLightGeometry = new THREE.SphereGeometry(5, 16, 32);
    sphereLight = new THREE.Mesh(sphereLightGeometry, sphereLightMaterial);
    sphereLight.position = (light.position);
    light.add( sphereLight );
    
	//////////////
	// GEOMETRY //
	//////////////

	// most objects displayed are a "mesh":
	//  a collection of points ("geometry") and
	//  a set of surface parameters ("material")
<
	// create an array with six textures for a cool cube
	var materialArray = [];
	materialArray.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'images/xpos.png' ) }));
	materialArray.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'images/xneg.png' ) }));
	materialArray.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'images/ypos.png' ) }));
	materialArray.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'images/yneg.png' ) }));
	materialArray.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'images/zpos.png' ) }));
	materialArray.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'images/zneg.png' ) }));
	var MovingCubeMat = new THREE.MeshFaceMaterial(materialArray);
	var MovingCubeGeom = new THREE.CubeGeometry( 50, 50, 50, 1, 1, 1, materialArray );
	MovingCube = new THREE.Mesh( MovingCubeGeom, MovingCubeMat );
	MovingCube.position.set(0, 25.1, 0);
	scene.add( MovingCube );


	var objTank;
	var loader = new THREE.ObjectLoader();
	loader.load( "objects/batmobile.json", function (obj) {
		objTank = obj;
		objTank.material = new THREE.MeshFaceMaterial		(
			{ color: 0x000000, vertexColors: THREE.FaceColors} );
	//	scene.add(objTank);
	} );

	///////////
	// FLOOR //
	///////////

	// note: 4x4 checkboard pattern scaled so that each square is 25 by 25 pixels.
	var floorTexture = new THREE.ImageUtils.loadTexture( 'images/grass.jpg' );
	floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
	floorTexture.repeat.set( 1, 1 );
	// DoubleSide: render texture on both sides of mesh
	var floorMaterial = new THREE.MeshPhongMaterial( { map: floorTexture, side: THREE.DoubleSide } );
	var floorGeometry = new THREE.PlaneGeometry(1000, 1000, 1, 1);
	var floor = new THREE.Mesh(floorGeometry, floorMaterial);
	floor.position.y = -0.5;
	floor.rotation.x = Math.PI / 2;
    floor.receiveShadows = true;
	scene.add(floor);

	/////////
	// SKY //
	/////////

	// recommend either a skybox or fog effect (can't use both at the same time)
	// without one of these, the scene's background color is determined by webpage background

	// make sure the camera's "far" value is large enough so that it will render the skyBox!
	var skyBoxGeometry = new THREE.CubeGeometry( 10000, 10000, 10000 );
	// BackSide: render faces from inside of the cube, instead of from outside (default).
	var skyBoxMaterial = new THREE.MeshBasicMaterial( { color: 0x000000, side: THREE.BackSide } );
	var skyBox = new THREE.Mesh( skyBoxGeometry, skyBoxMaterial );
	scene.add(skyBox);

	// fog must be added to scene before first render
	//scene.fog = new THREE.FogExp2( 0x000000, 0.003500 );
}

    var MovingCube;

function animate()
{
    requestAnimationFrame( animate );
	render();
	update();
}

function update()
{
	// delta = change in time since last call (in seconds)
	var delta = clock.getDelta();
    var moveDistance = 200 * delta; // 200 pixels per second
    var rotateAngle = Math.PI / 2 * delta;   // pi/2 radians (90 degrees) per second
    // this not in example
    var time = Date.now() * 0.0005;
    // local transformations

    // move forwards/backwards/left/right
    if ( keyboard.pressed("W") )
        MovingCube.translateZ( -moveDistance );
    if ( keyboard.pressed("S") )
        MovingCube.translateZ(  moveDistance );
    if ( keyboard.pressed("Q") )
        MovingCube.translateX( -moveDistance );
    if ( keyboard.pressed("E") )
        MovingCube.translateX(  moveDistance );

    // rotate left/right/up/down
    var rotation_matrix = new THREE.Matrix4().identity();
    if ( keyboard.pressed("A") )
        MovingCube.rotateOnAxis( new THREE.Vector3(0,1,0), rotateAngle);
    if ( keyboard.pressed("D") )
		MovingCube.rotateOnAxis( new THREE.Vector3(0,1,0), -rotateAngle);
    //if ( mesh ) mesh.rotation.y -= 0.01;

	light.position.x = Math.sin( time * 0.7 ) * 30;
	light.position.y = Math.cos( time * 0.5 ) * 40;
	light.position.z = Math.cos( time * 0.3 ) * 30;

    var relativeCameraOffset = new THREE.Vector3(0,50,200);

    var cameraOffset = relativeCameraOffset.applyMatrix4( MovingCube.matrixWorld );

    camera.position.x = cameraOffset.x;
    camera.position.y = cameraOffset.y;
    camera.position.z = cameraOffset.z;
    camera.lookAt( MovingCube.position );

	controls.update();
	stats.update();
}

function render()
{
	renderer.render( scene, camera );
}
}
