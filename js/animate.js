/*!

  \file
  \brief Provides the animate function.

  \var cometaxis
  \brief The rotation axis of the comet.

  To change the axis of rotation for
  the comet, please have a look at the code and change the value for
  `cometaxis` accordingly.

  The current value is 


       var cometaxis = new THREE.Vector3(0.0103069, -0.00731029, 0.99992);

  

  \fn animate()
  \brief Animation loop 
  This is the main 'loop'. 

  If the global `spin` parameter is set, the comet model is rotated around the cometaxis. 

  Rotation speed is controlled by the global `omega` parameter.

  `animate()` calls  `render()` and `update()`


  
*/

var cometaxis;

function animate() {
    requestAnimationFrame( animate );

    // roatate things

    // rotate around the comet axis
    // var bodyaxis = new THREE.Vector3(0,1,0);
    // var cometaxis = new THREE.Vector3(0.0103069, -0.00731029, 0.99992);
    
    //var axis = new THREE.Vector3(-0.979939, 0.198962, 0.0115555);

    // This is the comet axis of rotation
    
    cometaxis = new THREE.Vector3(0.0103069, -0.00731029, 0.99992);
    if (params.spin){
	// the next line is for a 'constant' rotation
	//	rad = 25* clock.getDelta() *params.omega * Math.PI / 180;
	var rad = -params.omega * Math.PI / 180;

	body.rotateOnAxis(cometaxis ,rad);

    }

     // update everything
    update();
    
    // re-render the scene
    render();

   

  
}
