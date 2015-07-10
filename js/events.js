
/*! \file

Collects all the functions that deal with events such as MouseDown or WindowResize


\fn onWindowResize
\brief Is called whenever the window resizes.

Needs to recaluclate 

 - the aspect ratio of the main camera 
 - the field of view of the orthographic camera for the thumbnails
 - redraw the sprites (?)
 - reste the size of the renderer

 \fn onDocumentKeyPress( void event)
  \brief Is called when a key is pressed
  \param event A structure containing the parameters of the event

  Currently unused except for debugging reasons

  

\fn onDocumentMouseDown( void event)
  \brief Is called whenever the mouse button is clicked
  \param event  A structure containing the parameters of the event

  It does most of the work for the evaluation of which of the position indicators has been clicked. 

  \fn displayModelView
  \brief currently unused. For future functionality
  \param texture A structure containing the texture to be displayed

  Usused
  
 \fn renderModelView(void position, void lookat, void rotation)
  \brief currently unused. For future functionality
  \param position A THREE.Vector3
  \param lookat A THREE.Vector3
  \param rotation A number representing an angle

  Unused

  \fn displaySprites( void target )
  \brief Displays the sprites
  \param target A structure containing the object that has been clicked



 \fn onDocumentMouseMove( void event)
 \brief Called whenever the mouse moves
 \param event A structure containing the parameters of the event
  
  Currently not in use.
*/
function onWindowResize()
{
    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;
   
    
    var width = window.innerWidth||2;
    var height = window.innerHeight||2;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    
    
    cameraOrtho.left = - width / 2;
    cameraOrtho.right = width / 2;
    cameraOrtho.top = height / 2;
    cameraOrtho.bottom = - height / 2;
    cameraOrtho.updateProjectionMatrix();

    updateHUDSprites();

    renderer.setSize(width,height);
    
}


function onDocumentKeyPress( event )
{
    var keyCode = event.which;

    // A
    if ( keyCode == 65 ) {
	console.log( event )
    };
}


function onDocumentMouseDown( event ) 
{
    // the following line would stop any other event handler from firing
    // (such as the mouse's TrackballControls)
    // event.preventDefault();

    projector = new THREE.Projector();
    
    function toString(v) { return "[ " + v.x + ", " + v.y + ", " + v.z + " ]"; }
    

    // we can exit immediately if the position indicators are not displayed
    if (! params.navcam.display_positions) return;

    // console.log("Click!");
    
    // update the mouse variable
    var mouse = { x: 0, y: 0 }; 
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
	var angle = Math.atan2( target.name.CD1_1, target.name.CD2_1);
	console.log("Mosaic :", mosaic);
	if (params.navcam.camera_follow) {
	    console.log("Camera follows");
	    console.log(target.position);
	    	    
	    var mscale = 1;
	    
	    if (mosaic>1) {
		mscale = 2;
	    }

	    camera.position.set( mscale*campos.x, mscale*campos.y, mscale*campos.z );
	    camera.rotationOnAxis( campos.normalize(), angle);
	    console.log(angle);
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

	
	thumbtexture = basename.map( function(a){
	     // create the filename
	    filename =  dir + a + "_256_f.png";
	    // load the maps
	    map  = new THREE.ImageUtils.loadTexture( filename );
	    // create the materials
	    return( map );
	});

	// call createHUDSprites with an array of textures
	createHUDSprites( thumbtexture );

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


