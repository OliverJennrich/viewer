/*! \file

  \brief Provides the rendering function

  \fn render
  \brief The rendering function

  This function just renders the scenes. 

  - First, using the main camera (#camera) the main scene (#scene) 
  - Second, using the thumbnail orthographic camera (#cameraOrtho) the thumbnail scene (#sceneOrtho).

 */
function render() {
    // We need to render for both cameras, the normal one pointing to the comet
    // and the 'Ortho' one pointing to the sprites
    

    renderer.render( scene, camera );
    renderer.render( sceneOrtho, cameraOrtho );

}
