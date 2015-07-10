/*!
  \file 

  \brief Provides the function that updates the NavCam thumbnails

  \fn  updateHUDSprites( void t )
  \brief Displays the NavCam thumbnails.
  \param t
  Either a single thumbnail sprite or an array of thumbnail sprites. In the latter case, the length is assumed to be 4
  
  The name of the function is due to the fact that the thumbnails are
  realised as sprites, i.e. 2D entities that are always seen face on,
  no matter where the camera is. The 'HUD' stands for 'heads-up
  display'. Imagine flying a fighter jet through the scene and having
  the thumbnails displayed to your windscreen. Yes, THREE.js is very
  much a gamer thing.
  
  This function displays the thumbnail sprites that are passed in \a t.

  If \a t is a single sprite and not an object, it will be displayed
  as-is in the top-left corner of the screen.

  If \a t is an array of sprites, thn it is assumed that it is a
  sequence of four images that have to be displayed in a
  mosaic.

  
*/

function updateHUDSprites( t ) {

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

    var width = 128;
    var height =128;

    if (t.length) // t is an array, so do the mosaic
    {
	t[1].position.set( - windowwidth + width/2     , windowheight - height/2, 1 );     // top left
	t[2].position.set( - windowwidth + 3 * width/2 , windowheight - height/2, 1 );     // top right
	t[0].position.set( - windowwidth + width/2     , windowheight - 3 * height/2, 1 ); // bottom left
	t[3].position.set( - windowwidth + 3 * width/2 , windowheight - 3 * height/2, 1 ); // bottom right

    }
    else // single thumbnail
    {
	var material = t.material;

	var imageWidth = material.map.image.width / 2;
	var imageHeight = material.map.image.height / 2;

	t.position.set( - windowwidth + imageWidth,   windowheight - imageHeight, 1 ); // top left
    }

};
