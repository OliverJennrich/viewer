
var SCREEN_WIDTH =window.innerWidth;
var SCREEN_HEIGHT = window.innerHeight;

/* Controls *****************************************************************************/
// Use binary json from meshlab:
// Second: add texture extension to .mtl file!
// python convert_obj_three.py -i inputfile -t binary -a center -o outputfile
/* Variables ****************************************************************************/

// A somwhat reduced model
//var bjsonPath = "http://localhost:8000/models/67P_HD_2015-05-09-r10.js";
var bjsonPath = "models/67P_HD_2015-05-09-r10.js";
var texturePath = "texture/texture_Background_s.png";

var scaleFactor = 1;  // 20 units per kilometre
var scaleFactorComet = 0.001;  // 1000 units per kilometre
var rotZ = 175;

var container;
var camera, scene;
var body;
var origin, bodyorigin;
var renderer = Detector.webgl? new THREE.WebGLRenderer({ antialiasing: true }): new THREE.CanvasRenderer();

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

var controls;
var params, region_toggles, navcam_toggles;     // parameters in the GUI

var textures;

var loadtext;

var IsiPhoneOS;

var directionalLight, ambient;

// holds the comet
var mesh;

var cube;  // testing only1

var orbitpos;
// Create the GUI
var gui = new dat.GUI();

var time0;
var clock;

var rad=0;
// Needed? Anyway, a flag that indicates that the script has just loaded
var firsttime=true;

// variables for the 'transparent sphere gimmick'
var targetList = [];
var posIndicators = {startindex:0, stopindex:0};
var projector, mouse = { x: 0, y: 0 };

// scene and camera for the sprites
var cameraOrtho, sceneOrtho;

// scene for the 'liveview'
var sceneView, camaeraView;

// Sprites for the 'views'
var spriteTL;
var sprites = [];
var spriteView;

var effect;

init();
animate();



function init() { 
    // detect iOS

    var IsiPhone = navigator.userAgent.indexOf("iPhone") != -1 ;
    var IsiPod = navigator.userAgent.indexOf("iPod") != -1 ;
    var IsiPad = navigator.userAgent.indexOf("iPad") != -1 ;

    IsiPhoneOS = IsiPhone || IsiPad || IsiPod ;

    console.log("iOS "+IsiPhoneOS);

    var container = document.getElementById( 'container' );

//     // Create the progress bar
//     loadtext = document.getElementById('progress');
//     loadtext.position = 'absolute';
//     // loadtext.style.zIndex = 1;    // if you still don't see the label, try uncommenting this
//     loadtext.style.width = 100;
//     loadtext.style.height = 100;
//     loadtext.style.backgroundColor = "black";
//     loadtext.innerHTML = "Loading ";
//     loadtext.style.top = '200px';
//     loadtext.style.left = '200px';
//     container.appendChild(loadtext);

   
    // Create the  FPS window
    stats = new Stats();
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.bottom = '0px';
    container.appendChild( stats.domElement );

    //geometry = new THREE.Geometry();

    
    // Loader splash
    THREE.DefaultLoadingManager.onProgress = function ( item, loaded, total ) {

	if (loaded==total) {
	    console.log( "DefaultLoadingManager: "+item+" " + loaded +'/'+ total );
	    console.log("Done!");
//	    if (firsttime) loadtext.innerHTML = loadtext.innerHTML + ".done";
	    time0= Date.now()
	}
	else {
	    console.log( "DefaultLoadingManager: "+item+" " + loaded +'/'+ total );
//	    if (firsttime) loadtext.innerHTML = loadtext.innerHTML + ".";
	}
	
    };

    THREE.DefaultLoadingManager.onLoad = function ( item, loaded, total ) {

	mesh.material = createMaterial( createUniforms() );
	render();
	
    };
	
    // create the loader for the 3D-object            
    // var bjsonLoader = new THREE.BinaryLoader(true);
    var bjsonLoader = new THREE.JSONLoader();
    
    // Parameters
    params = new createParams();
    region_toggles = JSON.stringify( params.regions );
    navcam_toggles = JSON.stringify( params.navcam );

    // textures
    textures = new createTextures();


    
    // Camera!
    
    var width = window.innerWidth || 2;
    var height = window.innerHeight || 2;

    
    camera = new THREE.PerspectiveCamera(5, width / height, 1, 100000);

     // The ortho-camera for the sprites
    cameraOrtho = new THREE.OrthographicCamera( - width / 2, width / 2, height / 2, - height / 2, 1, 10 );
    cameraOrtho.position.z = 10;

    // the view camera
    cameraView = new THREE.PerspectiveCamera(5,1, 1, 100000);
   
    //Scenes 
    scene = new THREE.Scene();

    // orthoScene for the sprites
    sceneOrtho = new THREE.Scene();

    // Scene for the 'live view'
    sceneView = new THREE.Scene();
    
    // Take the read coordinates and put a sphere on each position
    createPositionIndicators();
    
       
    // renderer
    renderer.setSize(width, height );
    renderer.autoClear = false;
    
    container.appendChild( renderer.domElement );

    // ORBIT AND PAN CONTROLS!
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    //controls = new THREE.TrackballControls(camera);
    controls.userPanSpeed = 25.0;
    controls.addEventListener( 'change', render );

    
    // LIGHTS
    ambient = new THREE.AmbientLight();
    ambient.color.r = params.ambient_volume;
    ambient.color.g = params.ambient_volume;
    ambient.color.b = params.ambient_volume;
    scene.add(ambient);

    directionalLight = new THREE.DirectionalLight(0xffffff);
    var xlight = params.r_light * Math.sin(Math.PI/180*params.theta_light) * Math.cos(Math.PI/180*params.phi_light);
    var ylight = params.r_light * Math.sin(Math.PI/180*params.theta_light) * Math.sin(Math.PI/180*params.phi_light);
    var zlight = params.r_light * Math.cos(Math.PI/180*params.theta_light);
    
    directionalLight.position.set(xlight, ylight, zlight);
    scene.add(directionalLight);

    // Origin
    origin = new THREE.AxisHelper(1000);
    origin.display = true;
    scene.add(origin);

  
    // Camera helper
    camerahelper = new THREE.CameraHelper(camera);
    camerahelper.display=true;
    //scene.add(camerahelper);

    // Directional Light helper
    lighthelper = new THREE.DirectionalLightHelper( directionalLight, 10);
    lighthelper.display = params.display_lighthelper;
    scene.add( lighthelper);

    // Grid helper
    //var gridHelper = new THREE.GridHelper( 200, 10 );		
    //scene.add( gridHelper );

    // MODEL + Texture
    // createScene is a call-back function, so after this, the scene is complete
    //bjsonLoader.load(bjsonPath,createScene);
    createScene();
    

    // start time
    time0= Date.now();
    
    // Force an update when page loads!
    update();
    render();


   
    //effect = new THREE.AnaglyphEffect( renderer );
    // effect.setSize( width, height );
    
    // resize handling
    console.log("Resize handling");
    window.addEventListener('resize', onWindowResize, false);
    
    // create the GUI upon the load of the window
    window.onload = createGUI();

  
    // intialise the clock
    clock = new THREE.Clock( true );

    // initialize object to perform world/screen calculations
    projector = new THREE.Projector();

    // when the mouse moves, call the given function
    console.log("mousedown handling");
    document.addEventListener( 'mousedown', onDocumentMouseDown, false );

}



 

