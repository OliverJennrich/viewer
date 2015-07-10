# change the numbers in the 'seq'

for i in `seq $1 $2`; do echo curl -o navcam_$i.png -# "http://imagearchives.esac.esa.int/action.php?id=$i&part=e&download"; done
