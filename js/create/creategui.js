/*!
  \file

  \brief Provides the function that produces the GUI.

  \fn createGUI
  \brief Creates the GUI

  First creates the GUI menu structure through a call to `dat.GUI()`,
  then adds the different folders and sub-entries to the menu.

  The GUI is based on the dat.gui library that can be found
  [here](http://workshop.chromeexperiments.com/) with a tutorial on
  how to use it
  [here](http://workshop.chromeexperiments.com/examples/gui/#1--Basic-Usage)

  The GUI allows to set some of the controlling parameters of the viewer, such as

  - display of the helpers
  - the position and quality of the light
  - the display of the NavCam pictures
  - the parameters of the animation
  - the colouring of the different regions


  It is *recommended* that new families of parameters are put into a
  folder and that they are stored in sub-structures of the param
  structure.

 
*/



function createGUI() {

    var gui = new dat.GUI();

    var fHelper = gui.addFolder('Display Helpers');
    fHelper.add(params, 'display_lighthelper').name( 'Light helper' );
    fHelper.add(params, 'display_axes').name( 'Axes' );
    fHelper.add(params, 'display_bodyaxes').name( 'Principal body axes' );
    
    var f1 = gui.addFolder('Light Position');

    f1.add(params, 'r_light', 50, 500).name('Distance');
    f1.add(params,'theta_light', 0, 180).name('Theta');
    f1.add(params,'phi_light', 0, 360).name('Phi');
    f1.add(params,'ambient_volume', 0, 1).name('Ambient Light');
    
    // f1.open();

    var f2 = gui.addFolder('Navcam pictures');
    f2.add(params.navcam, 'display_positions').name( 'Navcam pictures' );
    f2.add(params.navcam, 'camera_follow').name( 'Follow position' );
    //f2.add(params.navcam, 'model_view').name( 'Model view');

    
   //  var fCamera = gui.addFolder('Camera');
//     fCamera.add( params, 'camera_distance').name( 'Camera distance (km)' ).listen();
//     fCamera.open();

    var fAnimation = gui.addFolder('Animation');
    fAnimation.add(params,'spin').name('Spin');
    fAnimation.add(params,'omega',0 ,1).name('Rotation speed');
    // fAnimation.open();
    
    var fRegions = gui.addFolder('Regions');
    fRegions.add(params.regions,'AllRegions', ['None', 'All', 'Some']).name('Display Regions').listen();

    var fRegionsSub = fRegions.addFolder('Regions (detail)');

    fRegionsSub.add(params.regions, 'Aker').listen();
    fRegionsSub.add(params.regions, 'Anubis').listen();
    fRegionsSub.add(params.regions, 'Anuket').listen();
    fRegionsSub.add(params.regions, 'Apis').listen();
    fRegionsSub.add(params.regions, 'Ash').listen();
    fRegionsSub.add(params.regions, 'Aten').listen();
    fRegionsSub.add(params.regions, 'Atum').listen();
    fRegionsSub.add(params.regions, 'Babi').listen();
    fRegionsSub.add(params.regions, 'Bastet').listen();
    fRegionsSub.add(params.regions, 'Hapi').listen();
    fRegionsSub.add(params.regions, 'Hathor').listen();
    fRegionsSub.add(params.regions, 'Hatmethit').listen();
    fRegionsSub.add(params.regions, 'Imothep').listen();
    fRegionsSub.add(params.regions, 'Khepry').listen();
    fRegionsSub.add(params.regions, 'Maat').listen();
    fRegionsSub.add(params.regions, 'Maftet').listen();
    fRegionsSub.add(params.regions, 'Nut').listen();
    fRegionsSub.add(params.regions, 'Serqet').listen();
    fRegionsSub.add(params.regions, 'Seth').listen();

    fRegions.open();	
  
};