// **********************************************************************
// **********************************************************************
//
// All the methods  needed for creating things 
//
// **********************************************************************
// **********************************************************************

// This creates the Uniforms that we need for the shader.
// Function is used twice, once during initialisation  [init()]
// and once in the animate [animate()] hook whenever the texture has to be changed
function createUniforms(){
    var uniforms = {

	t0: { type: "t", value: textures.tBackground },
	t1: { type: "t", value: params.regions.Aker       ? textures.tAker      : textures.tBlank } ,
	t2: { type: "t", value: params.regions.Anubis     ? textures.tAnubis    : textures.tBlank } ,
	t3: { type: "t", value: params.regions.Anuket     ? textures.tAnuket    : textures.tBlank } ,
	t4: { type: "t", value: params.regions.Apis       ? textures.tApis      : textures.tBlank } ,
	t5: { type: "t", value: params.regions.Ash        ? textures.tAsh       : textures.tBlank } ,
	t6: { type: "t", value: params.regions.Aten       ? textures.tAten      : textures.tBlank } ,
	t7: { type: "t", value: params.regions.Atum       ? textures.tAtum      : textures.tBlank } ,
	t8: { type: "t", value: params.regions.Babi       ? textures.tBabi      : textures.tBlank } ,
	t9: { type: "t", value: params.regions.Bastet     ? textures.tBastet    : textures.tBlank } ,
	t10: { type: "t", value: params.regions.Hapi      ? textures.tHapi      : textures.tBlank } ,
	t11: { type: "t", value: params.regions.Hathor    ? textures.tHathor    : textures.tBlank } ,
	t12: { type: "t", value: params.regions.Hatmethit ? textures.tHatmethit : textures.tBlank } ,
	t13: { type: "t", value: params.regions.Imothep   ? textures.tImothep   : textures.tBlank } ,
	t14: { type: "t", value: params.regions.Khepry    ? textures.tKhepry    : textures.tBlank } ,
	t15: { type: "t", value: params.regions.Maat      ? textures.tMaat      : textures.tBlank } ,
	t16: { type: "t", value: params.regions.Maftet    ? textures.tMaftet    : textures.tBlank } ,
	t17: { type: "t", value: params.regions.Nut       ? textures.tNut       : textures.tBlank } ,
	t18: { type: "t", value: params.regions.Serqet    ? textures.tSerqet    : textures.tBlank } ,
	t19: { type: "t", value: params.regions.Seth      ? textures.tSeth      : textures.tBlank }

    };

    return(uniforms);

}


// this creates the textures
// The loading is done in 'loadtextures' and the construction of the filename in
// fileNamefromName.

