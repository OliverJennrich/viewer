/*!
  \file 

  \brief Provides the intialisation function

  \var textures
  \brief Holds the textures for the regions

  \var IsiPhoneOS
  \brief Flag to indicate that the client runs iOS.

  \var ambient
  \brief Ambient light. Provides some illumination of the shadows. Controllable through the GUI.

  \var directionalLight
  \brief The directional light (aka 'Sun'). Controllable through the GUI.

  \var camera
  \brief The camera for the main scene. Perspective camera, modeling NavCam.

  \var cameraOrtho
  \brief The camera for the thumbnails. Orthographic camera.

  \var scene
  \brief The main scene, holding the comet and the position indicators

  \var sceneOrtho
  \brief The thumbnail scene.

  \var renderer
  \brief The renderer of the main scene.
  
  \var bodyorigin
  \brief Axes helper aligned with the moments of inertia of the comet

  \var origin
  \brief Axes helper aligned with the world coordinate system

  \var lighthelper
  \brief Directional light helper. Shows the direction of the Sun

  \var mesh
  \brief Holds he comet - model and textures.

  \var body
  \brief A group that holds the #mesh (i.e. the comet) with the body-axes helper (visible or not).

  \var posIndicators
  \brief Holds the first and last index of the entries the `.children` array of the main scene (#scene) that contain the spheres. 

  Needed later to facilitate the changing of the spheres' properties. 

  \var navcamThumbnails
  \brief Holds the thumbnails for the NavCam pictures. 

  \fn init
  \brief Initialisation function

  This function handles all the setting up of the scenes, cameras, and GUI.
  After this function has been executed, the  programm is fully initialized.

  It initialises, in order
  
  - the statistics window (the little window in the lower left)
  - the callback functions for the file loader. See also the warnings in `createMaterial()`, `createUniforms()` and `createTextures()`
  - the global parameters controllable through the GUi (see also `createParams()` and `createGUI()`)
  - the textures for the regions (see also `createTextures()` and #textures)
  - the cameras
     - the main camera for the scene including the comet (#camera)
     - the orthographic camera for the thumbnail scene (#cameraOrtho)
  - the scenes
     - the main scene (#scene)
     - the thumbnail scene (#sceneOrtho)
  - the position indicators (see also `createPositionIndicators()`)
  - the renderer for the main scene (#renderer)
  - the controls (which affect the camera position)
  - the light
    - the ambient light (#ambient)
    - the directional light (aka 'Sun') (#directionalLight)
  - the helpers
     - for the axes (#origin)
     - for the axes of inertia (#bodyorigin)
     - for the directional light (#lighthelper)
  - event handlers
     - for resizing the window
     - for loading the window. This loads the gui (see also `createGUI()`)
     - for mouse clicks (see also `onDocumentMouseDown()`)
  
*/

var IsiPhoneOS;
var textures;

var directionalLight;
var ambient;

var camera;
var cameraOrtho;

var scene;
var sceneOrtho;

var renderer;

var origin;
var bodyorigin;
var lighthelper;

var mesh;
var body;

var posIndicators = {startindex:0, stopindex:0};

var navcamThumbnails;


