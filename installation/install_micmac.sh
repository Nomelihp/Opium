#!/bin/sh

# il faudra ajouter une variable cheminInstallation pour copier micmac au bon endroit avec OPium
# du style /opt/opium/micmac

# faire une version autonome avec versions telechargees plutot que apt-get install

sudo apt-get install make
sudo apt-get install imagemagick
sudo apt-get install cmake
sudo apt-get install libx11-dev

# Exif tool
tar xzvf Image-ExifTool-9.82.tar.gz
cd Image-ExifTool-9.82
perl Makefile.PL
make test
sudo make install
cd ..

# expat
tar xzvf expat-2.1.0.tar.gz
cd expat-2.1.0
./configure
make
sudo make install
cd ..

# exiv
tar xzvf exiv2-0.24.tar.gz
cd exiv2-0.24
./configure
make
sudo make install
cd ..

# proj 4
tar xzvf proj-4.9.1.tar.gz
cd proj-4.9.1
./configure
make
sudo make install
cd ..

# MIC MAC
# poru que le cmake passe, il faut changer à la main le fichier 
tar xzvf culture3d-38eb29ce21ae.tar.gz
cp HG_defines.h culture3d-38eb29ce21ae/include/general/
cd culture3d-1dc6ed0163c5/

mkdir build
cd build
cmake ../
NBRP=$(cat /proc/cpuinfo | grep processor | wc -l)
echo "Nbre de coeurs à la compilation : " $NBRP
make install -j$NBRP
cd ..
cd ..

# ajout du chemin d'installation de MicMac au PATH
echo "# ajout du chemin d installation de MicMac au PATH" >> ~/.bashrc
echo PATH='$PATH':$(pwd)/culture3d-38eb29ce21ae/bin/ >> ~/.bashrc