function createTextures(){

    function loadTexture( texturePath ){
	var value;

	
	//	value = THREE.ImageUtils.loadTexture( texturePath, null, function onload(){ console.log("Texture loaded")} );
	value = THREE.ImageUtils.loadTexture( texturePath );
	
	return( value );
    }

    function fileNamefromName( name, text ){
	var ext;
	var filename;

	if (text) {
	    ext = '_Text_s.png';
	}
	else {
	    ext = '.png';
	};

	filename ='texture/texture_'+name+ext;
	//console.log( filename);
	return( filename );
    }
    
    var textures = {
	tBlank : THREE.ImageUtils.generateDataTexture (1024,1024, 0),
	tBackground : loadTexture( texturePath ),
	tAker : loadTexture( fileNamefromName('Aker', true ) ),
	tAnubis : loadTexture( fileNamefromName('Anubis', true ) ),
	tAnuket : loadTexture( fileNamefromName('Anuket', true ) ),
	tApis : loadTexture( fileNamefromName('Apis', true ) ),
	tAsh : loadTexture( fileNamefromName('Ash', true ) ),
	tAten : loadTexture( fileNamefromName('Aten', true ) ),
	tAtum : loadTexture( fileNamefromName('Atum', true ) ),
	tBabi : loadTexture( fileNamefromName('Babi', true ) ),
	tBastet : loadTexture( fileNamefromName('Bastet', true ) ),
	tHapi : loadTexture( fileNamefromName('Hapi', true ) ),
	tHathor : loadTexture( fileNamefromName('Hathor', true ) ),
	tHatmethit : loadTexture( fileNamefromName('Hatmethit', true ) ),
	tImothep : loadTexture( fileNamefromName('Imothep', true ) ),
	tKhepry : loadTexture( fileNamefromName('Khepry', true ) ),
	tMaat : loadTexture( fileNamefromName('Maat', true ) ),
	tMaftet : loadTexture( fileNamefromName('Maftet', true ) ),
	tNut : loadTexture( fileNamefromName('Nut', true ) ),
	tSerqet : loadTexture( fileNamefromName('Serqet', true ) ),
	tSeth : loadTexture( fileNamefromName('Seth', true ) )
    };

    return(textures);
}

// This creates the material for the mesh. It is in here where the blending of the various
// color-patches is initiated. The 'real' work is done by rendertoTexture

function createMaterial( u ){

    function rendertoTexture( tex1, tex2, tex3, tex4, tex5, tex6, tex7, tex8, tex9, tex10,tex11 ){

	// inspired by
	// http://stackoverflow.com/questions/21533757/three-js-use-framebuffer-as-texture
	
	var myScene = new THREE.Scene();

	// you may need to modify these parameters
	var renderTargetParams = {
	    minFilter:THREE.LinearFilter,
	    stencilBuffer:false,
	    depthBuffer:false
	};

	var imageWidth = 1024;
	var imageHeight = 1024;

	// create buffer with the right size.
	
	var myTexture = new THREE.WebGLRenderTarget( imageWidth, imageHeight, renderTargetParams );       

	// custom RTT materials
	var myUniforms = {
	    t0: { type: "t", value: tex1 },
	    t1: { type: "t", value: tex2 },
	    t2: { type: "t", value: tex3 },
	    t3: { type: "t", value: tex4 },
	    t4: { type: "t", value: tex5 },
	    t5: { type: "t", value: tex6 },
	    t6: { type: "t", value: tex7 },
	    t7: { type: "t", value: tex8 },
	    t8: { type: "t", value: tex9 },
	    t9: { type: "t", value: tex10 },
	    t10: { type: "t", value: tex11 }
	    
	};

	// set up the shade materials
	if (IsiPhoneOS) {
	    myTextureMat = new THREE.ShaderMaterial({
		uniforms: myUniforms,
		vertexShader: document.getElementById('vertex_shader').innerHTML,
		fragmentShader: document.getElementById('fragment_shader8').innerHTML
	    });
	}
	else {
	    myTextureMat = new THREE.ShaderMaterial({
		uniforms: myUniforms,
		vertexShader: document.getElementById('vertex_shader').innerHTML,
		fragmentShader: document.getElementById('fragment_shader').innerHTML
	    });
	}

	// Setup render-to-texture scene
	myCamera = new THREE.OrthographicCamera( imageWidth / - 2, imageWidth / 2, imageHeight / 2, imageHeight / - 2, -10000, 10000 );

	// Set up a plane target
	var myTextureGeo = new THREE.PlaneBufferGeometry( imageWidth, imageHeight );
	myTextureMesh = new THREE.Mesh( myTextureGeo, myTextureMat );
	myTextureMesh.position.z = -100;
	myScene.add( myTextureMesh );

	// and render it
	renderer.render( myScene, myCamera, myTexture, true );

	// now myTexture contains the rendered image (which is the blended input textures)
	return( myTexture );

    };


    // As the GL-code only accepts a maximum of 16 inouts, we split the textures into to batches of 10 and 9 (+1 blank)
    // and create a new texture for it
    // This call can be somewhat time-consuming!
    
    //    var t0 = performance.now();
    var tex;
    
    if (IsiPhoneOS) {
	tex = rendertoTexture( u.t0.value, u.t1.value, u.t2.value, u.t3.value,  u.t4.value,  u.t5.value, u.t6.value, u.t7.value  );
	tex = rendertoTexture(tex, u.t8.value,  u.t9.value,  u.t10.value, u.t11.value, u.t12.value, u.t13.value,  u.t14.value );
	tex = rendertoTexture(tex, u.t15.value, u.t16.value, u.t17.value, u.t18.value,  u.t19.value,  textures.tBlank ,textures.tBlank );
    }
    else {
	tex = rendertoTexture( u.t0.value, u.t1.value, u.t2.value, u.t3.value,  u.t4.value,  u.t5.value, u.t6.value, u.t7.value, u.t8.value,  u.t9.value,  u.t10.value  );
	tex = rendertoTexture(tex, u.t11.value, u.t12.value, u.t13.value,  u.t14.value,  u.t15.value, u.t16.value, u.t17.value, u.t18.value,  u.t19.value,  textures.tBlank );
    }
    //     var t1 = performance.now();
    //    console.log("Call to rendertoTexture took " + (t1 - t0) + " milliseconds.")
    
    
    var material = new THREE.MeshLambertMaterial( { map: tex } );
    material.side = THREE.DoubleSide;

    return( material);
}

