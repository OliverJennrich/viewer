// CAUTION: This file ie only needed for documentation purposes. It does nothing but containing information
// about the model. DO NOT INCLUDE THIS FILE.
/*!
 \file 
 \brief Documentation on how to obtain the model and how to convert it to be used with the viewer.
 
 ## Do not panic

  This is  material that is *not required* to read. The viewer
  package has all the necessary files on board. This documentation is
  meant for those who either want to relive the experience of
  building things from scracth or need to add more files to the viewer.

  So if you want to skip the rest of this page, you are welcome to do so.

 ## Obtaining the shape model

 There are various comet models available. The current version of
 the viewer uses a model created by *Mattias Malmer* and can be found
 (including the textures) at his
 [website](http://mattias.malmer.nu/). 

Most of the models, including the model by Malmer, have a level of
detail that far exceeds the needs of this viewer and causes
unnecessary load time for the viewer. Therefore some reduction of the
number of vertices is useful. This can be done with a number of open
source programs, for the preparation of the models for the viewer
[Meshlab](http://meshlab.sourceforge.net/) was used.

### Reducing the model with Meshlab

Reducing the model with Meshlab is relatively easy. Load the model
file in Meshlab via 

>  File > Import Mesh

and use 

>  Filters > Remeshing, Simplification and Construction > Quadric Edge Collapse Decimation (with Texture)

reduce the number of vertices. Entering e.g. 0.1 in the 'percentage
reduction' field will reduce the number of vertices by a factor of
10. The actual reduction ration will depend on the level of detail of
the model, with the current model a reduction of 0.1 has been
used. Future models with more details might require a higher reduction
ratio.

Save the new file under a different name  via  

>   File > Export Mesh


(don't forget to check Normals and Materials).

See also a more elaborate tutorial
[here](http://spriceinteractive.com/blog/polygon-count-reduction-with-meshlab/)
or enjoy a short [video tutorial](https://www.youtube.com/watch?v=w_r-cT2jngk).


## Converting the model to a JSON object

 Conversion of the model is done with the help of the
 convert_obj_three.py script. This script is part of the THREE.js
 package, but needs to be slightly modified for the purposes of
 converting Meshlab generated OBJ files. for some reason, MESHLAB
 writes OBJ files that have 6 coordinates per vertex instead of the
 expected 3, i.e. the lines describing the vertices look like

     v -325.316406 -1062.986328 918.800781 0.752941 0.752941 0.752941

 instead of the expected

     v -325.316406 -1062.986328 918.800781

 The solution is to either delete those additional columns manually
 (or via a perl script), or by modifying the original script. Here,
 we chose the latter method by adapting the original script. Changing the line

     if chunks[0] == "v" and len(chunks) == 4:

 to

     if chunks[0] == "v" and len(chunks) >= 4:

 allows the script to cope with the additional input columns. The modified script is provided in the `scripts/` directory.

\warning *Do not use the original script as it will fail. Always use the modified script or better the `convert_obj` script (see below)*


 The script is then run to produce the JSON object
 
     python convert_obj_three.py -i inputfile -a center -o outputfile

 As the JSON object needs to be cast into a variable, the following refinement is useful

     python convert_obj_three.py -i inputfile -a center -o tmp && echo "var comet=" |cat - tmp > outputfile && rm tmp

### Convenience script

This approach is supported by the shell script `convert_obj` in the `scripts/` folder which accepts the input file and the outputfile as parameters

    convert_obj inputfile outputfile

Using this script for conversion is *highly recommended*.

 \var comet
 \brief Contains the shape model of the comet
*/

var comet;
