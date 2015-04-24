#!/bin/bash

#Prérequis : make, libx11-dev

if [ "$(whoami)" != "root" ];
then
  echo "Veuillez lancer ce script en root (en utilisant sudo, par exemple)."
  exit -1
fi

echo "Pour quel utilisateur ce programme doit-il être installé ?"
read user

#vérification des prérequis
PKG_OK=$(dpkg-query -W --showformat='${Status}\n' make | grep "install ok installed")
echo "Recherche de make: $PKG_OK"
if [ "" == "$PKG_OK" ];
then
  echo "Erreur : pas de version de make trouvée."
  echo "Veuillez installer make, avec 'apt-get install make' par exemple." #et s'il n'a pas apt-get, c'est un gros geek, donc il comprendra quand même.
  exit 1
fi

PKG_OK=$(dpkg-query -W --showformat='${Status}\n' libx11-dev|grep "install ok installed")
echo Checking for libx11-dev: $PKG_OK
if [ "" == "$PKG_OK" ]; then
   echo "Erreur : pas de version de libx11-dev trouvée."
  echo "Veuillez installer libx11-dev, avec 'apt-get install libx11-11' par exemple."
  exit 2
fi

cd softs_linux

#La partie discussion avec l'utilisateur
isThereMicMac=""
doYouWantToUseYourOwnMicMac=""

while [ "N" != "$isThereMicMac" ] && [ "O" != "$isThereMicMac" ]; do
  echo ""
  echo "MicMac est-il déjà installé sur cet ordinateur ? {O/N}"
  read isThereMicMac
done

if [ "O" == "$isThereMicMac" ];
then
  while [ "N" != "$doYouWantToUseYourOwnMicMac" ] && [ "O" != "$doYouWantToUseYourOwnMicMac" ]; do
    echo "Voulez-vous utiliser le MicMac datant du 23 avril 2015 de ce paquet ? {O/N}"
    read doYouWantToUseYourOwnMicMac
  done
  
  if [ "O" = "$doYouWantToUseYourOwnMicMac" ]; then
    echo "Quel est le chemin absolu vers le dossier bin de MicMac {exemple /home/user/Micmac/bin} ?"
    read micMacPath 
  fi   
fi

echo "Quelle est l'adresse IP de l'ordinateur maître ? {ex: 135.65.65.3, laissez vide si le maître est sur le même ordinateur}"
read ipMaitre
if [ "" == "$ipMaitre" ]; then
  ipMaitre="127.0.0.1" #localhost
fi

#cmake
PKG_OK=$(dpkg-query -W --showformat='${Status}\n' cmake|grep "install ok installed")
echo C"Recherche de cmake: $PKG_OK"
if [ "" == "$PKG_OK" ]; then
  echo "Pas version de cmake trouvée. Installation."
  tar xzvf cmake-3.2.2-Linux-x86_64.tar.gz
  
  # ajout du chemin d'installation de cmake au PATH
  echo "# ajout du chemin d installation de cmake au PATH" >> "/home/$user/.bashrc"
  echo PATH='$PATH':$(pwd)/cmake-3.2.2-Linux-x86_64/bin >> "/home/$user/.bashrc"
  path2cmake=$(pwd)/cmake-3.2.2-Linux-x86_64/bin
fi


#node.js
PKG_OK=$(dpkg-query -W --showformat='${Status}\n' nodejs|grep "install ok installed")
echo "Recherche de nodejs: $PKG_OK"
if [ "" == "$PKG_OK" ]; then
  echo "Pas de version de nodejs trouvée. Installation."
  tar xzvf node-v0.12.2-linux-x64.tar.gz
  
  # ajout du chemin d'installation de nodejs au PATH
  echo "# ajout du chemin d installation de nodejs au PATH" >> "/home/$user/.bashrc"
  echo PATH='$PATH':$(pwd)/node-v0.12.2-linux-x64/bin >> "/home/$user/.bashrc"