// **********************************************************************
// This creates the Scene
//
//

function createScene( ) {
//    console.log("Object loaded:");
//    console.log( "\tvertices: " + geometry.vertices.length );
//    console.log( "\tfaces: " + geometry.faces.length );

//    console.log(geometry);

    loader = new THREE.JSONLoader();
    
    var model= loader.parse( comet );

    console.log( "\tvertices: " + model.geometry.vertices.length );
    console.log( "\tfaces: " + model.geometry.faces.length );

    var uniforms = createUniforms();

    // This is asynchronous. So the texture file might not be loaded yet

    var material_shh = new createMaterial(uniforms);


    mesh = new THREE.Mesh( model.geometry, material_shh );

    console.log("Mesh created");

    //scale up (or down as in this case)
    mesh.scale.set(scaleFactorComet,scaleFactorComet,scaleFactorComet);


    // Add the coordinate system for the body-axes
      
    bodyorigin = new THREE.AxisHelper(200);
    bodyorigin.display = params.display_bodyaxes;
    
    // rotate the body-fixed coordinate-system into the position of the
    // inertial moments
    axis = new THREE.Vector3(0.00962532, 0.00264994, 0.99995);    
    rotateAroundObjectAxis(bodyorigin, axis,  78.5241 * Math.PI / 180);


    // create a group for the two objects

    body = new THREE.Group();
    
    body.add(bodyorigin);
    body.add(mesh); 

    // add the group to the scene
    scene.add(body);


    //loadtext.innerHTML = loadtext.innerHTML + " done";
    // console.log("Exit createScene");
}

// Cretae the (red) balls
function createPositionIndicators(){
    var spheregeometry = new THREE.SphereGeometry( 0.5, 32, 32 );
    var spherematerial = new THREE.MeshLambertMaterial( {color: 0x951e3a} );
    // var spherematerial = new THREE.MeshPhongMaterial(  { color: 0xdddddd, specular: 0x009900, shininess: 30, shading: THREE.FlatShading } );
    spherematerial.transparent = true;
    spherematerial.emmisive = 0xaa0000;
    spherematerial.opacity = 0.7;

    // orbitpos is read in the fits.json file which has it's own script tag

    // remember the number of children in scene
    posIndicators.startindex = scene.children.length;
    
    for (ii=0; ii<orbitpos.length; ii++){

	var fits = orbitpos[ii][0];
 	var sphere = new THREE.Mesh( spheregeometry, spherematerial );
 	sphere.position.x = fits["SC-COM_X"][0]/scaleFactor;
 	sphere.position.y = fits["SC-COM_Y"][0]/scaleFactor;
 	sphere.position.z = fits["SC-COM_Z"][0]/scaleFactor;

	sphere.name = orbitpos[ii];
 	// sphere.name =  '"'+fits["OBS_ID"]+'"';
	sphere.visible = params.navcam.display_positions;


	
 	//for (jj=1; jj<orbitpos[ii].length; jj++){
 	    // sphere.name = sphere.name + "," + '"'+orbitpos[ii][jj]["OBS_ID"]+'"';
	    
 	//}

 	// sphere.name = "[" + sphere.name + "]"; // make that a parseable string!
 	// console.log( ii + " " + sphere.name );

 	scene.add( sphere );

 	// Add the sphere to the target list
 	targetList.push(sphere);
    }

    // Remember the start...stop indices in the children array for later use
    posIndicators.stopindex = scene.children.length;
    
    // This puts the camera into the position of the first navcam picture
    var firstpos = orbitpos[0][0];
    campos = new THREE.Vector3(firstpos["SC-COM_X"][0], firstpos["SC-COM_Y"][0], firstpos["SC-COM_Z"][0]);
    params.camera_distance = firstpos["TARGDIST"][0];
    
    console.log( firstpos["SC-COM_X"][0], firstpos["SC-COM_Y"][0], firstpos["SC-COM_Z"][0], firstpos["TARGDIST"][0]);
    
    camera.translateOnAxis( campos.normalize(), params.camera_distance/scaleFactor);
    // Switch off the first ball
    scene.children[  posIndicators.startindex ].visible = true;

    // console.log("Spheres are done!");
    

}
// **********************************************************************