function init() {

     renderer = Detector.webgl? new THREE.WebGLRenderer({ antialiasing: true }): new THREE.CanvasRenderer();
    /*
      Check if the code is running on an iOS. This is required later
      for selecting the right shader.  iHardware allows a smaller
      number of parallel textures in the OpenGL shader than 'normal'
      graphics cards.

      This is of course a crude hak, ideally we would like to read out
      the maximum number of parallel textures and use the right shader
      for it. Don't know ho wto to that yet, so this remains clunky.
    */

    var IsiPhone = navigator.userAgent.indexOf("iPhone") != -1 ;
    var IsiPod = navigator.userAgent.indexOf("iPod") != -1 ;
    var IsiPad = navigator.userAgent.indexOf("iPad") != -1 ;

    IsiPhoneOS = IsiPhone || IsiPad || IsiPod ;

    // be chatty...
    console.log("iOS "+IsiPhoneOS);
    
    // Get the document element called 'container'. This is where all the content goes
    var container = document.getElementById( 'container' );


   
    // Create the 'FPS' window
    // Upgrade potential: Make this dependend on some flag in the GUI
    stats = new Stats();
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.bottom = '0px';
    container.appendChild( stats.domElement );

    /*
      Callback functions for the loader. 

      .onProgress is called every time a new file is loaded
      .onLoad is called when all the files have been loaded

      As the loadingof files is asynchronous, callback functions are
      the best way to ensure that the data is available for creating
      the surface material of the comet.

      Some logging is done to quell the paranoia of the programmer.

     */
    THREE.DefaultLoadingManager.onProgress = function ( item, loaded, total ) {

	if (loaded==total) {
	    console.log( "DefaultLoadingManager: "+item+" " + loaded +'/'+ total );
	    console.log("Done!");
	    time0= Date.now()
	}
	else {
	    console.log( "DefaultLoadingManager: "+item+" " + loaded +'/'+ total );
	}
	
    };

    THREE.DefaultLoadingManager.onLoad = function ( item, loaded, total ) {

	mesh.material = createMaterial( createUniforms() );
	render();
	
    };
	
    
    /* Create the global control parameters via createParam()

       In addition, store the initial settings of the region toggles
       and the navigation toggles so that we can check if they have
       changed befor needlessly engaging in a recalculation of the
       scene.

       */
    params = new createParams();
    region_toggles = JSON.stringify( params.regions );
    navcam_toggles = JSON.stringify( params.navcam );

    /* Create the textures for the comet surface via createTextures() */
    textures = new createTextures('texture/Small/texture_', '_Text');


    
    /* Create the main camera
       

       Use the height and the width of the currenrt window to define
       the aspect ratio (fall back on '2' for both of them, just to be
       safe).

       The FoV of the NavCam is 5 Degree, the near and far frustrums
       are 1 and 100000 which just means 'very close' and 'very far
       away'.

     */
    
    var width = window.innerWidth || 2;
    var height = window.innerHeight || 2;
    var FoV = 5.0;
    
    camera = new THREE.PerspectiveCamera(FoV, width / height, 1, 100000);

    /* To display the thumbnails we use sprites. The camera for those
      is an orthographic camera as the sprite is flat anyway - no
      perspective needed.
       
      The dimensions are the same (!) as for the camera that covers
      the whole scene, we just place the sprites nto the upper left
      corner later. As we are dealing with flat objects anyway, the
      'far frustrum' can be relatively small.
     
      The position is fixed at a height of z=10.
    */

    cameraOrtho = new THREE.OrthographicCamera( - width / 2, width / 2, height / 2, - height / 2, 1, 10 );
    cameraOrtho.position.z = 10;

    /* The full scene that will contain the comet and the position indicators */
    scene = new THREE.Scene();

    /* The scene for the thumbnails */
    sceneOrtho = new THREE.Scene();

    /* Create the position indicators. All the work is done inside. */
    posIndicators = createPositionIndicators( orbitpos );
    console.log(posIndicators);
    
       
    /* Set the size of the renderer and delete the 'autoClear'
      attribute. Otherwise the thumbnails get wiped out immediately
      when the user moves the main camera */
 
    renderer.setSize(width, height );
    renderer.autoClear = false;

    /* Add the renderer to the container (so that it is displayed in the text element called 'container'. See above */
    
    container.appendChild( renderer.domElement );

    /* Set the controls for the camera. Not quite clear which one s better. I tend to like OrbitControls better than Trackball controls.

       Add the render function (defined below) as a callback to the 'change' event, so that the scene is re-rendered whe the camera is moved.


       Upgrade potential: Make that configurable 

    */
    
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    //controls = new THREE.TrackballControls(camera);
    controls.userPanSpeed = 25.0;
    controls.addEventListener( 'change', render );

    
    /* Switch on the lights. Make it grey and get the values from the global parameters 

       Don't forget to add them to the scene, otherwise they are not rendered!
     */
    
    ambient = new THREE.AmbientLight();
    scene.add(ambient);

    /* Switch on the Sun!

       The above ambient light allows to see the parts of the coments
       which are in the shadow. To add some relaistic sunlight, use
       directional lights. Calculate the position from the global
       parameters.

       r_light is the distance of the light. This is important - if
       the light happens to be *inside* the coment, things become very
       much darker :)

    */
    
    directionalLight = new THREE.DirectionalLight(0xffffff);
    scene.add(directionalLight);

    
    /* 
       Create the 'axis helper' to indicate the position of th
       eorigin and the direction of the axes. XYZ correspond to RGB

     */
    origin = new THREE.AxisHelper(50);
    scene.add(origin);


    /* Create a helper for the directional light.
       
       This indicates the direction and the position of the Sun, so to speak. 
    */
    
    lighthelper = new THREE.DirectionalLightHelper( directionalLight, 10);
    scene.add( lighthelper);

    /* Create the rest of the scene, ie. add the comet */
    createScene();
    

    /* record the start time */
    time0= Date.now();
    
 
    
    /* resize handling */
    window.addEventListener('resize', onWindowResize, false);
    
    /* create the GUI upon the load of the window */
    window.onload = createGUI();

  
    /*  intialise the clock */
    clock = new THREE.Clock( true );

    /*  initialize object to perform world/screen calculations. 

	We need that later for the clickable position indicators

    */
    
    /* when the mouse is clicked, call the given function.

     It is here where the handling of the clickable position indicators takes place

    */
    document.addEventListener( 'mousedown', onDocumentMouseDown, false );

}
