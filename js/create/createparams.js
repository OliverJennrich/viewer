/*!
  \file

  \brief Provides the function to set the parameters settable by the GUI.


  \var params 
  \brief Structure that contains all the settings that are configurabel via the GUI

  \var region_toggles 
  \brief A string capturing the setting of the different colored regions (ON/OFF).

  The string is created via `JSON.stringify()` on the `params.regions`
  structure. Any change in the settings for the regions will change
  that string so changes can be very easily detected without embarking
  on a long series of `if ... then ... elseif` clauses.

  
  \var navcam_toggles 
  \brief A string capturing the setting of the options for the display of the NavCam pictures. 

  Same logic as for the `region_toggles`. Created via `JSON.stringify()` on the `params.navcam` structure. Allows for quick comparison for changes.


  \fn createParams

  \brief Sets the parameters to their initial values
*/


// Create the parameter structure. This contains everything for controlling the viewer.

var params;
var region_toggles;
var navcam_toggles;

function createParams(){
    
    // Status

    this.update = false;

    // Helpers
    this.display_lighthelper =false;
    this.display_axes = false;
    this.display_bodyaxes = false;

    // Navcam
    this.navcam = { display_positions : true,
		    camera_follow : false,
		    model_view : true } ;

    // Light position
    this.r_light = 200;
    this.theta_light = 90;
    this.phi_light = 0;

    // Ambient light
    this.ambient_volume = 0.65;

    // Camera position
    this.camera_distance = 500;
    
    // Animation
    this.spin = false;
    this.omega = 0.5;
    
    //Regions
    this.DisplayText = true;
 
    this.regions = {
	key: function(n) {
            return this[Object.keys(this)[n]]},
	names: ['Aker', 'Anubis', 'Anuket','Apis', 'Ash', 'Aten',
		'Atum', 'Babi','Bastet', 'Hathor', 'Hapi','Hatmethit',
		'Imothep', 'Khepry', 'Maat', 'Maftet', 'Nut',
		'Serqet', 'Seth'],
	AllRegions : 'None',
	Aker : false,
	Anubis : false,
	Anuket : false,
	Apis : false,
	Ash : false,
	Aten : false,
	Atum : false,
	Babi : false,
	Bastet : false,
	Hathor : false,
	Hapi : false,
	Hatmethit : false,
	Imothep : false,
	Khepry : false,
	Maat : false,
	Maftet: false,
	Nut : false,
	Serqet : false,
	Seth : false		     
    };
    
};