// **********************************************************************
// This creates the GUI. It is called just once upon the load of the window
//
//
function createGUI() {

    var fHelper = gui.addFolder('Display Helpers');
    fHelper.add(params, 'display_lighthelper').name( 'Light helper' );
    fHelper.add(params, 'display_axes').name( 'Axes' );
    fHelper.add(params, 'display_bodyaxes').name( 'Principal body axes' );
    
    var f1 = gui.addFolder('Light Position');

    f1.add(params, 'r_light', 50, 500).name('Distance');
    f1.add(params,'theta_light', 0, 180).name('Theta');
    f1.add(params,'phi_light', 0, 360).name('Phi');
    f1.add(params,'ambient_volume', 0, 1).name('Ambient Light');
    
    f1.open();

    var f2 = gui.addFolder('Navcam pictures');
    f2.add(params.navcam, 'display_positions').name( 'Navcam pictures' );
    f2.add(params.navcam, 'camera_follow').name( 'Follow position' );
    f2.add(params.navcam, 'model_view').name( 'Model view');

    
   //  var fCamera = gui.addFolder('Camera');
//     fCamera.add( params, 'camera_distance').name( 'Camera distance (km)' ).listen();
//     fCamera.open();

    var fAnimation = gui.addFolder('Animation');
    fAnimation.add(params,'spin').name('Spin');
    fAnimation.add(params,'omega',0 ,1).name('Rotation speed');
    fAnimation.open();
    
    var fRegions = gui.addFolder('Regions');
    fRegions.add(params.regions,'AllRegions', ['None', 'All', 'Some']).name('Display Regions').listen();

    var fRegionsSub = fRegions.addFolder('Regions (detail)');

    fRegionsSub.add(params.regions, 'Aker').listen();
    fRegionsSub.add(params.regions, 'Anubis').listen();
    fRegionsSub.add(params.regions, 'Anuket').listen();
    fRegionsSub.add(params.regions, 'Apis').listen();
    fRegionsSub.add(params.regions, 'Ash').listen();
    fRegionsSub.add(params.regions, 'Aten').listen();
    fRegionsSub.add(params.regions, 'Atum').listen();
    fRegionsSub.add(params.regions, 'Babi').listen();
    fRegionsSub.add(params.regions, 'Bastet').listen();
    fRegionsSub.add(params.regions, 'Hapi').listen();
    fRegionsSub.add(params.regions, 'Hathor').listen();
    fRegionsSub.add(params.regions, 'Hatmethit').listen();
    fRegionsSub.add(params.regions, 'Imothep').listen();
    fRegionsSub.add(params.regions, 'Khepry').listen();
    fRegionsSub.add(params.regions, 'Maat').listen();
    fRegionsSub.add(params.regions, 'Maftet').listen();
    fRegionsSub.add(params.regions, 'Nut').listen();
    fRegionsSub.add(params.regions, 'Serqet').listen();
    fRegionsSub.add(params.regions, 'Seth').listen();

    fRegions.open();	
  
};


// Create the parameter structure. This contains everything for controlling the viewer.

function createParams(){
    
    // Status

    this.update = false;

    // Helpers
    this.display_lighthelper =false;
    this.display_axes = false;
    this.display_bodyaxes = false;

    // Navcam
    this.navcam = { display_positions : true,
		    camera_follow : false,
		    model_view : true } ;

    // Light position
    this.r_light = 200;
    this.theta_light = 90;
    this.phi_light = 0;

    // Ambient light
    this.ambient_volume = 0.65;

    // Camera position
    this.camera_distance = 500;
    
    // Animation
    this.spin = false;
    this.omega = 0.5;
    
    //Regions
    this.DisplayText = true;
 
    this.regions = {
	key: function(n) {
            return this[Object.keys(this)[n]]},
	names: ['Aker', 'Anubis', 'Anuket','Apis', 'Ash', 'Aten',
		'Atum', 'Babi','Bastet', 'Hathor', 'Hapi','Hatmethit',
		'Imothep', 'Khepry', 'Maat', 'Maftet', 'Nut',
		'Serqet', 'Seth'],
	AllRegions : 'None',
	Aker : false,
	Anubis : false,
	Anuket : false,
	Apis : false,
	Ash : false,
	Aten : false,
	Atum : false,
	Babi : false,
	Bastet : false,
	Hathor : false,
	Hapi : false,
	Hatmethit : false,
	Imothep : false,
	Khepry : false,
	Maat : false,
	Maftet: false,
	Nut : false,
	Serqet : false,
	Seth : false		     
    };
    
};


