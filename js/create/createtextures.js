
/*! 
  \file

  \brief Provides the function that reads the textures for the regions form disk

  \fn createTextures( void d, void e )

  \brief Reads the textures for the regions from disks and provides
  the `textures` structure with the individual textures in the fields.
  
  \param d The directory in which the textures reside.
  
  \param e The name extension of the textures.

  \return texture

  The function reads the textures for the regions from disk and fills
  the `texture` structure with the respective textures, including the
  general background structure and a 'blank' structure that will be
  used whenever a give region is not requested to be coloured.

  The texture files are taken form the directory specified in \a d and
  the filename will be extened by the extension \a e if required.

  \warning The function uses `THREE.ImageUtils.loadTexture()` to read
  the texture files for the regions. This is asynchronous, so while
  the return structure will be filled *eventually*, it cannot be
  assumed that it is present at the time of the return to the calling
  program. Use the `onLoad` callback of the texture loader to call any
  functions that require the textures to be present. See also the
  `init()` documentation.

*/

function createTextures( d, e ){

    function loadTexture( t ){
	var value;

	
	//	value = THREE.ImageUtils.loadTexture( texturePath, null, function onload(){ console.log("Texture loaded")} );
	value = THREE.ImageUtils.loadTexture( t );
	
	return( value );
    }

    function fileNamefromName( name, text ){
	var ext;
	var filename;

	if (text) {
	    ext = e+'_s.png';
	}
	else {
	    ext = '_s.png';
	};

	filename =d+name+ext;

	console.log(filename);
	return( filename );
    }
    
    var textures = {
	tBlank : THREE.ImageUtils.generateDataTexture (1024,1024, 0),
	tBackground : loadTexture(  fileNamefromName('Background', false ) ),
	tAker : loadTexture( fileNamefromName('Aker', true ) ),
	tAnubis : loadTexture( fileNamefromName('Anubis', true ) ),
	tAnuket : loadTexture( fileNamefromName('Anuket', true ) ),
	tApis : loadTexture( fileNamefromName('Apis', true ) ),
	tAsh : loadTexture( fileNamefromName('Ash', true ) ),
	tAten : loadTexture( fileNamefromName('Aten', true ) ),
	tAtum : loadTexture( fileNamefromName('Atum', true ) ),
	tBabi : loadTexture( fileNamefromName('Babi', true ) ),
	tBastet : loadTexture( fileNamefromName('Bastet', true ) ),
	tHapi : loadTexture( fileNamefromName('Hapi', true ) ),
	tHathor : loadTexture( fileNamefromName('Hathor', true ) ),
	tHatmethit : loadTexture( fileNamefromName('Hatmethit', true ) ),
	tImothep : loadTexture( fileNamefromName('Imothep', true ) ),
	tKhepry : loadTexture( fileNamefromName('Khepry', true ) ),
	tMaat : loadTexture( fileNamefromName('Maat', true ) ),
	tMaftet : loadTexture( fileNamefromName('Maftet', true ) ),
	tNut : loadTexture( fileNamefromName('Nut', true ) ),
	tSerqet : loadTexture( fileNamefromName('Serqet', true ) ),
	tSeth : loadTexture( fileNamefromName('Seth', true ) )
    };

    return(textures);
}

