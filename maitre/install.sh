#!/bin/bash

#Prérequis : make, libx11-dev

if [ "$(whoami)" != "root" ];
then
  echo "Veuillez lancer ce script en root (en utilisant sudo, par exemple)."
  exit -1
fi

cd softs_linux

# ExifTool
PKG_OK=$(dpkg-query -W --showformat='${Status}\n' libimage-exiftool-perl|grep "install ok installed")
echo Checking for ExifTool: $PKG_OK
if [ "" == "$PKG_OK" ]; then
  echo "No ExifTool found. Setting it up."
  tar xzvf Image-ExifTool-9.82.tar.gz
  cd Image-ExifTool-9.82
  perl Makefile.PL
  sudo make install
  cd ..
fi

# MongoDB
PKG_OK=$(dpkg-query -W --showformat='${Status}\n' mongodb|grep "install ok installed")
echo Checking for MongoDB: $PKG_OK
if [ "" == "$PKG_OK" ]; then
  echo "No MongoDB found. Setting it up."
  tar xzvf mongodb-linux-x86_64-3.0.2.tar.gz

  # ajout du chemin d'installation de MongoDB au PATH
  echo "# ajout du chemin d installation de MongoDB au PATH" >> ~/.bash_profile
  echo PATH="$PATH:$(pwd)/mongodb-linux-x86_64-3.0.2/bin" >> ~/.profile
  PATH="$PATH:$(pwd)/mongodb-linux-x86_64-3.0.2/bin"
  export PATH
fi
if [ ! -d "/data/db" ]; then #creates folder if not existing already
  mkdir /data
  mkdir /data/db
  chmod -R 777 /data/db
fi



#node.js
PKG_OK=$(dpkg-query -W --showformat='${Status}\n' nodejs|grep "install ok installed")
echo Checking for nodejs: $PKG_OK
if [ "" == "$PKG_OK" ]; then
  echo "No node.js found. Setting it up."
  tar xzvf node-v0.12.2-linux-x64.tar.gz
  
  # ajout du chemin d'installation de nodejs au PATH
  echo "# ajout du chemin d installation de nodejs au PATH" >> ~/.bashrc
  echo PATH="$PATH:$(pwd)/node-v0.12.2-linux-x64/bin" >> ~/.bashrc
  export PATH="$PATH:$(pwd)/node-v0.12.2-linux-x64/bin"
fi

chmod -R 777 *

echo "Installation terminée, vous pouvez lancer \"lancement.bat\""