function createHUDSprites ( texture ) {

    var material = new THREE.SpriteMaterial( { map: texture } );

    var width = material.map.image.width;
    var height = material.map.image.height;

    // console.log( "Sprite width " + width + " height " + height);

    sceneOrtho.remove( spriteTL );
     for (ii=0;ii<sprites.length;ii++){
//	 console.log("remove sprites from group");
	 sceneOrtho.remove( sprites[ii] );
     }
    
    spriteTL = new THREE.Sprite( material );
    spriteTL.scale.set( width, height, 1 );
    sceneOrtho.add( spriteTL );

    updateHUDSprites();

};


function updateHUDSprites () {

    var width = window.innerWidth / 2;
    var height = window.innerHeight / 2;

    var material = spriteTL.material;

    var imageWidth = material.map.image.width / 2;
    var imageHeight = material.map.image.height / 2;

    spriteTL.position.set( - width + imageWidth,   height - imageHeight, 1 ); // top left

};



// **********************************************************************



// **********************************************************************
// **********************************************************************
//
// All the methods for updating, animating, rendering etc.
//
// **********************************************************************
// **********************************************************************

// **********************************************************************
function animate() {
    requestAnimationFrame( animate );

    // roatate things

    // rotate around the y-axis
    var bodyaxis = new THREE.Vector3(0,1,0);
    var cometaxis = new THREE.Vector3(0.0103069, -0.00731029, 0.99992);
    
    //var axis = new THREE.Vector3(-0.979939, 0.198962, 0.0115555);
    if (params.spin){
	// the next line is for a 'constant' rotation
	//	rad = 25* clock.getDelta() *params.omega * Math.PI / 180;
	rad = -params.omega * Math.PI / 180;
	body.rotateOnAxis(cometaxis,rad);

    }
    // re-render the scene
    render();

    // update everything
    update();

  
}

// **********************************************************************
function update()
{
    // update the controls
    controls.update();

    // Do not forget to opdate the stats, if you want to see the 'FPS' window populated!
    stats.update();

    // update the camera distance
    // camera.translateOnAxis( , params.camera_distance/scaleFactor);
    
    // update the directional light
    var xlight = params.r_light * Math.sin(Math.PI/180*params.theta_light) * Math.cos(Math.PI/180*params.phi_light);
    var ylight = params.r_light * Math.sin(Math.PI/180*params.theta_light) * Math.sin(Math.PI/180*params.phi_light);
    var zlight = params.r_light * Math.cos(Math.PI/180*params.theta_light);

    directionalLight.position.set(xlight, ylight, zlight);
   
    // update the ambient light
    ambient.color.r = params.ambient_volume;
    ambient.color.g = params.ambient_volume;
    ambient.color.b = params.ambient_volume;

    // Update the light helper
    lighthelper.visible = params.display_lighthelper;
    lighthelper.update()

    // Update the axes
    origin.visible = params.display_axes;

    // update bodyaxes
    if (bodyorigin != undefined ) bodyorigin.visible = params.display_bodyaxes;
    
    // This is only for the region update - if any of the regions have changed
    // The 'stringify' trick is very useful - otherwise this would have to be done
    // in a huge and cumbersome 'if or or or or' construction
    
    if ( region_toggles  != JSON.stringify( params.regions) ){
	//	console.log("Texture update");

	// first check if the 'AllRegions' flag has been changed.
	// If NOT, then some of the regions have been toggled manually,
	// so we need to set the 'AllRegions' to 'Some' (which disables
	// the auto-setting below.
	var oldregion_toggles = JSON.parse(region_toggles);

	
	if ( params.regions.AllRegions == oldregion_toggles.AllRegions ){
	    params.regions.AllRegions = 'Some';
	}
	else {
	    // Deal with the cases that the 'AllRegions' flag has been changed
 	    if (params.regions.AllRegions == 'None'){
 		for( n=0; n<params.regions.names.length; n++ ) {
 		    params.regions[ params.regions.names[n] ] = false;
		};
		// Set the allregions flag to something invalid so that it is not
		// immediately reset to 'Some' the next time this loop is triggered
		params.regions.AllRegions == 'Invalid';
	    } else if (params.regions.AllRegions == 'All') {
		for( n=0; n<params.regions.names.length; n++ ) {
 		    params.regions[ params.regions.names[n] ] = true;
		};
	
		params.regions.AllRegions == 'Invalid';
	    }
	}
        mesh.material = createMaterial( createUniforms() );

	// Now copy the new params into the backup storage so that it can be compared the next time around
	region_toggles = JSON.stringify(params.regions);

    }

    // change the scale of the position indicators so that they never take more than ~5% of the FoV
    for (ii=posIndicators.startindex; ii<posIndicators.stopindex; ii++){
	var scale = Math.max(0.02,Math.min( 1, scene.children[ii].position.distanceTo(camera.position)/200))
	scene.children[ii].scale.set(scale,scale,scale);
    }
    
    // switch the position indicators on or off if there has been any change
    if ( navcam_toggles  != JSON.stringify( params.navcam) ){
	for (ii=posIndicators.startindex; ii<posIndicators.stopindex; ii++){
	    scene.children[ii].visible = params.navcam.display_positions;
	}
	if (! params.navcam.display_positions) {
	    sceneOrtho.remove( spriteTL );
	    for (ii=0;ii<sprites.length;ii++){
		sceneOrtho.remove( sprites[ii] );
	    }
	}
    }

	// switch off the loading status after 3 seconds
	if (Date.now()-time0 > 1000 && firsttime) {
	    firsttime = false;
	    // Clear the element
	    var element = document.getElementById("progress");
	    element.parentNode.removeChild(element);
	    //loadtext.innerHTML='  ';
	}
	navcam_toggles = JSON.stringify(params.navcam);
    

  
}

