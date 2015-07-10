/*!

  \file
  \brief This file contains the content of the main page. 


  The file does not contain any code. It only serves documentation purposes.

  \mainpage
  
  <p style="text-align:right">
    <i>"Wouldn't it be nice if we could do something like that..."</i><br>
    <i>Some late Friday afternoon.</i>
    <p>

 

  ## Introduction
  This is the documentation for the 67P/Churyumov–Gerasimenko viewer codebase.

  ## Code overview

  The main code fo the viewer is written in javascript, making use of
  the [THREE.js](http://threejs.org/) library to display a 3D model of
  the comet.

  Some features of the code are
  - Simple user interface to move the point of view
  - ability to highlight the different regions on 67P
  - ability to visualize the NavCam pictures taken by Rosetta
  - controlling the light 

  THREE.js imposes an event-driven programming style, with an
  initialisation of all the required data structures first followed by
  a simple animation loop that renders the scene and updates the
  status of the scene according to the actions of the user.

  
  ## Program flow

  The two main parts of the programme consist of the *initialisation*
  (see `init()`) and the *animation (see `animate()`). During the
  initialisation phase, all the required data is loaded, such as
  theocrat model, the textures and the information regarding the
  NavCam images. Also, the groundwork that allows THREE.js to display
  the scene is laid.

The animation part consists of an implicit loop in which the
user-triggered events are continuously monitored, updating the scene as
required and rendering it.

  For a more detailed documentation of the code please visit the
  section on the `init()` function and proceed from there.
 

  ## Models

  For detailed information about how to obtain the model for comet
  67P/Churyumov–Gerasimenko see the section on the model (model.js).

  ## Textures

  For detailed information on the textures used for the comet surface,
  please see the section on the textures (texture.js).

  ## Images

  For detailed information on how to obtain and how to process the
  NavCam images to be suitable for the viewer, please see the section
  on the images (images.js)

  ## Metadata

  To be written. The requires the MMA script. Perl instead???


*/
