/*!

  \file

  \brief Provides the function to create the scene with the comet


  \var scaleFactorComet
  \brief Conversion from model unit to viewer units
  
  The model has units roughly equivalent to a meter, whereas the viewer uses kilometres

  \fn  createScene
  \brief Creates the scene with the comet 

  This function brings together the model and the surface material
  generated by `createMaterial()`. The model is stored as a JSON
  object in the global variable `comet`. For to make use of that, it
  needs to be converted into a form that can be used by THREE.js. To do
  so, `THREE.JSONLoader()` is employed that has a method `.parse`
  that creates the model from a JSON object already in memory (instead
  of reading in a file from disk).

  The uniforms (the textures of the regions) are created and combined
  into a new surface material by `createMaterial()`. A new mesh is
  then formed from the model geometry (i.e. the wireframe of the
  comet) and the material with a call to `THREE.Mesh()`. A subsequent
  scaling converts the original model scale (meter) into the scale
  used by the viewer (km).

  To help visualising the inertial moments of the comet, an axis
  helper is created (visibility contigent on the setting of the
  respective parameter) and rotated into a position such that the three
  axes are aligned with the main moments of inertia.

  For how to obtain the moments of inertia and the required rotation
  from the model, see ...

  The axis helper and the mesh are then combined into a group so that
  they can be manipulated jointly, which makes animating much easier
  and then added to the scene.

  

*/



//var scaleFactor = 1; /*!< Conversion from pysical dimensions to screen units: 20 units per kilometre */

var scaleFactorComet = 0.001;  ///< 1000 units per kilometre

function createScene( ) {

    var rotObjectMatrix;
    function rotateAroundObjectAxis(object, axis, radians) {
	rotObjectMatrix = new THREE.Matrix4();
	rotObjectMatrix.makeRotationAxis(axis.normalize(), radians);

  
	object.matrix.multiply(rotObjectMatrix);
	object.rotation.setFromRotationMatrix(object.matrix);
    }



    // create the loader
    loader = new THREE.JSONLoader();

    // use the parser to convert JSON into a useable model
    var model= loader.parse( comet );

    // be chatty
    console.log( "\tvertices: " + model.geometry.vertices.length );
    console.log( "\tfaces: " + model.geometry.faces.length );

    // create the Uniforms
    var uniforms = createUniforms();

    // combine the uniforms into a material
    var material_shh = new createMaterial(uniforms);

    // and combine the model with the uniforms into a mesh
    mesh = new THREE.Mesh( model.geometry, material_shh );

    // chatty again
    console.log("Mesh created");

    //scale up (or down as in this case)
    mesh.scale.set(scaleFactorComet,scaleFactorComet,scaleFactorComet);


    // Add the coordinate system for the body-axes    
    bodyorigin = new THREE.AxisHelper(20);
    bodyorigin.display = params.display_bodyaxes;
    
    // rotate the body-fixed coordinate-system into the position of the
    // inertial moments

    // This is not thr rotation axis of the body, but the axis around
    // which the 'canonic' body-fixed coordinate system has to be
    // rotated so that the new coordiante system is aligned with the
    // system defined by the axes of inertia.

   
    axis = new THREE.Vector3(0.00962532, 0.00264994, 0.99995);    
    rotateAroundObjectAxis(bodyorigin, axis,  78.5241 * Math.PI / 180);


    // create a group for the two objects
    body = new THREE.Group();
    body.add(bodyorigin);
    body.add(mesh); 

    // add the group to the scene
    scene.add(body);
}