function render() {
    // We need to render for both cameras, the normal one pointing to the comet
    // and the 'Ortho' one pointing to the sprites
    
    //renderer.clear();
    // renderer.render( scene, camera );
    renderer.render( scene, camera );
    //renderer.clearDepth();
    renderer.render( sceneOrtho, cameraOrtho );
    renderer.render( sceneView, cameraView);
}

function hide(object){
    object.traverse( function ( object ) { object.visible = false; } );
}

function show(object){
    object.traverse( function ( object ) { object.visible = true; } );
}

var rotObjectMatrix;
function rotateAroundObjectAxis(object, axis, radians) {
    rotObjectMatrix = new THREE.Matrix4();
    rotObjectMatrix.makeRotationAxis(axis.normalize(), radians);

  
    object.matrix.multiply(rotObjectMatrix);
    object.rotation.setFromRotationMatrix(object.matrix);
}

// **********************************************************************
// **********************************************************************
//
// All the 'on'-event methods
//
// **********************************************************************
// **********************************************************************

function onWindowResize() {
    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    
    var width = window.innerWidth;
    var height = window.innerHeight;
    
    
    cameraOrtho.left = - width / 2;
    cameraOrtho.right = width / 2;
    cameraOrtho.top = height / 2;
    cameraOrtho.bottom = - height / 2;
    cameraOrtho.updateProjectionMatrix();

    updateHUDSprites();

    renderer.setSize( window.innerWidth, window.innerHeight );
    
    // renderer.setSize(window.innerWidth, window.innerHeight);
}

function onDocumentKeyPress( event ) {
    var keyCode = event.which;

    // A
    if ( keyCode == 65 ) {
	console.log( params )
    };
}

function onDocumentMouseDown( event ) 
{
    // the following line would stop any other event handler from firing
    // (such as the mouse's TrackballControls)
    // event.preventDefault();
    
    
    function toString(v) { return "[ " + v.x + ", " + v.y + ", " + v.z + " ]"; }
    

    // we can exit immediately if the position indicators are not displayed
    if (! params.navcam.display_positions) return;

    // console.log("Click!");
    
    // update the mouse variable
    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

   //  console.log( event );
//     if ( event.clientX <= 256 && event.clientY <= 256 ){
// 	console.log("Read the full picture");
// 	//filename = "http://imagearchives.esac.esa.int/action.php?id=8906&part=e&download"
// 	filename= "images/256/ROS_CAM1_20140801T130717F_256_f.png"
// 	THREE.ImageUtils.crossOrigin = "anonymous";
// 	THREE.ImageUtils.loadTexture( filename, undefined, createHUDSpritesFullSize, function(e) { console.log(e) } );
// 	return;
//     }
	
    // find intersections

    // create a Ray with origin at the mouse position
    //   and direction into the scene (camera direction)
    var vector = new THREE.Vector3( mouse.x, mouse.y, 1 );
    projector.unprojectVector( vector, camera );
    var ray = new THREE.Raycaster( camera.position, vector.sub( camera.position ).normalize() );

    // create an array containing all objects in the scene with which the ray intersects
    var intersects = ray.intersectObjects( targetList );
    
    // if there is one (or more) intersections, display the sprites according to the 'basename'
    if ( intersects.length > 0 ){
	var target = intersects[0].object;
	var mosaic = displaySprites( target.name  );
	var campos = new THREE.Vector3( target.position.x,target.position.y, target.position.z) ;
	console.log("Mosaic :", mosaic);
	if (params.navcam.camera_follow) {
	    console.log("Camera follows");
	    console.log(target.position);
	    	    
	    var mscale = 1;
	    
	    if (mosaic>1) {
		mscale = 2;
	    }

	    camera.position.set( mscale*campos.x, mscale*campos.y, mscale*campos.z );
	    console.log();
	    //console.log(target.position.distanceTo(camera.position));
	    camera.updateProjectionMatrix();
	}
// 	if (params.navcam.model_view) {
// 	    console.log("Model view rendering");

// 	    var myTexture = renderModelView( campos,0,0);
// 	    displayModelView( myTexture);
// 	}
    }
}


