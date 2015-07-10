# shell script to create the documentation
#
# first, run the javascript-to-doxygen script
# not needed anymore. Use INPIT_FILTER insteand.

#(cd js; for i in *.js ; do perl ~/bin/js2doxy.pl < $i > ../cpp/${i%js}cpp; done)

#
# get the git revision number for the documentation
#
branch=`git branch | grep '*'| cut -f2 -d\ `
number=`git describe --always`


#
# create a config file and run doxygen
#
(cat viewer.cfg ; echo "PROJECT_NUMBER=Revision: $branch-$number") | doxygen - > /dev/null
