/*!
  \file

  \brief Provides the function to update the state of the viewer

  \fn update
  \brief Updates the viewer's state

  This function is called by the `animate()` function as part of the event loop. It updates in order
  
  - the controls (and with that the camera)
  - the statistics (the little window in the lower left corner)
  - the light
     - the position of the directional light (#ambient)
     - the brightness of the ambient light (#directionalLight)
     - the visibility of the light helper
  - the visibility 
     - of the axes
     - of the axes of the movement of inertia 
  - the colouring of the regions (#textures, see also `createMaterial()` and `creataUniforms()`)
  - the size of the position indicators depending on the distance to the camera (see also `createPositionIndicators()`)
  - visiblity of the position indicators


*/
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
	    sceneOrtho.remove( navcamThumbnails );
	    for (ii=0;ii<sprites.length;ii++){
		sceneOrtho.remove( sprites[ii] );
	    }
	}
    }

    // switch off the loading status after 3 seconds
    /* Old stuff, remove 
	if (Date.now()-time0 > 1000 && firsttime) {
	    firsttime = false;
	    // Clear the element
	    var element = document.getElementById("progress");
	    element.parentNode.removeChild(element);
	    //loadtext.innerHTML='  ';
	}
*/
	navcam_toggles = JSON.stringify(params.navcam);
    

  
}
