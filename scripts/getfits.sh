for i in `seq $1 $2`; do curl -o navcam_$i.fit  -# `curl -s http://imagearchives.esac.esa.int/picture.php?/$i/category/$3|perl -ne 'while(/http.*?\.FIT/g){print "$&\n";}'`;done

