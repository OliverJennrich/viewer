/*! \file

\brief Contains the function that provides the surface material for the comet

\fn  createMaterial( void u )
\brief Creates the surface material for the comet
\param u Uniforms created with `createUniforms()`


This function provides the texture for the comet. 

Starting from the general background texture, it adds the texture for
the different regions (the 'uniforms'). As there is no simple way of
blending two textures together, a process called 'rendering to
texture' is used to blend a number of textures together.

In this process, a number of textures are taken, combined through
 <i>shaders</i> (small programs written in OpenGL) that arithmetically
combine the RGB values of individual pixels and the resulting texture
is then put onto a plane geometry (similar to painting a picture on a
sheet of paper). The plane geometry is viewed by an orthographic
camera (no perspective is needed, the plane geometry is purely 2D) and
the resulting scene is rendered not onto the screen but into a memory
buffer. The resulting image, which now resides in memory, is then
returned as a texture - similar to taken a picture with a camera of a
painting in a museum and printing it to a piece of cloth that can then
be used to wrap, e.g. a present.

All this is done in the sub-function 'rendertoTexture' which is
heavily inspired by an
[answer](http://stackoverflow.com/questions/21533757/three-js-use-framebuffer-as-texture)
to a similar question posted to stackoverflow.

As an additional complication, the OpenGL code depends strongly on the
architecture of the client. Modern graphics cards in normal computers
can process 16 or 32 different textures in their shadrs, iOS hardware
can deal with a maximum of 8 so that blending 21 different textures
(the oroginal background and the textures for the 20 identified
regions on 67P) requires different number of calls to the function.

The creation of the material proper is then relatively simple -
depending on the architecture which is determined by the
`IsiPhoneOS`-flag the `rebndertoTexture` function is called twice or
three times with the appropriate number of textures (the 'uniforms'
again) and the resulting texture is made into a material by a call to
`THREE.MeshLambertMaterial`. The material is then returned to the
calling program where it can be used to dress up the comet.

\warning
The function relies on the existence of the
uniforms. Those are created from textures that are loaded from
files. As this is an asynchonous process, the best way to ensure
that the uniforms are available is to issue the first call to
`createMaterial()` in the `.onLoad`-callback function of the texture
loader. See the documentation to the `init()` function.



*/
// This creates the material for the mesh. It is in here where the blending of the various
// color-patches is initiated. The 'real' work is done by rendertoTexture

function createMaterial( u ){

    function rendertoTexture( tex1, tex2, tex3, tex4, tex5, tex6, tex7, tex8, tex9, tex10,tex11 ){

	// inspired by
	// http://stackoverflow.com/questions/21533757/three-js-use-framebuffer-as-texture
	
	var myScene = new THREE.Scene();

	// you may need to modify these parameters
	var renderTargetParams = {
	    minFilter:THREE.LinearFilter,
	    stencilBuffer:false,
	    depthBuffer:false
	};

	var imageWidth = 1024;
	var imageHeight = 1024;

	// create buffer with the right size.
	
	var myTexture = new THREE.WebGLRenderTarget( imageWidth, imageHeight, renderTargetParams );       

	// custom RTT materials
	var myUniforms = {
	    t0: { type: "t", value: tex1 },
	    t1: { type: "t", value: tex2 },
	    t2: { type: "t", value: tex3 },
	    t3: { type: "t", value: tex4 },
	    t4: { type: "t", value: tex5 },
	    t5: { type: "t", value: tex6 },
	    t6: { type: "t", value: tex7 },
	    t7: { type: "t", value: tex8 },
	    t8: { type: "t", value: tex9 },
	    t9: { type: "t", value: tex10 },
	    t10: { type: "t", value: tex11 }
	    
	};

	// set up the shade materials
	if (IsiPhoneOS) {
	    myTextureMat = new THREE.ShaderMaterial({
		uniforms: myUniforms,
		vertexShader: document.getElementById('vertex_shader').innerHTML,
		fragmentShader: document.getElementById('fragment_shader8').innerHTML
	    });
	}
	else {
	    myTextureMat = new THREE.ShaderMaterial({
		uniforms: myUniforms,
		vertexShader: document.getElementById('vertex_shader').innerHTML,
		fragmentShader: document.getElementById('fragment_shader').innerHTML
	    });
	}

	// Setup render-to-texture scene
	myCamera = new THREE.OrthographicCamera( imageWidth / - 2, imageWidth / 2, imageHeight / 2, imageHeight / - 2, -10000, 10000 );

	// Set up a plane target
	var myTextureGeo = new THREE.PlaneBufferGeometry( imageWidth, imageHeight );
	myTextureMesh = new THREE.Mesh( myTextureGeo, myTextureMat );
	myTextureMesh.position.z = -100;
	myScene.add( myTextureMesh );

	// and render it
	renderer.render( myScene, myCamera, myTexture, true );

	// now myTexture contains the rendered image (which is the blended input textures)
	return( myTexture );

    };


    // As the GL-code only accepts a maximum of 16 inouts, we split the textures into to batches of 10 and 9 (+1 blank)
    // and create a new texture for it
    // This call can be somewhat time-consuming!
    
    //    var t0 = performance.now();
    var tex;
    
    if (IsiPhoneOS) {
	tex = rendertoTexture( u.t0.value, u.t1.value, u.t2.value, u.t3.value,  u.t4.value,  u.t5.value, u.t6.value, u.t7.value  );
	tex = rendertoTexture(tex, u.t8.value,  u.t9.value,  u.t10.value, u.t11.value, u.t12.value, u.t13.value,  u.t14.value );
	tex = rendertoTexture(tex, u.t15.value, u.t16.value, u.t17.value, u.t18.value,  u.t19.value,  textures.tBlank ,textures.tBlank );
    }
    else {
	tex = rendertoTexture( u.t0.value, u.t1.value, u.t2.value, u.t3.value,  u.t4.value,  u.t5.value, u.t6.value, u.t7.value, u.t8.value,  u.t9.value,  u.t10.value  );
	tex = rendertoTexture(tex, u.t11.value, u.t12.value, u.t13.value,  u.t14.value,  u.t15.value, u.t16.value, u.t17.value, u.t18.value,  u.t19.value,  textures.tBlank );
    }
    //     var t1 = performance.now();
    //    console.log("Call to rendertoTexture took " + (t1 - t0) + " milliseconds.")
    
    
    var material = new THREE.MeshLambertMaterial( { map: tex } );
    material.side = THREE.DoubleSide;

    return( material);
}