function renderModelView(position, lookat, rotation) {

    // inspired by
    // http://stackoverflow.com/questions/21533757/three-js-use-framebuffer-as-texture
    
    var myScene = new THREE.Scene();

    // you may need to modify these parameters
    var renderTargetParams = {
	minFilter:THREE.LinearFilter,
	stencilBuffer:false,
	depthBuffer:false
    };

    var imageWidth = 256;
    var imageHeight = 256;

    // create buffer with the right size.
    
    var myTexture = new THREE.WebGLRenderTarget( imageWidth, imageHeight, renderTargetParams );       

    
    // move the camera into the right position
    // myCamera = new THREE.PerspectiveCamera(5,1,1,10000);
    cameraView.position.set( position );
    //myCamera.lookAt( lookat );
    camnormal = new THREE.Vector3(0,0,1);
    cameraView.rotateOnAxis( camnormal, rotation )
        
    // add the comet
    // myScene.add( mesh );

    var geometry = new THREE.SphereGeometry( 5, 32, 32 );
    var material = new THREE.MeshBasicMaterial( {color: 0xffff00} );
    var sphere = new THREE.Mesh( geometry, material );
    myScene.add( sphere );
    // and render it
    renderer.render( myScene, cameraView, myTexture, true );

    // now myTexture contains the rendered image (which is the blended input textures)
    // console.log(myCamera);
    // console.log(myTexture);
    return( myTexture );

};

function displayModelView( texture){

    // Create a new material for the sprite
    material = new THREE.SpriteMaterial( { map: texture } );

    // remove the old one (if any)
    sceneView.remove( spriteView );

    // create a new one with the fresh texture
    spriteView =  new THREE.Sprite( material );

    // set the position
    var windowwidth = window.innerWidth / 2;    
    var windowheight = window.innerHeight / 2;  

    var width = 256;                              
    var height = 256;                             
    spriteView.position.set( - windowwidth + 3 * width/2+1 , windowheight - height/2, 1 ); 

    sceneView.add( spriteView )
};


function displaySprites( target ){
    //	var basename = JSON.parse( intersects[0].object.name );

    var basename = target.map( function(a){ return(a.OBS_ID)});
    var dir = "images/256/";
    
    // Distinguish between only one image and a mosaic of 4 images
    if (basename.length ==1) {
	// In case of 1 image, load the 256 pixel version
	
	var filename = dir + basename + "_256_f.png";
	
	// console.log("Hit @ " + toString( intersects[0].object.position ) + " " + filename );

	// All the work is done by the callback
	THREE.ImageUtils.crossOrigin = "anonymous";
	THREE.ImageUtils.loadTexture( filename, undefined, createHUDSprites );

	
        
    }
    else {
	// In case of the mosaic, load the smaller versions. Manual work needs to be done to
	// display the sprites.
	
	var filename;
	var map;
	// var material = new Array(4);
	// console.log("Hit @ " + toString( intersects[0].object.position ));
	material = basename.map( function(a){
	     // create the filename
	    filename =  dir + a + "_256_f.png";
	    // load the maps
	    map  = new THREE.ImageUtils.loadTexture( filename );
	    // create the materials
	    return( new THREE.SpriteMaterial( { map: map } ) );
	});
	

	// remove the thumbnails (if they were ever there, fails silently)
	sprites.forEach( function(a){ sceneOrtho.remove( a )});
	

	sceneOrtho.remove( spriteTL );

	sprites = material.map( function(a){ return( new THREE.Sprite(a) ) });
	
		
	// The images need to be arranged as follows
	// Images are referenced with their center point, the window coordinate system
	// has the origin at the center as well
	//
	//  |<-- w -->|
	//  +---------+---------+ -                   -
	//  |         |         | ^                   ^
	//  |   (1)   |   (2)   | |                   |
	//  |    *    |    *    | h                   |
	//  |         |         | |                   |
	//  |         |         | v                   |
	//  +---------+---------+ -                  
	//  |         |         |                     H
	//  |   (0)   |   (3)   |      
	//  |    *    |    *    |                     |
	//  |         |         |                     |
	//  |         |         |                     |
	//  +---------+---------+                     |
	//                                            |
	//                                            v 
	//                                          X -
	//  |<---------------- W ------------------>|
	// 
	
	var windowwidth = window.innerWidth / 2;      // The 'W' from above
	var windowheight = window.innerHeight / 2;    // The 'H' from above

	// Assume the four thumbnails have the same size
	var width = 128;                              // The 'w' from above
	var height = 128;                             // The 'h' from above
	

	sprites[1].position.set( - windowwidth + width/2     , windowheight - height/2, 1 );     // top left
	sprites[2].position.set( - windowwidth + 3 * width/2 , windowheight - height/2, 1 );     // top right
	sprites[0].position.set( - windowwidth + width/2     , windowheight - 3 * height/2, 1 ); // bottom left
	sprites[3].position.set( - windowwidth + 3 * width/2 , windowheight - 3 * height/2, 1 ); // bottom right

	sprites.forEach( function(a){
	    a.scale.set(width,height,1);
	    sceneOrtho.add( a );
	});
	
	// for (ii=0;ii<sprites.length;ii++){
// 	    // set the size of the sprites (all the same)
// 	    sprites[ii].scale.set(width,height,1);
// 	    // add them to the scene
// 	    sceneOrtho.add( sprites[ii] );
// 	}
	
    }

    return (basename.length)
}






function onDocumentMouseMove( event)
{
    if (firsttime){
	var element = document.getElementById("progress");
	element.parentNode.removeChild(element);
	firsttime=false;
    }
}