fi

# ImageMagick
PKG_OK=$(dpkg-query -W --showformat='${Status}\n' imagemagick|grep "install ok installed")
echo "Recherche d'ImageMagick: $PKG_OK"
if [ "" == "$PKG_OK" ]; then
  echo "Pas de version d'ImageMagick trouvée. Installation."
  tar xzvf ImageMagick-6.7.7-0.tar.gz
  cd ImageMagick-6.7.7-0
  ./configure
  make
  sudo make install
  cd ..
fi


# ExifTool
PKG_OK=$(dpkg-query -W --showformat='${Status}\n' libimage-exiftool-perl|grep "install ok installed")
echo "Recherche d'ExifTool: $PKG_OK"
if [ "" == "$PKG_OK" ]; then
  echo "Pas de version d'ExifTool trouvée. Installation."
  tar xzvf Image-ExifTool-9.82.tar.gz
  cd Image-ExifTool-9.82
  perl Makefile.PL
  sudo make install
  cd ..
fi

# expat
PKG_OK=$(dpkg-query -W --showformat='${Status}\n' expat|grep "install ok installed")
echo "Recherche d'Expat: $PKG_OK"
if [ "" == "$PKG_OK" ]; then
  cho "Pas de version d'Expat trouvée. Installation."
  tar xzvf expat-2.1.0.tar.gz
  cd expat-2.1.0
  ./configure
  make
  sudo make install
  cd ..
fi

# exiv
PKG_OK=$(dpkg-query -W --showformat='${Status}\n' exiv2|grep "install ok installed")
echo "Recherche d'Exiv: $PKG_OK"
if [ "" == "$PKG_OK" ]; then
  echo "Pas de version d'Exif trouvée. Installation."
  tar xzvf exiv2-0.24.tar.gz
  cd exiv2-0.24
  ./configure
  make
  sudo make install
  cd ..
fi

# proj 4
PKG_OK=$(dpkg-query -W --showformat='${Status}\n' libgeo-proj4-perl|grep "install ok installed")
echo "Recherche de proj4: $PKG_OK"
if [ "" == "$PKG_OK" ]; then
  echo "Pas de version de proj4 trouvée. Installation."
  tar xzvf proj-4.9.1.tar.gz
  cd proj-4.9.1
  ./configure
  make
  sudo make install
  cd ..
fi

#MicMac
if [ "O" != "$doYouWantToUseYourOwnMicMac" ]; then
  # pour que le cmake passe, il faut changer à la main le fichier 
  tar xzvf micmac.tar.gz
  cp HG_defines.h micmac/include/general/
  cd micmac/

  mkdir build
  cd build
  $path2cmake/cmake ../
  NBRP=$(cat /proc/cpuinfo | grep processor | wc -l)
  echo "Nombre de coeurs à la compilation : " $NBRP
  make install -j$NBRP
  cd ../..

  micMacPath=$(pwd)/micmac/bin/

  # ajout du chemin d'installation de MicMac au PATH
  echo "# ajout du chemin d installation de MicMac au PATH" >> "/home/$user/.bashrc"
  echo PATH='$PATH':micMacPath >> ~/.bashrc
fi

cd ..
echo "{" >> $(pwd)/config_esclave.json
  echo \"maitre_ip\":\"$ipMaitre\", >> $(pwd)/config_esclave.json
  echo \"maitre_port\":\"9207\", >> $(pwd)/config_esclave.json
  echo \"esclave_port\":\"9208\", >> $(pwd)/config_esclave.json
  echo \"repertoire_micmac\":\"$micMacPath\", >> $(pwd)/config_esclave.json
  echo \"img_micmac_esclave\":\"$(pwd)/img_micmac\" >> $(pwd)/config_esclave.json
  echo "}" >> $(pwd)/config_esclave.json
echo Merci, vous pouvez lancer \"lancement.sh\"

chmod -R 777 *
