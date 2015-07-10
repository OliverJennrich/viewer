// CAUTION: This file ie only needed for documentation purposes. It does nothing but constraining information
// about the model. DO NOT INCLUDE THIS FILE.

/*! \file

  \brief Describes how to obtain the NavCam images

  ## Do not panic

  This is  material that is *not required* to read. The viewer
  package has all the necessary files on board. This documentation is
  meant for those who either want to relive the experience of
  building things from scracth or need to add more files to the viewer.

  So if you want to skip the rest of this page, you are welcome to do so.

  ## Overview

  The viewer displays the NavCam images in thumbnails in
  the upper left corner as soon as one of the position indicators is
  clicked.  The images are stored as PNG-files in the directory
  `images/256` of the viewer package. To save space, the files have
  been reduced to 256x256 pixel; to increae the visibility of the
  mainly black images on the equally black background, they have been
  decorated with a narrow white frame.

  A typical image is shown below with a narrow black frame to emphasize the white frame that surrounds the image:

  <img SRC="../../images/256/ROS_CAM1_20140815T020718F_256_f.png" style="width:256px; border: 1px solid black;">

  ## Obtaining the images

  All the images are taken from the [ESA image archive
  browser](http://imagearchives.esac.esa.int/). As the image archive
  browser does not yet support bulk downloading of images, a number of
  helper scripts are needed to facilitate the downloading of
  theimages.

  ### Downloading the images

  To download the images, it is first needed to identify the numerical
  ID of the image (or the range of numerical ID,
  respectively). Staying with the example image from above, it can be
  found on the image archive browser by navigating to `Home / ROSETTA
  / NAVCAM / Comet phase / Prelanding phase / PRELANDING MTP006`
  through clocking on the respective image directories. Hovering over
  the first image in that directory, the status bar of the browser
  identifies the URL for that image, which is
  [http://imagearchives.esac.esa.int/picture.php?6791/category/63](http://imagearchives.esac.esa.int/picture.php?6791/category/63). Scrolling
  all the way down to the last image of that directory, the URL can be
  found to be
  [http://imagearchives.esac.esa.int/picture.php?7560/category/63](http://imagearchives.esac.esa.int/picture.php?7560/category/63). You
  might need to click a number of times on the 'See the following nnn
  pictures' link at the bottom of the page.


  From this exercise we take that the images from the prelanding phase
  MTP006 are stored in category 63 and have the numerical ID ranging
  from 6791 to 7560.

  To download those pictures through a script, we make use of the
  [`curl` utility](http://curl.haxx.se/) that is available for all
  relevant operating systems. With the help of this tool, we can execute the following shell command

        for i in `seq 6791 7560`; do curl -o navcam_$i.png -# "http://imagearchives.esac.esa.int/action.php?id=$i&part=e&download"; done

  which will download the images in that range from the image archive
  and stores them as files named `navcam_<number>.png`. The same will
  be achieved by using the convenience script `getnavcam.sh` that can
  be found im te `scripts/` folder of the package.

       sh getnavcam.sh 6791 7560

  ## Obtaining the FITS files

  Unfortunately, the image files do not carry any metadata such as the
  time of the observation. These data are stored in FITS files that
  have to be obtained through a similar process. As the name of the
  FITS file can be found on the webpage that offers the image file for
  manual download, we can cascade two calls to `curl`

      for i in `seq 6791 7560`; do curl -o navcam_$i.fit -# \
      `curl -s http://imagearchives.esac.esa.int/picture.php?/$i/category/63|perl -ne 'while(/http.*?\.FIT/g){print "$&\n";}'`;done

  It is here where the category ID is required as well. This command
  downloads the appropriate FITS files to the current directory, named
  `navcam_<number>.fits`.

  The conveninece script for this command is called `getfits.sh`, can be found in the `scripts` folder and can is called as

      sh getfits.sh  6791 7560 63

  Do not forget to provide the category code to the script!

  It is *highly recommended* to create different directories for the images and the FITS files.


  ## Using the FITS files to rename the Navcam files

  Needs to be written. Mathematica script etc. Maybe do a perls script instead?


  ## Finishing things off.

  Up to this point in the pipeline, the images still have their
  original size and lack the frame. To help with both issues, the
  `convert` command in the [ImageMagick](http://www.imagemagick.org)
  tool.It allows to reduce the size of a file and add a border of a specified color. 

       for i in *.png; do convert -resize 252x252  -bordercolor white -border 2 $i ${i%.png}_256_f.png; done

  This assumes all the relevant fiels still being of format PNG. It
  converts to a size of 252x252 pixel, adds a border of 2 pixels all
  the way around (ending up with an image of size 256x256) and wirting
  it out into a file of same name but with `_256_f` attached.

  The convenience script `resize.sh` can be found in the `scripts/` folder.

       sh resize.sh

  No parameters needed.
*/

