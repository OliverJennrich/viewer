/*!

\file
\brief rovides the textures for the coloured regions.

\fn createUniforms
\brief Creates a structure that contains the textures for the different regions
\return A structure with the textures.

'Uniforms' are things that dress up existing textures. We use them
here to colour the different named regions on 67P depending on the
state of the respective flags.

There are 20 regions currently identified on 67P, the structure
created has fields named \a t0 to \a t19. Each field will get assign
either a colored texture or a blank (i.e. black) texture.

These textures will then be combined (by adding the RGB values) to the
underlying texture of the comet. This will be done by the *shaders*.

The function is called once during initialisation and in the update
function so that the uniforms are changed whenever the state of the
region flags changes.

\warning The function requires the presence of a structure `textures`
with the proper content. As the content is read from file, which is an
asynchronous process, the function is best callled for the first time
in the `.onLoad` callback of the texture loader. See also the
documentation to `init()`


*/
// This creates the Uniforms that we need for the shader.
// Function is used twice, once during initialisation  [init()]
// and once in the animate [animate()] hook whenever the texture has to be changed
function createUniforms(){
    var uniforms = {

	t0: { type: "t", value: textures.tBackground },
	t1: { type: "t", value: params.regions.Aker       ? textures.tAker      : textures.tBlank } ,
	t2: { type: "t", value: params.regions.Anubis     ? textures.tAnubis    : textures.tBlank } ,
	t3: { type: "t", value: params.regions.Anuket     ? textures.tAnuket    : textures.tBlank } ,
	t4: { type: "t", value: params.regions.Apis       ? textures.tApis      : textures.tBlank } ,
	t5: { type: "t", value: params.regions.Ash        ? textures.tAsh       : textures.tBlank } ,
	t6: { type: "t", value: params.regions.Aten       ? textures.tAten      : textures.tBlank } ,
	t7: { type: "t", value: params.regions.Atum       ? textures.tAtum      : textures.tBlank } ,
	t8: { type: "t", value: params.regions.Babi       ? textures.tBabi      : textures.tBlank } ,
	t9: { type: "t", value: params.regions.Bastet     ? textures.tBastet    : textures.tBlank } ,
	t10: { type: "t", value: params.regions.Hapi      ? textures.tHapi      : textures.tBlank } ,
	t11: { type: "t", value: params.regions.Hathor    ? textures.tHathor    : textures.tBlank } ,
	t12: { type: "t", value: params.regions.Hatmethit ? textures.tHatmethit : textures.tBlank } ,
	t13: { type: "t", value: params.regions.Imothep   ? textures.tImothep   : textures.tBlank } ,
	t14: { type: "t", value: params.regions.Khepry    ? textures.tKhepry    : textures.tBlank } ,
	t15: { type: "t", value: params.regions.Maat      ? textures.tMaat      : textures.tBlank } ,
	t16: { type: "t", value: params.regions.Maftet    ? textures.tMaftet    : textures.tBlank } ,
	t17: { type: "t", value: params.regions.Nut       ? textures.tNut       : textures.tBlank } ,
	t18: { type: "t", value: params.regions.Serqet    ? textures.tSerqet    : textures.tBlank } ,
	t19: { type: "t", value: params.regions.Seth      ? textures.tSeth      : textures.tBlank }

    };

    return(uniforms);

}
