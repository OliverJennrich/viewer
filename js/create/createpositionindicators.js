/*!
  \file

  \brief Provides the function to draw the position indicators (aka little red balls)


  \var targetList
  \brief Holds the list of 'click'-targets (i.e. the little red spheres).

  \fn createPositionIndicators( void orbitpos)
  \brief Creates position indicators
  \param orbitpos List of orbit positions. See ... for more detail
  \return Structure with the \a first and \a last index of the `scene.children` array `{ startindex: first , stopindex: last }` 

  The position indicators mark the places in space from where Rosetta
  has taken pictures of the comet.

  To be able to click on those indicators they must have a certain
  size and shape - currently, translucent spheres in he 'ESA
  Science'-colour (RGB 0x951e3a) are used that have a Lambertian surface.

  The diameter of the spheres is set to 0.5 km maximum initially, but
  the size will be later changed so that the spheres do not get too
  dominant when the user is getting closer. See also `update()`.

  Opacity is set to 0.7
  \todo Make all those parameters accessible through the GUI


  The position of the spheres is taken fro the `orbitpos` array which
  is filled with the corresponding FITS data (see... for more detail).

  After a sphere is created it is added to the global scene as a child
  (via `.add()`). As we need to access the spheres and their
  properties (diameter) later, the first and last index in the child
  array are stored in an array which is returned to the calling program.

*/

var targetList = [];

function createPositionIndicators( orbitpos ){
    var spheregeometry = new THREE.SphereGeometry( 0.5, 32, 32 );
    var spherematerial = new THREE.MeshLambertMaterial( {color: 0x951e3a} );
  
    spherematerial.transparent = true;
    spherematerial.emmisive = 0xaa0000;
    spherematerial.opacity = 0.7;

    // orbitpos is read in the fits.json file which has it's own script tag

    // remember the number of children in scene before we start adding the spheres.
    var p = { startindex: scene.children.length , stopindex: 0 }; 
    
    for (ii=0; ii<orbitpos.length; ii++){

	var fits = orbitpos[ii][0];
 	var sphere = new THREE.Mesh( spheregeometry, spherematerial );
 	sphere.position.x = fits["SC-COM_X"][0];
 	sphere.position.y = fits["SC-COM_Y"][0];
 	sphere.position.z = fits["SC-COM_Z"][0];

	// Add the rest of the infortmation to the name of the
	// sphere. This allows to access them later, although it is a
	// bit of an abuse of the 'name' field.
	
	sphere.name = orbitpos[ii];

	// Obtain the visibility flag from the parameters
	sphere.visible = params.navcam.display_positions;

	// Add the sphere to the scene. After that, it is in the
	// (currently) last element of the 'children' array.
 	scene.add( sphere );

 	// Add the sphere to the target list so that it can be clicked.
 	targetList.push(sphere);
    }

    // Remember the start...stop indices in the children array for later use
    p.stopindex = scene.children.length;
    
    // This puts the camera into the position of the first navcam picture
    var firstpos = orbitpos[0][0];
    campos = new THREE.Vector3(firstpos["SC-COM_X"][0], firstpos["SC-COM_Y"][0], firstpos["SC-COM_Z"][0]);
    params.camera_distance = firstpos["TARGDIST"][0];
    
    console.log( firstpos["SC-COM_X"][0], firstpos["SC-COM_Y"][0], firstpos["SC-COM_Z"][0], firstpos["TARGDIST"][0]);
    
    camera.translateOnAxis( campos.normalize(), params.camera_distance);
    camera.rotateOnAxis( campos.normalize(), Math.atan2( firstpos["CD1_1"], firstpos["CD1_2"] ) );
    
    // Switch off the first ball
    scene.children[  posIndicators.startindex ].visible = true;

    // console.log("Spheres are done!");

    return(p);
    

}
