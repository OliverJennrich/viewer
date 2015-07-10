# resizes and decorates the images
for i in *.png; do convert -resize 252x252  -bordercolor white -border 2 $i ${i%.png}_256_f.png; done
