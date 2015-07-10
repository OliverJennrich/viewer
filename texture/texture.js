// CAUTION: This file ie only needed for documentation purposes. It does nothing but constraining information
// about the model. DO NOT INCLUDE THIS FILE.
/*!
 \file 

\brief Documentation regarding the textures

 ## Do not panic

  This is  material that is *not required* to read. The viewer
  package has all the necessary files on board. This documentation is
  meant for those who either want to relive the experience of
  building things from scracth or need to add more files to the viewer.

  So if you want to skip the rest of this page, you are welcome to do so.

## Overview

The textures for the default model of the comet are, similar to the
 comet, taken from *Mattias Malmer's*
 [website](http://mattias.malmer.nu/). The texture provided on the
 website is colorised, split into several layers (with the help of Adobe PS) and
 annotated. Furthermore, it is reduced from its original dimension to
 1024x1024 pixels.

All the textures can be found in the `texture/Small` folder of the
viewer package. The viewer expects the textures to be in this
directory and currently the directory is hard-coded to the program. If
this needs to be changed, please look into the code of `init()` for
the call to 'createTextures()`.

## Background texture

The background texture is used for the default surface of the
comet. It is a pure grayscale file in png format and contains all the
regions including the places that cover the undefined parts of the
model.

![Default comet texture](texture_Background_s.png)

## Colorised textures 

To be able to identify the different regions on the comet, the
original texture file has been colorised according to the 'official'
map of the comment as published in <i>Science 23 January 2015:Vol. 347
no. 6220 aaa0440</i> (left column of the following table).  The
resulting texture file before the separation into layers is given in
the middle column of the table.
 
To be able to use the blending mechanism, the texture file is
separated into different layers, each containing a single coloured
region, labeled with the name and the background filled with pure
white. For clarity, a black frame is given to the texture (right column).


<table style="border: 0px">
  <tr>
    <td>
      <img SRC="http://www.sciencemag.org/content/347/6220/aaa0440/F1.large.jpg" style="width:90%">
    </td>
    <td>
       <img SRC="../../texture/All/texture_All_Text_s.png" style="width:90%">
    </td>
    <td>
       <img SRC="../../texture/Small/texture_Anubis_Text_s.png" style="width:90%; border: 1px solid black;">
    </td>
</tr>
<tr>
  <td style="text-align:center">
     Colour map from Science
    </td>
    <td style="text-align:center">
    Coloured textures
    </td>
    <td style="text-align:center">
       Example of a region texture ('uniform')
    </td>
</table>




*/
