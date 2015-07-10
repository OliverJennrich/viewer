/*! \file
  \brief Provides the function to create the Navcam thumbnails

  \fn createHUDSprites( void texture ) 

  \brief Creates the NavCam thumbnails and adds them to the thumbnail scene #sceneOrtho.
  \param texture 
  Contains the thumbnails  loaded from file via a `laodTexture`.

  The name of the function is due to the fact that the thumbnails are
  realised as sprites, i.e. 2D entities that are always seen face on,
  no matter where the camera is. The 'HUD' stands for 'heads-up
  display'. Imagine flying a fighter jet through the scene and having
  the thumbnails displayed to your windscreen. Yes, THREE.js is very
  much a gamer thing.

  The function takes the texture, creates a material, forms a sprite
  via `THREE.Sprite()` and adds it to the thumbnail scene #sceneOrtho.

In case that an array of textures is passed to the function, it does
essentially the same, just for each of the textures.

  Subsequently `updateHUDSprites()` is called which puts the thumbnail(s)
  into the upper left corner. Easier to maintain this way - if we ever
  get around to make the thumbnailposition configurable, only
  `updateHUDSprites()` needs to be changed.

  The function is called through a callback whenever a position
  indicator (see `createPositionIndicators()`) is clicked.

*/
function createHUDSprites ( texture ) {

    if (navcamThumbnails) {// this is needed as the thumbnails might not exist first time around...
	if ( navcamThumbnails.length) // if navcamthumbnails is an array, use foreach
	{
	    // remove previous sprites
	    navcamThumbnails.forEach( function(a){ sceneOrtho.remove( a )});
	}
	else
	{
	    // removing any old thumbnails. If none are present, it fails silently
	    sceneOrtho.remove( navcamThumbnails );

	}
    }
    
    if ( texture.length ) // if texture is an array, prepare for the mosaic
    {
	// create an array of sprite materials
	
	material = texture.map( function(a) {   return( new THREE.SpriteMaterial( { map: a } ) ) });



	// create new thumbnails
	navcamThumbnails = material.map( function(a){ return( new THREE.Sprite(a) ) });

	// add them to the thumbnail scene

	navcamThumbnails.forEach( function(a){
	    a.scale.set(128,128,1);
	    sceneOrtho.add( a );
	});
	
    }
    else // single image
    {  
	var material = new THREE.SpriteMaterial( { map: texture } );

	var width = material.map.image.width;
	var height = material.map.image.height;

	// create new sprite
	navcamThumbnails = new THREE.Sprite( material );

	// set it to the right size and put it to the front
	navcamThumbnails.scale.set( width, height, 1 );

	// add it to the thumbnail scene
	sceneOrtho.add( navcamThumbnails );


    }

    // now call updateHUDSprites with the navcamThumbnails
    updateHUDSprites( navcamThumbnails );
};
